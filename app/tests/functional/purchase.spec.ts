import { test } from '@japa/runner'
import User from '#models/user'
import Client from '#models/client'
import Product from '#models/product'
import Gateway from '#models/gateway'

test.group('Purchase Flow', (group) => {
  let testUser: User
  let testClient: Client
  let testProduct: Product
  let authToken: string

  group.setup(async () => {
    await Gateway.query().where('id', 1).update({ isActive: true, baseUrl: 'http://127.0.0.1:3001' })
    await Gateway.query().where('id', 2).update({ isActive: true, baseUrl: 'http://127.0.0.1:3002' })

    await User.query().where('email', 'buyer_tdd@betalent.tech').delete()
    
    testUser = await User.create({
    fullName: 'Buyer TDD',
    email: 'buyer_tdd@betalent.tech',
    password: 'password123',
    })

    testClient = await Client.firstOrCreate(
    { email: 'client_tdd@betalent.tech' },
    { name: 'TDD Client' }
    )

    testProduct = await Product.firstOrCreate(
    { name: 'TDD Premium Product' },
    { price: 5000 }
    )
})

  group.teardown(async () => {
    await testUser.delete()
  })

  test('should authenticate and retrieve token for purchase requests', async ({ client, assert }) => {
    const response = await client.post('/api/v1/auth/login').json({
      email: 'buyer_tdd@betalent.tech',
      password: 'password123',
    })

    response.assertStatus(200)
    authToken = response.body().token
    assert.exists(authToken)
  })

  test('should return 400 Bad Request when payload is missing or invalid', async ({ client, assert }) => {
    const response = await client.post('/api/v1/purchase')
      .header('Authorization', `Bearer ${authToken}`)
      .json({
        clientId: testClient.id,
        products: []
      })

    response.assertStatus(400)
    assert.property(response.body(), 'errors')
    response.assertBodyContains({ message: 'Validation failed' })
  })

  test('should process purchase successfully and calculate total amount correctly', async ({ client, assert }) => {
    const response = await client.post('/api/v1/purchase')
      .header('Authorization', `Bearer ${authToken}`)
      .json({
        clientId: testClient.id,
        products: [
          { productId: testProduct.id, quantity: 2 }
        ]
      })

    response.assertStatus(201)
    response.assertBodyContains({ message: 'Purchase completed successfully' })
    
    assert.equal(response.body().data.amount, 10000)
    assert.exists(response.body().data.transactionId)
    assert.exists(response.body().data.externalId)
  })

    test('should fallback to Gateway 2 when Gateway 1 is inactive', async ({ client, assert }) => {
        await Gateway.query().where('id', 1).update({ isActive: false })

        const response = await client.post('/api/v1/purchase')
        .header('Authorization', `Bearer ${authToken}`)
        .json({
            clientId: testClient.id,
            products: [{ productId: testProduct.id, quantity: 1 }]
        })

        response.assertStatus(201)
        assert.equal(response.body().data.gatewayId, 2) 

        await Gateway.query().where('id', 1).update({ isActive: true })
    })

    test('should refund a completed transaction successfully', async ({ client, assert }) => {
        const purchaseRes = await client.post('/api/v1/purchase')
        .header('Authorization', `Bearer ${authToken}`)
        .json({
            clientId: testClient.id,
            products: [{ productId: testProduct.id, quantity: 1 }]
        })
        
        const transactionId = purchaseRes.body().data.transactionId

        const refundRes = await client.post(`/api/v1/transactions/${transactionId}/refund`)
        .header('Authorization', `Bearer ${authToken}`)

        refundRes.assertStatus(200)
        refundRes.assertBodyContains({ message: 'Refund processed successfully' })
        assert.equal(refundRes.body().data.status, 'refunded')
    })
})