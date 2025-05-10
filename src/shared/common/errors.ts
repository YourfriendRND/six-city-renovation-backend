export function createNotFoundExampleError(message: string) {
  return {
    message,
    error: 'Not Found',
    statusCode: 404,
  };
}
