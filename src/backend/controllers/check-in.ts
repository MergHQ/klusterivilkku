import { PgClient } from '../db'
import { Router } from 'express'
import { handleWithAuth } from '../handlers'
import { checkIn, getCheckIn } from '../services/check-in'

export const createCheckInRoutes = (pg: PgClient) => {
  const checkInV1 = Router()

  checkInV1.put(
    '/',
    handleWithAuth((_, userId) => checkIn(pg, userId))
  )

  checkInV1.get(
    '/',
    handleWithAuth((_, userId) => getCheckIn(pg, userId))
  )

  return {
    checkInV1,
  }
}
