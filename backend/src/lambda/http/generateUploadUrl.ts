import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import * as uuid from 'uuid'
import { updateAttachmentUrlForFeed } from '../../businessLogic/feeds'
import { createPresignedUrl } from '../../helpers/attachmentUtils'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('generateUploadUrlFunction')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const feedId = event.pathParameters.feedId
    const userId = getUserId(event)
    const attachmentId = uuid.v4()
    const presignedUrl: string = await createPresignedUrl(attachmentId)

    await updateAttachmentUrlForFeed(userId, feedId, attachmentId)

    logger.info(`Update AttachmentUrl of feed item ${feedId} for user ${userId} success`)
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        'uploadUrl': presignedUrl
      })
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
