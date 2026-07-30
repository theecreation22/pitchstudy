"use client";

import { type ReactNode, useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";

const MotionLink = motion.create(Link);

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
};

const MAX_TILT_DEGREES = 4;

/** A card that tilts toward the cursor and lights up its edge with the kickoff gradient on hover. */
export function TiltCard({ href, children, className = "" }: Props) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 220, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 220, damping: 20 });
  const glow = useTransform([springRotateX, springRotateY], ([rx, ry]: number[]) =>
    Math.min(1, (Math.abs(rx) + Math.abs(ry)) / MAX_TILT_DEGREES),
  );

  function handleMouseMove(event: React.MouseEvent<HTMLAnchorElement>) {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * MAX_TILT_DEGREES * 2);
    rotateX.set(-py * MAX_TILT_DEGREES * 2);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <MotionLink
      ref={ref}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.98 }}
      style={
        reduceMotion
          ? undefined
          : { rotateX: springRotateX, rotateY: springRotateY, transformPerspective: 800 }
      }
      className={`group relative ${className}`}
    >
      {!reduceMotion && (
        <motion.span
          aria-hidden="true"
          style={{ opacity: glow }}
          className="border-grad-kickoff pointer-events-none absolute inset-0 rounded-[inherit]"
        />
      )}
      {children}
    </MotionLink>
  );
}
