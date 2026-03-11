import vine from '@vinejs/vine'

export const purchaseValidator = vine.compile(
    vine.object({
        clientId: vine.number().positive(),
        products: vine.array(
            vine.object({
                productId: vine.number().positive(),
                quantity: vine.number().min(1),
            })
        ).minLength(1),
    })
)