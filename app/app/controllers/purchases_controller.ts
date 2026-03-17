import type { HttpContext } from '@adonisjs/core/http'
import PaymentService from '#services/payment_service'
import { purchaseValidator } from '#validators/purchase_validator'
import logger from '@adonisjs/core/services/logger'

export default class PurchasesController {
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(purchaseValidator)

    logger.info(`[PurchasesController] Purchase request for client ${payload.clientId}`)

    const paymentService = new PaymentService()
    const transaction = await paymentService.processPurchase(payload)

    return response.created({
      data: {
        transactionId: transaction.id,
        amount: transaction.totalAmount,
        status: transaction.status,
        gatewayId: transaction.gatewayId,
        externalId: transaction.externalId,
      },
    })
  }
}