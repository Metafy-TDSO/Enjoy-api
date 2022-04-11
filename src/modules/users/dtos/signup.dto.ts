import {
  IsDateString,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  Matches,
  MaxLength
} from 'class-validator'

import { createStringRequirements } from '@common/utils/regexp.util'

export class SignUpDto {
  @IsString({ message: 'Insert a valid name!' })
  @MaxLength(72)
  name!: string

  @IsEmail({}, { message: 'Insert a valid email!' })
  @MaxLength(72)
  email!: string

  @IsDateString({}, { message: 'Insert a valid date in the format: YYYY-MM-DD!' })
  birth!: Date

  @IsString({ message: 'Insert a valid password!' })
  @Matches(createStringRequirements(), {
    message:
      'Password too weak! Include at least 8 characters with at least one uppercase and lowercase letter'
  })
  password!: string

  @IsString({ message: 'You must confirm your password!' })
  confirmPassword!: string

  @IsPhoneNumber('BR', { message: 'Insert a valid phone!' })
  phone!: string

  @IsUrl({}, { message: 'Insert a valid image url!' })
  @IsOptional()
  avatarUrl?: string
}
