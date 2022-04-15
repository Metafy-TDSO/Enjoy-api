import {
  Prisma,
  PrismaClient,
  Event as PrismaEvent,
  Creator as PrismaCreator,
  User as PrismaUser
} from '@prisma/client'

import { prisma } from '@common/database'
import { OmitDbAttrs } from '@common/types/omit-db-attrs.type'

import { Creator, User } from '@modules/users/models'

import { Event, Location } from '../models'

export type JoinedEventCreator = Event & {
  creator: Pick<Creator, 'rating'> & Pick<User, 'id' | 'avatarUrl' | 'name'>
}

function serializePrismaEvent(
  event: PrismaEvent & {
    creator: PrismaCreator & {
      user: PrismaUser
    }
  }
): JoinedEventCreator {
  const { creator, ...eventInput } = event
  const { id: userId, name: userName, avatarUrl: userAvatar } = creator.user

  return {
    ...eventInput,
    creator: {
      rating: creator.rating,
      id: userId,
      name: userName,
      avatarUrl: userAvatar
    }
  }
}

export class EventRepository {
  private prisma: PrismaClient = prisma

  async findById(id: number): Promise<Event | null> {
    const event = await this.prisma.event.findUnique({ where: { id } })

    return event
  }

  async findAll({
    limit,
    page,
    where
  }: {
    where?: Prisma.EventWhereInput
    page: number
    limit: number
  }): Promise<JoinedEventCreator[]> {
    const events = await this.prisma.event.findMany({
      where,
      include: { creator: { include: { user: true } } },
      skip: limit * (page - 1),
      take: limit
    })

    const serializedEvents: JoinedEventCreator[] = events.map(serializePrismaEvent)

    return serializedEvents
  }

  async exists({ id, idCreator }: { id?: number; idCreator?: number }) {
    const countOfEvents = await this.prisma.event.count({ where: { id, idCreator } })

    return countOfEvents > 0
  }

  async findAllEventsInRadius({
    kilometers = 10,
    userLocation: { latitude, longitude }
  }: {
    kilometers?: number
    userLocation: Location
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
      include: { creator: { include: { user: true } } }
    })

    const serializedEvents = foundEvents.map(serializePrismaEvent)

    return serializedEvents
  }

  async save(eventInput: OmitDbAttrs<Event>): Promise<Event> {
    const createdEvent = await this.prisma.event.create({ data: eventInput })

    return createdEvent
  }
}
