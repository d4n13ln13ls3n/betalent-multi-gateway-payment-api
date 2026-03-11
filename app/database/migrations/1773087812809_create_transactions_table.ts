import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
        table.increments('id')

        table
            .integer('client_id')
            .unsigned()
            .references('id')
            .inTable('clients')

        table
            .integer('gateway_id')
            .unsigned()
            .references('id')
            .inTable('gateways')

        table.decimal('total_amount', 10, 2).notNullable()
        table.string('status').notNullable()
        table.string('external_id')

        table.timestamp('created_at')
        table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}