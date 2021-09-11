import React from 'react'
import styled from 'styled-components'
import { BmurData } from './api'
import { Footer } from './components/footer'
import { Home } from './pages/home'
import { Login } from './pages/login'
import { SignUp } from './pages/sign-up'
import { parseBmurData } from './utils'

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
`
export type Pages =
  | {
      name: 'login'
    }
  | { name: 'signup' }
  | { name: 'home'; userData: BmurData }

export const App = () => {
  const [page, setPage] = React.useState<Pages>(resolveInitialPage())

  return (
    <Container>
      {router(page, setPage)}
      <Footer />
    </Container>
  )
}

const router = (page: Pages, setPage: (pages: Pages) => void) => {
  switch (page.name) {
    case 'login':
      return <Login setPage={setPage} />
    case 'signup':
      return <SignUp setPage={setPage} />
    case 'home':
      return <Home setPage={setPage} userData={page.userData} />
  }
}

const resolveInitialPage = (): Pages => {
  const bmurData = localStorage.getItem('bmur_data')
  if (bmurData) {
    const parsedBmurData = parseBmurData(bmurData)
    if (parsedBmurData.expiresAt <= Date.now()) {
      localStorage.removeItem('bmur_data')
      return {
        name: 'login',
      }
    }
    return {
      name: 'home',
      userData: parsedBmurData,
    }
  }
  return {
    name: 'login',
  }
}
