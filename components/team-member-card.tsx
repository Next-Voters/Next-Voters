import Image from 'next/image';
import { TeamMember } from '@/types/team';
import { Linkedin } from 'lucide-react';

interface TeamMemberCardProps {
  member: TeamMember;
}

const TeamMemberCard = ({ member }: TeamMemberCardProps) => {
  return (
    <div className="flex flex-col bg-page rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 h-full">
      <div className="w-full h-80 relative">
        <Image
          src={member.image}
          alt={`${member.name} Avatar`}
          fill
          className="rounded-lg sm:rounded-none sm:rounded-l-lg object-cover"
        />
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          <a href="#">{member.name}</a>
        </h3>
        <span className="text-gray-500 dark:text-gray-400">{member.role}</span>
        <p className="mt-3 mb-4 font-light text-gray-500 dark:text-gray-400">
          {member.description}
        </p>
        <ul className="flex space-x-4 mt-auto pt-4">
          <a href={member.linkedin} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
            <Linkedin className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" />
          </a>
        </ul>
      </div>
    </div>
  );
};

export default TeamMemberCard;
