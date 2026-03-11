import type { IGateway } from "./gateway_interface.ts";

export default class Gateway2 implements IGateway {
    private readonly authToken = 'tk_f2198cc671b5289fa856'
    private readonly authSecret = '3d15e8ed6131446ea7e3456728b1211f'

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
                    numeroCartao: '5569000000006063',
                    cvv: '010',
                }),
            })

            if (!response.ok) {
                return {
                    success: false,
                    error: 'Gateway 2 payment failed',
                }
            }

            const data = (await response.json()) as { id: string }

            return {
                success: true,
                externalId: data.id || `GATEWAY2_${Date.now()}`,
            }
        } catch (error) {
            return {
                success: false,
                error: 'Gateway 2 connection error',
            }
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
                body: JSON.stringify({ id: externalId}),
            })

            if (!response.ok) {
                return {
                    success: false,
                    error: 'Gateway 2 refund failed',
                }
            }
            
            return { success: true }
        } catch (error) {
            return {
                success: false,
                error: 'Gateway 2 connection error',
            }
        }
    }
}