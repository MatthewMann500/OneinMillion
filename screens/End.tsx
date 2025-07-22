import React, { useEffect } from "react";
import { Text, View, StyleSheet, Pressable, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

const atrophyImage = require("../assets/Trophy13.png");

export default function EndScreen({ navigation }) {
  const imageTranslateY = useSharedValue(height); // start off screen bottom
  const imageOpacity = useSharedValue(0);

  // Opacity for each line of text
  const text1Opacity = useSharedValue(0);
  const text2Opacity = useSharedValue(0);
  const text3Opacity = useSharedValue(0);

  const buttonTranslateY = useSharedValue(height);

  useEffect(() => {
    // Animate image coming up and fading in
    imageTranslateY.value = withTiming(-300, {
      duration: 3000,
      easing: Easing.out(Easing.cubic),
    });
    imageOpacity.value = withTiming(1, { duration: 2000 });

    // Sequential fade in for each text line
    const animateText = async () => {
      text1Opacity.value = withTiming(1, { duration: 2500 });
      await delay(1500);

      text2Opacity.value = withTiming(1, { duration: 3500 });
      await delay(1200);

      text3Opacity.value = withTiming(1, { duration: 4500 });
      await delay(1200);

      // Show button sliding up
      buttonTranslateY.value = withTiming(0, {
        duration: 800,
        easing: Easing.out(Easing.cubic),
      });
    };

    animateText();
  }, []);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: imageTranslateY.value }, { rotate: "-5deg" }],
    opacity: imageOpacity.value,
  }));

  const text1Style = useAnimatedStyle(() => ({
    opacity: text1Opacity.value,
  }));

  const text2Style = useAnimatedStyle(() => ({
    opacity: text2Opacity.value,
  }));

  const text3Style = useAnimatedStyle(() => ({
    opacity: text3Opacity.value,
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: buttonTranslateY.value }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.textWrapper}>
        <Animated.Text style={[styles.text, text1Style]}>
          What It Must Feel
        </Animated.Text>
        <Animated.Text style={[styles.text, styles.centeredText, text2Style]}>
          To Be
        </Animated.Text>
        <Animated.Text style={[styles.text, styles.centeredText, text3Style]}>
          You
        </Animated.Text>
      </View>

      <Animated.Image
        source={atrophyImage}
        style={[styles.image, imageStyle]}
        resizeMode="contain"
      />

      <Animated.View style={[styles.buttonContainer, buttonStyle]}>
        <Pressable
          style={styles.button}
          onPress={() => {
            navigation.navigate("Home");
          }}
        >
          <Text style={styles.buttonText}>Back to Home</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 50,
  },
  textWrapper: {
    position: "absolute",
    bottom: height * 0.6 + 40, // Adjust so text is above trophy
    width: "100%",
    alignItems: "center",
  },
  text: {
    fontSize: 28,
    fontWeight: "600",
    color: "black",
  },
  centeredText: {
    textAlign: "center",
  },
  image: {
    width: width * 0.7,
    height: height * 0.4,
    position: "absolute",
    bottom: 0,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    position: "absolute",
    bottom: 30,
  },
  button: {
    backgroundColor: "#3b82f6",
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginBottom: 50,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});
