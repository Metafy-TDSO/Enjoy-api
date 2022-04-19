export const IS_PROD = process.env.NODE_ENV === 'production'
export const JWT_SECRET = process.env.SECRET ?? 'secret123'
