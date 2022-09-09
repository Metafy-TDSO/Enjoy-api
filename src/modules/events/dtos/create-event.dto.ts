import { Prisma } from '@prisma/client'
import {
  IsDateString,
  IsLatitude,
  IsLongitude,
  IsNumberString,
  IsString,
  IsUrl,
  MaxLength
} from 'class-validator'

export class CreateEventDto {
  @IsNumberString()
  idCreator!: string

  @IsString()
  name!: string

  @IsString()
  @MaxLength(255)
  description!: string

  @IsUrl()
  imageUrl!: string

  @IsDateString()
  startAt!: string

  @IsDateString()
  endsAt!: string

  @IsLatitude()
  latitude!: Prisma.Decimal

  @IsLongitude()
  longitude!: Prisma.Decimal

  @IsString()
  address!: string
}
