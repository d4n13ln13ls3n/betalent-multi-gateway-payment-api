import type { IGateway } from './gateway_interface.js'
import logger from '@adonisjs/core/services/logger'
import { AppError } from '#exceptions/app_error'

export default class GatewayManager {
  constructor(private gateways: IGateway[]) {}

  async processPayment(
    amount: number,
    metadata?: any
  ): Promise<{
    success: boolean
    gatewayIndex: number
    externalId?: string
  }> {
    logger.info(
      `[GatewayManager] Starting payment attempt in ${this.gateways.length} gateways.`
    )

    for (let i = 0; i < this.gateways.length; i++) {
      const gateway = this.gateways[i]

      logger.info(`[GatewayManager] Trying Gateway Priority ${i + 1}`)

      try {
        const result = await gateway.pay(amount, metadata)

        if (result.success) {
          logger.info(
            `[GatewayManager] Payment APPROVED in Gateway Priority ${i + 1}`
          )

          return {
            success: true,
            gatewayIndex: i,
            externalId: result.externalId,
          }
        }

        logger.warn(
          `[GatewayManager] Gateway Priority ${i + 1} refused. Trying fallback...`
        )
      } catch (error) {
        logger.error(
          `[GatewayManager] Gateway Priority ${i + 1} threw error. Trying fallback...`
        )
      }
    }

    logger.error('[GatewayManager] All gateways failed')

    return {
      success: false,
      gatewayIndex: -1,
    }
  }

  async processRefund(gatewayIndex: number, externalId: string) {
    logger.info(
      `[GatewayManager] Starting refund in gateway index ${gatewayIndex} for ID ${externalId}`
    )

    const gateway = this.gateways[gatewayIndex]

    if (!gateway) {
      throw new AppError('Gateway not found', 404, 'GATEWAY_NOT_FOUND')
    }

    try {
      const result = await gateway.refund(externalId)

      if (result.success) {
        logger.info(`[GatewayManager] Refund successful`)
        return result
      }

      logger.error(`[GatewayManager] Refund failed`)
      return result
    } catch {
      throw new AppError('Refund failed due to gateway error', 502, 'REFUND_FAILED')
    }
  }
}