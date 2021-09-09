export type Error =
  | {
      type: 'database'
      message: unknown
      status: number
    }
  | {
      type: 'not_found'
      message: unknown
      status: number
    }
  | {
      type: 'unauthorized'
      message: unknown
      status: number
    }
  | {
      type: 'invalid_body'
      message: unknown
      status: number
    }
  | {
      type: 'internal_error'
      message: unknown
      status: number
    }
  | {
      type: 'jwt_error'
      message: unknown
      status: number
    }

export const createError =
  (error: Error['type']) =>
  (message: Error['message']): Error => {
    switch (error) {
      case 'database':
        return {
          type: 'database',
          message: JSON.stringify(message),
          status: 500,
        }
      case 'not_found':
        return {
          type: 'not_found',
          message: JSON.stringify(message),
          status: 404,
        }
      case 'unauthorized':
        return {
          type: 'unauthorized',
          message: JSON.stringify(message),
          status: 401,
        }
      case 'invalid_body':
        return {
          type: 'invalid_body',
          message: JSON.stringify(message),
          status: 400,
        }
      case 'internal_error':
        return {
          type: 'internal_error',
          message: JSON.stringify(message),
          status: 500,
        }
      case 'jwt_error':
        return {
          type: 'jwt_error',
          message: JSON.stringify(message),
          status: 500,
        }
    }
  }
