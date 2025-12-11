import { useState, useEffect } from 'react';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Wallet, ArrowRight, Loader2, Check, AlertCircle, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PaymentLink } from '@/types/payment';
import { markPaymentAsPaid } from '@/lib/storage';
import { toast } from 'sonner';

interface PaymentCardProps {
  payment: PaymentLink;
  onPaymentComplete?: () => void;
  network?: 'mainnet' | 'sepolia' | string; // optional, defaults to sepolia
}

export function PaymentCard({ payment, onPaymentComplete, network = 'sepolia' }: PaymentCardProps) {
  const { address, isConnected } = useAccount();
  const [isPaid, setIsPaid] = useState(payment.paid);

  const { data: hash, isPending, sendTransaction, error: sendError } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // Utility: Shorten address
  const shortenAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  // Utility: Generate Etherscan link
  const getEtherscanLink = (txHash: string) => `https://${network}.etherscan.io/tx/${txHash}`;

  // Effect: Payment confirmation
  useEffect(() => {
    if (isConfirmed && hash && address) {
      const updated = markPaymentAsPaid(payment.id, address, hash);
      if (updated) setIsPaid(true);

      toast.success('Payment completed successfully!');
      onPaymentComplete?.();
    }
  }, [isConfirmed, hash, address, payment.id, onPaymentComplete]);

  // Effect: Transaction error
  useEffect(() => {
    if (sendError) {
      toast.error(sendError.message || 'Transaction failed');
    }
  }, [sendError]);

  // Handle payment
  const handlePay = () => {
    if (!isConnected) {
      toast.error('Connect your wallet first');
      return;
    }

    if (!payment.recipient || !/^0x[a-fA-F0-9]{40}$/.test(payment.recipient)) {
      toast.error('Invalid recipient address');
      return;
    }

    let ethAmount: string;
    try {
      ethAmount = parseEther(payment.amount.toString()).toString();
    } catch {
      toast.error('Invalid amount');
      return;
    }

    sendTransaction({
      to: payment.recipient,
      value: parseEther(payment.amount.toString()),
    });
  };

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
            href={getEtherscanLink(payment.txHash)}
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
        <div className="p-4 rounded-xl bg-secondary/50 border border-border text-center">
          <p className="text-sm text-muted-foreground mb-1">Amount</p>
          <p className="text-4xl font-bold gradient-text">
            {payment.amount} {payment.currency}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-secondary/50 border border-border">
          <p className="text-sm text-muted-foreground mb-1">Recipient</p>
          <p className="font-mono text-sm break-all">{shortenAddress(payment.recipient)}</p>
        </div>

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
