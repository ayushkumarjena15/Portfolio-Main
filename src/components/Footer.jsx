import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Instagram, Send } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="w-full pt-16 pb-12 px-4 sm:px-6 lg:px-8 relative z-10 border-t border-white/5">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 py-12">
                    {/* Brand Column */}
                    <div className="lg:col-span-4 space-y-8">
                        <Link to="/" className="text-[40px] font-black text-white tracking-tight uppercase font-heading block leading-none">
                            AYUSH
                        </Link>
                        <p className="text-[#9ca3af] text-[15px] leading-[1.8] max-w-sm font-serif italic">
                            Building digital experiences that matter, one line of code at a time.
                            Crafting interfaces that feel alive, solving problems that make a difference,
                            and turning ideas into reality. Every pixel has a purpose. Every interaction tells a story.
                        </p>
                    </div>

                    {/* Navigation Columns */}
                    <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8 md:gap-4 lg:ml-12 pt-2 lg:pt-0">
                        <div className="space-y-6">
                            <h4 className="text-[18px] md:text-[20px] font-serif italic text-white tracking-wide">General</h4>
                            <ul className="space-y-4 text-[#9ca3af] text-[15px] font-sans">
                                <li className="hover:text-accent1 transition-colors cursor-pointer block">
                                    <Link to="/">Home</Link>
                                </li>
                                <li className="hover:text-accent1 transition-colors cursor-pointer block">
                                    <Link to="/blogs">Blogs</Link>
                                </li>
                                <li className="hover:text-accent1 transition-colors cursor-pointer block">
                                    <Link to="/guestbook">Guestbook</Link>
                                </li>
                                <li className="hover:text-accent1 transition-colors cursor-pointer block">
                                    <Link to="/uses">Uses</Link>
                                </li>
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h4 className="text-[18px] md:text-[20px] font-serif italic text-white tracking-wide">About</h4>
                            <ul className="space-y-4 text-[#9ca3af] text-[15px] font-sans">
                                <li className="hover:text-accent1 transition-colors cursor-pointer block">
                                    <Link to="/about">About Me</Link>
                                </li>
                                <li className="hover:text-accent1 transition-colors cursor-pointer block">
                                    <Link to="/projects">Projects</Link>
                                </li>
                                <li className="hover:text-accent1 transition-colors cursor-pointer block">
                                    <Link to="/book">Contact</Link>
                                </li>
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h4 className="text-[18px] md:text-[20px] font-serif italic text-white tracking-wide">Startup</h4>
                            <ul className="space-y-4 text-[#9ca3af] text-[15px] font-sans">
                                <li className="hover:text-accent1 transition-colors cursor-pointer block">
                                    <Link to="/projects">SkillTwin</Link>
                                </li>
                                <li className="hover:text-accent1 transition-colors cursor-pointer block">
                                    <Link to="/projects">D-Liver</Link>
                                </li>
                                <li className="hover:text-accent1 transition-colors cursor-pointer block">
                                    <Link to="/projects">Agri-Novation</Link>
                                </li>
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h4 className="text-[18px] md:text-[20px] font-serif italic text-white tracking-wide">Legal</h4>
                            <ul className="space-y-4 text-[#9ca3af] text-[15px] font-sans">
                                <li className="hover:text-accent1 transition-colors cursor-pointer block">
                                    <Link to="/privacy-policy">Privacy Policy</Link>
                                </li>
                                <li className="hover:text-accent1 transition-colors cursor-pointer block">
                                    <Link to="/terms-of-use">Terms & Conditions</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-white/5">
                    <p className="text-xs text-secondary">
                        © {new Date().getFullYear()} Ayush Kumar Jena. All Rights Reserved.
                    </p>

                    <div className="flex items-center gap-5">
                        <a href="https://github.com/ayushkumarjena15" target="_blank" rel="noopener noreferrer">
                            <Github size={16} className="text-secondary hover:text-white transition-colors cursor-pointer" />
                        </a>
                        <a href="https://www.linkedin.com/in/ayush-kumar-jena-b19151321/" target="_blank" rel="noopener noreferrer">
                            <Linkedin size={16} className="text-secondary hover:text-white transition-colors cursor-pointer" />
                        </a>
                        <a href="https://x.com/AyushJena1504" target="_blank" rel="noopener noreferrer">
                            <Twitter size={16} className="text-secondary hover:text-white transition-colors cursor-pointer" />
                        </a>
                        <Send size={16} className="text-secondary hover:text-white transition-colors cursor-pointer" />
                        <a href="https://www.instagram.com/ig_ayush099/" target="_blank" rel="noopener noreferrer">
                            <Instagram size={16} className="text-secondary hover:text-white transition-colors cursor-pointer" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
