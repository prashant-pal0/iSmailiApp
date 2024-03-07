import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDTO } from './user.dto';
import * as bcrypt from 'bcrypt'
import uuid4 from "uuid4"
import * as jwt from 'jsonwebtoken'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) { }


  async createUser(userDTO: UserDTO) {
    try {
      const user = new User()
      const hashPassword = await bcrypt.hash(userDTO.password, 10)

      user.id = uuid4()
      user.email = userDTO.email
      user.password = hashPassword

      await this.userRepository.save(user)

      return {
        data: user.email,
        message: "User created succesfully"
      }

    } catch (error) {
      throw new Error(`you got an error ${error.message}`)
    }

  }


  async loginUser(userDTO: UserDTO) {
    try {
      const user = await this.userRepository.findBy({ email: userDTO.email })
      if (!user) throw new Error(`${userDTO.email} User not found`)

      const matchPassword = await bcrypt.compare(userDTO.password, user['password'])

      if (matchPassword) {
        const token = await this.generateToken(user)
        return {
          data: token,
          message: "User login succesfully"
        }
      } else {
        throw new Error('Invalid credentail')
      }


    } catch (error) {
      throw new Error(`you got an error ${error.message}`)
    }

  }


  async generateToken(user: any) {
    const id = user['id']
    const email = user['email']
    const payload = { sub: id, email }
    return jwt.sign(payload, 'seceretKey', { expiresIn: '1h' })
  }





}


