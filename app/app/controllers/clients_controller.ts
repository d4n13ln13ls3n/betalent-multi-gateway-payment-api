import type { HttpContext } from '@adonisjs/core/http'
import Client from '#models/client'
import logger from '@adonisjs/core/services/logger'

export default class ClientsController {
  async index({ response }: HttpContext) {
    try {
      const clients = await Client.all()
      return response.ok({ data: clients })
    } catch (error) {
      logger.error(`[ClientsController] Failed to retrieve clients list: ${error.message}`)
      return response.internalServerError({ message: 'Failed to retrieve clients' })
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const client = await Client.query()
        .where('id', params.id)
        .preload('transactions', (transactionsQuery) => {
          transactionsQuery.preload('gateway').preload('products')
        })
        .firstOrFail()

      return response.ok({ data: client })
    } catch (error) {
      logger.warn(`[ClientsController] Client search failed. ID not found: ${params.id}`)
      return response.notFound({ message: 'Client not found' })
    }
  }
}