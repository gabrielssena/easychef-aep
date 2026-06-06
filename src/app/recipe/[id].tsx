import React, { useMemo, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { recipes } from "../../data/recipes";
import { getRecipeMatch } from "../../lib/recipeMatcher";
import { saveRecipeToHistory } from "../../lib/history";

export default function RecipeDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id } = params;

  const recipe = useMemo(() => recipes.find((item) => item.id === id), [id]);
  const [cooked, setCooked] = useState(false);

  const detectedIngredients = useMemo(() => {
    if (params.detectedIngredients) {
      try {
        return JSON.parse(params.detectedIngredients as string) as string[];
      } catch {
        return [];
      }
    }
    return [];
  }, [params.detectedIngredients]);

  const match = useMemo(() => {
    if (!recipe) return null;
    return getRecipeMatch(recipe, detectedIngredients);
  }, [recipe, detectedIngredients]);

  if (!recipe || !match) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#dc2626" />
        <Text style={styles.errorText}>Receita não encontrada</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleCook = async () => {
    await saveRecipeToHistory(recipe, detectedIngredients);
    setCooked(true);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      {/* Recipe Header */}
      <View style={styles.headerWrapper}>
        <View style={styles.headerIconBadge}>
          <Ionicons name="restaurant" size={26} color="#059669" />
        </View>
        <Text style={styles.difficulty}>{recipe.difficulty}</Text>
        <Text style={styles.recipeTitle}>{recipe.title}</Text>
        <Text style={styles.recipeDesc}>{recipe.description}</Text>
      </View>

      {/* Info Pills */}
      <View style={styles.infoGrid}>
        <View style={styles.infoBox}>
          <Ionicons name="time" size={20} color="#57534e" />
          <Text style={styles.infoValue}>{recipe.prepTime}</Text>
        </View>
        <View style={styles.infoBox}>
          <Ionicons name="people" size={20} color="#57534e" />
          <Text style={styles.infoValue}>{recipe.servings} porções</Text>
        </View>
        <View style={[styles.infoBox, { backgroundColor: "#ecfdf5" }]}>
          <Ionicons name="leaf" size={20} color="#059669" />
          <Text style={[styles.infoValue, { color: "#065f46" }]}>{recipe.savedFoodKg} kg</Text>
        </View>
      </View>

      {/* ODS 12 Banner */}
      <View style={styles.odsCard}>
        <Text style={styles.odsTitle}>Impacto Ecológico ODS 12</Text>
        <Text style={styles.odsText}>
          Preparando esta receita, você reaproveita cerca de {recipe.savedFoodKg} kg de alimento e evita a emissão de {recipe.savedCo2Kg} kg de CO2 na atmosfera.
        </Text>
      </View>

      {/* Ingredients List */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Ingredientes</Text>
        <View style={styles.ingredientsList}>
          {recipe.ingredients.map((ingredient) => {
            const isAvailable = match.matchedIngredients.includes(ingredient);
            return (
              <View key={ingredient} style={styles.ingredientRow}>
                <Ionicons
                  name={isAvailable ? "checkmark-circle" : "ellipse-outline"}
                  size={20}
                  color={isAvailable ? "#059669" : "#d6d3d1"}
                />
                <Text style={[styles.ingredientName, isAvailable ? styles.availableText : null]}>
                  {ingredient}
                </Text>
                {isAvailable && (
                  <View style={styles.availableBadge}>
                    <Text style={styles.availableBadgeText}>disponível</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </View>

      {/* Instructions */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Modo de Preparo</Text>
        <View style={styles.instructionsList}>
          {recipe.instructions.map((step, index) => (
            <View key={step} style={styles.stepRow}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Action Button */}
      <TouchableOpacity
        style={[styles.cookBtn, cooked ? styles.cookedBtn : null]}
        onPress={handleCook}
        disabled={cooked}
        activeOpacity={0.9}
      >
        <Ionicons name={cooked ? "checkmark-circle" : "restaurant"} size={20} color="#fff" />
        <Text style={styles.cookBtnText}>
          {cooked ? "Preparo Registrado!" : "Registrar Preparo"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f4",
  },
  scrollContainer: {
    paddingBottom: 40,
    gap: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  errorText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1c1917",
  },
  backBtn: {
    backgroundColor: "#1c1917",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  headerWrapper: {
    backgroundColor: "#1c1917",
    padding: 24,
    paddingTop: 36,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    gap: 6,
  },
  headerIconBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ecfdf5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  difficulty: {
    fontSize: 11,
    color: "#34d399",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  recipeTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#fff",
  },
  recipeDesc: {
    fontSize: 13,
    color: "#e7e5e4",
    lineHeight: 18,
    marginTop: 4,
  },
  infoGrid: {
    flexDirection: "row",
    marginHorizontal: 16,
    gap: 10,
  },
  infoBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e7e5e4",
    paddingVertical: 12,
    alignItems: "center",
    gap: 4,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#1c1917",
  },
  odsCard: {
    backgroundColor: "#ecfdf5",
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#a7f3d0",
    gap: 6,
  },
  odsTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#065f46",
  },
  odsText: {
    fontSize: 13,
    color: "#065f46",
    lineHeight: 18,
  },
  sectionCard: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e7e5e4",
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#1c1917",
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f4",
    paddingBottom: 8,
  },
  ingredientsList: {
    gap: 10,
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  ingredientName: {
    fontSize: 14,
    color: "#44403c",
    textTransform: "capitalize",
  },
  availableText: {
    fontWeight: "bold",
    color: "#1c1917",
  },
  availableBadge: {
    backgroundColor: "#d1fae5",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: "auto",
  },
  availableBadgeText: {
    fontSize: 10,
    color: "#065f46",
    fontWeight: "bold",
  },
  instructionsList: {
    gap: 14,
  },
  stepRow: {
    flexDirection: "row",
    gap: 12,
  },
  stepNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#f5f5f4",
    justifyContent: "center",
    alignItems: "center",
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#44403c",
  },
  stepText: {
    flex: 1,
    fontSize: 13,
    color: "#44403c",
    lineHeight: 18,
  },
  cookBtn: {
    backgroundColor: "#059669",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 8,
  },
  cookedBtn: {
    backgroundColor: "#78716c",
  },
  cookBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
