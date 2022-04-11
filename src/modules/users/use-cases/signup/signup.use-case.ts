import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { JWT_SECRET } from '@constants/envs'
import { BadRequestError } from 'errors/http.errors'

import { SignUpDto } from '../../dtos'
import { User } from '../../models'
import { UserRepository } from '../../repositories'

export class SignUpUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: SignUpDto): Promise<{ user: Omit<User, 'password'>; token: string }> {
    const { email, name, password, confirmPassword, birth, ...userInput } = input

    const numberOfEmails = await this.userRepository.exists({ email })

    if (numberOfEmails) {
      throw BadRequestError('This user already exists.')
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const createdUser = await this.userRepository.save({
      email,
      name,
      password: hashedPassword,
      birth: new Date(birth),
      ...userInput
    })

    const { id, password: createdPassword, ...userWithoutPassword } = createdUser

    const signedToken = jwt.sign(
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
      user: { id, ...userWithoutPassword },
      token: signedToken
    }
  }
}
