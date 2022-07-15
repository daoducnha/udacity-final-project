import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify, decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

const jwksUrl = 'https://dev-x20p6tdd.us.auth0.com/.well-known/jwks.json'

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  const jwt: Jwt = decode(token, { complete: true }) as Jwt

  verify(token, getKey, { algorithms: ['HS256'] }, function (err, decodeed: object) {
    if (err) {
      logger.error('Error when decode JWT token: ', {error: err.message})
      throw new Error('Invalid JWT token!')
    }
    const jwtPayload = jwt.payload
    if (decodeed['sub'] !== jwt.payload.sub
      || decodeed['iss'] !== jwtPayload.iss
      || decodeed['iat'] !== jwtPayload.iat
      || decodeed['exp'] !== jwtPayload.exp) {
        logger.error('Incorrect JWT token!')
        throw new Error('Incorrect JWT token!')
    }
  })
  return jwt.payload
}

function getKey(header, callback) {
  const jwksClient = require('jwks-rsa');
  const client = jwksClient({
    jwksUri: jwksUrl
  })

  client.getSigningKey(header.pid, function (err, key) {
    if (err) {
      logger.error('Error when get Public Key: ', {error: err.message})
    }
    var signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

function getToken(authHeader: string): string {
  if (!authHeader) {
    logger.error('No authentication header.')
    throw new Error('No authentication header')
  } 

  if (!authHeader.toLowerCase().startsWith('bearer ')) {
    logger.error('Invalid authentication header.')
    throw new Error('Invalid authentication header')
  }

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
