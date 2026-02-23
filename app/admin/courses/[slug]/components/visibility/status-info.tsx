"use client";

import { formatTimeAgo } from "../../../../../../utils/timestamp-formatter";
import GetStatusIndicatorColor from "./get-status-indicator-color";
import { CourseStatus, STATUS_CONFIG } from "./visibility";

export interface StatusInfoProps {
  status: CourseStatus;
  config: (typeof STATUS_CONFIG)[CourseStatus];
  updatedAt: Date;
}

export default function StatusInfo({
  status,
  config,
  updatedAt,
}: StatusInfoProps) {
  return (
    <div className="mt-4 flex gap-2">
      <div
        className={`flex-1 ${config.bgColor} ${config.color} text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1`}
      >
        <span
          className="size-2 rounded-full"
          style={{ backgroundColor: GetStatusIndicatorColor(status) }}
        ></span>
        <span>{config.label}</span>
      </div>
      <div className="flex-1 bg-gray-100 text-gray-500 text-xs font-bold py-2 px-3 rounded-lg text-center">
        Last updated on {formatTimeAgo(updatedAt)}
      </div>
    </div>
  );
}
