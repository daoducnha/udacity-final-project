import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { CreateFeedRequest } from '../../requests/CreateFeedRequest'
import { getUserId } from '../utils';
import { createFeed } from '../../businessLogic/feeds'
import { createLogger} from '../../utils/logger'

const logger = createLogger('createFeedFunction')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newFeed: CreateFeedRequest = JSON.parse(event.body)
    
    const userId = getUserId(event)
    const item = await createFeed(newFeed, userId)

    logger.info(`Create feed item for user ${userId} success.`)

    return {
      statusCode: 201,
      body: JSON.stringify({
        item
      })
    }

  })

handler
.use(httpErrorHandler())
.use(
  cors({
    credentials: true
  })
)
