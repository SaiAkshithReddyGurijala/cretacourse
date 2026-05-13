// AI Buddy Service — Stub mode (no API key required)
// Replace the simulateResponse function with a real API call when ready

const STUDY_RESPONSES = {
    greetings: [
        "Hey! 👋 I'm your AI study buddy. Ask me anything about your course, or try one of the quick actions!",
        "Hi there! Ready to help you learn. What would you like to know?",
        "Welcome back! Let's dive into some learning. What's on your mind?",
    ],
    explain: [
        "Great question! Let me break that down for you:\n\n**Key Concept:** This topic involves understanding the fundamental building blocks. Think of it like learning the alphabet before writing sentences.\n\n**Why it matters:** Understanding this foundation will make everything else click into place.\n\n**Pro tip:** Try to implement a small example on your own — that's where the real learning happens! 🚀",
        "Here's a simplified explanation:\n\n1. **Start with the basics** — make sure you understand the prerequisites\n2. **Practice actively** — don't just watch, code along!\n3. **Build something small** — apply what you've learned to a mini project\n\nWant me to quiz you on this topic? 🧠",
    ],
    quiz: [
        "Let's test your knowledge! 🧠\n\n**Question:** What is the primary purpose of the concept you just learned?\n\nA) To make code run faster\nB) To organize and structure your approach\nC) To debug existing code\nD) To deploy applications\n\n*Think about it and reply with your answer!*",
        "Quick quiz time! ⚡\n\n**True or False:** The concept you're studying is primarily used for data processing.\n\n*Reply with True or False, and I'll let you know how you did!*",
    ],
    summarize: [
        "Here's a summary of your current phase:\n\n📋 **Overview:** This phase covers the core foundations you'll need for everything that follows.\n\n🎯 **Key Takeaways:**\n• Understand the basic terminology\n• Practice hands-on with real examples\n• Build muscle memory through repetition\n\n📊 **Your Progress:** Keep going! Every resource you complete brings you closer to mastery.\n\n💡 **Next Steps:** Focus on completing the remaining resources, then try building something on your own!",
    ],
    motivation: [
        "You're doing amazing! 🌟 Remember: every expert was once a beginner. Keep showing up every day and the results will follow.\n\n*\"The only way to learn a new programming language is by writing programs in it.\"* — Dennis Ritchie",
        "Keep pushing! 💪 Learning isn't always linear — sometimes you'll feel stuck, and that's totally normal. That's actually where the deepest learning happens.\n\n*\"It's not that I'm so smart, it's just that I stay with problems longer.\"* — Albert Einstein",
    ],
    default: [
        "That's an interesting question! While I'm running in offline mode right now, here's what I'd suggest:\n\n1. **Check the course resources** — the videos in your current phase likely cover this\n2. **Take notes** — writing things down helps retention by 40%!\n3. **Try to explain it** to someone else — if you can teach it, you understand it\n\nWant me to quiz you or summarize your current phase instead?",
        "Good thinking! 🤔 Here's my take:\n\n The best way to understand this is through practice. Try pausing the video at key moments and implementing what you see.\n\n*Tip: Use the Notes panel to jot down key points while watching!*\n\nAnything else you'd like to explore?",
    ],
};

const getRandomResponse = (category) => {
    const responses = STUDY_RESPONSES[category] || STUDY_RESPONSES.default;
    return responses[Math.floor(Math.random() * responses.length)];
};

const detectIntent = (message) => {
    const lower = message.toLowerCase();
    if (/^(hi|hey|hello|sup|yo|hola)/i.test(lower)) return 'greetings';
    if (/explain|what is|how does|tell me about|describe/i.test(lower)) return 'explain';
    if (/quiz|test|question|assess/i.test(lower)) return 'quiz';
    if (/summar|overview|recap|review/i.test(lower)) return 'summarize';
    if (/motivat|encourage|inspire|help me stay|i.*stuck|i.*tired/i.test(lower)) return 'motivation';
    return 'default';
};

export const sendMessage = async (message, context = {}) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

    const intent = detectIntent(message);
    let response = getRandomResponse(intent);

    // Add context awareness if available
    if (context.courseName && intent !== 'greetings') {
        response = `📚 *Re: ${context.courseName}${context.phaseName ? ` > ${context.phaseName}` : ''}*\n\n${response}`;
    }

    return response;
};

export const getQuickActions = () => [
    { label: '💡 Explain this topic', message: 'Explain the current topic I\'m studying' },
    { label: '🧠 Quiz me', message: 'Quiz me on what I\'ve learned so far' },
    { label: '📋 Summarize phase', message: 'Summarize my current phase' },
    { label: '🔥 Motivate me', message: 'I need some motivation to keep studying' },
];
