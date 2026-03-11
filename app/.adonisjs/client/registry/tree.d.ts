/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    login: typeof routes['auth.login']
    logout: typeof routes['auth.logout']
    me: typeof routes['auth.me']
  }
  products: {
    index: typeof routes['products.index']
    create: typeof routes['products.create']
    store: typeof routes['products.store']
    show: typeof routes['products.show']
    edit: typeof routes['products.edit']
    update: typeof routes['products.update']
    destroy: typeof routes['products.destroy']
  }
  clients: {
    index: typeof routes['clients.index']
    create: typeof routes['clients.create']
    store: typeof routes['clients.store']
    show: typeof routes['clients.show']
    edit: typeof routes['clients.edit']
    update: typeof routes['clients.update']
    destroy: typeof routes['clients.destroy']
  }
  users: {
    index: typeof routes['users.index']
    create: typeof routes['users.create']
    store: typeof routes['users.store']
    show: typeof routes['users.show']
    edit: typeof routes['users.edit']
    update: typeof routes['users.update']
    destroy: typeof routes['users.destroy']
  }
  purchases: {
    store: typeof routes['purchases.store']
  }
  transactions: {
    index: typeof routes['transactions.index']
    show: typeof routes['transactions.show']
    refund: typeof routes['transactions.refund']
  }
  gateways: {
    index: typeof routes['gateways.index']
    updateStatus: typeof routes['gateways.update_status']
    updatePriority: typeof routes['gateways.update_priority']
  }
}
