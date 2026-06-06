import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Recipe } from "../data/recipes";

export interface HistoryEntry {
  id: string;
  recipeId: string;
  recipeTitle: string;
  date: string;
  savedFoodKg: number;
  savedCo2Kg: number;
  detectedIngredients: string[];
}

const historyKey = "easychef_history";

export async function getHistory(): Promise<HistoryEntry[]> {
  const stored = await AsyncStorage.getItem(historyKey);
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveRecipeToHistory(recipe: Recipe, detectedIngredients: string[]): Promise<HistoryEntry> {
  const entry: HistoryEntry = {
    id: Math.random().toString(36).substring(2, 9),
    recipeId: recipe.id,
    recipeTitle: recipe.title,
    date: new Date().toISOString(),
    savedFoodKg: recipe.savedFoodKg,
    savedCo2Kg: recipe.savedCo2Kg,
    detectedIngredients,
  };

  const currentHistory = await getHistory();
  await AsyncStorage.setItem(historyKey, JSON.stringify([entry, ...currentHistory]));
  return entry;
}

export async function clearHistory(): Promise<void> {
  await AsyncStorage.removeItem(historyKey);
}
