import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "TOKENS";
const LAST_USED_KEY = "LAST_USED";
const MAX_TOKENS = 2;
const REGEN_HOURS = 12;
const MS_PER_TOKEN = REGEN_HOURS * 60 * 60 * 1000;

export function useTokenManager() {
  const [tokens, setTokens] = useState<number>(MAX_TOKENS);
  const [nextTokenIn, setNextTokenIn] = useState<number | null>(null);

  const loadTokens = async () => {
    const lastUsed = await AsyncStorage.getItem(LAST_USED_KEY);
    const storedTokens = await AsyncStorage.getItem(TOKEN_KEY);

    let currentTokens = storedTokens ? parseInt(storedTokens) : MAX_TOKENS;
    let nextIn: number | null = null;

    if (lastUsed) {
      const last = new Date(lastUsed).getTime();
      const now = Date.now();
      const diff = now - last;
      const regenerated = Math.floor(diff / MS_PER_TOKEN);
      const remainder = diff % MS_PER_TOKEN;

      if (regenerated > 0) {
        currentTokens = Math.min(MAX_TOKENS, currentTokens + regenerated);
        if (currentTokens < MAX_TOKENS) {
          await AsyncStorage.setItem(
            LAST_USED_KEY,
            new Date(now - remainder).toISOString()
          );
        } else {
          await AsyncStorage.removeItem(LAST_USED_KEY);
        }
        await AsyncStorage.setItem(TOKEN_KEY, currentTokens.toString());
      }

      if (currentTokens < MAX_TOKENS) {
        nextIn = MS_PER_TOKEN - remainder;
      }
    }

    setTokens(currentTokens);
    setNextTokenIn(nextIn);
  };

  const useToken = async () => {
    if (tokens > 0) {
      const newCount = tokens - 1;
      setTokens(newCount);
      await AsyncStorage.setItem(TOKEN_KEY, newCount.toString());
      if (newCount < MAX_TOKENS) {
        await AsyncStorage.setItem(LAST_USED_KEY, new Date().toISOString());
        setNextTokenIn(MS_PER_TOKEN);
      }
      return true;
    }
    return false;
  };

  useEffect(() => {
    loadTokens();
    const interval = setInterval(loadTokens, 60000);
    return () => clearInterval(interval);
  }, []);

  return { tokens, useToken, nextTokenIn };
}
