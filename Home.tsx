import { NavigationProp, useNavigation } from '@react-navigation/native'
import React from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'
import { images } from './mock'
import { Routes } from './types'

export function SharedElementTransitionDndHome(): React.ReactElement {
  const navigation =
    useNavigation<NavigationProp<Routes>>()

  return (
    <View style={[styles.container]}>
      <FlatList
        contentContainerStyle={styles.contentContainerStyle}
        data={images}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
              navigation.navigate('Detail', {
                item,
              })
            }
          >
            <Animated.Image
              source={{ uri: item.originalUri }}
              style={styles.image}
              sharedTransitionTag={item.originalUri}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainerStyle: {
    padding: 8,
  },
  image: {
    width: '100%',
    height: 300,
    marginBottom: 8,
    borderRadius: 8,
  },
})
