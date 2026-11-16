"use client";

import { useEffect } from "react";

/** Native momentum scrolling; only discrete keyboard navigation is enhanced. */
export function HomeScroll() {
  useEffect(() => {
    const root = document.documentElement;
    const sections = Array.from(document.querySelectorAll<HTMLElement>(".flight-section"));
    const footer = document.querySelector<HTMLElement>(".site-footer");
    const destinations = footer ? [...sections, footer] : sections;
    const nav = document.querySelector<HTMLElement>(".site-nav");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = matchMedia("(max-width: 760px)");
    let destination: number | null = null;
    let navHeight = 0;
    const release = () => { destination = null; };
    const measure = () => {
      navHeight = nav?.getBoundingClientRect().height ?? 78;
      root.style.setProperty("--flight-nav-height", `${navHeight}px`);
      root.classList.toggle("home-snap-overflow", sections.some(section => section.getBoundingClientRect().height > innerHeight + 2));
      release();
    };
    const top = (node: HTMLElement) => node.getBoundingClientRect().top + scrollY - navHeight;
    const keydown = (event: KeyboardEvent) => {
      const direction = ({ ArrowDown: 1, PageDown: 1, ArrowUp: -1, PageUp: -1 } as Record<string, number>)[event.key];
      if (!direction) { release(); return; }
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || reduced.matches || mobile.matches) return;
      if (event.target instanceof Element && event.target.closest('input, textarea, select, audio, video, [contenteditable]:not([contenteditable="false"]), [role="slider"], [role="listbox"], [role="menu"], [role="tablist"]')) return;
      if (destination !== null && Math.abs(scrollY - top(destinations[destination])) < 2) release();
      let currentIndex = 0;
      destinations.forEach((node, index) => { if (top(node) <= scrollY + 2) currentIndex = index; });
      const current = destinations[currentIndex];
      const position = top(current);
      if (destination === null && current.offsetHeight > innerHeight + 2 &&
        ((direction > 0 && scrollY + innerHeight - navHeight < position + current.offsetHeight - 2) ||
         (direction < 0 && scrollY > position + 2))) return;
      const next = Math.max(0, Math.min(destinations.length - 1, (destination ?? currentIndex) + direction));
      if (next === currentIndex && destination === null) return;
      event.preventDefault();
      if (event.repeat) return;
      destination = next;
      destinations[next].scrollIntoView({ behavior: "smooth", block: "start" });
    };
    root.classList.add("home-snap");
    const observer = new ResizeObserver(measure);
    sections.forEach(section => observer.observe(section));
    if (nav) observer.observe(nav);
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("keydown", keydown);
    const releaseEvents = ["scrollend", "wheel", "touchstart", "pointerdown"];
    releaseEvents.forEach(type => window.addEventListener(type, release, { passive: true }));
    reduced.addEventListener("change", release);
    return () => {
      observer.disconnect();
      root.classList.remove("home-snap", "home-snap-overflow");
      root.style.removeProperty("--flight-nav-height");
      window.removeEventListener("resize", measure);
      window.removeEventListener("keydown", keydown);
      releaseEvents.forEach(type => window.removeEventListener(type, release));
      reduced.removeEventListener("change", release);
    };
  }, []);
  return null;
}
