import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAIStore = create(
    persist(
        (set) => ({
            questions: [],
            followUps: {},
            answers: {},
            filters: {
                role: "Full Stack Engineer",
                topic: "",
                difficulty: "Medium",
                count: 5
            },
            topicInput: "",
            
            setQuestions: (questions) => set({ questions }),
            setFollowUps: (followUps) => set((state) => ({ 
                followUps: typeof followUps === 'function' ? followUps(state.followUps) : followUps 
            })),
            setAnswers: (answers) => set((state) => ({ 
                answers: typeof answers === 'function' ? answers(state.answers) : answers 
            })),
            setFilters: (filters) => set({ filters }),
            setTopicInput: (topicInput) => set({ topicInput }),
            
            clearSession: () => set({ 
                questions: [], 
                followUps: {}, 
                answers: {},
                topicInput: ""
            })
        }),
        {
            name: 'ai-session-storage',
            storage: createJSONStorage(() => sessionStorage), // Only persist for the current tab session
        }
    )
);
