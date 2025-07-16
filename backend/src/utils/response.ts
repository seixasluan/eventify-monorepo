export function successResponse(data: any) {
  return {
    success: true,
    data,
  };
}

export function errorResponse(message: string, code?: string) {
  return {
    success: false,
    error: {
      message,
      code,
    },
  };
}
