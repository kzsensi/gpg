# GharPeGyan Project Context & Homepage Redesign Guidelines

This document provides a comprehensive, high-fidelity context for the **GharPeGyan** web application, with a specific focus on the Homepage. Use this document as the single source of truth for feeding another AI model to redesign the **Hero Section** of the homepage. All other homepage sections and pages must remain completely unchanged.

---

## 1. Project Overview & Brand Identity

### What is GharPeGyan?
**GharPeGyan** is a premium tutoring marketplace connecting parents in India with verified, trusted home and online tutors. It acts as an intermediary that guarantees security, verified credentials, and high teaching standards.

### Brand Vibe & Tone
*   **Trust & Safety First:** The entire app must feel secure and reliable. Parents are inviting these tutors into their homes, so vetting and certification are central to the message.
*   **Clean & Premium:** High-end typography, clean spacing, smooth animations, and generous white space. It should feel like a premium, state-of-the-art educational service.
*   **Minimalist & Professional:** Avoiding childish illustrations, excessive emojis, or high-pressure marketing buzzwords (e.g., avoid "empower", "revolutionize", "supercharge", "disrupt"). The language is grounded, direct, and parent-friendly.
*   **Target Audience:** Indian parents looking for verified, premium tutors for their children (grades K-12, competitive exams, extra-curriculars like music or coding).

---

## 2. Core Technology Stack

*   **Frontend Library:** React (18+)
*   **Build Tool:** Vite
*   **Styling Engine:** Tailwind CSS v4 (utilizing the new `@theme` configuration directives)
*   **Database & Backend:** Supabase (interacted via client services in `src/services/api.js`)
*   **Icons:** `lucide-react`
*   **Fonts:** `Inter`, sans-serif (clean, modern sans-serif typography)

---

## 3. Design System & Style Tokens

To keep the homepage perfectly cohesive during the hero section redesign, you **MUST** adhere to the following design system tokens currently declared in `src/index.css` and used across the codebase:

### Color Palette
*   **Primary Blue:** `#0b5ed7` (Vibrant blue used for primary CTA buttons, active state highlights, search button, and high-emphasis icons).
*   **Success Green (Emerald):** `#10b981` (emerald-500) and `#047857` (emerald-700) (Used specifically to indicate "Verified" status, background-checks, safety badges, and teacher join buttons).
*   **Rating Gold (Amber):** `#f59e0b` (amber-500) (Used for stars, reviews, and badges denoting high ratings).
*   **Background (Light Slate):** `#F8FAFC` (slate-50) (Used as the flat, clean background for the entire page body).
*   **Base White:** `#FFFFFF` (Used for layout blocks, search strips, input fields, and individual cards to float cleanly off the light slate background).
*   **High-Contrast Text:** `#0F172A` (slate-900) (Used for all major headers, titles, and body content where maximum readability is required).
*   **Muted Text:** `#475569` (slate-600) and `#64748B` (slate-500) (Used for descriptions, subheadings, labels, and timestamps).

### Borders & Corners
*   **Rounded Cards:** `rounded-2xl` (1rem / 16px) is standard for all main section containers and card grids.
*   **Rounded Inputs & Buttons:** `rounded-xl` (0.75rem / 12px) or `rounded-lg` (0.5rem / 8px).
*   **Subtle Borders:** `border border-slate-200` is the standard separator border. Avoid heavy dark lines or dropshadows; let thin borders and subtle slate backgrounds do the division.

### Scroll-Reveal Animations
The site uses a custom scroll-reveal hook `useScrollReveal` and a wrapper component `<RevealBlock>` in `HomePage.jsx` to smoothly animate sections into view as the user scrolls:
*   **Initial State:** `opacity-0 translate-y-12`
*   **Revealed State:** `opacity-100 translate-y-0`
*   **Transition:** `transition-all duration-1000 ease-out`

---

## 4. Homepage Anatomy (All Sections in Order)

Below are the exact sections of the `HomePage.jsx` in their sequential scroll order. **All sections from Section 2 onwards MUST remain structurally and visually identical.** Your redesign is confined **solely** to Section 1 (Hero Section).

