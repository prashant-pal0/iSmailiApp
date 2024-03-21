import { CreatedModified } from 'helper'
import { Column, Entity, Index, PrimaryColumn, PrimaryGeneratedColumn, Unique } from 'typeorm'
import { EducationLevel, RolesEnum, UserInterface, VerificationCodeInterface, VerificationCodeTypeEnum, zodiacEnum } from './user.interface'
import { LookingForDTO } from './user.dto'

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
@Unique(['email', 'phone'])
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
  fullName: string

  @Column({ nullable: true })
  birthday: string

  @Column({
    nullable: true,
  })
  religion: string

  @Column({ nullable: true })
  height: string

  @Column({
    nullable: true,
  })
  gender: string

  @Column({
    nullable: true,
  })
  education: string

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  yourInterest: object

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  lookingFor: object

  @Column({
    nullable: true,
  })
  zodiac: string

  @Column({ nullable: true })
  smoke: string

  @Column({ nullable: true })
  drink: string

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

@Entity()
export class userImages extends CreatedModified {
  @PrimaryColumn()
  id: string

  @Column({ nullable: true })
  userId: string

  @Column({ type: 'jsonb', nullable: true })
  userImages: object
}
