import { zoomTypesDateRangeMap } from 'Utils/constants'
export type GoogleRSSFeedQuery = 'q' | 'before' | 'after'
// export type GoogleRSSFeed = {
//   [query in GoogleRSSFeedQuery]: string
// }

export type GoogleRSSFeed = Record<GoogleRSSFeedQuery, string>
// food price index is different from zoom type
export type FoodPriceIndexZoomType = '1' | '2' | '3' | '6m' | 'ytd'
export type ZoomType = keyof typeof zoomTypesDateRangeMap
