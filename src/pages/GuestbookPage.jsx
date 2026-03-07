import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { Pin, Heart, LogOut, Send, Loader2, X, Upload, EyeOff, Trash2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

const ADMIN_EMAILS = ['ahalyajena28@gmail.com', 'ahalyajena28@email.com'];
const ADMIN_GITHUB_HANDLES = ['ayushkumarjena15'];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4 } }
};

const SignatureCard = ({ id, name, created_at, message, is_pinned, liked_by, is_hidden, avatar_url, isAdmin, onTogglePin, onToggleLike, onToggleHide, onDelete }) => {
    const formattedDate = new Date(created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();

    return (
        <motion.div
            variants={itemVariants}
            className={`relative bg-[#0d0d0d] rounded-2xl p-6 flex flex-col h-full ${is_pinned ? 'border border-[#2563eb] shadow-[0_0_20px_rgba(37,99,235,0.15)] ring-1 ring-[#2563eb]/50' : 'border border-white/5 hover:border-white/10 transition-colors duration-300'} ${is_hidden ? 'opacity-50' : ''}`}
        >
            {is_pinned && (
                <div className="absolute -top-3 -right-3 bg-[#2563eb] w-7 h-7 rounded-full flex items-center justify-center z-10 shadow-lg">
                    <Pin size={12} className="text-white fill-white" />
                </div>
            )}

            <div className="absolute top-2 right-4 text-white/[0.04] font-serif text-8xl leading-none italic pointer-events-none select-none">
                "
            </div>

            <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-3">
                    <img
                        src={avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}&backgroundColor=transparent`}
                        alt={name}
                        className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-white/5 object-cover"
                    />
                    <div>
                        <h4 className="text-white font-bold text-sm">{name}</h4>
                        <p className="text-white/30 text-[10px] uppercase font-mono mt-0.5 tracking-wider">
                            {formattedDate}
                        </p>
                    </div>
                </div>
            </div>

            <p className="text-white/70 text-sm leading-relaxed flex-grow relative z-10 mb-2 whitespace-pre-wrap">
                {message}
            </p>

            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                    {is_pinned && (
                        <div className="flex items-center gap-2 text-[#2563eb]">
                            <Pin size={12} className="fill-[#2563eb]" />
                            <span className="text-xs font-bold whitespace-nowrap">Pinned</span>
                        </div>
                    )}
                    {liked_by && !is_pinned && (
                        <div className="flex items-center gap-2">
                            <Heart size={14} className="text-[#ec4899] fill-[#ec4899]" />
                            <span className="text-[#ec4899] text-[11px] italic font-medium whitespace-nowrap">Liked by {liked_by}</span>
                        </div>
                    )}
                    {is_hidden && (
                        <div className="flex items-center gap-2">
                            <EyeOff size={14} className="text-[#f59e0b]" />
                            <span className="text-[#f59e0b] text-[11px] italic font-medium whitespace-nowrap">Hidden</span>
                        </div>
                    )}
                </div>

                {isAdmin && (
                    <div className="flex items-center gap-1">
                        <button onClick={() => onToggleLike(id, !liked_by)} className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#ec4899]/20 hover:text-[#ec4899] transition-colors" title="Toggle Like">
                            <Heart size={14} className={liked_by ? "text-[#ec4899] fill-[#ec4899]" : "text-white/50"} />
                        </button>
                        <button onClick={() => onTogglePin(id, !is_pinned)} className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#2563eb]/20 hover:text-[#2563eb] transition-colors" title="Toggle Pin">
                            <Pin size={14} className={is_pinned ? "text-[#2563eb] fill-[#2563eb]" : "text-white/50"} />
                        </button>
                        <button onClick={() => onToggleHide(id, !is_hidden)} className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#f59e0b]/20 hover:text-[#f59e0b] transition-colors" title={is_hidden ? "Unhide" : "Hide"}>
                            <EyeOff size={14} className={is_hidden ? "text-[#f59e0b]" : "text-white/50"} />
                        </button>
                        <button onClick={() => { if (window.confirm('Are you sure you want to delete this message?')) onDelete(id); }} className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-500/20 hover:text-red-500 transition-colors" title="Delete">
                            <Trash2 size={14} className="text-white/50 hover:text-red-500" />
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

const GuestbookPage = () => {
    const [signatures, setSignatures] = useState([]);
    const [user, setUser] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingInitial, setIsLoadingInitial] = useState(true);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [profileData, setProfileData] = useState({ full_name: '', user_name: '' });
    const [isSavingProfile, setIsSavingProfile] = useState(false);

    // Admin features
    const isAdmin = user &&
        (ADMIN_EMAILS.includes(user.email) ||
            (user.app_metadata?.provider === 'github' && ADMIN_GITHUB_HANDLES.includes(user.user_metadata?.user_name)));

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

    useEffect(() => {
        fetchSignatures();

        const channel = supabase
            .channel('realtime_guestbook')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'guestbook' }, (payload) => {
                fetchSignatures(); // Simple refresh to handle pins/likes updates correctly
            })
            .subscribe();

        supabase.auth.getUser().then(({ data: { user }, error }) => {
            if (error || !user) {
                supabase.auth.signOut().catch(() => { });
                setUser(null);
            } else {
                setUser(user);
                setProfileData({
                    full_name: user.user_metadata?.full_name || user.user_metadata?.user_name || '',
                    user_name: user.user_metadata?.user_name || user.user_metadata?.preferred_username || ''
                });
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const user = session?.user ?? null;
            setUser(user);
            if (user) {
                setProfileData({
                    full_name: user.user_metadata?.full_name || user.user_metadata?.user_name || '',
                    user_name: user.user_metadata?.user_name || user.user_metadata?.preferred_username || ''
                });
            }
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
                options: { redirectTo: window.location.origin + '/guestbook' }
            });
            if (error) throw error;
        } catch (error) {
            console.error('Error logging in:', error.message);
        }
    };

    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut();
            setIsProfileModalOpen(false);
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
                    name: user.user_metadata?.full_name || user.user_metadata?.user_name || 'Anonymous',
                    avatar_url: user.user_metadata?.avatar_url,
                    message: newMessage.trim(),
                    is_pinned: false
                }
            ]);

            if (error) throw error;
            setNewMessage('');
            fetchSignatures();
        } catch (error) {
            console.error('Error submitting signature:', error.message);
            alert("Oops! Failed to post your message.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const saveProfile = async () => {
        setIsSavingProfile(true);
        try {
            const updates = {
                full_name: profileData.full_name,
                user_name: profileData.user_name,
            };
            const { data, error } = await supabase.auth.updateUser({
                data: updates
            });
            if (error) throw error;
            setUser(data.user);
            setIsProfileModalOpen(false);
        } catch (error) {
            console.error('Error updating profile:', error.message);
            alert("Failed to update profile.");
        } finally {
            setIsSavingProfile(false);
        }
    };

    const togglePin = async (id, isPinned) => {
        try {
            const { error } = await supabase.from('guestbook').update({ is_pinned: isPinned }).eq('id', id);
            if (error) throw error;
            fetchSignatures();
        } catch (e) {
            console.error(e);
        }
    };

    const toggleLike = async (id, isLiked) => {
        try {
            const liked_by = isLiked ? (user.user_metadata?.full_name || 'Ayush') : null;
            const { error } = await supabase.from('guestbook').update({ liked_by }).eq('id', id);
            if (error) throw error;
            fetchSignatures();
        } catch (e) {
            console.error(e);
        }
    };

    const toggleHide = async (id, isHidden) => {
        try {
            const { error } = await supabase.from('guestbook').update({ is_hidden: isHidden }).eq('id', id);
            if (error) throw error;
            fetchSignatures();
        } catch (e) {
            console.error('Error toggling hide:', e);
            alert("Oops! Make sure you have added the 'is_hidden' column to your Supabase schema.");
        }
    };

    const deleteSignature = async (id) => {
        try {
            const { error } = await supabase.from('guestbook').delete().eq('id', id);
            if (error) throw error;
            fetchSignatures();
        } catch (e) {
            console.error('Error deleting signature:', e);
        }
    };

    const visibleSignatures = signatures.filter(sig => isAdmin || !sig.is_hidden);

    const userNameDisplay = user?.user_metadata?.full_name || user?.user_metadata?.user_name || 'Guest';
    let userHandleDisplay = user?.user_metadata?.user_name || user?.user_metadata?.preferred_username || '';
    if (userHandleDisplay && !userHandleDisplay.startsWith('@')) {
        userHandleDisplay = `@${userHandleDisplay}`;
    }

    return (
        <section className="min-h-screen bg-background pt-32 pb-20 px-6 max-w-7xl mx-auto relative overflow-hidden">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className={`flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-12 pb-16 ${user ? 'lg:items-center' : ''}`}
            >
                <div className={!user ? "flex-1 mt-8 lg:mt-16" : ""}>
                    <p className="text-white/40 text-[11px] font-mono tracking-[0.3em] uppercase mb-6 pl-1">LEAVE YOUR SIGNATURE</p>
                    <h1 className="flex flex-col">
                        <span className="text-[clamp(4.5rem,8vw,8rem)] font-black leading-[0.85] tracking-tight uppercase text-white font-heading select-none">
                            GUEST
                        </span>
                        <span className="text-[clamp(4.5rem,8vw,8rem)] font-serif italic text-white/[0.35] leading-[0.85] tracking-tight pl-2 md:pl-6 -mt-3 select-none">
                            book
                        </span>
                    </h1>
                </div>

                {!user ? (
                    <div className="w-full lg:w-[420px] bg-[#0a0a0a]/80 backdrop-blur-md border border-white/5 rounded-[2rem] p-8 flex-shrink-0 relative overflow-hidden transition-all">
                        <div className="flex flex-col h-full">
                            <h2 className="text-3xl font-bold text-white mb-0.5 tracking-tight">Leave your</h2>
                            <h3 className="text-[2.5rem] font-serif italic text-[#a1a1aa] mb-6 tracking-tight">Signature!</h3>

                            <p className="text-[#a1a1aa] text-[15px] mb-10 leading-relaxed font-medium">
                                Sign in to leave your mark, customize your profile, and connect with other visitors.
                            </p>

                            <div className="flex flex-col gap-4">
                                <button onClick={() => handleLogin('google')} className="w-full bg-white text-black py-4 rounded-full font-bold flex items-center justify-center gap-3 hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                                    <FcGoogle size={20} /> <span className="text-[15px] font-black tracking-wide">Continue with Google</span>
                                </button>
                                <button onClick={() => handleLogin('github')} className="w-full bg-[#1a1a1a] border border-white/10 text-white py-4 rounded-full font-bold flex items-center justify-center gap-3 hover:bg-[#222] transition-colors">
                                    <FaGithub size={20} /> <span className="text-[15px] font-black tracking-wide">Continue with GitHub</span>
                                </button>
                            </div>

                            <p className="text-center text-[#52525b] text-[12px] mt-8 font-bold">
                                By joining, you agree to our Terms of Service.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div
                        onClick={() => setIsProfileModalOpen(true)}
                        className="flex flex-row items-center gap-4 bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-2 pr-6 cursor-pointer hover:border-white/30 transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                    >
                        <img src={user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}&backgroundColor=transparent`} alt="Profile" className="w-12 h-12 rounded-full border border-white/10" />
                        <div>
                            <p className="text-white text-lg font-bold whitespace-nowrap leading-tight tracking-tight">Hello {userNameDisplay}!</p>
                            {userHandleDisplay && <p className="text-[#3b82f6] text-sm leading-tight tracking-wide">{userHandleDisplay}</p>}
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Input Form Section */}
            {user && (
                <div className="w-full max-w-3xl mx-auto bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 relative overflow-hidden transition-all mb-16 shadow-[0_0_30px_rgba(255,255,255,0.02)]">
                    <form onSubmit={submitSignature} className="flex flex-col">
                        <div className="flex items-start gap-4 mb-4">
                            <img src={user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}&backgroundColor=transparent`} alt="Profile" className="w-10 h-10 rounded-full mt-2 border border-white/5 object-cover" />
                            <textarea
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Leave a message for Ayush, @ayushkumarjena15..."
                                className="w-full bg-transparent border-none text-white text-[15px] md:text-base font-medium placeholder:text-[#52525b] focus:outline-none focus:ring-0 resize-none h-24 pt-2"
                                maxLength={500}
                                required
                            />
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-4 pl-14">
                            <span className="text-[11px] font-mono text-[#52525b] font-semibold">{newMessage.length}/500</span>
                            <button
                                type="submit"
                                disabled={isSubmitting || !newMessage.trim()}
                                className="bg-[#1a1a1a] border border-white/10 text-white/80 px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Sign Guestbook {isSubmitting ? <Loader2 size={14} className="animate-spin ml-1" /> : <Send size={14} className="ml-1" />}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Content Divider */}
            <div className="flex items-center gap-6 mb-12">
                <div className="h-[1px] flex-1 bg-white/5"></div>
                <p className="text-white/30 text-[10px] md:text-[11px] font-mono tracking-[0.25em] uppercase whitespace-nowrap">RECENT SIGNATURES</p>
                <div className="h-[1px] flex-1 bg-white/5"></div>
            </div>

            {/* Grid */}
            {isLoadingInitial ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
                    <Loader2 size={32} className="animate-spin text-white" />
                    <p className="text-white/40 text-sm font-mono tracking-widest uppercase">Fetching DB...</p>
                </div>
            ) : visibleSignatures.length === 0 ? (
                <div className="text-center py-20 text-white/40 text-sm font-medium">
                    No signatures yet. Be the first to leave one!
                </div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max"
                >
                    {visibleSignatures.map((sig) => (
                        <SignatureCard
                            key={sig.id}
                            {...sig}
                            isAdmin={isAdmin}
                            onTogglePin={togglePin}
                            onToggleLike={toggleLike}
                            onToggleHide={toggleHide}
                            onDelete={deleteSignature}
                        />
                    ))}
                </motion.div>
            )}

            {/* Edit Profile Modal */}
            <AnimatePresence>
                {isProfileModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="bg-[#0a0a0a] border border-white/10 w-full max-w-[400px] rounded-[2rem] p-8 relative shadow-2xl"
                        >
                            <button
                                onClick={() => setIsProfileModalOpen(false)}
                                className="absolute top-6 right-6 w-8 h-8 flex flex-col items-center justify-center bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                            >
                                <X size={14} className="text-white/60" />
                            </button>

                            {/* Avatar Section */}
                            <div className="flex flex-col items-center mb-10 mt-2">
                                <div className="relative group cursor-pointer w-[120px] h-[120px] rounded-full border border-dashed border-white/20 flex items-center justify-center overflow-hidden hover:border-white/40 transition-colors">
                                    <div className="absolute inset-0 bg-[#1a1a1a]"></div>
                                    <img
                                        src={user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}&backgroundColor=transparent`}
                                        alt="Profile"
                                        className="absolute inset-0 w-full h-full object-cover rounded-full group-hover:opacity-30 transition-opacity"
                                    />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Upload size={20} className="text-white mb-2" />
                                    </div>
                                </div>
                                <p className="text-white/40 text-[11px] mt-4 font-medium tracking-wide">Drag & drop or click to upload</p>
                            </div>

                            {/* Inputs */}
                            <div className="flex flex-col gap-6 mb-10">
                                <div className="flex flex-col gap-2">
                                    <label className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] pl-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={profileData.full_name}
                                        onChange={(e) => setProfileData(p => ({ ...p, full_name: e.target.value }))}
                                        className="bg-[#141414] border border-white/5 rounded-2xl px-5 py-4 text-white text-[15px] font-bold focus:outline-none focus:border-white/20 transition-colors"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] pl-1">Username</label>
                                    <div className="relative">
                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 text-[15px] font-bold">@</span>
                                        <input
                                            type="text"
                                            value={profileData.user_name}
                                            onChange={(e) => setProfileData(p => ({ ...p, user_name: e.target.value.replace('@', '') }))}
                                            className="w-full bg-[#141414] border border-white/5 rounded-2xl pl-10 pr-5 py-4 text-white text-[15px] font-bold focus:outline-none focus:border-white/20 transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <button
                                    onClick={handleSignOut}
                                    className="flex w-[120px] items-center justify-center gap-2 py-4 rounded-2xl border border-[#ff4545]/20 bg-[#ff4545]/5 text-[#ff4545] hover:bg-[#ff4545]/10 transition-colors font-bold text-[13px]"
                                >
                                    <LogOut size={16} /> Log Out
                                </button>
                                <button
                                    onClick={saveProfile}
                                    disabled={isSavingProfile}
                                    className="flex-1 bg-white/60 hover:bg-white text-black py-4 rounded-2xl font-bold text-[14px] transition-colors flex items-center justify-center"
                                >
                                    {isSavingProfile ? <Loader2 size={18} className="animate-spin" /> : 'Save Changes'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default GuestbookPage;
