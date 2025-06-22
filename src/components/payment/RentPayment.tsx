
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Settings, AlertCircle } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import type { Property } from '@/types/database';

interface RentPaymentProps {
  property: Property;
  currentUserId?: string;
}

const RentPayment = ({ property, currentUserId }: RentPaymentProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleStartPayment = async () => {
    if (!currentUserId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-rent-checkout', {
        body: { propertyId: property.id }
      });

      if (error) throw error;

      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Error",
        description: "Failed to start payment process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('rent-customer-portal');

      if (error) throw error;

      // Open customer portal in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Error",
        description: "Failed to open subscription management. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Monthly Rent Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600">
            {formatCurrency(Number(property.rent))}
          </div>
          <div className="text-sm text-gray-600">per month</div>
        </div>

        <div className="space-y-2">
          <Button 
            onClick={handleStartPayment}
            disabled={!currentUserId || loading}
            className="w-full"
            size="lg"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            {loading ? 'Starting Payment...' : 'Start Monthly Rent Payment'}
          </Button>
          
          <Button 
            onClick={handleManageSubscription}
            disabled={loading}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <Settings className="h-4 w-4 mr-2" />
            {loading ? 'Opening...' : 'Manage Subscription'}
          </Button>
        </div>

        <div className="text-xs text-gray-500 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <AlertCircle className="h-3 w-3" />
            <span>Secure payment powered by Stripe</span>
          </div>
          <p>Your first payment starts the monthly subscription. You can cancel anytime.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RentPayment;
