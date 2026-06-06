import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { analyzeImage } from "../../lib/api";
import { commonIngredients, mergeIngredients, parseIngredientInput } from "../../lib/ingredients";


const MOCK_GELADEIRA_BASE64 = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=";

export default function ScanScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [manualText, setManualText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Capturar foto da câmera
  const handleCapture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.85,
          base64: true,
        });
        if (photo?.base64) {
          setImageSrc(`data:image/jpeg;base64,${photo.base64}`);
          setError(null);
        } else if (photo?.uri) {
          setImageSrc(photo.uri);
          setError(null);
        }
      } catch (err) {
        setError("Não foi possível capturar a imagem pela câmera.");
      }
    }
  };

  // Escolher uma foto real da galeria do celular
  const handleUploadSimulated = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        setError("O aplicativo precisa de permissão para acessar suas fotos.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        if (asset.base64) {
          setImageSrc(`data:image/jpeg;base64,${asset.base64}`);
        } else if (asset.uri) {
          setImageSrc(asset.uri);
        }
        setError(null);
      }
    } catch (err) {
      setError("Não foi possível selecionar a imagem da galeria.");
    }
  };

  // Adicionar ingredientes manuais
  const addIngredients = (items: string[]) => {
    setIngredients((current) => mergeIngredients(current, items));
  };

  // Remover ingredientes selecionados
  const removeIngredient = (ingredient: string) => {
    setIngredients((current) => current.filter((item) => item !== ingredient));
  };

  const handleAddManualText = () => {
    const parsed = parseIngredientInput(manualText);
    if (parsed.length > 0) {
      addIngredients(parsed);
      setManualText("");
      setError(null);
    }
  };

  // Executar análise por IA
  const runAnalysis = async () => {
    if (!imageSrc) {
      setError("Por favor, tire ou carregue uma foto da geladeira.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setProgress(0);

    // Incrementa suavemente o progresso de 0% a 100% em 3.5 segundos (32ms por passo)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 32);

    try {
      // Aguarda 3.5 segundos para a barra de progresso ser exibida de forma convincente
      await new Promise((resolve) => setTimeout(resolve, 3500));
      clearInterval(interval);
      setProgress(100);

      const imageToSend = imageSrc === "geladeira_mock" ? MOCK_GELADEIRA_BASE64 : imageSrc;
      const result = await analyzeImage(imageToSend);
      const detected = result.ingredients.filter(Boolean);

      if (detected.length === 0) {
        setError("Nenhum ingrediente pôde ser identificado na imagem.");
        return;
      }

      // Navega para resultados passando os dados
      router.push({
        pathname: "/results",
        params: {
          ingredients: JSON.stringify(mergeIngredients(ingredients, detected)),
          imageSrc: imageSrc === "geladeira_mock" ? "geladeira_real" : imageSrc,
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Serviço de análise offline indisponível.");
    } finally {
      clearInterval(interval);
      setIsAnalyzing(false);
      setProgress(0);
    }
  };

  const goToResultsManual = () => {
    if (ingredients.length === 0) {
      setError("Adicione pelo menos um ingrediente para buscar receitas.");
      return;
    }
    router.push({
      pathname: "/results",
      params: {
        ingredients: JSON.stringify(ingredients),
        imageSrc: null,
      },
    });
  };

  if (!permission) {
    // Carregando permissões
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#047857" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        {/* Visualização da Câmera ou Imagem Capturada */}
        <View style={styles.cameraBox}>
          {imageSrc ? (
            <View style={styles.previewContainer}>
              {imageSrc === "geladeira_mock" ? (
                <Image source={require("../../../assets/geladeira.jpg")} style={styles.previewImage} />
              ) : (
                <Image source={{ uri: imageSrc }} style={styles.previewImage} />
              )}
              <TouchableOpacity
                style={styles.retakeButton}
                onPress={() => setImageSrc(null)}
              >
                <Ionicons name="refresh" size={16} color="#1c1917" />
                <Text style={styles.retakeButtonText}>Tirar Outra Foto</Text>
              </TouchableOpacity>
            </View>
          ) : !permission.granted ? (
            <View style={styles.permissionContainer}>
              <Ionicons name="camera-reverse-outline" size={48} color="#78716c" />
              <Text style={styles.permissionText}>O EasyChef precisa de permissão de câmera para funcionar.</Text>
              <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
                <Text style={styles.permissionBtnText}>Permitir Câmera</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.cameraWrapper}>
              {Platform.OS !== "web" ? (
                <CameraView style={StyleSheet.absoluteFill} ref={cameraRef} />
              ) : (
                <View style={styles.mockCameraPlaceholder}>
                  <Ionicons name="videocam" size={48} color="#78716c" />
                  <Text style={styles.mockCameraText}>Visualização da câmera indisponível na Web</Text>
                </View>
              )}
              {/* Moldura Guia */}
              <View style={styles.cameraFrame} />
            </View>
          )}

          {/* Botões de Ação da Câmera */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleUploadSimulated}
            >
              <Ionicons name="image" size={24} color="#fff" />
            </TouchableOpacity>

            {!imageSrc ? (
              <TouchableOpacity
                style={styles.captureBtn}
                onPress={handleCapture}
                disabled={!permission.granted}
              >
                <View style={styles.captureInner} />
              </TouchableOpacity>
            ) : (
              <View style={styles.capturePlaceholder} />
            )}

            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: imageSrc ? "#059669" : "#44403c" }]}
              onPress={runAnalysis}
              disabled={!imageSrc || isAnalyzing}
            >
              <Ionicons name="sparkles" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {error && (
          <View style={styles.errorAlert}>
            <Ionicons name="alert-circle" size={18} color="#7f1d1d" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Input Manual e Lista */}
        <View style={styles.sectionCard}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>Lista de Ingredientes</Text>
              <Text style={styles.cardSubtitle}>{ingredients.length} selecionado(s)</Text>
            </View>
            <TouchableOpacity style={styles.searchBtn} onPress={goToResultsManual}>
              <Ionicons name="checkmark-done" size={16} color="#fff" />
              <Text style={styles.searchBtnText}>Buscar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              value={manualText}
              onChangeText={setManualText}
              placeholder="Ex: arroz, tomate, queijo"
              onSubmitEditing={handleAddManualText}
              returnKeyType="done"
            />
            <TouchableOpacity style={styles.addBtn} onPress={handleAddManualText}>
              <Ionicons name="add" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Tags */}
          {ingredients.length > 0 && (
            <View style={styles.tagsContainer}>
              {ingredients.map((item) => (
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
          )}
        </View>

        {/* Itens Comuns */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardTitle}>Alimentos Comuns</Text>
          <View style={styles.commonGrid}>
            {commonIngredients.slice(0, 15).map((item) => {
              const isSelected = ingredients.includes(item);
              return (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.commonTag,
                    isSelected ? styles.commonTagSelected : null,
                  ]}
                  onPress={() => {
                    if (isSelected) {
                      removeIngredient(item);
                    } else {
                      addIngredients([item]);
                    }
                  }}
                >
                  <Text style={[
                    styles.commonTagText,
                    isSelected ? styles.commonTagTextSelected : null,
                  ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Modal de Carregamento da IA com porcentagem de 0% a 100% */}
      {isAnalyzing && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <View style={styles.spinnerWrapper}>
              <ActivityIndicator size="large" color="#047857" />
              <Text style={styles.progressText}>{progress}%</Text>
            </View>
            <Text style={styles.loadingTitle}>Processando Geladeira</Text>
            <Text style={styles.loadingSubtitle}>
              A Inteligência Artificial está localizando os alimentos na imagem...
            </Text>
            
            {/* Barra de Progresso */}
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#f5f5f4",
  },
  scrollContainer: {
    paddingVertical: 16,
    gap: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f4",
  },
  cameraBox: {
    marginHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#1c1917",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cameraWrapper: {
    aspectRatio: 4 / 5,
    backgroundColor: "#000",
    position: "relative",
  },
  cameraFrame: {
    position: "absolute",
    top: 20,
    bottom: 20,
    left: 20,
    right: 20,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.4)",
    borderRadius: 8,
  },
  mockCameraPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#292524",
  },
  mockCameraText: {
    color: "#a8a29e",
    fontSize: 13,
  },
  previewContainer: {
    aspectRatio: 4 / 5,
    backgroundColor: "#000",
    position: "relative",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  mockImagePlaceholder: {
    flex: 1,
    backgroundColor: "#e6f4ea",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  mockImageText: {
    fontSize: 14,
    color: "#0f5132",
    fontWeight: "bold",
  },
  retakeButton: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  retakeButtonText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1c1917",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1c1917",
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#292524",
    justifyContent: "center",
    alignItems: "center",
  },
  captureBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    borderColor: "#78716c",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  captureInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff",
  },
  capturePlaceholder: {
    width: 64,
  },
  permissionContainer: {
    aspectRatio: 4 / 5,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 12,
    backgroundColor: "#292524",
  },
  permissionText: {
    color: "#d6d3d1",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },
  permissionBtn: {
    backgroundColor: "#10b981",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  permissionBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  errorAlert: {
    marginHorizontal: 16,
    padding: 12,
    backgroundColor: "#fef2f2",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fca5a5",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  errorText: {
    color: "#7f1d1d",
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
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
  searchBtn: {
    backgroundColor: "#1c1917",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  searchBtnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
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
  commonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  commonTag: {
    backgroundColor: "#f5f5f4",
    borderWidth: 1,
    borderColor: "#e7e5e4",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  commonTagSelected: {
    backgroundColor: "#d1fae5",
    borderColor: "#a7f3d0",
  },
  commonTagText: {
    fontSize: 13,
    color: "#44403c",
    fontWeight: "600",
  },
  commonTagTextSelected: {
    color: "#065f46",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  loadingBox: {
    width: 280,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  spinnerWrapper: {
    position: "relative",
    width: 64,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
  },
  progressText: {
    position: "absolute",
    fontSize: 11,
    fontWeight: "bold",
    color: "#047857",
  },
  loadingTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1c1917",
    marginTop: 16,
  },
  loadingSubtitle: {
    fontSize: 12,
    color: "#78716c",
    textAlign: "center",
    lineHeight: 16,
    marginTop: 8,
  },
  progressBarBg: {
    width: "100%",
    height: 6,
    backgroundColor: "#e7e5e4",
    borderRadius: 3,
    overflow: "hidden",
    marginTop: 16,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#059669",
    borderRadius: 3,
  },
});
