export class HttpError extends Error {
  code?: number
}

export const NotFoundError = (message: string): HttpError => ({
  name: 'http_error',
  message,
  code: 404
})

export const BadRequestError = (message: string): HttpError => ({
  name: 'http_error',
  message,
  code: 400
})

export const UnauthenticatedError = (message: string): HttpError => ({
  name: 'http_error',
  message,
  code: 401
})
