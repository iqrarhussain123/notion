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
        className={`bg-[#17231B] border border-[#304A39] rounded-2xl p-3.5 min-h-[550px] transition-all ${
          isOver ? 'bg-[#1B2B21] border-[#B8F28B] ring-1 ring-[#B8F28B] shadow-lg' : ''
        }`}
      >
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#77C98A]" />
            <h3 className="text-xs font-bold text-[#E9F5E9] tracking-wider uppercase font-mono">
              {title}
            </h3>
          </div>
          <span className="bg-[#1B2B21] border border-[#304A39] text-[#B8F28B] px-2 py-0.5 rounded-full text-xs font-mono font-semibold">
            {count}
          </span>
        </div>
        {children}
      </div>
    </div>
  );
};
