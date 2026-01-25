module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/src/app/api/guidance/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
async function POST(req) {
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
  "insight": "Exactly 3 sentences connecting the source to the user's struggle."
}

RULES:
- Never write the Tetragrammaton; use ה' or א-לוהים.
- The response must be a single JSON object starting with { and ending with }.`;
        // ROUTING VERIFICATION PROBE
        console.log("PROBE: Hitting route.ts");
        return new Response(JSON.stringify({
            status: "Teapot"
        }), {
            status: 418
        });
    /*
        // DEBUG: Hardcoded response
        return new Response(JSON.stringify({
            hebrew: "שָׁלוֹם",
            englishTranslation: "Peace",
            source: "Gen 1:1",
            insight: "Sentence one. Sentence two. Sentence three."
        }), {
            headers: {
                "Content-Type": "application/json",
                "x-debug": "hardcoded"
            }
        });

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

        /*
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
        */ } catch (error) {
        console.error("Error generating guidance:", error);
        return new Response(JSON.stringify({
            error: "Failed to seek wisdom at this time.",
            details: error.message || "Unknown error"
        }), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__2917df0c._.js.map