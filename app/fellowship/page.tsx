'use client';

import React from 'react';

const FellowshipPage = () => {
  return (
    <div className="min-h-screen bg-page">
      {/* Main Content */}
      <main className="w-full">
        {/* Hero Section */}
        <div className="max-w-[680px] mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-12 sm:pb-16 text-center">
          <h1 className="text-[32px] xs:text-[40px] sm:text-[48px] font-bold text-gray-900 mb-4 sm:mb-6 font-plus-jakarta-sans leading-tight">
            Become a civic changemaker
          </h1>
          
          <p className="text-[15px] sm:text-[16px] text-gray-600 mb-8 sm:mb-10 font-plus-jakarta-sans leading-relaxed">
            Changing the world starts with changing your community.
          </p>
          
          <a href="https://tally.so/r/mD8ooX" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center min-h-[48px] px-6 sm:px-8 py-3 text-[14px] text-gray-900 border border-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-plus-jakarta-sans font-medium touch-manipulation">
            Apply Now - It's Free
          </a>
        </div>

        {/* Featured Speakers & Mentors (moved up) */}
        <div className="w-full max-w-[600px] mx-auto px-4 sm:px-0">
          <hr className="border-gray-200 my-10 sm:my-16" />
        </div>
        <div className="max-w-[680px] mx-auto px-4 sm:px-6 text-center mb-12 sm:mb-20">
          <h2 className="text-[26px] sm:text-[32px] font-semibold text-gray-900 mb-4 sm:mb-6 font-plus-jakarta-sans">
            Featured Speakers & Mentors
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-left">
            {/* Morris P. Fiorina */}
            <div className="bg-white border border-gray-300 rounded-xl p-5 sm:p-6 shadow-sm">
              <div className="flex flex-col items-center text-center">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSL09e96PtVn5lTnHNXYrEnsfM7BMPiV9D67g&s"
                  alt="Professor Morris P. Fiorina"
                  className="w-28 h-28 rounded-full object-cover mb-4 border border-gray-300"
                />
                <h3 className="text-[18px] font-semibold text-gray-900 font-plus-jakarta-sans">Professor Morris P. Fiorina</h3>
                <p className="text-[13px] text-gray-600 font-plus-jakarta-sans mb-4">Professor of Political Science, Stanford University</p>
              </div>
              <p className="text-[14px] text-gray-700 leading-relaxed font-plus-jakarta-sans">
                Morris P. Fiorina is a leading American political scientist at Stanford University and the Hoover Institution, renowned for his research on representation, public opinion, and the myth of a deeply polarized electorate.
              </p>
              <div className="mt-4 flex items-center justify-center">
                <img
                  src="https://logos-world.net/wp-content/uploads/2021/10/Stanford-Symbol.png"
                  alt="Stanford University logo"
                  className="h-24 md:h-28 w-auto"
                />
              </div>
            </div>

            {/* Diana C. Mutz */}
            <div className="bg-white border border-gray-300 rounded-xl p-5 sm:p-6 shadow-sm">
              <div className="flex flex-col items-center text-center">
                <img
                  src="https://web.sas.upenn.edu/endowed-professors/files/2019/12/Mutz_Diane-sq-1920x1920.jpg"
                  alt="Professor Diana C. Mutz"
                  className="w-28 h-28 rounded-full object-cover mb-4 border border-gray-300"
                />
                <h3 className="text-[18px] font-semibold text-gray-900 font-plus-jakarta-sans">Professor Diana C. Mutz</h3>
                <p className="text-[13px] text-gray-600 font-plus-jakarta-sans mb-4">Professor of Political Science & Communication, University of Pennsylvania</p>
              </div>
              <p className="text-[14px] text-gray-700 leading-relaxed font-plus-jakarta-sans">
                Diana C. Mutz is a prominent scholar of political psychology and public opinion at the University of Pennsylvania, widely recognized for her work on cross-cutting political exposure and the dynamics of democratic discourse.
              </p>
              <div className="mt-4 flex items-center justify-center">
                <img
                  src="https://branding.web-resources.upenn.edu/sites/default/files/styles/card_3x2/public/2022-03/UniversityofPennsylvania_FullLogo_RGB-4_0.png?h=ab080a2f&itok=tu_jMFEm"
                  alt="University of Pennsylvania logo"
                  className="h-24 md:h-28 w-auto"
                />
              </div>
            </div>
          </div>

          <p className="text-[12px] text-gray-500 font-plus-jakarta-sans mt-6">
            More speakers will be revealed soon — stay tuned!
          </p>
        </div>

        {/* Divider */}
        <div className="w-full max-w-[600px] mx-auto px-4 sm:px-0">
          <hr className="border-gray-200 my-10 sm:my-16" />
        </div>

        {/* $10,000+ Section */}
        <div className="max-w-[680px] mx-auto px-4 sm:px-6 text-center mb-12 sm:mb-20">
          <div className="max-w-lg mx-auto bg-white border border-gray-300 rounded-xl p-6 sm:p-12 shadow-sm">
            <p className="text-[15px] sm:text-[16px] text-gray-900 mb-4 sm:mb-6 font-plus-jakarta-sans">
              Get access to a pool of
            </p>
            <div 
              className="text-[48px] sm:text-[64px] font-bold mb-4 sm:mb-6 leading-none font-plus-jakarta-sans"
              style={{ 
                background: 'linear-gradient(135deg, #B91C1C 0%, #1E40AF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              $10,000+
            </div>
            <p className="text-[16px] text-gray-900 leading-relaxed font-plus-jakarta-sans">
              in no-strings-attached, impact-based grants for top-performing fellows
            </p>
          </div>
        </div>

        {/* Fellows Lead Real Change Section */}
        <div className="max-w-[680px] mx-auto px-4 sm:px-6 text-center mb-12 sm:mb-20">
          <h2 className="text-[26px] sm:text-[32px] font-semibold text-gray-900 mb-8 sm:mb-12 font-plus-jakarta-sans">
            Fellows lead <em>real</em> change
          </h2>
          
          {/* Impact Cards */}
          <div className="space-y-5 sm:space-y-8">
            {/* Card 1 */}
            <div className="bg-white border border-gray-300 rounded-xl p-5 sm:p-8 shadow-sm">
              <h3 className="text-[18px] sm:text-[20px] font-semibold text-gray-900 mb-3 sm:mb-4 font-plus-jakarta-sans">
                Create viral content that impacts millions
              </h3>
              <p className="text-[14px] text-gray-700 leading-relaxed font-plus-jakarta-sans">
              Fellows will be directly trained by a viral marketing expert with millions of views on TikTok pages, empowering millions of voters by raising awareness on accessible tools provided by Next Voters.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-gray-300 rounded-xl p-8 shadow-sm">
              <h3 className="text-[20px] font-semibold text-gray-900 mb-4 font-plus-jakarta-sans">
                Lead real change in your community
              </h3>
              <p className="text-[14px] text-gray-700 leading-relaxed font-plus-jakarta-sans">
              Fellows will empower young voters in their local community of choice (school, district, etc) by integrating Next Voters technology.
              </p>
            </div>
          </div>
        </div>

        

        {/* Final CTA Section */}
        <div className="max-w-[680px] mx-auto px-6 text-center pb-20">
          <h2 className="text-[32px] font-semibold text-gray-900 mb-6 font-plus-jakarta-sans">
            Let's strengthen democracy, together
          </h2>
          
          <a href="https://tally.so/r/mD8ooX" target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-3 text-[14px] text-gray-900 border border-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-plus-jakarta-sans font-medium">
            Apply Now - It's Free
          </a>
        </div>
      </main>
    </div>
  );
}

export default FellowshipPage;