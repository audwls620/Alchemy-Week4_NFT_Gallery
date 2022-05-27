import React, { useState, useReducer } from 'react'
import axios from 'axios'
import NFTCard from '../components/nftCard'
import SearchBox from '../components/searchBox'
import Pagination from '../components/Pagination'

const styles = {
  nftsContainer:
    'mt-12 flex w-full flex-wrap items-center justify-center gap-y-12 gap-x-4',
}

const reducer = (state, action) => {
  if (action.type == 'add') {
    const stateArray = [...state, action.data]
    return stateArray.flat(1)
  }
}

const Home = () => {
  const [wallet, setWallet] = useState('')
  const [collection, setCollection] = useState('')
  const [NFTs, setNFTs] = useState([])
  const [fetchForCollection, setFetchForCollection] = useState(false)
  const [totlaNFTsNum, setTotalNFTsNum] = useState('')
  const [state, dispatch] = useReducer(reducer, [])

  const [currentPage, setCurrentPage] = useState(1)
  const nftsPerPage = '100'

  ///API FETCHING////
  const fetchNFTs = async () => {
    let nfts
    console.log('fetching nfts')

    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_API_KEY}/getNFTs/`

    if (!collection.length) {
      var requestOptions = {
        method: 'GET',
      }

      const fetchURL = `${baseURL}?owner=${wallet}`

      nfts = await fetch(fetchURL, requestOptions).then((data) => data.json())
    } else {
      console.log('fetching nfts for collection owned by address')
      const fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}`
      nfts = await fetch(fetchURL, requestOptions).then((data) => data.json())
    }
    if (nfts) {
      console.log(nfts.ownedNfts)
      setNFTs(nfts.ownedNfts)
    }
  }

  ////// API FETCHING ////

  const fetchNFTsForCollection = async () => {
    if (collection.length) {
      async function callGetNFTsForCollectionOnce(startToken = '') {
        const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_API_KEY}/getNFTsForCollection/`
        const url = `${baseURL}/?contractAddress=${collection}&startToken=${startToken}&withMetadata=${'true'}`
        const response = await axios.get(url)
        return response.data
      }

      let startToken = '19000'
      let hasNextPage = true
      let totalNftsFound = 0
      while (hasNextPage) {
        const { nfts, nextToken } = await callGetNFTsForCollectionOnce(
          startToken
        )
        if (!nextToken) {
          // When nextToken is not present, then there are no more NFTs to fetch.
          hasNextPage = false
        }

        startToken = nextToken
        totalNftsFound += nfts.length
        setTotalNFTsNum(totalNftsFound)
        dispatch({
          type: 'add',
          data: nfts,
        })
      }
    }
    if (state) {
      console.log('NFTs in collection', state)
      setNFTs(state)
    }
  }

  const fetchOption = () => {
    if (fetchForCollection) {
      fetchNFTsForCollection()
    } else fetchNFTs()
  }

  //Get Current nfts
  const indexOfLastPost = currentPage * nftsPerPage
  const indexOfFirstPost = indexOfLastPost - nftsPerPage
  const currenNFTs = NFTs.slice(indexOfFirstPost, indexOfLastPost)

  //Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <div>
      <div>
        <SearchBox
          walletHandler={(e) => setWallet(e)}
          collectionHandler={(e) => setCollection(e)}
          btnClickHandler={() => fetchOption()}
          checkBoxHanlder={(e) => setFetchForCollection(e)}
          value={{ wallet, collection }}
        />
      </div>
      <div>
        <div className={styles.nftsContainer}>
          {NFTs.length > 0 &&
            currenNFTs.map((nft) => {
              return <NFTCard nft={nft} />
            })}
        </div>
        <div>
          {NFTs.length > 0 && (
            <Pagination
              nftsPerPage={nftsPerPage}
              totalNFTs={totlaNFTsNum}
              paginate={paginate}
              currentPage={currentPage}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Home
