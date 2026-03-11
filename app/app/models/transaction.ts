import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Client from '#models/client'
import Gateway from '#models/gateway'
import Product from '#models/product'


export default class Transaction extends BaseModel {
    @column({ isPrimary: true})
    declare id: number

    @column()
    declare clientId: number

    @column()
    declare gatewayId: number

    @column()
    declare totalAmount: number

    @column()
    declare status: string

    @column()
    declare externalId: string | null

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime

    @belongsTo(() => Client)
    declare client: BelongsTo<typeof Client>

    @belongsTo(() => Gateway)
    declare gateway: BelongsTo<typeof Gateway>

    @manyToMany(() => Product, {
        pivotTable: 'transaction_products',
        pivotColumns: ['quantity', 'unit_price'],
    })
    declare products: ManyToMany<typeof Product>
}