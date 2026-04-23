import { Badge } from '@/components/ui/badge';

interface TierBadgeProps {
  tier: 'pro' | 'free' | 'none';
}

export function TierBadge({ tier }: TierBadgeProps) {
  if (tier === 'none') return null;

  if (tier === 'pro') {
    return (
      <Badge className="bg-brand text-white border-transparent text-[11px] font-bold uppercase tracking-wide hover:bg-brand">
        Local Pro
      </Badge>
    );
  }

  return (
    <Badge className="bg-gray-200 text-gray-600 border-transparent text-[11px] font-bold uppercase tracking-wide hover:bg-gray-200">
      Local Free
    </Badge>
  );
}
