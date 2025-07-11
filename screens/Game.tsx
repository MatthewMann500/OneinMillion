import React, { useState } from "react";
import { View, StyleSheet, Pressable, Dimensions, Alert } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  runOnJS,
  withDelay,
} from "react-native-reanimated";
import rock from "../assets/Rock_Card.png";
import paper from "../assets/Paper_Card.png";
import scissors from "../assets/Scissors_Card.png";
import rockHand from "../assets/Rock.png";
import paperHand from "../assets/Paper.png";
import scissorsHand from "../assets/Scissors.png";
import { TypeAnimation } from "react-native-type-animation";
import { toWords } from "number-to-words";

const bounceDuration = 1000;
const { width, height } = Dimensions.get("window");

const useBouncingStyle = (delay: number) => {
  // move to own file
  const translateY = useSharedValue(0);

  //cosntant bouncing
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
  const [randomChoice, setRandomChoice] = useState<
    "rock" | "paper" | "scissors" | null
  >(null);
  const opacity = useSharedValue(0);
  const redOpacity = useSharedValue(0);

  const rockOpacity = useSharedValue(1);
  const paperOpacity = useSharedValue(1);
  const scissorsOpacity = useSharedValue(1);
  const textOpacity = useSharedValue(1);

  const selectedTranslateX = useSharedValue(0);
  const selectedTranslateY = useSharedValue(0);
  const selectedScale = useSharedValue(1);

  const randomTranslateY = useSharedValue(0);

  const cardWidth = 100;
  const cardHeight = 250;

  const centerX = width / 2 - cardWidth / 2;
  const centerY = height / 2 - cardHeight / 2;

  const [rounds, setRounds] = useState(1);
  const word = toWords(rounds);

  const cardPositions = {
    rock: 0,
    paper: cardWidth + 10,
    scissors: (cardWidth + 10) * 2,
  };

  const showSelected = (choice: "rock" | "paper" | "scissors") => {
    //move to own file
    setSelected(choice); //setting choice
    opacity.value = withTiming(0.5, { duration: 300 }); //dimming background

    //fade out non-selected cards
    rockOpacity.value = withTiming(choice === "rock" ? 1 : 0, {
      duration: 500,
    });
    paperOpacity.value = withTiming(choice === "paper" ? 1 : 0, {
      duration: 500,
    });
    scissorsOpacity.value = withTiming(choice === "scissors" ? 1 : 0, {
      duration: 500,
    });
    textOpacity.value = withTiming(0, { duration: 500 });
    //card positions
    const fromX = cardPositions[choice];
    const toX = centerX;
    //translate card to center
    const translateX = toX - fromX - 20;
    const translateY = centerY - (height / 2 - cardHeight / 2);
    //animation for translating
    selectedTranslateX.value = withTiming(translateX, { duration: 500 });
    selectedTranslateY.value = withTiming(translateY, { duration: 500 });
    selectedScale.value = withTiming(1.5, { duration: 500 });
    //returning back to original postion and fade back in other cards

    //determine winner
    const result = determineWinner(choice);
    setRandomChoice(result.randomChoice);

    const randomTranslatedY = -270;

    randomTranslateY.value = withSequence(
      withDelay(2000, withTiming(randomTranslatedY, { duration: 500 })),
      withDelay(1500, withTiming(randomTranslatedY, { duration: 0 })),
      withTiming(100, { duration: 300 })
    );
    setTimeout(() => {
      opacity.value = withTiming(0, { duration: 300 });

      rockOpacity.value = withTiming(1, { duration: 500 });
      paperOpacity.value = withTiming(1, { duration: 500 });
      scissorsOpacity.value = withTiming(1, { duration: 500 });
      if (result.result === "winner") {
        setRounds((prev) => prev + 1);
        textOpacity.value = withTiming(1, { duration: 500 });
      } else {
        redOpacity.value = withTiming(0.7, { duration: 1000 });
      }

      selectedTranslateX.value = withTiming(0, { duration: 500 });
      selectedTranslateY.value = withTiming(0, { duration: 500 });
      selectedScale.value = withTiming(1, { duration: 500 });

      setTimeout(() => runOnJS(setSelected)(null), 600);
    }, 4000);
  };

  const dimStyle = useAnimatedStyle(() => ({
    backgroundColor: "black",
    position: "absolute",
    top: 0,
    left: 0,
    width,
    height,
    opacity: redOpacity.value,
    zIndex: 1,
  }));
  const redStyle = useAnimatedStyle(() => ({
    backgroundColor: "red",
    position: "absolute",
    top: 0,
    left: 0,
    width,
    height,
    opacity: redOpacity.value,
    zIndex: redOpacity.value > 0 ? 10 : 0,
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

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
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

  const randomChoiceTransform = () =>
    useAnimatedStyle(() => {
      return {
        transform: [{ translateY: randomTranslateY.value }],
      };
    });

  const img1Style = useBouncingStyle(0);
  const img2Style = useBouncingStyle(200);
  const img3Style = useBouncingStyle(400);

  const rockSelectedStyle = selectedCardTransform("rock");
  const paperSelectedStyle = selectedCardTransform("paper");
  const scissorsSelectedStyle = selectedCardTransform("scissors");

  const randomChoiceStyle = randomChoiceTransform();

  const getRandomChoice = (): "rock" | "paper" | "scissors" => {
    // move
    const choices = ["rock", "paper", "scissors"] as const;
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
  };

  const determineWinner = (choice: "rock" | "paper" | "scissors") => {
    //move
    const randomChoice = getRandomChoice();

    if (choice === randomChoice) return { result: "lost", randomChoice };

    if (
      (choice === "rock" && randomChoice === "scissors") ||
      (choice === "paper" && randomChoice === "rock") ||
      (choice === "scissors" && randomChoice === "paper")
    ) {
      return { result: "winner", randomChoice };
    }

    return { result: "lost", randomChoice };
  };

  return (
    <View style={styles.container}>
      {randomChoice && (
        <View style={styles.resultContainer}>
          <Animated.Image
            source={
              randomChoice === "rock"
                ? rockHand
                : randomChoice === "paper"
                ? paperHand
                : scissorsHand
            }
            style={[styles.resultImage, randomChoiceStyle]}
          />
        </View>
      )}
      <Animated.View style={redStyle} />
      <Animated.View style={dimStyle} />
      <Animated.View style={textStyle}>
        <TypeAnimation
          key={word}
          sequence={[
            { text: "Round" },
            { text: `Round ${word}`, delayBetweenSequence: 2000 },
            { text: "", delayBetweenSequence: 500 },
            { text: "Rock, Paper, Scissors", delayBetweenSequence: 500 },
            { text: "", delayBetweenSequence: 500 },
            { text: "Which one is correct", delayBetweenSequence: 500 },
            { text: "", delayBetweenSequence: 500 },
            { text: "It could be paper", delayBetweenSequence: 500 },
            { text: "", delayBetweenSequence: 500 },
            { text: "Even rock", delayBetweenSequence: 700 },
            { text: "", delayBetweenSequence: 500 },
            { text: "But what if it's scissors", delayBetweenSequence: 500 },
          ]}
          loop={true}
          deletionSpeed={50}
          style={{
            color: "black",
            fontSize: 30,
          }}
        ></TypeAnimation>
      </Animated.View>
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
  resultImage: {
    width: 230,
    height: 310,
    resizeMode: "contain",
    transform: [{ rotate: "180deg" }],
  },
  resultContainer: {
    position: "absolute",
    top: -300,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 100,
    transform: [{ rotate: "180deg" }],
  },
});
