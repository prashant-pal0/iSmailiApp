import { CreatedModified } from 'helper';
import { Column, Entity, Index, PrimaryColumn, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { RolesEnum, UserInterface, VerificationCodeInterface, VerificationCodeTypeEnum } from './user.interface';
 

 
@Entity()
@Index(['userId', 'code'])
export class VerificationCodes extends CreatedModified implements VerificationCodeInterface {
  @PrimaryColumn()
  userId: string

  @Column({ nullable: true })
  code: string

  @Column({ nullable: false })
  phone: string

  @Column({ default: VerificationCodeTypeEnum.Phone })
  verificationCodeType: VerificationCodeTypeEnum
}


@Entity()
@Unique('emailoperator', ['email', 'operatorId'])
@Unique('phoneoperator', ['phone', 'operatorId'])
@Unique(['email', 'operatorId'])
export class Users extends CreatedModified implements UserInterface {
  @PrimaryColumn()
  id: string

  @Index()
  @Column({ nullable: true })
  email: string

  @Column({ default: false })
  deleted: boolean

  @Column({ default: false })
  emailVerified: boolean

  @Column({ nullable: true })
  name: string

  @Column({ nullable: true })
  fbId: string

  @Column({ nullable: true })
  instaId: string

  @Index()
  @Column({ default: 1 })
  operatorId: number

  @Column({ nullable: true })
  googleId: string

  @Index()
  @Column({ nullable: true })
  phone: string

  @Column({ default: false })
  isPhoneVerified: boolean


  @Column({ nullable: true })
  bio: string

  @Column({ nullable: true })
  profilePic: string

  @Column({ type: 'jsonb', nullable: true })
  socialProfile: object

  @Column({ nullable: true })
  lastLogin: Date

  @Index()
  @Column({ default: RolesEnum.User })
  role: RolesEnum
}


