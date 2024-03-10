import { getManyBy, getSingleBy } from 'helper'
import { Users, VerificationCodes } from './user.entity'

export const getVerificationCodesBy = getSingleBy(VerificationCodes)

export const getUserBy = getSingleBy(Users)
export const getUsersBy = getManyBy(Users)
