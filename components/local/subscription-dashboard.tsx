'use client';

import { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useSubscription } from '@/hooks/use-subscription';
import { ManageTopics } from '@/components/local/manage-topics';
import { sendReferralEmail } from '@/server-actions/mailer';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export function SubscriptionDashboard() {
  const { isPro, refetch } = useSubscription();

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [canceledUntil, setCanceledUntil] = useState<string | null>(null);

  // Referral state
  const [referralEmail, setReferralEmail] = useState('');
  const [referralSubmitting, setReferralSubmitting] = useState(false);
  const [referralNotice, setReferralNotice] = useState<string | null>(null);
  const { user } = useAuth();

  const handleUpgrade = async () => {
    setCheckoutLoading(true);
    try {
      const res = await fetch('/api/stripe/upgrade', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        refetch();
      } else {
        alert(data.error ?? 'Failed to upgrade');
      }
    } catch {
      alert('Failed to upgrade');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handlePortal = async () => {
    setCheckoutLoading(true);
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      setCheckoutLoading(false);
    }
  };

  const handleCancel = async () => {
    setCancelLoading(true);
    try {
      const res = await fetch('/api/stripe/cancel', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setCanceledUntil(data.periodEnd);
        setShowCancelDialog(false);
      }
    } finally {
      setCancelLoading(false);
    }
  };

  const handleReferral = async () => {
    const trimmed = referralEmail.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      alert('Please enter a valid email address.');
      return;
    }
    if (!user?.email) return;
    setReferralSubmitting(true);
    try {
      await sendReferralEmail(user.email, trimmed);
      setReferralNotice('Referral sent!');
      setReferralEmail('');
      setTimeout(() => setReferralNotice(null), 3000);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      alert(`Could not send referral: ${message}`);
    } finally {
      setReferralSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-56px)] bg-page flex flex-col">
      {/* ManageTopics handles topic selection, tier display, and upgrade prompt */}
      <ManageTopics />

      {/* Subscription actions */}
      <div className="w-full max-w-[560px] mx-auto px-5 sm:px-6 pb-8">
        <div className="border-t border-gray-200 pt-8 mt-2">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-5">
            Subscription
          </p>

          {canceledUntil ? (
            <p className="text-[13px] text-gray-500">
              Access until{' '}
              {new Date(canceledUntil).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {isPro ? (
                <button
                  onClick={handlePortal}
                  disabled={checkoutLoading}
                  className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 text-[14px] font-bold text-gray-700 border border-gray-200 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  {checkoutLoading ? 'Loading…' : 'Manage Billing'}
                </button>
              ) : (
                <button
                  onClick={handleUpgrade}
                  disabled={checkoutLoading}
                  className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 text-[14px] font-bold text-white bg-brand rounded-xl hover:bg-brand-hover transition-colors disabled:opacity-50 shadow-sm"
                >
                  {checkoutLoading ? 'Loading…' : 'Upgrade to Pro — $5/mo'}
                </button>
              )}
              <button
                onClick={() => setShowCancelDialog(true)}
                className="text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors py-1"
              >
                Cancel subscription
              </button>
            </div>
          )}
        </div>

        {/* Refer a friend */}
        <div className="border-t border-gray-200 pt-8 mt-8">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
            Refer a friend
          </p>
          <p className="text-[13px] text-gray-500 mb-4">
            Send a friend an invite and you'll be considered for future deals.
          </p>
          <div className="flex items-stretch gap-2.5 max-w-[400px]">
            <div className="flex-1 flex items-stretch border border-gray-200 rounded-xl overflow-hidden bg-white">
              <div className="flex items-center justify-center px-3 border-r border-gray-200 bg-gray-50">
                <Mail className="h-4 w-4 text-gray-400" aria-hidden="true" />
              </div>
              <input
                className="flex-1 min-w-0 px-3 py-2.5 text-[14px] text-gray-950 placeholder:text-gray-400 focus:outline-none"
                type="email"
                inputMode="email"
                placeholder="friend@email.com"
                value={referralEmail}
                onChange={(e) => setReferralEmail(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleReferral(); }}
              />
            </div>
            <button
              type="button"
              disabled={referralSubmitting}
              onClick={handleReferral}
              className="px-4 py-2.5 text-[13px] font-bold text-white bg-brand rounded-xl hover:bg-brand-hover transition-colors disabled:opacity-60 shrink-0"
            >
              {referralSubmitting ? 'Sending…' : 'Send'}
            </button>
          </div>
          {referralNotice && (
            <div className="mt-2.5 flex items-center gap-1.5 text-[13px] text-green-700 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              {referralNotice}
            </div>
          )}
        </div>
      </div>

      {/* Cancel dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="max-w-[360px]">
          <DialogHeader>
            <DialogTitle className="text-[18px] font-bold text-gray-950">
              Cancel your subscription?
            </DialogTitle>
            <DialogDescription className="text-[14px] text-gray-500 mt-1 leading-relaxed">
              You&apos;ll keep Pro access until the end of your current billing period. After that, your account will revert to the free plan.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2.5 mt-4">
            <button
              onClick={handleCancel}
              disabled={cancelLoading}
              className="w-full px-6 py-3 text-[14.5px] font-bold text-white bg-gray-900 rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-60"
            >
              {cancelLoading ? 'Canceling…' : 'Yes, cancel'}
            </button>
            <button
              onClick={() => setShowCancelDialog(false)}
              className="w-full px-6 py-3 text-[14px] font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Keep my subscription
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
