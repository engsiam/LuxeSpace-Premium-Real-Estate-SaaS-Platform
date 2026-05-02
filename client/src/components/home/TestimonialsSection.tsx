'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  {
    name: 'Zakir Hossain',
    role: 'CEO, Global Tech',
    text: 'LuxeSpace redefined my expectations of luxury real estate in Bangladesh. The verification process gave me absolute peace of mind during my penthouse acquisition.',
    rating: 5,
  },
  {
    name: 'Nadia Ahmed',
    role: 'Architectural Consultant',
    text: 'As an architect, I appreciate the curation. Every property on this platform is a masterpiece. The AI concierge recommended exactly what I was looking for.',
    rating: 5,
  },
  {
    name: 'Ariful Islam',
    role: 'Private Investor',
    text: 'The bKash integration is seamless. I booked my commercial space in Gulshan within minutes. The elite support team handled everything from there.',
    rating: 5,
  },
];

export default function TestimonialsSection() {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-16 bg-background border-t border-border/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="flex items-center gap-3 mb-3 justify-center">
            <div className="w-10 h-0.5 bg-primary" />
            <span className="text-primary font-bold uppercase tracking-[0.4em] text-xs">
              Voices of Excellence
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Distinguished <span className="text-primary italic">Endorsements</span>
          </h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="bg-card border border-border rounded-2xl p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
                  <div className="w-20 h-20 bg-primary/10 rounded-xl flex items-center justify-center text-primary text-3xl font-bold shrink-0">
                    {testimonials[index].name.charAt(0)}
                  </div>
                  <div className="flex-1 text-center md:text-left space-y-4">
                    <div className="flex gap-1 justify-center md:justify-start">
                      {[...Array(testimonials[index].rating)].map((_, i) => (
                        <span key={i} className="text-primary text-lg">★</span>
                      ))}
                    </div>
                    <p className="text-xl md:text-2xl font-medium italic text-foreground leading-relaxed">
                      "{testimonials[index].text}"
                    </p>
                    <div>
                      <h4 className="text-lg font-medium text-foreground">{testimonials[index].name}</h4>
                      <p className="text-primary font-bold text-xs uppercase tracking-[0.3em] mt-1">{testimonials[index].role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center md:justify-end gap-6 mt-8">
            <button 
              onClick={prev}
              className="w-14 h-14 rounded-xl border border-border flex items-center justify-center text-primary hover:bg-primary hover:text-secondary-foreground transition-all duration-300"
            >
              ←
            </button>
            <button 
              onClick={next}
              className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center text-secondary-foreground hover:bg-primary/80 transition-all duration-300"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
