// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 't85m4zu9p5'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-x20p6tdd.us.auth0.com',
  clientId: '6enGTSE6ZvRul1iHsHHs52z9e7MGxRxA',
  callbackUrl: 'http://localhost:3000/callback'
}
