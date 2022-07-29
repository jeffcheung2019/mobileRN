import React, { useState, useEffect, FC } from 'react'
import { View, ActivityIndicator, Text, TextInput, Pressable, ScrollView, TextStyle, Alert, ViewStyle, Image, FlatList } from 'react-native'

type EmptyComponentProps = {}

const EmptyComponent: FC<EmptyComponentProps> = () => {
  return <View></View>
}

export default EmptyComponent
