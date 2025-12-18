'use client';

import clsx from 'clsx';
import { ArchitectureMode } from '@/lib/architecture-diagrams';

interface ArchitectureModeToggleProps {
  value: ArchitectureMode;
  onChange: (mode: ArchitectureMode) => void;
}

const MODES: { id: ArchitectureMode; label: string; hint: string }[] = [
  { id: 'beginner', label: 'Beginner', hint: 'Plain English' },
  { id: 'advanced', label: 'Advanced', hint: 'System design' },
  { id: 'expert', label: 'Expert', hint: 'Infra deep-dive' },
];

const ArchitectureModeToggle = ({ value, onChange }: ArchitectureModeToggleProps) => {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-2 py-1 text-xs">
      {MODES.map((mode) => (
        <button
          key={mode.id}
          type="button"
          className={clsx(
            'px-3 py-1 rounded-full transition text-[13px] font-medium',
            value === mode.id
              ? 'bg-white/90 text-black shadow-sm'
              : 'text-white/60 hover:text-white hover:bg-white/10'
          )}
          onClick={() => onChange(mode.id)}
        >
          <span>{mode.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ArchitectureModeToggle;
