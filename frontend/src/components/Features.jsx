import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Sparkles, MessageSquare, Target, BarChart } from 'lucide-react';

const featureList = [
  {
    icon: Sparkles,
    title: "AI-Powered Realism",
    desc: "Our AI adapts its personality and questioning style based on your target role and seniority.",
    color: "from-blue-500 to-cyan-400"
  },
  {
    icon: MessageSquare,
    title: "Voice & Tone Analysis",
    desc: "Detailed feedback on your speaking pace, filler words, and vocal confidence levels.",
    color: "from-purple-500 to-pink-400"
  },
  {
    icon: Target,
    title: "Tailored Feedback",
    desc: "Get specific suggestions on how to improve your answers using the STAR method.",
    color: "from-orange-500 to-red-400"
  },
  {
    icon: Zap,
    title: "Instant Results",
    desc: "No waiting for human reviewers. Get an in-depth scorecard immediately after your session.",
    color: "from-green-500 to-emerald-400"
  },
  {
    icon: Shield,
    title: "Safe Environment",
    desc: "Practice without judgment in a stress-free environment before the high-stakes real deal.",
    color: "from-blue-600 to-indigo-500"
  },
  {
    icon: BarChart,
    title: "Progress Tracking",
    desc: "Visualize your improvement over time with our comprehensive dashboard analytics.",
    color: "from-yellow-400 to-orange-500"
  }
];

const Features = () => {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-semibold mb-4 text-[var(--text-main)]"
          >
            Smarter Preparation for <br />
            <span className="text-gradient">Modern Careers.</span>
          </motion.h2>
          <p className="text-[var(--text-muted)] max-w-xl mx-auto font-semibold">
            Everything you need to go from nervous candidate to confident hire, 
            driven by state-of-the-art AI technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureList.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className="p-8 rounded-[2rem] glass border border-[var(--card-border)] hover:border-primary/30 transition-all group"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} p-3.5 mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-full h-full text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[var(--text-main)]">{feature.title}</h3>
              <p className="text-[var(--text-muted)] leading-relaxed text-sm font-semibold">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
