import type { IGateway } from "./gateway_interface.ts";

export default class Gateway1 implements IGateway {
    private token: string | null = null

    constructor(private baseUrl: string) {}

    private async authenticate() {
        if (this.token) return

        try {
            console.log(`[Gateway1] Tentando autenticar na URL: ${this.baseUrl}/login`)
            
            const response = await fetch(`${this.baseUrl}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({
                    email: 'dev@betalent.tech',
                    token: 'FEC9BB078BF338F464F96B48089EB498',
                }),
            })

            console.log(`[Gateway1] Status da resposta: ${response.status}`)

            if (!response.ok) {
                const errorText = await response.text()
                console.error(`[Gateway1] Falha na resposta do Mock:`, errorText)
                throw new Error(`HTTP Error ${response.status}`)
            }

            const data = (await response.json()) as { token: string }
            this.token = data.token
            console.log(`[Gateway1] Token obtido com sucesso!`)
            
        } catch (error) {
            console.error('[Gateway1] Erro detalhado:', error)
            throw new Error('Gateway1 authentication failed')
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
                    cardNumber: '5569000000006063',
                    cvv: '010',
                }),
            })

            if (!response.ok) {
                return {
                    success: false,
                    error: 'Gateway 1 payment failed',
                }
            }

            const data = (await response.json()) as { id: string }

            return {
                success: true,
                externalId: data.id || `GATEWAY_1_${Date.now()}`,
            }
        } catch (error) {
            return {
                success: false,
                error: 'Gateway 1 connection error',
            }
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
            })

            if (!response.ok) {
                return {
                    success: false,
                    error: 'Gateway1 refund failed',
                }
            }
            
            return { success: true }
        } catch (error) {
            return {
                success: false,
                error: 'Gateway 1 connection error',
            }
        }
    }
}