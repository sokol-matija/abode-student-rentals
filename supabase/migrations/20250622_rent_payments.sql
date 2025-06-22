
-- Create rent_payments table to track subscription information
CREATE TABLE public.rent_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  monthly_rent INTEGER NOT NULL, -- Amount in cents
  status TEXT NOT NULL DEFAULT 'active', -- active, cancelled, past_due
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(property_id, tenant_id)
);

-- Enable Row Level Security
ALTER TABLE public.rent_payments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "select_own_rent_payments" ON public.rent_payments
FOR SELECT
USING (tenant_id = auth.uid());

CREATE POLICY "insert_rent_payment" ON public.rent_payments
FOR INSERT
WITH CHECK (true);

CREATE POLICY "update_rent_payment" ON public.rent_payments
FOR UPDATE
USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_rent_payments_updated_at
  BEFORE UPDATE ON public.rent_payments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
