import { Prisma, PrismaClient } from '@prisma/client'

import { prisma } from '@common/database'
import { OmitDbAttrs } from '@common/types/omit-db-attrs.type'

import { Creator, User } from '@modules/users/models'

import { Event, Location } from '../models'

export type JoinedEventCreator =
  | (Event & {
      creator: Pick<Creator, 'rating'> & { user: Pick<User, 'id' | 'name' | 'avatarUrl'> }
    })
  | {}

const defaultFindManyEventsSelect: Prisma.EventSelect = {
  id: true,
  name: true,
  description: true,
  address: true,
  idCreator: true,
  latitude: true,
  longitude: true,
  rating: true,
  endsAt: true,
  startAt: true,
  createdAt: true,
  updatedAt: true,
  creator: {
    select: {
      rating: true,
      user: {
        select: { id: true, name: true, avatarUrl: true }
      }
    }
  }
}

export class EventRepository {
  private prisma: PrismaClient = prisma

  async findById(
    id: number,
    select: Prisma.EventSelect = defaultFindManyEventsSelect
  ): Promise<JoinedEventCreator | null> {
    const event = await this.prisma.event.findUnique({ where: { id }, select })

    return event
  }

  async findAll({
    limit,
    page,
    where,
    select = defaultFindManyEventsSelect
  }: {
    where?: Prisma.EventWhereInput
    page: number
    limit: number
    select?: Prisma.EventSelect
  }): Promise<JoinedEventCreator[]> {
    const events = await this.prisma.event.findMany({
      where,
      skip: limit * (page - 1),
      take: limit,
      select
    })

    return events
  }

  async exists({ id, idCreator }: { id?: number; idCreator?: number }) {
    const countOfEvents = await this.prisma.event.count({ where: { id, idCreator } })

    return countOfEvents > 0
  }

  async findAllEventsInRadius({
    kilometers = 10,
    userLocation: { latitude, longitude },
    select = defaultFindManyEventsSelect
  }: {
    kilometers?: number
    userLocation: Location
    select?: Prisma.EventSelect
  }): Promise<JoinedEventCreator[]> {
    const foundNearEvents = await this.prisma.$queryRaw<Array<{ id: number; distance: number }>>`
      SELECT id_evento AS id, ( 6371 * 
      ACOS( 
          COS( RADIANS( vl_latitude ) ) * 
          COS( RADIANS( ${latitude} ) ) * 
          COS( RADIANS( ${longitude} ) - 
          RADIANS( vl_longitude ) ) + 
          SIN( RADIANS( vl_latitude ) ) * 
          SIN( RADIANS( ${latitude}) ) 
      ) ) AS distance
      FROM 
        tbl_evento
      HAVING distance <= ${kilometers}
    `

    const eventIds = foundNearEvents.map(({ id }) => id)

    const foundEvents = await this.prisma.event.findMany({
      where: { id: { in: eventIds } },
      select
    })

    return foundEvents
  }

  async save(eventInput: OmitDbAttrs<Event>): Promise<Event> {
    const createdEvent = await this.prisma.event.create({ data: eventInput })

    return createdEvent
  }
}
