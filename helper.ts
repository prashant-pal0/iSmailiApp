import { dataSource } from "src/database/database.module"
import { CreateDateColumn, EntitySchema, ObjectType, UpdateDateColumn } from "typeorm"

export abstract class CreatedModified {
    @CreateDateColumn()
    created!: Date
  
    @UpdateDateColumn()
    modified!: Date
  }


  export const defaultDomain = 'ismaili.app'

  
export function getSingleBy<T = any>(
    table: ObjectType<T> | EntitySchema<T>
  ): (filter: Partial<T>, columns?: any[], sortings?) => Promise<T> {
    return async (filter, columns?, sortings?) => {
      const condition: any = {
        where: filter,
      }
      if (columns?.length > 0) {
        condition.select = columns
      }
      if (sortings) {
        condition.order = sortings
      }
      const dataSourceFinal = await dataSource
      const repository = dataSourceFinal.getRepository(table)
      // console.log('repos', repository)
      return (await repository.findOne(condition)) || undefined
    }
  }
  
  export function getManyBy<T = any>(
    table: ObjectType<T> | EntitySchema<T>
  ): (filter: Partial<T>, columns?: any[], sortings?) => Promise<T[]> {
    return async (filter, columns?, sortings?) => {
      const condition: any = { where: filter }
      if (columns?.length > 0) {
        condition.select = columns
      }
      if (sortings) {
        condition.order = sortings
      }
      const dataSourceFinal = await dataSource
      const repository = dataSourceFinal.getRepository(table)
      return await repository.find(condition)
    }
  }


  export enum Constants {
    DefaultUserId = 1,
    OTPWaitingPeriod = 30,
    OTPExpiry = 5,
  }