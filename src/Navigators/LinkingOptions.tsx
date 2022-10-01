import { Linking } from 'react-native'
import { createNavigationContainerRef, LinkingOptions } from '@react-navigation/native'
import { AuthNavigatorParamList } from './AuthNavigator'
import dynamicLinks, { FirebaseDynamicLinksTypes } from '@react-native-firebase/dynamic-links'
import { RouteStacks, RouteTabs } from './routes'
import { MainStackNavigatorParamList } from './MainStackNavigator'
import { config } from '@/Utils/constants'
import { ApplicationNavigatorParamList } from './Application'

export const publicNavigationRef = createNavigationContainerRef<any>()
export const privateNavigationRef = createNavigationContainerRef<any>()

const prefixes = [config.urlScheme, config.dynamicLink, config.onelinkUrl]

const getInitialURL = async (): Promise<string> => {
  // Check if the app was opened by a deep link
  const url = await Linking.getInitialURL()
  const dynamicLinkUrl = await dynamicLinks().getInitialLink()

  if (dynamicLinkUrl) {
    return dynamicLinkUrl.url
  }
  if (url) {
    return url
  }
  // If it was not opened by a deep link, go to the home screen
  return `${config.urlScheme}${RouteStacks.welcome}`
}

const subscribe = (listener: (deeplink: string) => void) => {
  // First, you may want to do the default deep link handling
  const onReceiveURL = ({ url }: { url: string }) => {
    let urlSplit = url.split('/')
    return listener(url)
  }
  // Listen to incoming links from deep linking
  let onReceiveURLEvent = Linking.addEventListener('url', onReceiveURL)

  const handleDynamicLink = (link: FirebaseDynamicLinksTypes.DynamicLink) => {
    console.log('Dynamic url ', link)
  }
  const unsubscribeToDynamicLinks = dynamicLinks().onLink(handleDynamicLink)
  return () => {
    unsubscribeToDynamicLinks()
    onReceiveURLEvent.remove()
  }
}

// Screens before logging in linking options
export const publicLinking: LinkingOptions<ApplicationNavigatorParamList> = {
  prefixes,
  getInitialURL,
  subscribe,
  config: {
    initialRouteName: RouteStacks.mainStack,
    screens: {
      [RouteStacks.mainStack]: {
        screens: {
          [RouteStacks.authSplashScreen]: {
            path: RouteStacks.authSplashScreen,
          },
          [RouteStacks.welcomeGallery]: {
            path: RouteStacks.welcomeGallery,
          },
          [RouteStacks.welcome]: {
            path: RouteStacks.welcome,
          },
          [RouteStacks.logIn]: {
            path: RouteStacks.logIn,
          },
          [RouteStacks.signUp]: {
            path: RouteStacks.signUp,
          },
          [RouteStacks.enterInvitationCode]: {
            path: RouteStacks.enterInvitationCode,
          },
          [RouteStacks.validationCode]: {
            path: RouteStacks.validationCode,
          },
          [RouteStacks.enterInvitationCode]: {
            path: RouteStacks.enterInvitationCode,
          },
          [RouteStacks.forgotPassword]: {
            path: RouteStacks.forgotPassword,
          },
          [RouteStacks.signUpWithCode]: {
            path: RouteStacks.signUpWithCode,
          },
          [RouteStacks.createNewPassword]: {
            path: RouteStacks.createNewPassword,
          },
          [RouteStacks.provideEmail]: {
            path: RouteStacks.provideEmail,
          },
        },
      },
    },
  },
}

