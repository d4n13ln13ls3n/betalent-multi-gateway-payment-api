/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'auth.login': {
    methods: ["POST"],
    pattern: '/api/v1/auth/login',
    tokens: [{"old":"/api/v1/auth/login","type":0,"val":"api","end":""},{"old":"/api/v1/auth/login","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/login","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['auth.login']['types'],
  },
  'products.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/products',
    tokens: [{"old":"/api/v1/products","type":0,"val":"api","end":""},{"old":"/api/v1/products","type":0,"val":"v1","end":""},{"old":"/api/v1/products","type":0,"val":"products","end":""}],
    types: placeholder as Registry['products.index']['types'],
  },
  'products.create': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/products/create',
    tokens: [{"old":"/api/v1/products/create","type":0,"val":"api","end":""},{"old":"/api/v1/products/create","type":0,"val":"v1","end":""},{"old":"/api/v1/products/create","type":0,"val":"products","end":""},{"old":"/api/v1/products/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['products.create']['types'],
  },
  'products.store': {
    methods: ["POST"],
    pattern: '/api/v1/products',
    tokens: [{"old":"/api/v1/products","type":0,"val":"api","end":""},{"old":"/api/v1/products","type":0,"val":"v1","end":""},{"old":"/api/v1/products","type":0,"val":"products","end":""}],
    types: placeholder as Registry['products.store']['types'],
  },
  'products.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/products/:id',
    tokens: [{"old":"/api/v1/products/:id","type":0,"val":"api","end":""},{"old":"/api/v1/products/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/products/:id","type":0,"val":"products","end":""},{"old":"/api/v1/products/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['products.show']['types'],
  },
  'products.edit': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/products/:id/edit',
    tokens: [{"old":"/api/v1/products/:id/edit","type":0,"val":"api","end":""},{"old":"/api/v1/products/:id/edit","type":0,"val":"v1","end":""},{"old":"/api/v1/products/:id/edit","type":0,"val":"products","end":""},{"old":"/api/v1/products/:id/edit","type":1,"val":"id","end":""},{"old":"/api/v1/products/:id/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['products.edit']['types'],
  },
  'products.update': {
    methods: ["PUT","PATCH"],
    pattern: '/api/v1/products/:id',
    tokens: [{"old":"/api/v1/products/:id","type":0,"val":"api","end":""},{"old":"/api/v1/products/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/products/:id","type":0,"val":"products","end":""},{"old":"/api/v1/products/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['products.update']['types'],
  },
  'products.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/products/:id',
    tokens: [{"old":"/api/v1/products/:id","type":0,"val":"api","end":""},{"old":"/api/v1/products/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/products/:id","type":0,"val":"products","end":""},{"old":"/api/v1/products/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['products.destroy']['types'],
  },
  'clients.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/clients',
    tokens: [{"old":"/api/v1/clients","type":0,"val":"api","end":""},{"old":"/api/v1/clients","type":0,"val":"v1","end":""},{"old":"/api/v1/clients","type":0,"val":"clients","end":""}],
    types: placeholder as Registry['clients.index']['types'],
  },
  'clients.create': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/clients/create',
    tokens: [{"old":"/api/v1/clients/create","type":0,"val":"api","end":""},{"old":"/api/v1/clients/create","type":0,"val":"v1","end":""},{"old":"/api/v1/clients/create","type":0,"val":"clients","end":""},{"old":"/api/v1/clients/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['clients.create']['types'],
  },
  'clients.store': {
    methods: ["POST"],
    pattern: '/api/v1/clients',
    tokens: [{"old":"/api/v1/clients","type":0,"val":"api","end":""},{"old":"/api/v1/clients","type":0,"val":"v1","end":""},{"old":"/api/v1/clients","type":0,"val":"clients","end":""}],
    types: placeholder as Registry['clients.store']['types'],
  },
  'clients.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/clients/:id',
    tokens: [{"old":"/api/v1/clients/:id","type":0,"val":"api","end":""},{"old":"/api/v1/clients/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/clients/:id","type":0,"val":"clients","end":""},{"old":"/api/v1/clients/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['clients.show']['types'],
  },
  'clients.edit': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/clients/:id/edit',
    tokens: [{"old":"/api/v1/clients/:id/edit","type":0,"val":"api","end":""},{"old":"/api/v1/clients/:id/edit","type":0,"val":"v1","end":""},{"old":"/api/v1/clients/:id/edit","type":0,"val":"clients","end":""},{"old":"/api/v1/clients/:id/edit","type":1,"val":"id","end":""},{"old":"/api/v1/clients/:id/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['clients.edit']['types'],
  },
  'clients.update': {
    methods: ["PUT","PATCH"],
    pattern: '/api/v1/clients/:id',
    tokens: [{"old":"/api/v1/clients/:id","type":0,"val":"api","end":""},{"old":"/api/v1/clients/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/clients/:id","type":0,"val":"clients","end":""},{"old":"/api/v1/clients/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['clients.update']['types'],
  },
  'clients.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/clients/:id',
    tokens: [{"old":"/api/v1/clients/:id","type":0,"val":"api","end":""},{"old":"/api/v1/clients/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/clients/:id","type":0,"val":"clients","end":""},{"old":"/api/v1/clients/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['clients.destroy']['types'],
  },
  'users.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/users',
    tokens: [{"old":"/api/v1/users","type":0,"val":"api","end":""},{"old":"/api/v1/users","type":0,"val":"v1","end":""},{"old":"/api/v1/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['users.index']['types'],
  },
  'users.create': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/users/create',
    tokens: [{"old":"/api/v1/users/create","type":0,"val":"api","end":""},{"old":"/api/v1/users/create","type":0,"val":"v1","end":""},{"old":"/api/v1/users/create","type":0,"val":"users","end":""},{"old":"/api/v1/users/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['users.create']['types'],
  },
  'users.store': {
    methods: ["POST"],
    pattern: '/api/v1/users',
    tokens: [{"old":"/api/v1/users","type":0,"val":"api","end":""},{"old":"/api/v1/users","type":0,"val":"v1","end":""},{"old":"/api/v1/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['users.store']['types'],
  },
  'users.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/users/:id',
    tokens: [{"old":"/api/v1/users/:id","type":0,"val":"api","end":""},{"old":"/api/v1/users/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/users/:id","type":0,"val":"users","end":""},{"old":"/api/v1/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['users.show']['types'],
  },
  'users.edit': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/users/:id/edit',
    tokens: [{"old":"/api/v1/users/:id/edit","type":0,"val":"api","end":""},{"old":"/api/v1/users/:id/edit","type":0,"val":"v1","end":""},{"old":"/api/v1/users/:id/edit","type":0,"val":"users","end":""},{"old":"/api/v1/users/:id/edit","type":1,"val":"id","end":""},{"old":"/api/v1/users/:id/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['users.edit']['types'],
  },
  'users.update': {
    methods: ["PUT","PATCH"],
    pattern: '/api/v1/users/:id',
    tokens: [{"old":"/api/v1/users/:id","type":0,"val":"api","end":""},{"old":"/api/v1/users/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/users/:id","type":0,"val":"users","end":""},{"old":"/api/v1/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['users.update']['types'],
  },
  'users.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/users/:id',
    tokens: [{"old":"/api/v1/users/:id","type":0,"val":"api","end":""},{"old":"/api/v1/users/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/users/:id","type":0,"val":"users","end":""},{"old":"/api/v1/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['users.destroy']['types'],
  },
  'purchases.store': {
    methods: ["POST"],
    pattern: '/api/v1/purchase',
    tokens: [{"old":"/api/v1/purchase","type":0,"val":"api","end":""},{"old":"/api/v1/purchase","type":0,"val":"v1","end":""},{"old":"/api/v1/purchase","type":0,"val":"purchase","end":""}],
    types: placeholder as Registry['purchases.store']['types'],
  },
  'transactions.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/transactions',
    tokens: [{"old":"/api/v1/transactions","type":0,"val":"api","end":""},{"old":"/api/v1/transactions","type":0,"val":"v1","end":""},{"old":"/api/v1/transactions","type":0,"val":"transactions","end":""}],
    types: placeholder as Registry['transactions.index']['types'],
  },
  'transactions.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/transactions/:id',
    tokens: [{"old":"/api/v1/transactions/:id","type":0,"val":"api","end":""},{"old":"/api/v1/transactions/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/transactions/:id","type":0,"val":"transactions","end":""},{"old":"/api/v1/transactions/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['transactions.show']['types'],
  },
  'transactions.refund': {
    methods: ["POST"],
    pattern: '/api/v1/transactions/:id/refund',
    tokens: [{"old":"/api/v1/transactions/:id/refund","type":0,"val":"api","end":""},{"old":"/api/v1/transactions/:id/refund","type":0,"val":"v1","end":""},{"old":"/api/v1/transactions/:id/refund","type":0,"val":"transactions","end":""},{"old":"/api/v1/transactions/:id/refund","type":1,"val":"id","end":""},{"old":"/api/v1/transactions/:id/refund","type":0,"val":"refund","end":""}],
    types: placeholder as Registry['transactions.refund']['types'],
  },
  'auth.logout': {
    methods: ["POST"],
    pattern: '/api/v1/auth/logout',
    tokens: [{"old":"/api/v1/auth/logout","type":0,"val":"api","end":""},{"old":"/api/v1/auth/logout","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/logout","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['auth.logout']['types'],
  },
  'auth.me': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/auth/me',
    tokens: [{"old":"/api/v1/auth/me","type":0,"val":"api","end":""},{"old":"/api/v1/auth/me","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/me","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/me","type":0,"val":"me","end":""}],
    types: placeholder as Registry['auth.me']['types'],
  },
  'gateways.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/gateways',
    tokens: [{"old":"/api/v1/gateways","type":0,"val":"api","end":""},{"old":"/api/v1/gateways","type":0,"val":"v1","end":""},{"old":"/api/v1/gateways","type":0,"val":"gateways","end":""}],
    types: placeholder as Registry['gateways.index']['types'],
  },
  'gateways.update_status': {
    methods: ["PATCH"],
    pattern: '/api/v1/gateways/:id/status',
    tokens: [{"old":"/api/v1/gateways/:id/status","type":0,"val":"api","end":""},{"old":"/api/v1/gateways/:id/status","type":0,"val":"v1","end":""},{"old":"/api/v1/gateways/:id/status","type":0,"val":"gateways","end":""},{"old":"/api/v1/gateways/:id/status","type":1,"val":"id","end":""},{"old":"/api/v1/gateways/:id/status","type":0,"val":"status","end":""}],
    types: placeholder as Registry['gateways.update_status']['types'],
  },
  'gateways.update_priority': {
    methods: ["PATCH"],
    pattern: '/api/v1/gateways/:id/priority',
    tokens: [{"old":"/api/v1/gateways/:id/priority","type":0,"val":"api","end":""},{"old":"/api/v1/gateways/:id/priority","type":0,"val":"v1","end":""},{"old":"/api/v1/gateways/:id/priority","type":0,"val":"gateways","end":""},{"old":"/api/v1/gateways/:id/priority","type":1,"val":"id","end":""},{"old":"/api/v1/gateways/:id/priority","type":0,"val":"priority","end":""}],
    types: placeholder as Registry['gateways.update_priority']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
