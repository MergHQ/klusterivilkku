import React from 'react'
import styled from 'styled-components'
import { Home } from './pages/home'
import { Login } from './pages/login'
import { SignUp } from './pages/sign-up'
import { parseBmurData } from './utils'

const Container = styled.div`
  width: 100vw;
`
export type Pages = 'login' | 'signup' | 'home'

export const App = () => {
  const [page, setPage] = React.useState<Pages>(resolveInitialPage())

  return <Container>{router(page, setPage)}</Container>
}

const router = (page: Pages, setPage: (pages: Pages) => void) => {
  switch (page) {
    case 'login':
      return <Login setPage={setPage} />
    case 'signup':
      return <SignUp setPage={setPage} />
    case 'home':
      return <Home setPage={setPage} />
  }
}

const resolveInitialPage = (): Pages => {
  const bmurData = localStorage.getItem('bmur_data')
  if (bmurData) {
    if (parseBmurData(bmurData).expiresAt <= Date.now()) {
      localStorage.removeItem('bmur_data')
      return 'login'
    }
    return 'home'
  }
  return 'login'
}
