import { cn } from "@/lib/utils";
import type {
  CreateTypes as ConfettiInstance,
  GlobalOptions as ConfettiGlobalOptions,
  Options as ConfettiOptions,
} from "canvas-confetti";
import confetti from "canvas-confetti";
import { cva, type VariantProps } from "class-variance-authority";
import {
  AnimatePresence,
  motion,
  useInView,
  type Transition,
  type Variants,
} from "framer-motion";

type InViewMarginOptions = NonNullable<Parameters<typeof useInView>[1]>;
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Gem,
  Loader,
  Lock,
  Mail,
  PartyPopper,
  X,
} from "lucide-react";
import {
  Children,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type ComponentPropsWithoutRef,
  type FormEvent,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type SVGProps,
} from "react";
import "@/styles/glass-ui.css";

type Api = { fire: (options?: ConfettiOptions) => void };
export type ConfettiRef = Api | null;

const Confetti = forwardRef<
  ConfettiRef,
  ComponentPropsWithRef<"canvas"> & {
    options?: ConfettiOptions;
    globalOptions?: ConfettiGlobalOptions;
    manualstart?: boolean;
  }
>((props, ref) => {
  const {
    options,
    globalOptions = { resize: true, useWorker: true },
    manualstart = false,
    ...rest
  } = props;
  const instanceRef = useRef<ConfettiInstance | null>(null);
  const canvasRef = useCallback(
    (node: HTMLCanvasElement) => {
      if (node !== null) {
        if (instanceRef.current) return;
        instanceRef.current = confetti.create(node, {
          ...globalOptions,
          resize: true,
        });
      } else {
        if (instanceRef.current) {
          instanceRef.current.reset();
          instanceRef.current = null;
        }
      }
    },
    [globalOptions],
  );
  const fire = useCallback(
    (opts = {}) => instanceRef.current?.({ ...options, ...opts }),
    [options],
  );
  const api = useMemo(() => ({ fire }), [fire]);
  useImperativeHandle(ref, () => api, [api]);
  useEffect(() => {
    if (!manualstart) fire();
  }, [manualstart, fire]);
  return <canvas ref={canvasRef} {...rest} />;
});
Confetti.displayName = "Confetti";

export type TextLoopProps = {
  children: ReactNode[];
  className?: string;
  interval?: number;
  transition?: Transition;
  variants?: Variants;
  onIndexChange?: (index: number) => void;
  stopOnEnd?: boolean;
};

