import React from 'react';
import { teamMembers } from '@/data/team-members';
import TeamMemberCard from '@/components/team-member-card';

const Team = () => {
  return (
    <section className="bg-page dark:bg-gray-900">
      <div className="py-6 sm:py-8 px-4 sm:px-6 mx-auto max-w-screen-xl lg:py-16">
        <div className="mx-auto max-w-screen-sm text-center mb-6 sm:mb-8 lg:mb-16">
          <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl lg:text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white font-plus-jakarta-sans">
            Our Team
          </h2>
          <p className="font-light text-gray-500 text-base sm:text-lg lg:text-xl lg:mb-16 dark:text-gray-400 font-plus-jakarta-sans">
            Meet the people behind Next Voters!
          </p>
        </div>
        <div className="grid gap-5 sm:gap-8 mb-6 lg:mb-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member, index) => (
            <TeamMemberCard key={index} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
