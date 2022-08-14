import React, { FC } from 'react'
import { View, Image, Text, ActivityIndicator, Pressable, ViewStyle } from 'react-native'
import { useTheme } from '@/Hooks'
import { colors } from '@/Utils/constants'
import Animated, { SharedValue, useAnimatedGestureHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
import { PanGestureHandler } from 'react-native-gesture-handler'
import times from 'lodash/times'

type DraggableCardProps = {}

type ElementPositions = {
  x: 0
  y: 0
}[]

const initPositions: ElementPositions = times(2, () => {
  return {
    x: 0,
    y: 0,
  }
})

const DraggableCards = ({}: DraggableCardProps) => {
  const elementPositions = useSharedValue<ElementPositions>(initPositions)
  const { Layout, Images } = useTheme()

  const animatedViewStyles = (idx: number) => {
    return useAnimatedStyle(() => {
      return {
        left: elementPositions.value[idx].x,
        top: elementPositions.value[idx].y,
      }
    }, [elementPositions])
  }

  const onGestureEvents = (idx: number) => {
    return useAnimatedGestureHandler(
      {
        onStart: (event, ctx: any) => {
          ctx.startX = elementPositions.value[idx].x
          ctx.startY = elementPositions.value[idx].y
        },
        onActive: (event, ctx) => {
          elementPositions.value[idx] = {
            x: ctx.startX + event.translationX,
            y: ctx.startY + event.translationY,
          }
        },
        onEnd: _ => {
          // x.value = withSpring(0)
          // y.value = withSpring(0)
        },
      },
      [elementPositions],
    )
  }
  return (
    <>
      <PanGestureHandler onGestureEvent={onGestureEvents(0)}>
        <Animated.View style={{}}>
          <Animated.View
            style={[
              {
                position: 'absolute',
                width: '100%',
                height: 300,
                borderRadius: 20,
                backgroundColor: '#fff',
              },
              animatedViewStyles(0),
            ]}
          ></Animated.View>
        </Animated.View>
      </PanGestureHandler>

      <PanGestureHandler onGestureEvent={onGestureEvents(1)}>
        <Animated.View style={{}}>
          <Animated.View
            style={[
              {
                position: 'absolute',
                width: '100%',
                height: 300,
                borderRadius: 20,
                backgroundColor: '#fff',
              },
              animatedViewStyles(1),
            ]}
          ></Animated.View>
        </Animated.View>
      </PanGestureHandler>
    </>
  )
}

DraggableCards.defaultProps = {}

export default DraggableCards
