import * as pg from 'pg'
import * as TE from 'fp-ts/TaskEither'
import { SQLStatement } from 'sql-template-strings'
import { createError, Error } from './errors'
import { pipe } from 'fp-ts/lib/function'

export type PgClient = {
  none: (query: SQLStatement) => TE.TaskEither<Error, void>
  one: <T>(query: SQLStatement) => TE.TaskEither<Error, T>
  any: <T>(query: SQLStatement) => TE.TaskEither<Error, T[]>
}

export const createPgClient = (url: string): PgClient => {
  const client = new pg.Pool({ max: 5, min: 0, connectionString: url })

  return {
    none: statement =>
      pipe(
        TE.tryCatch(() => client.query(statement), createError('database')),
        TE.chain(res =>
          res.rowCount !== 0
            ? TE.left(createError('database')('Too many results'))
            : TE.of(undefined)
        )
      ),
    one: statement =>
      pipe(
        TE.tryCatch(() => client.query(statement), createError('database')),
        TE.chain(res =>
          res.rowCount !== 1
            ? TE.left(createError('not_found')('Expected 1, returned 0'))
            : TE.of(res.rows[0])
        )
      ),
    any: statement =>
      pipe(
        TE.tryCatch(() => client.query(statement), createError('database')),
        TE.map(res => res.rows)
      ),
  }
}
