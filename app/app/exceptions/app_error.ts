export class AppError extends Error {
  constructor(
    public message: string,
    public status: number = 400,
    public code: string = 'APP_ERROR',
    public details?: any
  ) {
    super(message)
  }
}