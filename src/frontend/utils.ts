import { BmurData } from './api'

export const parseBmurData = (value: string): BmurData => JSON.parse(value)
