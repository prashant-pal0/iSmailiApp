import { getManyBy, getSingleBy } from 'helper'
import { Users, VerificationCodes } from './user.entity'
import { dataSource } from 'src/database/database.module'

export const getVerificationCodesBy = getSingleBy(VerificationCodes)

export const getUserBy = getSingleBy(Users)
export const getUsersBy = getManyBy(Users)

export async function getUserDetails(userId: string) {
  const sql = `
    SELECT
     *
    FROM
      "users" as "u"
    WHERE
      "u"."id" = $1`
  const [result] = await (await dataSource).query(sql, [userId])
  return result
}

export async function getUserFind(phone: string) {
  const sql = `
    SELECT
     *
    FROM
      "users" as "u"
    WHERE
      "u"."id" = $1`
  const [result] = await (await dataSource).query(sql, [phone])
  return result
}
