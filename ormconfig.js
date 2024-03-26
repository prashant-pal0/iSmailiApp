const dotenv = require('dotenv')
const { DataSource } = require('typeorm')
dotenv.config()
console.log('migration run')
const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: +process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  entities: [__dirname + '/../**/**/*.entity.{js,ts}'],
  migrations: ['./src/*-migrations*{.ts,.js}'],
  synchronize: false,
  cli: {
    migrationsDir: 'src/migrations',
  },
})
exports.dataSource = dataSource
