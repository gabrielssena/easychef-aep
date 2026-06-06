import React, { useMemo, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { matchRecipes } from "../lib/recipeMatcher";
import { commonIngredients, mergeIngredients, parseIngredientInput } from "../lib/ingredients";

export default function ResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  
  const initialIngredients = useMemo(() => {
    if (params.ingredients) {
      try {
        return JSON.parse(params.ingredients as string) as string[];
      } catch {
        return [];
      }
    }
    return [];
  }, [params.ingredients]);

  const [selectedIngredients, setSelectedIngredients] = useState<string[]>(initialIngredients);
  const [manualText, setManualText] = useState("");

  const matches = useMemo(() => matchRecipes(selectedIngredients), [selectedIngredients]);

 
  const { readyRecipes, incompleteRecipes } = useMemo(() => {
    const ready: typeof matches = [];
    const incomplete: typeof matches = [];

    matches.forEach((match) => {
      if (match.missingIngredients.length === 0) {
        ready.push(match);
      } else {
        incomplete.push(match);
      }
    });

    return { readyRecipes: ready, incompleteRecipes: incomplete };
  }, [matches]);

  const totalPotentialFood = matches.slice(0, 3).reduce((sum, match) => sum + match.recipe.savedFoodKg, 0);

  const addIngredients = (items: string[]) => {
    setSelectedIngredients((current) => mergeIngredients(current, items));
  };

  const removeIngredient = (ingredient: string) => {
    setSelectedIngredients((current) => current.filter((item) => item !== ingredient));
  };

  const handleAddManualText = () => {
    const parsed = parseIngredientInput(manualText);
    if (parsed.length > 0) {
      addIngredients(parsed);
      setManualText("");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      {params.imageSrc === "geladeira_real" && (
        <View style={styles.bannerContainer}>
          <Text style={styles.bannerText}>
            Foto da geladeira analisada pela IA
          </Text>
        </View>
      )}

      {/* Card de Ingredientes Detectados */}
      <View style={styles.sectionCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Ingredientes na Geladeira</Text>
          <Text style={styles.cardSubtitle}>{selectedIngredients.length} item(ns)</Text>
        </View>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            value={manualText}
            onChangeText={setManualText}
            placeholder="Adicionar ingrediente"
            onSubmitEditing={handleAddManualText}
            returnKeyType="done"
          />
          <TouchableOpacity style={styles.addBtn} onPress={handleAddManualText}>
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.tagsContainer}>
          {selectedIngredients.map((item) => (
            <TouchableOpacity
              key={item}
              style={styles.tag}
              onPress={() => removeIngredient(item)}
            >
              <Text style={styles.tagText}>{item}</Text>
              <Ionicons name="close-circle" size={14} color="#065f46" />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Info Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statVal}>{matches.length}</Text>
          <Text style={styles.statLbl}>receitas</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statVal, { color: "#047857" }]}>{selectedIngredients.length}</Text>
          <Text style={styles.statLbl}>itens</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statVal, { color: "#b45309" }]}>{totalPotentialFood.toFixed(1)}</Text>
          <Text style={styles.statLbl}>kg a salvar</Text>
        </View>
      </View>

      {/* Listas de Receitas */}
      {matches.length > 0 ? (
        <View style={styles.listsContainer}>
          {/* Fazer agora */}
          {readyRecipes.length > 0 && (
            <View style={styles.recipeListSection}>
              <View style={styles.listHeader}>
                <Ionicons name="checkmark-circle" size={18} color="#059669" />
                <Text style={styles.listTitle}>Fazer agora (Completo)</Text>
                <View style={[styles.badge, { backgroundColor: "#d1fae5" }]}>
                  <Text style={[styles.badgeText, { color: "#065f46" }]}>{readyRecipes.length}</Text>
                </View>
              </View>

              {readyRecipes.map(({ recipe, matchedIngredients }) => (
                <TouchableOpacity
                  key={recipe.id}
                  style={[styles.recipeCard, styles.readyBorder]}
                  activeOpacity={0.8}
                  onPress={() =>
                    router.push({
                      pathname: "/recipe/[id]",
                      params: { id: recipe.id, detectedIngredients: JSON.stringify(selectedIngredients) },
                    })
                  }
                >
                  <View style={styles.recipeImagePlaceholder}>
                    <Ionicons name="restaurant" size={24} color="#059669" />
                  </View>
                  <View style={styles.recipeDetails}>
                    <Text style={styles.recipeTitle}>{recipe.title}</Text>
                    <Text style={styles.recipeDescription} numberOfLines={2}>
                      {recipe.description}
                    </Text>
                    <View style={styles.recipeMeta}>
                      <View style={styles.metaItem}>
                        <Ionicons name="time-outline" size={12} color="#78716c" />
                        <Text style={styles.metaText}>{recipe.prepTime}</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Ionicons name="leaf-outline" size={12} color="#059669" />
                        <Text style={[styles.metaText, { color: "#059669", fontWeight: "bold" }]}>
                          Tudo disponível
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Falta pouco */}
          {incompleteRecipes.length > 0 && (
            <View style={styles.recipeListSection}>
              <View style={styles.listHeader}>
                <Ionicons name="cart" size={18} color="#d97706" />
                <Text style={styles.listTitle}>Falta pouco (Ir ao mercado)</Text>
                <View style={[styles.badge, { backgroundColor: "#fef3c7" }]}>
                  <Text style={[styles.badgeText, { color: "#92400e" }]}>{incompleteRecipes.length}</Text>
                </View>
              </View>

              {incompleteRecipes.map(({ recipe, matchCount, missingIngredients }) => (
                <TouchableOpacity
                  key={recipe.id}
                  style={[styles.recipeCard, styles.incompleteBorder]}
                  activeOpacity={0.8}
                  onPress={() =>
                    router.push({
                      pathname: "/recipe/[id]",
                      params: { id: recipe.id, detectedIngredients: JSON.stringify(selectedIngredients) },
                    })
                  }
                >
                  <View style={styles.recipeImagePlaceholder}>
                    <Ionicons name="restaurant" size={24} color="#d97706" />
                  </View>
                  <View style={styles.recipeDetails}>
                    <Text style={styles.recipeTitle}>{recipe.title}</Text>
                    <Text style={styles.recipeDescription} numberOfLines={2}>
                      {recipe.description}
                    </Text>
                    <View style={styles.recipeMeta}>
                      <View style={styles.metaItem}>
                        <Ionicons name="time-outline" size={12} color="#78716c" />
                        <Text style={styles.metaText}>{recipe.prepTime}</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Ionicons name="alert-circle-outline" size={12} color="#b45309" />
                        <Text style={[styles.metaText, { color: "#b45309" }]}>
                          {matchCount} de {recipe.ingredients.length} itens
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.missingIngredientsText} numberOfLines={1}>
                      Falta: <Text style={styles.boldMissing}>{missingIngredients.join(", ")}</Text>
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="sad-outline" size={40} color="#a8a29e" />
          <Text style={styles.emptyTitle}>Nenhuma combinação encontrada</Text>
          <Text style={styles.emptySubtitle}>
            Adicione mais ingredientes na geladeira para liberar sugestões de receitas.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f4",
  },
  scrollContainer: {
    paddingVertical: 16,
    gap: 16,
  },
  bannerContainer: {
    marginHorizontal: 16,
    padding: 12,
    backgroundColor: "#e6f4ea",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#a7f3d0",
    alignItems: "center",
  },
  bannerText: {
    fontSize: 13,
    color: "#137333",
    fontWeight: "bold",
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
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#1c1917",
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#78716c",
    fontWeight: "600",
  },
  inputRow: {
    flexDirection: "row",
    gap: 8,
  },
  textInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#d6d3d1",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    backgroundColor: "#fdfbf7",
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#059669",
    justifyContent: "center",
    alignItems: "center",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#d1fae5",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 13,
    color: "#065f46",
    fontWeight: "bold",
  },
  statsRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e7e5e4",
    paddingVertical: 10,
    alignItems: "center",
  },
  statVal: {
    fontSize: 18,
    fontWeight: "900",
    color: "#1c1917",
  },
  statLbl: {
    fontSize: 10,
    color: "#78716c",
    fontWeight: "bold",
    marginTop: 2,
    textTransform: "uppercase",
  },
  listsContainer: {
    gap: 20,
    paddingHorizontal: 16,
  },
  recipeListSection: {
    gap: 10,
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  listTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#1c1917",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "bold",
  },
  recipeCard: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e7e5e4",
    flexDirection: "row",
    overflow: "hidden",
    height: 110,
  },
  readyBorder: {
    borderLeftWidth: 4,
    borderLeftColor: "#10b981",
  },
  incompleteBorder: {
    borderLeftWidth: 4,
    borderLeftColor: "#f59e0b",
  },
  recipeImage: {
    width: 100,
    height: "100%",
    resizeMode: "cover",
  },
  recipeImagePlaceholder: {
    width: 100,
    height: "100%",
    backgroundColor: "#f5f5f4",
    justifyContent: "center",
    alignItems: "center",
  },
  recipeDetails: {
    flex: 1,
    padding: 10,
    justifyContent: "space-between",
  },
  recipeTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1c1917",
  },
  recipeDescription: {
    fontSize: 11,
    color: "#78716c",
    lineHeight: 14,
  },
  recipeMeta: {
    flexDirection: "row",
    gap: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 10,
    color: "#78716c",
  },
  missingIngredientsText: {
    fontSize: 10.5,
    color: "#78716c",
  },
  boldMissing: {
    color: "#dc2626",
    fontWeight: "600",
  },
  emptyContainer: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e7e5e4",
    alignItems: "center",
    gap: 8,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1c1917",
  },
  emptySubtitle: {
    fontSize: 12,
    color: "#78716c",
    textAlign: "center",
    lineHeight: 18,
  },
});
