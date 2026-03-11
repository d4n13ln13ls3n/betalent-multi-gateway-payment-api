import Product from '#models/product'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Product.createMany([
      {
        name: 'Produto A',
        price: 1000,
      },
      {
        name: 'Produto B',
        price: 2500,
      },
      {
        name: 'Produto C',
        price: 5000,
      },
    ])
  }
}