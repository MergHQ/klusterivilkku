import * as TE from 'fp-ts/TaskEither'
import { PgClient } from '../db'
import { Request, Router } from 'express'
import { pipe } from 'fp-ts/lib/function'
import {
  createUser,
  fetchUserWithEmailAndPw,
  PostUserBody,
  UserLoginBody,
} from '../services/user'
import { createError } from '../errors'
import { sign } from '../jwt'
import { handle } from '../handlers'

const post = (pg: PgClient) => (req: Request) =>
  pipe(
    PostUserBody.decode(req.body),
    TE.fromEither,
    TE.mapLeft(createError('invalid_body')),
    TE.chain(createUser(pg))
  )

const postLogin = (pg: PgClient) => (req: Request) =>
  pipe(
    UserLoginBody.decode(req.body),
    TE.fromEither,
    TE.mapLeft(createError('invalid_body')),
    TE.chain(fetchUserWithEmailAndPw(pg)),
    TE.chain(({ id, firstName }) =>
      pipe(
        sign({ id }),
        TE.map(token => ({
          id,
          firstName,
          token,
          expiresAt: Date.now() + 7200 * 1000,
        }))
      )
    )
  )

export const createUserRoutes = (pg: PgClient) => {
  const userV1 = Router()

  userV1.post('/', handle(post(pg)))
  userV1.post('/login', handle(postLogin(pg)))

  return {
    userV1,
  }
}
