
import { getSingleBy } from 'helpers'
import { dataSource } from 'src/database/database.module'


export async function getBulkInsert(tableName: string, column: string, value: string) {
  const sql = `
    INSERT 
      INTO ${tableName} ${column}
    VALUES ${value}`
  const result = await (await dataSource).query(sql, [])
  return result
}
