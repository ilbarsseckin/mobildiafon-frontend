"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** gecikme (ms) - sirayla belirme icin */
  delay?: number;
  /** animasyon turu */
  variant?: "up" | "fade" | "zoom" | "left" | "right";
  /** ekstra class */
  className?: string;
  /** bir kez mi animasyon yapsin (varsayilan true) */
  once?: boolean;
  /** html etiketi (varsayilan div) */
  as?: "div" | "section" | "li";
};

export default function Reveal({
  children,
  delay = 0,
  variant = "up",
  className = "",
  once = true,
  as = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Hareket hassasiyeti olanlar icin: animasyonsuz hemen goster
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) obs.unobserve(entry.target);
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [once]);

  const Tag = as as any;
  return (
    <Tag
      ref={ref}
      className={`md-reveal md-reveal-${variant} ${visible ? "is-visible" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
