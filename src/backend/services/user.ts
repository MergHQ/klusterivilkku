import { pipe } from 'fp-ts/lib/function'
import * as t from 'io-ts'
import { PgClient } from '../db'
import { NonEmptyString } from '../types'
import * as TE from 'fp-ts/TaskEither'
import { createError } from '../errors'
import { hash, verify } from 'argon2'
import SQL from 'sql-template-strings'

const PASSWORD_MIN_LENGTH = 8
const PASSWORD_MAX_LENGTH = 128

export const User = t.type({
  id: t.string,
  firstName: t.string,
  lastName: t.string,
  email: t.string,
  createdAt: t.string,
})

export type User = t.TypeOf<typeof User>

type FullDbUser = {
  id: string
  first_name: string
  last_name: string
  email: string
  created_at: string
  password: string
}

export const PostUserBody = t.type({
  firstName: NonEmptyString,
  lastName: NonEmptyString,
  email: NonEmptyString,
  password: NonEmptyString,
  passwordConfirm: NonEmptyString,
})

export type PostUserBody = t.TypeOf<typeof PostUserBody>

export const UserLoginBody = t.type({
  email: NonEmptyString,
  password: NonEmptyString,
})

export type UserLoginBody = t.TypeOf<typeof UserLoginBody>

const verifyPasswords = (body: PostUserBody) =>
  pipe(
    TE.of(body.password === body.passwordConfirm),
    TE.chain(passwordsMatch =>
      passwordsMatch
        ? TE.of(body)
        : TE.left(createError('invalid_body')('Passwords do not match'))
    )
  )

const hashPassword = (password: string) =>
  pipe(
    TE.of(password),
    TE.chain(pw =>
      pw.length < PASSWORD_MIN_LENGTH || pw.length > PASSWORD_MAX_LENGTH
        ? TE.left(createError('invalid_body')('Password length is not allowed'))
        : TE.of(pw)
    ),
    TE.chain(pw => TE.tryCatch(() => hash(pw), createError('internal_error')))
  )

const comparePasswords = (givenPassword: string, hash: string) =>
  TE.tryCatch(() => verify(hash, givenPassword), createError('invalid_body'))

export const createUser = (pg: PgClient) => (body: PostUserBody) =>
  pipe(
    verifyPasswords(body),
    TE.chain(body =>
      pipe(
        hashPassword(body.password),
        TE.chain(hash =>
          pg.any(
            SQL`
              INSERT INTO users (first_name, last_name, email, password) VALUES (
                ${body.firstName},
                ${body.lastName},
                ${body.email},
                ${hash}
              )`
          )
        )
      )
    )
  )

export const fetchUserWithEmailAndPw =
  (pg: PgClient) => (body: UserLoginBody) =>
    pipe(
      pg.one<FullDbUser>(SQL`SELECT * FROM users WHERE email = ${body.email}`),
      TE.chain(fullDbUser =>
        pipe(
          comparePasswords(body.password, fullDbUser.password),
          TE.map(() => ({
            id: fullDbUser.id,
            firstName: fullDbUser.first_name,
            lastName: fullDbUser.last_name,
            email: fullDbUser.email,
            createdAt: fullDbUser.created_at,
          }))
        )
      )
    )
