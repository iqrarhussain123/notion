import React from 'react';
import { useDroppable } from '@dnd-kit/core';

interface DroppableColumnProps {
  id: string;
  title: string;
  count: number;
  children: React.ReactNode;
}

export const DroppableColumn: React.FC<DroppableColumnProps> = ({ id, title, count, children }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div className="flex-shrink-0 w-80">
      <div
        ref={setNodeRef}
        className={`bg-[#0e111a] border border-[#1c2232] rounded-2xl p-3.5 min-h-[550px] transition-all ${
          isOver ? 'bg-[#141824] border-[#d4a237] ring-1 ring-[#d4a237] shadow-lg' : ''
        }`}
      >
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#e5be60]" />
            <h3 className="text-xs font-bold text-[#f2f4f8] tracking-wider uppercase font-mono">
              {title}
            </h3>
          </div>
          <span className="bg-[#141824] border border-[#1c2232] text-[#d4a237] px-2 py-0.5 rounded-full text-xs font-mono font-semibold">
            {count}
          </span>
        </div>
        {children}
      </div>
    </div>
  );
};
