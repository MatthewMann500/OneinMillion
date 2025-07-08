import React from "react";
import { View, Image, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import rock from "../assets/Rock_Card.png";
import paper from "../assets/Paper_Card.png";
import scissors from "../assets/Scissors_Card.png";

const bounceDuration = 1000;

const useBouncingStyle = (delay: number) => {
  const translateY = useSharedValue(0);

  React.useEffect(() => {
    const bounce = () =>
      withRepeat(
        withSequence(
          withTiming(-10, {
            duration: bounceDuration,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(0, {
            duration: bounceDuration,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1,
        true
      );

    // Delay start
    setTimeout(() => {
      translateY.value = bounce();
    }, delay);
  }, []);

  return useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));
};

export default function GameScreen() {
  const img1Style = useBouncingStyle(0);
  const img2Style = useBouncingStyle(200);
  const img3Style = useBouncingStyle(400);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Animated.Image source={rock} style={[styles.image, img1Style]} />
        <Animated.Image source={paper} style={[styles.image, img2Style]} />
        <Animated.Image source={scissors} style={[styles.image, img3Style]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  image: {
    width: 100,
    height: 250,
    objectFit: "contain",
  },
});
