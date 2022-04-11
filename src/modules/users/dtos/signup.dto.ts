import { IsDateString, IsEmail, IsOptional, IsString, Matches, MaxLength } from 'class-validator'

import { createStringRequirements } from 'utils/regexp.util'

export class SignUpDto {
  @IsString()
  @MaxLength(72)
  name!: string

  @IsEmail()
  @MaxLength(72)
  email!: string

  @IsDateString()
  birth!: Date

  @IsString()
  @Matches(createStringRequirements(), {
    message:
      'Password too weak! Include at least 8 characters with at least one uppercase and lowercase letter'
  })
  password!: string

  @IsString()
  confirmPassword!: string

  @IsString()
  phone!: string

  @IsString()
  @MaxLength(72)
  @IsOptional()
  avatarUrl?: string
}
