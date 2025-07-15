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

export default function PRBattle() {
  const leftX = useSharedValue(400);
  const rightX = useSharedValue(400);
  const rightY = useSharedValue(0);
  const leftY = useSharedValue(0);
  const rotateLeftZ = useSharedValue(0);
  const rotateLeftY = useSharedValue(0);
  const rotateRightZ = useSharedValue(0);

  useEffect(() => {
    // Animate both hands coming in
    leftX.value = withTiming(50, { duration: 500 }, () => {
      rotateLeftZ.value = withDelay(700, withTiming(-20, { duration: 300 }));
      leftY.value = withDelay(
        700,
        withTiming(-30, { duration: 300 }, () => {
          leftY.value = withDelay(700, withTiming(30, { duration: 300 }));
          rotateLeftZ.value = withDelay(
            700,
            withTiming(40, { duration: 300 }, () => {
              leftX.value = withDelay(700, withTiming(400, { duration: 300 }));
            })
          );
        })
      );
    });

    rightX.value = withTiming(50, { duration: 500 }, () => {
      rightX.value = withDelay(
        700,
        withTiming(10, { duration: 300 }, () => {
          rotateRightZ.value = withDelay(
            750,
            withTiming(-710, { duration: 500 })
          );
          rightX.value = withDelay(750, withTiming(400, { duration: 800 }));
          rightY.value = withDelay(750, withTiming(-200, { duration: 800 }));
        })
      );
    });
  }, []);

  const leftStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: leftX.value },
      { translateX: leftY.value },
      { rotateY: `${rotateLeftY.value}deg` as const },
      { rotateZ: `${rotateLeftZ.value}deg` as const },
    ], //idky
  }));

  const rightStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: rightX.value },
      { translateX: rightY.value },
      { rotateZ: `${rotateRightZ.value}deg` as const },
    ],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <Animated.Image
          source={require("./assets/Paper.png")}
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
    marginTop: 50,
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
