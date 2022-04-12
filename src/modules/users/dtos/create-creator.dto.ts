import { IsNumberString } from 'class-validator'

export class CreateCreatorDto {
  @IsNumberString()
  idUser!: string
}
