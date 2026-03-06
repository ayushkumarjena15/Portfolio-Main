import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X, Command, Download, Link2, Monitor, Book, Sun, Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Work', href: '/projects' },
    { name: 'Blogs', href: '/blogs' },
    { name: 'More', href: '#', hasDropdown: true },
];

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const location = useLocation();
    const { scrollY } = useScroll();

    // Theme initialization and toggling
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
            setIsDarkMode(false);
            document.documentElement.classList.add('light');
        } else {
            setIsDarkMode(true);
            document.documentElement.classList.remove('light');
        }
    }, []);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        if (isDarkMode) {
            document.documentElement.classList.add('light');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.remove('light');
            localStorage.setItem('theme', 'dark');
        }
    };

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsVisible(true);
        setIsScrolled(latest > 20);
    });

    const isActive = (path) => location.pathname === path;

    return (
        <motion.nav
            initial={{ y: 0 }}
            animate={{ y: isVisible ? 0 : -100 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 left-0 right-0 z-50 pt-6 pb-4 pointer-events-none"
        >
            <div className={`max-w-7xl mx-auto px-6 flex ${isScrolled ? 'justify-center' : 'justify-between'} items-center pointer-events-auto`}>
                {/* Logo + Tagline */}
                <AnimatePresence>
                    {!isScrolled && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex items-center gap-3"
                        >
                            <Link to="/" className="z-10 flex items-center gap-3">
                                <span className="text-xl font-black text-white tracking-widest uppercase font-ethnocentric">AJ</span>
                                <div className="hidden sm:block border-l border-white/10 pl-3">
                                    <p className="text-[9px] font-bold text-secondary uppercase tracking-[0.2em]">Creative Engineer</p>
                                    <p className="text-[9px] font-bold text-accent1 uppercase tracking-[0.2em]">Building the Future</p>
                                </div>
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Floating Central Pill */}
                <div className={`hidden md:flex items-center gap-1 p-1.5 backdrop-blur-3xl border border-white/5 rounded-full shadow-2xl transition-all duration-500 ${isScrolled ? 'bg-background/80' : 'bg-background/40'}`}>
                    {navLinks.map((link) => (
                        <div key={link.name} className="relative group/navitem">
                            {link.hasDropdown ? (
                                <button
                                    onClick={() => setIsMoreOpen(!isMoreOpen)}
                                    className={`px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full transition-all duration-500 flex items-center gap-1 text-secondary hover:text-white ${isMoreOpen ? 'bg-white/10' : 'hover:bg-white/5'}`}
                                >
                                    {link.name}
                                    <motion.svg
                                        animate={{ rotate: isMoreOpen ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                        width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                                    >
                                        <polyline points="6 9 12 15 18 9" />
                                    </motion.svg>
                                </button>
                            ) : (
                                <Link
                                    to={link.href}
                                    className={`px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full transition-all duration-500 flex items-center gap-1 ${isActive(link.href)
                                        ? 'bg-white text-black'
                                        : 'text-secondary hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            )}

                            {link.hasDropdown && (
                                <AnimatePresence>
                                    {isMoreOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute top-full left-1/2 -translate-x-1/2 pt-4 z-50 origin-top"
                                        >
                                            <div className="w-[420px] bg-[#0c0a09] border border-white/5 rounded-[2rem] p-2 flex gap-2 shadow-2xl">
                                                {/* Labs Card */}
                                                <Link onClick={() => setIsMoreOpen(false)} to="/labs" className="w-[180px] bg-[#5a4fcf] rounded-3xl p-5 relative overflow-hidden group/labs flex flex-col justify-end min-h-[220px]">
                                                    <div className="absolute top-0 right-[-10%] opacity-20 group-hover/labs:scale-110 group-hover/labs:opacity-40 group-hover/labs:-rotate-12 transition-all duration-500">
                                                        <svg width="140" height="140" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v7.31" /><path d="M14 9.3V1.99" /><path d="M8.5 2h7" /><path d="M14 9.3a6.5 6.5 0 1 1-4 0" /><path d="M5.52 16h12.96" /></svg>
                                                    </div>
                                                    <div className="relative z-10">
                                                        <h3 className="text-xl font-bold text-white mb-2 font-heading tracking-tight">Labs</h3>
                                                        <p className="text-white/90 text-[11px] leading-relaxed">Experimental playground & fun micro-tools</p>
                                                    </div>
                                                </Link>

                                                {/* Right Links */}
                                                <div className="flex-1 flex flex-col gap-2 relative justify-center">
                                                    <Link onClick={() => setIsMoreOpen(false)} to="/links" className="flex items-center gap-4 p-3 rounded-[1.2rem] bg-[#151515] hover:bg-white/10 transition-colors group/link border border-transparent">
                                                        <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center group-hover/link:bg-black/60 transition-colors">
                                                            <Link2 size={16} className="text-white transition-colors" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-bold text-white font-heading leading-none mb-1">Links</h4>
                                                            <p className="text-[11px] text-secondary leading-none">Socials & Profiles</p>
                                                        </div>
                                                    </Link>

                                                    <Link onClick={() => setIsMoreOpen(false)} to="/uses" className="flex items-center gap-4 p-3 rounded-[1.2rem] bg-[#151515] hover:bg-white/10 transition-colors group/link border border-transparent">
                                                        <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center group-hover/link:bg-black/60 transition-colors">
                                                            <Monitor size={16} className="text-white transition-colors" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-bold text-white font-heading leading-none mb-1">Uses</h4>
                                                            <p className="text-[11px] text-secondary leading-none">My gear & software</p>
                                                        </div>
                                                    </Link>

                                                    <Link onClick={() => setIsMoreOpen(false)} to="/guestbook" className="flex items-center gap-4 p-3 rounded-[1.2rem] bg-[#151515] hover:bg-white/10 transition-colors group/link border border-transparent">
                                                        <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center group-hover/link:bg-black/60 transition-colors">
                                                            <Book size={16} className="text-white transition-colors" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-bold text-white font-heading leading-none mb-1">Guestbook</h4>
                                                            <p className="text-[11px] text-secondary leading-none">Sign my wall</p>
                                                        </div>
                                                    </Link>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            )}
                        </div>
                    ))}
                    <div className="w-px h-4 bg-white/10 mx-1" />
                    <a
                        href="/resume.pdf"
                        download
                        className="flex items-center gap-2 px-4 py-2 hover:bg-accent1/10 rounded-full transition-all cursor-pointer group"
                    >
                        <Download size={12} className="text-accent1 group-hover:text-white transition-colors" />
                        <span className="text-[10px] font-black uppercase text-accent1 group-hover:text-white tracking-widest transition-colors">Resume</span>
                    </a>
                    <Link to="/book" className="flex items-center gap-2 px-4 py-2 hover:bg-white/5 rounded-full transition-all cursor-pointer group">
                        <div className="w-4 h-4 rounded-full border border-white/20 group-hover:border-white transition-colors flex items-center justify-center">
                            <div className="w-1 h-1 bg-white rounded-full" />
                        </div>
                        <span className="text-[10px] font-black uppercase text-white tracking-widest">Book a Call</span>
                    </Link>
                </div>

                {/* Right Controls */}
                <AnimatePresence>
                    {!isScrolled && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="hidden md:flex items-center gap-3"
                        >
                            <button
                                onClick={toggleTheme}
                                className="w-9 h-9 border border-white/10 rounded-xl flex items-center justify-center text-secondary hover:text-white hover:border-white/30 transition-all"
                            >
                                {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
                            </button>
                            <button
                                onClick={() => window.dispatchEvent(new Event('toggle-command-palette'))}
                                className="w-9 h-9 border border-white/10 rounded-xl flex items-center justify-center text-secondary hover:text-white hover:border-white/30 transition-all"
                            >
                                <Command size={14} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden z-10 p-2 text-white"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Nav Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 bg-background/95 backdrop-blur-2xl z-40 flex flex-col items-center justify-center p-8 space-y-8"
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`text-3xl font-black uppercase tracking-widest ${isActive(link.href) ? 'text-accent1' : 'text-secondary'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="flex items-center gap-6 mt-4 border-t border-white/10 pt-8 w-full justify-center">
                            <a
                                href="/resume.pdf"
                                download
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-3 text-2xl font-black uppercase tracking-widest text-accent1"
                            >
                                <Download size={20} />
                                Resume
                            </a>
                            <div className="w-px h-8 bg-white/10" />
                            <button
                                onClick={() => { toggleTheme(); setIsMobileMenuOpen(false); }}
                                className="flex items-center gap-3 text-2xl font-black uppercase tracking-widest text-secondary hover:text-white transition-colors"
                            >
                                {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
