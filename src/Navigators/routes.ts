export enum RouteTabs {
  home = 'home',
  litemode = 'litemode',

  stockInfo = 'stockInfo',
  earning = 'earning',
  event = 'event',
  search = 'search',
}

export enum RouteTopTabs {
  stockInfoMain = 'stockInfoMain',
  insider = 'insider',
}

// Adding new screens need to add corresponding background image in Components/ScreenBackgrounds/index.tsx
export enum RouteStacks {
  startUp = 'startUp',
  application = 'application',
  mainStack = 'mainStack',
  authSplashScreen = 'authSplashScreen',
  appSplashScreen = 'appSplashScreen',
  welcomeBack = 'welcomeBack',
  search = 'search',

  // auth screens
  logIn = 'logIn',
  signUp = 'signUp',
  validationCode = 'validationCode',
  welcome = 'welcome',
  welcomeGallery = 'welcomeGallery',
  enterInvitationCode = 'enterInvitationCode',
  forgotPassword = 'forgotPassword',
  signUpWithCode = 'signUpWithCode',
  createNewPassword = 'createNewPassword',
  provideEmail = 'provideEmail',
  registrationCompleted = 'registrationCompleted',

  // logged in app screens
  earningMain = 'earningMain',
  eventMain = 'eventMain',
  settingMain = 'settingMain',
  notificationMain = 'notificationMain',
  notification = 'notification',
  notificationDetail = 'notificationDetail',

  searchMain = 'searchMain',
  tickerDetail = 'tickerDetail',
  tickerNotiSubscription = 'tickerNotiSubscription',

  settingEditProfile = 'settingEditProfile',

  // logged in app screens
  homeMain = 'homeMain',
  homeNewsDetail = 'homeNewsDetail',

  stockInfoMain = 'stockInfoMain',
  insiderTransactionList = 'insiderTransactionList',
  priceTargetList = 'priceTargetList',
  secFilingList = 'secFilingList',
  eventList = 'eventList',
  addWatchList = 'addWatchList',
  investorHoldingList = 'investorHoldingList',
  shortInterests = 'shortInterests',
  cpiIndex = 'cpiIndex',
  usEconomicData = 'usEconomicData',
  euEconomicData = 'euEconomicData',
  asianEconomicData = 'asianEconomicData',

  setting = 'setting',
  mainTab = 'mainTab',
}
