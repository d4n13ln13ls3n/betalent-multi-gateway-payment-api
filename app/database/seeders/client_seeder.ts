import Client from '#models/client'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Client.create({
      name: 'Cliente Teste',
      email: 'cliente@email.com',
    })
  }
}