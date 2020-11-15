const fs = require('fs')
import unzipper from 'unzipper'
import axios from 'axios'

/**
 * Fetches a .zip file from https://mtgjson.com/
 * This .zip file contains multiple .csv files
 * which we will use to update the card database
 */
export const getCsvFiles = async () => {
  try {
    // const response = await axios(
    //   'https://www.mtgjson.com/files/AllPrintingsCSVFiles.zip'
    // )
    // const zipFile = response.data
    await fs
      .createReadStream(`${__dirname}/AllPrintingsCSVFiles.zip`)
      .pipe(unzipper.Extract({ path: `${__dirname}/cardsCSV` }))
  } catch (error) {
    console.log('There was an error, ', error)
  }
}
