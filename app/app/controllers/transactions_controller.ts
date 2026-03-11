import type { HttpContext } from '@adonisjs/core/http'
import Transaction from '#models/transaction'
import PaymentService from '#services/payment_service'
import logger from '@adonisjs/core/services/logger'

export default class TransactionsController {
    async index({ response }: HttpContext) {
        try {
            const transactions = await Transaction.query()
                .preload('client')
                .preload('gateway')
                .preload('products')
                .orderBy('created_at', 'desc')

            return response.ok({
                message: 'Transactions retrieved successfully',
                data: transactions,
            })
        } catch (error) {
            return response.internalServerError({
                message: 'Failed to retrieve transactions',
            })
        }
    }

    async show({ params, response }: HttpContext) {
        try {
            const transaction = await Transaction.query()
                .where('id', params.id)
                .preload('client')
                .preload('gateway')
                .preload('products')
                .firstOrFail()

            return response.ok({ data: transaction })
        } catch (error) {
            logger.warn(`[TransactionsController] Transaction search failed. ID not found: ${params.id}`)
            return response.notFound({ message: 'Transaction not found' })
        }
    }
    
    async refund({ params, response, auth }: HttpContext) {
        try {
            const user = auth.getUserOrFail()
            logger.info(`[TransactionsController] User ${user.email} requested refund for transaction ID: ${params.id}`)

            const paymentService = new PaymentService()
            const transaction = await paymentService.processRefund(params.id)

            return response.ok({
                message: 'Refund processed successfully',
                data: {
                    transactionId: transaction.id,
                    status: transaction.status,
                },
            })
        } catch (error) {
            if (error.message === 'Transaction already refunded') {
                logger.warn(`[TransactionsController] Refund attempt denied: Transaction ID ${params.id} already refunded.`)
                return response.badRequest({ message: error.message })
            }

            if (error.code === 'E_ROW_NOT_FOUND') {
                logger.warn(`[TransactionsController] Refund attempt denied: Transaction ID ${params.id} does not exist.`)
                return response.notFound({ message: 'Transaction not found' })
            }

            logger.error(`[TransactionsController] Critical error refunding transaction ID ${params.id}: ${error.message}`)
            return response.internalServerError({
                message: error.message || 'Refund failed',
            })
        }
    }
}