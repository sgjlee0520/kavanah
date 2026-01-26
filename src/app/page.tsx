"use client";

import { useState, useMemo, useEffect } from "react";

export default function Home() {
  const [error, setError] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isLoadingLocal, setIsLoadingLocal] = useState(false);
  const [completion, setCompletion] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newInput = e.target.value;
    setInput(newInput);
  };

  const [input, setInput] = useState("");

  // Log completion changes for debugging
  useEffect(() => {
    if (completion) {
      console.log("Completion updated:", completion);
    }
  }, [completion]);

  // Wrap handleSubmit to track submission state and send proper payload
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted with input:", input);
    
    if (!input.trim()) {
      setError("Please enter a worry or question.");
      return;
    }

    setHasSubmitted(true);
    setError(null);
    setIsLoadingLocal(true);
    setCompletion(""); // Clear previous completion

    try {
      // Call the API directly with proper payload
      const response = await fetch("/api/guidance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          fullText += chunk;
          setCompletion(fullText);
        }
        
        console.log("Full response received:", fullText);
      }
    } catch (error) {
      console.error("Stream error:", error);
      setError(error instanceof Error ? error.message : "Failed to get response");
      setHasSubmitted(false);
    } finally {
      setIsLoadingLocal(false);
    }
  };

  // Parse valid JSON from the completion string if it exists
  // Use useMemo to avoid re-parsing on every render
  const responseData = useMemo(() => {
    if (!completion) return null;

    try {
      // First, try direct parse
      return JSON.parse(completion);
    } catch (e) {
      console.error("Direct parse failed, attempting reconstruction:", e);

      // If the completion is missing the opening brace (due to pre-fill handling)
      let textToParse = completion.trim();
      if (textToParse && !textToParse.startsWith("{")) {
        textToParse = "{" + textToParse;
      }
      if (textToParse && !textToParse.endsWith("}")) {
        textToParse = textToParse + "}";
      }

      // Try to extract JSON object
      const jsonObjectMatch = textToParse.match(/\{[\s\S]*\}/);
      if (jsonObjectMatch) {
        try {
          return JSON.parse(jsonObjectMatch[0]);
        } catch (e2) {
          console.error("JSON object extraction failed:", e2);
        }
      }
      return null;
    }
  }, [completion]);

  // Track parse failure AFTER streaming is complete
  const showParseError = !isLoadingLocal && hasSubmitted && completion && !responseData;

  // Debug: Log when parse error occurs
  useEffect(() => {
    if (showParseError) {
      console.error("Parse error - completion received but couldn't parse:", completion);
    }
  }, [showParseError, completion]);

  // Reset function for clean state
  const handleReset = () => {
    setHasSubmitted(false);
    setError(null);
    setCompletion("");
    setInput("");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-royal-blue-900 text-white relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-royal-blue-600 rounded-full blur-[100px] opacity-20"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-72 h-72 bg-silver-400 rounded-full blur-[80px] opacity-10"></div>
      </div>

      <div className="max-w-2xl w-full z-10 flex flex-col items-center space-y-12">
        {/* Header */}
        <header className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-serif tracking-wide text-silver-100 drop-shadow-lg">
            What is on your heart?
          </h1>
          <p className="text-royal-blue-200 text-lg font-light tracking-wider">
            Share your struggle, receive ancient wisdom.
          </p>
        </header>

        {/* Input Form - Show unless there's a successful response */}
        {!responseData && (
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg transition-all transform duration-700 ease-in-out"
          >
            <div className="relative group">
              <textarea
                name="prompt"
                value={input}
                onChange={handleInputChange}
                placeholder="Ex: I feel anxious about my future..."
                disabled={isLoadingLocal}
                className="w-full min-h-20 max-h-48 bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-silver-400/50 focus:bg-white/10 transition-all shadow-2xl backdrop-blur-sm resize-none overflow-y-auto disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoadingLocal}
                className="absolute right-2 top-2 px-6 bg-silver-200 hover:bg-white text-royal-blue-900 font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                Seek
              </button>
            </div>
            {error && <p className="text-red-400 mt-2 text-center text-sm">{error}</p>}
          </form>
        )}

        {/* Parse Error State - Show when streaming complete but JSON invalid */}
        {showParseError && (
          <div className="w-full max-w-lg bg-red-500/10 border border-red-400/30 rounded-xl p-6 text-center space-y-4">
            <p className="text-red-300 text-sm">
              We received wisdom, but couldn't interpret it. Please check the browser console for details.
            </p>
            <p className="text-red-200 text-xs font-mono break-words max-h-32 overflow-y-auto bg-red-950/30 p-2 rounded">
              {completion?.substring(0, 200)}...
            </p>
            <button
              onClick={handleReset}
              className="text-white/60 hover:text-white transition-colors text-sm uppercase tracking-widest"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoadingLocal && (
          <div className="flex flex-col items-center space-y-4 animate-pulse-gentle">
            <div className="w-16 h-16 border-t-2 border-r-2 border-silver-300 rounded-full animate-spin duration-[3000ms]"></div>
            <p className="text-silver-200 font-serif text-lg tracking-widest uppercase text-xs">
              Seeking Wisdom...
            </p>
          </div>
        )}

        {/* Response Card */}
        {responseData && (
          <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl backdrop-blur-md space-y-8 animate-in fade-in duration-1000 slide-in-from-bottom-10">
            {/* Hebrew Text */}
            <div className="text-center space-y-4">
              <p dir="rtl" className="text-3xl md:text-4xl font-frank-ruhl text-silver-100 leading-relaxed drop-shadow-md">
                {responseData.hebrew}
              </p>
            </div>

            {/* Divider */}
            <div className="flex justify-center">
              <div className="w-12 h-px bg-white/20"></div>
            </div>

            {/* English Translation */}
            <div className="text-center space-y-2">
              <p className="text-xl text-white/90 font-serif italic">
                "{responseData.englishTranslation}"
              </p>
              <p className="text-sm text-silver-400 tracking-widest uppercase mt-4">
                {responseData.source}
              </p>
            </div>

            {/* Rabbi's Insight */}
            <div className="bg-royal-blue-950/50 rounded-xl p-6 border border-white/5">
              <h3 className="text-silver-300 text-xs font-bold uppercase tracking-widest mb-2">
                Rabbi's Insight
              </h3>
              <p className="text-royal-blue-100 leading-relaxed">
                {responseData.insight}
              </p>
            </div>

            {/* Reset Button */}
            <div className="text-center pt-4">
              <button
                onClick={handleReset}
                className="text-white/40 hover:text-white transition-colors text-sm uppercase tracking-widest"
              >
                Ask Another Question
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
