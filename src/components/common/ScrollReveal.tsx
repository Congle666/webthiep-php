import { ReactNode } from 'react';
import { motion, Variant } from 'framer-motion';

interface ScrollRevealProps {
  children: ReactNode;
  width?: 'fit-content' | '100%';
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
}

const directionMap: Record<string, { hidden: Variant; visible: Variant }> = {
  up: { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } },
  down: { hidden: { opacity: 0, y: -40 }, visible: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } },
  none: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
};

/**
 * Hiện nội dung khi cuộn tới (fade + slide). Dùng `whileInView` khai báo của Framer
 * (đáng tin, không race) thay vì useAnimation+useInView+useEffect (gây kẹt opacity:0
 * lúc được lúc không, nhất là dưới React StrictMode dev).
 */
export default function ScrollReveal({
  children,
  width = '100%',
  delay = 0,
  direction = 'up',
  className = '',
}: ScrollRevealProps) {
  const variants = directionMap[direction];

  return (
    <motion.div
      className={className}
      style={{ width }}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}
