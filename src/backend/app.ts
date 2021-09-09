require('dotenv').config()
import assert from 'assert'
import express, { Request, Response, NextFunction } from 'express'
import { createCheckInRoutes } from './controllers/check-in'
import { createUserRoutes } from './controllers/user'
import { createPgClient } from './db'

const port = process.env.PORT ?? 3333

const dbUrl = process.env.DATABASE_URL
assert(dbUrl, 'DATABASE_URL must be set')

const app = express()

const pg = createPgClient(dbUrl)

const { userV1 } = createUserRoutes(pg)
const { checkInV1 } = createCheckInRoutes(pg)

if (process.env.NODE_ENV !== 'production')
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('access-control-allow-origin', '*')
    next()
  })

app.use(express.json())
app.use('/api/users', userV1)
app.use('/api/checkins', checkInV1)
app.use(express.static('dist', { maxAge: 0 }))

app.listen(port, () => console.log('Listening on', port, '🚀'))
