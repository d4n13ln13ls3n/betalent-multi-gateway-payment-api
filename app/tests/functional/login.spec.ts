import { test } from '@japa/runner'
import User from '#models/user'

test.group('Auth / Login', (group) => {
  const clearUser = async () => {
    await User.query().where('email', 'test_tdd@betalent.tech').delete()
  }
  
  group.each.setup(clearUser)
  group.each.teardown(clearUser)

  test('should return success and a token when logging in with valid credentials', async ({ client, assert }) => {
    await User.create({
      fullName: 'User TDD',
      email: 'test_tdd@betalent.tech',
      password: 'password123',
    })

    const response = await client.post('/api/v1/auth/login').json({
      email: 'test_tdd@betalent.tech',
      password: 'password123',
    })

    response.assertStatus(200)
    response.assertBodyContains({ message: 'Login successful' })
    
    assert.property(response.body(), 'token')
  })

  test('should return status code 401 when logging in with an incorrect password', async ({ client }) => {
    await User.create({
      fullName: 'User TDD 2',
      email: 'test_tdd@betalent.tech',
      password: 'password123',
    })

    const response = await client.post('/api/v1/auth/login').json({
      email: 'test_tdd@betalent.tech',
      password: 'wrong_password',
    })

    response.assertStatus(401)
    response.assertBodyContains({ message: 'Invalid credentials' })
  })
})