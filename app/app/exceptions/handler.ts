import { ExceptionHandler } from '@adonisjs/core/http'
import type { HttpContext } from '@adonisjs/core/http'
import { AppError } from './app_error.ts'

export default class HttpExceptionHandler extends ExceptionHandler {
  protected debug = false

  public async handle(error: any, ctx: HttpContext) {
    if (error instanceof AppError) {
      return ctx.response.status(error.status).send({
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      })
    }

    if (error.code === 'E_ROW_NOT_FOUND') {
      return ctx.response.status(404).send({
        error: {
          code: 'NOT_FOUND',
          message: 'Resource not found',
        },
      })
    }

    if (error.messages) {
      return ctx.response.status(400).send({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: error.messages,
        },
      })
    }

    return ctx.response.status(500).send({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Unexpected error',
      },
    })
  }
}