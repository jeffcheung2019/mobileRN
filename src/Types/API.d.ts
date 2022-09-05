export type GoogleRSSFeedQuery = 'q' | 'before' | 'after'
// export type GoogleRSSFeed = {
//   [query in GoogleRSSFeedQuery]: string
// }

export type GoogleRSSFeed = Record<GoogleRSSFeedQuery, string>

export type FoodPriceIndexZoom = '1' | '2' | '3' | '5' | '6m' | 'ytd'
