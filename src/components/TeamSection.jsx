import React, { useState } from 'react';
import { User, Award, BookOpen, ChevronDown, ChevronUp, Sparkles, Shield, Mail } from 'lucide-react';

const TEAM = [
  {
    category: 'Lead Nuclear Radiochemistry Researchers (Datta 2020 Study)',
    members: [
      {
        name: 'Dr. Arpita Datta',
        role: 'Lead Author & Radiochemist',
        institution: 'Amity Institute of Nuclear Science & Technology',
        bio: 'Specializes in Instrumental Neutron Activation Analysis (INAA) of food matrices and forensic trace element fingerprinting.',
        publications: '24+ Peer-Reviewed Papers',
        avatar: 'AD'
      },
      {
        name: 'Prof. A. N. Garg',
        role: 'Senior Nuclear Radiochemist',
        institution: 'BARC / Amity University',
        bio: 'Pioneer in neutron activation methodology and essential trace element metabolism in dietary supplements.',
        publications: '150+ INAA Studies',
        avatar: 'AG'
      },
      {
        name: 'Dr. R. Acharya',
        role: 'Head, INAA Section',
        institution: 'Radiochemistry Division, BARC, Mumbai',
        bio: 'Oversees the Apsara-U research reactor INAA facility and certified reference material validation protocols.',
        publications: '80+ Reactor Papers',
        avatar: 'RA'
      }
    ]
  },
  {
    category: 'Food Safety & Technical Advisory Board',
    members: [
      {
        name: 'Dr. V. Sharma',
        role: 'Forensic Food Toxicologist',
        institution: 'Department of Atomic Energy',
        bio: 'Focuses on heavy metal bioaccumulation, lead chromate adulteration detection, and WHO safety threshold modeling.',
        publications: '35+ Forensic Papers',
        avatar: 'VS'
      },
      {
        name: 'Dr. Sandanayake T.',
        role: 'South Asian Food Chemist',
        institution: 'University of Sri Jayewardenepura',
        bio: 'Author of Ceylon spice trace element profiling and industrial heavy metal contamination surveys.',
        publications: '18+ Asian Food Studies',
        avatar: 'ST'
      }
    ]
  }
];

export default function TeamSection() {
  const [expandedMember, setExpandedMember] = useState(null);

  const toggleExpand = (name) => {
    setExpandedMember(expandedMember === name ? null : name);
  };

  return (
    <section id="team" className="py-24 relative z-20 bg-[#07090E] border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 font-mono text-xs mb-4">
            <span>07</span>
            <span className="text-slate-600">/</span>
            <span>RESEARCH TEAM & ADVISORS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 font-sans">
            Scientific Contributors & Radiochemists
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl font-light">
            Meet the radiochemistry researchers, nuclear physicists, and forensic toxicologists powering the Food Intelligence Lab database.
          </p>
        </div>

        {/* Team Categories */}
        <div className="space-y-16">
          {TEAM.map((group, gIdx) => (
            <div key={gIdx}>
              <h3 className="text-xl font-bold text-cyan-300 font-sans mb-8 flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-cyan-400"></span>
                {group.category}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.members.map((member, mIdx) => {
                  const isExpanded = expandedMember === member.name;
                  return (
                    <div
                      key={mIdx}
                      onClick={() => toggleExpand(member.name)}
                      className={`glass-panel p-6 rounded-2xl border transition-all duration-300 cursor-pointer group hover:-translate-y-1 ${
                        isExpanded ? 'border-cyan-400 bg-slate-900/90 shadow-[0_0_25px_rgba(0,240,255,0.15)]' : 'border-slate-800/90 hover:border-cyan-500/40'
                      }`}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 flex items-center justify-center text-lg font-bold font-mono text-cyan-300 group-hover:scale-105 transition-transform shadow-inner">
                          {member.avatar}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-base font-bold text-white font-sans group-hover:text-cyan-300 transition-colors">
                            {member.name}
                          </h4>
                          <p className="text-xs text-cyan-400 font-mono font-medium">{member.role}</p>
                          <p className="text-[11px] text-slate-400 font-light truncate">{member.institution}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-3 border-t border-slate-800/80">
                        <span className="flex items-center gap-1.5 text-slate-300">
                          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                          {member.publications}
                        </span>

                        <span className="text-cyan-400 font-bold text-[11px] flex items-center gap-1">
                          {isExpanded ? 'Collapse' : 'Bio Details'}
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </span>
                      </div>

                      {/* Expandable Bio Drawer */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-300 font-light leading-relaxed animate-fade-in">
                          <p className="mb-2">{member.bio}</p>
                          <span className="inline-block px-2.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-[10px]">
                            BARC Apsara-U Certified Specialist
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
