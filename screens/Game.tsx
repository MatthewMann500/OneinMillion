import React, { useState } from "react";
import { View, StyleSheet, Pressable, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import rock from "../assets/Rock_Card.png";
import paper from "../assets/Paper_Card.png";
import scissors from "../assets/Scissors_Card.png";

const bounceDuration = 1000;
const { width, height } = Dimensions.get("window");

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

    setTimeout(() => {
      translateY.value = bounce();
    }, delay);
  }, []);

  return useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));
};

export default function GameScreen() {
  const [selected, setSelected] = useState<
    "rock" | "paper" | "scissors" | null
  >(null);

  const opacity = useSharedValue(0);

  const rockOpacity = useSharedValue(1);
  const paperOpacity = useSharedValue(1);
  const scissorsOpacity = useSharedValue(1);

  const selectedTranslateX = useSharedValue(0);
  const selectedTranslateY = useSharedValue(0);
  const selectedScale = useSharedValue(1);

  const cardWidth = 100;
  const cardHeight = 250;

  const centerX = width / 2 - cardWidth / 2;
  const centerY = height / 2 - cardHeight / 2;

  const cardPositions = {
    rock: 0,
    paper: cardWidth + 10,
    scissors: (cardWidth + 10) * 2,
  };

  const showSelected = (choice: "rock" | "paper" | "scissors") => {
    setSelected(choice);
    opacity.value = withTiming(0.5, { duration: 300 });

    // Fade out non-selected cards
    rockOpacity.value = withTiming(choice === "rock" ? 1 : 0, {
      duration: 1000,
    });
    paperOpacity.value = withTiming(choice === "paper" ? 1 : 0, {
      duration: 1000,
    });
    scissorsOpacity.value = withTiming(choice === "scissors" ? 1 : 0, {
      duration: 1000,
    });

    const fromX = cardPositions[choice];
    const toX = centerX;

    const translateX = toX - fromX - 20;
    const translateY = centerY - (height / 2 - cardHeight / 2);

    selectedTranslateX.value = withTiming(translateX, { duration: 500 });
    selectedTranslateY.value = withTiming(translateY, { duration: 500 });
    selectedScale.value = withTiming(1.8, { duration: 500 });

    setTimeout(() => {
      opacity.value = withTiming(0, { duration: 300 });

      rockOpacity.value = withTiming(1, { duration: 500 });
      paperOpacity.value = withTiming(1, { duration: 500 });
      scissorsOpacity.value = withTiming(1, { duration: 500 });

      selectedTranslateX.value = withTiming(0, { duration: 500 });
      selectedTranslateY.value = withTiming(0, { duration: 500 });
      selectedScale.value = withTiming(1, { duration: 500 });

      setTimeout(() => runOnJS(setSelected)(null), 600);
    }, 2000);
  };

  const dimStyle = useAnimatedStyle(() => ({
    backgroundColor: "black",
    position: "absolute",
    top: 0,
    left: 0,
    width,
    height,
    opacity: opacity.value,
    zIndex: 1,
  }));

  const rockStyle = useAnimatedStyle(() => ({
    opacity: rockOpacity.value,
  }));
  const paperStyle = useAnimatedStyle(() => ({
    opacity: paperOpacity.value,
  }));
  const scissorsStyle = useAnimatedStyle(() => ({
    opacity: scissorsOpacity.value,
  }));

  const selectedCardTransform = (card: "rock" | "paper" | "scissors") =>
    useAnimatedStyle(() => {
      if (selected === card) {
        return {
          transform: [
            { translateX: selectedTranslateX.value },
            { translateY: selectedTranslateY.value },
            { scale: selectedScale.value },
          ],
        };
      }
      return {};
    });

  const img1Style = useBouncingStyle(0);
  const img2Style = useBouncingStyle(200);
  const img3Style = useBouncingStyle(400);

  const rockSelectedStyle = selectedCardTransform("rock");
  const paperSelectedStyle = selectedCardTransform("paper");
  const scissorsSelectedStyle = selectedCardTransform("scissors");

  return (
    <View style={styles.container}>
      <Animated.View style={dimStyle} />
      <View style={styles.row}>
        <View
          style={[styles.cardSlot, { zIndex: selected === "rock" ? 10 : 1 }]}
        >
          <Pressable
            onPress={() => {
              showSelected("rock");
            }}
          >
            <Animated.View style={[rockStyle, rockSelectedStyle]}>
              <Animated.Image source={rock} style={[styles.image, img1Style]} />
            </Animated.View>
          </Pressable>
        </View>
        <View
          style={[styles.cardSlot, { zIndex: selected === "paper" ? 10 : 1 }]}
        >
          <Pressable onPress={() => showSelected("paper")}>
            <Animated.View style={[paperStyle, paperSelectedStyle]}>
              <Animated.Image
                source={paper}
                style={[styles.image, img2Style]}
              />
            </Animated.View>
          </Pressable>
        </View>
        <View
          style={[
            styles.cardSlot,
            { zIndex: selected === "scissors" ? 10 : 1 },
          ]}
        >
          <Pressable onPress={() => showSelected("scissors")}>
            <Animated.View style={[scissorsStyle, scissorsSelectedStyle]}>
              <Animated.Image
                source={scissors}
                style={[styles.image, img3Style]}
              />
            </Animated.View>
          </Pressable>
        </View>
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
    position: "relative",
  },
  row: {
    flexDirection: "row",
    gap: 10,
    zIndex: 1,
  },
  cardSlot: {
    width: 100,
    height: 250,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 100,
    height: 250,
    objectFit: "contain",
  },
});
