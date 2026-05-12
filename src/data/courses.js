export const COURSE_DATA = {
    id: 'pytorch-mastery',
    title: 'PyTorch Mastery: From Intuition to Production',
    description: 'A structured path to build intuition, code mastery, and deep understanding of PyTorch.',
    phases: [
        {
            id: 'phase-0',
            title: 'Phase 0: Neural Network Intuition',
            description: 'Build the animated "inner eye" for how neural networks work.',
            modules: [
                {
                    id: 'p0-m1',
                    title: '3Blue1Brown — Neural Networks',
                    resources: [
                        { id: 'aircAruvnKk', title: 'Part 1: But what is a Neural Network?', type: 'video', duration: '19:13' },
                        { id: 'IHZwWFHWa-w', title: 'Part 2: Gradient Descent, how neural networks learn', type: 'video', duration: '21:00' },
                        { id: 'Ilg3gGewQ5U', title: 'Part 3: What is backpropagation really doing?', type: 'video', duration: '13:53' },
                        { id: 'tIeHLnjs5U8', title: 'Part 4: Backpropagation calculus', type: 'video', duration: '10:17' }
                    ]
                },
                {
                    id: 'p0-m2',
                    title: 'Visualizing Core Concepts',
                    resources: [
                        { id: 'IHZwWFHWa-w?t=870', title: 'Gradient Descent Visualization', type: 'video', duration: '5:00' },
                        { id: 'tIeHLnjs5U8?t=300', title: 'Backpropagation Animation', type: 'video', duration: '5:00' }
                    ]
                }
            ]
        },
        {
            id: 'phase-1',
            title: 'Phase 1: PyTorch Fundamentals',
            description: 'Core PyTorch explained cleanly, visually, and deeply.',
            modules: [
                {
                    id: 'p1-m1',
                    title: 'Aladdin Persson — PyTorch Basics',
                    resources: [
                        { id: '9kJVYpOqcVU', title: 'PyTorch Tensor Basics', type: 'video', duration: '12:00' },
                        { id: 'MswxJw-8PvE', title: 'PyTorch Autograd Explained', type: 'video', duration: '15:00' },
                        { id: 'zg9lYmvE6aU', title: 'PyTorch GPU Support', type: 'video', duration: '8:00' },
                        { id: 'ZoZHd0Zm3RY', title: 'PyTorch Datasets & Dataloaders', type: 'video', duration: '18:00' },
                        { id: 'E-I2DNVzQLg', title: 'Building Neural Networks in PyTorch', type: 'video', duration: '20:00' }
                    ]
                },
                {
                    id: 'p1-m2',
                    title: 'Sentdex — Deep Learning with PyTorch',
                    resources: [
                        { id: 'BzcBsTou0C0', title: 'Introduction to PyTorch', type: 'video', duration: '22:00' },
                        { id: 'HPQgsNU0KxA', title: 'Training Model', type: 'video', duration: '25:00' }
                    ]
                }
            ]
        },
        {
            id: 'phase-2',
            title: 'Phase 2: Autograd + Internals',
            description: 'Your deepest interest: How it works under the hood.',
            modules: [
                {
                    id: 'p2-m1',
                    title: 'Deep Dive into Autograd',
                    resources: [
                        { id: 'MswxJw-8PvE', title: 'The Absolute Best Autograd Explanation', type: 'video', duration: '15:00' },
                        { id: 'q8SA3rM6ckI', title: 'How Backprop REALLY Works (StatQuest)', type: 'video', duration: '12:00' },
                        { id: 'Up7LcbGZFuo', title: 'Computation Graph Explained', type: 'video', duration: '10:00' },
                        { id: 'fK1A5p8pFxo', title: 'Why Zero Grad?', type: 'video', duration: '8:00' }
                    ]
                }
            ]
        },
        {
            id: 'phase-3',
            title: 'Phase 3: Training Loop Mastery',
            description: 'Making PyTorch automatic in your hands.',
            modules: [
                {
                    id: 'p3-m1',
                    title: 'Training Pipeline',
                    resources: [
                        { id: 'tV1feYKmdgY', title: 'Training Pipeline Deep Dive', type: 'video', duration: '30:00' },
                        { id: 'sDv4f4s2SB8', title: 'Gradient Descent (StatQuest)', type: 'video', duration: '20:00' },
                        { id: 'nhqo0u1a6fw', title: 'Adam & RMSprop (StatQuest)', type: 'video', duration: '18:00' },
                        { id: '9Jo-ZZaB13Y', title: 'Loss Functions Intuition', type: 'video', duration: '15:00' }
                    ]
                }
            ]
        },
        {
            id: 'phase-4',
            title: 'Phase 4: CNNs, RNNs, Transformers',
            description: 'The real stuff: Architectures.',
            modules: [
                {
                    id: 'p4-m1',
                    title: 'CNNs',
                    resources: [
                        { id: 'Atp-vtb_L8w', title: 'MNIST CNN from Scratch', type: 'video', duration: '25:00' },
                        { id: 'KuXjwB4LzSA', title: 'Convolution Explained Visually', type: 'video', duration: '15:00' }
                    ]
                },
                {
                    id: 'p4-m2',
                    title: 'RNNs & LSTMs',
                    resources: [
                        { id: 'LHXXI4-IEns', title: 'RNN Concepts (Visual)', type: 'video', duration: '12:00' },
                        { id: 'WCUNPb-5EYI', title: 'LSTM Explained', type: 'video', duration: '15:00' },
                        { id: '0_PZ7J16hmY', title: 'PyTorch RNN Implementation', type: 'video', duration: '20:00' }
                    ]
                },
                {
                    id: 'p4-m3',
                    title: 'Transformers',
                    resources: [
                        { id: 'eMlx5fFNoYc', title: 'Attention Animation (3B1B)', type: 'video', duration: '20:00' },
                        { id: 'OyFJWRnt_AY', title: 'Attention is All You Need Explained', type: 'video', duration: '18:00' },
                        { id: 'PaCmpygFfXo', title: 'Karpathy NanoGPT / Makemore', type: 'video', duration: '1:50:00' }
                    ]
                }
            ]
        },
        {
            id: 'phase-5',
            title: 'Phase 5: Real ML Projects',
            description: 'Applying knowledge to real code.',
            modules: [
                {
                    id: 'p5-m1',
                    title: 'Projects',
                    resources: [
                        { id: 'Atp-vtb_L8w', title: 'MNIST by Hand', type: 'video', duration: '25:00' },
                        { id: 'ZoZHd0Zm3RY', title: 'Custom Dataset Project', type: 'video', duration: '18:00' },
                        { id: 'kCc8FmEb1nY', title: 'Transformer Implementation (Karpathy)', type: 'video', duration: '2:00:00' }
                    ]
                }
            ]
        },
        {
            id: 'phase-6',
            title: 'Phase 6: Genomics / CRISPR',
            description: 'Domain specific application.',
            modules: [
                {
                    id: 'p6-m1',
                    title: 'Bio-Sequences',
                    resources: [
                        { id: 'ZbdujVEDabA', title: 'DNA Sequence Modeling', type: 'video', duration: '20:00' },
                        { id: '2O8NoxnZxw0', title: 'Transformers for Bio-Sequences', type: 'video', duration: '25:00' }
                    ]
                }
            ]
        }
    ]
};
