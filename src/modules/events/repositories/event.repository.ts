import { Prisma, PrismaClient } from '@prisma/client'

import { prisma } from '@common/database'
import { OmitDbAttrs } from '@common/types/omit-db-attrs.type'

import { Event } from '../models'

interface Location {
  latitude: number
  longitude: number
}

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

  async findAllEventsInRadius({
    meters = 10000,
    userLocation: { latitude, longitude }
  }: {
    meters?: number
    userLocation: Location
  }) {
    const userGeoPoint = `ST_GeomFromText('POINT(${latitude} ${longitude})', 4326)`

    const foundEvents = await this.prisma.$queryRaw<Event[]>`
      SELECT * from tbl_evento WHERE ST_Distance(${userGeoPoint}, lc_localizacao, 'metre') <= ${meters}
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

      await this.prisma.$executeRaw`
        INSERT INTO tbl_evento (ds_nome, ds_descricao, dt_inicio, dt_fim, id_criador, lc_localizacao) 
        VALUES (${name}, ${description}, ${startAt.toISOString()}, ${endsAt.toISOString()}, ${idCreator}, ${geoPoints})
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
