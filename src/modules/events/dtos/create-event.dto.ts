import {
  IsDateString,
  IsLatitude,
  IsLongitude,
  IsNumberString,
  IsString,
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

  @IsDateString()
  startAt!: string

  @IsDateString()
  endsAt!: string

  @IsLatitude()
  latitude!: number

  @IsLongitude()
  longitude!: number

  @IsString()
  address!: string
}
