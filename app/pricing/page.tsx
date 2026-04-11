import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const CheckIcon = ({ color = '#6b7280' }: { color?: string }) => (
  <svg className="w-4 h-4 shrink-0 mt-0.5" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="8" fill={color} fillOpacity="0.12" />
    <path
      d="M4.5 8.5l2.5 2.5 4.5-5"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const faqs = [
  {
    q: 'Can I cancel at any time?',
    a: "Yes. Pro is month-to-month \u2014 no contracts, no fees. Cancel from your billing portal and you'll keep access until the end of your billing period.",
  },
  {
    q: 'What topics are covered?',
    a: 'Next Voters currently covers Immigration, Civil Rights, and the Economy. Free users choose one topic; Pro users receive weekly updates on all three.',
  },
  {
    q: 'Is the content actually nonpartisan?',
    a: "Yes. Our summaries are written and reviewed to avoid partisan framing. We explain what a policy does, who it affects, and what different perspectives say \u2014 without telling you what to think.",
  },
  {
    q: 'How do I manage my subscription?',
    a: 'Head to the Local page to manage your plan, topics, and billing.',
  },
];

const valuePillars = [
  {
    icon: (
      <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    label: 'Nonpartisan',
    desc: 'Written without spin. We explain policy, not politics.',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: 'Weekly updates',
    desc: 'Delivered to your inbox every week. Never miss a bill.',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
      </svg>
    ),
    label: 'AI policy chat',
    desc: 'Ask any question. Get a clear, sourced answer.',
  },
];

export default function PricingPage() {
  return (
    <div className="w-full min-h-screen bg-page">

      {/* Hero */}
      <section className="px-5 pt-20 pb-12 text-center max-w-[640px] mx-auto">
        <h1 className="text-[40px] sm:text-[52px] font-bold text-gray-950 leading-[1.05] tracking-tight mb-4">
          Simple pricing.
          <br className="hidden sm:block" /> No surprises.
        </h1>
        <p className="text-[16px] text-gray-500 leading-relaxed">
          Start free &mdash; no credit card needed. Upgrade anytime to unlock
          full coverage across all three topics.
        </p>
      </section>

      {/* Pricing cards */}
      <section className="px-4 sm:px-6 max-w-[800px] mx-auto mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          {/* Free */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 flex flex-col shadow-sm hover:border-gray-300 hover:shadow-md transition-all">
            <div className="mb-7">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Free</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-[44px] font-bold text-gray-950 leading-none">$0</span>
              </div>
              <p className="text-[13px] text-gray-400">forever</p>
            </div>

            <ul className="flex flex-col gap-3.5 mb-8 flex-1" aria-label="Free plan features">
              {[
                '1 topic of your choice',
                'Weekly civic updates via email',
                'Nonpartisan policy analysis',
              ].map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <CheckIcon color="#9ca3af" />
                  <span className="text-[14.5px] text-gray-600 leading-snug">{f}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/local"
              className="w-full text-center px-6 py-3.5 text-[14.5px] font-bold text-gray-700 border border-gray-200 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-colors"
            >
              Get started
            </Link>
          </div>

          {/* Pro */}
          <div className="relative rounded-2xl border-2 border-gray-950 bg-gray-950 p-8 flex flex-col shadow-lg">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center bg-brand text-white text-[11px] font-bold uppercase tracking-widest px-3.5 py-1 rounded-full shadow">
                Most Popular
              </span>
            </div>

            <div className="mb-7">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">Pro</p>
              <div className="flex items-baseline gap-1.5 mb-1">
                <span className="text-[44px] font-bold text-white leading-none">$2</span>
                <span className="text-[15px] text-gray-400">/&nbsp;mo</span>
              </div>
              <p className="text-[13px] text-gray-500">billed monthly &middot; cancel anytime</p>
            </div>

            <ul className="flex flex-col gap-3.5 mb-8 flex-1" aria-label="Pro plan features">
              {[
                'All 3 topics \u2014 Immigration, Civil Rights, Economy',
                'Weekly civic updates via email',
                'Nonpartisan policy analysis',
                'Cancel anytime, no questions asked',
              ].map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <CheckIcon color="#E12D39" />
                  <span className="text-[14.5px] text-gray-300 leading-snug">{f}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/local"
              className="w-full text-center px-6 py-3.5 text-[14.5px] font-bold text-gray-950 bg-white rounded-xl hover:bg-gray-100 transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>

        <p className="text-center text-[12.5px] text-gray-400 mt-5">
          Secure checkout via Stripe &middot; No credit card required for free plan
        </p>
      </section>

      {/* Value pillars */}
      <section className="px-5 max-w-[760px] mx-auto mb-20 mt-14">
        <div className="border-t border-gray-200 pt-14">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center mb-10">
            What you get
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {valuePillars.map(({ icon, label, desc }) => (
              <div key={label} className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                  {icon}
                </div>
                <p className="text-[14.5px] font-bold text-gray-950">{label}</p>
                <p className="text-[13.5px] text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 max-w-[600px] mx-auto mb-24">
        <h2 className="text-[22px] font-bold text-gray-950 mb-8 text-center tracking-tight">
          Frequently asked
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border-gray-200">
              <AccordionTrigger className="text-[14.5px] font-semibold text-gray-900 hover:no-underline text-left py-5">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-[13.5px] text-gray-500 leading-relaxed pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Bottom CTA */}
      <section className="px-5 max-w-[540px] mx-auto pb-24 text-center">
        <p className="text-[14.5px] text-gray-500">
          Questions?{' '}
          <a href="mailto:team@nextvoters.com" className="text-gray-900 font-semibold hover:underline">
            Reach out to our team
          </a>
        </p>
      </section>

    </div>
  );
}
