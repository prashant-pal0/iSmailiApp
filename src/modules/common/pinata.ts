/* eslint-disable @typescript-eslint/no-var-requires */

import { Logger } from '@nestjs/common'
import * as AWS from 'aws-sdk'
const path = require('path')
import { HttpService } from '@nestjs/axios'

export async function pinataIPFS(filename: string) {
  const logger: Logger = new Logger()
  const http = new HttpService()
  try {
    // const configurationDetails = await getConfigurationBy({}, ['pinataConfig'])
    const fs = require('fs')
    const FormData = require('form-data')
    const url = process.env.PINATA_URL
    const data = new FormData()
    data.append('file', fs.createReadStream(path.join('uploads', filename)))
    const metadata = JSON.stringify({
      name: filename.split('/')[1],
      keyvalues: {
        exampleKey: filename.split('/')[1],
      },
    })
    data.append('pinataMetadata', metadata)
    const { data: res } = await http
      .post(url, data, {
        maxBodyLength: 2000000000,
        headers: {
          'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
          PINATA_API_KEY: process.env.PINATA_API_KEY,
          PINATA_SECRET_API_KEY: process.env.PINATA_SECRET_API_KEY,
        },
      })
      .toPromise()

    try {
      await fs.unlinkSync(path.join('uploads', filename))
    } catch (error) {
      logger.error(error.message)
    }
    return res
  } catch (error) {
    logger.error(error.message)
  }
}

export async function uploadToS3(filename: string, newName?: string) {
  const logger: Logger = new Logger()
  try {
    const accessKeyId = process.env.AWS_S3_ACCESS_KEY
    const secretAccessKey = process.env.AWS_S3_SECRET_KEY
    AWS.config.update({
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
      region: 'us-east-1',
    })
    const s3 = new AWS.S3()
    const fs = require('fs')

    const fileContent = await fs.readFileSync(__dirname + `/../../../../uploads/${filename}`)
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: newName || filename,
      Body: fileContent,
    }
    const s3UploadResult = await s3.upload(params).promise()
    try {
      await fs.unlinkSync(path.join('uploads', filename))
    } catch (error) {
      logger.error(error.message)
    }
    return s3UploadResult.Location ?? ''
  } catch (error) {
    logger.error(error.message)
  }
}
