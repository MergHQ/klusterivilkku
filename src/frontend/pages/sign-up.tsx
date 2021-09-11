import React from 'react'
import { signUp } from '../api'
import { Pages } from '../App'
import { ControlledInput, Submit } from '../components/controlled-input'
import { PageContainer, Title } from './base'

type Props = {
  setPage: (page: Pages) => void
}

export type CreateUserFormBody = {
  email: string
  firstName: string
  lastName: string
  password: string
  passwordConfirm: string
}

const validatePassword = (value: string) =>
  value.length < 8
    ? 'Password too short'
    : value.length > 128
    ? 'Password too long'
    : null

const validatePasswordConfirm = (password?: string) => (value: string) =>
  password !== value ? 'Passwords do no match' : null

const submit =
  (data: Partial<CreateUserFormBody>, setPage: Props['setPage']) =>
  (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    signUp(data)
      .then(() => setPage({ name: 'login' }))
      .catch(() => alert('Failed to create user'))
  }

export const SignUp = ({ setPage }: Props) => {
  const [formBody, setFormBody] = React.useState<Partial<CreateUserFormBody>>(
    {}
  )

  const updateFormBody = (field: string, value: string) =>
    setFormBody({ ...formBody, [field]: value })

  return (
    <PageContainer>
      <Title>
        <h1>Sign up</h1>
      </Title>
      <form onSubmit={submit(formBody, setPage)}>
        <ControlledInput
          label="Email"
          name="email"
          required
          type="email"
          onChange={updateFormBody}
        />
        <ControlledInput
          label="First name"
          name="firstName"
          required
          type="text"
          onChange={updateFormBody}
        />
        <ControlledInput
          label="Last name"
          name="lastName"
          required
          type="text"
          onChange={updateFormBody}
        />
        <ControlledInput
          label="Password"
          name="password"
          required
          type="password"
          validate={validatePassword}
          onChange={updateFormBody}
        />
        <ControlledInput
          label="Confirm password"
          name="passwordConfirm"
          required
          type="password"
          validate={validatePasswordConfirm(formBody?.password)}
          onChange={updateFormBody}
        />
        <Submit label="Sign up"></Submit>
      </form>
    </PageContainer>
  )
}
