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
    ZeroAddress = '0x0000000000000000000000000000000000000000',
    DefaultUnpackRecipient = 'unbox.owens',
    NotAvailable = 'NA',
    OwensOperatorId = '1',
    DefaultPage = 1,
    DefaultLimit = 10,
    MaxListPrice = 999999,
    // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
    MinListPrice = 1,
    LargeDate = '2122-01-01 00:00:00',
    SignMessage = 'Sig this message from your wallet',
    DefaultTemplateExternalId = -1,
    NoDataFound = 'No Data Found',
    TransferTopic721Ethereum = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
    TransferTopic1155Ethereum = '0x4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb',
    AllOperators = 0,
    ERC721InterfaceHash = '0x80ac58cd',
    DefaultAssetId = -1,
    DefaultAPIKeyDays = 30,
    // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
    LockBuffer = 1,
    ReminderBuffer = 5,
    MaxMetadataReloadRetry = 3,
    DefaultUserId = 1,
    OTPWaitingPeriod = 30,
    OTPExpiry = 5,
    rewardPointsExpireMessage = `Reward points expired following the rolling window period.`,
    cpuUsageThreshold = 80,
    netUsageThreshold = 90,
    ramUsageThreshold = 90,
  }