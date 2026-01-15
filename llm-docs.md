Here's how to replicate this OCR feature with your own Supabase account:

## 1. Edge Function Setup

Create `supabase/functions/ocr-arabic/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image } = await req.json();

    if (!image) {
      return new Response(
        JSON.stringify({ error: "No image provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use your preferred AI provider (OpenAI, Google, etc.)
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{
          role: "user",
          content: [
            { type: "text", text: "Extract all Arabic text from this image exactly as written. Return ONLY the Arabic text, nothing else." },
            { type: "image_url", image_url: { url: image.startsWith("data:") ? image : `data:image/jpeg;base64,${image}` } }
          ]
        }]
      }),
    });

    const data = await response.json();
    const extractedText = data.choices?.[0]?.message?.content?.trim() || "";

    return new Response(
      JSON.stringify({ text: extractedText }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
```

## 2. Supabase Config

Create `supabase/config.toml` in your project:
```toml
[functions.ocr-arabic]
verify_jwt = false
```

## 3. Required Secrets

In your Supabase Dashboard → Edge Functions → Secrets, add:
- `OPENAI_API_KEY` (or whichever AI provider you choose)

## 4. Environment Variables

Create `.env` in your project:
```
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
```

## 5. Deploy Edge Function

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_ID
supabase functions deploy ocr-arabic
```

## 6. Frontend Client

The `ImageScanner.tsx` component calls the function like this:
```typescript
const { data, error } = await supabase.functions.invoke('ocr-arabic', {
  body: { image: base64String }
});
```

---

**Key difference**: You'll need your own AI API key (OpenAI, Google AI, etc.) instead of the auto-provisioned `LOVABLE_API_KEY`.

Use Google Gemini Instead
Setup Supabase Client