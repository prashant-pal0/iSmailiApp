// import {
//     applyDecorators,
//     CanActivate,
//     createParamDecorator,
//     ExecutionContext,
//     HttpException,
//     HttpStatus,
//     Injectable,
//     UseGuards,
//   } from '@nestjs/common'
//   import { errors } from 'error'
//   import * as jwt from 'jsonwebtoken'

//   import { getUserBy } from './user.repository'
//   import { UserService } from './user.service'
//   @Injectable()
//   export class AuthGuard implements CanActivate {
//     constructor(public readonly userService: UserService) {}
//     async canActivate(context: ExecutionContext): Promise<boolean> {
//       const req = context.switchToHttp().getRequest()
//       if (!req.headers.authorization && !(req.query.apiKey && req.query.email && req.query.operatorId)) return false
//       req.user = await this.validateToken(req.headers.authorization)
//       return true
//     }

//     async validateToken(auth: string) {
//       try {
//         console.log('heerrrrrrrrrrrrr')
//         if (auth.split(' ')[0] !== 'Bearer') throw new HttpException('Invalid access token', HttpStatus.FORBIDDEN)
//         const token = auth.split(' ')[1]
//       console.log(process.env.JWT_SECRET)
//         const decoded: any = jwt.verify(token, process.env.JWT_SECRET)
//         console.log(decoded)
//         const userDetails = await getUserBy({ phone: decoded.phone })
//         if (!userDetails) errors.UserNotFound
//         // await this.userService.checkEmailValidity(userDetails.email)
//         return decoded
//       } catch (error) {
//         throw errors.Logout
//       }
//     }
//   }

//   export function Auth() {
//     return applyDecorators(UseGuards(AuthGuard))
//   }

//   export const GetUserId = createParamDecorator((data, req): string => {
//     return req.args[0].user.id
//   })

//   export const GetOperatorId = createParamDecorator((data, req): string => {
//     return req.args[0].user.operatorId
//   })
