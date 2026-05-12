export const parseCourseContent = (text) => {
    const lines = text.split('\n');
    const course = {
        id: `custom-course-${Date.now()}`,
        title: 'Custom Generated Course',
        description: 'Generated from your input.',
        phases: []
    };

    let currentPhase = null;
    let currentModule = null;

    lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) return;

        // Detect Phase (e.g., "Phase 1:", "PHASE 0", "Section 1")
        if (/^(phase|section)\s+\d+/i.test(trimmed) || trimmed.includes('🎥 PHASE')) {
            if (currentPhase) {
                if (currentModule) currentPhase.modules.push(currentModule);
                course.phases.push(currentPhase);
            }
            currentPhase = {
                id: `${course.id}-phase-${course.phases.length}`, // Unique ID: courseId-phase-index
                title: trimmed.replace(/[🎥]/g, '').trim(),
                description: '',
                modules: []
            };
            currentModule = null; // Reset module for new phase
            return;
        }

        // Detect Module/Topic (numbered list or bold text acting as header)
        if (/^\d+\./.test(trimmed) && !trimmed.includes('http')) {
            if (currentModule && currentPhase) {
                currentPhase.modules.push(currentModule);
            }
            currentModule = {
                id: `module-${Date.now()}-${Math.random()}`,
                title: trimmed.replace(/^\d+\.\s*/, ''),
                resources: []
            };
            return;
        }

        // Detect YouTube Links
        const urlMatch = trimmed.match(/(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)(?:&[\w=]+)?)/);
        if (urlMatch) {
            const videoId = urlMatch[2];
            const title = trimmed.replace(urlMatch[0], '').trim() || 'Video Resource';

            const resource = {
                id: videoId,
                title: title.replace(/^[-–]\s*/, '').trim(), // Remove leading dashes
                type: 'video',
                duration: '10:00' // Placeholder
            };

            if (!currentModule) {
                // Create a default module if none exists
                currentModule = {
                    id: `module-default-${Date.now()}`,
                    title: 'Resources',
                    resources: []
                };
            }
            currentModule.resources.push(resource);
        }
    });

    // Push the last items
    if (currentModule && currentPhase) currentPhase.modules.push(currentModule);
    if (currentPhase) course.phases.push(currentPhase);

    return course;
};
