import { ValidationError } from 'class-validator'

interface Obj<T = unknown> {
  [key: string]: T
}

type ErrorResponse = Obj<Record<'name' | 'constraints', string | Obj | undefined>>

export const formatValidationErrors = (errors: ValidationError[]): ErrorResponse | {} => {
  const response: ErrorResponse = {}

  errors.forEach(({ property, constraints }) => {
    response[property] = {
      name: property,
      constraints
    }
  })

  return response
}
