import Gateway from '#models/gateway'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Gateway.updateOrCreateMany('name', [
      {
        name: 'Gateway 1',
        baseUrl: 'http://127.0.0.1:3001',
        priority: 1,
        isActive: true,
      },
      {
        name: 'Gateway 2',
        baseUrl: 'http://127.0.0.1:3002',
        priority: 2,
        isActive: true,
      }
    ])
  }
}