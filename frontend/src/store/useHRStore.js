import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useHRStore = create(
    persist(
        (set) => ({
            questions: [],
            answers: {},
            evaluations: {},
            expandedId: null,
            
            setQuestions: (questions) => set({ questions }),
            setAnswers: (answers) => set((state) => ({ 
                answers: typeof answers === 'function' ? answers(state.answers) : answers 
            })),
            setEvaluations: (evaluations) => set((state) => ({ 
                evaluations: typeof evaluations === 'function' ? evaluations(state.evaluations) : evaluations 
            })),
            setExpandedId: (expandedId) => set({ expandedId }),
            
            clearSession: () => set({ 
                questions: [], 
                answers: {}, 
                evaluations: {},
                expandedId: null
            })
        }),
        {
            name: 'hr-session-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);
