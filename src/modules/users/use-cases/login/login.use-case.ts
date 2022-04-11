import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { LoginDto } from '@modules/users/dtos'
import { UserRepository } from '@modules/users/repositories'

import { JWT_SECRET } from '@constants/envs'
import { BadRequestError, NotFoundError } from 'errors/http.errors'

import { User } from '../../models'

export class LoginUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: LoginDto): Promise<{ user: Omit<User, 'password'>; token: string }> {
    const { email, password } = input

    const foundUser = await this.userRepository.findByEmail(email)

    if (!foundUser) {
      throw NotFoundError('User not found')
    }

    const { id, name, password: hashedPassword, ...userWithoutPassword } = foundUser

    const comparedPassword = await bcrypt.compare(password, hashedPassword)

    if (!comparedPassword) {
      throw BadRequestError('Wrong password')
    }

    const token = jwt.sign(
      {
        id,
        name,
        email
      },
      JWT_SECRET,
      {
        issuer: 'metafy',
        expiresIn: '1m'
      }
    )

    return {
      user: { id, name, ...userWithoutPassword },
      token
    }
  }
}