export function TextLoop({
  children,
  className,
  interval = 2,
  transition = { duration: 0.3 },
  variants,
  onIndexChange,
  stopOnEnd = false,
}: TextLoopProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const items = Children.toArray(children);
  useEffect(() => {
    const intervalMs = interval * 1000;
    const timer = setInterval(() => {
      setCurrentIndex((current) => {
        if (stopOnEnd && current === items.length - 1) {
          clearInterval(timer);
          return current;
        }
        const next = (current + 1) % items.length;
        onIndexChange?.(next);
        return next;
      });
    }, intervalMs);
    return () => clearInterval(timer);
  }, [items.length, interval, onIndexChange, stopOnEnd]);
  const motionVariants: Variants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
  };
  return (
    <div className={cn("relative inline-block whitespace-nowrap", className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={currentIndex}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={transition}
          variants={variants || motionVariants}
        >
          {items[currentIndex]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export interface BlurFadeProps {
  children: ReactNode;
  className?: string;
  variant?: {
    hidden: { y: number };
    visible: { y: number };
  };
  duration?: number;
  delay?: number;
  yOffset?: number;
  inView?: boolean;
  inViewMargin?: string;
  blur?: string;
}

export function BlurFade({
  children,
  className,
  variant,
  duration = 0.4,
  delay = 0,
  yOffset = 6,
  inView = true,
  inViewMargin = "-50px",
  blur = "6px",
}: BlurFadeProps) {
  const ref = useRef(null);
  const inViewResult = useInView(ref, {
    once: true,
    margin: inViewMargin as InViewMarginOptions["margin"],
  });
  const isInView = !inView || inViewResult;
  const defaultVariants: Variants = {
    hidden: { y: yOffset, opacity: 0, filter: `blur(${blur})` },
    visible: { y: -yOffset, opacity: 1, filter: `blur(0px)` },
  };
  const combinedVariants = variant || defaultVariants;
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      exit="hidden"
      variants={combinedVariants}
      transition={{ delay: 0.04 + delay, duration, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const glassButtonVariants = cva(
  "relative isolate cursor-pointer rounded-full transition-all",
  {
    variants: {
      size: {
        default: "text-base font-medium",
        sm: "text-sm font-medium",
        lg: "text-lg font-medium",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { size: "default" },
  },
);
const glassButtonTextVariants = cva(
  "glass-button-text relative block select-none tracking-tighter",
  {
    variants: {
      size: {
        default: "px-6 py-3.5",
        sm: "px-4 py-2",
        lg: "px-8 py-4",
        icon: "flex h-10 w-10 items-center justify-center",
      },
    },
    defaultVariants: { size: "default" },
  },
);

export interface GlassButtonProps
  extends ComponentPropsWithoutRef<"button">,
    VariantProps<typeof glassButtonVariants> {
  contentClassName?: string;
}

export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, children, size, contentClassName, onClick, ...props }, ref) => {
    const handleWrapperClick = (e: MouseEvent<HTMLDivElement>) => {
      const button = e.currentTarget.querySelector("button");
      if (button && e.target !== button) button.click();
    };
    return (
      <div
        className={cn("glass-button-wrap relative cursor-pointer rounded-full", className)}
        onClick={handleWrapperClick}
      >
        <button
          className={cn("glass-button relative z-10", glassButtonVariants({ size }))}
          ref={ref}
          onClick={onClick}
          {...props}
        >
          <span className={cn(glassButtonTextVariants({ size }), contentClassName)}>
            {children}
          </span>
        </button>
        <div className="glass-button-shadow pointer-events-none rounded-full"></div>
      </div>
    );
  },
);
GlassButton.displayName = "GlassButton";

export const GradientBackground = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 800 600"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid slice"
    className="absolute top-0 left-0 h-full w-full"
  >
    <defs>
      {/* Colour 1: soft lavender, top-right */}
      <radialGradient id="oc_g1" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="oklch(0.80 0.12 290)" stopOpacity="1" />
        <stop offset="100%" stopColor="oklch(0.80 0.12 290)" stopOpacity="0" />
      </radialGradient>
      {/* Colour 2: warm violet, bottom-left */}
      <radialGradient id="oc_g2" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="oklch(0.74 0.14 308)" stopOpacity="1" />
        <stop offset="100%" stopColor="oklch(0.74 0.14 308)" stopOpacity="0" />
      </radialGradient>
      <filter id="oc_blur" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="65" />
      </filter>
    </defs>
    <g className="oc-gradient-float1">
      <circle cx="660" cy="80" r="340" fill="url(#oc_g1)" filter="url(#oc_blur)" opacity="0.60" />
    </g>
    <g className="oc-gradient-float2">
      <circle cx="110" cy="520" r="300" fill="url(#oc_g2)" filter="url(#oc_blur)" opacity="0.50" />
    </g>
  </svg>
);

const GoogleIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="h-6 w-6">
    <g fillRule="evenodd" fill="none">
      <g fillRule="nonzero" transform="translate(3, 2)">
        <path
          fill="#4285F4"
          d="M57.8123233,30.1515267 C57.8123233,27.7263183 57.6155321,25.9565533 57.1896408,24.1212666 L29.4960833,24.1212666 L29.4960833,35.0674653 L45.7515771,35.0674653 C45.4239683,37.7877475 43.6542033,41.8844383 39.7213169,44.6372555 L39.6661883,45.0037254 L48.4223791,51.7870338 L49.0290201,51.8475849 C54.6004021,46.7020943 57.8123233,39.1313952 57.8123233,30.1515267"
        />
        <path
          fill="#34A853"
          d="M29.4960833,58.9921667 C37.4599129,58.9921667 44.1456164,56.3701671 49.0290201,51.8475849 L39.7213169,44.6372555 C37.2305867,46.3742596 33.887622,47.5868638 29.4960833,47.5868638 C21.6960582,47.5868638 15.0758763,42.4415991 12.7159637,35.3297782 L12.3700541,35.3591501 L3.26524241,42.4054492 L3.14617358,42.736447 C7.9965904,52.3717589 17.959737,58.9921667 29.4960833,58.9921667"
        />
        <path
          fill="#FBBC05"
          d="M12.7159637,35.3297782 C12.0932812,33.4944915 11.7329116,31.5279353 11.7329116,29.4960833 C11.7329116,27.4640054 12.0932812,25.4976752 12.6832029,23.6623884 L12.6667095,23.2715173 L3.44779955,16.1120237 L3.14617358,16.2554937 C1.14708246,20.2539019 0,24.7439491 0,29.4960833 C0,34.2482175 1.14708246,38.7380388 3.14617358,42.736447 L12.7159637,35.3297782"
        />
        <path
          fill="#EB4335"
          d="M29.4960833,11.4050769 C35.0347044,11.4050769 38.7707997,13.7975244 40.9011602,15.7968415 L49.2255853,7.66898166 C44.1130815,2.91684746 37.4599129,0 29.4960833,0 C17.959737,0 7.9965904,6.62018183 3.14617358,16.2554937 L12.6832029,23.6623884 C15.0758763,16.5505675 21.6960582,11.4050769 29.4960833,11.4050769"
        />
      </g>
    </g>
  </svg>
);

const GitHubIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="h-6 w-6">
    <path
      fill="currentColor"
      d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"
    />
  </svg>
);

const modalSteps = [
  { message: "Signing you up...", icon: <Loader className="h-12 w-12 animate-spin text-primary" /> },
  { message: "Onboarding you...", icon: <Loader className="h-12 w-12 animate-spin text-primary" /> },
  { message: "Finalizing...", icon: <Loader className="h-12 w-12 animate-spin text-primary" /> },
  { message: "Welcome Aboard!", icon: <PartyPopper className="h-12 w-12 text-green-500" /> },
];
const TEXT_LOOP_INTERVAL = 1.5;

const DefaultLogo = () => (
  <div className="bg-primary text-primary-foreground rounded-md p-1.5">
    <Gem className="h-4 w-4" />
  </div>
);

interface AuthComponentProps {
  logo?: ReactNode;
  brandName?: string;
}

export function AuthComponent({ logo = <DefaultLogo />, brandName = "EaseMize" }: AuthComponentProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authStep, setAuthStep] = useState("email");
  const [modalStatus, setModalStatus] = useState<"closed" | "loading" | "error" | "success">("closed");
  const [modalErrorMessage, setModalErrorMessage] = useState("");
  const confettiRef = useRef<ConfettiRef>(null);

  const isEmailValid = /\S+@\S+\.\S+/.test(email);
  const isPasswordValid = password.length >= 6;
  const isConfirmPasswordValid = confirmPassword.length >= 6;

  const passwordInputRef = useRef<HTMLInputElement>(null);
  const confirmPasswordInputRef = useRef<HTMLInputElement>(null);

  const fireSideCanons = () => {
    const fire = confettiRef.current?.fire;
    if (fire) {
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };
      const particleCount = 50;
      fire({ ...defaults, particleCount, origin: { x: 0, y: 1 }, angle: 60 });
      fire({ ...defaults, particleCount, origin: { x: 1, y: 1 }, angle: 120 });
    }
  };

  const handleFinalSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (modalStatus !== "closed" || authStep !== "confirmPassword") return;

    if (password !== confirmPassword) {
      setModalErrorMessage("Passwords do not match!");
      setModalStatus("error");
    } else {
      setModalStatus("loading");
      const loadingStepsCount = modalSteps.length - 1;
      const totalDuration = loadingStepsCount * TEXT_LOOP_INTERVAL * 1000;
      setTimeout(() => {
        fireSideCanons();
        setModalStatus("success");
      }, totalDuration);
    }
  };

  const handleProgressStep = () => {
    if (authStep === "email") {
      if (isEmailValid) setAuthStep("password");
    } else if (authStep === "password") {
      if (isPasswordValid) setAuthStep("confirmPassword");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleProgressStep();
    }
  };

  const handleGoBack = () => {
    if (authStep === "confirmPassword") {
      setAuthStep("password");
      setConfirmPassword("");
    } else if (authStep === "password") setAuthStep("email");
  };

  const closeModal = () => {
    setModalStatus("closed");
    setModalErrorMessage("");
  };

  useEffect(() => {
    if (authStep === "password") setTimeout(() => passwordInputRef.current?.focus(), 500);
    else if (authStep === "confirmPassword") setTimeout(() => confirmPasswordInputRef.current?.focus(), 500);
  }, [authStep]);

  useEffect(() => {
    if (modalStatus === "success") {
      fireSideCanons();
    }
  }, [modalStatus]);

  const Modal = () => (
    <AnimatePresence>
      {modalStatus !== "closed" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="bg-background/80 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="border-border bg-card/80 relative mx-2 flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl border-4 p-8"
          >
            {(modalStatus === "error" || modalStatus === "success") && (
              <button
                type="button"
                onClick={closeModal}
                className="text-muted-foreground hover:text-foreground absolute top-2 right-2 p-1 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
            {modalStatus === "error" && (
              <>
                <AlertCircle className="text-destructive h-12 w-12" />
                <p className="text-foreground text-lg font-medium">{modalErrorMessage}</p>
                <GlassButton type="button" onClick={closeModal} size="sm" className="mt-4">
                  Try Again
                </GlassButton>
              </>
            )}
            {modalStatus === "loading" && (
              <TextLoop interval={TEXT_LOOP_INTERVAL} stopOnEnd={true}>
                {modalSteps.slice(0, -1).map((step, i) => (
                  <div key={i} className="flex flex-col items-center gap-4">
                    {step.icon}
                    <p className="text-foreground text-lg font-medium">{step.message}</p>
                  </div>
                ))}
              </TextLoop>
            )}
            {modalStatus === "success" && (
              <div className="flex flex-col items-center gap-4">
                {modalSteps[modalSteps.length - 1].icon}
                <p className="text-foreground text-lg font-medium">
                  {modalSteps[modalSteps.length - 1].message}
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="bg-background flex min-h-screen w-screen flex-col">
      <Confetti
        ref={confettiRef}
        manualstart
        className="pointer-events-none fixed top-0 left-0 z-[999] h-full w-full"
      />
      <Modal />

      <div className="fixed top-4 left-4 z-20 flex items-center gap-2 md:left-1/2 md:-translate-x-1/2">
        {logo}
        <h1 className="text-foreground text-base font-bold">{brandName}</h1>
      </div>

      <div className="bg-card relative flex h-full w-full flex-1 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <GradientBackground />
        </div>
        <fieldset
          disabled={modalStatus !== "closed"}
          className="relative z-10 mx-auto flex w-[280px] flex-col items-center gap-8 p-4"
        >
          <AnimatePresence mode="wait">
            {authStep === "email" && (
              <motion.div
                key="email-content"
                initial={{ y: 6, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex w-full flex-col items-center gap-4"
              >
                <BlurFade delay={0.25 * 1} className="w-full">
                  <div className="text-center">
                    <p className="text-foreground font-serif text-4xl font-light tracking-tight sm:text-5xl md:text-6xl">
                      Get started with Us
                    </p>
                  </div>
                </BlurFade>
                <BlurFade delay={0.25 * 2}>
                  <p className="text-muted-foreground text-sm font-medium">Continue with</p>
                </BlurFade>
                <BlurFade delay={0.25 * 3}>
                  <div className="flex w-full items-center justify-center gap-4">
                    <GlassButton contentClassName="flex items-center justify-center gap-2" size="sm">
                      <GoogleIcon />
                      <span className="text-foreground font-semibold">Google</span>
                    </GlassButton>
                    <GlassButton contentClassName="flex items-center justify-center gap-2" size="sm">
                      <GitHubIcon />
                      <span className="text-foreground font-semibold">GitHub</span>
                    </GlassButton>
                  </div>
                </BlurFade>
                <BlurFade delay={0.25 * 4} className="w-[300px]">
                  <div className="flex w-full items-center gap-2 py-2">
                    <hr className="border-border w-full" />
                    <span className="text-muted-foreground text-xs font-semibold">OR</span>
                    <hr className="border-border w-full" />
                  </div>
                </BlurFade>
              </motion.div>
            )}
            {authStep === "password" && (
              <motion.div
                key="password-title"
                initial={{ y: 6, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex w-full flex-col items-center gap-4 text-center"
              >
                <BlurFade delay={0} className="w-full">
                  <div className="text-center">
                    <p className="text-foreground font-serif text-4xl font-light tracking-tight sm:text-5xl">
                      Create your password
                    </p>
                  </div>
                </BlurFade>
                <BlurFade delay={0.25 * 1}>
                  <p className="text-muted-foreground text-sm font-medium">
                    Your password must be at least 6 characters long.
                  </p>
                </BlurFade>
              </motion.div>
            )}
            {authStep === "confirmPassword" && (
              <motion.div
                key="confirm-title"
                initial={{ y: 6, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex w-full flex-col items-center gap-4 text-center"
              >
                <BlurFade delay={0} className="w-full">
                  <div className="text-center">
                    <p className="text-foreground font-serif text-4xl font-light tracking-tight sm:text-5xl">
                      One Last Step
                    </p>
                  </div>
                </BlurFade>
                <BlurFade delay={0.25 * 1}>
                  <p className="text-muted-foreground text-sm font-medium">
                    Confirm your password to continue
                  </p>
                </BlurFade>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleFinalSubmit} className="w-[300px] space-y-6">
            <AnimatePresence>
              {authStep !== "confirmPassword" && (
                <motion.div
                  key="email-password-fields"
                  exit={{ opacity: 0, filter: "blur(4px)" }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="w-full space-y-6"
                >
                  <BlurFade
                    delay={authStep === "email" ? 0.25 * 5 : 0}
                    inView={true}
                    className="w-full"
                  >
                    <div className="relative w-full">
                      <AnimatePresence>
                        {authStep === "password" && (
                          <motion.div
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.4 }}
                            className="absolute -top-6 left-4 z-10"
                          >
                            <label className="text-muted-foreground text-xs font-semibold">Email</label>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <div className="glass-input-wrap w-full">
                        <div className="glass-input">
                          <span className="glass-input-text-area"></span>
                          <div
                            className={cn(
                              "relative z-10 flex flex-shrink-0 items-center justify-center overflow-hidden transition-all duration-300 ease-in-out",
                              email.length > 20 && authStep === "email" ? "w-0 px-0" : "w-10 pl-2",
                            )}
                          >
                            <Mail className="text-foreground/80 h-5 w-5 flex-shrink-0" />
                          </div>
                          <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className={cn(
                              "text-foreground placeholder:text-foreground/60 relative z-10 h-full w-0 flex-grow bg-transparent transition-[padding-right] delay-300 duration-300 ease-in-out focus:outline-none",
                              isEmailValid && authStep === "email" ? "pr-2" : "pr-0",
                            )}
                          />
                          <div
                            className={cn(
                              "relative z-10 flex-shrink-0 overflow-hidden transition-all duration-300 ease-in-out",
                              isEmailValid && authStep === "email" ? "w-10 pr-1" : "w-0",
                            )}
                          >
                            <GlassButton
                              type="button"
                              onClick={handleProgressStep}
                              size="icon"
                              aria-label="Continue with email"
                              contentClassName="text-foreground/80 hover:text-foreground"
                            >
                              <ArrowRight className="h-5 w-5" />
                            </GlassButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  </BlurFade>
                  <AnimatePresence>
                    {authStep === "password" && (
                      <BlurFade key="password-field" className="w-full">
                        <div className="relative w-full">
                          <AnimatePresence>
                            {password.length > 0 && (
                              <motion.div
                                initial={{ y: -10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="absolute -top-6 left-4 z-10"
                              >
                                <label className="text-muted-foreground text-xs font-semibold">
                                  Password
                                </label>
                              </motion.div>
                            )}
                          </AnimatePresence>
                          <div className="glass-input-wrap w-full">
                            <div className="glass-input">
                              <span className="glass-input-text-area"></span>
                              <div className="relative z-10 flex w-10 flex-shrink-0 items-center justify-center pl-2">
                                {isPasswordValid ? (
                                  <button
                                    type="button"
                                    aria-label="Toggle password visibility"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-foreground/80 hover:text-foreground rounded-full p-2 transition-colors"
                                  >
                                    {showPassword ? (
                                      <EyeOff className="h-5 w-5" />
                                    ) : (
                                      <Eye className="h-5 w-5" />
                                    )}
                                  </button>
                                ) : (
                                  <Lock className="text-foreground/80 h-5 w-5 flex-shrink-0" />
                                )}
                              </div>
                              <input
                                ref={passwordInputRef}
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="text-foreground placeholder:text-foreground/60 relative z-10 h-full w-0 flex-grow bg-transparent focus:outline-none"
                              />
                              <div
                                className={cn(
                                  "relative z-10 flex-shrink-0 overflow-hidden transition-all duration-300 ease-in-out",
                                  isPasswordValid ? "w-10 pr-1" : "w-0",
                                )}
                              >
                                <GlassButton
                                  type="button"
                                  onClick={handleProgressStep}
                                  size="icon"
                                  aria-label="Submit password"
                                  contentClassName="text-foreground/80 hover:text-foreground"
                                >
                                  <ArrowRight className="h-5 w-5" />
                                </GlassButton>
                              </div>
                            </div>
                          </div>
                        </div>
                        <BlurFade inView delay={0.2}>
                          <button
                            type="button"
                            onClick={handleGoBack}
                            className="text-foreground/70 hover:text-foreground mt-4 flex items-center gap-2 text-sm transition-colors"
                          >
                            <ArrowLeft className="h-4 w-4" /> Go back
                          </button>
                        </BlurFade>
                      </BlurFade>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {authStep === "confirmPassword" && (
                <BlurFade key="confirm-password-field" className="w-full">
                  <div className="relative w-full">
                    <AnimatePresence>
                      {confirmPassword.length > 0 && (
                        <motion.div
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className="absolute -top-6 left-4 z-10"
                        >
                          <label className="text-muted-foreground text-xs font-semibold">
                            Confirm Password
                          </label>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className="glass-input-wrap w-[300px]">
                      <div className="glass-input">
                        <span className="glass-input-text-area"></span>
                        <div className="relative z-10 flex w-10 flex-shrink-0 items-center justify-center pl-2">
                          {isConfirmPasswordValid ? (
                            <button
                              type="button"
                              aria-label="Toggle confirm password visibility"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="text-foreground/80 hover:text-foreground rounded-full p-2 transition-colors"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          ) : (
                            <Lock className="text-foreground/80 h-5 w-5 flex-shrink-0" />
                          )}
                        </div>
                        <input
                          ref={confirmPasswordInputRef}
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm Password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="text-foreground placeholder:text-foreground/60 relative z-10 h-full w-0 flex-grow bg-transparent focus:outline-none"
                        />
                        <div
                          className={cn(
                            "relative z-10 flex-shrink-0 overflow-hidden transition-all duration-300 ease-in-out",
                            isConfirmPasswordValid ? "w-10 pr-1" : "w-0",
                          )}
                        >
                          <GlassButton
                            type="submit"
                            size="icon"
                            aria-label="Finish sign-up"
                            contentClassName="text-foreground/80 hover:text-foreground"
                          >
                            <ArrowRight className="h-5 w-5" />
                          </GlassButton>
                        </div>
                      </div>
                    </div>
                  </div>
                  <BlurFade inView delay={0.2}>
                    <button
                      type="button"
                      onClick={handleGoBack}
                      className="text-foreground/70 hover:text-foreground mt-4 flex items-center gap-2 text-sm transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" /> Go back
                    </button>
                  </BlurFade>
                </BlurFade>
              )}
            </AnimatePresence>
          </form>
        </fieldset>
      </div>
    </div>
  );
}
