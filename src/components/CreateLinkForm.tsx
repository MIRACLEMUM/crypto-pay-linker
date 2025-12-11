import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useNavigate } from 'react-router-dom';
import { Wallet, DollarSign, MessageSquare, Loader2, Copy, Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createPaymentLink, generatePaymentUrl } from '@/lib/storage';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function CreateLinkForm() {
  const { address, isConnected } = useAccount();
  const navigate = useNavigate();
  
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<'ETH' | 'USD'>('ETH');
  const [message, setMessage] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createdLink, setCreatedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const isValidAddress = (addr: string) => /^0x[a-fA-F0-9]{40}$/.test(addr);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidAddress(recipient)) {
      toast.error('Please enter a valid Ethereum address');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsCreating(true);
    
    try {
      // ✅ Await here so TypeScript knows link has type PaymentLink
      const link = await createPaymentLink(
        { recipient, amount, currency, message: message || undefined },
        address
      );
      
      const url = generatePaymentUrl(link.id);
      setCreatedLink(url);
      toast.success('Payment link created successfully!');
    } catch (error) {
      toast.error('Failed to create payment link');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopy = async () => {
    if (!createdLink) return;
    
    await navigator.clipboard.writeText(createdLink);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateAnother = () => {
    setRecipient('');
    setAmount('');
    setMessage('');
    setCreatedLink(null);
  };

  if (createdLink) {
    return (
      <div className="glass-card p-8 max-w-lg mx-auto animate-scale-in">
        <div className="text-center mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto mb-4">
            <Check className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Payment Link Created!</h2>
          <p className="text-muted-foreground">Share this link to receive payment</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 p-4 rounded-lg bg-secondary border border-border">
            <code className="flex-1 text-sm text-foreground break-all font-mono">
              {createdLink}
            </code>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleCopy}
              className="flex-1"
              variant={copied ? 'secondary' : 'gradient'}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Link
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open(createdLink, '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="ghost"
            className="w-full"
            onClick={handleCreateAnother}
          >
            Create Another Link
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card p-8 max-w-lg mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Create Payment Link</h2>
        <p className="text-muted-foreground">
          Generate a shareable link to receive crypto payments
        </p>
      </div>

      <div className="space-y-6">
        {/* Recipient Address */}
        <div className="space-y-2">
          <Label htmlFor="recipient" className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-primary" />
            Recipient Address
          </Label>
          <Input
            id="recipient"
            placeholder="0x..."
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className={cn(
              "font-mono text-sm",
              recipient && !isValidAddress(recipient) && "border-destructive focus-visible:ring-destructive"
            )}
          />
          {recipient && !isValidAddress(recipient) && (
            <p className="text-xs text-destructive">Invalid Ethereum address</p>
          )}
        </div>

        {/* Amount */}
        <div className="space-y-2">
          <Label htmlFor="amount" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-primary" />
            Amount
          </Label>
          <div className="flex gap-2">
            <Input
              id="amount"
              type="number"
              step="any"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1"
            />
            <div className="flex rounded-lg border border-border overflow-hidden">
              <button
                type="button"
                onClick={() => setCurrency('ETH')}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors",
                  currency === 'ETH'
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                )}
              >
                ETH
              </button>
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors",
                  currency === 'USD'
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                )}
              >
                USD
              </button>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <Label htmlFor="message" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-primary" />
            Message (Optional)
          </Label>
          <Textarea
            id="message"
            placeholder="Add a note for the payer..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          variant="gradient"
          className="w-full"
          disabled={isCreating || !isValidAddress(recipient) || !amount}
        >
          {isCreating ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Creating...
            </>
          ) : (
            'Generate Payment Link'
          )}
        </Button>

        {!isConnected && (
          <p className="text-center text-sm text-muted-foreground">
            Connect your wallet to track your created links
          </p>
        )}
      </div>
    </form>
  );
}
