import React from 'react';
import { motion } from 'framer-motion';
import { Beaker, FlaskConical, Cpu, Zap, ArrowUpRight } from 'lucide-react';

const experiments = [
    {
        title: "Neural UI Experiments",
        description: "Exploring generative UI components driven by user intent signals.",
        status: "Active",
        tags: ["AI", "React", "Framer Motion"]
    },
    {
        title: "Edge Database Sync",
        description: "Optimized real-time synchronization for global edge-distributed databases.",
        status: "Completed",
        tags: ["Architecture", "Edge Computing"]
    },
    {
        title: "WebGPU Path Tracer",
        description: "High-performance path tracing directly in the browser using WebGPU.",
        status: "Planned",
        tags: ["Graphics", "WebGPU"]
    }
];

const LabsPage = () => {
    return (
        <section className="min-h-screen bg-background pt-32 pb-20 px-6 max-w-7xl mx-auto overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-24"
            >
                <p className="text-white/40 text-[11px] font-mono tracking-[0.3em] uppercase mb-8 pl-1">EXPERIMENTAL PLAYGROUND</p>
                <h1 className="flex flex-col">
                    <span className="text-[clamp(4.5rem,10vw,8.5rem)] font-black leading-[0.85] tracking-tight uppercase text-white font-heading select-none text-gradient-purple">
                        THE
                    </span>
                    <span className="text-[clamp(4.5rem,10vw,8.5rem)] font-serif italic text-white/[0.35] leading-[0.85] tracking-tight pl-2 md:pl-6 -mt-3 select-none">
                        labs
                    </span>
                </h1>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {experiments.map((exp, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative bg-[#0d0d0d] border border-white/5 rounded-3xl p-8 hover:border-accent1/30 transition-all duration-500 overflow-hidden"
                    >
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-accent1/5 blur-3xl rounded-full" />

                        <div className="relative z-10 space-y-6">
                            <div className="flex justify-between items-start">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-accent1 group-hover:scale-110 group-hover:bg-accent1 group-hover:text-black transition-all duration-500">
                                    {index === 0 ? <FlaskConical size={20} /> : index === 1 ? <Cpu size={20} /> : <Zap size={20} />}
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${exp.status === 'Active' ? 'border-green-500/50 text-green-500' : 'border-white/10 text-white/40'}`}>
                                    {exp.status}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-white tracking-tight">{exp.title}</h3>
                                <p className="text-secondary text-sm leading-relaxed">{exp.description}</p>
                            </div>

                            <div className="flex flex-wrap gap-2 pt-4">
                                {exp.tags.map(tag => (
                                    <span key={tag} className="text-[10px] font-mono text-white/30 px-2 py-0.5 rounded-md bg-white/5 border border-white/5">#{tag}</span>
                                ))}
                            </div>

                            <div className="pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent1 hover:text-white transition-colors">
                                    Explore Lab <ArrowUpRight size={14} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Newsletter/Footer Card */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="mt-24 p-12 md:p-20 rounded-[3rem] border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent flex flex-col items-center text-center space-y-8"
            >
                <div className="w-20 h-20 rounded-full bg-[#5a4fcf]/20 flex items-center justify-center text-[#5a4fcf]">
                    <Beaker size={32} />
                </div>
                <div className="space-y-4">
                    <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Curiosity fueled by coffee.</h2>
                    <p className="text-secondary text-base max-w-lg mx-auto">
                        This is where I build prototypes, experiment with emerging tech, and break things to learn how they work.
                    </p>
                </div>
                <button className="px-8 py-4 bg-white text-black rounded-full font-black uppercase tracking-[0.2em] text-xs hover:bg-accent1 transition-colors">
                    Get Notifications
                </button>
            </motion.div>
        </section>
    );
};

export default LabsPage;
