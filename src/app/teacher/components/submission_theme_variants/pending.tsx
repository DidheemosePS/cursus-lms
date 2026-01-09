import Image from "next/image";
import Edit from "@/assets/icons/edit.svg";
import type { SubmissionData } from "../../page";

export default function Pending(data: SubmissionData) {
  return (
    <div className="group flex flex-col @5xl:grid @5xl:grid-cols-5 gap-4 p-4 @5xl:px-6 @5xl:py-5 items-center transition-colors bg-white hover:bg-gray-50">
      <div className="flex items-center gap-3 w-full cursor-pointer hover:opacity-80">
        <div className="bg-center bg-no-repeat bg-cover rounded-full size-10">
          <Image src={data?.avatar} width={100} height={100} alt="logo" />
        </div>
        <div className="flex flex-col min-w-0">
          <p className="text-[#111518] text-sm font-bold truncate hover:text-primary transition-colors">
            {data?.name}
          </p>
          <p className="text-gray-500 text-xs truncate">ID: {data?.userId}</p>
        </div>
      </div>
      <div className="w-full flex flex-col justify-center">
        <span className="@5xl:hidden text-xs font-medium text-gray-500 mb-1">
          Course Info:
        </span>
        <a
          className="text-[#111518] text-sm font-medium truncate hover:text-primary transition-colors cursor-pointer"
          href="#"
          title="View Course Overview"
        >
          {data?.course}
        </a>
        <p className="text-gray-500 text-xs truncate">Module {data?.module}</p>
      </div>
      <div className="w-full flex flex-col justify-center gap-1.5">
        <div className="flex items-center justify-between @5xl:justify-start gap-2">
          <span className="@5xl:hidden text-xs font-medium text-gray-500">
            Status:
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
            {data?.status}
          </span>
        </div>
        <div className="flex items-center justify-between @5xl:justify-start gap-2">
          <span className="@5xl:hidden text-xs font-medium text-gray-500">
            Attempt:
          </span>
          {data?.isResubmission ? (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-50 text-orange-700 border border-orange-100">
              Resubmission
            </span>
          ) : (
            <span className="text-xs text-gray-500 font-medium">
              Attempt {data?.attempt}
            </span>
          )}
        </div>
      </div>
      <div className="w-full flex flex-col justify-center gap-1">
        <div className="flex flex-wrap justify-between @5xl:justify-start gap-1">
          <span className="text-xs text-gray-500 w-16 min-w-16">
            Submitted:
          </span>
          <p className="text-xs text-gray-700">{data?.submitted}</p>
        </div>
        <div className="flex flex-wrap justify-between @5xl:justify-start gap-1">
          <span className="text-xs text-gray-500 w-16 min-w-16">Due:</span>
          <p className="text-xs text-gray-500">{data?.due}</p>
        </div>
      </div>
      <div className="w-full flex justify-end">
        <button className="w-full h-9 px-4 rounded-lg bg-[#135BEC] hover:bg-blue-600 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm">
          <Edit className="size-4.5" />
          Review Submission
        </button>
      </div>
    </div>
  );
}
