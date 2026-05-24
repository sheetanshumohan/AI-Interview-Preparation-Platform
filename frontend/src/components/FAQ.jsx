import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: "How realistic is the AI interviewer?",
    answer: "Our AI uses state-of-the-art LLMs trained on thousands of real-world interview transcripts from companies like Google, Meta, and Netflix to simulate a high-fidelity interview experience."
  },
  {
    question: "Does it support non-technical roles?",
    answer: "Yes! While we excel at technical coding interviews, PrepAI also supports behavioral, product management, marketing, and sales roles with dedicated question banks."
  },
  {
    question: "Can I use it on my mobile device?",
    answer: "Absolutely. Our platform is fully responsive, though for the best AI voice interaction experience, we recommend using a desktop with a good microphone."
  },
  {
    question: "How is my resume data handled?",
    answer: "Your privacy is our priority. Your resume is processed only to generate your custom interview session and is encrypted at rest. We never sell your data to third parties."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-semibold mb-4 text-[var(--text-main)]">Common <span className="text-primary italic">Questions.</span></h2>
          <p className="text-[var(--text-muted)] text-sm font-semibold">Everything you need to know about the platform.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="glass rounded-2xl overflow-hidden border border-[var(--card-border)]">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-black/5 transition-colors"
              >
                <span className="font-semibold text-[var(--text-main)]">{faq.question}</span>
                {openIndex === i ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-[var(--text-muted)]" />}
              </button>

              
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-8 pb-6 text-[var(--text-muted)] text-sm leading-relaxed border-t border-[var(--card-border)] pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
