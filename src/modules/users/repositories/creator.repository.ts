import { PrismaClient } from '@prisma/client'

import { prisma } from '@common/database'

import { Creator } from '../models'

export class CreatorRepository {
  private prisma: PrismaClient = prisma

  async findById(id: number): Promise<Creator | null> {
    const creator = this.prisma.creator.findUnique({ where: { id } })

    return creator
  }

  async findByUserId(idUser: number): Promise<Creator | null> {
    const creator = this.prisma.creator.findUnique({ where: { idUser } })

    return creator
  }

  async save(creator: Omit<Creator, 'id' | 'updatedAt' | 'createdAt'>): Promise<Creator> {
    return this.prisma.creator.create({ data: creator })
  }

  async exists({ id, idUser }: { id?: number; idUser?: number }) {
    const countOfCreators = await this.prisma.creator.count({ where: { id, idUser } })

    return countOfCreators > 0
  }
}
