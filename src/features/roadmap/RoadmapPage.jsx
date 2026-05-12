import React from 'react';
import { CheckCircle, Circle, Lock } from 'lucide-react';

const RoadmapPage = () => {
    const steps = [
        { title: 'Python Basics', status: 'completed', desc: 'Variables, Loops, Functions' },
        { title: 'NumPy & Pandas', status: 'completed', desc: 'Data Manipulation' },
        { title: 'PyTorch Fundamentals', status: 'current', desc: 'Tensors, Autograd' },
        { title: 'Neural Networks', status: 'locked', desc: 'Layers, Activation Functions' },
        { title: 'CNNs & RNNs', status: 'locked', desc: 'Computer Vision, NLP' },
        { title: 'Deployment', status: 'locked', desc: 'Serving Models' },
    ];

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-xl)', textAlign: 'center' }}>
                Your Learning Journey
            </h2>

            <div style={{ position: 'relative', padding: 'var(--spacing-lg)' }}>
                {/* Vertical Line */}
                <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: 0,
                    bottom: 0,
                    width: '4px',
                    background: 'var(--bg-tertiary)',
                    transform: 'translateX(-50%)',
                    zIndex: 0
                }}></div>

                {steps.map((step, index) => {
                    const isLeft = index % 2 === 0;
                    let Icon = Circle;
                    let color = 'var(--text-muted)';

                    if (step.status === 'completed') {
                        Icon = CheckCircle;
                        color = 'var(--secondary)';
                    } else if (step.status === 'current') {
                        Icon = Circle; // Pulse effect could be added
                        color = 'var(--primary)';
                    } else {
                        Icon = Lock;
                        color = 'var(--text-muted)';
                    }

                    return (
                        <div key={index} style={{ display: 'flex', justifyContent: isLeft ? 'flex-end' : 'flex-start', marginBottom: 'var(--spacing-2xl)', position: 'relative', zIndex: 1 }}>
                            <div
                                className="glass-panel"
                                style={{
                                    width: '45%',
                                    padding: 'var(--spacing-md)',
                                    position: 'relative',
                                    border: step.status === 'current' ? '1px solid var(--primary)' : '1px solid var(--glass-border)'
                                }}
                            >
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    [isLeft ? 'right' : 'left']: '-42px',
                                    transform: 'translateY(-50%)',
                                    background: 'var(--bg-primary)',
                                    borderRadius: '50%',
                                    padding: '4px',
                                    border: `2px solid ${color}`
                                }}>
                                    <Icon size={24} color={color} />
                                </div>

                                <h3 style={{ color: step.status === 'current' ? 'var(--primary)' : 'var(--text-primary)' }}>{step.title}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{step.desc}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RoadmapPage;
