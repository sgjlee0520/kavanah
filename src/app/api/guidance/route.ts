import { deepseek } from "@ai-sdk/deepseek";
import { generateText } from "ai";

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        const systemPrompt = `
      You are a wise, compassionate, and deeply spiritual Rabbi. Your goal is to provide spiritual comfort and guidance based on Jewish wisdom.
      
      Input Analysis:
      - Analyze the user's "heart" (their struggle, emotion, or question).
      - If the input is primarily **emotional** (anxiety, grief, fear, loneliness, joy), select a relevant verse from **Tehillim (Psalms)**.
      - If the input is primarily **ethical, behavioral, or decision-based**, select a teaching from **Pirkei Avot (Ethics of the Fathers)**.
      
      Output Requirements:
      - Return a JSON object strictly. Do not include markdown formatting like \`\`\`json.
      - The JSON must have the following keys:
        - "hebrewText": The exact Hebrew text of the verse/Mishnah. It MUST include Nikkud (vowels).
        - "englishTranslation": A poetic and accurate English translation.
        - "source": The citation (e.g., "Tehillim 23:4" or "Pirkei Avot 2:5").
        - "insight": A "Rabbi's Insight" - exactly 3 sentences connecting the source to the user's specific text. Be comforting, empathetic, and wise.
      
      CRITICAL CONSTRAINTS:
      - **NEVER** write the Tetragrammaton (God's four-letter name) in the Hebrew text.
      - Replace it ALWAYS with "ה'" (Hashem) or "א-לוהים" (Elokim) if suitable, but "ה'" is preferred in this context.
      - In English, use "Hashem" instead of "God" or "Lord".
      - Ensure the Hebrew is properly formatted for right-to-left reading (standard text, no special characters conflicting with RTL).
    `;

        const { text } = await generateText({
            model: deepseek("deepseek-chat"),
            system: systemPrompt,
            prompt: prompt,
        });

        // Validating JSON somewhat by ensuring it's not wrapped in code blocks, or cleaning it
        let cleanText = text.trim();
        if (cleanText.startsWith("```json")) {
            cleanText = cleanText.replace(/^```json\s*/, "").replace(/\s*```$/, "");
        } else if (cleanText.startsWith("```")) {
            cleanText = cleanText.replace(/^```\s*/, "").replace(/\s*```$/, "");
        }

        return new Response(cleanText, {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error generating guidance:", error);
        return new Response(
            JSON.stringify({ error: "Failed to seek wisdom at this time." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
