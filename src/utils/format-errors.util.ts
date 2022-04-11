import { ValidationError } from 'class-validator'
import v from 'voca'

interface Obj<T = unknown> {
  [key: string]: T
}

export const formatValidationErrors = (errors: ValidationError[]): Obj => {
  const response: Obj = {}

  errors.forEach(({ property, constraints }) => {
    const constraintsEntries = Object.entries(constraints ?? {})

    const normalCaseConstraintKeys = constraintsEntries.map(([key, value]) => [
      v.capitalize(key.replace(/([A-Z])/g, ' $1'), true),
      v.capitalize(value)
    ])

    response[property] = Object.fromEntries(normalCaseConstraintKeys)
  })

  return response
}
