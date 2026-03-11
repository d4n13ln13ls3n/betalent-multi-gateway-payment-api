import vine from '@vinejs/vine'

export const updateStatusValidator = vine.compile(
  vine.object({
    is_active: vine.boolean(),
  })
)

export const updatePriorityValidator = vine.compile(
  vine.object({
    priority: vine.number().min(1),
  })
)