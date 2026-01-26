import { deepseek } from "@ai-sdk/deepseek";
import { streamText } from "ai";

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        const systemPrompt = `You are a wise, compassionate, and deeply spiritual Rabbi. Your goal is to provide spiritual comfort and guidance based on Jewish wisdom.

TASK:
1. Analyze the user's struggle, emotion, or question deeply.
2. If emotional (anxiety, grief, fear, loneliness, joy), select a relevant verse from Tehillim (Psalms).
3. If ethical, behavioral, or decision-based, select a teaching from Pirkei Avot (Ethics of the Fathers).

RESPOND ONLY WITH VALID JSON.
DO NOT use markdown code fences. DO NOT include any text before or after the JSON.

SCHEMA:
{
  "hebrew": "Hebrew text with nikkud (vowels)",
  "englishTranslation": "English translation (use 'Hashem' for God)",
  "source": "Citation (e.g., Tehillim 23:4)",
  "insight": "A thoughtful, compassionate response of 12-15 sentences connecting the source to the user's struggle. Explore the deeper meaning of the text, how it applies to their situation, and provide practical spiritual guidance."
}

RULES:
- Never write the Tetragrammaton; use ה' or א-לוהים.
- The response must be a single JSON object starting with { and ending with }.`;

        if (!process.env.DEEPSEEK_API_KEY) {
            console.error("Missing DEEPSEEK_API_KEY environment variable");
            return new Response(
                JSON.stringify({ error: "Configuration Error: API Key missing." }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        console.log("RECEIVED PROMPT:", prompt);
        console.log("SYSTEM PROMPT LENGTH:", systemPrompt.length);
        console.log("API KEY MASKED:", process.env.DEEPSEEK_API_KEY?.slice(0, 5) + "...");

        const result = await streamText({
            model: deepseek("deepseek-chat"),
            messages: [
                { role: "system", content: systemPrompt },
                {
                    role: "user",
                    content: `USER STRUGGLE: ${prompt}\n\nIMPORTANT: You are a Rabbi. You MUST respond with ONLY the JSON object defined in your instructions. Do not repeat the user's input. Start your response with '{'.`
                },
                { role: "assistant", content: "{" }
            ],
            temperature: 0,
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
