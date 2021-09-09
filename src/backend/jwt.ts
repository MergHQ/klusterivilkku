import jwt from 'jsonwebtoken'
import assert from 'assert'
import * as TE from 'fp-ts/TaskEither'
import * as t from 'io-ts'
import { createError } from './errors'
import { flow, pipe } from 'fp-ts/lib/function'

export const JwtPayload = t.type({
  id: t.string,
})

export type JwtPayload = t.TypeOf<typeof JwtPayload>

const tokenSecret = process.env.JWT_SECRET
assert(tokenSecret, 'JWT_SECRET must be set')

export const verify = (token: string) =>
  pipe(
    TE.tryCatch(
      () =>
        new Promise<unknown>((resolve, reject) => {
          jwt.verify(token, tokenSecret, (err, token) => {
            if (err) reject('Failed to verify token')
            resolve(token)
          })
        }),
      createError('jwt_error')
    ),
    TE.chain(
      flow(
        JwtPayload.decode,
        TE.fromEither,
        TE.mapLeft(createError('unauthorized'))
      )
    )
  )

export const sign = (payload: JwtPayload) =>
  TE.tryCatch(
    () =>
      new Promise<string>((resolve, reject) => {
        jwt.sign(payload, tokenSecret, { expiresIn: '2h' }, (err, token) => {
          if (err) reject('Failed to verify token')
          resolve(token!)
        })
      }),
    createError('jwt_error')
  )
