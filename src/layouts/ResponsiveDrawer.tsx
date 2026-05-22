import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { memo, useEffect, useRef, type ReactNode } from 'react';

import type { DrawerPosition } from '@/types';

interface ResponsiveDrawerProps {
  open: boolean;
  onClose: () => void;
  position?: DrawerPosition;
  width?: string;
  height?: string;
  overlay?: boolean;
  ariaLabel?: string;
  children: ReactNode;
}

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

// Generic slide-over drawer / bottom-sheet used for tablet (notes from right)
// and mobile (notes from bottom). Handles overlay, ESC, focus trap, and motion.
export const ResponsiveDrawer = memo(
  ({
    open,
    onClose,
    position = 'right',
    width = '380px',
    height,
    overlay = true,
    ariaLabel = 'Drawer',
    children,
  }: ResponsiveDrawerProps) => {
    const panelRef = useRef<HTMLDivElement>(null);
    const previouslyFocused = useRef<HTMLElement | null>(null);
    const prefersReducedMotion = useReducedMotion();

    // ESC to close + simple focus trap.
    useEffect(() => {
      if (!open) return;
      previouslyFocused.current = document.activeElement as HTMLElement | null;

      const handleKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.stopPropagation();
          onClose();
          return;
        }
        if (e.key !== 'Tab' || !panelRef.current) return;

        const focusables = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;

        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      };

      // Focus the first focusable element when the drawer opens.
      const focusTimer = window.setTimeout(() => {
        const focusables = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
        focusables?.[0]?.focus();
      }, 30);

      window.addEventListener('keydown', handleKey);
      return () => {
        window.removeEventListener('keydown', handleKey);
        window.clearTimeout(focusTimer);
        previouslyFocused.current?.focus?.();
      };
    }, [open, onClose]);

    // Prevent background scroll while drawer is open.
    useEffect(() => {
      if (!open) return;
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }, [open]);

    const motionInitial = (() => {
      if (prefersReducedMotion) return { opacity: 0 };
      switch (position) {
        case 'right':
          return { x: '100%' };
        case 'left':
          return { x: '-100%' };
        case 'top':
          return { y: '-100%' };
        case 'bottom':
        default:
          return { y: '100%' };
      }
    })();

    const motionAnimate = prefersReducedMotion ? { opacity: 1 } : { x: 0, y: 0 };

    // Position + sizing classes per drawer side.
    const positionClasses = {
      right: 'top-0 right-0 h-full',
      left: 'top-0 left-0 h-full',
      top: 'top-0 left-0 right-0 w-full',
      bottom: 'bottom-0 left-0 right-0 w-full',
    }[position];

    const sizeStyle =
      position === 'right' || position === 'left'
        ? { width }
        : { height: height ?? '85vh' };

    return (
      <AnimatePresence>
        {open && (
          <div
            className="fixed inset-0 z-40"
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel}
          >
            {overlay && (
              <motion.div
                className="absolute inset-0 bg-slate-900/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.15 }}
                onClick={onClose}
              />
            )}

            <motion.div
              ref={panelRef}
              className={[
                'absolute z-10 flex max-h-full flex-col overflow-hidden bg-white shadow-2xl',
                positionClasses,
                position === 'bottom' ? 'rounded-t-2xl' : '',
                position === 'top' ? 'rounded-b-2xl' : '',
              ].join(' ')}
              style={sizeStyle}
              initial={motionInitial}
              animate={motionAnimate}
              exit={motionInitial}
              transition={{
                type: prefersReducedMotion ? 'tween' : 'spring',
                damping: 30,
                stiffness: 320,
                duration: prefersReducedMotion ? 0 : undefined,
              }}
            >
              {position === 'bottom' && (
                <div className="flex shrink-0 justify-center pt-2">
                  <span className="h-1 w-10 rounded-full bg-slate-300" />
                </div>
              )}
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                {children}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  },
);

ResponsiveDrawer.displayName = 'ResponsiveDrawer';
