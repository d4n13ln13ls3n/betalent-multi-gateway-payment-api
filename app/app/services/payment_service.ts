import Transaction from '#models/transaction'
import Product from '#models/product'
import Gateway from '#models/gateway'
import GatewayManager from '../gateways/gateway_manager.js'
import Gateway1 from '../gateways/gateway1.js'
import Gateway2 from '../gateways/gateway2.js'
import type { IGateway } from '../gateways/gateway_interface.js'
import logger from '@adonisjs/core/services/logger'
import { AppError } from '#exceptions/app_error'

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

    if (productsData.length === 0) {
      throw new AppError('No products found', 404, 'PRODUCTS_NOT_FOUND')
    }

    const totalAmount = this.calculateTotal(productsData)

    const gateways = await Gateway.query().where('is_active', true).orderBy('priority', 'asc')

    if (gateways.length === 0) {
      throw new AppError('No active gateways available', 503, 'NO_GATEWAY')
    }

    const gatewayInstances = this.createGatewayInstances(gateways)

    const gatewayManager = new GatewayManager(gatewayInstances)

    const paymentResult = await gatewayManager.processPayment(
      totalAmount,
      { clientId: data.clientId }
    )

    if (!paymentResult.success) {
      throw new AppError('Payment failed on all gateways', 502, 'PAYMENT_FAILED')
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
      }, {})
    )

    logger.info(`[PaymentService] Transaction created. ID: ${transaction.id}`)

    return transaction
  }

  async processRefund(transactionId: number) {
    logger.info(`[PaymentService] Refund requested for transaction ID: ${transactionId}`)

    const transaction = await Transaction.findOrFail(transactionId)

    if (transaction.status === 'refunded') {
      throw new AppError('Transaction already refunded', 400, 'ALREADY_REFUNDED')
    }

    const gateways = await Gateway.query().orderBy('priority', 'asc')
    const gatewayInstances = this.createGatewayInstances(gateways)

    const gatewayIndex = gateways.findIndex((g) => g.id === transaction.gatewayId)

    if (gatewayIndex === -1) {
      throw new AppError('Gateway not found', 404, 'GATEWAY_NOT_FOUND')
    }

    const gatewayManager = new GatewayManager(gatewayInstances)

    const refundResult = await gatewayManager.processRefund(
      gatewayIndex,
      transaction.externalId!
    )

    if (!refundResult.success) {
      throw new AppError('Refund failed', 502, 'REFUND_FAILED')
    }

    transaction.status = 'refunded'
    await transaction.save()

    logger.info(`[PaymentService] Transaction ${transaction.id} refunded`)

    return transaction
  }

  private async getProductsWithPrices(
    products: Array<{ productId: number; quantity: number }>
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
    products: Array<{ price: number; quantity: number }>
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

      throw new AppError(`Unknown gateway: ${gateway.name}`, 500, 'UNKNOWN_GATEWAY')
    })
  }
}