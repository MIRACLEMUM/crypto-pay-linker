import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Link } from 'react-router-dom';
import { Copy, Check, ExternalLink, Clock, CheckCircle, ArrowUpRight, LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PaymentLink } from '@/types/payment';
import { getPaymentLinks, generatePaymentUrl } from '@/lib/storage';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export function Dashboard() {
  const { address, isConnected } = useAccount();
  const [links, setLinks] = useState<PaymentLink[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const allLinks = getPaymentLinks();
    // Show all links for now, or filter by creator if connected
    setLinks(allLinks.reverse()); // Most recent first
  }, []);

  const handleCopy = async (id: string) => {
    const url = generatePaymentUrl(id);
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success('Link copied!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const shortenAddress = (addr: string) => 
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (links.length === 0) {
    return (
      <div className="glass-card p-12 max-w-2xl mx-auto text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary mx-auto mb-6">
          <LinkIcon className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold mb-2">No Payment Links Yet</h2>
        <p className="text-muted-foreground mb-8">
          Create your first payment link to start receiving crypto payments.
        </p>
        <Button asChild variant="gradient" size="lg">
          <Link to="/create">
            Create Payment Link
            <ArrowUpRight className="h-5 w-5" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Payment Links</h2>
          <p className="text-muted-foreground">
            {links.length} link{links.length !== 1 ? 's' : ''} created
          </p>
        </div>
        <Button asChild variant="gradient">
          <Link to="/create">
            Create New Link
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Links Grid */}
      <div className="grid gap-4">
        {links.map((link, index) => (
          <div
            key={link.id}
            className="glass-card p-6 hover:shadow-glow-card transition-all duration-300 animate-fade-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Left: Payment Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl font-bold gradient-text">
                    {link.amount} {link.currency}
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                      link.paid
                        ? "bg-primary/10 text-primary"
                        : "bg-secondary text-muted-foreground"
                    )}
                  >
                    {link.paid ? (
                      <>
                        <CheckCircle className="h-3 w-3" />
                        Paid
                      </>
                    ) : (
                      <>
                        <Clock className="h-3 w-3" />
                        Pending
                      </>
                    )}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground font-mono truncate">
                  To: {shortenAddress(link.recipient)}
                </p>
                {link.message && (
                  <p className="text-sm text-muted-foreground mt-1 truncate">
                    "{link.message}"
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  Created {formatDate(link.createdAt)}
                </p>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(link.id)}
                >
                  {copiedId === link.id ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                >
                  <Link to={`/pay/${link.id}`}>
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
