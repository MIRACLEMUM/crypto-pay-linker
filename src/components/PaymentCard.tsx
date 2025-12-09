import { useState, useEffect } from 'react';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Wallet, ArrowRight, Loader2, Check, AlertCircle, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PaymentLink } from '@/types/payment';
import { markPaymentAsPaid } from '@/lib/storage';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface PaymentCardProps {
  payment: PaymentLink;
  onPaymentComplete?: () => void;
}

export function PaymentCard({ payment, onPaymentComplete }: PaymentCardProps) {
  const { address, isConnected } = useAccount();
  const [isPaid, setIsPaid] = useState(payment.paid);

  const { data: hash, isPending, sendTransaction, error: sendError } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isConfirmed && hash && address) {
      markPaymentAsPaid(payment.id, address, hash);
      setIsPaid(true);
      toast.success('Payment completed successfully!');
      onPaymentComplete?.();
    }
  }, [isConfirmed, hash, address, payment.id, onPaymentComplete]);

  useEffect(() => {
    if (sendError) {
      toast.error(sendError.message || 'Transaction failed');
    }
  }, [sendError]);

  const handlePay = () => {
    if (!isConnected) return;
    
    // For USD amounts, we'd need to convert to ETH using an oracle
    // For now, we'll just use the amount as ETH
    const ethAmount = payment.currency === 'ETH' 
      ? payment.amount 
      : payment.amount; // In production, convert USD to ETH

    sendTransaction({
      to: payment.recipient as `0x${string}`,
      value: parseEther(ethAmount),
    });
  };

  const shortenAddress = (addr: string) => 
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  if (isPaid) {
    return (
      <div className="glass-card p-8 max-w-md mx-auto text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mx-auto mb-6">
          <Check className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Payment Complete!</h2>
        <p className="text-muted-foreground mb-6">
          This payment has been successfully processed.
        </p>
        {payment.txHash && (
          <a
            href={`https://etherscan.io/tx/${payment.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
          >
            View on Etherscan →
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="glass-card p-8 max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary mx-auto mb-4 shadow-glow animate-glow">
          <Wallet className="h-8 w-8 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold mb-1">Payment Request</h2>
        <p className="text-muted-foreground">
          Send {payment.currency} to complete this payment
        </p>
      </div>

      {/* Payment Details */}
      <div className="space-y-4 mb-8">
        {/* Amount */}
        <div className="p-4 rounded-xl bg-secondary/50 border border-border text-center">
          <p className="text-sm text-muted-foreground mb-1">Amount</p>
          <p className="text-4xl font-bold gradient-text">
            {payment.amount} {payment.currency}
          </p>
        </div>

        {/* Recipient */}
        <div className="p-4 rounded-xl bg-secondary/50 border border-border">
          <p className="text-sm text-muted-foreground mb-1">Recipient</p>
          <p className="font-mono text-sm break-all">{payment.recipient}</p>
        </div>

        {/* Message */}
        {payment.message && (
          <div className="p-4 rounded-xl bg-secondary/50 border border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <MessageSquare className="h-3 w-3" />
              Message
            </div>
            <p className="text-sm">{payment.message}</p>
          </div>
        )}
      </div>

      {/* Action */}
      {isConnected ? (
        <Button
          onClick={handlePay}
          size="lg"
          variant="gradient"
          className="w-full"
          disabled={isPending || isConfirming}
        >
          {isPending || isConfirming ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              {isPending ? 'Confirm in wallet...' : 'Processing...'}
            </>
          ) : (
            <>
              Pay {payment.amount} {payment.currency}
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </Button>
      ) : (
        <div className="space-y-4">
          <ConnectButton.Custom>
            {({ openConnectModal }) => (
              <Button
                onClick={openConnectModal}
                size="lg"
                variant="gradient"
                className="w-full"
              >
                Connect Wallet to Pay
                <ArrowRight className="h-5 w-5" />
              </Button>
            )}
          </ConnectButton.Custom>
        </div>
      )}

      {/* Warning */}
      <div className="mt-6 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-2">
        <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          Always verify the recipient address before sending. Transactions on the blockchain cannot be reversed.
        </p>
      </div>
    </div>
  );
}
