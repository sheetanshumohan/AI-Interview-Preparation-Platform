import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const plans = [
  {
    name: "Starter",
    price: "0",
    desc: "Perfect for students just starting out.",
    features: ["2 AI Mock Interviews", "Basic Scorecards", "Community Support", "Email Feedback"]
  },
  {
    name: "Pro",
    price: "29",
    featured: true,
    desc: "For serious candidates aiming for big tech.",
    features: ["Unlimited AI Interviews", "Advanced Vocal Analysis", "Custom Interviewers", "Priority Support", "ATS Resume Scans"]
  },
  {
    name: "Enterprise",
    price: "99",
    desc: "For bootcamps and universities.",
    features: ["Bulk User Management", "Detailed Progress Reports", "Custom Rubrics", "Dedicated Support"]
  }
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] -z-10"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold mb-4 text-[var(--text-main)]">Simple, Transparent <span className="text-primary italic px-2">Pricing.</span></h2>
          <p className="text-[var(--text-muted)] font-semibold">Unlock your full potential with our tailored plans.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`p-10 rounded-[2.5rem] relative ${plan.featured ? 'glass border-2 border-primary/50 shadow-[0_0_40px_rgba(0,210,255,0.2)]' : 'glass border border-[var(--card-border)]'}`}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-black text-xs font-semibold rounded-full uppercase tracking-widest">
                  Best Value
                </div>
              )}
              
              <h3 className="text-2xl font-semibold mb-2 text-[var(--text-main)]">{plan.name}</h3>
              <p className="text-[var(--text-muted)] text-sm mb-6 font-semibold">{plan.desc}</p>
              
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-semibold text-[var(--text-main)]">${plan.price}</span>
                <span className="text-[var(--text-muted)] font-semibold">/month</span>
              </div>


              <div className="space-y-4 mb-10">
                {plan.features.map((feature, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm text-[var(--text-muted)]">{feature}</span>
                  </div>
                ))}
              </div>

              <button className={`w-full py-4 rounded-2xl font-semibold transition-all ${plan.featured ? 'bg-primary text-black hover:bg-white' : 'bg-black/5 text-[var(--text-main)] hover:bg-black/10 border border-[var(--card-border)]'}`}>
                Get Started
              </button>

            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
