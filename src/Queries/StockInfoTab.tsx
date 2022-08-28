import { gql, useQuery } from '@apollo/client'
import { number } from 'prop-types'

export const getLawsuitsLiveFeed = (companyIds?: number[]) => {
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
            link
            imgUrl
            publishedAt
          }
          companies {
            id
            ticker
            name
          }
        }
      }
    `,
    {
      variables: {
        categoryIds: [3],
        englishOnly: true,
        limit: 36,
        companyIds: companyIds,
      },
    },
  )

  return data?.newsItems?.map((elem: any) => {
    return {
      newsItem: elem.newsItem,
      companies: elem.companies,
    }
  })
}
