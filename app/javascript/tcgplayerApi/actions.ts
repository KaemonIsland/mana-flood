import axios from 'axios'

// TCGPLAYER Docs - https://docs.tcgplayer.com/docs/getting-started

// Obtain the Access token
export const getAccessToken = async (): Promise<void> => {
  try {
    const response = await axios('https://api.tcgplayer.com/token', {
      method: 'POST',
      data: `grant_type=client_credentials&client_id=${process.env.REACT_APP_TCG_PUBLIC}&client_secret=${process.env.REACT_APP_TCG_PRIVATE}`,
    })
  } catch (error) {
    console.log('Unable to get access token. ', error)
  }
}

export const searchCard = async (uuid): Promise<void> => {
  try {
    const response = 'Hello'
  } catch (error) {
    console.log('Unable to get card info. ', error)
  }
}