```
┌──────────────────────────────────────────────────────────┐
│                0. TopNavigation (Sticky)                  │
├──────────────────────────────────────────────────────────┤
│                                                          │
│             1. HERO SECTION (UP FOR REDESIGN)            │
│                                                          │
├──────────────────────────────────────────────────────────┤
│             2. Quick Search Strip (-mt-10)               │
├──────────────────────────────────────────────────────────┤
│             3. Browse by Subject (Category Selector)     │
├──────────────────────────────────────────────────────────┤
│             4. How It Works (Visual 3-Step Cards)        │
├──────────────────────────────────────────────────────────┤
│             5. Every Teacher is Verified (Trust Block)   │
├──────────────────────────────────────────────────────────┤
│             6. Founder Anushka & Live Parent Leads       │
├──────────────────────────────────────────────────────────┤
│             7. Popular Locations (Delhi, Mumbai, etc.)   │
├──────────────────────────────────────────────────────────┤
│             8. Frequently Asked Questions (FAQ Accordion)│
├──────────────────────────────────────────────────────────┤
│             9. Footer (Slate-900)                        │
└──────────────────────────────────────────────────────────┘
```

### Section 0: TopNavigation (Header)
*   **Component:** `<TopNavigation />`
*   **Features:** Logo on the left, primary navigation links (Find Tutors, Post Requirements, How it Works), and authentication actions on the right (Login, Dashboard/Logout depending on parent/tutor role).

### Section 1: Hero Section (Target for Redesign)
*   **Purpose:** Make a stunning first impression, capture parent search intent, and provide clear paths for both parents ("Find a Teacher") and tutors ("Join as Teacher").
*   **Detailed specs are in Section 5 of this document.**

### Section 2: Quick Search Strip
*   **Visual Layout:** A floating bar overlaying the Hero Section via negative margin (`-mt-10`).
*   **Inputs:** Text input ("What subject?"), select dropdown ("Select Subject"), select dropdown ("Enter City"), select dropdown ("Class Type" - Online/Home Tutor), and a solid primary-blue Search button.
*   **Container Style:** `bg-white rounded-xl shadow-md border border-slate-200 p-2 max-w-[1200px]`.

### Section 3: Browse by Subject (Category Selector)
*   **Visual Layout:** Horizontal flow of subject cards that wrap.
*   **Subjects:** Mathematics (Calculator), Science (Flask), English (Languages), Physics (Atom), Chemistry (Microscope), Accounts (FileSpreadsheet), Coding (Terminal), Speaking (Mic), Business (Briefcase), Guitar (Music).
*   **Card Style:** `border border-slate-200 bg-white hover:border-[#0b5ed7] transition-colors duration-200 py-4 px-6 rounded-xl flex items-center gap-3`.

### Section 4: How It Works
*   **Visual Layout:** 3-step visual cards side-by-side on desktop, vertical on mobile.
*   *   **Step 1:** Post your requirement (Illustration: `step-post.png`, sky-100 badge `1`).
    *   **Step 2:** Get verified matches (Illustration: `step-match.png`, emerald-100 badge `2`).
    *   **Step 3:** Start with a free demo (Illustration: `step-demo.png`, amber-100 badge `3`).
*   **Card Style:** `rounded-2xl border border-slate-200 bg-white p-6 hover:shadow-lg transition-shadow duration-300`.

### Section 5: Every Teacher is Verified (Trust Block)
*   **Visual Layout:** 2-column block.
    *   **Left Column:** Vetting details with custom checkmarks (`CheckCircle2` in emerald). Key points: Identity & Background Check, Qualification Review, Demo Teaching Assessment, Ongoing Quality Monitoring.
    *   **Right Column:** Vetting illustration image (`verified-teachers.png`).

### Section 6: Founder & Live Leads
*   **Visual Layout:** 2-column block.
    *   **Left Column:** Founder Anushka's circular photo (`founder.png`) and link to story.
    *   **Right Column:** Live feed container `bg-[#F8FAFC] border border-slate-200 shadow-sm rounded-2xl p-8` showing recent parent queries (e.g., "Class 10 CBSE Math in Mumbai", "Class 8 ICSE Science in Delhi"). Features a real-time pulsing green dot badge (`animate-ping`).

### Section 7: Popular Locations
*   **Visual Layout:** Grid of cities using landscape images overlayed with city names: Delhi, Mumbai, Bangalore, Pune (`pune.png`), Hyderabad (`hyderabad.png`).

### Section 8: FAQ Section
*   **Visual Layout:** Clean accordion of 5 critical questions about safety, tutor quality, specific learning needs, refunds, and free demo validation.
*   **Interactive Style:** Click triggers `activeFaq === i` to expand height smoothly with `max-h-[500px]` transition.

