import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { Pin, Heart, LogOut, Send, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4 } }
};

const SignatureCard = ({ name, created_at, message, is_pinned, liked_by, avatar_url }) => {
    const formattedDate = new Date(created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();

    return (
        <motion.div
            variants={itemVariants}
            className={`relative bg-[#0d0d0d] rounded-2xl p-6 flex flex-col h-full ${is_pinned ? 'border border-[#2563eb] shadow-[0_0_20px_rgba(37,99,235,0.15)] ring-1 ring-[#2563eb]/50' : 'border border-white/5 hover:border-white/10 transition-colors duration-300'}`}
        >
            {is_pinned && (
                <div className="absolute -top-3 -right-3 bg-[#2563eb] w-7 h-7 rounded-full flex items-center justify-center z-10 shadow-lg">
                    <Pin size={12} className="text-white fill-white" />
                </div>
            )}

            {/* Giant Quote mark in the background */}
            <div className="absolute top-2 right-4 text-white/[0.04] font-serif text-8xl leading-none italic pointer-events-none select-none">
                "
            </div>

            <div className="flex items-center gap-3 mb-4 relative z-10">
                <img
                    src={avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}&backgroundColor=transparent`}
                    alt={name}
                    className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-white/5 object-cover"
                />
                <div>
                    <h4 className="text-white font-bold text-sm">{name}</h4>
                    <p className="text-white/30 text-[10px] uppercase font-mono mt-0.5 tracking-wider">{formattedDate}</p>
                </div>
            </div>

            <p className="text-white/70 text-sm leading-relaxed flex-grow relative z-10 mb-2 whitespace-pre-wrap">
                {message}
            </p>

            {(is_pinned || liked_by) && (
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between relative z-10">
                    {is_pinned && (
                        <div className="flex items-center gap-2 text-[#2563eb]">
                            <Pin size={12} className="fill-[#2563eb]" />
                            <span className="text-xs font-bold">Pinned</span>
                        </div>
                    )}
                    {liked_by && !is_pinned && (
                        <div className="flex items-center justify-between w-full">
                            <span className="text-[#ec4899] text-[11px] italic font-medium">Liked by {liked_by}</span>
                            <Heart size={14} className="text-[#ec4899] fill-[#ec4899]" />
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
};

const GuestbookPage = () => {
    const [signatures, setSignatures] = useState([]);
    const [user, setUser] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingInitial, setIsLoadingInitial] = useState(true);

    const fetchSignatures = async () => {
        try {
            const { data, error } = await supabase
                .from('guestbook')
                .select('*')
                .order('is_pinned', { ascending: false })
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setSignatures(data);
        } catch (error) {
            console.error('Error fetching signatures:', error.message);
        } finally {
            setIsLoadingInitial(false);
        }
    };

    // Initial Fetch & Auth checking + Realtime Subscription
    useEffect(() => {
        fetchSignatures();

        // Subscription for Real-time database updates without refreshing
        const channel = supabase
            .channel('realtime_guestbook')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'guestbook' }, (payload) => {
                setSignatures((currentSignatures) => {
                    // Prevent duplicates
                    if (currentSignatures.some(sig => sig.id === payload.new.id)) return currentSignatures;

                    const newSignatures = [payload.new, ...currentSignatures];
                    // Re-sort to maintain pinned at top
                    return newSignatures.sort((a, b) => {
                        if (a.is_pinned === b.is_pinned) {
                            return new Date(b.created_at) - new Date(a.created_at);
                        }
                        return a.is_pinned ? -1 : 1;
                    });
                });
            })
            .subscribe();

        // Check current session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            subscription.unsubscribe();
            supabase.removeChannel(channel);
        };
    }, []);

    const handleLogin = async (provider) => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: provider,
                options: {
                    redirectTo: window.location.origin + '/guestbook'
                }
            });
            if (error) throw error;
        } catch (error) {
            console.error('Error logging in:', error.message);
        }
    };

    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut();
        } catch (error) {
            console.error('Error logging out:', error.message);
        }
    };

    const submitSignature = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !user || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const { error } = await supabase.from('guestbook').insert([
                {
                    user_id: user.id,
                    name: user.user_metadata.full_name || user.user_metadata.user_name || 'Anonymous',
                    avatar_url: user.user_metadata.avatar_url,
                    message: newMessage.trim(),
                    is_pinned: false
                }
            ]);

            if (error) throw error;
            setNewMessage('');
            fetchSignatures(); // Refresh the list
        } catch (error) {
            console.error('Error submitting signature:', error.message);
            alert("Oops! Failed to post your message. Make sure the database is set up.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="min-h-screen bg-background pt-32 pb-20 px-6 max-w-7xl mx-auto relative overflow-hidden">

            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col lg:flex-row justify-between items-start gap-16 lg:gap-12 pb-24"
            >
                <div className="flex-1 mt-8 lg:mt-16">
                    <p className="text-white/40 text-[11px] font-mono tracking-[0.3em] uppercase mb-8 pl-1">LEAVE YOUR SIGNATURE</p>
                    <h1 className="flex flex-col">
                        <span className="text-[clamp(4.5rem,10vw,8.5rem)] font-black leading-[0.85] tracking-tight uppercase text-white font-heading select-none">
                            GUEST
                        </span>
                        <span className="text-[clamp(4.5rem,10vw,8.5rem)] font-serif italic text-white/[0.35] leading-[0.85] tracking-tight pl-2 md:pl-6 -mt-3 select-none">
                            book
                        </span>
                    </h1>
                </div>

                {/* Interactive Login/Sign Panel */}
                <div className="w-full lg:w-[420px] bg-[#0a0a0a]/80 backdrop-blur-md border border-white/5 rounded-3xl p-8 md:p-10 flex-shrink-0 relative overflow-hidden transition-all h-full">
                    <AnimatePresence mode="wait">
                        {!user ? (
                            <motion.div
                                key="login-form"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex flex-col h-full"
                            >
                                <h2 className="text-3xl font-bold text-white mb-0.5 tracking-tight">Leave your</h2>
                                <h3 className="text-[2.5rem] font-serif italic text-white/50 mb-6">Signature!</h3>

                                <p className="text-white/50 text-[13px] mb-10 leading-relaxed max-w-[90%]">
                                    Sign in to leave your mark, customize your profile, and connect with other visitors.
                                </p>

                                <div className="flex flex-col gap-4">
                                    <button onClick={() => handleLogin('google')} className="w-full bg-white text-black py-3.5 rounded-full font-bold flex items-center justify-center gap-3 hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                                        <FcGoogle size={20} /> <span className="text-[15px]">Continue with Google</span>
                                    </button>
                                    <button onClick={() => handleLogin('github')} className="w-full bg-[#1a1a1a] border border-white/10 text-white py-3.5 rounded-full font-bold flex items-center justify-center gap-3 hover:bg-[#222] transition-colors">
                                        <FaGithub size={20} /> <span className="text-[15px]">Continue with GitHub</span>
                                    </button>
                                </div>

                                <p className="text-center text-white/30 text-[10px] mt-8 font-medium">
                                    By joining, you agree to our Terms of Service.
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="submit-form"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="flex flex-col h-full"
                            >
                                <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                                    <div className="flex items-center gap-3">
                                        <img src={user.user_metadata?.avatar_url} alt="Profile" className="w-10 h-10 rounded-full border border-white/10" />
                                        <div>
                                            <p className="text-white text-sm font-bold">{user.user_metadata?.full_name || user.user_metadata?.user_name || 'Signed In'}</p>
                                            <p className="text-white/40 text-[11px]">Ready to sign.</p>
                                        </div>
                                    </div>
                                    <button onClick={handleSignOut} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-red-400 text-white/60 transition-colors" title="Sign out">
                                        <LogOut size={14} />
                                    </button>
                                </div>

                                <form onSubmit={submitSignature} className="flex flex-col gap-4 flex-grow">
                                    <textarea
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="What's on your mind?..."
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 resize-none h-32 transition-all"
                                        maxLength={500}
                                        required
                                    />
                                    <div className="flex items-center justify-between px-1">
                                        <span className="text-[10px] font-mono text-white/30">{newMessage.length}/500</span>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting || !newMessage.trim()}
                                            className="bg-white text-black px-6 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                            Sign
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Divider */}
            <div className="flex items-center justify-center gap-6 mb-12">
                <div className="h-[1px] w-8 md:w-24 bg-white/5"></div>
                <p className="text-white/30 text-[10px] md:text-[11px] font-mono tracking-[0.25em] uppercase whitespace-nowrap">RECENT SIGNATURES</p>
                <div className="h-[1px] w-8 md:w-24 bg-white/5"></div>
            </div>

            {/* Masonry-like Grid for Signatures */}
            {isLoadingInitial ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
                    <Loader2 size={32} className="animate-spin text-white" />
                    <p className="text-white/40 text-sm font-mono tracking-widest uppercase">Fetching DB...</p>
                </div>
            ) : signatures.length === 0 ? (
                <div className="text-center py-20 text-white/40 text-sm">
                    No signatures yet. Be the first to leave one!
                </div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    {signatures.map((sig) => (
                        <SignatureCard key={sig.id} {...sig} />
                    ))}
                </motion.div>
            )}

        </section>
    );
};

export default GuestbookPage;
