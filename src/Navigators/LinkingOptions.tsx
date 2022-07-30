import { Linking } from 'react-native'
import { createNavigationContainerRef, LinkingOptions } from '@react-navigation/native'
import { AuthNavigatorParamList } from './AuthNavigator'
import dynamicLinks, { FirebaseDynamicLinksTypes } from '@react-native-firebase/dynamic-links'
import { RouteStacks, RouteTabs, RouteTopTabs } from './routes'
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
                  [RouteStacks.earningMain]: RouteStacks.earningMain,
                },
              },
              [RouteTabs.search]: {
                path: RouteTabs.search,
                screens: {
                  [RouteStacks.searchMain]: RouteStacks.searchMain,
                },
              },
              [RouteTabs.stockInfo]: {
                path: RouteTabs.stockInfo,
                screens: {
                  [RouteTopTabs.stockInfoMain]: RouteTopTabs.stockInfoMain,
                  [RouteTopTabs.insider]: RouteTopTabs.insider,
                },
              },
              [RouteTabs.event]: {
                path: RouteTabs.event,
                screens: {
                  [RouteStacks.eventMain]: RouteStacks.eventMain,
                },
              },
            },
          },
        },
      },
    },
  },
}
