import Transaction from '#models/transaction'
import Product from '#models/product'
import Gateway from '#models/gateway'
import GatewayManager from '../gateways/gateway_manager.js'
import Gateway1 from '../gateways/gateway1.js'
import Gateway2 from '../gateways/gateway2.js'
import type { IGateway } from '../gateways/gateway_interface.js'
import logger from '@adonisjs/core/services/logger'

interface PurchaseData {
    clientId: number
    products: Array<{
        productId: number
        quantity: number
    }>
}

export default class PaymentService {
    async processPurchase(data: PurchaseData) {
        logger.info(`[PaymentService] Processing purchase for client ID: ${data.clientId}`)
        
        const productsData = await this.getProductsWithPrices(data.products)
        const totalAmount = this.calculateTotal(productsData)

        const gateways = await Gateway.query().where('is_active', true).orderBy('priority', 'asc')

        if (gateways.length === 0) {
            throw new Error('No active gateways available')
        }

        const gatewayInstances = this.createGatewayInstances(gateways)

        const gatewayManager = new GatewayManager(gatewayInstances)
        const paymentResult = await gatewayManager.processPayment(
            totalAmount, 
            { clientId: data.clientId }
        )

        if (!paymentResult.success) {
            throw new Error('Payment failed on all gateways')
        }

        const transaction = await Transaction.create({
            clientId: data.clientId,
            gatewayId: gateways[paymentResult.gatewayIndex].id,
            totalAmount,
            status: 'completed',
            externalId: paymentResult.externalId,
        })

        await transaction.related('products').attach(
            productsData.reduce<Record<number, { quantity: number; unit_price: number }>>((acc, p) => {
                acc[p.id] = { quantity: p.quantity, unit_price: p.price }
                return acc
            }, {} as Record<number, { quantity: number; unit_price: number }>)
        )

        logger.info(`[PaymentService] Transaction successfully created in the database. Internal ID: ${transaction.id}`)

        return transaction
    }

    async processRefund(transactionId: number) {
        logger.info(`[PaymentService] Refund requested for internal transaction ID: ${transactionId}`)
        
        const transaction = await Transaction.findOrFail(transactionId)

        if (transaction.status === 'refunded') {
            throw new Error('Transaction already refunded')
        }

        const gateways = await Gateway.query().orderBy('priority', 'asc')
        const gatewayInstances = this.createGatewayInstances(gateways)

        const gatewayIndex = gateways.findIndex((g) => g.id === transaction.gatewayId)

        if (gatewayIndex === -1) {
            throw new Error('Gateway not found')
        }

        const gatewayManager = new GatewayManager(gatewayInstances)
        const refundResult = await gatewayManager.processRefund(
            gatewayIndex,
            transaction.externalId!,
        )

        if (!refundResult.success) {
            throw new Error('Refund failed')
        }

        transaction.status = 'refunded'
        await transaction.save()

        logger.info(`[PaymentService] Transaction ID ${transaction.id} updated to 'refunded' in the database.`)

        return transaction
    }

    private async getProductsWithPrices(
        products: Array<{ productId: number; quantity: number}>
    ) {
        const productIds = products.map((p) => p.productId)
        const foundProducts = await Product.query().whereIn('id', productIds)

        return foundProducts.map((product) => {
            const requestedProduct = products.find((p) => p.productId === product.id)!
            return {
                id: product.id,
                price: product.price,
                quantity: requestedProduct.quantity,
            }
        })
    }

    private calculateTotal(
        products: Array<{ price: number; quantity: number}>
    ): number {
        return products.reduce((sum, p) => sum + p.price * p.quantity, 0)
    }

    private createGatewayInstances(gateways: Gateway[]): IGateway[] {
        return gateways.map((gateway) => {
            const name = gateway.name.toLowerCase()

            if (name.includes('gateway 1')) {
                return new Gateway1(gateway.baseUrl)
            }

            if (name.includes('gateway 2')) {
                return new Gateway2(gateway.baseUrl)
            }

            throw new Error(`Unknown gateway: ${gateway.name}`)
        })
    }
}