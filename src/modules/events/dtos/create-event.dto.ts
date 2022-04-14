import {
  IsDate,
  IsLatitude,
  IsLongitude,
  IsNumberString,
  IsString,
  MaxLength
} from 'class-validator'

export class CreateEventDto {
  @IsNumberString()
  idCreator!: number

  @IsString()
  name!: string

  @IsString()
  @MaxLength(255)
  description!: string

  @IsDate()
  startAt!: Date

  @IsDate()
  endsAt!: Date

  @IsLatitude()
  latitude!: number

  @IsLongitude()
  longitude!: number

  @IsString()
  address!: string
}
