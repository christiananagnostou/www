import strava, { type AuthenticationConfig } from 'strava-v3'

export const refreshAccessToken = async (): Promise<AuthenticationConfig> => {
  const refreshToken = process.env.STRAVA_REFRESH_TOKEN
  if (!refreshToken) throw new Error('Missing STRAVA_REFRESH_TOKEN')

  try {
    const tokenPayload = await strava.oauth.refreshToken(refreshToken)

    const client_id = process.env.STRAVA_CLIENT_ID!
    const client_secret = process.env.STRAVA_CLIENT_SECRET!
    const redirect_uri = process.env.STRAVA_REDIRECT_URI!

    const config = {
      access_token: tokenPayload.access_token,
      client_id,
      client_secret,
      redirect_uri,
    }

    strava.config(config)
    strava.client(config.access_token) // Set the active client token

    console.log('Access token refreshed')
    return config
  } catch (error) {
    console.error('Error refreshing token', error)
    throw error
  }
}
