import { useEffect, useRef, useCallback } from "react";
import { debounce } from "../hooks/useThrottle";
import Spinner from './Spinner.tsx';
import { Spin3 } from "../components/Spin/Spin.tsx";

export default function InfiniteObserver({
  children,
  root = null,
  rootMargin = '0px',
  threshold = 0.1,
  disabled = false,
  debounceDelay = 500,
  onIntersect,
  spinner = false,
  spin3 = false,
  spinnerStyle,
  style,
}: any) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const resumeObserverDebounced = useCallback(
    debounce(() => {
      if (observerRef.current && sentinelRef.current) {
        observerRef.current.observe(sentinelRef.current);
      }
    }, debounceDelay),
    [debounceDelay]
  );
  
  useEffect (() => {
    if (!sentinelRef.current) return;

    observerRef.current = new IntersectionObserver((entries) => {
      if (disabled) return;

      const entry = entries[0];

      if (entry.isIntersecting) onIntersect?.(entry);
    }, {root, rootMargin, threshold});

    if (!disabled) observerRef.current.observe(sentinelRef.current);

    return () => observerRef.current?.disconnect();
  }, [root, rootMargin, threshold, disabled]);

  useEffect(() => {
    if (!observerRef.current || !sentinelRef.current) return;

    disabled ? observerRef.current.unobserve(sentinelRef.current) : resumeObserverDebounced();    
  }, [disabled, resumeObserverDebounced]);
    
  return (
    <div style={{position: 'relative', ...style}}>
      {children}

      {(disabled && spinner && !spin3) && <Spinner {...spinnerStyle}/>}

      {(disabled && spin3 && !spinner) && Spin3()}

      <div ref={sentinelRef} style={{height: '1px', width: '100%'}} />
    </div>
  );
};