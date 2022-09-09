import { Prisma } from '@prisma/client'

export interface Location {
  latitude: Prisma.Decimal
  longitude: Prisma.Decimal
}

export interface Event extends Location {
  id: number
  name: string
  description: string
  rating?: number | null
  startAt: Date
  endsAt: Date
  address: string
  idCreator: number
  imageUrl: string
  createdAt?: Date | null
  updatedAt?: Date | null
}
