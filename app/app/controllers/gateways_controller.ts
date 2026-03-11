import type { HttpContext } from '@adonisjs/core/http'
import Gateway from '#models/gateway'
import { updateStatusValidator, updatePriorityValidator } from '#validators/gateway_validator'
import logger from '@adonisjs/core/services/logger'

export default class GatewaysController {
    async index ({ response }: HttpContext) {
        try {
            const gateways = await Gateway.query().orderBy('priority', 'asc')
            return response.ok({ data: gateways })
        } catch (error) {
            return response.internalServerError({ message: 'Failed to find gateways'})
        }
    }

    async updateStatus({ params, request, response }: HttpContext) {
        try {
            const gateway = await Gateway.findOrFail(params.id)
            const payload = await request.validateUsing(updateStatusValidator)

            gateway.isActive = payload.is_active
            await gateway.save()

            logger.info(`[GatewaysController] Gateway '${gateway.name}' Status changed to Active: ${gateway.isActive}`)

            return response.ok({
                message: 'Gateway status updated successfully',
                data: gateway,
            })
        } catch (error) {
            if (error.code === 'E_ROW_NOT_FOUND') {
                return response.notFound({ message: 'Gateway not found'})
            }
            console.log('ERRO DE VALIDAÇÃO:', error) 

            return response.badRequest({ message: 'Validation failed', errors: error.messsages })
        }
    }

    async updatePriority({ params, request, response }: HttpContext) {
        try {
            const gateway = await Gateway.findOrFail(params.id)
            const payload = await request.validateUsing(updatePriorityValidator)

            gateway.priority = payload.priority
            await gateway.save()

            logger.info(`[GatewaysController] Gateway '${gateway.name}' Priority changed to ${gateway.priority}`)

            return response.ok({
                message: 'Gateway priority updated successfully',
                data: gateway,
            })
        } catch (error) {
            if (error.code === 'E_ROW_NOT_FOUND') {
                return response.notFound({ message: 'Gateway not found'})
            }
            console.log('ERRO DE VALIDAÇÃO:', error) 
            return response.badRequest({ message: 'Validation failed', errors: error.messsages })
        }
    }
}