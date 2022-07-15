import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { FeedItem } from '../models/FeedItem'
import { FeedUpdate } from '../models/FeedUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('FeedsAccess')

export class FeedsAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.Dynamodb.DocumentClient(),
        private readonly feedsTable = process.env.FEEDS_TABLE) {

    }

    async getFeedsForUser(userId: string): Promise<FeedItem[]> {
        logger.info(`Getting list feeds item for user ${userId}.`)
        const result = await this.docClient.query({
            TableName: this.feedsTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()

        logger.info(`Get list feeds item for user ${userId} seccess.`)
        
        const items = result.Items
        return items as FeedItem[]
    }

    async getFeedByIdForUser(userId: string, feedId: string): Promise<FeedItem> {
        logger.info(`Getting feed item with id ${feedId} for user ${userId}.`)

        const result = await this.docClient.query({
            TableName: this.feedsTable,
            KeyConditionExpression: 'userId = :userId AND feedId = :feedId',
            ExpressionAttributeValues: {
                ':userId': userId,
                ':feedId': feedId
            }
        }).promise()

        logger.info(`Get feed item with id ${feedId} for user ${userId} success.`)

        const items = result.Items
        return items[0] as FeedItem
    }

    async createFeed(feedItem: FeedItem): Promise<FeedItem> {
        logger.info(`Creating new feed item with id ${feedItem.feedId} for user ${feedItem.userId}.`)

        await this.docClient.put({
            TableName: this.feedsTable,
            Item: feedItem
        })

        logger.info(`Create new feed item with id ${feedItem.feedId} for user ${feedItem.userId} success.`)
        
        return feedItem
    }

    async updateFeed(feedItem: FeedUpdate, userId: string, feedId: string) {
        const currentFeedItem = await this.getFeedByIdForUser(userId, feedId)

        if(!currentFeedItem) {
            logger.error(`Not found feed item with id ${feedId} for user ${userId}.`)
            throw new Error(`Feed item of user ${userId} not found with id ${feedId}`)
        }

        logger.info(`Updating feed item with id ${feedId} for user ${userId}.`)

        await this.docClient.update({
            TableName: this.feedsTable,
            Key: {
                userId,
                feedId
            },
            UpdateExpression: 'SET content = :content, updatedAt = :updatedAt',
            ExpressionAttributeValues: {
                ':content': feedItem.content,
                ':updatedAt': feedItem.updatedAt
            }
        }).promise()

        logger.info(`Update feed item with id ${feedId} for user ${userId} success.`)
    }

    async updateAttachmentUrlForFeed(feedItem: FeedUpdate, userId: string, feedId: string) {
        const currentFeedItem = await this.getFeedByIdForUser(userId, feedId)

        if(!currentFeedItem) {
            logger.error(`Not found feed item with id ${feedId} for user ${userId}.`)
            throw new Error(`Feed item of user ${userId} not found with id ${feedId}`)
        }

        logger.info(`Updating attachmentUrl for feed item with id ${feedId} for user ${userId}.`)

        await this.docClient.update({
            TableName: this.feedsTable,
            Key: {
                userId,
                feedId
            },
            UpdateExpression: 'SET attachmentUrl = :attachmentUrl',
            ExpressionAttributeValues: {
                ':attachmentUrl': feedItem.attachmentUrl
            }
        }).promise()

        logger.info(`Update attachmentUrl for feed item with id ${feedId} for user ${userId} success.`)
    }

    async deleteFeed(userId: string, feedId: string) {
        logger.info(`Deleting feed item with id ${feedId} for user ${userId}.`)

        await this.docClient.delete({
            TableName: this.feedsTable,
            Key: {
                userId,
                feedId
            }
        })
    }
}