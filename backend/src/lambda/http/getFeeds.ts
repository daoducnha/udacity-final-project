import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import {getUserId } from '../utils'
import { getFeedsForUser } from '../../businessLogic/feeds'
import { createLogger} from '../../utils/logger'

const logger = createLogger('getFeedsFunction')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event)
    const feeds = await getFeedsForUser(userId)

    logger.info(`Get list feeds item for user ${userId} success`)

    return {
      statusCode: 200,
      body: JSON.stringify({
        items: feeds
      })
    }
})

handler.use(
  cors({
    credentials: true
  })
)
