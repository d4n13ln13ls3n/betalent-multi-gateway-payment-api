import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import vine from '@vinejs/vine'
import logger from '@adonisjs/core/services/logger'

export default class UsersController {
  async index({ response }: HttpContext) {
    const users = await User.all()
    return response.ok({ data: users })
  }

  async store({ request, response }: HttpContext) {
    const schema = vine.object({
      fullName: vine.string().trim(),
      email: vine.string().email().normalizeEmail(),
      password: vine.string().minLength(6),
    })

    const payload = await request.validateUsing(vine.compile(schema))
    const user = await User.create(payload)

    logger.info(`[UsersController] User created: ${user.id}`)

    return response.created({ data: user })
  }

  async show({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    return response.ok({ data: user })
  }

  async update({ params, request, response }: HttpContext) {
    const user = await User.findOrFail(params.id)

    const schema = vine.object({
      fullName: vine.string().trim().optional(),
      email: vine.string().email().normalizeEmail().optional(),
      password: vine.string().minLength(6).optional(),
    })

    const payload = await request.validateUsing(vine.compile(schema))

    user.merge(payload)
    await user.save()

    return response.ok({ data: user })
  }

  async destroy({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    await user.delete()

    return response.ok({ message: 'Deleted successfully' })
  }
}