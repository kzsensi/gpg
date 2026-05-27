import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TopNavigation from '../components/TopNavigation';
import {
    Search, MapPin, GraduationCap, ChevronDown, Filter,
    CheckCircle2, Briefcase, Star, ShieldCheck, MonitorPlay
} from 'lucide-react';

const TeacherSearch = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    // Search top bar state
    const [subjectQuery, setSubjectQuery] = useState(searchParams.get('subject') || '');
    const [locationQuery, setLocationQuery] = useState('');
    const [gradeQuery, setGradeQuery] = useState('');
    
    // Sidebar filter state
    const [tutoringMode, setTutoringMode] = useState('All');
    const [verifiedOnly, setVerifiedOnly] = useState(false);
    const [minRating, setMinRating] = useState(4.0);
    const [minExperience, setMinExperience] = useState('Any');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [selectedBoards, setSelectedBoards] = useState([]);
    const [sortBy, setSortBy] = useState('Relevance');

    const tutors = [
        { id: 1, name: "Priya Sharma", qualification: "M.Sc. Mathematics, B.Ed.", rating: 4.9, subjects: ["Mathematics", "Physics"], grade: "Class 11-12", boards: ["CBSE", "ICSE"], location: "Andheri West, Mumbai (Or Online)", priceMin: 800, priceMax: 1200, experience: 8, img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80", verified: true, online: true, home: true },
        { id: 2, name: "Rahul Sharma", qualification: "B.Tech IIT Delhi", rating: 4.7, subjects: ["Physics", "Chemistry"], grade: "JEE Main", boards: ["CBSE"], location: "Online Only", priceMin: 1000, priceMax: 1500, experience: 5, img: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=150&h=150&q=80", verified: true, online: true, home: false },
        { id: 3, name: "Sneha Gupta", qualification: "M.A. English Literature", rating: 4.8, subjects: ["English", "Literature"], grade: "Class 9-12", boards: ["ICSE", "State"], location: "Koramangala, Bangalore (Or Online)", priceMin: 600, priceMax: 900, experience: 6, img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80", verified: true, online: true, home: true },
        { id: 4, name: "Amit Patel", qualification: "M.Sc. Chemistry, Ph.D.", rating: 4.6, subjects: ["Chemistry", "Science"], grade: "Class 11-12, NEET", boards: ["CBSE", "State"], location: "Bandra, Mumbai (Or Online)", priceMin: 900, priceMax: 1300, experience: 10, img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80", verified: false, online: true, home: true },
    ];

    const toggleBoard = (board) => {
        setSelectedBoards(prev => 
            prev.includes(board) ? prev.filter(b => b !== board) : [...prev, board]
        );
    };

    const clearAll = () => {
        setSubjectQuery('');
        setLocationQuery('');
        setGradeQuery('');
        setTutoringMode('All');
        setVerifiedOnly(false);
        setMinRating(0);
        setMinExperience('Any');
        setPriceRange({ min: '', max: '' });
        setSelectedBoards([]);
        setSortBy('Relevance');
    };

    const filteredTutors = useMemo(() => {
        return tutors.filter(tutor => {
            // Subject match
            if (subjectQuery && !tutor.subjects.some(sub => sub.toLowerCase().includes(subjectQuery.toLowerCase()))) {
                return false;
            }
            // Location match
            if (locationQuery && !tutor.location.toLowerCase().includes(locationQuery.toLowerCase())) {
                return false;
            }
            // Grade match
            if (gradeQuery && !tutor.grade.toLowerCase().includes(gradeQuery.toLowerCase())) {
                return false;
            }
            // Mode match
            if (tutoringMode === 'Online' && !tutor.online) return false;
            if (tutoringMode === 'Home' && !tutor.home) return false;
            
            // Verified match
            if (verifiedOnly && !tutor.verified) return false;
            
            // Rating match
            if (tutor.rating < minRating) return false;
            
            // Experience match
            if (minExperience !== 'Any') {
                const expNeeded = parseInt(minExperience);
                if (tutor.experience < expNeeded) return false;
            }
            
            // Price range match
            if (priceRange.min && tutor.priceMin < parseInt(priceRange.min)) return false;
            if (priceRange.max && tutor.priceMax > parseInt(priceRange.max)) return false;
            
            // Boards match (if any selected, tutor must have AT LEAST ONE matching board)
            if (selectedBoards.length > 0) {
                if (!tutor.boards.some(board => selectedBoards.includes(board))) {
                    return false;
                }
            }
            
            return true;
        }).sort((a, b) => {
            if (sortBy === 'Rating (High to Low)') return b.rating - a.rating;
            if (sortBy === 'Price (Low to High)') return a.priceMin - b.priceMin;
            return 0; // Relevance (default order)
        });
    }, [tutors, subjectQuery, locationQuery, gradeQuery, tutoringMode, verifiedOnly, minRating, minExperience, priceRange, selectedBoards, sortBy]);

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800 pb-20">
            <TopNavigation />

            <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-6">Find your perfect tutor</h1>

                {/* Top Search Bar */}
                <div className="bg-white rounded-2xl md:rounded-full shadow-sm border border-slate-200 flex flex-col md:flex-row items-center p-2 mb-8 gap-2 md:gap-0">
                    <div className="flex-1 flex items-center gap-3 px-6 py-3 md:py-2 w-full md:border-r border-slate-200">
                        <Search className="text-slate-400 shrink-0" size={20} />
                        <input
                            type="text"
                            placeholder="Subject (e.g. Mathematics, Physics)"
                            value={subjectQuery}
                            onChange={(e) => setSubjectQuery(e.target.value)}
                            className="w-full bg-transparent outline-none text-slate-700 font-medium"
                        />
                    </div>
                    <div className="flex-1 flex items-center gap-3 px-6 py-3 md:py-2 w-full md:border-r border-slate-200">
                        <MapPin className="text-slate-400 shrink-0" size={20} />
                        <input 
                            type="text" 
                            placeholder="Location or Online" 
                            value={locationQuery}
                            onChange={(e) => setLocationQuery(e.target.value)}
                            className="w-full bg-transparent outline-none text-slate-700 font-medium" 
                        />
                    </div>
                    <div className="flex-1 flex items-center gap-3 px-6 py-3 md:py-2 w-full">
                        <GraduationCap className="text-slate-400 shrink-0" size={20} />
                        <select 
                            value={gradeQuery}
                            onChange={(e) => setGradeQuery(e.target.value)}
                            className="w-full bg-transparent outline-none text-slate-700 font-medium cursor-pointer appearance-none">
                            <option value="">Select Class / Grade</option>
                            <option value="Class 9-10">Class 9-10</option>
                            <option value="Class 11-12">Class 11-12</option>
                            <option value="JEE">Competitive (JEE/NEET)</option>
                        </select>
                        <ChevronDown size={16} className="text-slate-400 shrink-0" />
                    </div>
                    <button className="w-full md:w-32 h-14 md:h-12 rounded-xl md:rounded-full bg-[#0b5ed7] text-white font-semibold hover:bg-blue-700 transition-all shrink-0 shadow-md">
                        Search
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Sidebar Filters */}
                    <aside className="w-full lg:w-[280px] shrink-0">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-28">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-lg flex items-center gap-2"><Filter size={18} /> Filters</h3>
                                <button onClick={clearAll} className="text-sm text-[#0b5ed7] font-medium hover:underline">Clear all</button>
                            </div>

                            <div className="space-y-6">
                                {/* Mode Filter */}
                                <div>
                                    <label className="text-sm font-semibold text-slate-700 mb-3 block">Tutoring Mode</label>
                                    <div className="flex bg-slate-100 p-1 rounded-xl">
                                        {['All', 'Online', 'Home'].map(mode => (
                                            <button 
                                                key={mode} 
                                                onClick={() => setTutoringMode(mode)} 
                                                className={`flex-1 text-sm font-medium py-2 rounded-lg transition-all ${tutoringMode === mode ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-800'}`}>
                                                {mode}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Verified Toggle */}
                                <label className="flex items-center gap-3 cursor-pointer group" onClick={() => setVerifiedOnly(!verifiedOnly)}>
                                    <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${verifiedOnly ? 'bg-[#0b5ed7]' : 'bg-slate-200'}`}>
                                        {verifiedOnly && <CheckCircle2 size={14} className="text-white" />}
                                    </div>
                                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">Verified Tutors Only</span>
                                </label>

                                <hr className="border-slate-100" />

                                {/* Rating Filter */}
                                <div>
                                    <label className="text-sm font-semibold text-slate-700 mb-4 flex justify-between">
                                        Minimum Rating <span>{minRating > 0 ? `${minRating}+` : 'Any'}</span>
                                    </label>
                                    <input 
                                        type="range" 
                                        min="0" max="5" step="0.5"
                                        value={minRating}
                                        onChange={(e) => setMinRating(parseFloat(e.target.value))}
                                        className="w-full accent-[#0b5ed7]"
                                    />
                                </div>

                                {/* Experience Filter */}
                                <div>
                                    <label className="text-sm font-semibold text-slate-700 mb-3 block">Experience (Years)</label>
                                    <select 
                                        value={minExperience}
                                        onChange={(e) => setMinExperience(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-3 outline-none focus:border-[#0b5ed7]">
                                        <option value="Any">Any Experience</option>
                                        <option value="3">3+ Years</option>
                                        <option value="5">5+ Years</option>
                                        <option value="10">10+ Years</option>
                                    </select>
                                </div>

                                {/* Price Range */}
                                <div>
                                    <label className="text-sm font-semibold text-slate-700 mb-3 block">Price Range (₹/hr)</label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="number" 
                                            placeholder="Min" 
                                            value={priceRange.min}
                                            onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                                            className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-3 py-2.5 outline-none focus:border-[#0b5ed7]" 
                                        />
                                        <input 
                                            type="number" 
                                            placeholder="Max" 
                                            value={priceRange.max}
                                            onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                                            className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-3 py-2.5 outline-none focus:border-[#0b5ed7]" 
                                        />
                                    </div>
                                </div>

                                {/* Board Filter */}
                                <div>
                                    <label className="text-sm font-semibold text-slate-700 mb-3 block">Board</label>
                                    <div className="flex flex-wrap gap-2">
                                        {['CBSE', 'ICSE', 'State', 'IB'].map(board => {
                                            const isSelected = selectedBoards.includes(board);
                                            return (
                                                <button 
                                                    key={board} 
                                                    onClick={() => toggleBoard(board)}
                                                    className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${isSelected ? 'bg-[#0b5ed7] text-white border border-[#0b5ed7]' : 'bg-slate-50 border border-slate-200 text-slate-600 hover:border-[#0b5ed7] hover:text-[#0b5ed7]'}`}>
                                                    {board}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Right Main Content */}
                    <div className="flex-1">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                            <p className="text-slate-600 font-medium">
                                Showing <span className="text-slate-900 font-bold">{filteredTutors.length}</span> tutors
                                {subjectQuery && <> for <span className="text-[#0b5ed7] font-bold">{subjectQuery}</span></>}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                Sort by:
                                <select 
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-transparent font-bold text-slate-900 outline-none cursor-pointer">
                                    <option>Relevance</option>
                                    <option>Rating (High to Low)</option>
                                    <option>Price (Low to High)</option>
                                </select>
                            </div>
                        </div>

                        {filteredTutors.length === 0 ? (
                            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                                <Search size={48} className="mx-auto text-slate-300 mb-4" />
                                <h3 className="text-xl font-bold text-slate-800 mb-2">No tutors found</h3>
                                <p className="text-slate-500">Try adjusting your filters or search criteria to see more results.</p>
                                <button onClick={clearAll} className="mt-6 text-[#0b5ed7] font-semibold hover:underline">
                                    Clear all filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid lg:grid-cols-2 gap-6">
                                {filteredTutors.map((tutor) => (
                                    <div key={tutor.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                                        <div className="flex gap-4 mb-5">
                                            <div className="relative">
                                                <img src={tutor.img} alt={tutor.name} className="w-16 h-16 rounded-full object-cover border border-slate-100" />
                                                {tutor.verified && (
                                                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5"><ShieldCheck size={16} className="text-emerald-500 fill-emerald-100" /></div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <div className="truncate pr-2">
                                                        <h3 className="font-bold text-lg text-slate-900 truncate">{tutor.name}</h3>
                                                        <p className="text-xs text-slate-500 font-medium truncate">{tutor.qualification}</p>
                                                    </div>
                                                    <div className="shrink-0 flex items-center gap-1 bg-amber-50 px-2 py-1 rounded text-xs font-bold text-amber-700">
                                                        <Star size={12} className="fill-amber-400 text-amber-400" /> {tutor.rating}
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-2 mt-3">
                                                    {tutor.subjects.map(sub => (
                                                        <span key={sub} className="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">{sub}</span>
                                                    ))}
                                                    <span className="text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-1 rounded-md truncate max-w-[120px]">{tutor.grade}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-y-3 mb-6 mt-auto">
                                            <div className="text-sm text-slate-600 flex items-center gap-2 font-medium col-span-2 truncate">
                                                {tutor.online ? <MonitorPlay size={16} className="text-slate-400 shrink-0" /> : <MapPin size={16} className="text-slate-400 shrink-0" />}
                                                <span className="truncate">{tutor.location}</span>
                                            </div>
                                            <div className="text-sm text-slate-800 font-bold flex items-center gap-2">
                                                <span className="text-slate-400 font-normal">₹</span> {tutor.priceMin} - {tutor.priceMax}/hr
                                            </div>
                                            <div className="text-sm text-slate-600 flex items-center gap-2 font-medium">
                                                <Briefcase size={16} className="text-slate-400 shrink-0" /> {tutor.experience} yrs exp
                                            </div>
                                        </div>

                                        <div className="flex gap-3 mt-auto">
                                            <button onClick={() => navigate(`/teacher/${tutor.id}`)} className="flex-1 border border-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                                                View Profile
                                            </button>
                                            <button className="flex-1 bg-[#0b5ed7] text-white font-semibold py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
                                                Request Demo
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TeacherSearch;
