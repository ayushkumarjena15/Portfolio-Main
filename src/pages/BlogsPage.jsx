import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, Clock, ArrowRight } from 'lucide-react';

const blogs = [
    {
        title: "The Future of Web Engineering",
        date: "March 2026",
        readTime: "5 min read",
        excerpt: "Exploring the shift towards AI-integrated web architecture and what it means for the next generation of developers.",
        category: "Engineering"
    },
    {
        title: "Building Scalable Systems",
        date: "February 2026",
        readTime: "8 min read",
        excerpt: "Lessons learned from scaling SkillTwin to handle thousands of concurrent users in a fast-paced environment.",
        category: "System Design"
    }
];

const BlogsPage = () => {
    return (
        <section className="min-h-screen bg-background pt-32 pb-20 px-6 max-w-7xl mx-auto overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-24"
            >
                <p className="text-white/40 text-[11px] font-mono tracking-[0.3em] uppercase mb-8 pl-1">MY THOUGHTS && WRITINGS</p>
                <h1 className="flex flex-col">
                    <span className="text-[clamp(4.5rem,10vw,8.5rem)] font-black leading-[0.85] tracking-tight uppercase text-white font-heading select-none">
                        BLOG
                    </span>
                    <span className="text-[clamp(4.5rem,10vw,8.5rem)] font-serif italic text-white/[0.35] leading-[0.85] tracking-tight pl-2 md:pl-6 -mt-3 select-none">
                        posts
                    </span>
                </h1>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {blogs.map((blog, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group cursor-pointer"
                    >
                        <div className="relative aspect-[16/9] rounded-3xl overflow-hidden mb-6 bg-white/5 border border-white/5 group-hover:border-white/20 transition-all duration-500">
                            <div className="absolute inset-0 bg-gradient-to-br from-accent1/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute top-6 left-6 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
                                <span className="text-[10px] font-black uppercase text-accent1 tracking-wider">{blog.category}</span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 text-white/40 text-[10px] font-mono tracking-widest uppercase">
                                <span className="flex items-center gap-1.5"><Calendar size={12} /> {blog.date}</span>
                                <span className="flex items-center gap-1.5"><Clock size={12} /> {blog.readTime}</span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-accent1 transition-colors duration-300 tracking-tight leading-tight">
                                {blog.title}
                            </h3>
                            <p className="text-secondary text-base leading-relaxed line-clamp-2 max-w-xl">
                                {blog.excerpt}
                            </p>
                            <div className="pt-4">
                                <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white group-hover:gap-4 transition-all duration-300">
                                    Read Article <ArrowRight size={14} className="text-accent1" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Coming Soon Message */}
            <div className="mt-32 text-center p-20 rounded-[3rem] border border-white/5 bg-white/[0.02]">
                <BookOpen size={48} className="mx-auto text-white/20 mb-6" />
                <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Writing things down...</h2>
                <p className="text-secondary text-sm max-w-sm mx-auto">
                    I'm currently working on some deep dives into engineering and product strategy. Check back soon!
                </p>
            </div>
        </section>
    );
};

export default BlogsPage;
