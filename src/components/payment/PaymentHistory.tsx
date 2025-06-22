
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, CreditCard, RefreshCw, Settings } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import type { RentPayment } from '@/types/database';

interface PaymentHistoryProps {
  currentUserId?: string;
}

const PaymentHistory = ({ currentUserId }: PaymentHistoryProps) => {
  const [payments, setPayments] = useState<RentPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPayments = async () => {
    if (!currentUserId) return;

    try {
      const { data, error } = await supabase
        .from('rent_payments')
        .select(`
          *,
          properties!inner(title, location)
        `)
        .eq('tenant_id', currentUserId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast({
        title: "Error",
        description: "Failed to load payment history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('rent-customer-portal');

      if (error) throw error;
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Error",
        description: "Failed to open subscription management",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [currentUserId]);

  const formatCurrency = (amountInCents: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amountInCents / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'past_due':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">Loading payment history...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment History
          </CardTitle>
          <div className="flex gap-2">
            <Button
              onClick={fetchPayments}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
            <Button
              onClick={handleManageSubscription}
              variant="outline"
              size="sm"
            >
              <Settings className="h-4 w-4 mr-1" />
              Manage
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {payments.length === 0 ? (
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">No payment history found</p>
            <p className="text-sm text-gray-500">Your subscription payments will appear here</p>
          </div>
        ) : (
          payments.map((payment) => (
            <div key={payment.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{(payment as any).properties?.title}</h3>
                  <p className="text-sm text-gray-600">{(payment as any).properties?.location}</p>
                </div>
                <Badge className={getStatusColor(payment.status)}>
                  {payment.status.toUpperCase()}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Monthly Rent</p>
                  <p className="font-semibold">{formatCurrency(payment.monthly_rent)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Started</p>
                  <p className="font-semibold">{formatDate(payment.created_at)}</p>
                </div>
              </div>

              {payment.current_period_start && payment.current_period_end && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Current period: {formatDate(payment.current_period_start)} - {formatDate(payment.current_period_end)}
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentHistory;
