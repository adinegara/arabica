import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    const { latin, arabic, submitted_by } = await req.json();
    if (!latin || !arabic) {
      return new Response(
        JSON.stringify({ error: "latin and arabic fields are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from("pegon_baku")
      .insert({
        latin: latin.toLowerCase().trim(),
        arabic: arabic.trim(),
        status: "pending",
        submitted_by: submitted_by || "",
      })
      .select()
      .single();
    if (error) {
      console.error("Insert error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to submit" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    // Send email notification
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL");
    if (RESEND_API_KEY && ADMIN_EMAIL) {
      const approveUrl = `${supabaseUrl}/functions/v1/approve-pegon-baku?id=${data.id}&action=approve`;
      const rejectUrl = `${supabaseUrl}/functions/v1/approve-pegon-baku?id=${data.id}&action=reject`;
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Arabica Pegon <onboarding@resend.dev>",
          to: [ADMIN_EMAIL],
          subject: `Pegon Baku: "${latin}" → ${arabic}`,
          html: `
            <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
              <h2>New Pegon Baku Submission</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Latin</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${latin}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Arabic</td>
                  <td style="padding: 8px; border: 1px solid #ddd; font-size: 1.2em;" dir="rtl">${arabic}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Submitted by</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${submitted_by || ""}</td>
                </tr>
              </table>
              <div style="margin-top: 20px; text-align: center;">
                <a href="${approveUrl}" style="background: #22c55e; color: white; padding: 10px 24px; text-decoration: none; border-radius: 6px; margin-right: 10px;">Approve</a>
                <a href="${rejectUrl}" style="background: #ef4444; color: white; padding: 10px 24px; text-decoration: none; border-radius: 6px;">Reject</a>
              </div>
            </div>
          `,
        }),
      });
    }
    return new Response(
      JSON.stringify({ success: true, id: data.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Submit error:", error);
    return new Response(
      JSON.stringify({ error: "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
