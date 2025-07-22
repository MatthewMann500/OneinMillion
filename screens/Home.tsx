import React, { useEffect, useState } from "react";
import { Text, Image, View, StyleSheet, Pressable, Alert } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
  withRepeat,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { useTokenManager } from "../useTokenManager";
import RSBattle from "../RockScissors";
import PRBattle from "../PaperRock";
import SPBattle from "../ScissorsPaper";

const duration = 800;

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
}

export default function HomeScreen({ navigation }) {
  const offset = useSharedValue<number>(120 / 2 - 240);

  const { tokens, useToken, nextTokenIn } = useTokenManager();
  const [remainingTime, setRemainingTime] = useState<string | null>(null);

  const battles = [
    <SPBattle key="SP" />,
    <PRBattle key="PR" />,
    <RSBattle key="RS" />,
  ];

  const tokenCardImages = [
    require("../assets/Paper_Card.png"),
    require("../assets/Rock_Card.png"),
    require("../assets/Scissors_Card.png"),
  ];
  const [currentBattleIndex, setCurrentBattleIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBattleIndex((prev) => (prev + 1) % battles.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    offset.value = withRepeat(
      withSequence(
        withTiming(-120 / 2 + 240, { duration, easing: Easing.cubic }),
        withTiming(0, { duration, easing: Easing.cubic }),
        withTiming(120 / 2 - 240, { duration, easing: Easing.cubic })
      ),
      -1,
      true
    );
  }, []);

  useEffect(() => {
    if (tokens < 3 && nextTokenIn !== null) {
      const start = Date.now();
      const interval = setInterval(() => {
        const msLeft = Math.max(0, nextTokenIn - (Date.now() - start));
        setRemainingTime(formatTime(msLeft));
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setRemainingTime(null);
    }
  }, [tokens, nextTokenIn]);

  const handlePlay = async () => {
    const ok = await useToken();
    if (ok) {
      navigation.navigate("Game");
    } else {
      Alert.alert("No tokens", "You need to wait until a token regenerates.");
    }
  };

  return (
    <View className="flex-1 bg-white ">
      {battles[currentBattleIndex]}
      <View className="flex-1 justify-center items-center">
        <View style={{ flexDirection: "row", marginBottom: 20 }}>
          {tokens > 0 ? (
            tokenCardImages
              .slice(0, tokens)
              .map((imgSrc, i) => (
                <Image
                  key={i}
                  source={imgSrc}
                  style={{ width: 40, height: 60, marginHorizontal: 4 }}
                  resizeMode="contain"
                />
              ))
          ) : (
            <Text style={{ color: "#6b7280", fontSize: 16 }}>
              No tokens available
            </Text>
          )}
        </View>
        {tokens < 3 && remainingTime && (
          <Text style={{ marginBottom: 16, color: "#6b7280" }}>
            Next token in: {remainingTime}
          </Text>
        )}
        <Pressable style={styles.button} onPress={handlePlay}>
          <Text style={styles.buttonText}>Play a Game</Text>
        </Pressable>
      </View>
      <View style={styles.bottomSpacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  bottomSpacer: {
    height: 120,
  },
  button: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 80,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
