import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { PaymentCard } from '@/components/PaymentCard';
import { PaymentLink } from '@/types/payment';
import { getPaymentLinkById } from '@/lib/storage';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PayPage = () => {
  const { id } = useParams<{ id: string }>();
  const [payment, setPayment] = useState<PaymentLink | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const link = getPaymentLinkById(id);
      setPayment(link);
    }
    setLoading(false);
  }, [id]);

  const handlePaymentComplete = () => {
    if (id) {
      const updatedLink = getPaymentLinkById(id);
      setPayment(updatedLink);
    }
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
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16 px-4">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 px-4">
        <div className="container max-w-4xl mx-auto">
          <PaymentCard payment={payment} onPaymentComplete={handlePaymentComplete} />
        </div>
      </main>
    </div>
  );
};

export default PayPage;
