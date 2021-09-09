import React from 'react'
import { login } from '../api'
import { Pages } from '../App'
import { ControlledInput, Submit } from '../components/controlled-input'
import { PageContainer, Title } from './base'

type Props = {
  setPage: (page: Pages) => void
}

export type LoginForm = {
  email: string
  password: string
}

const submit =
  (data: Partial<LoginForm>, setPage: Props['setPage']) =>
  (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    login(data)
      .then(() => setPage('home'))
      .catch(() => alert('Failed to login'))
  }

export const Login = ({ setPage }: Props) => {
  const [formBody, setFormBody] = React.useState<Partial<LoginForm>>({})

  const updateFormBody = (field: string, value: string) =>
    setFormBody({ ...formBody, [field]: value })

  return (
    <PageContainer>
      <Title>
        <h1>Log in</h1>
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
          label="Password"
          name="password"
          required
          type="password"
          onChange={updateFormBody}
        />
        <Submit label="Log in"></Submit>
      </form>
      <a href="#" onClick={() => setPage('signup')}>
        Sign up
      </a>
    </PageContainer>
  )
}
