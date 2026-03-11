import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import logger from '@adonisjs/core/services/logger'

export default class AuthController {
  async login({ request, response }: HttpContext) {
    const validator = vine.compile(
      vine.object({
        email: vine.string().email(),
        password: vine.string().minLength(6),
      })
    )

    const payload = await validator.validate(request.body())

    try {
      const user = await User.verifyCredentials(payload.email, payload.password)
      const token = await User.accessTokens.create(user)

      logger.info(`[AuthController] Successful login for user: ${user.email}`)

      return response.ok({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
        },
        token: token.value!.release(),
      })
    } catch (error) {
      logger.warn(`[AuthController] Login attempt failed (Invalid credentials). Email: ${payload.email}`)

      return response.unauthorized({
        message: 'Invalid credentials'
      })
    }
  }

  async logout({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    
    logger.info(`[AuthController] User logged out: ${user.email}`)
    
    return response.ok({
      message: 'Logged out successfully'
    })
  }

  async me({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail() as User
    
    return response.ok({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        createdAt: user.createdAt,
      }
    })
  }
}