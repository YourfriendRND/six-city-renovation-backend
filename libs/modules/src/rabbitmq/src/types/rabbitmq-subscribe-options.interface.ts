export interface RabbitMQSubscribeOptionsInterface {
  queue: string;
  exchange?: string;
  routingKey?: string;
  createQueueIfNotExist?: boolean;
  durable?: boolean;
}
