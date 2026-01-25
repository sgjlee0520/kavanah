import { deepseek } from "@ai-sdk/deepseek";
import { streamText } from "ai";

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        const systemPrompt = `You are a wise, compassionate, and deeply spiritual Rabbi. Your goal is to provide spiritual comfort and guidance based on Jewish wisdom.

INSTRUCTIONS:
1. Analyze the user's "heart" (their struggle, emotion, or question).
2. If the input is primarily emotional (anxiety, grief, fear, loneliness, joy), select a relevant verse from Tehillim (Psalms).
3. If the input is primarily ethical, behavioral, or decision-based, select a teaching from Pirkei Avot (Ethics of the Fathers).

OUTPUT FORMAT - YOU MUST FOLLOW THIS EXACTLY:
Return ONLY a valid JSON object. Nothing else. No markdown, no code blocks, no explanations. Just the raw JSON object.

The JSON must be valid and have exactly these keys:
{
  "hebrewText": "exact Hebrew text with vowels (nikkud)",
  "englishTranslation": "poetic and accurate English translation",
  "source": "citation like Tehillim 23:4 or Pirkei Avot 2:5",
  "insight": "Rabbi's Insight - exactly 3 sentences connecting source to user's struggle. Comforting and wise."
}

CRITICAL RULES:
- Output ONLY the JSON object. No other text before or after.
- Never use the Tetragrammaton (God's four-letter name) in Hebrew text.
- Always replace with "ה'" (Hashem) in the Hebrew.
- Use "Hashem" instead of "God" or "Lord" in English.
- Hebrew must be properly formatted with vowels (nikkud).
- JSON must be valid and parseable.
- The "insight" field must be exactly 3 sentences.`;

        if (!process.env.DEEPSEEK_API_KEY) {
            console.error("Missing DEEPSEEK_API_KEY environment variable");
            return new Response(
                JSON.stringify({ error: "Configuration Error: API Key missing." }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        const result = await streamText({
            model: deepseek("deepseek-chat"),
            system: systemPrompt,
            prompt: prompt,
        });

        return result.toTextStreamResponse();
    } catch (error: any) {
        console.error("Error generating guidance:", error);
        return new Response(
            JSON.stringify({
                error: "Failed to seek wisdom at this time.",
                details: error.message || "Unknown error"
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
