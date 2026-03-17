import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'
import vine from '@vinejs/vine'
import logger from '@adonisjs/core/services/logger'

export default class ProductsController {
  async index({ response }: HttpContext) {
    const products = await Product.all()
    return response.ok({ data: products })
  }

  async store({ request, response }: HttpContext) {
    const schema = vine.object({
      name: vine.string().trim(),
      price: vine.number().positive(),
    })

    const payload = await request.validateUsing(vine.compile(schema))
    const product = await Product.create(payload)

    logger.info(`[ProductsController] Product created: ${product.id}`)

    return response.created({ data: product })
  }

  async show({ params, response }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    return response.ok({ data: product })
  }

  async update({ params, request, response }: HttpContext) {
    const product = await Product.findOrFail(params.id)

    const schema = vine.object({
      name: vine.string().trim().optional(),
      price: vine.number().positive().optional(),
    })

    const payload = await request.validateUsing(vine.compile(schema))

    product.merge(payload)
    await product.save()

    return response.ok({ data: product })
  }

  async destroy({ params, response }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    await product.delete()

    return response.ok({ message: 'Deleted successfully' })
  }
}