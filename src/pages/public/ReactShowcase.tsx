/**
 * React Showcase - 10 State-of-the-Art React Capabilities
 *
 * Each demo represents an advanced pattern that would typically take
 * a week to implement properly. All in one place.
 */

import {
  useState,
  useTransition,
  useOptimistic,
  useReducer,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  createContext,
  useContext,
  forwardRef,
  useImperativeHandle,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { motion, useSpring, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';

// ============================================================================
// DEMO 1: Concurrent Rendering with useTransition
// ============================================================================

// Generate heavy list - simulates expensive computation
const generateItems = (search: string) => {
  const results: string[] = [];
  for (let i = 0; i < 10000; i++) {
    if (`Item ${i} - React Pattern`.toLowerCase().includes(search.toLowerCase()) || search === '') {
      results.push(`Item ${i} - React Pattern`);
    }
  }
  return results.slice(0, 100);
};

function Demo1_ConcurrentRendering() {
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();
  const [items, setItems] = useState<string[]>(() => generateItems(''));

  const handleSearch = (value: string) => {
    setQuery(value); // Urgent: update input immediately
    startTransition(() => {
      // Non-urgent: filter list can wait
      setItems(generateItems(value));
    });
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Type to search 10,000 items..."
          className="w-full px-4 py-3 rounded-lg border border-[var(--border)] dark:border-[var(--border-dark)]
                     bg-[var(--surface)] dark:bg-[var(--surface-dark)] text-[var(--text)] dark:text-[var(--text-dark)]
                     focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        />
        {isPending && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
      <div className="h-48 overflow-y-auto rounded-lg border border-[var(--border)] dark:border-[var(--border-dark)]
                      bg-[var(--surface)] dark:bg-[var(--surface-dark)] p-2">
        <div className={`transition-opacity ${isPending ? 'opacity-50' : 'opacity-100'}`}>
          {items.slice(0, 20).map((item, i) => (
            <div key={i} className="py-1 px-2 text-sm text-[var(--text-muted)] dark:text-[var(--text-dark-muted)]
                                    hover:bg-[var(--accent)]/10 rounded">
              {item}
            </div>
          ))}
          {items.length > 20 && (
            <div className="py-1 px-2 text-sm text-[var(--accent)]">
              +{items.length - 20} more results...
            </div>
          )}
        </div>
      </div>
      <p className="text-xs text-[var(--text-muted)] dark:text-[var(--text-dark-muted)]">
        useTransition keeps input responsive while filtering 10K items
      </p>
    </div>
  );
}

// ============================================================================
// DEMO 2: Optimistic Updates with useOptimistic (React 19)
// ============================================================================

interface Message {
  id: number;
  text: string;
  sending?: boolean;
}

function Demo2_OptimisticUpdates() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Welcome to the chat!' },
  ]);
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage: string) => [
      ...state,
      { id: Date.now(), text: newMessage, sending: true },
    ]
  );
  const [input, setInput] = useState('');
  const nextId = useRef(2);

  const sendMessage = async (text: string) => {
    addOptimisticMessage(text);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Confirm message
    setMessages((prev) => [
      ...prev,
      { id: nextId.current++, text },
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="h-48 overflow-y-auto rounded-lg border border-[var(--border)] dark:border-[var(--border-dark)]
                      bg-[var(--surface)] dark:bg-[var(--surface-dark)] p-3 space-y-2">
        {optimisticMessages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded-lg text-sm max-w-[80%] ${
              msg.sending
                ? 'ml-auto bg-[var(--accent)]/30 text-[var(--text)] dark:text-[var(--text-dark)] animate-pulse'
                : 'bg-[var(--accent)]/10 text-[var(--text)] dark:text-[var(--text-dark)]'
            }`}
          >
            {msg.text}
            {msg.sending && <span className="ml-2 text-xs opacity-60">Sending...</span>}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-lg border border-[var(--border)] dark:border-[var(--border-dark)]
                     bg-[var(--surface)] dark:bg-[var(--surface-dark)] text-[var(--text)] dark:text-[var(--text-dark)]
                     focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          Send
        </button>
      </form>
      <p className="text-xs text-[var(--text-muted)] dark:text-[var(--text-dark-muted)]">
        useOptimistic shows message instantly, confirms after 1.5s delay
      </p>
    </div>
  );
}

// ============================================================================
// DEMO 3: Compound Components Pattern (like Radix UI)
// ============================================================================

interface AccordionContextType {
  openItems: Set<string>;
  toggle: (id: string) => void;
}

const AccordionContext = createContext<AccordionContextType | null>(null);

function useAccordionContext() {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('Accordion components must be used within Accordion');
  return context;
}

interface AccordionRootProps {
  children: ReactNode;
  defaultOpen?: string[];
}

function AccordionRoot({ children, defaultOpen = [] }: AccordionRootProps) {
  const [openItems, setOpenItems] = useState(new Set(defaultOpen));

  const toggle = useCallback((id: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  return (
    <AccordionContext.Provider value={{ openItems, toggle }}>
      <div className="space-y-2">{children}</div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps {
  children: ReactNode;
  value: string;
}

const AccordionItemContext = createContext<string | null>(null);

function AccordionItem({ children, value }: AccordionItemProps) {
  return (
    <AccordionItemContext.Provider value={value}>
      <div className="border border-[var(--border)] dark:border-[var(--border-dark)] rounded-lg overflow-hidden">
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

function AccordionTrigger({ children }: { children: ReactNode }) {
  const { openItems, toggle } = useAccordionContext();
  const itemId = useContext(AccordionItemContext);
  if (!itemId) throw new Error('AccordionTrigger must be used within AccordionItem');

  const isOpen = openItems.has(itemId);

  return (
    <button
      onClick={() => toggle(itemId)}
      className="w-full px-4 py-3 flex items-center justify-between text-left
                 bg-[var(--surface)] dark:bg-[var(--surface-dark)]
                 text-[var(--text)] dark:text-[var(--text-dark)]
                 hover:bg-[var(--accent)]/5 transition-colors"
    >
      <span className="font-medium">{children}</span>
      <motion.span
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.2 }}
        className="text-[var(--accent)]"
      >
        ▼
      </motion.span>
    </button>
  );
}

function AccordionContent({ children }: { children: ReactNode }) {
  const { openItems } = useAccordionContext();
  const itemId = useContext(AccordionItemContext);
  if (!itemId) throw new Error('AccordionContent must be used within AccordionItem');

  const isOpen = openItems.has(itemId);

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="px-4 py-3 text-sm text-[var(--text-muted)] dark:text-[var(--text-dark-muted)]
                          bg-[var(--surface)] dark:bg-[var(--surface-dark)] border-t
                          border-[var(--border)] dark:border-[var(--border-dark)]">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Compound export
const Accordion = {
  Root: AccordionRoot,
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
};

function Demo3_CompoundComponents() {
  return (
    <div className="space-y-4">
      <Accordion.Root defaultOpen={['item-1']}>
        <Accordion.Item value="item-1">
          <Accordion.Trigger>What is the Compound Pattern?</Accordion.Trigger>
          <Accordion.Content>
            A design pattern where related components share implicit state through Context,
            allowing flexible composition while maintaining tight coupling where needed.
            Used by Radix UI, Headless UI, and Reach UI.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-2">
          <Accordion.Trigger>Why use Compound Components?</Accordion.Trigger>
          <Accordion.Content>
            They provide a clean API for users, hide implementation complexity,
            and allow for maximum flexibility in how components are composed together.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-3">
          <Accordion.Trigger>How does it work?</Accordion.Trigger>
          <Accordion.Content>
            Parent component provides Context, children consume it. This creates
            implicit communication between components without prop drilling.
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
      <p className="text-xs text-[var(--text-muted)] dark:text-[var(--text-dark-muted)]">
        Clean API: Accordion.Root → Accordion.Item → Accordion.Trigger + Content
      </p>
    </div>
  );
}

// ============================================================================
// DEMO 4: Type-Safe State Machine with useReducer
// ============================================================================

type FetchState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

type FetchAction<T> =
  | { type: 'FETCH' }
  | { type: 'SUCCESS'; data: T }
  | { type: 'ERROR'; error: string }
  | { type: 'RESET' };

function fetchReducer<T>(state: FetchState<T>, action: FetchAction<T>): FetchState<T> {
  switch (action.type) {
    case 'FETCH':
      return { status: 'loading' };
    case 'SUCCESS':
      return { status: 'success', data: action.data };
    case 'ERROR':
      return { status: 'error', error: action.error };
    case 'RESET':
      return { status: 'idle' };
    default:
      return state;
  }
}

interface User {
  name: string;
  email: string;
  avatar: string;
}

function Demo4_StateMachine() {
  const [state, dispatch] = useReducer(fetchReducer<User>, { status: 'idle' });

  const fetchUser = async () => {
    dispatch({ type: 'FETCH' });

    await new Promise((r) => setTimeout(r, 1000));

    // Random success/failure
    if (Math.random() > 0.3) {
      dispatch({
        type: 'SUCCESS',
        data: {
          name: 'Aryeh Lopian',
          email: 'aryeh@example.com',
          avatar: '👨‍💻',
        },
      });
    } else {
      dispatch({ type: 'ERROR', error: 'Failed to fetch user (simulated error)' });
    }
  };

  return (
    <div className="space-y-4">
      <div className="h-32 flex items-center justify-center rounded-lg border
                      border-[var(--border)] dark:border-[var(--border-dark)]
                      bg-[var(--surface)] dark:bg-[var(--surface-dark)]">
        {state.status === 'idle' && (
          <p className="text-[var(--text-muted)] dark:text-[var(--text-dark-muted)]">
            Click to fetch user data
          </p>
        )}
        {state.status === 'loading' && (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
            <span className="text-[var(--text-muted)] dark:text-[var(--text-dark-muted)]">Loading...</span>
          </div>
        )}
        {state.status === 'success' && (
          <div className="text-center">
            <div className="text-4xl mb-2">{state.data.avatar}</div>
            <div className="font-medium text-[var(--text)] dark:text-[var(--text-dark)]">
              {state.data.name}
            </div>
            <div className="text-sm text-[var(--text-muted)] dark:text-[var(--text-dark-muted)]">
              {state.data.email}
            </div>
          </div>
        )}
        {state.status === 'error' && (
          <div className="text-center text-red-500">
            <div className="text-2xl mb-1">⚠️</div>
            <div className="text-sm">{state.error}</div>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <button
          onClick={fetchUser}
          disabled={state.status === 'loading'}
          className="flex-1 px-4 py-2 bg-[var(--accent)] text-white rounded-lg
                     hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          Fetch User
        </button>
        <button
          onClick={() => dispatch({ type: 'RESET' })}
          className="px-4 py-2 border border-[var(--border)] dark:border-[var(--border-dark)]
                     text-[var(--text)] dark:text-[var(--text-dark)] rounded-lg
                     hover:bg-[var(--accent)]/10 transition-colors"
        >
          Reset
        </button>
      </div>
      <p className="text-xs text-[var(--text-muted)] dark:text-[var(--text-dark-muted)]">
        Discriminated unions make impossible states impossible
      </p>
    </div>
  );
}

// ============================================================================
// DEMO 5: Virtual Scrolling (render only visible items)
// ============================================================================

function Demo5_VirtualScrolling() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const itemHeight = 40;
  const containerHeight = 200;
  const totalItems = 10000;

  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    totalItems
  );

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  const visibleItems = useMemo(() => {
    const items = [];
    for (let i = visibleStart; i < visibleEnd; i++) {
      items.push(
        <div
          key={i}
          className="absolute left-0 right-0 px-4 flex items-center
                     text-sm text-[var(--text)] dark:text-[var(--text-dark)]
                     hover:bg-[var(--accent)]/10 border-b border-[var(--border)]/30
                     dark:border-[var(--border-dark)]/30"
          style={{
            height: itemHeight,
            top: i * itemHeight,
          }}
        >
          <span className="text-[var(--accent)] w-16">#{i + 1}</span>
          <span>Virtual Item - Only {visibleEnd - visibleStart} items rendered!</span>
        </div>
      );
    }
    return items;
  }, [visibleStart, visibleEnd]);

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="relative overflow-auto rounded-lg border border-[var(--border)]
                   dark:border-[var(--border-dark)] bg-[var(--surface)] dark:bg-[var(--surface-dark)]"
        style={{ height: containerHeight }}
      >
        <div style={{ height: totalItems * itemHeight, position: 'relative' }}>
          {visibleItems}
        </div>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-[var(--text-muted)] dark:text-[var(--text-dark-muted)]">
          Total: {totalItems.toLocaleString()} items
        </span>
        <span className="text-[var(--accent)]">
          Rendered: {visibleEnd - visibleStart} items
        </span>
      </div>
      <p className="text-xs text-[var(--text-muted)] dark:text-[var(--text-dark-muted)]">
        Scroll fast! Only visible items are in the DOM
      </p>
    </div>
  );
}

// ============================================================================
// DEMO 6: Gesture-Based Drag with Spring Physics
// ============================================================================

function Demo6_GesturePhysics() {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring physics
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  // Transform based on position
  const rotate = useTransform(springX, [-100, 100], [-15, 15]);
  const scale = useTransform(
    [springX, springY],
    ([latestX, latestY]) => {
      const distance = Math.sqrt((latestX as number) ** 2 + (latestY as number) ** 2);
      return 1 + distance / 500;
    }
  );

  const backgroundColor = useTransform(
    springX,
    [-100, 0, 100],
    ['#ef4444', 'var(--accent)', '#22c55e']
  );

  return (
    <div className="space-y-4">
      <div
        ref={constraintsRef}
        className="h-48 rounded-lg border border-[var(--border)] dark:border-[var(--border-dark)]
                   bg-[var(--surface)] dark:bg-[var(--surface-dark)] relative overflow-hidden"
      >
        <motion.div
          drag
          dragConstraints={constraintsRef}
          dragElastic={0.1}
          style={{
            x: springX,
            y: springY,
            rotate,
            scale,
            backgroundColor,
          }}
          onDrag={(_, info) => {
            x.set(info.offset.x);
            y.set(info.offset.y);
          }}
          onDragEnd={() => {
            x.set(0);
            y.set(0);
          }}
          whileTap={{ cursor: 'grabbing' }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                     w-20 h-20 rounded-xl cursor-grab flex items-center justify-center
                     text-white font-bold shadow-lg"
        >
          Drag me
        </motion.div>
        <div className="absolute bottom-2 left-2 right-2 flex justify-between text-xs
                        text-[var(--text-muted)] dark:text-[var(--text-dark-muted)]">
          <span>← Red</span>
          <span>Green →</span>
        </div>
      </div>
      <p className="text-xs text-[var(--text-muted)] dark:text-[var(--text-dark-muted)]">
        Spring physics + drag gestures + dynamic transforms
      </p>
    </div>
  );
}

// ============================================================================
// DEMO 7: Portal with Focus Trap (Accessible Modal)
// ============================================================================

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  // Focus trap
  useEffect(() => {
    if (isOpen) {
      previousFocus.current = document.activeElement as HTMLElement;
      modalRef.current?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
        if (e.key === 'Tab') {
          const focusable = modalRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (!focusable?.length) return;

          const first = focusable[0] as HTMLElement;
          const last = focusable[focusable.length - 1] as HTMLElement;

          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
        previousFocus.current?.focus();
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          ref={modalRef}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          tabIndex={-1}
          className="relative bg-[var(--bg)] dark:bg-[var(--bg-dark)] rounded-xl
                     shadow-2xl p-6 max-w-md w-full outline-none"
          role="dialog"
          aria-modal="true"
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

function Demo7_PortalFocusTrap() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg border border-[var(--border)] dark:border-[var(--border-dark)]
                      bg-[var(--surface)] dark:bg-[var(--surface-dark)]">
        <p className="text-sm text-[var(--text-muted)] dark:text-[var(--text-dark-muted)] mb-4">
          Modal renders in a Portal (outside React tree), with full keyboard navigation
          and focus trap for accessibility.
        </p>
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          Open Modal
        </button>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h3 className="text-lg font-semibold mb-4 text-[var(--text)] dark:text-[var(--text-dark)]">
          Accessible Modal
        </h3>
        <p className="text-sm text-[var(--text-muted)] dark:text-[var(--text-dark-muted)] mb-4">
          Try pressing Tab - focus is trapped inside. Press Escape to close.
          When closed, focus returns to the trigger button.
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Try tabbing here..."
            className="flex-1 px-3 py-2 rounded border border-[var(--border)] dark:border-[var(--border-dark)]
                       bg-[var(--surface)] dark:bg-[var(--surface-dark)]
                       text-[var(--text)] dark:text-[var(--text-dark)]"
          />
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg"
          >
            Close
          </button>
        </div>
      </Modal>

      <p className="text-xs text-[var(--text-muted)] dark:text-[var(--text-dark-muted)]">
        createPortal + focus management + keyboard navigation
      </p>
    </div>
  );
}

// ============================================================================
// DEMO 8: Infinite Scroll with Intersection Observer
// ============================================================================

function Demo8_InfiniteScroll() {
  const [items, setItems] = useState<number[]>(() =>
    Array.from({ length: 20 }, (_, i) => i + 1)
  );
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          setLoading(true);

          // Simulate API call
          setTimeout(() => {
            setItems((prev) => [
              ...prev,
              ...Array.from({ length: 10 }, (_, i) => prev.length + i + 1),
            ]);
            setLoading(false);
          }, 800);
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [loading]);

  return (
    <div className="space-y-4">
      <div className="h-48 overflow-y-auto rounded-lg border border-[var(--border)]
                      dark:border-[var(--border-dark)] bg-[var(--surface)] dark:bg-[var(--surface-dark)]">
        {items.map((item) => (
          <div
            key={item}
            className="px-4 py-2 border-b border-[var(--border)]/30 dark:border-[var(--border-dark)]/30
                       text-sm text-[var(--text)] dark:text-[var(--text-dark)]"
          >
            <span className="text-[var(--accent)]">#{item}</span> Infinitely loaded item
          </div>
        ))}
        <div
          ref={observerRef}
          className="px-4 py-4 text-center text-sm text-[var(--text-muted)] dark:text-[var(--text-dark-muted)]"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
              Loading more...
            </div>
          ) : (
            'Scroll for more...'
          )}
        </div>
      </div>
      <p className="text-xs text-[var(--text-muted)] dark:text-[var(--text-dark-muted)]">
        IntersectionObserver triggers load when sentinel enters viewport
      </p>
    </div>
  );
}

// ============================================================================
// DEMO 9: useSyncExternalStore (External State Subscription)
// ============================================================================

// External store (like Redux, Zustand, or browser APIs)
function createWindowSizeStore() {
  let listeners: (() => void)[] = [];

  const getSnapshot = () => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  const subscribe = (listener: () => void) => {
    listeners.push(listener);
    window.addEventListener('resize', listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
      window.removeEventListener('resize', listener);
    };
  };

  return { getSnapshot, subscribe };
}

const windowSizeStore = createWindowSizeStore();

function useWindowSize() {
  return useSyncExternalStore(
    windowSizeStore.subscribe,
    windowSizeStore.getSnapshot,
    () => ({ width: 0, height: 0 }) // Server snapshot
  );
}

// Online status store
function createOnlineStore() {
  const getSnapshot = () => navigator.onLine;
  const subscribe = (listener: () => void) => {
    window.addEventListener('online', listener);
    window.addEventListener('offline', listener);
    return () => {
      window.removeEventListener('online', listener);
      window.removeEventListener('offline', listener);
    };
  };
  return { getSnapshot, subscribe };
}

const onlineStore = createOnlineStore();

function useOnlineStatus() {
  return useSyncExternalStore(
    onlineStore.subscribe,
    onlineStore.getSnapshot,
    () => true
  );
}

function Demo9_ExternalStore() {
  const windowSize = useWindowSize();
  const isOnline = useOnlineStatus();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg border border-[var(--border)] dark:border-[var(--border-dark)]
                        bg-[var(--surface)] dark:bg-[var(--surface-dark)] text-center">
          <div className="text-2xl font-bold text-[var(--accent)]">
            {windowSize.width} × {windowSize.height}
          </div>
          <div className="text-xs text-[var(--text-muted)] dark:text-[var(--text-dark-muted)] mt-1">
            Window Size (resize to see update)
          </div>
        </div>
        <div className="p-4 rounded-lg border border-[var(--border)] dark:border-[var(--border-dark)]
                        bg-[var(--surface)] dark:bg-[var(--surface-dark)] text-center">
          <div className="text-2xl font-bold">
            {isOnline ? (
              <span className="text-green-500">● Online</span>
            ) : (
              <span className="text-red-500">● Offline</span>
            )}
          </div>
          <div className="text-xs text-[var(--text-muted)] dark:text-[var(--text-dark-muted)] mt-1">
            Network Status
          </div>
        </div>
      </div>
      <p className="text-xs text-[var(--text-muted)] dark:text-[var(--text-dark-muted)]">
        useSyncExternalStore subscribes to browser APIs with React integration
      </p>
    </div>
  );
}

// ============================================================================
// DEMO 10: useImperativeHandle with forwardRef
// ============================================================================

interface VideoPlayerHandle {
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  getDuration: () => number;
}

const DURATION = 180; // 3 minutes fake video

const VideoPlayer = forwardRef<VideoPlayerHandle, object>(
  function VideoPlayer(_, ref) {
    const [state, setState] = useState({ playing: false, currentTime: 0 });

    useImperativeHandle(ref, () => ({
      play: () => {
        setState((s) => ({ ...s, playing: true }));
      },
      pause: () => {
        setState((s) => ({ ...s, playing: false }));
      },
      seek: (time: number) => {
        setState((s) => ({ ...s, currentTime: Math.min(time, DURATION) }));
      },
      getDuration: () => DURATION,
    }));

    // Simulate playback
    useEffect(() => {
      if (!state.playing) return;
      const interval = setInterval(() => {
        setState((s) => {
          const newTime = Math.min(s.currentTime + 1, DURATION);
          if (newTime >= DURATION) {
            return { playing: false, currentTime: newTime };
          }
          return { ...s, currentTime: newTime };
        });
      }, 1000);
      return () => clearInterval(interval);
    }, [state.playing]);

    const progress = (state.currentTime / DURATION) * 100;

    return (
      <div className="p-4 rounded-lg border border-[var(--border)] dark:border-[var(--border-dark)]
                      bg-[var(--surface)] dark:bg-[var(--surface-dark)]">
        <div className="flex items-center justify-center h-20 mb-4 rounded bg-black/20">
          <span className="text-4xl">{state.playing ? '▶️' : '⏸️'}</span>
        </div>
        <div className="space-y-2">
          <div className="h-2 bg-[var(--border)] dark:bg-[var(--border-dark)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--accent)] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-[var(--text-muted)] dark:text-[var(--text-dark-muted)]">
            <span>{Math.floor(state.currentTime / 60)}:{(state.currentTime % 60).toString().padStart(2, '0')}</span>
            <span>{Math.floor(DURATION / 60)}:{(DURATION % 60).toString().padStart(2, '0')}</span>
          </div>
        </div>
      </div>
    );
  }
);

function Demo10_ImperativeHandle() {
  const playerRef = useRef<VideoPlayerHandle>(null);

  return (
    <div className="space-y-4">
      <VideoPlayer ref={playerRef} />
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={() => playerRef.current?.play()}
          className="px-3 py-2 bg-[var(--accent)] text-white rounded-lg text-sm hover:opacity-90"
        >
          Play
        </button>
        <button
          onClick={() => playerRef.current?.pause()}
          className="px-3 py-2 border border-[var(--border)] dark:border-[var(--border-dark)]
                     text-[var(--text)] dark:text-[var(--text-dark)] rounded-lg text-sm hover:bg-[var(--accent)]/10"
        >
          Pause
        </button>
        <button
          onClick={() => playerRef.current?.seek(0)}
          className="px-3 py-2 border border-[var(--border)] dark:border-[var(--border-dark)]
                     text-[var(--text)] dark:text-[var(--text-dark)] rounded-lg text-sm hover:bg-[var(--accent)]/10"
        >
          Reset
        </button>
        <button
          onClick={() => playerRef.current?.seek(90)}
          className="px-3 py-2 border border-[var(--border)] dark:border-[var(--border-dark)]
                     text-[var(--text)] dark:text-[var(--text-dark)] rounded-lg text-sm hover:bg-[var(--accent)]/10"
        >
          Skip 50%
        </button>
      </div>
      <p className="text-xs text-[var(--text-muted)] dark:text-[var(--text-dark-muted)]">
        Parent controls child through imperative API (forwardRef + useImperativeHandle)
      </p>
    </div>
  );
}

// ============================================================================
// MAIN SHOWCASE PAGE
// ============================================================================

interface DemoCardProps {
  number: number;
  title: string;
  subtitle: string;
  children: ReactNode;
}

function DemoCard({ number, title, subtitle, children }: DemoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className="p-6 rounded-xl border border-[var(--border)] dark:border-[var(--border-dark)]
                 bg-[var(--bg)] dark:bg-[var(--bg-dark)] shadow-sm"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--accent)]
                        flex items-center justify-center text-white font-bold">
          {number}
        </div>
        <div>
          <h3 className="font-semibold text-[var(--text)] dark:text-[var(--text-dark)]">
            {title}
          </h3>
          <p className="text-sm text-[var(--text-muted)] dark:text-[var(--text-dark-muted)]">
            {subtitle}
          </p>
        </div>
      </div>
      {children}
    </motion.div>
  );
}

export function ReactShowcase() {
  return (
    <div className="min-h-screen bg-[var(--bg)] dark:bg-[var(--bg-dark)]">
      {/* Hero */}
      <div className="py-16 px-4 text-center border-b border-[var(--border)] dark:border-[var(--border-dark)]">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-4 text-[var(--text)] dark:text-[var(--text-dark)]"
        >
          React <span className="text-[var(--accent)]">State of the Art</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-[var(--text-muted)] dark:text-[var(--text-dark-muted)] max-w-2xl mx-auto"
        >
          10 advanced React patterns that would take a week each to implement properly.
          <br />All in one page, all interactive.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 flex items-center justify-center gap-4 text-sm text-[var(--text-muted)] dark:text-[var(--text-dark-muted)]"
        >
          <span className="px-3 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)]">
            React 19
          </span>
          <span className="px-3 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)]">
            TypeScript
          </span>
          <span className="px-3 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)]">
            Framer Motion
          </span>
        </motion.div>
      </div>

      {/* Demos Grid */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid gap-8">
          <DemoCard
            number={1}
            title="Concurrent Rendering"
            subtitle="useTransition keeps UI responsive during heavy computations"
          >
            <Demo1_ConcurrentRendering />
          </DemoCard>

          <DemoCard
            number={2}
            title="Optimistic Updates"
            subtitle="useOptimistic shows changes instantly before server confirms"
          >
            <Demo2_OptimisticUpdates />
          </DemoCard>

          <DemoCard
            number={3}
            title="Compound Components"
            subtitle="Flexible, composable API pattern like Radix UI"
          >
            <Demo3_CompoundComponents />
          </DemoCard>

          <DemoCard
            number={4}
            title="Type-Safe State Machine"
            subtitle="Discriminated unions make impossible states impossible"
          >
            <Demo4_StateMachine />
          </DemoCard>

          <DemoCard
            number={5}
            title="Virtual Scrolling"
            subtitle="Render only visible items from 10,000+ list"
          >
            <Demo5_VirtualScrolling />
          </DemoCard>

          <DemoCard
            number={6}
            title="Gesture-Based Physics"
            subtitle="Drag gestures with spring physics and dynamic transforms"
          >
            <Demo6_GesturePhysics />
          </DemoCard>

          <DemoCard
            number={7}
            title="Portal with Focus Trap"
            subtitle="Accessible modal with keyboard navigation"
          >
            <Demo7_PortalFocusTrap />
          </DemoCard>

          <DemoCard
            number={8}
            title="Infinite Scroll"
            subtitle="IntersectionObserver-based lazy loading"
          >
            <Demo8_InfiniteScroll />
          </DemoCard>

          <DemoCard
            number={9}
            title="External Store Subscription"
            subtitle="useSyncExternalStore for browser API integration"
          >
            <Demo9_ExternalStore />
          </DemoCard>

          <DemoCard
            number={10}
            title="Imperative Handle"
            subtitle="Parent controls child through custom API"
          >
            <Demo10_ImperativeHandle />
          </DemoCard>
        </div>
      </div>

      {/* Footer */}
      <div className="py-8 text-center border-t border-[var(--border)] dark:border-[var(--border-dark)]">
        <p className="text-sm text-[var(--text-muted)] dark:text-[var(--text-dark-muted)]">
          Built with React 19 + TypeScript + Framer Motion
        </p>
      </div>
    </div>
  );
}
