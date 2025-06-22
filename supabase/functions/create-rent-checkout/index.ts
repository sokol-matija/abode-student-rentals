
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log("🚀 create-rent-checkout function started");
  
  if (req.method === "OPTIONS") {
    console.log("📋 Handling CORS preflight request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check for required environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    
    console.log("🔧 Environment check:", {
      supabaseUrl: supabaseUrl ? "✅ Set" : "❌ Missing",
      supabaseAnonKey: supabaseAnonKey ? "✅ Set" : "❌ Missing", 
      stripeSecretKey: stripeSecretKey ? "✅ Set" : "❌ Missing"
    });

    if (!supabaseUrl || !supabaseAnonKey || !stripeSecretKey) {
      throw new Error("Missing required environment variables");
    }

    const { propertyId } = await req.json();
    console.log("📦 Request data:", { propertyId });
    
    if (!propertyId) {
      throw new Error("Property ID is required");
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

    const authHeader = req.headers.get("Authorization");
    console.log("🔐 Auth header:", authHeader ? "✅ Present" : "❌ Missing");
    
    if (!authHeader) {
      throw new Error("Authorization header is required");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    console.log("👤 User authentication:", {
      success: !userError,
      userId: userData?.user?.id,
      email: userData?.user?.email,
      error: userError?.message
    });
    
    if (userError || !userData.user?.email) {
      throw new Error(`User authentication failed: ${userError?.message || "No user email"}`);
    }

    const user = userData.user;

    // Check for existing rent payment record
    console.log("🔍 Checking for existing rent payment...");
    const { data: existingPayment, error: paymentCheckError } = await supabaseClient
      .from('rent_payments')
      .select('*')
      .eq('property_id', propertyId)
      .eq('tenant_id', user.id)
      .eq('status', 'active')
      .maybeSingle();

    if (paymentCheckError) {
      console.log("⚠️ Error checking existing payment:", paymentCheckError.message);
    }

    if (existingPayment) {
      console.log("🚫 Existing active subscription found:", existingPayment.id);
      throw new Error("You already have an active subscription for this property. Use 'Manage Subscription' to modify your existing subscription.");
    }

    // Get property details
    console.log("🏠 Fetching property...");
    const { data: property, error: propertyError } = await supabaseClient
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .single();
    
    console.log("🏠 Property fetch result:", {
      success: !propertyError,
      propertyTitle: property?.title,
      propertyRent: property?.rent,
      error: propertyError?.message
    });
    
    if (propertyError || !property) {
      throw new Error(`Property not found: ${propertyError?.message || "Property does not exist"}`);
    }

    console.log("💳 Initializing Stripe...");
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    // Check if customer exists
    console.log("👥 Checking for existing Stripe customer...");
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log("👥 Found existing customer:", customerId);

      // Check for existing active subscriptions in Stripe
      console.log("🔍 Checking for active Stripe subscriptions...");
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: 'active',
        limit: 10
      });

      // Check if any subscription matches this property's rent amount
      const propertyRentInCents = Math.round(property.rent * 100);
      const existingSubscription = subscriptions.data.find(sub => {
        const subAmount = sub.items.data[0]?.price.unit_amount;
        return subAmount === propertyRentInCents;
      });

      if (existingSubscription) {
        console.log("🚫 Found existing Stripe subscription with same amount:", existingSubscription.id);
        throw new Error("You already have an active subscription with the same rent amount. Please cancel your existing subscription before creating a new one.");
      }
    } else {
      console.log("👥 No existing customer found");
    }

    // Create checkout session for monthly rent subscription
    console.log("🛒 Creating checkout session...");
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: { 
              name: `Monthly Rent - ${property.title}`,
              description: `Monthly rent payment for ${property.location}`
            },
            unit_amount: Math.round(property.rent * 100), // Convert to pence
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/rent-payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/`,
      metadata: {
        property_id: propertyId,
        tenant_id: user.id,
      },
    });

    console.log("✅ Checkout session created successfully:", {
      sessionId: session.id,
      url: session.url ? "✅ Present" : "❌ Missing"
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Error in create-rent-checkout:", errorMessage);
    console.error("❌ Full error:", error);
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: "Check function logs for more information"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
