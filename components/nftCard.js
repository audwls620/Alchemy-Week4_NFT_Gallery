import React from 'react'
import { BiCopy } from 'react-icons/bi'

const styles = {
  nftCard: 'flex w-1/4 flex-col rounded-xl bg-gray-500',
  nftImage: 'h-full flex w-full object-cover rounded-t-xl',
  nftMainDescription:
    'mt-3 ml-2 flex flex-col items-start gap-y-1 text-gray-100',
  nftSubDescription: 'mx-2 mt-2 leading-normal text-gray-100',
  viewBtn:
    'mt-2 mb-2 ml-2 cursor-pointer rounded-xl border-2 py-3 px-4 font-bold text-gray-100 hover:text-gray-400 hover:border-gray-400 active:bg-gray-600',
}
const nftCard = ({ nft }) => {
  console.log(nft)
  const addressCopyHandler = () => {
    const copyAddress = nft.contract.address.slice()
    return copyAddress
  }
  return (
    <div className={styles.nftCard}>
      <div>
        <img className={styles.nftImage} src={nft.media[0].gateway} />
      </div>
      <div className={styles.nftMainDescription}>
        <h2>Title: {nft.title.length > 0 ? nft.title : 'N/A'}</h2>
        <p>Token ID: {nft.id.tokenId.substr(nft.id.tokenId.length - 4)}</p>
        <div className="flex items-center justify-center gap-x-2">
          <p>
            Contract Address:{' '}
            {`${nft.contract.address.substr(
              0,
              5
            )}...${nft.contract.address.substr(
              nft.contract.address.length - 4,
              4
            )}`}
          </p>
          <p
            className="cursor-pointer hover:text-gray-400 active:text-gray-400"
            onClick={addressCopyHandler}
            title="Copy"
          >
            <BiCopy />
          </p>
        </div>
      </div>
      <div>
        <p className={styles.nftSubDescription}>
          Description:{' '}
          {nft.description.length > 0 ? nft.description?.substr(0, 100) : 'N/A'}
        </p>
      </div>
      <div className=" flex items-center justify-start">
        <a
          className={styles.viewBtn}
          target={'_blank'}
          href={`https://etherscan.io/token/${nft.contract.address}`}
        >
          View on etherscan
        </a>
      </div>
    </div>
  )
}

export default nftCard
