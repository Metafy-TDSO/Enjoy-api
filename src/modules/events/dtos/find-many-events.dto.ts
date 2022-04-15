import { Prisma } from '@prisma/client'
import { IsLatitude, IsLongitude, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'

export class FindManyEventsDto {
  @IsNumber()
  @Min(1)
  @IsOptional()
  page = 1

  @IsNumber()
  @Min(1)
  @IsOptional()
  limit = 50

  @IsString()
  @IsOptional()
  name?: string

  @IsNumber()
  @IsOptional()
  idCreator?: number

  @IsLatitude()
  @IsOptional()
  latitude?: Prisma.Decimal

  @IsLongitude()
  @IsOptional()
  longitude?: Prisma.Decimal

  @IsNumber()
  @Max(5)
  @Min(0)
  @IsOptional()
  rating?: number
}
