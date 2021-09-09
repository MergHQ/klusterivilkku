import { AxiosError } from 'axios'
import React from 'react'
import { getCheckin } from '../api'
import { Pages } from '../App'
import { PageContainer } from './base'

type Props = {
  setPage: (page: Pages) => void
}

export const Home = ({ setPage }: Props) => {
  const [checkedIn, setCheckedIn] = React.useState<boolean | null>(null)

  React.useEffect(() => {
    getCheckin()
      .then(({ checkedIn }) => setCheckedIn(checkedIn))
      .catch((e: AxiosError) =>
        e.response?.status === 401
          ? setPage('login')
          : alert('Something went wrong when fetching checkin status')
      )
  }, [])

  if (checkedIn === null)
    return (
      <PageContainer>
        <p>Loading...</p>
      </PageContainer>
    )

  return <PageContainer>{checkedIn ? 'yes' : 'no'}</PageContainer>
}
