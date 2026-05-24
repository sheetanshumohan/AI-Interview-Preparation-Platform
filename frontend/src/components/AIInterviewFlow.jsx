import React from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Bot, CheckCircle } from 'lucide-react';

const AIInterviewFlow = () => {
  return (
    <section id="how-it-works" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-secondary font-semibold tracking-widest uppercase text-sm mb-4 block">Workflow</span>
          <h2 className="text-4xl md:text-5xl font-semibold mb-8 leading-tight text-[var(--text-main)]">
            From Resume to <br />
            <span className="text-secondary">Ready for Hire.</span>
          </h2>
          
          <div className="space-y-8">
            {[
              { 
                icon: Upload, 
                title: "Upload your Resume", 
                desc: "Our AI parses your experience to understand your unique background." 
              },
              { 
                icon: Bot, 
                title: "Custom AI Session", 
                desc: "Get interviewed by an AI tailored to your target role and company culture." 
              },
              { 
                icon: CheckCircle, 
                title: "Improve & Repeat", 
                desc: "Review your AI scorecard, refine your answers, and go again." 
              }
            ].map((step, i) => (
              <div key={i} className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-black/5 border border-[var(--card-border)] flex items-center justify-center">
                  <step.icon className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-[var(--text-main)]">{step.title}</h4>
                  <p className="text-[var(--text-muted)] text-sm leading-relaxed font-semibold">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>


        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Visual Illustration of AI Flow */}
          <div className="glass rounded-[3rem] p-8 aspect-square flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-secondary/5 to-transparent"></div>
            
            <div className="relative z-10 flex flex-col items-center gap-8">
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-48 h-64 bg-black/5 border-2 border-dashed border-[var(--card-border)] rounded-2xl flex flex-col items-center justify-center gap-4 group-hover:border-secondary/50 transition-colors"
              >
                <FileText className="w-12 h-12 text-[var(--text-muted)] group-hover:text-secondary transition-colors" />
                <p className="text-xs text-[var(--text-muted)] font-medium">Drop Resume PDF</p>
              </motion.div>

              <div className="flex items-center gap-4">
                <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-secondary"></div>
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.5)]">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <div className="h-[2px] w-12 bg-gradient-to-l from-transparent to-secondary"></div>
              </div>

              <div className="text-center">
                <p className="text-[var(--text-main)] font-semibold mb-1">AI Generating Session...</p>
                <div className="flex gap-1 justify-center">
                  {[0, 1, 2].map(i => (
                    <motion.div 
                      key={i}
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      className="w-1.5 h-1.5 rounded-full bg-secondary"
                    ></motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Floating Badges */}
          <div className="absolute top-10 -right-4 glass px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-main)] shadow-xl animate-bounce">
            ATS Score: 94/100
          </div>
          <div className="absolute bottom-20 -left-8 glass px-4 py-2 rounded-xl text-xs font-semibold text-secondary shadow-xl animate-pulse">
            AI Matched: Netflix SDE II
          </div>

        </motion.div>
      </div>
    </section>
  );
};

export default AIInterviewFlow;
