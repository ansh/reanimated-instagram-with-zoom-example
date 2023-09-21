import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  return <Navigator />;
}

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import { SharedElementTransitionDndDetail } from "./Details";
import { SharedElementTransitionDndHome } from "./Home";
import { Post } from "./mock";
import { Routes } from "./types";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Stack = createNativeStackNavigator<Routes>();

export function Navigator() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={SharedElementTransitionDndHome}
            options={{
              presentation: "transparentModal",
            }}
          />
          <Stack.Screen
            name="Detail"
            component={SharedElementTransitionDndDetail}
            options={{
              presentation: "transparentModal",
              headerShown: false,
              animation: "fade",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
