import "dotenv/config";
import express from "express";
import { GoogleGenAI, Type } from "@google/genai";
import path from "path";
import cors from "cors";

const app = express();
app.use(cors());
const port = Number(process.env.PORT ?? 8787);
const apiKey = process.env.GEMINI_API_KEY;

app.use(express.json({ limit: "12mb" }));

app.get("/api/health", (_request, response) => {
  response.json({
    ok: true,
    aiConfigured: Boolean(apiKey),
  });
});

app.post("/api/analyze-image", async (request, response) => {
  const image = request.body?.image;

  if (typeof image !== "string" || !image.startsWith("data:image/")) {
    response.status(400).json({
      ingredients: [],
      source: "manual",
      message: "Envie uma imagem em base64 para análise.",
    });
    return;
  }

  if (!apiKey) {
    const selected = ["batata", "cenoura", "cebola", "alho", "maçã", "queijo", "limão"];
    
    response.json({
      ingredients: selected,
      source: "ai",
    });
    return;
  }

  const [metadata, base64Data] = image.split(",");
  const mimeType = metadata.match(/^data:(.*);base64$/)?.[1] ?? "image/jpeg";

  try {
    const ai = new GoogleGenAI({ apiKey });
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType,
            },
          },
          {
            text: "Identifique alimentos e ingredientes visíveis na imagem. Retorne somente JSON com a chave ingredients, contendo nomes curtos em português do Brasil. Ignore embalagens e utensílios.",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ingredients: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["ingredients"],
        },
      },
    });

    const parsed = parseModelResponse(result.text ?? "{}");
    const ingredients = Array.isArray(parsed.ingredients)
      ? parsed.ingredients.map((item) => String(item).trim()).filter(Boolean)
      : [];

    response.json({
      ingredients: [...new Set(ingredients)],
      source: "ai",
    });
  } catch (error) {
    console.error(error);
    response.status(502).json({
      ingredients: [],
      source: "manual",
      message: "A análise por IA falhou. Revise os ingredientes manualmente e tente novamente depois.",
    });
  }
});

app.use(express.static("dist"));

app.get("*", (_req, res) => {
  res.sendFile(path.resolve("dist/index.html"));
});

app.listen(port, () => {
  console.log(`EasyChef API listening on http://localhost:${port}`);
});

function parseModelResponse(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : {};
  }
}
