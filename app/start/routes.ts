import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const ProductsController = () => import('#controllers/products_controller')
const ClientsController = () => import('#controllers/clients_controller')
const PurchasesController = () => import('#controllers/purchases_controller')
const TransactionsController = () => import('#controllers/transactions_controller')
const AuthController = () => import('#controllers/auth_controller')
const GatewaysController = () => import('#controllers/gateways_controller')
const UsersController = () => import('#controllers/users_controller')


router.get('/', () => {
  return { 
    api: 'Multi-Gateway Payment API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      auth: '/api/v1/auth/login',
      docs: 'See README.md'
    }
  }
})

router.post('/api/v1/auth/login', [AuthController, 'login'])

router
  .group(() => {
    router.resource('products', ProductsController)
    router.resource('clients', ClientsController)
    router.resource('users', UsersController)

    router.post('purchase', [PurchasesController, 'store'])
    router.get('transactions', [TransactionsController, 'index'])
    router.get('transactions/:id', [TransactionsController, 'show'])
    router.post('transactions/:id/refund', [TransactionsController, 'refund'])
    
    router.post('auth/logout', [AuthController, 'logout'])
    router.get('auth/me', [AuthController, 'me'])

    router.get('gateways', [GatewaysController, 'index'])
    router.patch('gateways/:id/status', [GatewaysController, 'updateStatus'])
    router.patch('gateways/:id/priority', [GatewaysController, 'updatePriority'])
  })
  .prefix('/api/v1')
  .use(middleware.auth())