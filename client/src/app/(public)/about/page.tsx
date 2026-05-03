'use client';

import { motion } from 'framer-motion';
import { Target, Eye, Users, Award, Rocket, CheckCircle2 } from 'lucide-react';

const team = [
  { 
    name: 'Rahul Ahmed', 
    role: 'CEO & Founder', 
    bio: 'Visionary leader with 15+ years in real estate technology.',
    initials: 'RA'
  },
  { 
    name: 'Sarah Khan', 
    role: 'Head of Operations', 
    bio: 'Expert in streamlining property management and client relations.',
    initials: 'SK'
  },
  { 
    name: 'Imran Hassan', 
    role: 'Lead Consultant', 
    bio: 'Dedicated to finding the perfect match for every premium seeker.',
    initials: 'IH'
  },
];

const milestones = [
  { 
    year: '2020', 
    title: 'Genesis of LuxeSpace', 
    description: 'Founded with a mission to digitize the premium real estate market in Bangladesh.' 
  },
  { 
    year: '2021', 
    title: '100+ Premium Listings', 
    description: 'Reached our first major milestone of curated high-end properties.' 
  },
  { 
    year: '2022', 
    title: 'Innovation Award', 
    description: 'Recognized for our digital-first approach to property exploration.' 
  },
  { 
    year: '2023', 
    title: 'Seamless Payments', 
    description: 'Integrated bKash PGW V2 for secure, instant property bookings.' 
  },
];

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden border-b border-border">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
          <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 rounded-full blur-[120px] -mr-40" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto space-y-6"
          >
            <span className="inline-block py-2 px-4 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-black uppercase tracking-[0.3em]">
              The LuxeSpace Story
            </span>
            <h1 className="text-4xl md:text-7xl font-black text-white leading-tight tracking-tighter">
              Redefining Luxury Living in <span className="text-primary italic">Bangladesh</span>
            </h1>
            <p className="text-xl text-muted-foreground font-medium leading-relaxed">
              We bridge the gap between dream sanctuaries and discerning seekers through 
              cutting-edge technology and unwavering trust.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-12 bg-card rounded-2xl border border-border shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-8 text-primary">
              <Target size={32} />
            </div>
            <h2 className="text-3xl font-black mb-6 text-white">Our Mission</h2>
            <p className="text-muted-foreground text-lg font-medium leading-relaxed">
              To transform the property landscape by providing a transparent, secure, and 
              effortless platform for high-end real estate transactions in Bangladesh.
            </p>
            <ul className="mt-8 space-y-4">
              {['Digital-First Experience', 'Verified Listings Only', 'Secure bKash Integration'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-white font-bold text-sm">
                  <CheckCircle2 size={18} className="text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-12 bg-card rounded-2xl border border-border shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full -ml-16 -mb-16 group-hover:scale-150 transition-transform duration-700" />
            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-8 text-primary">
              <Eye size={32} />
            </div>
            <h2 className="text-3xl font-black mb-6 text-white">Our Vision</h2>
            <p className="text-muted-foreground text-lg font-medium leading-relaxed">
              To be the definitive destination for premium real estate, where luxury meets 
              unparalleled digital convenience for every citizen of Bangladesh.
            </p>
            <div className="mt-12 p-6 bg-background rounded-2xl border border-border">
              <p className="text-primary font-black italic">"Leading the future of luxury property management."</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-background border-y border-border">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Premium Listings', value: '500+', icon: Rocket },
            { label: 'Happy Families', value: '1,200+', icon: Users },
            { label: 'Major Cities', value: '6', icon: Target },
            { label: 'Years Experience', value: '4+', icon: Award },
          ].map((stat, index) => (
            <div key={index} className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-primary">
                <stat.icon size={24} />
              </div>
              <p className="text-4xl font-black text-white">{stat.value}</p>
              <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <span className="text-primary font-bold uppercase tracking-widest text-xs">The Minds Behind</span>
            <h2 className="text-4xl font-black text-white tracking-tight">Our <span className="text-primary">Leadership</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-8 bg-background rounded-2xl border border-border text-center hover:bg-card transition-all duration-500 hover:-translate-y-2"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/60 rounded-3xl flex items-center justify-center mx-auto mb-6 text-secondary-foreground font-black text-3xl shadow-xl shadow-[#C9A74D]/20 group-hover:rotate-6 transition-transform duration-500">
                  {member.initials}
                </div>
                <h3 className="text-2xl font-black text-white mb-2">{member.name}</h3>
                <p className="text-primary font-bold uppercase tracking-widest text-xs mb-4">{member.role}</p>
                <p className="text-muted-foreground font-medium text-sm leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-background border-t border-border">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <span className="text-primary font-bold uppercase tracking-widest text-xs">Our Evolution</span>
            <h2 className="text-4xl font-black text-white tracking-tight">The <span className="text-primary">Journey</span></h2>
          </div>
          <div className="space-y-12 relative before:absolute before:left-[19px] md:before:left-1/2 before:top-0 before:h-full before:w-px before:bg-border before:z-0">
            {milestones.map((milestone, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`flex flex-col md:flex-row gap-8 relative z-10 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className="hidden md:block w-1/2" />
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-[#C9A74D]/30 text-secondary-foreground font-black absolute left-0 md:left-1/2 md:-translate-x-1/2">
                  {index + 1}
                </div>
                <div className="flex-1 bg-card p-8 rounded-2xl border border-border hover:border-primary/30 transition-colors ml-14 md:ml-0 md:w-1/2">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-black text-white">{milestone.title}</h3>
                    <span className="text-primary font-black text-xl">{milestone.year}</span>
                  </div>
                  <p className="text-muted-foreground font-medium leading-relaxed">{milestone.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
