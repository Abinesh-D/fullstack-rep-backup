import React, { useEffect } from 'react';
import './ScrollButtons.css';

const ScrollButtons = () => {

  useEffect(() => {
    const handleScroll = () => {
      const amountScrolled = 200;
      if (window.scrollY > amountScrolled) {
        document.querySelector('button.back-to-top').classList.add('show');
      } else {
        document.querySelector('button.back-to-top').classList.remove('show');
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="">
      <button
        className="back-to-top"
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
      </button>
    </div>
  );
};

export default ScrollButtons;
