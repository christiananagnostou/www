export * from './auth'
export * from './calculateBest'
export * from './getActivities'
export * from './types'
export * from './utils'

/**

Step 1: Reauthorize with the Correct Scope

https://www.strava.com/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:3000/strava&response_type=code&approval_prompt=force&scope=activity:read_all

This will prompt you to authorize with the new scope (activity:read_all). After you authorize, Strava will redirect you to your redirect URI with a code parameter.


Step 2: Exchange the Code for a New Token via curl

curl -X POST https://www.strava.com/api/v3/oauth/token \
  -d client_id=YOUR_CLIENT_ID \
  -d client_secret=YOUR_CLIENT_SECRET \
  -d code=YOUR_RETURNED_CODE \
  -d grant_type=authorization_code

This request will provide you with a new access token that includes the proper permissions.


Note on Refreshing Tokens

If you later need to refresh the token (without updating scopes), you can use:

curl -X POST https://www.strava.com/api/v3/oauth/token \
  -d client_id=YOUR_CLIENT_ID \
  -d client_secret=YOUR_CLIENT_SECRET \
  -d grant_type=refresh_token \
  -d refresh_token=YOUR_REFRESH_TOKEN

But remember, this refresh will only return the scopes originally granted. To add missing scopes, you must go through the full reauthorization process described above.

 */
