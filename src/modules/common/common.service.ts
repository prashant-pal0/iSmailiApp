import { BadRequestException, ForbiddenException, Injectable, Logger, HttpException, HttpStatus, forwardRef, Inject } from '@nestjs/common'
import { decryptString } from 'helpers'
import { uuid } from 'uuidv4'

import { ConfigService } from '@nestjs/config'
import {
  IPFSlistInterface,
  S3FileInterface} from './common.interface'

import { pinataIPFS, uploadToS3 } from './pinata'

import {  IPFSlist,  S3List } from './common.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { HttpService } from '@nestjs/axios'

@Injectable()
export class CommonService {
  logger: Logger
  constructor(
    public readonly configService: ConfigService,
    @InjectRepository(IPFSlist)
    public readonly ipfsListRepository: Repository<IPFSlist>,
    @InjectRepository(S3List)
    public readonly s3ListRepository: Repository<S3List>,
  ) {
    this.logger = new Logger()
  }

  /**
   * This function is to get the IPFS url for a file
   * @param {String} filename
   * @param {String} userId
   * @returns {Promise<Object>}
   * @throws {BadRequestException} Error
   */
  async getIPFS(filename: string, userId: string) {
    try {
      console.log("hello this")
      const pinataResp = await pinataIPFS(filename)
      const obj: IPFSlistInterface = {
        id: uuid(),
        userId: userId,
        ipfs: pinataResp.IpfsHash,
      }
      await this.ipfsListRepository.insert(obj)
      return { data: { ipfs: process.env.IPFS + pinataResp.IpfsHash } }
    } catch (error) {
      this.logger.error(error.message)
      throw new BadRequestException(error.message)
    }
  }

  /**
   * This function is to get the S3 url for a file
   * @param {String} filename
   * @param {String} userId
   * @returns {Promise<Object>}
   * @throws {BadRequestException} Error
   */
  async getS3Url(filename: string, userId: string) {
    try {
      console.log("hello")
      const s3Resp = await uploadToS3(filename)
      const obj: S3FileInterface = {
        id: uuid(),
        userId: userId,
        s3link: s3Resp,
      }
      await this.s3ListRepository.insert(obj)

      return { data: { s3link: s3Resp } }
    } catch (error) {
      this.logger.error(error.message)
      throw new BadRequestException(error.message)
    }
  }
}
