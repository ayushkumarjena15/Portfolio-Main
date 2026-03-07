import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Search, Moon, Home, User, Briefcase, FileText,
    Book, Monitor, Link2, Github, Linkedin, Twitter,
    Shield, FileSignature, Rocket, Activity, Leaf, Instagram
} from 'lucide-react';

const commands = [
    {
        category: 'PAGES',
        items: [
            { id: 'home', title: 'Home', subtitle: 'Go to homepage', icon: <Home size={16} strokeWidth={2} />, href: '/' },
            { id: 'about', title: 'About', subtitle: 'Learn more about me', icon: <User size={16} strokeWidth={2} />, href: '/about' },
            { id: 'projects', title: 'Projects', subtitle: 'View my work', icon: <Briefcase size={16} strokeWidth={2} />, href: '/projects' },
            { id: 'blog', title: 'Blog', subtitle: 'Read my thoughts', icon: <FileText size={16} strokeWidth={2} />, href: '/blogs' },
            { id: 'guestbook', title: 'Guestbook', subtitle: 'Leave a message', icon: <Book size={16} strokeWidth={2} />, href: '/guestbook' },
            { id: 'uses', title: 'Uses', subtitle: 'My tech stack', icon: <Monitor size={16} strokeWidth={2} />, href: '/uses' },
            { id: 'links', title: 'Links', subtitle: 'All my links', icon: <Link2 size={16} strokeWidth={2} />, href: '/links' },
        ]
    },
    {
        category: 'STARTUPS',
        items: [
            { id: 'skilltwin', title: 'SkillTwin', subtitle: 'AI-first career intelligence platform', icon: <Rocket size={16} strokeWidth={2} className="text-[#0ea5e9]" />, href: '/projects' },
            { id: 'dliver', title: 'D-Liver', subtitle: 'Intelligent healthcare platform', icon: <Activity size={16} strokeWidth={2} className="text-[#0ea5e9]" />, href: '/projects' },
            { id: 'agrinovation', title: 'Agri-Novation', subtitle: 'Agricultural intelligence dashboard', icon: <Leaf size={16} strokeWidth={2} className="text-[#0ea5e9]" />, href: '/projects' },
        ]
    },
    {
        category: 'CONNECT',
        items: [
            { id: 'github', title: 'GitHub', subtitle: '@ayushkumarjena15', icon: <Github size={16} strokeWidth={2} />, href: 'https://github.com/ayushkumarjena15', external: true },
            { id: 'linkedin', title: 'LinkedIn', subtitle: 'Professional network', icon: <Linkedin size={16} strokeWidth={2} />, href: 'https://www.linkedin.com/in/ayush-kumar-jena-b19151321/', external: true },
            { id: 'twitter', title: 'X (Twitter)', subtitle: '@AyushJena1504', icon: <Twitter size={16} strokeWidth={2} />, href: 'https://x.com/AyushJena1504', external: true },
            { id: 'instagram', title: 'Instagram', subtitle: '@ig_ayush099', icon: <Instagram size={16} strokeWidth={2} />, href: 'https://www.instagram.com/ig_ayush099/', external: true },
        ]
    },
    {
        category: 'LEGAL',
        items: [
            { id: 'privacy', title: 'Privacy Policy', subtitle: 'Data handling', icon: <Shield size={16} strokeWidth={2} />, href: '/privacy-policy' },
            { id: 'terms', title: 'Terms of Service', subtitle: 'Usage rules', icon: <FileSignature size={16} strokeWidth={2} />, href: '/terms-of-use' },
        ]
    }
];

const CommandPalette = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    // Flatten all items for keyboard navigation based on search
    const filteredGroups = commands.map(group => ({
        ...group,
        items: group.items.filter(item =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(group => group.items.length > 0);

    const flatItems = filteredGroups.flatMap(g => g.items);

    useEffect(() => {
        const handleToggle = () => setIsOpen(p => !p);
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(p => !p);
            }
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        window.addEventListener('toggle-command-palette', handleToggle);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('toggle-command-palette', handleToggle);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            setSearchQuery('');
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 100);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    useEffect(() => {
        setSelectedIndex(0);
    }, [searchQuery]);

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev < flatItems.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const selectedItem = flatItems[selectedIndex];
            if (selectedItem) {
                handleSelect(selectedItem);
            }
        }
    };

    const handleSelect = (item) => {
        setIsOpen(false);
        if (item.external) {
            window.open(item.href, '_blank');
        } else {
            navigate(item.href);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Palette Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="w-full max-w-[640px] bg-[#111111] rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden relative z-10"
                    >
                        {/* Search Header */}
                        <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
                            <Search size={20} className="text-[#a1a1aa] flex-shrink-0" />
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Type a command or search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="flex-1 bg-transparent text-white text-[15px] placeholder-[#a1a1aa] outline-none"
                            />
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <Moon size={18} className="text-[#a1a1aa]" />
                                <kbd className="hidden sm:inline-flex px-2 py-1 text-[10px] font-medium text-[#a1a1aa] bg-white/5 border border-white/10 rounded tracking-widest uppercase">
                                    ESC
                                </kbd>
                            </div>
                        </div>

                        {/* List Content */}
                        <div className="max-h-[360px] overflow-y-auto p-2 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            {flatItems.length === 0 ? (
                                <div className="p-8 text-center text-[#9ca3af] text-sm font-medium">
                                    No results found.
                                </div>
                            ) : (
                                filteredGroups.map((group, groupIndex) => {
                                    return (
                                        <div key={group.category} className="mb-4 last:mb-0">
                                            <div className="px-3 py-2 text-[11px] font-bold tracking-widest text-[#6b7280] uppercase">
                                                {group.category}
                                            </div>
                                            <div className="space-y-[2px]">
                                                {group.items.map((item) => {
                                                    const globalIndex = flatItems.findIndex(fItem => fItem.id === item.id);
                                                    const isSelected = globalIndex === selectedIndex;

                                                    return (
                                                        <div
                                                            key={item.id}
                                                            onClick={() => handleSelect(item)}
                                                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                                                            className={`flex items-center justify-between px-3 py-3 rounded-xl cursor-pointer transition-colors ${isSelected ? 'bg-white/[0.08]' : 'hover:bg-white/[0.04]'
                                                                }`}
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                <div className={`flex items-center justify-center text-[#a1a1aa] ${isSelected ? 'text-white' : ''}`}>
                                                                    {item.icon}
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className={`text-[15px] font-medium tracking-wide ${isSelected ? 'text-white' : 'text-[#d4d4d8]'}`}>
                                                                        {item.title}
                                                                    </span>
                                                                    <span className="text-[13px] text-[#71717a] tracking-wide mt-0.5">
                                                                        {item.subtitle}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            {isSelected && (
                                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#a1a1aa]">
                                                                    <polyline points="9 10 4 15 9 20" />
                                                                    <path d="M20 4v7a4 4 0 0 1-4 4H4" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Footer */}
                        <div className="bg-[#0a0a0a] border-t border-white/5 py-3 px-4 flex items-center justify-between text-[#71717a] text-[12px] font-medium tracking-wide">
                            <div className="flex items-center gap-4">
                                <span className="hover:text-[#a1a1aa] cursor-pointer transition-colors" onClick={() => handleSelect({ href: '/privacy-policy' })}>Privacy</span>
                                <span className="hover:text-[#a1a1aa] cursor-pointer transition-colors" onClick={() => handleSelect({ href: '/terms-of-use' })}>Terms</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1.5 hidden sm:flex">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M19 12l-7 7-7-7" /></svg>
                                    Navigate
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" /></svg>
                                    Open
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CommandPalette;
