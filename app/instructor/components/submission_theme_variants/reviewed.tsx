import Image from "next/image";
import CircleTick from "@/assets/icons/circle-tick.svg";
import View from "@/assets/icons/view.svg";
import type { SubmissionData } from "../../page";

export default function Reviewed(data: SubmissionData) {
  return (
    <div className="group flex flex-col @5xl:grid @5xl:grid-cols-5 gap-4 p-4 @5xl:px-6 @5xl:py-5 items-center transition-colors bg-white hover:bg-gray-50">
      <div className="flex items-center gap-3 w-full cursor-pointer">
        <div className="relative">
          <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 grayscale overflow-hidden">
            <Image src={data?.avatar} width={100} height={100} alt="logo" />
          </div>
          <CircleTick className="size-5 absolute text-green-500 -bottom-1 -right-1 rounded-full border-2 border-white" />
        </div>
        <div className="flex flex-col min-w-0">
          <p className="text-[#111518] text-sm font-bold truncate">
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
        <p className="text-gray-500 text-xs truncate">{data?.module}</p>
      </div>
      <div className="w-full flex flex-col justify-center gap-1.5">
        <div className="flex items-center justify-between @5xl:justify-start gap-2">
          <span className="@5xl:hidden text-xs font-medium text-gray-500">
            Status:
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
            {data?.status}
          </span>
        </div>
        <div className="flex items-center justify-between @5xl:justify-start gap-2">
          <span className="@5xl:hidden text-xs font-medium text-gray-500">
            Attempt:
          </span>
          <span className="text-xs text-gray-500 font-medium">
            Attempt {data?.attempt}
          </span>
        </div>
      </div>
      <div className="w-full flex flex-col justify-center gap-1">
        <div className="flex flex-wrap justify-between @5xl:justify-start gap-1">
          <span className="text-xs text-gray-500 w-16 min-w-16">
            Submitted:
          </span>
          <p className="text-xs text-gray-500">{data?.submitted}</p>
        </div>
        <div className="flex flex-wrap justify-between @5xl:justify-start gap-1">
          <span className="text-xs text-gray-500 w-16 min-w-16">Due:</span>
          <p className="text-xs text-gray-500">{data?.due}</p>
        </div>
      </div>
      <div className="w-full flex justify-end">
        <button className="w-full h-9 px-4 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors flex items-center justify-center gap-2">
          <View className="size-4.5" />
          View Review
        </button>
      </div>
    </div>
  );
}
