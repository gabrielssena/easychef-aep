import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { clearHistory, getHistory, type HistoryEntry } from "../../lib/history";

export default function HistoryScreen() {
  const navigation = useNavigation();
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const loadHistory = async () => {
    const data = await getHistory();
    setHistory(data);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadHistory();
    });
    loadHistory();
    return unsubscribe;
  }, [navigation]);

  const totalFoodSaved = history.reduce((sum, entry) => sum + entry.savedFoodKg, 0);
  const totalCo2Saved = history.reduce((sum, entry) => sum + entry.savedCo2Kg, 0);

  const handleClear = () => {
    Alert.alert(
      "Limpar Histórico",
      "Deseja apagar todo o histórico de preparos do EasyChef?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Limpar",
          style: "destructive",
          onPress: async () => {
            await clearHistory();
            setHistory([]);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeContainer} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.headerSub}>Acompanhamento</Text>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Seu Impacto</Text>
            {history.length > 0 && (
              <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
                <Ionicons name="trash-outline" size={20} color="#dc2626" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Dashboard Grid */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <View style={[styles.iconBadge, { backgroundColor: "#ecfdf5" }]}>
              <Ionicons name="leaf" size={22} color="#059669" />
            </View>
            <Text style={styles.metricValue}>{totalFoodSaved.toFixed(1)}</Text>
            <Text style={styles.metricLabel}>kg de comida salva</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.iconBadge, { backgroundColor: "#fffbeb" }]}>
              <Ionicons name="time" size={22} color="#d97706" />
            </View>
            <Text style={styles.metricValue}>{totalCo2Saved.toFixed(1)}</Text>
            <Text style={styles.metricLabel}>kg de CO2 evitado</Text>
          </View>
        </View>

        {/* History List */}
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Receitas Preparadas</Text>

          {history.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="restaurant-outline" size={42} color="#a8a29e" />
              <Text style={styles.emptyTitle}>Nenhum preparo registrado</Text>
              <Text style={styles.emptySubtitle}>
                Os registros do histórico aparecerão depois que você concluir e registrar receitas.
              </Text>
            </View>
          ) : (
            <View style={styles.historyList}>
              {history.map((entry) => (
                <View key={entry.id} style={styles.historyItem}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemTitle}>{entry.recipeTitle}</Text>
                    <Text style={styles.itemDate}>
                      {new Date(entry.date).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </Text>
                  </View>
                  <View style={styles.itemBadge}>
                    <Text style={styles.itemBadgeText}>+{entry.savedFoodKg} kg</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#f5f5f4",
  },
  scrollContainer: {
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerSub: {
    fontSize: 12,
    color: "#059669",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#1c1917",
  },
  clearBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#fee2e2",
  },
  metricsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
    marginTop: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e7e5e4",
    alignItems: "center",
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  metricValue: {
    fontSize: 28,
    fontWeight: "900",
    color: "#1c1917",
    marginTop: 12,
  },
  metricLabel: {
    fontSize: 12,
    color: "#78716c",
    fontWeight: "600",
    marginTop: 2,
    textAlign: "center",
  },
  historySection: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#1c1917",
    marginBottom: 12,
  },
  emptyContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e7e5e4",
    padding: 30,
    alignItems: "center",
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1c1917",
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 12,
    color: "#78716c",
    textAlign: "center",
    lineHeight: 18,
  },
  historyList: {
    gap: 10,
  },
  historyItem: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e7e5e4",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemInfo: {
    flex: 1,
    gap: 2,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1c1917",
  },
  itemDate: {
    fontSize: 12,
    color: "#78716c",
  },
  itemBadge: {
    backgroundColor: "#d1fae5",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  itemBadgeText: {
    fontSize: 12,
    color: "#065f46",
    fontWeight: "bold",
  },
});
