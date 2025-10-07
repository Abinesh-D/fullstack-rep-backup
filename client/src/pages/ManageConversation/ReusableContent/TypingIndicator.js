import React from 'react';

const TypingIndicator = () => {
  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    margin: '1rem',
  };

  const bubbleStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#e6e9f0',
    borderRadius: '20px',
    padding: '10px 14px',
    width: '60px',
  };

  const dotStyle = (delay) => ({
    width: '8px',
    height: '8px',
    margin: '0 3px',
    background: '#4361ee',
    borderRadius: '50%',
    display: 'inline-block',
    animation: `bounce 1.4s infinite ease-in-out both`,
    animationDelay: delay,
  });

  return (
    <div style={containerStyle}>
      <div style={bubbleStyle}>
        <span style={dotStyle('-0.32s')}></span>
        <span style={dotStyle('-0.16s')}></span>
        <span style={dotStyle('0s')}></span>
      </div>
      <style>
        {`
          @keyframes bounce {
            0%, 80%, 100% {
              transform: scale(0);
            }
            40% {
              transform: scale(1);
            }
          }

          @keyframes fadeText {
            0%, 100% { opacity: 0.4; transform: translateY(0); }
            50% { opacity: 1; transform: translateY(-2px); }
          }
        `}
      </style>
    </div>
  );
};

export default TypingIndicator;
