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

export default function SPBattle() {
  const leftX = useSharedValue(400);
  const leftY = useSharedValue(0);
  const rightX = useSharedValue(400);
  const rightY = useSharedValue(0);
  const rotateRightZ = useSharedValue(0);
  const rotateLeftZ = useSharedValue(0);
  const rotateLeftY = useSharedValue(0);

  const topFallX = useSharedValue(0);
  const topFallY = useSharedValue(0);
  const topRotate = useSharedValue(0);

  const bottomFallX = useSharedValue(0);
  const bottomFallY = useSharedValue(0);
  const bottomRotate = useSharedValue(0);

  const [showSplit, setShowSplit] = React.useState(false);
  const trigger = useSharedValue(0);

  useEffect(() => {
    // Animate both hands coming in
    leftX.value = withTiming(60, { duration: 500 }, () => {
      rotateLeftZ.value = withDelay(700, withTiming(-15, { duration: 500 }));
      leftY.value = withDelay(700, withTiming(-30, { duration: 500 }));
    });

    rightX.value = withTiming(40, { duration: 500 }, () => {
      rotateRightZ.value = withDelay(700, withTiming(15, { duration: 500 }));
      rightY.value = withDelay(
        700,
        withTiming(-30, { duration: 500 }, () => {
          rightX.value = withDelay(700, withTiming(-500, { duration: 300 }));
          rightY.value = withDelay(700, withTiming(40, { duration: 300 }));
          trigger.value = withDelay(
            690,
            withTiming(1, { duration: 0 }, () => {
              runOnJS(setShowSplit)(true);
            })
          );
        })
      );
    });
  }, []);

  useEffect(() => {
    if (showSplit) {
      topFallX.value = withTiming(-50, { duration: 2000 });
      topFallY.value = withTiming(300, { duration: 2000 });
      topRotate.value = withTiming(rotateLeftZ.value - 30, { duration: 2000 });

      bottomFallX.value = withTiming(50, { duration: 2000 });
      bottomFallY.value = withTiming(300, { duration: 2000 });
      bottomRotate.value = withTiming(rotateLeftZ.value + 30, {
        duration: 2000,
      });
    }
  }, [showSplit]);

  const leftStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: leftX.value },
      { translateX: leftY.value },
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

  const topHalfStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: leftX.value + topFallY.value },
      { translateX: leftY.value + topFallX.value },
      { rotateZ: `${topRotate.value}deg` as const },
    ],
  }));

  const bottomHalfStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: leftX.value + bottomFallY.value },
      { translateX: leftY.value + bottomFallX.value },
      { rotateZ: `${bottomRotate.value}deg` as const },
    ],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        {!showSplit ? (
          <Animated.Image
            source={require("./assets/Paper.png")}
            style={[styles.fullImage, leftStyle]}
            resizeMode="contain"
          />
        ) : (
          <>
            <Animated.Image
              source={require("./assets/BottomHalfPaper.png")}
              style={[styles.leftHalfImage, bottomHalfStyle]}
              resizeMode="contain"
            />
            <Animated.Image
              source={require("./assets/TophalfPaper.png")}
              style={[styles.rightHalfImage, topHalfStyle]}
              resizeMode="contain"
            />
          </>
        )}
      </View>

      <View style={styles.rightContainer}>
        <Animated.Image
          source={require("./assets/Scissors.png")}
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
  imageWrapper: {
    width: 250,
    height: 250,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    transform: [{ rotate: "90deg" }],
  },
  fullImage: {
    width: 250,
    height: 250,
  },
  rightHalfImage: {
    width: 450,
    height: 450,
    position: "absolute",
    top: -142,
    left: 60,
  },
  leftHalfImage: {
    width: 450,
    height: 450,
    position: "absolute",
    top: -135,
    left: 70,
  },
});
