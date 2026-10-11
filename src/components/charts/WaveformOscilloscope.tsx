import React, { useEffect, useRef } from 'react';
import { ThemeColors, SupportedLanguage } from '../../types';
import { Radio } from 'lucide-react';
import { translations } from '../../i18n/translations';

interface Props {
  theme: ThemeColors;
  isPaused: boolean;
  activityLevel: number; // 0 to 1
  lang: SupportedLanguage;
}

export const WaveformOscilloscope: React.FC<Props> = ({
  theme,
  isPaused,
  activityLevel,
  lang,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const phaseRef = useRef(0);
  const activityRef = useRef(activityLevel);
  activityRef.current = activityLevel;
  const isPausedRef = useRef(isPaused);
  isPausedRef.current = isPaused;
  const themeHexRef = useRef(theme.primaryHex);
  themeHexRef.current = theme.primaryHex;

  const t = translations[lang];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const currentThemeHex = themeHexRef.current;
      const currentActivity = activityRef.current;

      ctx.clearRect(0, 0, width, height);

      // Cyber oscilloscope grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      const step = 20;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Center reference zero-line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Draw glowing waveform
      ctx.strokeStyle = currentThemeHex;
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 10;
      ctx.shadowColor = currentThemeHex;

      ctx.beginPath();
      const centerY = height / 2;
      const amplitude = Math.max(8, (height / 3.2) * (0.3 + currentActivity * 0.7));
      const phase = phaseRef.current;

      for (let x = 0; x < width; x++) {
        const freq1 = 0.035;
        const freq2 = 0.015;
        const wave1 = Math.sin(x * freq1 + phase);
        const wave2 = Math.cos(x * freq2 - phase * 0.7);
        const modulation = Math.sin(x * 0.005 + phase * 0.2);

        const y = centerY + (wave1 * 0.7 + wave2 * 0.3) * amplitude * (0.8 + 0.2 * modulation);

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0; // reset

      if (!isPausedRef.current) {
        phaseRef.current += 0.07;
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="w-full flex flex-col p-4 rounded-xl bg-[#0c121e]/90 border border-white/5">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white tracking-wide">
            {t.waveformTitle}
          </h3>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">
          {t.samplingDsp}
        </span>
      </div>

      <div className="relative w-full h-24 rounded-lg bg-[#070a12] border border-white/10 overflow-hidden flex items-center justify-center">
        <canvas ref={canvasRef} width={600} height={96} className="w-full h-full" />
      </div>
    </div>
  );
};
