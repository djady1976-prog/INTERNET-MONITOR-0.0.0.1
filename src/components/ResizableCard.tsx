import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ThemeColors, SupportedLanguage } from '../types';
import { translations } from '../i18n/translations';
import { cyberSound } from '../utils/cyberSound';
import {
  ChevronUp,
  ChevronDown,
  RotateCcw,
  Maximize2,
  Minimize2,
  Columns,
  GripHorizontal,
} from 'lucide-react';

export type CardColSpan = '1' | '2' | '3';
export type CardHeightPreset = 'auto' | 'compact' | 'standard' | 'large';

export interface CardDimensionState {
  colSpan: CardColSpan;
  height?: number;
  heightPreset?: CardHeightPreset;
  isCollapsed?: boolean;
}

interface ResizableCardProps {
  id: string;
  title?: string;
  icon?: React.ReactNode;
  theme: ThemeColors;
  lang: SupportedLanguage;
  dimensions?: CardDimensionState;
  defaultColSpan?: CardColSpan;
  defaultHeight?: number;
  onDimensionChange?: (id: string, updated: Partial<CardDimensionState>) => void;
  children: React.ReactNode;
  className?: string;
}

const PRESET_HEIGHTS: Record<Exclude<CardHeightPreset, 'auto'>, number> = {
  compact: 290,
  standard: 410,
  large: 560,
};

