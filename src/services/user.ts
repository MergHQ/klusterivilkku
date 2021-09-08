import * as t from 'io-ts'
import { NonEmptyString } from '../types'

export const User = t.type({
  id: t.string,
  firstName: t.string,
  lastName: t.string,
  email: t.string,
  createdAt: t.string,
})

export type User = t.TypeOf<typeof User>

export const PostUserBody = t.type({
  firstName: NonEmptyString,
  lastName: NonEmptyString,
  email: NonEmptyString,
  password: NonEmptyString,
  passwordConfirm: NonEmptyString,
})

export type PostUserBody = t.TypeOf<typeof PostUserBody>
