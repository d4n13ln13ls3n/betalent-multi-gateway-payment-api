import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'
import vine from '@vinejs/vine'
import logger from '@adonisjs/core/services/logger'

export default class ProductsController {
  async index({ response }: HttpContext) {
    try {
      const products = await Product.all()
      return response.ok({ data: products })
    } catch (error) {
      logger.error(`[ProductsController] Failed to retrieve products: ${error.message}`)
      return response.internalServerError({ message: 'Failed to retrieve products' })
    }
  }

  async store({ request, response }: HttpContext) {
    try {
      const schema = vine.object({
        name: vine.string().trim(),
        price: vine.number().positive() 
      })
      const payload = await request.validateUsing(vine.compile(schema))
      
      const product = await Product.create(payload)
      
      logger.info(`[ProductsController] Product created successfully. ID: ${product.id}, Name: ${product.name}`)
      
      return response.created({ message: 'Product created successfully', data: product })
    } catch (error) {
      logger.warn(`[ProductsController] Failed to create product due to validation errors.`)
      return response.badRequest({ message: 'Validation failed', errors: error.messages })
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const product = await Product.findOrFail(params.id)
      return response.ok({ data: product })
    } catch (error) {
      logger.warn(`[ProductsController] Product not found. ID requested: ${params.id}`)
      return response.notFound({ message: 'Product not found' })
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const product = await Product.findOrFail(params.id)
      const schema = vine.object({
        name: vine.string().trim().optional(),
        price: vine.number().positive().optional()
      })
      const payload = await request.validateUsing(vine.compile(schema))
      
      product.merge(payload)
      await product.save()

      logger.info(`[ProductsController] Product updated successfully. ID: ${product.id}`)
      
      return response.ok({ message: 'Product updated successfully', data: product })
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        logger.warn(`[ProductsController] Update failed. Product not found. ID requested: ${params.id}`)
        return response.notFound({ message: 'Product not found' })
      }
      
      logger.warn(`[ProductsController] Failed to update product due to validation errors.`)
      return response.badRequest({ message: 'Update failed', errors: error.messages })
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const product = await Product.findOrFail(params.id)
      await product.delete()

      logger.info(`[ProductsController] Product deleted successfully. ID: ${params.id}`)
      
      return response.ok({ message: 'Product deleted successfully' })
    } catch (error) {
      logger.warn(`[ProductsController] Deletion failed. Product not found. ID requested: ${params.id}`)
      return response.notFound({ message: 'Product not found' })
    }
  }
}