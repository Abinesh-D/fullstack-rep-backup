const SvgComponent = ({ color = '#ebd95f', direction = 'horizontal' }) => {
    const getCurvePath = () => {
      switch (direction) {
        case 'horizontal':
          return 'M -42 0 C -180 0 -141 0 -240 0';
        case 'vertical':
          return 'M 0 -42 C 0 -180 0 -141 0 -240';
        case 'diagonal':
          return 'M -42 -42 C -180 -180 -141 -141 -240 -240';
        default:
          return 'M -42 0 C -180 0 -141 0 -240 0';
      }
    };
  
    return (
      <svg width="300" height="100" viewBox="-250 -10 300 20" xmlns="http://www.w3.org/2000/svg">
        <g data-nodeid="e5d1d8a509b605f28eb5013d" className="node-connection" transform="translate(0, 0)">
          <path 
            d="M 0 -4.595 6.9643 0 0 4.595 6.9643 4.595 6.9643 -4.595 z" 
            transform="translate(-36.0357,0) scale(-1, 1)" 
            fill={color} 
            stroke="none"
          />
          <path 
            d="M 0.2 -4.4450 -0.1 -4.4450 -6.7396 0 -0.1 4.4450 0.2 4.4450" 
            transform="translate(-240.0477,0.0000)" 
            fill={color} 
            stroke="none" 
            opacity="1"
          />
          <path 
            fill="none" 
            strokeLinejoin="round" 
            strokeWidth="9.19" 
            d={getCurvePath()} 
            stroke={color}
          />
        </g>
      </svg>
    );
  };
  
  export default SvgComponent;
  