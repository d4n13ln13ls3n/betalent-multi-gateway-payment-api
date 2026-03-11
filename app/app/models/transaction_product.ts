import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class TransactionProduct extends BaseModel {
    public static table = 'transaction_products'

    @column({ isPrimary: true })
    declare transactionId: number

    @column({ isPrimary: true })
    declare productId: number

    @column()
    declare quantity: number

    @column()
    declare unitPrice: number
}