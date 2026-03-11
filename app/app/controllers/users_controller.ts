import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import vine from '@vinejs/vine'
import logger from '@adonisjs/core/services/logger'

export default class UsersController {
    async index({ response }: HttpContext) {
        try {
            const users  = await User.all()
            response.ok({ data: users })
        } catch (error) {
            logger.error(`[UsersController] Failed to retrieve users list: ${error.message}`)
            return response.internalServerError({ message: 'Failed to retrieve users'})
        }
    }

    async store({ request, response }: HttpContext) {
        try {
            const schema = vine.object({
                fullName: vine.string().trim(),
                email: vine.string().email().normalizeEmail(),
                password: vine.string().minLength(6)
            })
            const payload = await request.validateUsing(vine.compile(schema))

            const user = await User.create(payload)

            logger.info(`[UsersController] User created successfully. ID: ${user.id}, Email: ${user.email}`)

            return response.created({ message: 'User created successfully', data: user})
        } catch (error) {
            logger.warn(`[UsersController] Failed to create user due to validation errors.`)
            return response.badRequest({ message: 'Validation failed', errors: error.messages})
        }
    }

    async show({ params, response }: HttpContext) {
        try {
            const user = await User.findOrFail(params.id)
            response.ok({ data: user })
        } catch (error) {
            logger.warn(`[UsersController] User search failed. ID not found: ${params.id}`)
            return response.notFound({ message: 'User not found' })
        }
    }

    async update({ params, request, response }: HttpContext) {
        try {
            const user = await User.findOrFail(params.id)
            const schema = vine.object({
                fullName: vine.string().trim().optional(),
                email: vine.string().email().normalizeEmail().optional(),
                password: vine.string().minLength(6).optional()
            })
            const payload = await request.validateUsing(vine.compile(schema))

            user.merge(payload)
            await user.save()

            logger.info(`[UsersController] User updated successfully. ID: ${user.id}`)

            return response.ok({ message: 'User updated succesfully', data: user })
        } catch (error) {
            if (error.code === 'E_ROW_NOT_FOUND') {
                logger.warn(`[UsersController] Update failed. User not found. ID requested: ${params.id}`)
                return response.notFound({ message: 'User not found' })
            }
            
            logger.warn(`[UsersController] Failed to update user due to validation errors.`)
            return response.badRequest({ message: 'Update failed', errors: error.messages })
        }
    }

    async destroy({ params, response }: HttpContext) {
        try {
            const user = await User.findOrFail(params.id)
            await user.delete()

            logger.info(`[UsersController] User deleted successfully. ID: ${params.id}`)

            return response.ok({ message: 'User deleted successfully' })
        } catch (error) {
            logger.warn(`[UsersController] Deletion failed. User not found. ID requested: ${params.id}`)
            return response.notFound({ message: 'User not found' })
        }
    }
}