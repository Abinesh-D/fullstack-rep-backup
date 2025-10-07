const Bot3D = () => (
    <div style={{ maxWidth: '280px', margin: '0 auto' }}>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 200"
            width="100%"
            height="100%"
        >
            <defs>
                <radialGradient id="botGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#a0c4ff" />
                    <stop offset="100%" stopColor="#4361ee" />
                </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="95" fill="url(#botGrad)" />
            <rect x="60" y="60" width="80" height="60" rx="15" fill="#ffffff" />
            <circle cx="85" cy="90" r="8" fill="#4361ee" />
            <circle cx="115" cy="90" r="8" fill="#4361ee" />
            <rect x="70" y="130" width="60" height="10" rx="5" fill="#ffffff" />
            <line x1="100" y1="35" x2="100" y2="55" stroke="#ffffff" strokeWidth="5" />
            <circle cx="100" cy="30" r="8" fill="#ffffff" />
        </svg>
        <p style={{ textAlign: 'center', color: '#6c757d', marginTop: '1rem' }}>
            Your AI Assistant is ready.
        </p>
    </div>
);

export default Bot3D;
