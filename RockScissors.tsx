import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
} from "react-native-reanimated";
import symbolicateStackTrace from "react-native/Libraries/Core/Devtools/symbolicateStackTrace";

const DURATION = 500;

export default function RPSBattle() {
  const leftX = useSharedValue(400);
  const rightX = useSharedValue(400);

  useEffect(() => {
    // Animate both hands coming in
    leftX.value = withTiming(50, { duration: DURATION });
    rightX.value = withTiming(50, { duration: DURATION }, () => {});
  }, []);

  const leftStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: leftX.value }], //idky
  }));

  const rightStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: rightX.value }], //idky
  }));

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <Animated.Image
          source={require("./assets/Scissors.png")}
          style={[styles.leftHand, leftStyle]}
          resizeMode="contain"
        />
      </View>
      <View style={styles.rightContainer}>
        <Animated.Image
          source={require("./assets/Rock.png")}
          style={[styles.rightHand, rightStyle]}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 200,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    borderColor: "black",
    borderWidth: 5,
    position: "relative",
  },
  leftContainer: {
    width: 100,
    height: 100,
    transform: [{ rotate: "90deg" }],
    justifyContent: "center",
    alignItems: "center",
  },
  rightContainer: {
    width: 100,
    height: 100,
    transform: [{ rotate: "270deg" }],
    justifyContent: "center",
    alignItems: "center",
  },
  leftHand: {
    width: 250,
    height: 250,
  },
  rightHand: {
    width: 250,
    height: 250,
  },
});
