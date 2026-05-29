import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import TopNavigation from '../components/TopNavigation';
import {
    Search, BookOpen, Star, ShieldCheck, MapPin,
    ChevronRight, Calculator, FlaskConical, Atom, Languages,
    Music, Briefcase, GraduationCap, ArrowRight, PlayCircle,
    Terminal, Microscope, FileSpreadsheet, Mic, MessageCircle,
    CheckCircle2, ChevronDown, MonitorPlay, Compass, ChevronLeft
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
            className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${delay}`}
        >
            {children}
        </div>
    );
};

// Component for the moving review cards
const ReviewCard = ({ title, content, author, lessons, subject, img, bg, border, text, tag }) => (
    <div className={`w-[420px] flex-shrink-0 rounded-2xl p-7 flex gap-5 border ${border} ${bg} shadow-sm hover:shadow-md transition-shadow duration-300`}>
        <img src={img} alt={author} className="w-16 h-16 rounded-full object-cover shrink-0 bg-slate-100" />
        <div>
            <h4 className={`font-bold text-base mb-2 text-slate-900 leading-tight`}>
                "{title}"
            </h4>
            <p className="text-slate-600 text-[15px] leading-relaxed mb-4">
                {content}
            </p>
            <div className="text-sm text-slate-500 mb-1 font-medium">{author}, {lessons}</div>
            <div className={`text-sm font-semibold ${tag}`}>{subject}</div>
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

    const faqs = [
        {
            q: "How is GharPeGyan different from other websites?",
            a: "We personally verify every teacher on our platform. We make sure they know their subject and know how to actually teach it, so your child understands the concepts instead of just memorizing them."
        },
        {
            q: "Can you accommodate specific learning needs?",
            a: "Yes. Our teachers create specific lesson plans based on where your child is currently at and what they need to achieve, whether that's passing a board exam or just getting better at math."
        },
        {
            q: "Is it safe to have a tutor come to our home?",
            a: "We take safety seriously. All home tutors go through a background check and carry a verified ID. We also check in regularly to make sure you are comfortable and happy with the classes."
        },
        {
            q: "What if the teacher isn't a good fit?",
            a: "No problem at all. If the first teacher isn't the right match for your child, we will find you a new one right away at no extra cost."
        },
        {
            q: "Are demo classes actually free?",
            a: "Yes, the first session with any new tutor is completely free. It gives you a chance to see how they teach before you pay for anything."
        }
    ];

    return (
        <div className="min-h-screen font-sans bg-[#F8FAFC] text-slate-900 overflow-x-hidden">

            {/* HEADER */}
            <TopNavigation />

            {/* HERO SECTION */}
            <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-24 bg-white border-b border-slate-200">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">

                        <div className="space-y-8 max-w-2xl">
                            <h1 className="text-5xl lg:text-6xl text-slate-900 leading-[1.1] font-bold tracking-tight">
                                Find a great teacher for your child.
                            </h1>
                            <p className="text-lg lg:text-xl text-slate-600 leading-relaxed max-w-lg">
                                We connect you with verified, trusted tutors for every subject and grade. Book a free demo class today.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                                {(!role || role === 'parent') && (
                                    <>
                                        <button onClick={() => authNavigate('/search')} className="w-full sm:w-auto bg-[#0b5ed7] text-white px-8 py-4 rounded-lg font-semibold text-base hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm">
                                            Find a Teacher <ArrowRight size={18} />
                                        </button>
                                        <button onClick={() => authNavigate('/parent/post-requirement')} className="w-full sm:w-auto bg-white text-slate-700 border border-slate-300 px-8 py-4 rounded-lg font-semibold text-base hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-sm">
                                            Post Tuition Requirement
                                        </button>
                                    </>
                                )}
                                {role === 'tutor' && (
                                    <button onClick={() => navigate('/tutor/dashboard')} className="w-full sm:w-auto bg-[#0b5ed7] text-white px-8 py-4 rounded-lg font-semibold text-base hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm">
                                        Go to Dashboard <ArrowRight size={18} />
                                    </button>
                                )}
                                {role === 'admin' && (
                                    <button onClick={() => navigate('/admin/dashboard')} className="w-full sm:w-auto bg-slate-900 text-white px-8 py-4 rounded-lg font-semibold text-base hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-sm">
                                        Go to Admin Panel <ArrowRight size={18} />
                                    </button>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-8 pt-6 border-t border-slate-100">
                                <span className="inline-flex items-center gap-2 text-slate-600 text-[15px] font-medium">
                                    <ShieldCheck size={20} className="text-[#0b5ed7]" /> Verified Profiles
                                </span>
                                <span className="inline-flex items-center gap-2 text-slate-600 text-[15px] font-medium">
                                    <PlayCircle size={20} className="text-[#0b5ed7]" /> Free Demo Available
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-center lg:justify-end">
                            <img
                                src="https://i.ibb.co/JjLhj8vk/Chat-GPT-Image-May-22-2026-06-37-33-PM.png"
                                alt="Student learning online"
                                className="w-full max-w-lg object-contain"
                            />
                        </div>

                    </div>
                </div>
            </section>

            {/* QUICK SEARCH STRIP */}
            <section className="relative z-20 -mt-10 max-w-[1200px] mx-auto px-4 mb-20">
                <div className="bg-white rounded-xl shadow-md border border-slate-200 flex flex-col md:flex-row items-center p-2">

                    <div className="flex-1 flex items-center gap-3 px-6 py-4 w-full md:border-r border-slate-200">
                        <Search className="text-[#0b5ed7] shrink-0" size={20} />
                        <input type="text" placeholder="What subject?" className="w-full bg-transparent outline-none text-slate-900 placeholder:text-slate-500 font-medium text-[15px]" />
                    </div>

                    <div className="flex-1 flex items-center gap-3 px-6 py-4 w-full md:border-r border-slate-200">
                        <BookOpen className="text-[#0b5ed7] shrink-0" size={20} />
                        <select defaultValue="" className="w-full bg-transparent outline-none text-slate-900 font-medium text-[15px] cursor-pointer appearance-none">
                            <option value="" disabled>Select Subject</option>
                            <option>Mathematics</option>
                            <option>Science</option>
                            <option>English</option>
                        </select>
                        <ChevronDown size={16} className="text-slate-400 shrink-0" />
                    </div>

                    <div className="flex-1 flex items-center gap-3 px-6 py-4 w-full md:border-r border-slate-200">
                        <MapPin className="text-[#0b5ed7] shrink-0" size={20} />
                        <select defaultValue="" className="w-full bg-transparent outline-none text-slate-900 font-medium text-[15px] cursor-pointer appearance-none">
                            <option value="" disabled>Enter City</option>
                            <option>Delhi</option>
                            <option>Mumbai</option>
                            <option>Pune</option>
                        </select>
                        <ChevronDown size={16} className="text-slate-400 shrink-0" />
                    </div>

                    <div className="flex-1 flex items-center gap-3 px-6 py-4 w-full md:border-r border-slate-200">
                        <MonitorPlay className="text-[#0b5ed7] shrink-0" size={20} />
                        <select defaultValue="" className="w-full bg-transparent outline-none text-slate-900 font-medium text-[15px] cursor-pointer appearance-none">
                            <option value="" disabled>Class Type</option>
                            <option>Online</option>
                            <option>Home Tutor</option>
                        </select>
                        <ChevronDown size={16} className="text-slate-400 shrink-0" />
                    </div>

                    <button onClick={() => authNavigate('/search')} className="w-full md:w-32 py-4 md:py-0 md:h-14 rounded-lg bg-[#0b5ed7] text-white flex items-center justify-center shrink-0 hover:bg-blue-700 transition-colors md:ml-2">
                        <span className="font-semibold text-[15px]">Search</span>
                    </button>

                </div>
            </section>

            {/* CATEGORY SELECTOR */}
            <RevealBlock>
                <section className="py-16 w-full bg-[#F8FAFC]">
                    <div className="text-center mb-12 px-4">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Browse by Subject</h2>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 px-4 sm:px-8 max-w-6xl mx-auto">
                        {[
                            { name: 'Mathematics', icon: <Calculator size={24} />, color: 'text-slate-700' },
                            { name: 'Science', icon: <FlaskConical size={24} />, color: 'text-slate-700' },
                            { name: 'English', icon: <Languages size={24} />, color: 'text-slate-700' },
                            { name: 'Physics', icon: <Atom size={24} />, color: 'text-slate-700' },
                            { name: 'Chemistry', icon: <Microscope size={24} />, color: 'text-slate-700' },
                            { name: 'Accounts', icon: <FileSpreadsheet size={24} />, color: 'text-slate-700' },
                            { name: 'Coding', icon: <Terminal size={24} />, color: 'text-slate-700' },
                            { name: 'Speaking', icon: <Mic size={24} />, color: 'text-slate-700' },
                            { name: 'Business', icon: <Briefcase size={24} />, color: 'text-slate-700' },
                            { name: 'Guitar', icon: <Music size={24} />, color: 'text-slate-700' },
                        ].map((cat, idx) => (
                            <button
                                key={idx}
                                onClick={() => authNavigate(`/search?subject=${encodeURIComponent(cat.name)}`)}
                                className={`flex items-center gap-3 px-6 py-4 rounded-xl border border-slate-200 bg-white hover:border-[#0b5ed7] transition-colors duration-200`}
                            >
                                <div className={`${cat.color}`}>{cat.icon}</div>
                                <span className="text-[15px] font-semibold text-slate-800">{cat.name}</span>
                            </button>
                        ))}
                    </div>
                </section>
            </RevealBlock>

            {/* TEACHER DISCOVERY */}
            <RevealBlock>
                <section className="py-24 w-full bg-white border-y border-slate-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 max-w-6xl mx-auto gap-4">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900 mb-3">Verified Teachers</h2>
                                <p className="text-slate-600 text-lg">Browse educators available for home or online sessions.</p>
                            </div>
                            <button onClick={() => authNavigate('/search')} className="flex items-center gap-2 text-[#0b5ed7] font-semibold hover:underline">
                                View All Tutors <ArrowRight size={16} />
                            </button>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                            {[
                                { name: "Anjali Sharma", sub: "Mathematics", rate: "₹600/hr", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80", mode: "Online & Home", city: "Mumbai", reviews: 24, intro: "I help students prepare for their CBSE board exams with a focus on problem-solving." },
                                { name: "Sneha Gupta", sub: "English Literature", rate: "₹400/hr", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80", mode: "Home Tutor", city: "Bangalore", reviews: 42, intro: "I focus on helping students improve their reading comprehension and writing skills." },
                                { name: "Rahul Sharma", sub: "Computer Science", rate: "₹800/hr", img: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=200&h=200&q=80", mode: "Online & Home", city: "Pune", reviews: 15, intro: "I teach Python and Java from scratch, making sure the fundamentals are rock solid." },
                            ].map((tutor, i) => (
                                <div key={i} className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow flex flex-col h-full">
                                    <div className="flex gap-4 mb-4">
                                        <img src={tutor.img} alt={tutor.name} className="w-14 h-14 object-cover rounded-full bg-slate-100 shrink-0" />
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
                                                {tutor.name} <CheckCircle2 size={16} className="text-[#0b5ed7]" />
                                            </h3>
                                            <div className="flex items-center gap-1 text-sm text-slate-600 mt-1">
                                                <Star size={14} className="text-amber-400 fill-amber-400" />
                                                <span className="font-semibold text-slate-900">4.9</span>
                                                <span className="text-slate-500">({tutor.reviews} reviews)</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-4 grow">
                                        <p className="text-slate-700 text-[15px] flex items-center gap-2"><BookOpen size={16} className="text-slate-400" /> {tutor.sub}</p>
                                        <p className="text-slate-700 text-[15px] flex items-center gap-2"><MapPin size={16} className="text-slate-400" /> {tutor.city} • {tutor.mode}</p>
                                        <p className="text-slate-600 text-sm mt-3 bg-slate-50 p-3 rounded-lg border border-slate-100">"{tutor.intro}"</p>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                                        <span className="font-bold text-slate-900">{tutor.rate}</span>
                                        <button onClick={() => authNavigate('/search')} className="text-sm font-semibold text-[#0b5ed7] hover:underline">
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
                <section className="py-24 bg-[#F8FAFC] border-b border-slate-200 overflow-hidden">
                    <div className="text-center max-w-2xl mx-auto mb-16 px-4">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">What parents are saying</h2>
                        <p className="text-slate-600 text-lg">Hear from parents who found the right teacher on our platform.</p>
                    </div>

                    <div className="marquee-container mb-6">
                        <div className="marquee-content gap-6 px-3">
                            {[1, 2, 3, 4].map((set) => (
                                <React.Fragment key={`set1-${set}`}>
                                    <ReviewCard
                                        bg="bg-white" border="border-slate-200" text="text-slate-900" tag="text-[#0b5ed7]"
                                        title="Very patient teacher"
                                        content="Tiffany has been great. She is knowledgeable and patient. All the lessons are thoughtfully prepared and my son enjoys them."
                                        author="Joanna" lessons="16 lessons" subject="Reading Tutor"
                                        img="https://images.unsplash.com/photo-1531123897727-8f129e1bf98c?auto=format&fit=crop&w=100&h=100&q=80"
                                    />
                                    <ReviewCard
                                        bg="bg-white" border="border-slate-200" text="text-slate-900" tag="text-[#0b5ed7]"
                                        title="Significant progress"
                                        content="Every lesson has been helpful, setting my daughter up for real progress. The teacher is easy to talk to and very professional."
                                        author="Danielle" lessons="19 lessons" subject="English Tutor"
                                        img="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&h=100&q=80"
                                    />
                                    <ReviewCard
                                        bg="bg-white" border="border-slate-200" text="text-slate-900" tag="text-[#0b5ed7]"
                                        title="Better grades"
                                        content="My son was struggling with math, but after a few weeks with his new tutor, his confidence and grades have improved."
                                        author="Sarah" lessons="8 lessons" subject="Math Tutor"
                                        img="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&h=100&q=80"
                                    />
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </section>
            </RevealBlock>

            {/* FOUNDER & LIVE LEADS */}
            <RevealBlock>
                <section className="py-24 w-full bg-white border-b border-slate-200">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">

                            <div className="flex flex-col items-center justify-center p-6">
                                <img
                                    src="https://i.ibb.co/R4kJqShg/Screenshot-2026-05-22-182222.png?auto=format&fit=crop&w=400&h=400&q=80"
                                    alt="Founder"
                                    className="w-64 h-64 sm:w-80 sm:h-80 object-cover rounded-2xl mb-6 shadow-sm border border-slate-200"
                                />
                                <a href="#" className="inline-flex items-center gap-2 text-[#0b5ed7] font-semibold text-lg hover:underline">
                                    Meet our founder: Anushka <ArrowRight size={18} />
                                </a>
                            </div>

                            <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-8 flex flex-col shadow-sm">

                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900">Recent Parent Requests</h2>
                                        <p className="text-slate-600 text-[15px] mt-1">What parents are looking for right now.</p>
                                    </div>
                                    <span className="flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                    </span>
                                </div>

                                <div className="space-y-4 grow">
                                    {[
                                        { cls: "Class 10 CBSE", sub: "Mathematics", loc: "Mumbai", mode: "Home Tutor", budget: "₹500 - ₹800/hr" },
                                        { cls: "Class 8 ICSE", sub: "Science", loc: "Delhi", mode: "Online", budget: "₹300 - ₹500/hr" },
                                        { cls: "Primary", sub: "Spoken English", loc: "Pune", mode: "Online", budget: "₹400/hr" },
                                    ].map((lead, i) => (
                                        <div key={i} className="p-4 rounded-xl border border-slate-200 bg-white flex justify-between items-center">
                                            <div>
                                                <div className="font-bold text-slate-900 text-[15px]">{lead.sub} <span className="text-slate-500 font-normal">for {lead.cls}</span></div>
                                                <div className="text-[13px] text-slate-600 mt-1 flex items-center gap-1.5 font-medium">
                                                    <MapPin size={14} className="text-slate-400" /> {lead.loc} • {lead.mode} • {lead.budget}
                                                </div>
                                            </div>
                                            <div className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">Open</div>
                                        </div>
                                    ))}
                                </div>
                                <a href="#" className="text-center text-[15px] font-semibold text-[#0b5ed7] mt-6 hover:underline inline-block w-full">
                                    View all requests
                                </a>
                            </div>

                        </div>
                    </div>
                </section>
            </RevealBlock>

            {/* DISCOVER LOCATIONS */}
            <RevealBlock>
                <section className="py-24 w-full bg-[#F8FAFC] border-b border-slate-200">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-3 mb-10">
                            <Compass size={28} className="text-[#0b5ed7]" />
                            <h2 className="text-3xl font-bold text-slate-900">Popular Locations</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="md:col-span-1 md:row-span-2 relative rounded-xl overflow-hidden shadow-sm h-[300px] md:h-auto border border-slate-200 group">
                                <img src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&h=1200&q=80" alt="Delhi" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-slate-900/40"></div>
                                <div className="absolute bottom-6 left-6 text-white">
                                    <h3 className="text-2xl font-bold mb-1">Delhi</h3>
                                    <p className="text-white/90 text-sm">399+ tutors</p>
                                </div>
                            </div>

                            <div className="relative rounded-xl overflow-hidden shadow-sm h-[220px] border border-slate-200 group">
                                <img src="https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=600&h=400&q=80" alt="Mumbai" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-slate-900/40"></div>
                                <div className="absolute bottom-5 left-5 text-white">
                                    <h3 className="text-xl font-bold mb-1">Mumbai</h3>
                                    <p className="text-white/90 text-sm">199+ tutors</p>
                                </div>
                            </div>

                            <div className="relative rounded-xl overflow-hidden shadow-sm h-[220px] border border-slate-200 group">
                                <img src="https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&h=400&q=80" alt="Bangalore" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-slate-900/40"></div>
                                <div className="absolute bottom-5 left-5 text-white">
                                    <h3 className="text-xl font-bold mb-1">Bangalore</h3>
                                    <p className="text-white/90 text-sm">99+ tutors</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </RevealBlock>

            {/* FAQ SECTION */}
            <RevealBlock>
                <section className="py-24 bg-white border-b border-slate-200">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">
                                Frequently Asked Questions
                            </h2>
                            <p className="text-slate-600 text-lg">
                                Simple answers to common questions about our platform.
                            </p>
                        </div>
                        
                        <div className="space-y-4 max-w-3xl mx-auto">
                            {faqs.map((faq, i) => {
                                const isOpen = activeFaq === i;
                                return (
                                    <div
                                        key={i}
                                        className={`border rounded-xl transition-colors ${isOpen ? 'bg-[#F8FAFC] border-slate-300' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                                    >
                                        <button
                                            onClick={() => setActiveFaq(isOpen ? null : i)}
                                            className="w-full text-left px-6 py-5 flex items-center justify-between gap-6 outline-none"
                                        >
                                            <span className={`font-semibold text-base ${isOpen ? 'text-slate-900' : 'text-slate-800'}`}>
                                                {faq.q}
                                            </span>
                                            <ChevronDown size={20} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-slate-700' : ''}`} />
                                        </button>
                                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                            <p className="px-6 pb-6 text-slate-600 text-[15px] leading-relaxed">
                                                {faq.a}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </RevealBlock>

            {/* FOOTER */}
            <footer className="bg-slate-900 text-slate-300 py-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-b border-slate-800 pb-12">

                        <div className="md:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <GraduationCap size={24} className="text-white" />
                                <span className="font-bold text-xl text-white">
                                    GharPeGyan
                                </span>
                            </div>
                            <p className="text-[15px] text-slate-400 leading-relaxed max-w-md">
                                Connecting parents with verified, trustworthy teachers for home and online tuition across India.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-4 text-[15px]">Platform</h4>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Find a Teacher</a></li>
                                <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Post Requirement</a></li>
                                <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Register as Tutor</a></li>
                                <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">How it Works</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-4 text-[15px]">Company</h4>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">About Us</a></li>
                                <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Contact Support</a></li>
                                <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
                                <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                        <p>© 2026 GharPeGyan. All rights reserved.</p>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-white transition-colors">Twitter</a>
                            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                            <a href="#" className="hover:text-white transition-colors">Instagram</a>
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default HomePage;
