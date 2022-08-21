import { FoodPriceIndexZoom, GoogleRSSFeed, GoogleRSSFeedQuery } from '@/Types/API'

export const config = {
  iconSize: 28,
  urlScheme: `com.fitnessevo://`,
  dynamicLink: `https://fitevo.page.link/xEYL`,
  userAuthInfo: `https://api-dev.dragonevolution.gg/users/auth`,
  userDailyLogin: `https://api-dev.dragonevolution.gg/users/daily-login`,
  userTopAvgPoint: `https://api-dev.dragonevolution.gg/users/top-average-point`,
  userDailyShare: `https://api-dev.dragonevolution.gg/users/daily-share`,
  userFitnessInfo: `https://api-dev.dragonevolution.gg/users/fitness-info`,
  userProfile: `https://api-dev.dragonevolution.gg/users/profile`,
  userReferralCheck: (referralCode: string) => {
    return `https://api-dev.dragonevolution.gg/users/referral/${referralCode}/check`
  },
  emailVerification: `https://api-dev.dragonevolution.gg/users/email-verification`,
  onelinkUrl: `https://test-dragon-dev.onelink.me/xNJK`,
  referralConfirmation: `https://api-dev.dragonevolution.gg/users/referral-confirmation`,
  fitnessInfoApiKey: 'QEwArOceQy5zGNyisQpj71JNds2cWxzkpFRdY2S6',
  totalPointsMaxCap: 9680,
  defaultSECImg: 'https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg',
  defaultAvatarUrl: 'https://kodamo.org/img/no-profile-picture-icon-15.png',
  defaultNewsImgUrl:
    'https://images.moneycontrol.com/static-mcnews/2022/07/stocks_sensex_nifty_stockmarket-1-770x433.jpg?impolicy=website&width=400&height=225',
}

export const api = {
  tickerUri: (ticker: string, range: string = '1d') => {
    return `https://query1.finance.yahoo.com/v7/finance/spark?symbols=${ticker}&range=${range}&interval=5m&indicators=close&includeTimestamps=false&includePrePost=false&corsDomain=finance.yahoo.com&.tsrc=finance`
  },
  tiprankTickerUri: (ticker: string) => {
    return `https://www.tipranks.com/api/stocks/getNews/?ticker=${ticker}`
  },
  earning: `https://scanner.tradingview.com/america/scan`,
  rssFeedGoogleNews: (queries: GoogleRSSFeed) => {
    let queryStrs = ''
    let queriesObjKeys = Object.keys(queries)
    queriesObjKeys.forEach((query, idx: number) => {
      queryStrs += `${query}=${queries[query as GoogleRSSFeedQuery]}`
      if (idx < queriesObjKeys.length - 1) {
        queryStrs += '&'
      }
    })

    return `https://news.google.com/rss/search${queryStrs === '' ? '' : '?' + queryStrs + '&ceid=US:en&hl=en-US&gl=US'}`
  },
  foodPriceIndex: (zoom: FoodPriceIndexZoom) => {
    return `https://ycharts.com/charts/fund_data.json?annotations=&annualizedReturns=false&calcs=&chartType=interactive&chartView=&correlations=&dateSelection=range&displayDateRange=false&displayTicker=false&endDate=&format=real&legendOnChart=false&note=&partner=basic_2000&quoteLegend=false&recessions=false&scaleType=linear&securities=id%3AI%3AFPI%2Cinclude%3Atrue%2C%2C&securityGroup=&securitylistName=&securitylistSecurityId=&source=false&splitType=single&startDate=&title=&units=false&useCustomColors=false&useEstimates=false&zoom=${zoom}&redesign=true&chartCreator=&maxPoints=588`
  },

  foodPriceIndexHtml: 'https://ycharts.com/indicators/food_index_world_bank',
  economicDataHtml: 'https://ycharts.com/indicators',
  globalSupplyChainCSV: 'https://www.newyorkfed.org/medialibrary/research/interactives/data/gscpi/gscpi_interactive_data.csv',
  globalSupplyChainEstimate: 'https://www.newyorkfed.org/medialibrary/research/interactives/data/gscpi/gscpi.json',
}

// Color naming https://www.color-name.com/hex/749597
export const colors = {
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
  spanishGray: '#969696',
  brightTurquoise: '#00F2DE',
  magicPotion: '#FD4762',
  darkBlueGray: '#67739E',
  darkGunmetal: '#151C35',
  jacarta: '#38405E',
  philippineSilver: '#B5B5B5',
  buleCola: '#0174E5',
  lightSlateGray: '#749597',
  eucalyptus: '#42DCA3',

  green: '#14D13E', //green
  orange: '#D6AE14', //yellow

  arsenic: '#3D4248',
  charlestonGreen: '#322E29',
  brinkPink: '#FF637D',
  amaranthRed: 'rgba(213, 31, 55, 0.1)',

  tealDeer: '#87F4B5',
  cornflower: '#93CBF1',

  // Theme colors for each tab, home, earning, search, priceTarget, event
  homeTheme: '#69DDFF',
  earningTheme: '#96CDFF',
  searchTheme: '#D8E1FF',
  stockInfoTheme: '#DBBADD',
  chartTheme: '#BE92A2',
  // Theme colors for each tab, home, earning, search, priceTarget, event

  brightGray: '#efefef',

  lotion: '#FAFAFA',

  // stock colors
  lawnGreen: '#7CFC00', // line color
  electricGreen: '#00ff00', // area color
  red: '#FF0000', // line color
  crimson: '#E21134', // area color
}

export const elevationStyle = {
  elevation: 2,
  shadowColor: colors.black,
  shadowOpacity: 0.26,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 10,
}
