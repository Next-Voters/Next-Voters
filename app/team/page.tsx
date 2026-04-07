import React from 'react';
import { teamMembers } from '@/data/team-members';
import TeamMemberCard from '@/components/team-member-card';

const Team = () => {
  return (
    <div className="min-h-screen bg-page">
      <div className="max-w-[1100px] mx-auto px-5 sm:px-6 py-14 sm:py-20">
        <div className="mb-10 sm:mb-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400 mb-3">The people</p>
          <h1 className="text-[30px] sm:text-[38px] font-bold text-gray-950 tracking-tight mb-3">Our Team</h1>
          <p className="text-[15.5px] text-gray-500 leading-relaxed max-w-md">
            Meet the people building Next Voters.
          </p>
        </div>

        <div className="grid gap-5 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member, index) => (
            <TeamMemberCard key={index} member={member} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Team;
