import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './user.dto';
import { Auth, GetUserId } from './user.auth';

@Controller('user')

export class UserController {
  constructor(private readonly userService:UserService ) {}

  @Post('/signup')
  async createUser(@Body() userDTO: UserDTO) {
     return this.userService.createUser(userDTO);
  }

  
  @Post('/login')
  async loginUser(@Body() userDTO: UserDTO) {
      return this.userService.loginUser(userDTO);
   }
  
}