### Section 9: Footer
*   **Visual Layout:** Slate-900 background, lists of platform and company links, bottom row with copyright and social handles (Twitter, LinkedIn, Instagram).

---

## 5. Current Hero Section Deep Dive

Below is the complete, exact JSX structure of the current Hero section in `src/pages/HomePage.jsx`. Your goal is to redesign this section to look significantly more visual, premium, and well-designed on both desktop and mobile viewports.

### Current Code Snippet
```jsx
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
                        <button onClick={() => authNavigate('/search')} className="w-full sm:w-auto bg-[#0b5ed7] text-white px-8 py-4 rounded-lg font-semibold text-base hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm">
                            Find a Teacher <ArrowRight size={18} />
                        </button>
                    )}
                    {!isAuthenticated && (
                        <button onClick={() => navigate('/login')} className="w-full sm:w-auto bg-emerald-600 text-white px-8 py-4 rounded-lg font-semibold text-base hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-sm">
                            Join as Teacher <GraduationCap size={18} />
                        </button>
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
                <picture className="w-full max-w-lg flex justify-center lg:justify-end">
                    <source media="(min-width: 1024px)" srcSet={heroImg} />
                    <img
                        src={heroMobileImg}
                        alt="Student learning online"
                        className="w-full max-w-sm lg:max-w-lg object-contain rounded-2xl shadow-sm lg:rounded-none lg:shadow-none"
                    />
                </picture>
            </div>

        </div>
    </div>
</section>
```

### Current Authentication States in the Hero
The buttons shown in the Hero adapt dynamically depending on whether the user is logged in, and their role:
1.  **Guest (Not logged in):**
    *   Show "Find a Teacher" (blue) -> links to `/search` (via authCheck redirect if needed).
    *   Show "Join as Teacher" (emerald) -> links to `/login`.
2.  **Parent Role (Logged in):**
    *   Show "Find a Teacher" (blue) -> links to `/search`.
3.  **Tutor Role (Logged in):**
    *   Show "Go to Dashboard" (blue) -> links to `/tutor/dashboard`.
4.  **Admin Role (Logged in):**
    *   Show "Go to Admin Panel" (dark slate) -> links to `/admin/dashboard`.

---

## 6. Redesign Requirements & Guidelines

When generating a redesigned Hero section, follow these critical design guidelines:

### Layout & Composition
*   **Stunning First Impression:** Inject modern web design aesthetics—subtle radial or linear color gradients, elegant light backgrounds, glassmorphism card overlays, and organic floating layout structures.
*   **Mobile Viewport Excellence:** The mobile viewport needs to feel extremely polished. The image of the hero student should integrate elegantly (e.g., potentially sliding behind text, forming an overlay background, or showing side-by-side with high-contrast text wraps). Avoid massive margins on small viewports and keep CTAs immediately visible in the active viewport (above the scroll fold).
*   **Visual Elements:** Introduce micro-cards that sit on top of the hero image (such as floating elements showing "5★ Tutor Matched", "Mathematics demo scheduled", or small rating stars badges) to add visual depth.
*   **Keep Spacing Intact:** Ensure that the connection to **Section 2 (Quick Search Strip)** remains seamless. Section 2 floats up using negative margin (`-mt-10`), so your Hero section's bottom padding needs to be calculated to prevent overlaps with any critical buttons or trust bars.

### Strict Coding Constraints
1.  **NO API/Database Changes:** Do not modify any API endpoints, database schemas, or service handlers. Only edit the UI structures, styles, classes, and layouts in `HomePage.jsx` inside the Hero area.
2.  **Maintain Authenticated Paths:** Keep the reactive state conditions `{(!role || role === 'parent')}`, `{!isAuthenticated}`, `{role === 'tutor'}`, and `{role === 'admin'}` perfectly intact. The buttons must invoke `authNavigate` and `navigate` exactly as they do in the current snippet.
3.  **Use Assets Correctly:** The project imports `heroImg` and `heroMobileImg` from `../assets/hero.png` and `../assets/hero-mobile.png`. Maintain these imports and use `<picture>` components or background bindings to reference them appropriately.
4.  **Do Not Touch Other Sections:** The category grid, "How it Works" guide, Teacher verification checklist, Founder section, City selector, FAQs, and Footer must remain 100% identical in structure, style, and content.
