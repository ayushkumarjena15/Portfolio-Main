import { motion, useMotionValue, useAnimationFrame, useTransform, useScroll } from 'framer-motion';
import { useMemo, useState } from 'react';
import {
    SiReact, SiNextdotjs, SiTypescript, SiTailwindcss,
    SiGreensock, SiFramer, SiSanity, SiContentful,
    SiNodedotjs, SiExpress, SiPostgresql, SiMongodb,
    SiPrisma, SiZod, SiPnpm, SiBun,
    SiGit, SiGithub, SiVercel,
    SiDocker, SiFigma, SiSupabase,
    SiFirebase, SiLinux
} from 'react-icons/si';
import { FaAws } from 'react-icons/fa';
import { TbPaw } from 'react-icons/tb';
import propeller from '../assets/propeller.png';

const skillRows = [
    ['ReactJS', 'Next.js', 'TypeScript', 'Tailwind CSS', 'GSAP', 'Motion', 'Sanity'],
    ['Contentful', 'Node.js', 'Express.js', 'PostgreSQL', 'MongoDB', 'Prisma'],
    ['Zustand', 'Zod', 'pnpm', 'Bun', 'Git', 'GitHub', 'Vercel'],
    ['AWS', 'Docker', 'Figma', 'Supabase', 'Firebase', 'Linux'],
];

const skillIcons = {
    'ReactJS': { icon: SiReact, color: '#61DAFB' },
    'Next.js': { icon: SiNextdotjs, color: '#ffffff' },
    'TypeScript': { icon: SiTypescript, color: '#3178C6' },
    'Tailwind CSS': { icon: SiTailwindcss, color: '#06B6D4' },
    'GSAP': { icon: SiGreensock, color: '#88CE02' },
    'Motion': { icon: SiFramer, color: '#0055FF' },
    'Sanity': { icon: SiSanity, color: '#F03E2F' },
    'Contentful': { icon: SiContentful, color: '#2478CC' },
    'Node.js': { icon: SiNodedotjs, color: '#5FA04E' },
    'Express.js': { icon: SiExpress, color: '#ffffff' },
    'PostgreSQL': { icon: SiPostgresql, color: '#4169E1' },
    'MongoDB': { icon: SiMongodb, color: '#47A248' },
    'Prisma': { icon: SiPrisma, color: '#2D3748' },
    'Zustand': { icon: TbPaw, color: '#453F39' },
    'Zod': { icon: SiZod, color: '#3E67B1' },
    'pnpm': { icon: SiPnpm, color: '#F69220' },
    'Bun': { icon: SiBun, color: '#FBF0DF' },
    'Git': { icon: SiGit, color: '#F05032' },
    'GitHub': { icon: SiGithub, color: '#ffffff' },
    'Vercel': { icon: SiVercel, color: '#ffffff' },
    'AWS': { icon: FaAws, color: '#FF9900' },
    'Docker': { icon: SiDocker, color: '#2496ED' },
    'Figma': { icon: SiFigma, color: '#F24E1E' },
    'Supabase': { icon: SiSupabase, color: '#3FCF8E' },
    'Firebase': { icon: SiFirebase, color: '#DD2C00' },
    'Linux': { icon: SiLinux, color: '#FCC624' },
};

/* ── Realistic 3D Propeller Animation ── */
const SpinningWheel = () => {
    const { scrollYProgress } = useScroll();
    const rotation = useTransform(scrollYProgress, [0, 1], [0, 720]);

    return (
        <div className="w-full h-full flex items-center justify-center pointer-events-none">
            <div className="relative w-[300px] h-[300px] flex items-center justify-center">
                <div className="absolute inset-[-40px] bg-blue-500/10 rounded-full blur-[100px]" />

                <motion.img
                    src={propeller}
                    alt="Propeller"
                    className="w-full h-full object-contain relative z-10"
                    style={{
                        rotate: rotation,
                        mixBlendMode: 'screen',
                        filter: 'brightness(1.1) contrast(1.1)'
                    }}
                />

            </div>
        </div>
    );
};

const SkillsetSection = () => {
    return (
        <section className="pt-16 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden">
            {/* Realistic Spinning Wheel Animation */}
            <motion.div
                className="flex justify-center mb-8"
                initial={{ opacity: 0, scale: 0.7 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
            >
                <div className="w-48 h-48 md:w-64 md:h-64 relative">
                    <SpinningWheel />
                </div>
            </motion.div>

            {/* Header */}
            <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <p className="text-[11px] uppercase tracking-[0.4em] text-accent1 font-bold mb-4">My Skillset</p>
                <h2 className="text-5xl md:text-7xl font-heading font-black text-white">
                    The Magic{' '}
                    <span className="bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500 bg-clip-text text-transparent italic">
                        Behind
                    </span>
                </h2>
            </motion.div>

            {/* Skill Rows */}
            <div className="space-y-4 flex flex-col items-center">
                {skillRows.map((row, rowIdx) => (
                    <motion.div
                        key={rowIdx}
                        className="flex flex-wrap justify-center gap-3"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: rowIdx * 0.1 }}
                    >
                        {row.map((skill) => (
                            <motion.span
                                key={skill}
                                className="px-5 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-full text-sm font-medium text-secondary flex items-center gap-2.5 hover:border-white/20 hover:text-white hover:bg-white/[0.06] transition-all duration-500 cursor-default group"
                                whileHover={{ scale: 1.05, y: -2 }}
                            >
                                {skillIcons[skill] ? (
                                    <span className="opacity-80 group-hover:opacity-100 transition-opacity flex items-center">
                                        {(() => {
                                            const IconComp = skillIcons[skill].icon;
                                            return <IconComp size={16} color={skillIcons[skill].color} />;
                                        })()}
                                    </span>
                                ) : (
                                    <span className="text-base opacity-60 group-hover:opacity-100 transition-opacity">•</span>
                                )}
                                {skill}
                            </motion.span>
                        ))}
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default SkillsetSection;