export const ResizableCard: React.FC<ResizableCardProps> = ({
  id,
  title,
  icon,
  theme,
  lang,
  dimensions,
  defaultColSpan = '1',
  defaultHeight,
  onDimensionChange,
  children,
  className = '',
}) => {
  const t = translations[lang] || translations.ro;

  const colSpan: CardColSpan = dimensions?.colSpan ?? defaultColSpan;
  const heightPreset: CardHeightPreset = dimensions?.heightPreset ?? (defaultHeight ? 'standard' : 'auto');
  const isCollapsed: boolean = !!dimensions?.isCollapsed;

  // Track active height
  const [activeHeight, setActiveHeight] = useState<number | undefined>(() => {
    if (dimensions?.height) return dimensions.height;
    if (dimensions?.heightPreset && dimensions.heightPreset !== 'auto') {
      return PRESET_HEIGHTS[dimensions.heightPreset];
    }
    return defaultHeight;
  });

  // Sync when dimensions prop changes from outside
  useEffect(() => {
    if (dimensions?.height) {
      setActiveHeight(dimensions.height);
    } else if (dimensions?.heightPreset && dimensions.heightPreset !== 'auto') {
      setActiveHeight(PRESET_HEIGHTS[dimensions.heightPreset]);
    } else if (dimensions?.heightPreset === 'auto') {
      setActiveHeight(undefined);
    }
  }, [dimensions?.height, dimensions?.heightPreset]);

  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const dragStartYRef = useRef(0);
  const startHeightRef = useRef<number>(400);
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Resize Drag Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const currentCardHeight = cardRef.current?.getBoundingClientRect().height || 400;
    startHeightRef.current = currentCardHeight;
    dragStartYRef.current = e.clientY;
    setIsDragging(true);

    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    cyberSound.playClick();
    document.body.style.userSelect = 'none';
  };

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      e.preventDefault();

      const deltaY = e.clientY - dragStartYRef.current;
      const nextHeight = Math.max(220, Math.min(1000, Math.round(startHeightRef.current + deltaY)));
      setActiveHeight(nextHeight);
    },
    [isDragging]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      setIsDragging(false);
      document.body.style.userSelect = '';

      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }

      const finalHeight = activeHeight;
      if (finalHeight && onDimensionChange) {
        onDimensionChange(id, {
          height: finalHeight,
          heightPreset: undefined, // Custom height
        });
      }
    },
    [isDragging, activeHeight, id, onDimensionChange]
  );

  // Column Span Cycle: 1 -> 2 -> 3 -> 1
  const handleCycleColSpan = () => {
    cyberSound.playClick();
    const nextSpan: CardColSpan = colSpan === '1' ? '2' : colSpan === '2' ? '3' : '1';
    onDimensionChange?.(id, { colSpan: nextSpan });
  };

  // Direct Column Span Select
  const handleSetColSpan = (span: CardColSpan) => {
    cyberSound.playClick();
    onDimensionChange?.(id, { colSpan: span });
  };

  // Height Preset Cycle: Auto -> Compact (290) -> Standard (410) -> Large (560) -> Auto
  const handleCycleHeight = () => {
    cyberSound.playClick();
    let nextPreset: CardHeightPreset = 'standard';
    let nextH: number | undefined = PRESET_HEIGHTS.standard;

    if (heightPreset === 'auto') {
      nextPreset = 'compact';
      nextH = PRESET_HEIGHTS.compact;
    } else if (heightPreset === 'compact') {
      nextPreset = 'standard';
      nextH = PRESET_HEIGHTS.standard;
    } else if (heightPreset === 'standard') {
      nextPreset = 'large';
      nextH = PRESET_HEIGHTS.large;
    } else {
      nextPreset = 'auto';
      nextH = undefined;
    }

    setActiveHeight(nextH);
    onDimensionChange?.(id, {
      heightPreset: nextPreset,
      height: nextH,
    });
  };

  // Toggle Collapse
  const handleToggleCollapse = () => {
    cyberSound.playClick();
    onDimensionChange?.(id, { isCollapsed: !isCollapsed });
  };

  // Reset to default
  const handleReset = () => {
    cyberSound.playClick();
    setActiveHeight(defaultHeight);
    onDimensionChange?.(id, {
      colSpan: defaultColSpan,
      height: defaultHeight,
      heightPreset: defaultHeight ? 'standard' : 'auto',
      isCollapsed: false,
    });
  };

  // Double click bottom bar to reset height
  const handleDoubleClickResizeBar = () => {
    cyberSound.playClick();
    setActiveHeight(defaultHeight);
    onDimensionChange?.(id, {
      height: defaultHeight,
      heightPreset: defaultHeight ? 'standard' : 'auto',
    });
  };

  // Compute CSS column span classes
  const getColSpanClass = () => {
    switch (colSpan) {
      case '3':
        return 'col-span-1 lg:col-span-2 xl:col-span-3 w-full';
      case '2':
        return 'col-span-1 lg:col-span-2 w-full';
      case '1':
      default:
        return 'col-span-1 w-full';
    }
  };

  return (
    <div
      ref={cardRef}
      className={`relative flex flex-col rounded-xl transition-shadow ${getColSpanClass()} ${
        isDragging ? 'ring-2 ring-cyan-400 shadow-[0_0_20px_rgba(0,243,255,0.3)] z-20' : ''
      } ${className}`}
      style={{
        height: isCollapsed ? 'auto' : activeHeight ? `${activeHeight}px` : undefined,
        minHeight: isCollapsed ? 'auto' : '220px',
      }}
    >
      {/* Sleek Cyber Window Control Header Ribbon */}
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#080d17] border border-white/10 rounded-t-xl text-xs text-slate-300 select-none z-10 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          {icon && <span className="text-cyan-400 shrink-0">{icon}</span>}
          {title && (
            <span className="font-semibold text-white truncate text-xs tracking-wide">
              {title}
            </span>
          )}
          {isCollapsed && (
            <span className="text-[10px] font-mono text-cyan-400/80 px-1.5 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/20">
              Minimizat
            </span>
          )}
        </div>

        {/* Window Quick Size & Controls */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Column Span Selector (1 Col | 2 Col | Full) */}
          <div className="flex items-center bg-black/40 rounded border border-white/5 p-0.5 mr-1">
            <button
              onClick={() => handleSetColSpan('1')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition cursor-pointer ${
                colSpan === '1'
                  ? 'bg-cyan-500/30 text-cyan-300 font-bold border border-cyan-400/40'
                  : 'text-slate-400 hover:text-white'
              }`}
              title={t.col1Label}
            >
              1 Col
            </button>
            <button
              onClick={() => handleSetColSpan('2')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition cursor-pointer ${
                colSpan === '2'
                  ? 'bg-cyan-500/30 text-cyan-300 font-bold border border-cyan-400/40'
                  : 'text-slate-400 hover:text-white'
              }`}
              title={t.col2Label}
            >
              2 Col
            </button>
            <button
              onClick={() => handleSetColSpan('3')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition cursor-pointer ${
                colSpan === '3'
                  ? 'bg-cyan-500/30 text-cyan-300 font-bold border border-cyan-400/40'
                  : 'text-slate-400 hover:text-white'
              }`}
              title={t.colFullLabel}
            >
              Full
            </button>
          </div>

          {/* Height Preset Toggle */}
          <button
            onClick={handleCycleHeight}
            className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-[10px] font-mono transition flex items-center gap-1 cursor-pointer"
            title={`${t.resizeHeightPreset}: ${heightPreset.toUpperCase()} (${activeHeight ? `${activeHeight}px` : 'Auto'})`}
          >
            <span>{heightPreset === 'auto' ? 'Auto' : heightPreset === 'compact' ? 'S' : heightPreset === 'standard' ? 'M' : 'L'}</span>
            {activeHeight && <span className="text-[9px] text-cyan-400 font-bold">{activeHeight}p</span>}
          </button>

          {/* Reset Size Button */}
          <button
            onClick={handleReset}
            className="p-1 rounded text-slate-400 hover:text-cyan-300 hover:bg-white/10 transition cursor-pointer"
            title={t.resizeResetCard}
          >
            <RotateCcw className="w-3 h-3" />
          </button>

          {/* Collapse / Expand Button */}
          <button
            onClick={handleToggleCollapse}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            title={isCollapsed ? t.expandCard : t.minimizeCard}
          >
            {isCollapsed ? <ChevronDown className="w-3.5 h-3.5 text-cyan-400" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Window Content */}
      {!isCollapsed && (
        <div className="flex-1 min-h-0 w-full overflow-y-auto overflow-x-hidden flex flex-col bg-[#0a0f1b]/95 border-x border-white/10 [&>div]:border-0 [&>div]:bg-transparent [&>div]:rounded-none [&>div]:shadow-none">
          {children}
        </div>
      )}

      {/* Interactive Bottom Drag-to-Resize Bar */}
      {!isCollapsed && (
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onDoubleClick={handleDoubleClickResizeBar}
          className="relative h-3 w-full bg-[#060911] border-x border-b border-white/10 rounded-b-xl flex items-center justify-center cursor-ns-resize group select-none hover:bg-cyan-950/40 transition z-20 shrink-0"
          title={t.dragToResizeHeight}
        >
          {/* Subtle tactile grip line */}
          <div className="w-12 h-1 rounded-full bg-white/20 group-hover:bg-cyan-400 group-hover:shadow-[0_0_8px_rgba(0,243,255,0.7)] transition flex items-center justify-center" />

          {/* Diagonal Corner Grip for bottom-right tactile cue */}
          <div className="absolute right-1 bottom-0.5 text-white/30 group-hover:text-cyan-400 transition pointer-events-none">
            <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
              <circle cx="6" cy="6" r="1" />
              <circle cx="6" cy="3" r="1" />
              <circle cx="3" cy="6" r="1" />
            </svg>
          </div>

          {/* Live Dragging Tooltip HUD Pill */}
          {isDragging && (
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-black/90 border border-cyan-400 text-cyan-300 text-[10px] font-mono font-bold shadow-lg flex items-center gap-1.5 pointer-events-none animate-in fade-in">
              <span>{t.heightLabel}:</span>
              <span className="text-white">{activeHeight}px</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
