export interface RpcSuccessResponse<T> {
  data: T;
  timestamp: Date;
  success: true;
}

export interface RpcErrorResponse {
  exception: {
    error: string;
    message: string;
    statusCode: number;
  };
  success: false;
  timestamp: Date;
}
