import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useNavigation } from "expo-router";
import { getHistory, type HistoryEntry } from "../../lib/history";
import { recipes } from "../../data/recipes";

export default function HomeScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showAboutModal, setShowAboutModal] = useState(false);

  // Recarrega o histórico sempre que a tela ganha foco
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getHistory().then((data) => setHistory(data));
    });
    getHistory().then((data) => setHistory(data));
    return unsubscribe;
  }, [navigation]);

  const totalFoodSaved = history.reduce((sum, entry) => sum + entry.savedFoodKg, 0);
  const totalCo2Saved = history.reduce((sum, entry) => sum + entry.savedCo2Kg, 0);
  const lastRecipe = history[0];

  return (
    <SafeAreaView style={styles.safeContainer} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header Hero */}
        <View style={styles.heroSection}>
          <View style={styles.heroHeader}>
            <View>
              <Text style={styles.heroSub}>ODS 12 na Cozinha</Text>
              <Text style={styles.heroTitle}>EasyChef</Text>
            </View>
            <View style={styles.leafIconContainer}>
              <Ionicons name="leaf" size={28} color="#fff" />
            </View>
          </View>
          <Text style={styles.heroDescription}>
            Identifique ingredientes disponíveis, evite o desperdício de alimentos e acompanhe o impacto ecológico do reaproveitamento.
          </Text>
          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => router.push("/scan")}
            activeOpacity={0.9}
          >
            <Ionicons name="camera" size={20} color="#fff" />
            <Text style={styles.scanButtonText}>Escanear Geladeira</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Content Area */}
        <View style={styles.contentBody}>
          {/* Metrics Row */}
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <View style={[styles.iconBadge, { backgroundColor: "#ecfdf5" }]}>
                <Ionicons name="leaf" size={20} color="#059669" />
              </View>
              <Text style={styles.metricValue}>{totalFoodSaved.toFixed(1)} kg</Text>
              <Text style={styles.metricLabel}>Comida Salva</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={[styles.iconBadge, { backgroundColor: "#fffbeb" }]}>
                <Ionicons name="flash" size={20} color="#d97706" />
              </View>
              <Text style={styles.metricValue}>{totalCo2Saved.toFixed(1)} kg</Text>
              <Text style={styles.metricLabel}>CO2 Evitado</Text>
            </View>
          </View>

          {/* Last Recipe Card */}
          {lastRecipe && (
            <View style={styles.infoCard}>
              <Text style={styles.infoCardSubtitle}>Último Preparo</Text>
              <Text style={styles.infoCardTitle}>{lastRecipe.recipeTitle}</Text>
              <Text style={styles.infoCardDate}>
                {new Date(lastRecipe.date).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </Text>
            </View>
          )}

          {/* Statistics Card */}
          <View style={styles.infoCardRow}>
            <View style={[styles.iconBadge, { backgroundColor: "#f5f5f4" }]}>
              <Ionicons name="restaurant" size={20} color="#44403c" />
            </View>
            <View style={styles.infoRowTextContainer}>
              <Text style={styles.infoCardTitle}>{recipes.length} receitas cadastradas</Text>
              <Text style={styles.infoCardDate}>Classificadas pelos ingredientes disponíveis.</Text>
            </View>
          </View>

          {/* Academic Card */}
          <View style={styles.academicCard}>
            <Text style={styles.academicTitle}>Informações Acadêmicas</Text>
            <Text style={styles.academicSubtitle}>
              EasyChef: Uma nova forma de reaproveitar alimentos
            </Text>
            <View style={styles.academicDetails}>
              <Text style={styles.academicDetailText}>
                <Text style={styles.bold}>Autores:</Text> Andrey Eduardo Indras, Gabriel de Souza Sena, Kaue Emanoel Tosta do Amaral
              </Text>
              <Text style={styles.academicDetailText}>
                <Text style={styles.bold}>Curso:</Text> Engenharia de Software - Projeto AEP 2026
              </Text>
            </View>
            <TouchableOpacity
              style={styles.detailButton}
              onPress={() => setShowAboutModal(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.detailButtonText}>Ver detalhes do projeto</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Modal Acadêmico */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showAboutModal}
          onRequestClose={() => setShowAboutModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderTitle}>EasyChef - AEP 2026</Text>
                <TouchableOpacity
                  onPress={() => setShowAboutModal(false)}
                  style={styles.closeModalButton}
                >
                  <Ionicons name="close" size={24} color="#57534e" />
                </TouchableOpacity>
              </View>

              <ScrollView contentContainerStyle={styles.modalScroll}>
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Autores:</Text>
                  <Text style={styles.modalSectionContent}>
                    Andrey Eduardo Indras, Gabriel de Souza Sena, Kaue Emanoel Tosta do Amaral
                  </Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Resumo do Projeto:</Text>
                  <Text style={styles.modalSectionContent}>
                    O desperdício de alimentos é um dos maiores desafios de sustentabilidade, afetando diretamente as esferas ambiental, social e econômica. O EasyChef foi concebido para identificar ingredientes disponíveis a partir de fotos e sugerir receitas de forma automatizada por meio de Inteligência Artificial, prevenindo crises alimentares e estimulando o consumo e produção responsáveis (ODS 12).
                  </Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Metodologia Acadêmica:</Text>
                  <Text style={styles.modalSectionContent}>
                    O aplicativo prevê o desenvolvimento em React Native para compatibilidade Android/iOS, capturando a imagem dos ingredientes via biblioteca expo-camera. As imagens são enviadas por requisições HTTP e formato JSON para um backend Node.js, responsável pela comunicação com o modelo de IA (deep learning) para reconhecimento dos itens e LLM para estruturação das receitas.
                  </Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Referências Bibliográficas:</Text>
                  <Text style={styles.referenceItem}>
                    1. SIQUEIRA, R. de (2025). Inteligência artificial na prevenção de crises alimentares.
                  </Text>
                  <Text style={styles.referenceItem}>
                    2. CHEN, J. et al. (2016). Deep learning para reconhecimento de ingredientes em imagens.
                  </Text>
                  <Text style={styles.referenceItem}>
                    3. SALVADOR, A. et al. (2019). Geração de receitas a partir de imagens de alimentos.
                  </Text>
                  <Text style={styles.referenceItem}>
                    4. BOYD, J. (2023). FridgeSnap: Redução de desperdício com análise visual.
                  </Text>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
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
  heroSection: {
    backgroundColor: "#1c1917",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 20 : 35,
    paddingBottom: 30,
  },
  heroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroSub: {
    color: "#34d399",
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "900",
    marginTop: 4,
  },
  leafIconContainer: {
    backgroundColor: "#10b981",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  heroDescription: {
    color: "#d6d3d1",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 16,
  },
  scanButton: {
    backgroundColor: "#10b981",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 24,
  },
  scanButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  contentBody: {
    paddingHorizontal: 16,
    marginTop: -16,
    gap: 16,
  },
  metricsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e7e5e4",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  metricValue: {
    fontSize: 22,
    fontWeight: "900",
    color: "#1c1917",
    marginTop: 12,
  },
  metricLabel: {
    fontSize: 12,
    color: "#78716c",
    fontWeight: "600",
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e7e5e4",
  },
  infoCardSubtitle: {
    fontSize: 11,
    color: "#78716c",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  infoCardTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1c1917",
    marginTop: 4,
  },
  infoCardDate: {
    fontSize: 13,
    color: "#78716c",
    marginTop: 2,
  },
  infoCardRow: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e7e5e4",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  infoRowTextContainer: {
    flex: 1,
  },
  academicCard: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e7e5e4",
    gap: 8,
  },
  academicTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#1c1917",
  },
  academicSubtitle: {
    fontSize: 12,
    color: "#78716c",
    fontWeight: "bold",
  },
  academicDetails: {
    gap: 4,
    marginTop: 4,
  },
  academicDetailText: {
    fontSize: 12,
    color: "#44403c",
    lineHeight: 18,
  },
  bold: {
    fontWeight: "bold",
  },
  detailButton: {
    backgroundColor: "#f5f5f4",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  detailButtonText: {
    fontSize: 12,
    color: "#44403c",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "85%",
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f4",
    paddingBottom: 12,
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#1c1917",
  },
  closeModalButton: {
    padding: 4,
  },
  modalScroll: {
    paddingVertical: 16,
    gap: 16,
  },
  modalSection: {
    gap: 4,
  },
  modalSectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0f172a",
  },
  modalSectionContent: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 20,
  },
  referenceItem: {
    fontSize: 12,
    color: "#64748b",
    lineHeight: 18,
    paddingLeft: 4,
  },
});
