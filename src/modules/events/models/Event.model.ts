export interface Event {
  id: number
  name: string
  description: string
  rating?: number | null
  startAt: Date
  endsAt: Date
  latitude: number
  longitude: number
  address: string
  idCreator: number
  createdAt?: Date | null
  updatedAt?: Date | null
}
