import { AxiosError } from 'axios'
import React from 'react'
import { BmurData, checkIn, getCheckin } from '../api'
import { Pages } from '../App'
import Spinner from '../components/loading-icon'
import { PageContainer, Title } from './base'
import styled, { keyframes } from 'styled-components'

type Props = {
  setPage: (page: Pages) => void
  userData: BmurData
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const CheckedInBox = styled.div`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #5aa469;
  border-radius: 50%;
  height: 250px;
  width: 250px;
  color: white;
  text-align: center;
  display: flex;
  align-items: center;
  padding: 1em;
`

const CheckedInBoxTitle = styled.div`
  font-size: 32px;
`

const CheckedInBoxSubtitle = styled.div`
  font-size: 16px;
`

const NotCheckedInText = styled.h2`
  color: #d35d6e;
`

const buttonAnimation = keyframes`
  0% {
    box-shadow: 0px 0px 14px #5aa469;
  }

  50% {
    box-shadow: 0px 0px 40px #5aa469;
  }

  100% {
    box-shadow: 0px 0px 14px #5aa469;
  }
`

const NotCheckedInWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const NotCheckedInButton = styled.button`
  margin-top: 40px;
  background: white;
  border-radius: 50%;
  height: 250px;
  width: 250px;
  font-size: 32px;
  color: black;
  text-align: center;
  padding: 1em;
  border: 2px solid #5aa469;
  box-shadow: 0px 0px 14px #5aa469;
  animation: ${buttonAnimation} 2s linear infinite;
`

const CheckedIn = () => (
  <CheckedInBox>
    <CheckedInBoxTitle>you are checked in 🎉</CheckedInBoxTitle>
    <CheckedInBoxSubtitle>
      you will automagically be checked out at 7am
    </CheckedInBoxSubtitle>
  </CheckedInBox>
)

const handleCheckInClick =
  (setCheckedIn: (val: boolean) => void, setPage: Props['setPage']) => () =>
    checkIn()
      .then(({ checkedIn }) => setCheckedIn(checkedIn))
      .catch((e: AxiosError) =>
        e.response?.status === 401
          ? setPage({ name: 'login' })
          : alert('Something went wrong while checking in')
      )

const NotCheckedIn = ({ onCheckIn }: { onCheckIn: () => void }) => {
  return (
    <NotCheckedInWrapper>
      <NotCheckedInText>you are not checked in</NotCheckedInText>
      <NotCheckedInButton onClick={onCheckIn}>check in</NotCheckedInButton>
    </NotCheckedInWrapper>
  )
}

export const Home = ({ setPage, userData }: Props) => {
  const [checkedIn, setCheckedIn] = React.useState<boolean | null>(null)

  const onCheckInClick = handleCheckInClick(setCheckedIn, setPage)

  React.useEffect(() => {
    getCheckin()
      .then(({ checkedIn }) => setCheckedIn(checkedIn))
      .catch((e: AxiosError) =>
        e.response?.status === 401
          ? setPage({ name: 'login' })
          : alert('Something went wrong when fetching checkin status')
      )
  }, [])

  return (
    <PageContainer>
      <Title>
        <h1>Hello {userData.firstName}!</h1>
      </Title>
      <Wrapper>
        {checkedIn === null ? (
          <Spinner />
        ) : checkedIn ? (
          <CheckedIn />
        ) : (
          <NotCheckedIn onCheckIn={onCheckInClick} />
        )}
      </Wrapper>
    </PageContainer>
  )
}
