"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
  MotionValue,
} from "framer-motion";
import {
  Children,
  cloneElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactElement,
  ReactNode,
} from "react";
import GlassSurface from "./GlassSurface";
import BackgroundSwitcher from "../BackgroundSwitcher";
import AccessibilityToggle from "../AccessibilityToggle";

interface DockItemChildProps {
  isHovered?: MotionValue<number>;
}

interface DockItemProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  focusable?: boolean;
  isActive?: boolean;
  itemId?: string;
  mouseX: MotionValue<number>;
  spring: { mass: number; stiffness: number; damping: number };
  distance: number;
  magnification: number;
  baseItemSize: number;
}

function DockItem({
  children,
  className = "",
  onClick,
  focusable = true,
  isActive = false,
  itemId,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize,
}: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: baseItemSize,
    };
    return val - rect.x - baseItemSize / 2;
  });

  const targetSize = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [baseItemSize, magnification, baseItemSize],
  );
  const size = useSpring(targetSize, spring);

  return (
    <motion.div
      ref={ref}
      style={{
        width: size,
        height: size,
      }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      className={`dock-item ${isActive ? "dock-item--active" : ""} ${className}`}
      tabIndex={focusable ? 0 : -1}
      role={focusable ? "button" : undefined}
      aria-haspopup={focusable ? "true" : undefined}
      aria-current={isActive ? "location" : undefined}
      data-active={isActive ? "true" : "false"}
      data-item-id={itemId}
    >
      {Children.map(children, (child) => {
        if (!child || typeof child !== "object" || !("type" in child))
          return child;
        return cloneElement(child as ReactElement<DockItemChildProps>, {
          isHovered,
        });
      })}
    </motion.div>
  );
}

interface DockLabelProps {
  children: ReactNode;
  className?: string;
  isHovered?: MotionValue<number>;
}

function DockLabel({ children, className = "", isHovered }: DockLabelProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    if (!isHovered) return;
    const unsubscribe = isHovered.on("change", (latest) => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  // On mobile (bottom dock): label goes up (-10)
  // On desktop (top dock): label goes down (+10)
  const yAnimation = isDesktop ? 10 : -10;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: yAnimation }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`dock-label ${className}`}
          role="tooltip"
          style={{ x: "-50%" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface DockIconProps {
  children: ReactNode;
  className?: string;
}

function DockIcon({ children, className = "" }: DockIconProps) {
  return <div className={`dock-icon ${className}`}>{children}</div>;
}

interface DockItemType {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
  isActive?: boolean;
  sectionId?: string;
}

interface DockProps {
  items: DockItemType[];
  className?: string;
  spring?: { mass: number; stiffness: number; damping: number };
  magnification?: number;
  distance?: number;
  panelHeight?: number;
  dockHeight?: number;
  baseItemSize?: number;
}

export default function Dock({
  items,
  className = "",
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 55,
  distance = 200,
  panelHeight = 80,
  dockHeight = 256,
  baseItemSize = 45,
}: DockProps) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);

  const maxHeight = useMemo(
    () => Math.max(dockHeight, magnification + magnification / 2 + 4),
    [magnification, dockHeight],
  );
  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const height = useSpring(heightRow, spring);

  return (
    <motion.div
      style={{ height, scrollbarWidth: "none" }}
      className="dock-outer"
    >
      <div
        className={`dock-panel-wrapper ${className}`}
        onMouseMove={(e) => {
          isHovered.set(1);
          mouseX.set(e.pageX);
        }}
        onMouseLeave={() => {
          isHovered.set(0);
          mouseX.set(Infinity);
        }}
      >
        <GlassSurface
          width="90vw"
          height={56}
          borderRadius={50}
          borderWidth={0.0}
          brightness={50}
          opacity={0.93}
          blur={15}
          displace={0.5}
          distortionScale={-180}
          redOffset={0}
          greenOffset={20}
          blueOffset={30}
          backgroundOpacity={0.1}
          saturation={1}
          className="dock-glass-panel"
        >
          <div
            className="dock-items-container"
            role="toolbar"
            aria-label="Application dock"
          >
            {items.map((item, index) => (
              <DockItem
                key={index}
                onClick={item.onClick}
                className={item.className}
                isActive={item.isActive}
                itemId={item.sectionId}
                mouseX={mouseX}
                spring={spring}
                distance={distance}
                magnification={magnification}
                baseItemSize={baseItemSize}
              >
                <DockIcon>{item.icon}</DockIcon>
                <DockLabel>{item.label}</DockLabel>
              </DockItem>
            ))}
            <DockItem
              mouseX={mouseX}
              spring={spring}
              distance={distance}
              magnification={magnification}
              baseItemSize={baseItemSize}
              focusable={false}
            >
              <BackgroundSwitcher />
              <DockLabel>Background</DockLabel>
            </DockItem>
            <DockItem
              mouseX={mouseX}
              spring={spring}
              distance={distance}
              magnification={magnification}
              baseItemSize={baseItemSize}
              focusable={false}
            >
              <AccessibilityToggle />
              <DockLabel>Accessibility</DockLabel>
            </DockItem>
          </div>
        </GlassSurface>
      </div>
    </motion.div>
  );
}
