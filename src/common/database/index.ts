import { PrismaClient } from '@prisma/client'

import { IS_PROD } from '@common/constants/envs'

export const prisma = new PrismaClient({
  log: !IS_PROD ? ['query', 'info', 'warn', 'error'] : ['error']
})
