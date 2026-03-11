import type { IGateway } from './gateway_interface.js'
import logger from '@adonisjs/core/services/logger'

export default class GatewayManager {
    constructor(private gateways: IGateway[]) {}

    async processPayment(amount: number, metadata?: any): Promise <{
        success: boolean
        gatewayIndex: number
        externalId?: string
        error?: string
    }> {
        logger.info(`[GatewayManager] Starting payment attempt in ${this.gateways.length} gateways.`)

        for (let i = 0; i < this.gateways.length; i++) {
            const gateway = this.gateways[i]
            logger.info(`[GatewayManager] Trying to process in Gateway Priority ${i + 1}`)
            
            const result = await gateway.pay(amount, metadata)

            if (result.success) {
                logger.info(`[GatewayManager] Payment APPROVED in Gateway Priority ${i + 1}`)
                return {
                    success: true,
                    gatewayIndex: i,
                    externalId: result.externalId,
                }
            }

            logger.warn(`[GatewayManager] Gateway Priority ${i + 1} REFUSED or FAILED: ${result.error}. Trying fallback...`)
        }

        logger.error('[GatewayManager] FATAL ERROR: All gateways failed.')
        return {
            success: false,
            gatewayIndex: -1,
            error: 'All gateways failed',
        }
    }

    async processRefund(gatewayIndex: number, externalId: string) {
        logger.info(`[GatewayManager] Starting refund in gateway index ${gatewayIndex} for ID ${externalId}`)
        
        const gateway = this.gateways[gatewayIndex]
        if (!gateway) {
            logger.error(`[GatewayManager] Gateway index ${gatewayIndex} not found for.`)
            return { success: false, error: 'Gateway not found'}
        }

        const result = await gateway.refund(externalId)
        
        if (result.success) {
            logger.info(`[GatewayManager] Refund concluded successfully in the gateway.`)
        } else {
            logger.error(`[GatewayManager] Refund failed: ${result.error}`)
        }

        return result
    }
}