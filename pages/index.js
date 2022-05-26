import React, { useState } from 'react'
import NFTCard from '../components/nftCard'
import SearchBox from '../components/searchBox'

import Pagination from '../components/Pagination'

const styles = {
  nftsContainer:
    'mt-12 flex w-full flex-wrap items-center justify-center gap-y-12 gap-x-4',
}

const Home = () => {
  const [wallet, setWallet] = useState('')
  const [collection, setCollection] = useState('')
  const [NFTs, setNFTs] = useState([])
  const [fetchForCollection, setFetchForCollection] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const nftsPerPage = '15'

  const BASE_URL = `https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_API_KEY}/`

  ///API FETCHING////
  const fetchNFTs = async () => {
    let nfts
    console.log('fetching nfts')

    const baseURL = `${BASE_URL}getNFTs/`

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
      var requestOptions = {
        method: 'GET',
      }

      const baseURL = `${BASE_URL}getNFTsForCollection/`
      const fetchURL = `${baseURL}/?contractAddress=${collection}&withMetadata=${'true'}`
      const nfts = await fetch(fetchURL, requestOptions).then((data) =>
        data.json()
      )
      if (nfts) {
        console.log('NFTs in collection', nfts.nfts)
        setNFTs(nfts.nfts)
      }
    } else {
      alert('Please Type Contract Address')
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
  console.log(currenNFTs)
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
              totalNFTs={NFTs.length}
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
