import { gql, useQuery } from '@apollo/client'
import { number } from 'prop-types'

export type LiveFeedProp = {
  limit: number
  companyIds: number[]
  categoryIds: number[]
  sourceIds: number[]
}

export const getNewsItemData = (newsItemId: number) => {
  const { loading, error, data } = useQuery(
    gql`
      query GetNewsItemData($newsitemId: int64!) {
        newsItemData(newsitemId: $newsitemId) {
          html
        }
      }
    `,
    {
      variables: {
        newsitemId: 3290908,
      },
    },
  )

  return data?.newsItemData
}

export const getLiveFeed = (props: LiveFeedProp) => {
  const { limit, companyIds, categoryIds, sourceIds } = props
  const { loading, error, data } = useQuery(
    gql`
      query LiveFeed(
        $limit: int
        $subscribedOnly: bool
        $tickersOnly: bool
        $importantOnly: bool
        $englishOnly: bool
        $categoryIds: [int64!]
        $sinceId: int64
        $afterId: int64
        $companyIds: [int64!]
        $languageIds: [int32!]
        $sourceIds: [int32!]
        $sectors: [string!]
        $industries: [string!]
        $marketCapTiers: [int!]
        $floatTiers: [int!]
        $shortInterestTiers: [int!]
      ) {
        newsItems(
          limit: $limit
          subscribedOnly: $subscribedOnly
          tickersOnly: $tickersOnly
          importantOnly: $importantOnly
          englishOnly: $englishOnly
          categoryIds: $categoryIds
          languageIds: $languageIds
          sourceIds: $sourceIds
          since: $sinceId
          after: $afterId
          companyIds: $companyIds
          sectors: $sectors
          industries: $industries
          marketCapTiers: $marketCapTiers
          floatTiers: $floatTiers
          shortInterestTiers: $shortInterestTiers
        ) {
          newsItem {
            id
            title
            summary
            link
            imgUrl
            parser
            language
            important
            category
            publishedAt
            discoveredAt
            processedAt
          }
          companies {
            id
            ticker
            name
            sector
            industry
          }
        }
      }
    `,
    {
      variables: {
        tickersOnly: true,
        importantOnly: true,
        englishOnly: true,
        categoryIds,
        sourceIds,
        limit,
        companyIds,
      },
    },
  )

  return data?.newsItems
}
