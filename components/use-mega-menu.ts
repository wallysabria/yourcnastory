'use client';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from 'react';
import { megaMenuTiming } from '@/lib/navigation-config';

export function useMegaMenu() {
  const [active, setActive] = useState<number | null>(null);
  const [bridgeStyle, setBridgeStyle] = useState<CSSProperties>({});
  const current = useRef<number | null>(null);
  const nav = useRef<HTMLElement>(null);
  const triggers = useRef<(HTMLAnchorElement | HTMLButtonElement | null)[]>([]);
  const opening = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closing = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frame = useRef<number | null>(null);
  const pointer = useRef('mouse');
  const cancelTimers = useCallback(() => {
    if (opening.current !== null) clearTimeout(opening.current);
    if (closing.current !== null) clearTimeout(closing.current);
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    opening.current = closing.current = null;
    frame.current = null;
  }, []);
  const close = useCallback(() => {
    cancelTimers();
    current.current = null;
    setActive(null);
  }, [cancelTimers]);
  useEffect(() => {
    const outside = (event: globalThis.PointerEvent) => {
      if (!nav.current?.contains(event.target as Node)) close();
    };
    document.addEventListener('pointerdown', outside);
    window.addEventListener('resize', close);
    return () => {
      document.removeEventListener('pointerdown', outside);
      window.removeEventListener('resize', close);
      cancelTimers();
    };
  }, [cancelTimers, close]);
  function open(index: number) {
    cancelTimers();
    const header = nav.current?.closest('header')?.getBoundingClientRect();
    const trigger = triggers.current[index]?.getBoundingClientRect();
    if (header && trigger) {
      // The invisible trapezoid joins the label to the full-width panel below.
      setBridgeStyle({
        top: trigger.bottom - header.top,
        height: Math.max(0, header.bottom - trigger.bottom),
        clipPath: `polygon(${Math.max(0, trigger.left - header.left - 12)}px 0, ${Math.min(header.width, trigger.right - header.left + 12)}px 0, 100% 100%, 0 100%)`,
      });
    }
    current.current = index;
    setActive(index);
  }
  function enter(index: number, event: PointerEvent) {
    if (event.pointerType === 'touch') return;
    cancelTimers();
    if (current.current !== null) open(index);
    else opening.current = setTimeout(() => open(index), megaMenuTiming.openDelayMs);
  }
  function leave(event: PointerEvent) {
    if (event.pointerType === 'touch') return;
    cancelTimers();
    closing.current = setTimeout(() => {
      closing.current = null;
      const panel = document.getElementById('mega-' + current.current);
      if (!panel?.contains(document.activeElement)) close();
    }, megaMenuTiming.closeDelayMs);
  }
  function keyDown(index: number, event: KeyboardEvent) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (['Enter', ' ', 'ArrowDown'].includes(event.key)) {
      event.preventDefault();
      open(index);
      if (event.key === 'ArrowDown')
        frame.current = requestAnimationFrame(() => {
          if (current.current === index)
            document
              .getElementById('mega-' + index)
              ?.querySelector<HTMLElement>('a[href],button:not([disabled])')
              ?.focus();
        });
    }
  }
  function click(index: number, disabledDestination: boolean, event: MouseEvent) {
    if (disabledDestination) {
      event.preventDefault();
      if (current.current === index) close();
      else open(index);
    } else if (pointer.current === 'touch' && event.detail > 0 && current.current !== index) {
      event.preventDefault();
      open(index);
    } else close();
  }
  function escape(event: KeyboardEvent) {
    if (event.key === 'Escape' && current.current !== null) {
      event.preventDefault();
      event.stopPropagation();
      const trigger = triggers.current[current.current];
      close();
      trigger?.focus();
    }
  }
  return {
    active,
    bridgeStyle,
    nav,
    triggers,
    pointer,
    cancelTimers,
    close,
    enter,
    leave,
    keyDown,
    click,
    escape,
    focus(index: number) {
      if (current.current !== index) close();
      else cancelTimers();
    },
  };
}
