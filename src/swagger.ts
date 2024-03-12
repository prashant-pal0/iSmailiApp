import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { INestApplication } from '@nestjs/common'

import { UserModule } from './modules/user/user.module'

import { SwaggerTheme } from 'swagger-themes'
import { CommonModule } from './modules/common/common.module'

export function setupSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('ISmaili BACKEND DOCUMENTATION')
    .setDescription(
      `
  This is ISmaili API documentation, APIs are divided into various categories based on usage of APIs.
  API are organized around REST. Our API are secured and has standard resource-oriented URLs, accepts form-encoded request 
  bodies, returns JSON-encoded responses, and uses standard HTTP response codes. Our APIs
  can be easily integrated with any platform or app and provide seamless user experience.`
    )
    .setVersion('1')
    .addBearerAuth()
    // .setExternalDoc('For more details click here', 'https://api-guide.owens.market')
    // .setTermsOfService('https://www.owens.market/terms-of-use')
    // .setContact('', '', 'techsupport@owens.market')
    .addTag('User', 'User related operations')
    .build()

  const document = SwaggerModule.createDocument(app, options, {
    include: [
      UserModule,
      CommonModule
    ],
  })

  if (document.components?.securitySchemes) {
    delete document.components.securitySchemes['bearerAuth'] // Remove the default Bearer Authorization
  }

  const theme = new SwaggerTheme('v3')
  const themeOptions = {
    explorer: false
    // customCss:
    //   theme.getBuffer('classic').toString() +
    //   `
    //   .swagger-ui .model .property{
    //     display: none
    //   }
    //   `,
  }
  SwaggerModule.setup('documentation', app, document, themeOptions)
}
