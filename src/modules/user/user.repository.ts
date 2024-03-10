import { getManyBy, getSingleBy } from "helper";
import User, { VerificationCodes } from "./user.entity";

export const getVerificationCodesBy = getSingleBy(VerificationCodes)

export const getUserBy = getSingleBy(User)
export const getUsersBy = getManyBy(User)
