import { PrismaClient } from '@prisma/client'

import { prisma } from '@common/database'

import { User } from '../models'

export class UserRepository {
  private prisma: PrismaClient = prisma

  async findByEmail(email: string): Promise<User | null> {
    const user = this.prisma.user.findUnique({ where: { email } })

    return user
  }

  async findById(id: number): Promise<User | null> {
    const user = this.prisma.user.findUnique({ where: { id } })

    return user
  }

  async save(user: Omit<User, 'id' | 'updatedAt' | 'createdAt'>): Promise<User> {
    return this.prisma.user.create({ data: user })
  }

  async exists({ id, email }: { id?: number; email?: string }) {
    const countOfUsers = await this.prisma.user.count({ where: { id, email } })

    return countOfUsers > 0
  }
}
