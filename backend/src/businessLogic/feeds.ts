import { FeedsAccess } from '../dataLayer/feedsAccess';
import { createAttachmentUrl } from '../helpers/attachmentUtils';
import { CreateFeedRequest } from '../requests/CreateFeedRequest'
import { UpdateFeedRequest } from '../requests/UpdateFeedRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'

const logger = createLogger('FeedsBusinessLogic')
const feedsAccess = new FeedsAccess()

export async function getFeedsForUser(userId: string) {
    logger.info(`Get list feeds item for user ${userId}.`)
    return await feedsAccess.getFeedsForUser(userId)
}

export async function createFeed(createFeedRequest: CreateFeedRequest, userId: string) {
    const feedId = uuid.v4()
    const createdAt = new Date().toISOString()
    
    logger.info(`Create new feed item with id ${feedId} for user ${userId}.`)
    return await feedsAccess.createFeed({
        feedId: feedId,
        userId: userId,
        createdAt: createdAt,
        content: createFeedRequest.content
    })
}

export async function updateFeed(updateFeedRequest: UpdateFeedRequest, userId: string, feedId: string) {
    const updatedDate = new Date().toISOString()

    logger.info(`Update content of feed item with id ${feedId} for user ${userId}.`)

    return await feedsAccess.updateFeed({
        content: updateFeedRequest.content,
        updatedAt: updatedDate
    },
    userId,
    feedId)
}

export async function updateAttachmentUrlForFeed(userId: string, feedId: string, attachmentId: string) {
    const feedItem = await feedsAccess.getFeedByIdForUser(userId, feedId)
    const updatedDate = new Date().toISOString()
    const attachmentUrl = createAttachmentUrl(attachmentId)

    logger.info(`Update attachmentUrl of feed item with id ${feedId} for user ${userId}.`)

    return await feedsAccess.updateAttachmentUrlForFeed({
        content: feedItem.content,
        updatedAt: updatedDate,
        attachmentUrl: attachmentUrl
    },
    userId,
    feedId)
}

export async function deleteFeed(userId: string, feedId: string) {
    feedsAccess.deleteFeed(userId, feedId)
}