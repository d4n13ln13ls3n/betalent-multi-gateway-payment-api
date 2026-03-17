import type { IGateway } from "./gateway_interface.ts";
import { AppError } from '#exceptions/app_error'

export default class Gateway1 implements IGateway {
  private token: string | null = null

  constructor(private baseUrl: string) {}

  private async authenticate() {
    if (this.token) return

    try {
      const response = await fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: process.env.GATEWAY1_USERNAME,
          token: process.env.GATEWAY1_TOKEN,
        }),
      })

      if (!response.ok) {
        throw new AppError('Gateway1 authentication failed', 502, 'GATEWAY_AUTH_ERROR')
      }

      const data = (await response.json()) as { token: string }
      this.token = data.token

    } catch {
      throw new AppError('Gateway1 connection error', 502, 'GATEWAY_CONNECTION_ERROR')
    }
  }

  async pay(amount: number, metadata?: any) {
    await this.authenticate()

    try {
      const response = await fetch(`${this.baseUrl}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({
          amount,
          name: metadata?.clientName || 'Customer',
          email: metadata?.clientEmail || 'customer@example.com',
          cardNumber: process.env.GATEWAY_CARD_NUMBER,
          cvv: process.env.GATEWAY_CVV,
        }),
      })

      if (!response.ok) {
        return { success: false }
      }

      const data = (await response.json()) as { id: string }

      return {
        success: true,
        externalId: data.id || `GATEWAY1_${Date.now()}`,
      }

    } catch {
      throw new AppError('Gateway1 connection error', 502, 'GATEWAY_CONNECTION_ERROR')
    }
  }

  async refund(externalId: string) {
    await this.authenticate()

    try {
      const response = await fetch(
        `${this.baseUrl}/transactions/${externalId}/charge_back`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      )

      if (!response.ok) {
        return { success: false }
      }

      return { success: true }

    } catch {
      throw new AppError('Gateway1 connection error', 502, 'GATEWAY_CONNECTION_ERROR')
    }
  }
}