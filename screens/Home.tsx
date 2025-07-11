import React from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
  withRepeat,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";

const duration = 800;

export default function HomeScreen({ navigation }) {
  const offset = useSharedValue<number>(120 / 2 - 240);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  React.useEffect(() => {
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

  return (
    <View className="flex-1 bg-white">
      <View className="flex items-center pt-[100px]">
        <Animated.View style={[styles.box, animatedStyles]} />
      </View>
      <View className="flex-1 justify-center items-center">
        <Text className="text-[24px] text-blue-500 font-bold mb-[20px]">
          Welcome to Nativewind!
        </Text>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate("Game")}
        >
          <Text style={styles.buttonText}>Play a Game</Text>
        </Pressable>
      </View>

      {/* Empty space at bottom to push middle content up */}
      <View style={styles.bottomSpacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    height: 120,
    width: 120,
    backgroundColor: "#ef4444",
    borderRadius: 16,
  },
  bottomSpacer: {
    height: 120, // adjust to control spacing below button
  },
  button: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
