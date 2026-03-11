import app from '@adonisjs/core/services/app'
import { type HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'

export default class HttpExceptionHandler extends ExceptionHandler {
  protected debug = !app.inProduction

  async handle(error: unknown, ctx: HttpContext) {
    return super.handle(error, ctx)
  }

  async report(error: unknown, ctx: HttpContext) {
    if (this.shouldReport(error as any)) {
      logger.error(`[GlobalErrorHandler] Exception not handled in route ${ctx.request.url()}: ${(error as any).message}`)
    }

    return super.report(error, ctx)
  }
}