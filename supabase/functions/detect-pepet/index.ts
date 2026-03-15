import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    const { text } = await req.json();
    if (!text || typeof text !== "string") {
      return new Response(
        JSON.stringify({ error: "No text provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    // If no 'e' or 'E' in text, return as-is
    if (!/[eE]/.test(text)) {
      return new Response(
        JSON.stringify({ text }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ text }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const prompt = `You are an expert in Indonesian language phonology. Analyze the following Indonesian text and mark each letter "e" as either:
- ĕ (e pepet / schwa /ə/) — the default unstressed e sound, e.g. "beras", "perang", "betul", "keras"
- é (e taling / /e/) — the stressed e sound, e.g. "enak", "besi", "sore", "lele"
Rules:
- Return the EXACT same text, only replacing each "e" or "E" with ĕ/é accordingly.
- Do NOT change any other characters, spacing, or punctuation.
- If unsure, default to ĕ (pepet) as it is more common in Indonesian.
Text: ${text}
Return ONLY the marked text, nothing else.`;
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please wait and try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      // Fallback: return original text
      return new Response(
        JSON.stringify({ text }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const data = await response.json();
    const result = data.choices?.[0]?.message?.content?.trim() || text;
    return new Response(
      JSON.stringify({ text: result }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("detect-pepet error:", error);
    // Try to return original text as fallback
    try {
      const body = await req.clone().json();
      return new Response(
        JSON.stringify({ text: body.text || "" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch {
      return new Response(
        JSON.stringify({ error: "Unknown error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  }
});
