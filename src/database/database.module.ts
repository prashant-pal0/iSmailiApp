import { DataSource, DataSourceOptions } from 'typeorm'
import * as dotenv from 'dotenv'
dotenv.config()
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  port: parseInt(process.env.POSTGRES_PORT),
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false
    }
  },
  synchronize: true,
  entities: [__dirname + '/../**/**/*.entity.{js,ts}']
}

const initializeDataSource = async () => {
  const dataSourceConn = new DataSource(dataSourceOptions)
  try {
    await dataSourceConn.initialize()
    return dataSourceConn
  } catch (err) {
    console.error('Error during Data Source initialization', err)
  }
}

export const dataSource = initializeDataSource()
