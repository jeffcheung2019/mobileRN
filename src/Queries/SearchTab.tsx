import { gql, useQuery } from '@apollo/client'
import { number } from 'prop-types'
import get from 'lodash/get'

export const getCompanyPage = (ticker: string) => {
  const { loading, error, data } = useQuery(
    gql`
      query CompanyPage($ticker: string!) {
        company(ticker: $ticker) {
          description
          exchange
          id
          industry
          ipoyear
          name
          sector
          ticker
          quote {
            cents
          }
          website
          description
          peers {
            ticker
            name
          }
        }
      }
    `,
    {
      variables: { ticker },
    },
  )

  return data?.company
}

export type GetTickersResult = {
  exchange: string
  id: number
  industry: string
  name: string
  sector: string
  ticker: string
}

export const getTickers = (searchText: string): GetTickersResult[] => {
  const { loading, error, data } = useQuery(
    gql`
      query CompanySearch(
        $ids: [int64!]
        $first: int64
        $last: int64
        $after: string
        $before: string
        $filterText: string
        $sortBy: string
        $searchTerm: string!
      ) {
        getCompanies(
          ids: $ids
          first: $first
          last: $last
          after: $after
          before: $before
          filterText: $filterText
          sortBy: $sortBy
          searchTerm: $searchTerm
        ) {
          totalCount
          edges {
            node {
              id
              ticker
              name
              exchange
              industry
              sector
            }
          }
        }
      }
    `,
    {
      variables: { first: 10, filterText: searchText, searchTerm: searchText },
    },
  )
  return data?.getCompanies?.edges?.map((elem: any) => {
    return elem.node
  })
}

export type MetricsChartData = {
  series: {
    values: number[]
  }[]
  xLabels: string[]
}

export const getMetricsChart = (companyIds: number[]): MetricsChartData | undefined => {
  const { loading, error, data } = useQuery(
    gql`
      query MetricsChart($codes: [int!]!, $companyIds: [int64!]!, $lookbackPeriod: string) {
        metrics(companyIds: $companyIds, codes: $codes, lookbackPeriod: $lookbackPeriod) {
          xLabels
          series {
            values
          }
        }
      }
    `,
    {
      variables: {
        companyIds,
        codes: [2],
        lookbackPeriod: '1mo',
      },
    },
  )

  return data?.metrics
}

export type NewsItem = {
  title: string
  summary: string
  link: string
  publishedAt: string
  ticker: string
}
// categoryIds & sourceIds can be found in ./Constants.ts
export const getNewsItemPanel = (
  companyIds: number[],
  sourceIds: number[], // News Source
  categoryIds: number[],
  limit: number = 5,
): NewsItem[] | undefined => {
  const { loading, error, data } = useQuery(
    gql`
      query NewsitemPanel(
        $limit: int!
        $subscribedOnly: bool!
        $tickersOnly: bool!
        $importantOnly: bool
        $englishOnly: bool
        $categoryIds: [int64!]
        $afterId: int64
        $companyIds: [int64!]
        $languageIds: [int32!]
        $sourceIds: [int32!]
        $trending: bool
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
          after: $afterId
          companyIds: $companyIds
          trending: $trending
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
        limit,
        englishOnly: true,
        subscribedOnly: false,
        tickersOnly: false,
        categoryIds,
        sourceIds,
        companyIds,
      },
    },
  )

  return data?.newsItems.map((elem: any, idx: number) => {
    console.log('elem ', elem.companies)
    return {
      title: elem.newsItem.title,
      summary: elem.newsItem.summary,
      link: elem.newsItem.link,
      publishedAt: elem.newsItem.publishedAt,
      ticker: get(elem, 'companies[0].ticker', ''),
    }
  })
}

export type PriceTarget = {
  rating: string
  ratingPrior: string
  pt: number
  ptPrior: number
  analyst: string
  date: string
  ticker: string
  name: string
  id: number
}

export const getRatingsPanel = (companyIds: number[], limit: number): PriceTarget[] | undefined => {
  try {
    const { loading, error, data } = useQuery(
      gql`
        query RatingsPanel(
          $companyIds: [int64!]!
          $sectors: [string!]
          $industries: [string!]
          $categoryIds: [int64!]
          $afterId: int64
          $limit: int
          $withPtOnly: bool
          $withPriorPtOnly: bool
        ) {
          ratings(
            companyIds: $companyIds
            sectors: $sectors
            industries: $industries
            categoryIds: $categoryIds
            afterId: $afterId
            limit: $limit
            withPtOnly: $withPtOnly
            withPriorPtOnly: $withPriorPtOnly
          ) {
            id
            createdAt
            date
            category
            analyst
            pt
            ptPrior
            rating
            ratingPrior
            company {
              id
              ticker
              name
              sector
              industry
              quote {
                cents
              }
            }
            newsItemId
          }
        }
      `,
      {
        variables: {
          companyIds,
          sectors: [],
          limit,
          industries: [],
          catergoryIds: [],
          withPriorPtOnly: false,
          withPtOnly: true,
        },
      },
    )

    return data?.ratings?.map((elem: any, idx: number) => {
      return {
        id: elem.company.id,
        rating: elem.rating,
        ratingPrior: elem.ratingPrior,
        pt: elem.pt,
        ptPrior: elem.ptPrior,
        analyst: elem.analyst,
        date: elem.date,
        ticker: elem.company.ticker,
        name: elem.company.name,
      }
    })
  } catch (err) {
    console.log('err ', err)
    return undefined
  }
}
