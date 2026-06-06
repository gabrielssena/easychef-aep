import { Platform } from "react-native";

export interface AnalyzeImageResponse {
  ingredients: string[];
  source: string;
  message?: string;
}

export const BACKEND_IP = "192.168.200.106";
export const BACKEND_URL = Platform.OS === "web" ? "http://localhost:8787" : `http://${BACKEND_IP}:8787`;

export async function analyzeImage(imageSrc: string): Promise<AnalyzeImageResponse> {
  const response = await fetch(`${BACKEND_URL}/api/analyze-image`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image: imageSrc }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message ?? "Não foi possível conectar ao servidor de análise.");
  }

  return payload;
}
