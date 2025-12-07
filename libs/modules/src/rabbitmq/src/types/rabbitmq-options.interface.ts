interface RabbitExchangeConfig {
    name: string;
    type: string;
}

export interface RabbitMQOptionsModuleInterface {
    exchanges: RabbitExchangeConfig[];
}
