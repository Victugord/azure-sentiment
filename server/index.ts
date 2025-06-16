import { Hono } from "hono";
import {
  TextAnalyticsClient,
  AzureKeyCredential,
} from "@azure/ai-text-analytics";
import * as dotenv from "dotenv";

dotenv.config(); // Carregar variáveis de ambiente .env

export const app = new Hono().basePath("/api");

// Configurar CORS
app.use("*");

interface SentimentRequest {
  text: string;
  language?: string;
}

interface SentimentResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}

// Endpoint para análise de sentimentos
app.post("/sentiment-analysis", async (c) => {
  try {
    // Obter credenciais do Azure das variáveis de ambiente
    const key = process.env.AZURE_LANGUAGE_KEY;
    const endpoint = process.env.AZURE_LANGUAGE_ENDPOINT;

    if (!key || !endpoint) {
      return c.json<SentimentResponse>(
        {
          success: false,
          error:
            "Configuração em falta. Verifique as variáveis de ambiente AZURE_LANGUAGE_KEY e AZURE_LANGUAGE_ENDPOINT.",
        },
        500
      );
    }

    const body = (await c.req.json()) as SentimentRequest;
    const { text, language = "pt" } = body;

    if (!text || text.trim().length === 0) {
      return c.json<SentimentResponse>(
        {
          success: false,
          error: "Texto é obrigatório para análise",
        },
        400
      );
    }

    // Configurar cliente do Azure Text Analytics
    const client = new TextAnalyticsClient(
      endpoint,
      new AzureKeyCredential(key)
    );

    const documents = [
      {
        text: text,
        id: "0",
        language: language,
      },
    ];

    // Executar análise de sentimentos com mineração de opiniões
    const results = await client.analyzeSentiment(documents, {
      includeOpinionMining: true,
    });

    const result = results[0];

    if (result.error) {
      return c.json<SentimentResponse>(
        {
          success: false,
          error: `Erro na análise: ${result.error}`,
        },
        500
      );
    }

    // Formatar os resultados para o frontend
    const formattedResult = {
      documentText: text,
      overallSentiment: result.sentiment,
      confidenceScores: result.confidenceScores,
      sentences: result.sentences.map((sentence) => ({
        text: sentence.text,
        sentiment: sentence.sentiment,
        confidenceScores: sentence.confidenceScores,
        opinions:
          sentence.opinions?.map((opinion) => ({
            target: {
              text: opinion.target.text,
              sentiment: opinion.target.sentiment,
              confidenceScores: opinion.target.confidenceScores,
            },
            assessments: opinion.assessments.map((assessment) => ({
              text: assessment.text,
              sentiment: assessment.sentiment,
            })),
          })) || [],
      })),
    };

    return c.json<SentimentResponse>({
      success: true,
      data: formattedResult,
    });
  } catch (error) {
    console.error("Erro no processamento:", error);

    return c.json<SentimentResponse>(
      {
        success: false,
        error:
          "Erro interno do servidor. Verifique a configuração do Azure AI.",
      },
      500
    );
  }
});

// Endpoint de saúde
app.get("/health", (c) => {
  return c.json({ status: "OK", timestamp: new Date().toISOString() });
});
