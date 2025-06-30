import Nylas from "nylas";

export const nylas = new Nylas({
  apiKey: process.env.NYLAS_SECRET_API_KEY!,
  apiUri: process.env.NYLAS_API_URI,
})

export const nylasConfig = {
    apiKey: process.env.NYLAS_SECRET_API_KEY!,
    apiUri: process.env.NYLAS_API_URI,
    clientId : process.env.NYLAS_CLIENT_ID,
    redirectUri : process.env.NEXT_PUBLIC_URL + "/api/oauth/exchange",
}