import Image from 'next/image';
import { TeamMember } from '@/types/team';
import { Linkedin } from 'lucide-react';

interface TeamMemberCardProps {
  member: TeamMember;
}

const TeamMemberCard = ({ member }: TeamMemberCardProps) => {
  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-md transition-all duration-200 h-full">
      <div className="w-full aspect-[4/3] relative bg-gray-100">
        <Image
          src={member.image}
          alt={`${member.name}`}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-[16px] font-bold text-gray-950 tracking-tight leading-tight">
          {member.name}
        </h3>
        <span className="text-[13px] text-brand font-semibold mt-0.5">{member.role}</span>
        <p className="mt-3 text-[13.5px] text-gray-500 leading-relaxed flex-1 line-clamp-4">
          {member.description}
        </p>
        <div className="pt-4 mt-auto border-t border-gray-100">
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors touch-manipulation"
            aria-label={`${member.name} on LinkedIn`}
          >
            <Linkedin className="w-4 h-4" fill="currentColor" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard;
