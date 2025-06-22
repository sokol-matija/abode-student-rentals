
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log("🎯 Stripe webhook received");
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      console.log("❌ No Stripe signature found");
      throw new Error("No Stripe signature found");
    }

    const body = await req.text();
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!stripeSecretKey || !webhookSecret) {
      throw new Error("Missing Stripe configuration");
    }

    const stripe = new Stripe(stripeSecretKey, { apiVersion: "2023-10-16" });
    
    // Verify webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log("✅ Webhook signature verified:", event.type);
    } catch (err) {
      console.log("❌ Webhook signature verification failed:", err.message);
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    // Initialize Supabase client with service role key
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("📝 Processing subscription:", subscription.id);
        
        // Get property and tenant info from metadata
        const propertyId = subscription.metadata.property_id;
        const tenantId = subscription.metadata.tenant_id;
        
        if (!propertyId || !tenantId) {
          console.log("⚠️ Missing metadata in subscription");
          break;
        }

        const monthlyRentCents = subscription.items.data[0].price.unit_amount || 0;
        
        // Upsert rent payment record
        const { error: upsertError } = await supabaseClient
          .from('rent_payments')
          .upsert({
            property_id: propertyId,
            tenant_id: tenantId,
            stripe_customer_id: subscription.customer as string,
            stripe_subscription_id: subscription.id,
            monthly_rent: monthlyRentCents,
            status: subscription.status === 'active' ? 'active' : subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          }, { 
            onConflict: 'property_id,tenant_id',
            ignoreDuplicates: false 
          });

        if (upsertError) {
          console.log("❌ Error upserting rent payment:", upsertError);
        } else {
          console.log("✅ Rent payment record updated");
          
          // Update property status to rented if subscription is active
          if (subscription.status === 'active') {
            const { error: propertyError } = await supabaseClient
              .from('properties')
              .update({ status: 'rented' })
              .eq('id', propertyId);
              
            if (propertyError) {
              console.log("⚠️ Error updating property status:", propertyError);
            } else {
              console.log("✅ Property status updated to rented");
            }
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("🗑️ Processing subscription deletion:", subscription.id);
        
        // Update rent payment status to cancelled
        const { error: updateError } = await supabaseClient
          .from('rent_payments')
          .update({ 
            status: 'cancelled',
            updated_at: new Date().toISOString() 
          })
          .eq('stripe_subscription_id', subscription.id);

        if (updateError) {
          console.log("❌ Error updating cancelled subscription:", updateError);
        } else {
          console.log("✅ Subscription marked as cancelled");
          
          // Update property status back to available
          const propertyId = subscription.metadata.property_id;
          if (propertyId) {
            const { error: propertyError } = await supabaseClient
              .from('properties')
              .update({ status: 'available' })
              .eq('id', propertyId);
              
            if (propertyError) {
              console.log("⚠️ Error updating property to available:", propertyError);
            } else {
              console.log("✅ Property status updated to available");
            }
          }
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log("💰 Payment succeeded for subscription:", invoice.subscription);
        
        // Update last successful payment date
        if (invoice.subscription) {
          const { error } = await supabaseClient
            .from('rent_payments')
            .update({ 
              status: 'active',
              updated_at: new Date().toISOString() 
            })
            .eq('stripe_subscription_id', invoice.subscription);
            
          if (error) {
            console.log("⚠️ Error updating payment success:", error);
          } else {
            console.log("✅ Payment success recorded");
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log("❌ Payment failed for subscription:", invoice.subscription);
        
        // Update status to past_due
        if (invoice.subscription) {
          const { error } = await supabaseClient
            .from('rent_payments')
            .update({ 
              status: 'past_due',
              updated_at: new Date().toISOString() 
            })
            .eq('stripe_subscription_id', invoice.subscription);
            
          if (error) {
            console.log("⚠️ Error updating payment failure:", error);
          } else {
            console.log("✅ Payment failure recorded");
          }
        }
        break;
      }

      default:
        console.log(`📋 Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Webhook error:", errorMessage);
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
