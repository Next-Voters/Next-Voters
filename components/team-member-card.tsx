import Image from 'next/image';
import { TeamMember } from '@/types/team';
import { Linkedin } from 'lucide-react';

interface TeamMemberCardProps {
  member: TeamMember;
}

const TeamMemberCard = ({ member }: TeamMemberCardProps) => {
  return (
    <div className="flex flex-col bg-page rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 h-full overflow-hidden">
      <div className="w-full h-56 sm:h-80 relative">
        <Image
          src={member.image}
          alt={`${member.name} Avatar`}
          fill
          className="rounded-t-lg object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="p-4 sm:p-5 flex-1 flex flex-col min-w-0">
        <h3 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white font-plus-jakarta-sans">
          <a href="#" className="hover:underline">{member.name}</a>
        </h3>
        <span className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-plus-jakarta-sans">{member.role}</span>
        <p className="mt-2 sm:mt-3 mb-3 sm:mb-4 font-light text-sm sm:text-base text-gray-500 dark:text-gray-400 font-plus-jakarta-sans line-clamp-4">
          {member.description}
        </p>
        <ul className="flex space-x-4 mt-auto pt-3 sm:pt-4">
          <a href={member.linkedin} className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded text-gray-500 hover:text-gray-900 dark:hover:text-white touch-manipulation" aria-label={`${member.name} on LinkedIn`}>
            <Linkedin className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" />
          </a>
        </ul>
      </div>
    </div>
  );
};

export default TeamMemberCard;
