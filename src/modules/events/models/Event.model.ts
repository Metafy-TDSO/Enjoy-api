import { Prisma } from '@prisma/client'

export interface Event {
  id: number
  name: string
  description: string
  rating?: number | null
  startAt: Date
  endsAt: Date
  latitude: Prisma.Decimal
  longitude: Prisma.Decimal
  address: string
  idCreator: number
  createdAt?: Date | null
  updatedAt?: Date | null
}
