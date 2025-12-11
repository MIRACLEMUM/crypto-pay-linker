import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { PaymentCard } from '@/components/PaymentCard';
import { Footer } from '@/components/Footer';
import { PaymentLink } from '@/types/payment';
import { supabase } from '@/lib/supabase';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PayPage = () => {
  const { id } = useParams<{ id: string }>();
  const [payment, setPayment] = useState<PaymentLink | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPayment() {
      if (!id) return;

      const { data, error } = await supabase
        .from('payment_links')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error("Error fetching payment:", error);
      }

      setPayment(data);
      setLoading(false);
    }

    fetchPayment();
  }, [id]);

  const handlePaymentComplete = async () => {
    if (!id) return;

    const { data } = await supabase
      .from('payment_links')
      .select('*')
      .eq('id', id)
      .single();

    setPayment(data);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="pt-24 pb-16 px-4 flex-1">
          <div className="container max-w-md mx-auto">
            <div className="glass-card p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mx-auto mb-6">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Payment Link Not Found</h2>
              <p className="text-muted-foreground mb-6">
                This payment link doesn't exist or has been removed.
              </p>
              <Button asChild variant="outline">
                <Link to="/">
                  <ArrowLeft className="h-4 w-4" />
                  Go Home
                </Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="pt-24 pb-16 px-4 flex-1">
        <div className="container max-w-4xl mx-auto">
          <PaymentCard payment={payment} onPaymentComplete={handlePaymentComplete} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PayPage;
