import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
serve(async (req) => {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const action = url.searchParams.get("action");
  if (!id || !["approve", "reject"].includes(action || "")) {
    return new Response("<h1>Invalid request</h1>", {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    if (action === "approve") {
      const { error } = await supabase
        .from("pegon_baku")
        .update({ status: "approved" })
        .eq("id", id);
      if (error) throw error;
      return new Response(
        `<div style="font-family: sans-serif; text-align: center; padding: 40px;">
          <h1 style="color: #22c55e;">Approved!</h1>
          <p>The word has been approved and is now active.</p>
        </div>`,
        { headers: { "Content-Type": "text/html" } }
      );
    } else {
      const { error } = await supabase
        .from("pegon_baku")
        .delete()
        .eq("id", id);
      if (error) throw error;
      return new Response(
        `<div style="font-family: sans-serif; text-align: center; padding: 40px;">
          <h1 style="color: #ef4444;">Rejected</h1>
          <p>The submission has been removed.</p>
        </div>`,
        { headers: { "Content-Type": "text/html" } }
      );
    }
  } catch (error) {
    console.error("Approve error:", error);
    return new Response(
      `<div style="font-family: sans-serif; text-align: center; padding: 40px;">
        <h1 style="color: #ef4444;">Error</h1>
        <p>Something went wrong. Please try again.</p>
      </div>`,
      { status: 500, headers: { "Content-Type": "text/html" } }
    );
  }
});
