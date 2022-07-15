import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteFeed } from '../../businessLogic/feeds'
import { getUserId } from '../utils'
import { createLogger} from '../../utils/logger'

const logger = createLogger('deleteFeedFunction')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const feedId = event.pathParameters.todoId
    const userId = getUserId(event)
    await deleteFeed(userId, feedId)

    logger.info(`Delete feed item with id ${feedId} for user ${userId} success.`)
    
    return {
      statusCode: 200,
      body: ''
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
