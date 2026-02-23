"use client";

import Drag from "@/assets/icons/drag.svg";
import DeleteButton from "./module-card/delete-button";
import Calendar from "@/assets/icons/calendar.svg";
import toDateInputValue from "@/utils/to-date-input-value";
import DateInput from "./module-card/date-input";
import { Dispatch, SetStateAction } from "react";
import { ModulesProps } from "./modules";
import { DragEvent } from "react";

export interface ModuleCardProps {
  module: ModulesProps;
  setModulesData: Dispatch<SetStateAction<ModulesProps[]>>;
  onDragStart: (id: string) => void;
  onDragOver: (id: string, e: DragEvent<HTMLDivElement>) => void;
  onDragEnd: (e: DragEvent<HTMLDivElement>) => void;
  isDragging: boolean;
}

export default function ModuleCard({
  module,
  setModulesData,
  onDragStart,
  onDragOver,
  onDragEnd,
  isDragging,
}: ModuleCardProps) {
  return (
    <div
      key={module?.id}
      data-item-id={module.id}
      draggable
      onDragStart={() => onDragStart(module.id)}
      onDragOver={(e) => onDragOver(module.id, e)}
      onDragEnd={onDragEnd}
      className={`${isDragging ? "opacity-0" : ""} group flex items-center gap-4 p-4 rounded-lg bg-white border border-gray-200 hover:border-blue-500/30 transition-all hover:shadow-sm cursor-move`}
    >
      <Drag className="size-5 text-gray-300" />
      <form className="flex-1 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
              Module {module.position}
            </span>
            <input
              className="w-full font-bold text-lg bg-transparent border-none focus:outline-dashed p-0 focus:ring-0 text-gray-900"
              type="text"
              defaultValue={module?.title}
            />
            <input
              className="w-full text-sm text-gray-500 bg-transparent border-none focus:outline-dashed p-0 focus:ring-0"
              type="text"
              defaultValue={module?.description}
            />
          </div>
          <DeleteButton moduleId={module.id} setModulesData={setModulesData} />
        </div>
        <div className="flex flex-wrap gap-4 pt-2 border-t border-gray-100">
          <DateInput
            icon={<Calendar className="size-4.5 text-blue-500" />}
            label="Start:"
            value={toDateInputValue(module.startDate)}
            ariaLabel={`Module ${module.position} start date`}
          />
          <DateInput
            icon={<Calendar className="size-4.5 text-blue-500" />}
            label="Due:"
            value={toDateInputValue(module.dueDate)}
            ariaLabel={`Module ${module.position} due date`}
          />
        </div>
      </form>
    </div>
  );
}
