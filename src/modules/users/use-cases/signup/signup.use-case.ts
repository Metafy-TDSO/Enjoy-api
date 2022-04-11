import bcrypt from 'bcryptjs'

import { SignUpDto } from '../../dtos'
import { User } from '../../models'
import { UserRepository } from '../../repositories'

export class SignUpUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: SignUpDto): Promise<{ user: Omit<User, 'password'> }> {
    const { email, password, confirmPassword, birth, ...userInput } = input

    const numberOfEmails = await this.userRepository.exists({ email })

    if (numberOfEmails) {
      throw new Error('Usuário já existe')
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const createdUser = await this.userRepository.save({
      email,
      password: hashedPassword,
      birth: new Date(birth),
      ...userInput
    })

    const { password: createdPassword, ...userWithoutPassword } = createdUser

    return {
      user: userWithoutPassword
    }
  }
}
