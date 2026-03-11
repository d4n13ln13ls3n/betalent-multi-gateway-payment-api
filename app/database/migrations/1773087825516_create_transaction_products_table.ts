import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transaction_products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
        table
            .integer('transaction_id')
            .unsigned()
            .references('id')
            .inTable('transactions')

        table
            .integer('product_id')
            .unsigned()
            .references('id')
            .inTable('products')

        table.integer('quantity').notNullable()
        table.decimal('unit_price', 10, 2).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}