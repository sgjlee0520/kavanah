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

RESPOND WITH VALID JSON ONLY - NO OTHER TEXT:
You MUST respond with ONLY valid JSON. Start with { and end with }. No markdown code fences. No explanations before or after.

EXACT REQUIRED FORMAT:
{"hebrewText":"Hebrew text with vowels","englishTranslation":"English translation","source":"Citation like Tehillim 23:4","insight":"3 sentences connecting source to user's struggle."}

EXAMPLE RESPONSE:
{"hebrewText":"שִׁמְעוּ דְבַר יְהוָה","englishTranslation":"Hear the word of Hashem","source":"Tehillim 34:1","insight":"Your anxiety is valid, and Hashem invites you to bring it before Him through prayer. When we listen for His voice amidst our worry, we find peace not in the absence of struggle but in the presence of Divine care. Trust that you are heard, even in your darkest moments."}

RULES:
- RESPOND ONLY WITH JSON. No introduction, explanation, or text outside the JSON object.
- hebrewText must include nikkud (vowels)
- Never write the Tetragrammaton; use ה' (Hashem) or א-לוהים (Elokim)
- englishTranslation uses "Hashem" not "God" or "Lord"
- insight is exactly 3 sentences
- JSON must be valid and parse-able
- Start with { and end with }`;

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
