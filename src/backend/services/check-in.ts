import { pipe } from 'fp-ts/lib/function'
import SQL from 'sql-template-strings'
import * as TE from 'fp-ts/TaskEither'
import { PgClient } from '../db'

const getCheckInStatus = (pg: PgClient, userId: string) =>
  pipe(
    pg.one<{ checked_in: boolean }>(
      SQL`SELECT true as checked_in FROM check_ins
          WHERE user_id = ${userId}
          AND CASE
            WHEN now() > current_date + interval '7 hour' THEN
              created_at > current_date + interval '7 hour'
              AND created_at < current_date + interval '1 day' + interval '7 hour'
            ELSE created_at < current_date + interval '7 hour'
          END`
    ),
    TE.map(({ checked_in }) => ({ checkedIn: checked_in })),
    TE.orElse(() => TE.of({ checkedIn: false }))
  )
export const checkIn = (pg: PgClient, userId: string) =>
  pipe(
    getCheckInStatus(pg, userId),
    TE.map(({ checkedIn }) => checkedIn),
    TE.chain(isCheckedIn =>
      isCheckedIn
        ? TE.of(null)
        : pg.any(SQL`INSERT INTO check_ins (user_id) VALUES (${userId})`)
    ),
    TE.map(() => ({ checkedIn: true }))
  )

export const getCheckIn = (pg: PgClient, userId: string) =>
  getCheckInStatus(pg, userId)
