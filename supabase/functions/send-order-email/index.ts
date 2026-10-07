import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Initialize Resend API Key from Supabase Environment Variables
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")

serve(async (req) => {
  try {
    const payload = await req.json()
    console.log("Received webhook payload:", payload)

    // Ensure it's an INSERT operation on client_requests
    if (payload.type === 'INSERT' && payload.table === 'client_requests') {
      const record = payload.record;

      if (!record.customer_email) {
         throw new Error("No customer email provided");
      }

      const customerName = record.payload?.customer_name || 'Customer';
      const itemName = record.payload?.item || 'Your Order';
      const itemPrice = record.payload?.price || '0.00';

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "onboarding@resend.dev", // Replace with your verified Resend domain if you have one
          to: [record.customer_email],
          subject: `Order Confirmation: ${itemName}`,
          html: `
            <div style="font-family: sans-serif; max-w: 500px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="color: #06b6d4;">Order Confirmed!</h2>
              <p>Hi ${customerName},</p>
              <p>Thank you for your order. We have successfully received your request for:</p>
              <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <strong>${itemName}</strong> - $${itemPrice}
              </div>
              <p>We are processing your order and will get back to you shortly.</p>
              <p>Best regards,<br/><strong>3D UNIVERSE Team</strong></p>
            </div>
          `,
        }),
      });

      const data = await res.json();
      console.log("Resend API response:", data);
      
      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      })
    }

    return new Response(JSON.stringify({ message: "Ignored: Not an insert event" }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    })

  } catch (error) {
    console.error("Error sending email:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    })
  }
})
