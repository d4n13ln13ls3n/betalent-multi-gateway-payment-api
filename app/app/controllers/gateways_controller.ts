import type { HttpContext } from '@adonisjs/core/http'
import Gateway from '#models/gateway'
import { updateStatusValidator, updatePriorityValidator } from '#validators/gateway_validator'
import logger from '@adonisjs/core/services/logger'

export default class GatewaysController {
  async index({ response }: HttpContext) {
    const gateways = await Gateway.query().orderBy('priority', 'asc')
    return response.ok({ data: gateways })
  }

  async updateStatus({ params, request, response }: HttpContext) {
    const gateway = await Gateway.findOrFail(params.id)
    const payload = await request.validateUsing(updateStatusValidator)

    gateway.isActive = payload.is_active
    await gateway.save()

    logger.info(`[GatewaysController] Gateway ${gateway.id} status updated`)

    return response.ok({ data: gateway })
  }

  async updatePriority({ params, request, response }: HttpContext) {
    const gateway = await Gateway.findOrFail(params.id)
    const payload = await request.validateUsing(updatePriorityValidator)

    gateway.priority = payload.priority
    await gateway.save()

    logger.info(`[GatewaysController] Gateway ${gateway.id} priority updated`)

    return response.ok({ data: gateway })
  }
}