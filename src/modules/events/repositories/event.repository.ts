import { Prisma, PrismaClient } from '@prisma/client'

import { prisma } from '@common/database'

import { Event } from '../models'

export class EventRepository {
  private prisma: PrismaClient = prisma

  async findById(id: number): Promise<Event | null> {
    const event = await this.prisma.event.findUnique({ where: { id } })

    return event
  }

  async findAll(where: Prisma.EventWhereInput): Promise<Event[]> {
    const events = await this.prisma.event.findMany({ where })

    return events
  }

  async exists({ id, idCreator }: { id?: number; idCreator?: number }) {
    const countOfEvents = await this.prisma.event.count({ where: { id, idCreator } })

    return countOfEvents > 0
  }
}