// Screens after logged in linking options
export const privateLinking: LinkingOptions<ApplicationNavigatorParamList> = {
  prefixes,
  getInitialURL,
  subscribe,
  config: {
    initialRouteName: RouteStacks.mainStack,
    screens: {
      [RouteStacks.mainStack]: {
        screens: {
          [RouteStacks.appSplashScreen]: {
            path: RouteStacks.appSplashScreen,
          },
          [RouteStacks.setting]: {
            path: RouteStacks.setting,
          },
          [RouteStacks.notification]: {
            path: RouteStacks.notification,
          },
          [RouteStacks.mainTab]: {
            path: RouteStacks.mainTab,
            initialRouteName: RouteTabs.home,
            screens: {
              [RouteTabs.home]: {
                path: RouteTabs.home,
                screens: {
                  [RouteStacks.homeMain]: {
                    path: RouteStacks.homeMain,
                  },
                  [RouteStacks.homeNewsDetail]: {
                    path: RouteStacks.homeNewsDetail,
                  },
                },
              },
              [RouteTabs.earning]: {
                path: RouteTabs.earning,
                screens: {
                  //date
                  [RouteStacks.earningMain]: `${RouteStacks.earningMain}/:dateStr?`,
                },
              },
              [RouteTabs.search]: {
                path: RouteTabs.search,
                screens: {
                  [RouteStacks.searchMain]: RouteStacks.searchMain,
                  [RouteStacks.tickerDetail]: `${RouteStacks.tickerDetail}/:ticker`,
                  [RouteStacks.tickerNotiSubscription]: `${RouteStacks.tickerNotiSubscription}/:ticker`,
                },
              },
              [RouteTabs.stockInfo]: {
                path: RouteTabs.stockInfo,
                screens: {
                  [RouteStacks.stockInfoMain]: RouteStacks.stockInfoMain,
                  [RouteStacks.insiderTransactionList]: RouteStacks.insiderTransactionList,
                  [RouteStacks.priceTargetList]: RouteStacks.priceTargetList,
                  [RouteStacks.secFilingList]: RouteStacks.secFilingList,
                  [RouteStacks.eventList]: RouteStacks.eventList,
                  [RouteStacks.addWatchList]: RouteStacks.addWatchList,
                  [RouteStacks.investorHoldingList]: RouteStacks.investorHoldingList,
                  [RouteStacks.shortInterests]: RouteStacks.shortInterests,
                  [RouteStacks.usEconomicData]: RouteStacks.usEconomicData,
                  [RouteStacks.euEconomicData]: RouteStacks.euEconomicData,
                  [RouteStacks.asianEconomicData]: RouteStacks.asianEconomicData,
                  [RouteStacks.globalSupplyChain]: RouteStacks.globalSupplyChain,
                  [RouteStacks.foodPriceIndex]: RouteStacks.foodPriceIndex,
                  [RouteStacks.unusualOptions]: RouteStacks.unusualOptions,
                  [RouteStacks.lawsuits]: RouteStacks.lawsuits,
                  [RouteStacks.lawsuitsDetail]: RouteStacks.lawsuitsDetail,
                  [RouteStacks.leadershipUpdate]: RouteStacks.leadershipUpdate,
                  [RouteStacks.offering]: RouteStacks.offering,
                  [RouteStacks.addStockQuote]: RouteStacks.addStockQuote,
                  [RouteStacks.offeringDetail]: RouteStacks.offeringDetail,
                  [RouteStacks.stockQuoteMain]: RouteStacks.stockQuoteMain,
                  [RouteStacks.shortResearchReports]: RouteStacks.shortResearchReports,
                  [RouteStacks.shortResearchReportsDetail]: RouteStacks.shortResearchReportsDetail,
                  [RouteStacks.mergerAcquisition]: RouteStacks.mergerAcquisition,
                  [RouteStacks.mergerAcquisitionDetail]: RouteStacks.mergerAcquisitionDetail,
                  [RouteStacks.ipoNews]: RouteStacks.ipoNews,
                  [RouteStacks.ipoNewsDetail]: RouteStacks.ipoNewsDetail,
                  [RouteStacks.investorHoldingDetail]: RouteStacks.investorHoldingDetail,
                  [RouteStacks.cpiIndex]: RouteStacks.cpiIndex,
                },
              },
              [RouteTabs.stockQuote]: {
                path: RouteTabs.stockQuote,
                screens: {
                  [RouteStacks.stockQuoteMain]: RouteStacks.stockQuoteMain,
                  [RouteStacks.addStockQuote]: RouteStacks.addStockQuote,
                },
              },
            },
          },
        },
      },
    },
  },
}
