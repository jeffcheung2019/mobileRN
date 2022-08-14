export type GoogleRSSFeedQuery = 'q' | 'before' | 'after'
// export type GoogleRSSFeed = {
//   [query in GoogleRSSFeedQuery]: string
// }

export type GoogleRSSFeed = Record<GoogleRSSFeedQuery, string>
