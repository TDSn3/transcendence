import React, { useEffect, forwardRef, useState } from 'react';

interface FriendCardProps {
  text: string,
}

const Overlay = forwardRef<HTMLDivElement, FriendCardProps>(({ text }, ref) => {
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    const currentRef = (ref as React.RefObject<HTMLDivElement>).current;

    if (currentRef) {
      const handleMouseEnter = () => setIsHovered(true);
      const handleMouseLeave = () => setIsHovered(false);

      currentRef.addEventListener('mouseenter', handleMouseEnter);
      currentRef.addEventListener('mouseleave', handleMouseLeave);

      const updateStyle = () => {
        const { top, left, width } = currentRef.getBoundingClientRect();
        const newStyle = {
          top: isHovered ? `${top}px` : `${top + 16}px`,
          left: `${left + width / 2}px`,
          transform: 'translate(-50%, -50%)',
          opacity: isHovered ? 1 : 0,
        };

        setStyle(newStyle);
      };

      updateStyle();
      window.addEventListener('resize', updateStyle);
      window.addEventListener('scroll', updateStyle, true);

      return () => {
        currentRef.removeEventListener('mouseenter', handleMouseEnter);
        currentRef.removeEventListener('mouseleave', handleMouseLeave);
        window.removeEventListener('resize', updateStyle);
        window.removeEventListener('scroll', updateStyle, true);
      };
    }

    return (() => {});
  }, [ref, isHovered]);

  return <div className="overlay" style={style}>{text}</div>;
});

export default Overlay;
