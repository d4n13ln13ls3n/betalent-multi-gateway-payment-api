import type { HttpContext } from '@adonisjs/core/http'
import PaymentService from '#services/payment_service'
import { purchaseValidator } from '#validators/purchase_validator'
import logger from '@adonisjs/core/services/logger'

export default class PurchasesController {
    async store({ request, response }: HttpContext) {
        try {
            const payload = await request.validateUsing(purchaseValidator)
            
            logger.info(`[PurchasesController] New purchase requesst received for client ID: ${payload.clientId}`)

            const paymentService = new PaymentService()
            const transaction = await paymentService.processPurchase(payload)

            logger.info(`[PurchasesController] Successful purchase. Transaction ID: ${transaction.id}`)

            return response.created({
                message: 'Purchase completed successfully',
                data: {
                    transactionId: transaction.id,
                    amount: transaction.totalAmount,
                    status: transaction.status,
                    gatewayId: transaction.gatewayId,
                    externalId: transaction.externalId,
                },
            })
        } catch (error) {
            if (error.messages) {
                logger.warn('[PurchasesController] Failed to validate payload sent.')
                return response.badRequest({
                    message: 'Validation failed',
                    errors: error.messages,
                })
            }

            logger.error(`[PurchasesController] Failed to process purchase: ${error.message}`)
            return response.internalServerError({
                message: error.message || 'Purchase failed',
            })
        }
    }
}