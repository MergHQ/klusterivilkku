import * as t from 'io-ts'
import * as E from 'fp-ts/Either'
import { identity, pipe } from 'fp-ts/lib/function'

export const NonEmptyString = new t.Type<string, string, unknown>(
  'NonEmptyString',
  (u): u is string => t.string.is(u),
  (u, c) =>
    pipe(
      t.string.validate(u, c),
      E.map(s => s.trim()),
      E.chain(s => (s.length === 0 ? t.failure(u, c) : t.success(s)))
    ),
  identity
)
