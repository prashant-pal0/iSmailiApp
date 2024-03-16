import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe, Logger } from '@nestjs/common'
import * as compression from 'compression'
import * as basicAuth from 'express-basic-auth'
import * as helmet from 'helmet'
import * as morgan from 'morgan'

import { setupSwagger } from './swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe())
  // app.enable('trust proxy')
  app.use(helmet.default())
  app.use(compression())
  app.use(
    '/documentation',
    basicAuth({
      challenge: true,
      users: { [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD },
    })
  )
  app.use(morgan('combined'))
  setupSwagger(app)
  console.log(`Hey this app run on ${process.env.PORT} `)
  await app.listen(process.env.PORT)
}
bootstrap()
