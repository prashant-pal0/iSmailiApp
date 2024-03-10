import { DataSource, DataSourceOptions } from 'typeorm'
import * as dotenv from 'dotenv'
dotenv.config()
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'root',
  database: 'ismaili',
  port: 5432,
  synchronize: true,
  entities: [__dirname + '/../**/**/*.entity.{js,ts}']
}

const initializeDataSource = async () => {
  const dataSourceConn = new DataSource(dataSourceOptions)
  try {
    console.log('dataSourceOptions', dataSourceOptions)
    await dataSourceConn.initialize()
    return dataSourceConn
  } catch (err) {
    console.error('Error during Data Source initialization', err)
  }
}

export const dataSource = initializeDataSource()
