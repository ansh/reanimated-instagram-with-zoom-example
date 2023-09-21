import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { Button, Dimensions, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolate,
  FadeIn,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Routes } from "./types";
import { Content } from "./Content";

const { width, height } = Dimensions.get("screen");

const _overdrag = width / 2;

export function SharedElementTransitionDndDetail() {
  const navigation = useNavigation<NavigationProp<Routes>>();
  const route = useRoute<RouteProp<Routes, "Detail">>();

  const activeItem = route.params.item;
  const goBack = () => {
    navigation.goBack();
  };

  // Pan gesture for whole page dismiss
  const translation = {
    x: useSharedValue(0),
    y: useSharedValue(0),
  };
  const distance = useDerivedValue(() => {
    return Math.abs(translation.x.value) + Math.abs(translation.y.value);
  });
  const panGesture = Gesture.Pan()
    .onChange((event) => {
      translation.x.value += event.changeX;
      translation.y.value += event.changeY;
    })
    .onEnd(() => {
      if (distance.value > _overdrag) {
        runOnJS(goBack)();
      } else {
        translation.x.value = withSpring(0, { overshootClamping: true });
        translation.y.value = withSpring(0, { overshootClamping: true });
      }
    });
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translation.x.value },
      { translateY: translation.y.value },
      {
        scale: interpolate(distance.value, [0, _overdrag * 2], [1, 0.5], Extrapolate.CLAMP),
      },
    ],
  }));

  const zoom = {
    scale: useSharedValue(1),
  };
  const drag = {
    translationX: useSharedValue(0),
    translationY: useSharedValue(0),
  };
  const rotate = {
    rotationX: useSharedValue(0),
    rotationY: useSharedValue(0),
  };
  // Pinch gesture for zooming into the image
  const pinchGesture = Gesture.Pinch()
    .onChange((event) => {
      zoom.scale.value = event.scale;
    })
    .onEnd(() => {
      zoom.scale.value = withSpring(1, { overshootClamping: true });
    });
  const rotateGesture = Gesture.Rotation()
    .onChange((event) => {
      rotate.rotationX.value = event.anchorX;
      rotate.rotationY.value = event.anchorY;
    })
    .onEnd(() => {
      rotate.rotationX.value = withSpring(0, { overshootClamping: true });
      rotate.rotationY.value = withSpring(0, { overshootClamping: true });
    });
  const dragGesture = Gesture.Pan()
    .onChange((event) => {
      drag.translationX.value += event.changeX;
      drag.translationY.value += event.changeY;
    })
    .onEnd(() => {
      drag.translationX.value = withSpring(0, { overshootClamping: true });
      drag.translationY.value = withSpring(0, { overshootClamping: true });
    });
  const zoomedAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: zoom.scale.value },
      { translateX: drag.translationX.value },
      { translateY: drag.translationY.value },
      // { rotateX: `${rotate.rotationX.value}rad` },
      // { rotateY: `${rotate.rotationY.value}rad` },
    ],
  }));
  const composedGesture = Gesture.Simultaneous(pinchGesture, rotateGesture, dragGesture);

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <Animated.View entering={FadeIn.duration(200)} style={[styles.backdrop]} />
        <GestureDetector gesture={composedGesture}>
          <View style={[styles.content]}>
            <Animated.Image
              source={{ uri: activeItem.originalUri }}
              style={[styles.image, zoomedAnimatedStyle]}
              sharedTransitionTag={activeItem.originalUri}
            />
            <Content />
            <Button title="go back" onPress={goBack} />
          </View>
        </GestureDetector>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black",
  },
  image: {
    height: height / 2,
    zIndex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
});
