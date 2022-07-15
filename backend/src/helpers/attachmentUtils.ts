import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger} from '../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('s3-feed-bucket')

const s3_bucket = process.env.ATTACHMENT_S3_BUCKET
const AWS_REGION = process.env.AWS_REGION

export function createPresignedUrl(attachmentId: string): Promise<string> {
    logger.info(`Getting S3 SignedUrl with attachmentId: ${attachmentId}`)

    const s3 = new XAWS.S3({
        signatureVersion: 'v4'
    })

    const presignedUrl = s3.getSignedUrl('putObject', {
        Bucket: s3_bucket,
        Key: attachmentId,
        Expires: '60'  
    })
    
    logger.info(`Get S3 SignedUrl with attachmentId: ${attachmentId} success.`)

    return presignedUrl
}

export function createAttachmentUrl(attachmentId: string) {
    return `https://${s3_bucket}.s3.${AWS_REGION}.amazonaws.com/${attachmentId}`
}