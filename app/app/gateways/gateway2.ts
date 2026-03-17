import type { IGateway } from "./gateway_interface.ts";
import { AppError } from '#exceptions/app_error'

export default class Gateway2 implements IGateway {
  private readonly authToken = process.env.GATEWAY2_TOKEN!
  private readonly authSecret = process.env.GATEWAY2_SECRET!
  private readonly cardNumber = process.env.GATEWAY_CARD_NUMBER!
  private readonly cardCvv = process.env.GATEWAY_CVV!

  constructor(private baseUrl: string) {}

  async pay(amount: number, metadata?: any) {
    try {
      const response = await fetch(`${this.baseUrl}/transacoes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Gateway-Auth-Token': this.authToken,
          'Gateway-Auth-Secret': this.authSecret,
        },
        body: JSON.stringify({
          valor: amount,
          nome: metadata?.clientName || 'Customer',
          email: metadata?.clientEmail || 'customer@example.com',
          numeroCartao: this.cardNumber,
          cvv: this.cardCvv,
        }),
      })

      if (!response.ok) {
        return { success: false }
      }

      const data = (await response.json()) as { id: string }

      return {
        success: true,
        externalId: data.id || `GATEWAY2_${Date.now()}`,
      }

    } catch {
      throw new AppError('Gateway2 connection error', 502, 'GATEWAY_CONNECTION_ERROR')
    }
  }

  async refund(externalId: string) {
    try {
      const response = await fetch(`${this.baseUrl}/transacoes/reembolso`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Gateway-Auth-Token': this.authToken,
          'Gateway-Auth-Secret': this.authSecret,
        },
        body: JSON.stringify({ id: externalId }),
      })

      if (!response.ok) {
        return { success: false }
      }

      return { success: true }

    } catch {
      throw new AppError('Gateway2 connection error', 502, 'GATEWAY_CONNECTION_ERROR')
    }
  }
}