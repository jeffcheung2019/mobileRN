export const config = {
  iconSize: 22,
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
  djiUri:
    'https://query1.finance.yahoo.com/v7/finance/spark?symbols=%5EDJI&range=1d&interval=5m&indicators=close&includeTimestamps=false&includePrePost=false&corsDomain=finance.yahoo.com&.tsrc=finance',
  sandpUri:
    'https://query1.finance.yahoo.com/v7/finance/spark?symbols=^GSPC&range=1d&interval=5m&indicators=close&includeTimestamps=false&includePrePost=false&corsDomain=finance.yahoo.com&.tsrc=finance',
  nasdaqUri:
    'https://query1.finance.yahoo.com/v7/finance/spark?symbols=^IXIC&range=1d&interval=5m&indicators=close&includeTimestamps=false&includePrePost=false&corsDomain=finance.yahoo.com&.tsrc=finance',
  russellUri:
    'https://query1.finance.yahoo.com/v7/finance/spark?symbols=^RUT&range=1d&interval=5m&indicators=close&includeTimestamps=false&includePrePost=false&corsDomain=finance.yahoo.com&.tsrc=finance',
  crudeOilUri:
    'https://query1.finance.yahoo.com/v7/finance/spark?symbols=CL=F&range=1d&interval=5m&indicators=close&includeTimestamps=false&includePrePost=false&corsDomain=finance.yahoo.com&.tsrc=finance',
}

// Color naming https://www.color-name.com/hex/749597
export const colors = {
  frenchPink: '#FF789C',

  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
  spanishGray: '#969696',
  violetsAreBlue: '#9472FF',
  brightTurquoise: '#00F2DE',
  charcoal: '#343950',
  silverSand: '#C5C5C5',
  cornflowerBlue: '#6398F0',
  glaucous: '#5C7CBA',
  magicPotion: '#FD4762',
  desire: '#E23E57',
  crystal: '#ADDCDF',
  indigo: '#234263',
  chineseBlack: '#141414',
  darkBlueGray: '#67739E',
  darkGunmetal: '#151C35',
  jacarta: '#38405E',
  philippineSilver: '#B5B5B5',
  buleCola: '#0174E5',
  lightSlateGray: '#749597',
  eucalyptus: '#42DCA3',

  green: '#14D13E', //green
  orange: '#D6AE14', //yellow
  red: '#FF0000', //red

  arsenic: '#3D4248',
  charlestonGreen: '#322E29',
  brinkPink: '#FF637D',
  crimson: '#E21134',
  amaranthRed: 'rgba(213, 31, 55, 0.1)',

  tealDeer: '#87F4B5',
  cornflower: '#93CBF1',

  // Theme colors for each tab, home, earning, search, priceTarget, event
  homeTheme: '#69DDFF',
  earningTheme: '#96CDFF',
  searchTheme: '#D8E1FF',
  stockInfoTheme: '#DBBADD',
  eventTheme: '#BE92A2',
  // Theme colors for each tab, home, earning, search, priceTarget, event

  navyBlue: '#090979',
  vividSkyBlue: '#00d4ff',
  darkCharcoal: '#333333',
  brightGray: '#efefef',
  lawnGreen: '#7CFC00',

  electricGreen: '#00ff00',
  fernGreen: '#3C7E40',
  lotion: '#FAFAFA',
}

export const elevationStyle = {
  elevation: 2,
  shadowColor: colors.black,
  shadowOpacity: 0.26,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 10,
}
