import { BadRequestError, NotFoundError } from '@common/errors/http.errors'

import { CreateCreatorDto } from '../../dtos'
import { Creator } from '../../models'
import { UserRepository, CreatorRepository } from '../../repositories'

export class CreateCreatorUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly creatorRepository: CreatorRepository
  ) {}

  async execute(input: CreateCreatorDto): Promise<{ creator: Creator }> {
    const idUser = Number(input.idUser)

    const userExists = await this.userRepository.exists({ id: idUser })

    if (!userExists) {
      throw NotFoundError(`This user doesn't exist.`)
    }

    const creatorExists = await this.creatorRepository.exists({ idUser })

    if (!creatorExists) {
      throw BadRequestError('This user already is a creator.')
    }

    const createdCreator = await this.creatorRepository.save({ idUser })

    return {
      creator: createdCreator
    }
  }
}
