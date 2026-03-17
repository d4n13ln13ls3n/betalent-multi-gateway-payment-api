import type { HttpContext } from '@adonisjs/core/http'
import Transaction from '#models/transaction'
import PaymentService from '#services/payment_service'
import logger from '@adonisjs/core/services/logger'
import { AppError } from '#exceptions/app_error'

export default class TransactionsController {
  async index({ response }: HttpContext) {
    const transactions = await Transaction.query()
      .preload('client')
      .preload('gateway')
      .preload('products')
      .orderBy('created_at', 'desc')

    return response.ok({ data: transactions })
  }

  async show({ params, response }: HttpContext) {
    const transaction = await Transaction.query()
      .where('id', params.id)
      .preload('client')
      .preload('gateway')
      .preload('products')
      .firstOrFail()

    return response.ok({ data: transaction })
  }

  async refund({ params, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()

    logger.info(`[TransactionsController] Refund requested by ${user.email}`)

    const paymentService = new PaymentService()

    try {
      const transaction = await paymentService.processRefund(params.id)

      return response.ok({
        data: {
          transactionId: transaction.id,
          status: transaction.status,
        },
      })
    } catch (error: any) {
      if (error.message === 'Transaction already refunded') {
        throw new AppError(error.message, 400, 'ALREADY_REFUNDED')
      }

      throw error
    }
  }
}