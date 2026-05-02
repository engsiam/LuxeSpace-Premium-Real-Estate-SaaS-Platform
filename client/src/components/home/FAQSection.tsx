'use client';

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Section, Heading } from '@/design-system/components';
import { motion } from 'framer-motion';

const faqs = [
  {
    question: 'How do I book a premium property?',
    answer:
      'Browse our signature collection, select your desired residence, and use the "Book Now" feature. Our integrated bKash PGW handles secure, instant payments for your convenience.',
  },
  {
    question: 'Are the listings verified for legal clarity?',
    answer:
      'Absolutely. Every property listed on LuxeSpace undergoes a rigorous legal and structural verification process by our expert concierge team before being presented to our elite clients.',
  },
  {
    question: 'What premium support services do you offer?',
    answer:
      'We provide full-spectrum support including private viewings, legal documentation assistance, financial consultation, and a dedicated concierge for post-purchase handover.',
  },
  {
    question: 'Can I list a high-end property as an owner?',
    answer:
      'Yes. Distinguished property owners and verified agents can apply to list their residences. Each listing must meet our luxury standards and pass our verification protocols.',
  },
];

export default function FAQSection() {
  return (
    <Section id="faq">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-3 justify-center">
            <div className="w-10 h-0.5 bg-primary" />
            <span className="text-primary font-bold uppercase tracking-[0.4em] text-xs">
              Concierge Support
            </span>
          </div>
          <Heading level={2}>Common <span className="text-primary italic">Inquiries</span></Heading>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto">
        <Accordion className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <AccordionItem 
                value={`item-${index}`}
                className="bg-card border border-border rounded-2xl px-6 overflow-hidden hover:border-primary]/20 transition-all duration-300 shadow-2xl"
              >
                <AccordionTrigger className="text-left font-medium text-lg text-foreground hover:text-primary transition-colors py-6 hover:no-underline">
                  <div className="flex items-center gap-4">
                    <span className="text-primary/20 text-4xl">{`0${index + 1}`}</span>
                    {faq.question}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground font-medium pb-6 leading-relaxed text-base pl-14">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}
