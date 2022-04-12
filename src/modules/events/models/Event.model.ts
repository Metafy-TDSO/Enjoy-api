export interface Event {
  id: number
  name: string
  description: string
  rating?: number | null
  startAt: Date
  endsAt: Date
  idCreator: number
  createdAt?: Date | null
  updatedAt?: Date | null
  location?: number
}
