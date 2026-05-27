import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TopNavigation from '../components/TopNavigation';
import {
    Star, ShieldCheck, MapPin, Briefcase, ArrowLeft,
    PlayCircle, Video, Users, BookMarked, Calendar,
    Activity, Landmark, MessageCircle, Send, X,
    CheckCircle2, Phone, Mail, Clock, ArrowRight
} from 'lucide-react';

const TeacherProfile = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [showDemoModal, setShowDemoModal] = useState(false);

    return (
        <div className="min-h-screen bg-[#F0F4F8] font-sans text-slate-800 pb-20">
            <TopNavigation />

            <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                <button onClick={() => navigate('/search')} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium text-sm mb-6 transition-colors">
                    <ArrowLeft size={16} /> Back to Search
                </button>

                {/* Profile Header Card */}
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row gap-8 justify-between items-start md:items-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3"></div>

                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center relative z-10">
                        <div className="relative">
                            <img src="https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=250&h=250&q=80" alt="Rahul Sharma" className="w-28 h-28 md:w-32 md:h-32 rounded-2xl object-cover shadow-lg border-4 border-white" />
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1 shadow-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Online
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Rahul Sharma</h1>
                                <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1 border border-blue-100">
                                    <ShieldCheck size={12} /> Verified Profile
                                </span>
                            </div>
                            <p className="text-slate-600 font-medium text-base mb-4">Senior Mathematics & Physics Expert (CBSE, ICSE, JEE)</p>

                            <div className="flex flex-wrap items-center gap-4 md:gap-8 text-sm">
                                <div className="flex items-center gap-2">
                                    <Star className="text-amber-400 fill-amber-400" size={18} />
                                    <span className="font-bold text-slate-900">4.9/5</span>
                                    <span className="text-slate-500 underline cursor-pointer">(124 Reviews)</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600">
                                    <Briefcase size={18} className="text-slate-400" />
                                    <span className="font-bold text-slate-900">8 Years</span> Experience
                                </div>
                                <div className="flex items-center gap-2 text-slate-600">
                                    <MapPin size={18} className="text-slate-400" />
                                    <span className="font-bold text-slate-900">New Delhi</span> (Or Online)
                                </div>
                                <div className="flex items-center gap-2 text-slate-600">
                                    <Users size={18} className="text-slate-400" />
                                    <span className="font-bold text-slate-900">1k+</span> Students Taught
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 w-full md:w-auto relative z-10 shrink-0">
                        <button className="w-full flex items-center justify-center gap-2 text-slate-600 font-medium hover:text-slate-900 mb-2">
                            <BookMarked size={18} /> Save Profile
                        </button>
                        <button onClick={() => setShowDemoModal(true)} className="bg-[#0b5ed7] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-[0_8px_20px_rgba(11,94,215,0.2)]">
                            Schedule Free Demo
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content (Left) */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* About Me */}
                        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">About Me</h2>
                            <div className="text-slate-600 font-medium leading-relaxed space-y-4 text-[15px]">
                                <p>
                                    Hello! I'm Rahul, a passionate educator dedicated to making complex mathematical and physical concepts accessible and engaging for students. With over 8 years of experience teaching CBSE, ICSE, and guiding students towards JEE success, I believe in building strong foundational knowledge rather than rote memorization.
                                </p>
                                <p>
                                    My teaching methodology involves real-world examples, interactive problem-solving, and regular assessments to track progress. I strive to create a supportive learning environment where students feel confident asking questions and exploring their academic potential.
                                </p>
                            </div>

                            {/* Video Intro */}
                            <div className="mt-8 relative rounded-xl overflow-hidden cursor-pointer group bg-slate-900 h-64">
                                <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80" alt="Video cover" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white group-hover:bg-white group-hover:text-indigo-600 transition-colors shadow-lg">
                                        <PlayCircle size={32} />
                                    </div>
                                </div>
                                <div className="absolute bottom-4 left-4 text-white font-medium flex items-center gap-2">
                                    <Video size={16} /> Watch Introduction
                                </div>
                            </div>
                        </div>

                        {/* Subjects & Boards */}
                        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-3">Subjects & Boards</h2>
                            <div className="mb-6">
                                <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">Boards</h3>
                                <div className="flex gap-3">
                                    {['CBSE', 'ICSE', 'State Board (Delhi)'].map(b => (
                                        <span key={b} className="px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-sm">{b}</span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">Subjects</h3>
                                <div className="flex flex-wrap gap-3">
                                    {['Mathematics (Class 9-12)', 'Physics (Class 9-12)', 'Science (Class 6-8)'].map(s => (
                                        <span key={s} className="px-4 py-2 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 font-semibold text-sm">{s}</span>
                                    ))}
                                    <span className="px-4 py-2 rounded-lg bg-rose-50 border border-rose-100 text-rose-700 font-semibold text-sm">JEE Mains Preparation</span>
                                </div>
                            </div>
                        </div>

                        {/* Education & Qualifications */}
                        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-3">Education & Qualifications</h2>
                            <div className="relative border-l-2 border-slate-100 ml-3 space-y-8 pb-4">
                                <div className="relative pl-8">
                                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-indigo-100 border-2 border-indigo-500"></div>
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-slate-900">M.Sc. in Physics</h4>
                                        <span className="text-sm font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">2016</span>
                                    </div>
                                    <p className="text-sm text-slate-500 font-medium">Delhi University</p>
                                </div>
                                <div className="relative pl-8">
                                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-100 border-2 border-slate-300"></div>
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-slate-900">B.Ed. (Bachelor of Education)</h4>
                                        <span className="text-sm font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">2014</span>
                                    </div>
                                    <p className="text-sm text-slate-500 font-medium">Indraprastha University</p>
                                </div>
                            </div>
                        </div>

                        {/* Student Reviews */}
                        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-3">
                                <h2 className="text-xl font-bold text-slate-900">Student Reviews</h2>
                                <button className="text-indigo-600 font-medium text-sm hover:underline">View All (124)</button>
                            </div>
                            <div className="space-y-6">
                                {[
                                    { initials: 'AS', name: 'Aarav S.', role: 'Class 12 Parent', color: 'bg-indigo-100 text-indigo-700', review: '"Rahul sir\'s teaching methods are excellent. He explains complex Physics concepts with such ease that my son actually looks forward to his classes now. Highly recommended for JEE preparation."' },
                                    { initials: 'NK', name: 'Neha K.', role: 'Student (Class 10)', color: 'bg-rose-100 text-rose-700', review: '"I used to fear Math, but the way sir breaks down problems makes it so much easier. My grades have improved significantly in just 3 months."' },
                                    { initials: 'VP', name: 'Vikram P.', role: 'Class 11 Parent', color: 'bg-emerald-100 text-emerald-700', review: '"Excellent tutor for JEE preparation. Very systematic approach and always available to clear doubts even outside class hours. My son\'s Physics improved from 60% to 89%."' },
                                ].map((review, i) => (
                                    <div key={i} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full ${review.color} flex items-center justify-center font-bold`}>{review.initials}</div>
                                                <div>
                                                    <div className="font-bold text-slate-900 text-sm">{review.name}</div>
                                                    <div className="text-xs text-slate-500 font-medium">{review.role}</div>
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-amber-400 text-amber-400" />)}
                                            </div>
                                        </div>
                                        <p className="text-slate-600 text-sm leading-relaxed font-medium">{review.review}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 pt-6 border-t border-slate-100">
                                <h3 className="text-lg font-bold text-slate-900 mb-4">Leave a Comment</h3>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center font-bold text-slate-500">You</div>
                                    <div className="flex-1">
                                        <textarea rows={3} placeholder="Write a comment about this teacher..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0b5ed7] resize-none mb-3"></textarea>
                                        <div className="flex justify-end">
                                            <button className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors">Post Comment</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar (Right) */}
                    <div className="space-y-6">
                        {/* Fee Structure */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                                <Landmark className="text-indigo-600" size={20} /> Fee Structure
                            </h3>
                            <div className="space-y-4 text-sm">
                                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                    <span className="text-slate-600 font-medium">Hourly Rate (Online)</span>
                                    <span className="font-bold text-slate-900">₹800 - ₹1000</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                    <span className="text-slate-600 font-medium">Hourly Rate (Home)</span>
                                    <span className="font-bold text-slate-900">₹1000 - ₹1500</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-slate-600 font-medium">Monthly Package</span>
                                    <span className="font-bold text-[#0b5ed7] cursor-pointer hover:underline">Contact for details</span>
                                </div>
                            </div>
                        </div>

                        {/* Availability */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                                <Calendar className="text-indigo-600" size={20} /> Availability
                            </h3>
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
                                    <div className="text-xs text-slate-500 font-bold uppercase mb-1">Weekdays</div>
                                    <div className="text-sm font-bold text-slate-900">4 PM - 9 PM</div>
                                </div>
                                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
                                    <div className="text-xs text-slate-500 font-bold uppercase mb-1">Weekends</div>
                                    <div className="text-sm font-bold text-slate-900">10 AM - 6 PM</div>
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 font-medium flex items-start gap-2 bg-indigo-50/50 p-3 rounded-lg border border-indigo-100/50">
                                <Activity size={14} className="shrink-0 text-indigo-400 mt-0.5" />
                                Slots are subject to availability. Book a demo to secure your preferred timing.
                            </p>
                        </div>

                        {/* Guarantee Badge */}
                        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100 shadow-sm text-center">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-indigo-100 text-indigo-600">
                                <ShieldCheck size={24} />
                            </div>
                            <h4 className="font-bold text-slate-900 text-sm mb-2">GharPeGyan Guarantee</h4>
                            <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
                                This profile's identity and qualifications have been verified by our team.
                            </p>
                            <button className="text-xs font-bold text-slate-400 hover:text-slate-600 underline">Report Profile</button>
                        </div>
                    </div>
                </div>
            </main>


            {/* DEMO REQUEST MODAL */}
            {showDemoModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setShowDemoModal(false)}>
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center p-6 border-b border-slate-100">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Request Free Demo</h3>
                                <p className="text-sm text-slate-500 font-medium mt-1">with Rahul Sharma</p>
                            </div>
                            <button onClick={() => setShowDemoModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Your Name *</label>
                                <input type="text" placeholder="Enter your full name" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0b5ed7]" />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Phone *</label>
                                <div className="flex">
                                    <span className="bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl px-3 py-3 text-sm text-slate-500 font-medium">+91</span>
                                    <input type="tel" placeholder="9876543210" className="w-full bg-slate-50 border border-slate-200 rounded-r-xl px-4 py-3 text-sm outline-none focus:border-[#0b5ed7]" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Subject</label>
                                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0b5ed7]">
                                        <option>Mathematics</option>
                                        <option>Physics</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Preferred Mode</label>
                                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0b5ed7]">
                                        <option>Online</option>
                                        <option>Home Visit</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Preferred Date</label>
                                    <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0b5ed7]" />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Preferred Time</label>
                                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0b5ed7]">
                                        <option>4:00 PM</option>
                                        <option>5:00 PM</option>
                                        <option>6:00 PM</option>
                                        <option>7:00 PM</option>
                                        <option>8:00 PM</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Any specific topics?</label>
                                <textarea rows={2} placeholder="Optional - specific chapters or topics you want covered" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0b5ed7] resize-none"></textarea>
                            </div>
                            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-start gap-2">
                                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                                <p className="text-xs text-emerald-700 font-medium">Your first demo session is completely FREE. No payment required.</p>
                            </div>
                            <button className="w-full bg-[#0b5ed7] text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center gap-2">
                                <PlayCircle size={18} /> Schedule Demo
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherProfile;
