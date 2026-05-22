export function WhatYouGet() {
  return (
    <section className="py-20 md:py-28 bg-page border-t border-gray-200/60">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="max-w-[600px] mb-14 md:mb-16">
          <p className="text-[11px] tracking-[0.14em] uppercase text-gray-400 font-semibold mb-4">
            What you get
          </p>
          <h2 className="text-[28px] md:text-[38px] font-bold text-gray-900 tracking-tight leading-[1.12]">
            One email. Three levels of government.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-10">
          <div>
            <p className="text-[13px] font-semibold text-red-500 tracking-wide uppercase mb-3">
              01
            </p>
            <h3 className="text-[18px] md:text-[20px] font-semibold text-gray-900 leading-snug mb-3">
              Your weekly brief
            </h3>
            <p className="text-[15px] text-gray-500 leading-relaxed">
              Every Sunday, the votes, motions, and decisions from your city
              council, state legislature, and Congress. No apps to check, no
              feeds to scroll.
            </p>
          </div>

          <div>
            <p className="text-[13px] font-semibold text-red-500 tracking-wide uppercase mb-3">
              02
            </p>
            <h3 className="text-[18px] md:text-[20px] font-semibold text-gray-900 leading-snug mb-3">
              Cited from official sources
            </h3>
            <p className="text-[15px] text-gray-500 leading-relaxed">
              Every claim links back to the government record it came from.
              City council minutes, legislative text, executive orders.
            </p>
          </div>

          <div>
            <p className="text-[13px] font-semibold text-red-500 tracking-wide uppercase mb-3">
              03
            </p>
            <h3 className="text-[18px] md:text-[20px] font-semibold text-gray-900 leading-snug mb-3">
              Pick your topics
            </h3>
            <p className="text-[15px] text-gray-500 leading-relaxed">
              Immigration, Economy, Civil Rights. Choose what matters to you
              and skip the rest.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
