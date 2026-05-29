import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import TopNavigation from '../components/TopNavigation';
import {
    Search, BookOpen, Star, ShieldCheck, MapPin,
    ChevronRight, Calculator, FlaskConical, Atom, Languages,
    Activity, Music, Briefcase, GraduationCap, ArrowRight, PlayCircle,
    Terminal, Microscope, FileSpreadsheet, TrendingUp, Landmark, Map,
    Scale, Database, Cpu, Layout, Mic, Crown, MessageCircle,
    Users, CheckCircle2, Clock, Mail, Phone, ChevronDown, CheckCircle, MonitorPlay,
    User, Headset, Compass, ChevronLeft, Filter, SlidersHorizontal, Heart, Video,
    Share2, ArrowLeft, PlusCircle, Settings, Bell, BookMarked, Calendar, CheckSquare
} from 'lucide-react';

// Custom Hook for Scroll Reveal Animation
const useScrollReveal = () => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const currentRef = ref.current;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(currentRef);
                }
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        if (currentRef) observer.observe(currentRef);
        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, []);

    return [ref, isVisible];
};

// Reusable Reveal Component
const RevealBlock = ({ children, delay = '' }) => {
    const [ref, isVisible] = useScrollReveal();
    return (
        <div
            ref={ref}
            className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                } ${delay}`}
        >
            {children}
        </div>
    );
};

// Component for the moving review cards
const ReviewCard = ({ title, content, author, lessons, subject, img, bg, border, text, tag }) => (
    <div className={`w-[420px] flex-shrink-0 rounded-3xl p-7 flex gap-5 border-2 ${bg} ${border} shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300`}>
        <img src={img} alt={author} className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md shrink-0 bg-white" />
        <div>
            <h4 className={`font-black text-sm mb-3 flex items-start gap-2 uppercase tracking-wider ${text} drop-shadow-sm leading-tight`}>
                <span className="text-4xl leading-none -mt-3 shrink-0">&ldquo;</span> <span className="pt-1">{title}</span>
            </h4>
            <p className="text-slate-700 text-[15px] leading-relaxed mb-5 font-medium">
                {content}
            </p>
            <div className="text-xs text-slate-500 mb-1 font-semibold tracking-wide">{author}, {lessons}</div>
            <div className={`text-[13px] font-black tracking-wide ${tag} drop-shadow-sm`}>{subject}</div>
        </div>
    </div>
);

const HomePage = () => {
    const { isAuthenticated, role } = useAuth();
    const navigate = useNavigate();

    const authNavigate = (path) => {
        if (isAuthenticated) {
            navigate(path);
        } else {
            navigate('/login', { state: { from: path } });
        }
    };
    const [activeFaq, setActiveFaq] = useState(1);
    const faqScrollRef = useRef(null);

    const faqs = [
        {
            q: "What makes GharPeGyan different from other tutoring solutions?",
            a: "We handpick our educators through a rigorous 4-step verification process. Our focus is on pairing your child's specific learning style with the right pedagogical approach, ensuring actual comprehension rather than just rote memorization."
        },
        {
            q: "Does GharPeGyan offer custom design solutions for unique academic needs?",
            a: "Yes, GharPeGyan provides tailored learning roadmaps to meet specific academic, competitive, and developmental requirements, ensuring both conceptual clarity and functional excellence in exams."
        },
        {
            q: "How does GharPeGyan ensure safety and quality in its home sessions?",
            a: "All home tutors undergo background checks and carry verifiable ID. We also gather regular feedback and monitor academic progress through our platform to guarantee the highest standard of safety and quality."
        },
        {
            q: "What if my child doesn't connect well with the assigned tutor?",
            a: "We offer a hassle-free replacement policy. If the initial match isn't perfect, we will assign a new educator at no additional cost until you are completely satisfied with the teaching style."
        },
        {
            q: "Are the initial demo classes genuinely free of charge?",
            a: "Absolutely. The first session with any new tutor is completely free. It serves as an ice-breaker to assess compatibility before you commit to any paid sessions."
        }
    ];

    return (
        <div className="min-h-screen font-sans bg-[#FCFBFA] text-slate-800 overflow-x-hidden">

            {/* HEADER — Uses shared TopNavigation for consistent auth-aware header */}
            <TopNavigation />

            {/* HERO SECTION */}
            <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 bg-[#F8FAFC] overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-50/60 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">

                        <div className="space-y-8 max-w-2xl">
                            <h1 className="font-sans text-5xl lg:text-[4.5rem] text-slate-900 leading-[1.08] font-bold tracking-tight">
                                Find a teacher<br />
                                your child<br />
                                <span className="text-indigo-600">learns best</span> with.
                            </h1>
                            <p className="text-lg lg:text-xl text-slate-600 leading-relaxed font-medium max-w-lg">
                                Trusted tutors for every subject, class, and goal.<br />
                                Book a demo and find the perfect match.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                                {(!role || role === 'parent') && (
                                    <>
                                        <button onClick={() => authNavigate('/search')} className="w-full sm:w-auto bg-[#0b5ed7] text-white px-8 py-4 rounded-lg font-semibold text-base hover:bg-blue-700 transition-all shadow-[0_8px_20px_rgba(11,94,215,0.3)] flex items-center justify-center gap-2">
                                            Find a Teacher <ArrowRight size={18} />
                                        </button>
                                        <button onClick={() => authNavigate('/parent/post-requirement')} className="w-full sm:w-auto bg-white text-slate-800 border border-slate-200 px-8 py-4 rounded-full font-semibold text-base hover:bg-slate-50 transition-colors shadow-[0_4px_12px_rgba(0,0,0,0.03)] flex items-center justify-center gap-2">
                                            Post Tuition Requirement <ArrowRight size={18} className="text-slate-400" />
                                        </button>
                                    </>
                                )}
                                {role === 'tutor' && (
                                    <button onClick={() => navigate('/tutor/dashboard')} className="w-full sm:w-auto bg-[#0b5ed7] text-white px-8 py-4 rounded-lg font-semibold text-base hover:bg-blue-700 transition-all shadow-[0_8px_20px_rgba(11,94,215,0.3)] flex items-center justify-center gap-2">
                                        Go to Dashboard <ArrowRight size={18} />
                                    </button>
                                )}
                                {role === 'admin' && (
                                    <button onClick={() => navigate('/admin/dashboard')} className="w-full sm:w-auto bg-slate-900 text-white px-8 py-4 rounded-lg font-semibold text-base hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2">
                                        Go to Admin Panel <ArrowRight size={18} />
                                    </button>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-8 pt-6">
                                <span className="inline-flex items-center gap-2 text-slate-600 text-[15px] font-semibold">
                                    <ShieldCheck size={22} className="text-indigo-600" /> Verified Profiles
                                </span>
                                <span className="inline-flex items-center gap-2 text-slate-600 text-[15px] font-semibold">
                                    <PlayCircle size={22} className="text-indigo-600" /> Demo Available
                                </span>
                                <span className="inline-flex items-center gap-2 text-slate-600 text-[15px] font-semibold">
                                    <Headset size={22} className="text-indigo-600" /> Human Support
                                </span>
                            </div>
                        </div>

                        <div className="relative flex justify-center lg:justify-end mt-10 lg:mt-0">
                            <img
                                src="https://i.ibb.co/JjLhj8vk/Chat-GPT-Image-May-22-2026-06-37-33-PM.png"
                                alt="Student learning online"
                                className="w-[120%] lg:w-[130%] max-w-none object-contain lg:translate-x-12"
                            />
                        </div>

                    </div>
                </div>
            </section>

            {/* QUICK SEARCH STRIP */}
            <section className="relative z-20 -mt-10 lg:-mt-16 max-w-[1300px] mx-auto px-4 mb-20">
                <div className="bg-white rounded-2xl md:rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col md:flex-row items-center p-2 md:p-3 gap-2 md:gap-0">

                    <div className="flex-1 flex items-center gap-3 px-6 py-3 w-full md:border-r border-slate-200">
                        <Search className="text-indigo-600 shrink-0" size={20} />
                        <input type="text" placeholder="What do you need help with?" className="w-full bg-transparent outline-none text-slate-700 placeholder:text-slate-400 font-medium text-[15px]" />
                    </div>

                    <div className="flex-1 flex items-center gap-3 px-6 py-3 w-full md:border-r border-slate-200">
                        <BookOpen className="text-indigo-600 shrink-0" size={20} />
                        <select defaultValue="" className="w-full bg-transparent outline-none text-slate-700 font-medium text-[15px] cursor-pointer appearance-none">
                            <option value="" disabled>Select Subject</option>
                            <option>Mathematics</option>
                            <option>Science</option>
                            <option>English</option>
                        </select>
                        <ChevronDown size={16} className="text-slate-400 shrink-0" />
                    </div>

                    <div className="flex-1 flex items-center gap-3 px-6 py-3 w-full md:border-r border-slate-200">
                        <MapPin className="text-indigo-600 shrink-0" size={20} />
                        <select defaultValue="" className="w-full bg-transparent outline-none text-slate-700 font-medium text-[15px] cursor-pointer appearance-none">
                            <option value="" disabled>Enter City</option>
                            <option>Delhi</option>
                            <option>Mumbai</option>
                            <option>Pune</option>
                        </select>
                        <ChevronDown size={16} className="text-slate-400 shrink-0" />
                    </div>

                    <div className="flex-1 flex items-center gap-3 px-6 py-3 w-full">
                        <MonitorPlay className="text-indigo-600 shrink-0" size={20} />
                        <select defaultValue="" className="w-full bg-transparent outline-none text-slate-700 font-medium text-[15px] cursor-pointer appearance-none">
                            <option value="" disabled>Online / Home Tutor</option>
                            <option>Online</option>
                            <option>Home Tutor</option>
                        </select>
                        <ChevronDown size={16} className="text-slate-400 shrink-0" />
                    </div>

                    <button onClick={() => authNavigate('/search')} className="w-full md:w-16 h-14 md:rounded-full rounded-xl bg-[#0b5ed7] text-white flex items-center justify-center shrink-0 shadow-lg hover:bg-blue-700 transition-all group">
                        <Search size={22} className="group-hover:scale-110 transition-transform" />
                        <span className="md:hidden ml-2 font-semibold">Search</span>
                    </button>

                </div>
            </section>

            {/* CATEGORY SELECTOR - MOVES TO SEARCH WITH SUBJECT */}
            <RevealBlock>
                <section className="py-16 w-full bg-white border-b border-slate-100 shadow-sm overflow-hidden">
                    <div className="text-center mb-12 md:mb-16 px-4">
                        <h2 className="font-serif text-3xl md:text-4xl font-semibold text-slate-900 drop-shadow-sm mb-4">Explore Top Subjects</h2>
                    </div>
                    <div className="flex items-center gap-6 overflow-x-auto hide-scrollbar px-4 sm:px-8 lg:px-12 pb-8 w-full">
                        {[
                            { name: 'Mathematics', icon: <Calculator size={32} strokeWidth={1.5} />, color: 'text-blue-600', bg: 'bg-white', border: 'border-blue-100' },
                            { name: 'Science', icon: <FlaskConical size={32} strokeWidth={1.5} />, color: 'text-emerald-600', bg: 'bg-white', border: 'border-emerald-100' },
                            { name: 'English', icon: <Languages size={32} strokeWidth={1.5} />, color: 'text-orange-600', bg: 'bg-white', border: 'border-orange-100' },
                            { name: 'Physics', icon: <Atom size={32} strokeWidth={1.5} />, color: 'text-purple-600', bg: 'bg-white', border: 'border-purple-100' },
                            { name: 'Chemistry', icon: <Microscope size={32} strokeWidth={1.5} />, color: 'text-rose-600', bg: 'bg-white', border: 'border-rose-100' },
                            { name: 'Accounts', icon: <FileSpreadsheet size={32} strokeWidth={1.5} />, color: 'text-teal-600', bg: 'bg-white', border: 'border-teal-100' },
                            { name: 'Coding', icon: <Terminal size={32} strokeWidth={1.5} />, color: 'text-indigo-600', bg: 'bg-white', border: 'border-indigo-100' },
                            { name: 'Speaking', icon: <Mic size={32} strokeWidth={1.5} />, color: 'text-pink-600', bg: 'bg-white', border: 'border-pink-100' },
                            { name: 'Business', icon: <Briefcase size={32} strokeWidth={1.5} />, color: 'text-cyan-600', bg: 'bg-white', border: 'border-cyan-100' },
                            { name: 'Guitar', icon: <Music size={32} strokeWidth={1.5} />, color: 'text-amber-600', bg: 'bg-white', border: 'border-amber-100' },
                        ].map((cat, idx) => (
                            <button
                                key={idx}
                                onClick={() => authNavigate(`/search?subject=${encodeURIComponent(cat.name)}`)}
                                className={`flex flex-col items-center justify-center w-[140px] h-[140px] rounded-full border-2 ${cat.bg} ${cat.border} shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-2 hover:shadow-[0_16px_32px_rgba(0,0,0,0.12)] transition-all duration-300 shrink-0 group`}
                            >
                                <div className={`${cat.color} mb-3 group-hover:scale-110 transition-transform drop-shadow-sm`}>{cat.icon}</div>
                                <span className={`text-[15px] font-bold text-slate-700 group-hover:${cat.color} transition-colors`}>{cat.name}</span>
                            </button>
                        ))}
                    </div>
                </section>
            </RevealBlock>

            {/* TEACHER DISCOVERY */}
            <RevealBlock>
                <section className="py-20 w-full bg-[#F0F4F8] border-b border-slate-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 max-w-6xl mx-auto gap-4">
                            <div>
                                <h2 className="font-serif text-3xl md:text-4xl font-semibold text-slate-900 mb-3 drop-shadow-sm">Teachers You Can Trust Nearby</h2>
                                <p className="text-slate-500 text-base md:text-lg">Browse verified educators available for home or online sessions.</p>
                            </div>
                            <button onClick={() => authNavigate('/search')} className="flex items-center gap-2 text-indigo-600 font-medium text-sm hover:underline drop-shadow-sm whitespace-nowrap">
                                View All Tutors <ArrowRight size={16} />
                            </button>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {[
                                { name: "Anjali Sharma", sub: "Mathematics", rate: "₹600/hr", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80", mode: "Online & Home", city: "Mumbai", reviews: 24, intro: "Specializing in CBSE board exams." },
                                { name: "Sneha Gupta", sub: "English Literature", rate: "₹400/hr", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80", mode: "Home Tutor", city: "Bangalore", reviews: 42, intro: "Helping students improve reading & writing." },
                                { name: "Rahul Sharma", sub: "Computer Science", rate: "₹800/hr", img: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=200&h=200&q=80", mode: "Online & Home", city: "Pune", reviews: 15, intro: "Teaching Python and Java from scratch." },
                            ].map((tutor, i) => (
                                <div key={i} className="bg-white rounded-[1.5rem] p-6 shadow-[0_12px_32px_rgba(0,0,0,0.08)] border border-slate-100 hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all flex flex-col h-full">
                                    <div className="flex gap-4 mb-4">
                                        <img src={tutor.img} alt={tutor.name} className="w-16 h-16 object-cover rounded-full border-2 border-slate-50 shadow-md shrink-0" />
                                        <div>
                                            <h3 className="font-serif text-lg font-medium text-slate-900 flex items-center gap-1.5 drop-shadow-sm">
                                                {tutor.name} <CheckCircle2 size={14} className="text-emerald-500" />
                                            </h3>
                                            <div className="flex items-center gap-1 text-sm text-slate-600 mt-0.5">
                                                <Star size={12} className="text-amber-400 fill-amber-400 drop-shadow-sm" />
                                                <span className="font-bold">4.9</span>
                                                <span className="text-slate-400">({tutor.reviews} reviews)</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-4 grow">
                                        <p className="text-slate-700 text-sm flex items-center gap-2 font-medium"><BookOpen size={14} className="text-indigo-400" /> {tutor.sub}</p>
                                        <p className="text-slate-500 text-sm flex items-center gap-2"><MapPin size={14} className="text-rose-400" /> {tutor.city} • {tutor.mode}</p>
                                        <p className="text-slate-600 text-sm italic mt-3 bg-slate-50 p-3 rounded-xl border border-slate-100 shadow-inner">"{tutor.intro}"</p>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                                        <span className="font-bold text-slate-900 text-lg">{tutor.rate}</span>
                                        <button onClick={() => authNavigate('/search')} className="text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-600 hover:text-white transition-colors shadow-sm">
                                            View Profile
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </RevealBlock>

            {/* REVIEWS SECTION */}
            <RevealBlock>
                <section className="py-24 bg-white border-y border-slate-200 shadow-[inset_0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden">
                    <div className="text-center max-w-2xl mx-auto mb-16 px-4">
                        <h2 className="font-serif text-4xl font-bold text-slate-900 mb-4 drop-shadow-sm">Your next great tutor</h2>
                        <p className="text-slate-600 text-lg">Enjoy one-on-one instruction from the nation's biggest network of independent experts.</p>
                    </div>

                    <div className="marquee-container mb-8">
                        <div className="marquee-content gap-6 px-3">
                            {[1, 2, 3, 4].map((set) => (
                                <React.Fragment key={`set1-${set}`}>
                                    <ReviewCard
                                        bg="bg-blue-50" border="border-blue-100" text="text-blue-900" tag="text-blue-600"
                                        title="AMAZING TUTOR"
                                        content="Tiffany has exceeded our expectations. She is knowledgeable, patient, and fun. All the lessons are thoughtfully prepared. And she has such a great personality!"
                                        author="Joanna" lessons="16 lessons with Tiffany" subject="Elementary Reading Tutor"
                                        img="https://images.unsplash.com/photo-1531123897727-8f129e1bf98c?auto=format&fit=crop&w=100&h=100&q=80"
                                    />
                                    <ReviewCard
                                        bg="bg-orange-50" border="border-orange-100" text="text-orange-900" tag="text-orange-600"
                                        title="The Best of the Best!"
                                        content="Every lesson has been fresh and exciting, setting me up for significant progress every time. Finally, and most importantly, Rashida has helped me to love MY voice."
                                        author="Danielle" lessons="19 lessons with Rashida" subject="Voice Tutor"
                                        img="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&h=100&q=80"
                                    />
                                    <ReviewCard
                                        bg="bg-emerald-50" border="border-emerald-100" text="text-emerald-900" tag="text-emerald-600"
                                        title="Incredible progress"
                                        content="My son was struggling with algebra, but after just a few weeks with Danny, his confidence and grades have improved dramatically. Highly recommended!"
                                        author="Sarah" lessons="8 lessons with Danny" subject="Mathematics Tutor"
                                        img="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&h=100&q=80"
                                    />
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    <div className="marquee-container">
                        <div className="marquee-content-reverse gap-6 px-3">
                            {[1, 2, 3, 4].map((set) => (
                                <React.Fragment key={`set2-${set}`}>
                                    <ReviewCard
                                        bg="bg-purple-50" border="border-purple-100" text="text-purple-900" tag="text-purple-600"
                                        title="Knowledgeable and passionate"
                                        content="Tapi is clearly passionate about teaching math. My daughter switched schools and started behind in algebra. He got her up to speed over a weekend."
                                        author="Elizabeth" lessons="13 lessons with Tapi" subject="Mathematics Tutor"
                                        img="https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=100&h=100&q=80"
                                    />
                                    <ReviewCard
                                        bg="bg-rose-50" border="border-rose-100" text="text-rose-900" tag="text-rose-600"
                                        title="Highly recommend"
                                        content="Madeleine is fantastic! I'd highly recommend her to anyone and everyone. She helped my daughter improve in guitar and voice way beyond our expectations."
                                        author="Mark" lessons="22 lessons with Madeleine" subject="Guitar Tutor"
                                        img="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80"
                                    />
                                    <ReviewCard
                                        bg="bg-teal-50" border="border-teal-100" text="text-teal-900" tag="text-teal-600"
                                        title="Great tutor"
                                        content="My son is a high school sophomore. He was struggling with Geometry. Danny has been a great geometry tutor. My son went from a D to B in one quarter."
                                        author="Debra" lessons="8 lessons with Danny" subject="Geometry Tutor"
                                        img="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=100&h=100&q=80"
                                    />
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </section>
            </RevealBlock>

            {/* FOUNDER & LIVE LEADS */}
            <RevealBlock>
                <section className="py-20 w-full bg-[#F8FAFC] border-y border-slate-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-10">

                            <div className="flex flex-col items-center justify-center p-6 relative group">
                                <img
                                    src="https://i.ibb.co/R4kJqShg/Screenshot-2026-05-22-182222.png?auto=format&fit=crop&w=400&h=400&q=80"
                                    alt="Founder Demo"
                                    className="w-64 h-64 sm:w-80 sm:h-80 object-contain drop-shadow-xl mb-6 transition-transform duration-300 group-hover:scale-105"
                                />
                                <a href="#" className="inline-flex items-center gap-2 text-indigo-600 font-bold text-lg hover:text-indigo-800 transition-colors drop-shadow-sm border-b-2 border-transparent hover:border-indigo-600 pb-0.5">
                                    Know about founder : Anushka <ArrowRight size={18} />
                                </a>
                            </div>

                            <div className="bg-white border border-slate-200 rounded-[2rem] p-10 flex flex-col shadow-[0_20px_40px_rgba(0,0,0,0.08)] relative overflow-hidden">

                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <h2 className="font-serif text-2xl font-bold text-slate-900 drop-shadow-sm">Recent Tuition Requests</h2>
                                        <p className="text-slate-500 text-sm mt-1">Parents actively looking for tutors.</p>
                                    </div>
                                    <span className="flex h-3.5 w-3.5">
                                        <span className="animate-ping absolute inline-flex h-3.5 w-3.5 rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                                    </span>
                                </div>

                                <div className="space-y-5 grow">
                                    {[
                                        { cls: "Class 10 CBSE", sub: "Mathematics", loc: "Mumbai", mode: "Home Tutor", budget: "₹500 - ₹800/hr" },
                                        { cls: "Class 8 ICSE", sub: "Science", loc: "Delhi", mode: "Online", budget: "₹300 - ₹500/hr" },
                                        { cls: "Primary", sub: "Spoken English", loc: "Pune", mode: "Online", budget: "₹400/hr" },
                                    ].map((lead, i) => (
                                        <div key={i} className="p-4 rounded-2xl border border-slate-100 bg-slate-50 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
                                            <div>
                                                <div className="font-bold text-slate-900 text-sm">{lead.sub} <span className="text-slate-400 font-medium">for</span> {lead.cls}</div>
                                                <div className="text-xs text-slate-500 mt-1.5 flex items-center gap-1.5 font-medium">
                                                    <MapPin size={12} className="text-slate-400" /> {lead.loc} • {lead.mode} • {lead.budget}
                                                </div>
                                            </div>
                                            <div className="text-xs font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg shadow-sm">Open</div>
                                        </div>
                                    ))}
                                </div>
                                <a href="#" className="text-center text-sm font-bold text-indigo-600 mt-6 pt-5 border-t border-slate-100 hover:text-indigo-800 transition-colors inline-block w-full">
                                    View all leads
                                </a>
                            </div>

                        </div>
                    </div>
                </section>
            </RevealBlock>

            {/* DISCOVER LOCATIONS */}
            <RevealBlock>
                <section className="py-24 w-full bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-3 bg-red-50 rounded-full text-red-500">
                                <Compass size={28} strokeWidth={2} />
                            </div>
                            <h2 className="font-sans text-4xl font-bold text-slate-900 tracking-tight">Discover Popular Locations</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="md:col-span-1 md:row-span-2 relative rounded-2xl overflow-hidden group shadow-lg h-[300px] md:h-auto cursor-pointer">
                                <img src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&h=1200&q=80" alt="Delhi" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
                                <div className="absolute bottom-6 left-6 text-white">
                                    <h3 className="text-3xl font-bold mb-1">Delhi</h3>
                                    <p className="text-white/80 text-sm font-medium">available tutors: 399+</p>
                                </div>
                            </div>

                            <div className="relative rounded-2xl overflow-hidden group shadow-lg h-[220px] cursor-pointer">
                                <img src="https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=600&h=400&q=80" alt="Mumbai" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                                <div className="absolute bottom-5 left-5 text-white">
                                    <h3 className="text-2xl font-bold mb-1">Mumbai</h3>
                                    <p className="text-white/80 text-sm font-medium">available tutors: 199+</p>
                                </div>
                            </div>

                            <div className="relative rounded-2xl overflow-hidden group shadow-lg h-[220px] cursor-pointer">
                                <img src="https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&h=400&q=80" alt="Bangalore" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                                <div className="absolute bottom-5 left-5 text-white">
                                    <h3 className="text-2xl font-bold mb-1">Bangalore</h3>
                                    <p className="text-white/80 text-sm font-medium">available tutors: 99+</p>
                                </div>
                            </div>

                            <div className="relative rounded-2xl overflow-hidden group shadow-lg h-[220px] cursor-pointer">
                                <img src="https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&h=400&q=80" alt="Pune" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                                <div className="absolute bottom-5 left-5 text-white">
                                    <h3 className="text-2xl font-bold mb-1">Pune</h3>
                                    <p className="text-white/80 text-sm font-medium">available tutors: 199+</p>
                                </div>
                            </div>

                            <div className="relative rounded-2xl overflow-hidden group shadow-lg h-[220px] cursor-pointer">
                                <img src="https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&h=400&q=80" alt="Hyderabad" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                                <div className="absolute bottom-5 left-5 text-white">
                                    <h3 className="text-2xl font-bold mb-1">Hyderabad</h3>
                                    <p className="text-white/80 text-sm font-medium">available tutors: 79+</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-2">
                            <button className="bg-[#FF4F5B] text-white font-semibold py-3 px-8 rounded hover:bg-red-600 transition-colors shadow-md">
                                Show All
                            </button>
                            <div className="flex gap-2">
                                <button className="w-12 h-12 border border-slate-200 rounded flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors">
                                    <ChevronLeft size={20} />
                                </button>
                                <button className="w-12 h-12 bg-[#FF4F5B] rounded flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-md">
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </RevealBlock>

            {/* FAQ SECTION */}
            <RevealBlock>
                <section className="py-24 bg-[#FAFAFA] border-t border-slate-200">
                    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-start">

                            <div className="lg:col-span-5 sticky top-28">
                                <h2 className="font-sans text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-6 tracking-tight">
                                    Frequently <br />
                                    Asked <span className="text-[#0b5ed7]">Questions</span>
                                </h2>
                                <p className="text-slate-600 text-lg mb-8 font-medium leading-relaxed max-w-md">
                                    Find answers to common questions about our tutoring services, matching process, and safety measures.
                                </p>

                                <div className="bg-white p-8 rounded-3xl shadow-[0_12px_32px_rgba(0,0,0,0.06)] border border-slate-100 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#0b5ed7]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                    <h3 className="font-bold text-slate-900 text-xl mb-3 flex items-center gap-2">
                                        <MessageCircle className="text-[#0b5ed7]" /> Still need help?
                                    </h3>
                                    <p className="text-slate-600 text-sm mb-6 font-medium">
                                        Our support team is always ready to guide you in finding the perfect educator.
                                    </p>
                                    <button className="w-full bg-[#0b5ed7] text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-colors flex justify-center items-center gap-2 shadow-md">
                                        Contact Support <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="lg:col-span-7 space-y-4">
                                {faqs.map((faq, i) => {
                                    const isOpen = activeFaq === i;
                                    return (
                                        <div
                                            key={i}
                                            className={`border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'bg-white border-[#0b5ed7] shadow-[0_8px_24px_rgba(11,94,215,0.12)]' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'}`}
                                        >
                                            <button
                                                onClick={() => setActiveFaq(isOpen ? null : i)}
                                                className="w-full text-left px-6 py-5 flex items-center justify-between gap-6 outline-none"
                                            >
                                                <span className={`font-semibold text-[17px] leading-snug ${isOpen ? 'text-[#0b5ed7]' : 'text-slate-800'}`}>
                                                    {faq.q}
                                                </span>
                                                <div className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-300 ${isOpen ? 'bg-[#0b5ed7] text-white' : 'bg-slate-100 text-slate-500'}`}>
                                                    <ChevronDown size={18} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                                                </div>
                                            </button>
                                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                                <p className="px-6 pb-6 text-slate-600 font-medium leading-relaxed">
                                                    {faq.a}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                        </div>
                    </div>
                </section>
            </RevealBlock>

            {/* FOOTER */}
            <footer className="bg-[#0F172A] text-slate-300 pt-20 pb-12 shadow-[0_-20px_60px_rgba(0,0,0,0.15)] relative z-10 rounded-t-[3rem]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-16">

                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="bg-indigo-500 text-white p-2 rounded-lg shadow-md">
                                    <GraduationCap size={24} />
                                </div>
                                <span className="font-serif font-medium text-2xl text-white tracking-tight drop-shadow-sm">
                                    GharPeGyan
                                </span>
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed mb-8 max-w-sm font-medium">
                                A trusted education marketplace connecting parents with verified teachers for home and online tuition across India.
                            </p>

                            <div className="space-y-3 bg-slate-800/50 p-5 rounded-2xl border border-slate-700/50 shadow-inner">
                                <div className="text-white text-sm font-bold tracking-wide">Get updates and study tips</div>
                                <div className="flex gap-2 max-w-sm">
                                    <input type="email" placeholder="Email address" className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm flex-1 outline-none focus:border-indigo-500 text-white placeholder:text-slate-500 shadow-inner" />
                                    <button className="bg-indigo-600 text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-indigo-500 transition-colors shadow-md">
                                        Subscribe
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-white font-bold tracking-wide mb-6 text-sm">Platform</h4>
                            <ul className="space-y-4 text-sm text-slate-400 font-medium">
                                <li><a href="#" onClick={(e) => { e.preventDefault(); authNavigate('/search') }} className="hover:text-indigo-400 transition-colors">Find a Tutor</a></li>
                                <li><a href="#" onClick={(e) => { e.preventDefault(); authNavigate('/parent/post-requirement') }} className="hover:text-indigo-400 transition-colors">Post Requirement</a></li>
                                <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/login') }} className="hover:text-indigo-400 transition-colors">Join as Teacher</a></li>
                                <li><a href="#" className="hover:text-indigo-400 transition-colors">Live Leads</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold tracking-wide mb-6 text-sm">Subjects</h4>
                            <ul className="space-y-4 text-sm text-slate-400 font-medium">
                                <li><a href="#" onClick={(e) => { e.preventDefault(); authNavigate('/search?subject=Mathematics') }} className="hover:text-indigo-400 transition-colors">Mathematics</a></li>
                                <li><a href="#" onClick={(e) => { e.preventDefault(); authNavigate('/search?subject=Science') }} className="hover:text-indigo-400 transition-colors">Science & Physics</a></li>
                                <li><a href="#" onClick={(e) => { e.preventDefault(); authNavigate('/search?subject=English') }} className="hover:text-indigo-400 transition-colors">English & Languages</a></li>
                                <li><a href="#" onClick={(e) => { e.preventDefault(); authNavigate('/search?subject=Accounts') }} className="hover:text-indigo-400 transition-colors">Commerce & Accounts</a></li>
                                <li><a href="#" onClick={(e) => { e.preventDefault(); authNavigate('/search?subject=Coding') }} className="hover:text-indigo-400 transition-colors">Computer Science</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold tracking-wide mb-6 text-sm">Cities</h4>
                            <ul className="space-y-4 text-sm text-slate-400 font-medium">
                                <li><a href="#" className="hover:text-indigo-400 transition-colors">Delhi NCR</a></li>
                                <li><a href="#" className="hover:text-indigo-400 transition-colors">Mumbai</a></li>
                                <li><a href="#" className="hover:text-indigo-400 transition-colors">Bangalore</a></li>
                                <li><a href="#" className="hover:text-indigo-400 transition-colors">Pune</a></li>
                                <li><a href="#" className="hover:text-indigo-400 transition-colors">Hyderabad</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold tracking-wide mb-6 text-sm">Support</h4>
                            <ul className="space-y-4 text-sm text-slate-400 font-medium">
                                <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><Phone size={14} className="text-indigo-400" /> Contact Us</a></li>
                                <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><Mail size={14} className="text-indigo-400" /> Email Help</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Trust & Safety</a></li>
                                <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/privacy') }} className="hover:text-white transition-colors">Privacy Policy</a></li>
                                <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/terms') }} className="hover:text-white transition-colors">Terms of Use</a></li>
                            </ul>
                        </div>

                    </div>

                    <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-slate-500 font-medium">© {new Date().getFullYear()} GharPeGyan. Built for education.</p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-colors shadow-md">in</a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-colors shadow-md">tw</a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-colors shadow-md">fb</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
