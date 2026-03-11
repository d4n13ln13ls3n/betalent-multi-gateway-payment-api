export interface IGateway {
    /**
   * @returns { success: boolean, externalId?: string, error?: string }
   */
   pay(amount: number, metadata?: any): Promise<{
        success: boolean
        externalId?: string
        error?: string
   }>

    refund(externalId: string): Promise<{
        success: boolean
        error?: string
    }>
}