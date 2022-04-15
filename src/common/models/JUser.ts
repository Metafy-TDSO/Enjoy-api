import { User } from '@modules/users/models'

export type JUser = Pick<User, 'id' | 'name' | 'email' | 'avatarUrl'>
