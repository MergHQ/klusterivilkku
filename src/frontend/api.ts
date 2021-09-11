import axios, { AxiosError } from 'axios'
import { LoginForm } from './pages/login'
import { CreateUserFormBody } from './pages/sign-up'
import { parseBmurData } from './utils'

const apiClient = axios.create({
  baseURL: '/api',
})

export type BmurData = {
  id: string
  firstName: string
  token: string
  expiresAt: number
}

type CheckInResponse = {
  checkedIn: boolean
}

const getAndParseBmurData = () => {
  const bmurData = localStorage.getItem('bmur_data')
  if (!bmurData) return Promise.reject('Bmur data missing')

  return Promise.resolve(parseBmurData(bmurData))
}

export const signUp = (formData: Partial<CreateUserFormBody>) =>
  apiClient.post('/users', formData)

export const login = (loginBody: Partial<LoginForm>) =>
  apiClient.post<BmurData>('/users/login', loginBody).then(res => {
    localStorage.setItem('bmur_data', JSON.stringify(res.data))
    return res.data
  })

export const getCheckin = () =>
  getAndParseBmurData()
    .then(({ token }) =>
      apiClient.get<CheckInResponse>('/checkins', {
        headers: { authorization: token },
      })
    )
    .then(res => res.data)

export const checkIn = () =>
  getAndParseBmurData().then(({ token }) =>
    apiClient
      .put<CheckInResponse>('/checkins', null, {
        headers: { authorization: token },
      })
      .then(res => res.data)
  )
