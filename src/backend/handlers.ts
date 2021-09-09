import * as TE from 'fp-ts/TaskEither'
import { createError, Error } from './errors'
import { Request, Response } from 'express'
import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import { pipe } from 'fp-ts/lib/function'
import { verify } from './jwt'

const handlePromiseEither = <T>(
  promise: Promise<E.Either<Error, T>>,
  res: Response
) => {
  promise.then(
    E.fold(
      e => {
        console.log('ERROR')
        console.log('Error type:', e.type)
        console.log('Message:', e.message)
        res.sendStatus(e.status)
      },
      value => res.json(value)
    )
  )
}

export const handle =
  <T>(task: (req: Request) => TE.TaskEither<Error, T>) =>
  (req: Request, res: Response) => {
    const promise = task(req)()
    handlePromiseEither(promise, res)
  }

export const handleWithAuth =
  <T>(handler: (req: Request, userId: string) => TE.TaskEither<Error, T>) =>
  (req: Request, res: Response) => {
    const promise = pipe(
      O.fromNullable(req.headers.authorization),
      TE.fromOption(() =>
        createError('unauthorized')('No authorization header present')
      ),
      TE.chain(verify),
      TE.chain(tokenPayload => handler(req, tokenPayload.id))
    )()

    handlePromiseEither(promise, res)
  }
