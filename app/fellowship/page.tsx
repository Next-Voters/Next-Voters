'use client';

import React from 'react';

const FellowshipPage = () => {
  return (
    <div className="min-h-screen bg-page">
      {/* Hero */}
      <section className="max-w-[680px] mx-auto px-5 sm:px-6 pt-16 sm:pt-24 pb-12 sm:pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3.5 py-1.5 mb-8 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-brand shrink-0" />
          <span className="text-[12.5px] font-semibold text-gray-600 tracking-wide">Fellowship program</span>
        </div>

        <h1 className="text-[34px] xs:text-[42px] sm:text-[50px] font-bold text-gray-950 mb-5 leading-tight tracking-tight">
          Become a civic changemaker
        </h1>

        <p className="text-[16px] sm:text-[17px] text-gray-500 mb-10 leading-relaxed max-w-md mx-auto">
          Changing the world starts with changing your community. Join our fellowship and make a real impact.
        </p>

        <a
          href="https://tally.so/r/mD8ooX"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center min-h-[48px] px-8 py-3 text-[15px] font-semibold text-white bg-brand rounded-xl hover:bg-brand-hover transition-colors shadow-sm touch-manipulation"
        >
          Apply Now — It&apos;s Free
        </a>
      </section>

      <div className="w-full max-w-[600px] mx-auto px-5">
        <hr className="border-gray-200" />
      </div>

      {/* Featured Speakers */}
      <section className="max-w-[680px] mx-auto px-5 sm:px-6 py-14 sm:py-20">
        <div className="text-center mb-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400 mb-3">Speakers & Mentors</p>
          <h2 className="text-[24px] sm:text-[30px] font-bold text-gray-950 tracking-tight">
            Learn from the best
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Morris P. Fiorina */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-gray-300 hover:shadow-md transition-all">
            <div className="flex flex-col items-center text-center mb-5">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSL09e96PtVn5lTnHNXYrEnsfM7BMPiV9D67g&s"
                alt="Professor Morris P. Fiorina"
                className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-gray-100"
              />
              <h3 className="text-[16px] font-bold text-gray-950">Professor Morris P. Fiorina</h3>
              <p className="text-[12.5px] text-gray-500 mt-1">Political Science, Stanford University</p>
            </div>
            <p className="text-[13.5px] text-gray-600 leading-relaxed">
              A leading American political scientist at Stanford and the Hoover Institution, renowned for his research on
              representation, public opinion, and the myth of a deeply polarized electorate.
            </p>
            <div className="mt-5 flex items-center justify-center">
              <img
                src="https://logos-world.net/wp-content/uploads/2021/10/Stanford-Symbol.png"
                alt="Stanford University"
                className="h-10 w-auto opacity-70"
              />
            </div>
          </div>

          {/* Diana C. Mutz */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-gray-300 hover:shadow-md transition-all">
            <div className="flex flex-col items-center text-center mb-5">
              <img
                src="https://web.sas.upenn.edu/endowed-professors/files/2019/12/Mutz_Diane-sq-1920x1920.jpg"
                alt="Professor Diana C. Mutz"
                className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-gray-100"
              />
              <h3 className="text-[16px] font-bold text-gray-950">Professor Diana C. Mutz</h3>
              <p className="text-[12.5px] text-gray-500 mt-1">Political Science & Communication, U Penn</p>
            </div>
            <p className="text-[13.5px] text-gray-600 leading-relaxed">
              A prominent scholar of political psychology and public opinion at the University of Pennsylvania, recognized
              for her work on cross-cutting political exposure and democratic discourse.
            </p>
            <div className="mt-5 flex items-center justify-center">
              <img
                src="https://branding.web-resources.upenn.edu/sites/default/files/styles/card_3x2/public/2022-03/UniversityofPennsylvania_FullLogo_RGB-4_0.png?h=ab080a2f&itok=tu_jMFEm"
                alt="University of Pennsylvania"
                className="h-10 w-auto opacity-70"
              />
            </div>
          </div>
        </div>

        <p className="text-[12px] text-gray-400 text-center mt-6">
          More speakers will be revealed soon — stay tuned.
        </p>
      </section>

      <div className="w-full max-w-[600px] mx-auto px-5">
        <hr className="border-gray-200" />
      </div>

      {/* $10,000+ Grant */}
      <section className="max-w-[680px] mx-auto px-5 sm:px-6 py-14 sm:py-20 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400 mb-4">Impact grants</p>
        <div className="max-w-[400px] mx-auto bg-white border border-gray-200 rounded-2xl p-8 sm:p-10 shadow-sm">
          <p className="text-[15px] text-gray-600 mb-4">Get access to a pool of</p>
          <div
            className="text-[52px] sm:text-[64px] font-bold mb-4 leading-none"
            style={{
              background: 'linear-gradient(135deg, #B91C1C 0%, #1E40AF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            $10,000+
          </div>
          <p className="text-[15px] text-gray-700 leading-relaxed">
            in no-strings-attached, impact-based grants for top-performing fellows
          </p>
        </div>
      </section>

      <div className="w-full max-w-[600px] mx-auto px-5">
        <hr className="border-gray-200" />
      </div>

      {/* Impact cards */}
      <section className="max-w-[680px] mx-auto px-5 sm:px-6 py-14 sm:py-20">
        <div className="text-center mb-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400 mb-3">What you'll do</p>
          <h2 className="text-[24px] sm:text-[30px] font-bold text-gray-950 tracking-tight">
            Fellows lead <em>real</em> change
          </h2>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 hover:border-gray-300 hover:shadow-sm transition-all">
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-brand/10 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4.5 h-4.5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.82V15.18a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-gray-950 mb-2">Create viral content that impacts millions</h3>
                <p className="text-[14px] text-gray-600 leading-relaxed">
                  Fellows will be directly trained by a viral marketing expert with millions of views on TikTok pages,
                  empowering millions of voters by raising awareness on accessible tools provided by Next Voters.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 hover:border-gray-300 hover:shadow-sm transition-all">
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-brand/10 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4.5 h-4.5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-gray-950 mb-2">Lead real change in your community</h3>
                <p className="text-[14px] text-gray-600 leading-relaxed">
                  Fellows will empower young voters in their local community of choice — school, district, and beyond —
                  by integrating Next Voters technology.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-[680px] mx-auto px-5 sm:px-6 text-center pb-16 sm:pb-24">
        <h2 className="text-[24px] sm:text-[30px] font-bold text-gray-950 mb-5 tracking-tight">
          Let&apos;s strengthen democracy, together
        </h2>
        <p className="text-[15px] text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed">
          Applications are free and open to all young civic leaders.
        </p>
        <a
          href="https://tally.so/r/mD8ooX"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center min-h-[48px] px-8 py-3 text-[15px] font-semibold text-white bg-brand rounded-xl hover:bg-brand-hover transition-colors shadow-sm touch-manipulation"
        >
          Apply Now — It&apos;s Free
        </a>
      </section>
    </div>
  );
};

export default FellowshipPage;
