const hasMessage = (error: {
  message?: unknown;
}): error is { message: unknown } => {
  return 'message' in error;
};
export const isError = (error: unknown): error is { message: string } => {
  return (
    typeof error === 'object' &&
    !!error &&
    hasMessage(error) &&
    typeof error['message'] === 'string'
  );
};
