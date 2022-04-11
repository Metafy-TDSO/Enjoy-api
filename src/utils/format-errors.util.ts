import { ValidationError } from 'class-validator'

interface ErrorResponse {
  [key: string]: string[]
}

export const formatValidationErrors = (errors: ValidationError[]): ErrorResponse => {
  const response: ErrorResponse = {}

  errors.forEach(({ property, constraints }) => {
    const constraintsValue = Object.values(constraints ?? {})

    response[property] = constraintsValue
  })

  return response
}
