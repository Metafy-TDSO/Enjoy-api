import { Prisma, PrismaClient } from '@prisma/client'
import { startOfHour, format } from 'date-fns'

import { prisma } from '@common/database'
import { OmitDbAttrs } from '@common/types/omit-db-attrs.type'

import { Creator, User } from '@modules/users/models'

import { Event } from '../models'

export interface Location {
  latitude: number
  longitude: number
}

export type JoinedEventCreator = Event & { creator: Pick<Creator, 'rating'>; user: User }

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
      include: { creator: { select: { rating: true }, include: { user: true } } },
      skip: limit * (page - 1),
      take: limit
    })

    const serializedEvents = events.map(({ creator, ...eventInput }) => ({
      user: creator.user,
      creator: {
        rating: creator.rating
      },
      ...eventInput
    }))

    return serializedEvents
  }

  async exists({ id, idCreator }: { id?: number; idCreator?: number }) {
    const countOfEvents = await this.prisma.event.count({ where: { id, idCreator } })

    return countOfEvents > 0
  }

  async findAllEventsInRadius({
    meters = 10000,
    userLocation: { latitude, longitude }
  }: {
    meters?: number
    userLocation: Location
  }): Promise<JoinedEventCreator[]> {
    const userGeoPoint = `ST_GeomFromText('POINT(${latitude} ${longitude})', 4326)`

    const foundEvents = await this.prisma.$queryRaw<JoinedEventCreator[]>`
      SELECT event.*, creator.vl_avaliacao, user.* FROM tbl_evento event
      INNER JOIN tbl_criador creator ON event.id_criador = creator.id_criador
      INNER JOIN tbl_usuario user ON creator.id_usuario = user.id_usuario
      WHERE ST_Distance(${userGeoPoint}, event.lc_localizacao, 'metre') <= ${meters}
    `

    return foundEvents
  }

  async save({
    description,
    endsAt,
    idCreator,
    latitude,
    longitude,
    name,
    startAt
  }: OmitDbAttrs<Omit<Event, 'localization'>> & Location): Promise<Event | null> {
    try {
      const geoPoints = `ST_GeomFromText('POINT(${latitude} ${longitude})', 4326)`

      const formatedStartDate = format(startOfHour(new Date(startAt)), 'yyyy-MM-dd hh:mm:ss')
      const formatedEndDate = format(startOfHour(new Date(endsAt)), 'yyyy-MM-dd hh:mm:ss')

      await this.prisma.$executeRaw`
        INSERT INTO tbl_evento (ds_nome, ds_descricao, dt_inicio, dt_fim, id_criador, lc_localizacao) 
        VALUES (${name}, ${description}, ${formatedStartDate}, ${formatedEndDate}, ${idCreator}, ${geoPoints})
      `

      const createdEvent = await this.prisma.$queryRaw<Event>`
        SELECT * FROM tbl_evento 
        WHERE id_evento=(
          SELECT max(id_evento) FROM tbl_evento
        )
      `

      return createdEvent
    } catch (error) {
      console.log(error)
      return null
    }
  }
}
