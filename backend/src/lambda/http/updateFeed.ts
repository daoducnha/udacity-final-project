import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { updateFeed } from '../../businessLogic/feeds'
import { UpdateFeedRequest } from '../../requests/UpdateFeedRequest'
import { getUserId } from '../utils'
import { createLogger} from '../../utils/logger'

const logger = createLogger('updateFeedFunction')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const feedId = event.pathParameters.feedId
    const updatedFeed: UpdateFeedRequest = JSON.parse(event.body)

    const userId = getUserId(event)
    try {
      await updateFeed(updatedFeed, userId, feedId)

      logger.info(`Update feed item with id ${feedId} for user ${userId} success.`)
      
      return {
        statusCode: 201,
        body: ''
      }
    } catch (e) {
      return {
        statusCode: 404,
        body: JSON.stringify({error: e})
      }
    }
  })

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
