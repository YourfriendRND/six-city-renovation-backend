import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  DiscoveredMethodWithMeta,
  DiscoveryService,
} from '@golevelup/nestjs-discovery';
import { ModuleRef } from '@nestjs/core';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { RABBIT_SUBSCRIBE_METADATA } from './decorators/rabbit-subscribe.decorator';
import { RabbitMQSubscribeOptionsInterface } from './types';

@Injectable()
export class RabbitMQSubscribeService implements OnModuleInit {
  private readonly logger = new Logger(RabbitMQSubscribeService.name);

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly moduleRef: ModuleRef,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  async onModuleInit() {
    const providers =
      await this.discoveryService.providerMethodsWithMetaAtKey<RabbitMQSubscribeOptionsInterface>(
        RABBIT_SUBSCRIBE_METADATA,
      );

    const controllers =
      await this.discoveryService.controllerMethodsWithMetaAtKey<RabbitMQSubscribeOptionsInterface>(
        RABBIT_SUBSCRIBE_METADATA,
      );

    const allSubscribers = [...providers, ...controllers];

    this.logger.log(`Found ${allSubscribers.length} RabbitMQ subscribers`);

    for (const subscriber of allSubscribers) {
      await this.setupProviderSubscription(subscriber);
    }
  }

  private async setupProviderSubscription(
    subscriber: DiscoveredMethodWithMeta<RabbitMQSubscribeOptionsInterface>,
  ): Promise<void> {
    const { meta, discoveredMethod } = subscriber;
    const className = discoveredMethod.parentClass.name;
    const methodName = discoveredMethod.methodName;

    try {
      let instance: unknown;

      try {
        instance = await this.moduleRef.get(
          discoveredMethod.parentClass.injectType,
          { strict: false },
        );
      } catch (error) {
        this.logger.warn(
          `Could not resolve ${className} by injectType, trying by class reference...`,
        );
      }

      if (!instance) {
        try {
          instance = await this.moduleRef.get(
            discoveredMethod.parentClass.dependencyType,
            { strict: false },
          );
        } catch (error) {
          this.logger.warn(`Could not resolve ${className} by dependencyType`);
        }
      }

      if (instance) {
        await this.subscribeToQueue(
          { ...meta, className, methodName },
          instance,
        );
      } else {
        throw new Error(`Could not resolve instance for ${className}`);
      }
    } catch (err) {
      this.logger.error(
        `Failed to setup subscription for ${className}.${methodName}:`,
        err,
      );
      throw err;
    }
  }

  private async handleMessage(
    message: unknown,
    meta: RabbitMQSubscribeOptionsInterface,
    instance: unknown,
    methodName: string,
    className: string,
  ): Promise<void> {
    const InvalidMessage = `Invalid message format in ${className}.${methodName} for queue ${meta.queue}`;
    try {
      if (
        message !== null &&
        typeof message === 'object' &&
        'content' in message
      ) {
        const content = JSON.parse(message.content.toString());

        const result = await instance[methodName](content);

        if (
          'properties' in message &&
          typeof message.properties === 'object' &&
          'replyTo' in message.properties
        ) {
          this.amqpConnection.channel.sendToQueue(
            message.properties.replyTo,
            Buffer.from(JSON.stringify(result)),
            { correlationId: message.properties['correlationId'] },
          );
        } else {
          throw new Error(InvalidMessage);
        }

        this.amqpConnection.channel.ack(message);
      } else {
        throw new Error(InvalidMessage);
      }
    } catch (err) {
      this.logger.error(`Error in ${className}.${methodName}:`, err);
      this.amqpConnection.channel.nack(message, false, false);
    }
  }

  private async subscribeToQueue(
    meta: RabbitMQSubscribeOptionsInterface & {
      methodName: string;
      className: string;
    },
    instance: unknown,
  ) {
    this.logger.log(
      `Setting up subscription: ${meta.className}.${meta.methodName} to ${meta.queue}`,
    );

    if (meta.createQueueIfNotExist) {
      await this.amqpConnection.channel.assertQueue(meta.queue, {
        durable: meta.durable || false,
      });
    }

    if (meta.exchange && meta.routingKey) {
      await this.amqpConnection.channel.bindQueue(
        meta.queue,
        meta.exchange,
        meta.routingKey,
      );
    }

    await this.amqpConnection.channel.consume(
      meta.queue,
      async (message: unknown) => {
        await this.handleMessage(
          message,
          meta,
          instance,
          meta.methodName,
          meta.className,
        );
      },
      { noAck: false },
    );

    this.logger.log(`Successfully subscribed to queue: ${meta.queue}`);
  }
}
