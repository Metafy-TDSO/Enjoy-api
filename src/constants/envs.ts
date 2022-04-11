export const IS_PROD = process.env.NODE_ENV === 'production'
export const PORT = Number(process.env.PORT ?? 3000)
export const JWT_SECRET = process.env.SECRET ?? 'secret123'
