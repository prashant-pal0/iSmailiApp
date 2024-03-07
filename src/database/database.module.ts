import { DataSource, DataSourceOptions } from 'typeorm'
import * as dotenv from 'dotenv'
dotenv.config()
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  username: 'postgres' ,
  password: '9389110347',
  database: 'postgres',
  port: 5432,
  synchronize: false,
  entities: ['dist/modules/**/*.entity.js'],
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
