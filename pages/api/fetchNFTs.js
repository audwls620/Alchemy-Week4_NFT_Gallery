export const fetchNFT = async () => {
  try {
    var requestOptions = {
      method: 'GET',
    }
    const api_key = 'QrMgS1j-apHyGNPmzj-HmFHLw_sJMZXF'
    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTs/`
    const fetchURL = `${baseURL}?owner=${wallet}`

    const response = await fetch(fetchURL, requestOptions)
    const data = await response.json()
    return data
  } catch (error) {
    console.error(error)
  }
}
