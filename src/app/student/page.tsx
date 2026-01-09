import Graph from "@/assets/icons/graph.svg";
import Pending from "@/assets/icons/pending.svg";
import File from "@/assets/icons/file.svg";
import Upload from "@/assets/icons/upload.svg";
import Continue from "@/assets/icons/continue.svg";
import View from "@/assets/icons/view.svg";
import Star from "@/assets/icons/star.svg";
import CheckList from "@/assets/icons/check-list.svg";

export default function Page() {
  const linear_progression_data = [
    {
      id: 1,
      title: "Biology: Cell Structures",
      module: "Module 4",
      status: "Pending",
      start_date: "Oct 25",
      end_date: "Nov 10",
      completed_percentage: 60,
      button_icon: Continue,
      button_label: "Continue",
    },
    {
      id: 2,
      title: "Advanced Typography",
      module: "Module 5",
      status: "Overdue",
      start_date: "Oct 15",
      end_date: "Nov 1",
      completed_percentage: 0,
      button_icon: Continue,
      button_label: "Continue",
    },
    {
      id: 3,
      title: "Web Dev: CSS Grid",
      module: "Module 2",
      status: "Submitted",
      start_date: "Nov 15",
      end_date: "Nov 30",
      completed_percentage: 100,
      button_icon: View,
      button_label: "View Submission",
    },
  ];

  const progression_card_theme = {
    pending: {
      card_border: "border-(--secondary)/10",
      status: "bg-green-50 text-green-700 ring-green-600/20",
      progress_bar: "bg-green-500",
      button: "border-green-200 bg-green-50 text-green-700",
    },
    overdue: {
      card_border: "border-red-200",
      status: "bg-red-50 text-red-700 ring-red-600/20",
      progress_bar: "bg-red-500",
      button: "border-red-200 bg-red-50 text-red-700",
    },
    submitted: {
      card_border: "border-blue-200",
      status: "bg-blue-50 text-blue-700 ring-blue-600/20",
      progress_bar: "bg-blue-500",
      button: "border-blue-200 bg-blue-50 text-blue-700",
    },
  };

  type Status = keyof typeof progression_card_theme;

  const pending_action_data = [
    {
      id: 1,
      title: "Research Paper Submission",
      description: "Introduction to Biology • Module 3",
      due_date: "Due Today at 11:59 PM",
    },
    {
      id: 2,
      title: "Design Portfolio Draft",
      description: "Graphic Design Basics • Module 2",
      due_date: "Due Tomorrow at 1:00 PM",
    },
  ];

  const completed_work_data = [
    {
      id: 1,
      title: "Python Basics: Functions",
      description: "Introduction to Programming • Module 3",
      status: "Submitted",
      submitted_on: "Oct 30, 2023",
    },
    {
      id: 2,
      title: "World War II Essay",
      description: "Modern History • Module 2",
      status: "Graded",
      score: 92,
    },
  ];

  const completed_work_theme = {
    submitted: "bg-blue-50 text-blue-700 ring-blue-700/10",
    graded: "bg-green-50 text-green-700 ring-green-700/10",
  };

  return (
    <div className="px-4 py-8 md:px-12">
      <header className="mb-8">
        <p className="text-2xl font-bold tracking-tight text-(--secondary)">
          Dashboard
        </p>
        <p className="mt-1 text-sm text-(--secondary)/60">
          Focus on your progress and upcoming tasks
        </p>
      </header>
      {/* Linear Course Progression */}
      <section className="mb-10">
        <div className="mb-5 flex items-center gap-2 text-(--secondary)">
          <Graph className="size-5" />
          <p>Linear Course Progression</p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6">
          {linear_progression_data?.map((item) => {
            const Icon = item?.button_icon;
            const status = item?.status.toLowerCase() as Status;
            const card_theme = progression_card_theme[status];
            return (
              <div
                key={item?.id}
                className={`rounded-lg border ${card_theme?.card_border} bg-(--foreground) p-6 shadow-sm`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-lg font-bold text-(--secondary)">
                      {item?.title}
                    </p>
                    <p className="text-xs text-(--secondary)/60 mt-1">
                      {item?.module}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-md ${card_theme?.status} px-2 py-1 text-xs font-medium ring-1 ring-inset`}
                  >
                    {item?.status}
                  </span>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-xs text-(--secondary)/60">
                    <span>Start: {item?.start_date}</span>
                    <span className="font-medium text-(--secondary)">
                      Due: {item?.end_date}
                    </span>
                  </div>
                  <div className="w-full h-2 overflow-hidden rounded-full bg-(--secondary)/10">
                    <div
                      className={`h-2 ${card_theme?.progress_bar}`}
                      style={{ width: `${item?.completed_percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-right text-xs font-bold text-(--secondary)">
                    {item?.completed_percentage}% Complete
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-(--secondary)/10">
                  <button
                    className={`w-full flex items-center justify-center gap-2 rounded-lg border ${card_theme?.button} px-4 py-2.5 text-sm font-semibold shadow-sm`}
                  >
                    <Icon className="size-4" />
                    <span>{item?.button_label}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      {/* Pending Actions */}
      <section className="mb-10">
        <div className="mb-4 flex items-center gap-2">
          <Pending className="size-5 text-[#F97316]" />
          <p className="text-lg font-bold text-(--secondary)">
            Pending Actions
          </p>
        </div>
        <div className="overflow-hidden rounded-lg border border-(--secondary)/10 bg-(--foreground) shadow-sm">
          <div className="divide-y divide-(--secondary)/10 px-5">
            {pending_action_data?.map((item) => {
              return (
                <div
                  key={item?.id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between  gap-4 py-5"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <File className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-(--secondary)">
                        {item?.title}
                      </p>
                      <p className="text-sm text-(--secondary)/60">
                        {item?.description}
                      </p>
                      <p className="mt-1 text-xs font-medium text-orange-600">
                        {item?.due_date}
                      </p>
                    </div>
                  </div>
                  <button className="w-full md:max-w-max flex items-center justify-center gap-2 rounded-lg border border-(--secondary)/10 px-4 py-2 text-xs font-bold text-(--secondary) shadow-sm">
                    <Upload className="size-5" />
                    <span>Upload Assignment</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* Completed Works */}
      <section className="mb-10">
        <div className="mb-4 flex items-center gap-2">
          <Pending className="size-5 text-[#F97316]" />
          <p className="text-lg font-bold text-(--secondary)">
            Completed Works
          </p>
        </div>
        <div className="overflow-hidden rounded-lg border border-(--secondary)/10 bg-(--foreground) shadow-sm">
          <div className="divide-y divide-(--secondary)/10 px-5">
            {completed_work_data?.map((item) => {
              const status = item?.status.toLowerCase() as
                | "submitted"
                | "graded";
              return (
                <div
                  key={item?.id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-5"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                        item?.status == "Submitted"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-green-50 text-green-600"
                      }`}
                    >
                      {item?.status == "Submitted" && (
                        <CheckList className="size-5" />
                      )}
                      {item?.status == "Graded" && <Star className="size-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-(--secondary)">
                          {item?.title}
                        </p>
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${completed_work_theme[status]}`}
                        >
                          {item?.status}
                        </span>
                      </div>
                      <p className="text-sm text-(--secondary)/60">
                        {item?.description}
                      </p>
                      {item?.submitted_on && (
                        <p className="mt-1 text-xs text-(--secondary)/60">
                          Submitted on {item?.submitted_on}
                        </p>
                      )}
                      {item?.score && (
                        <p className="mt-1 text-xs font-medium text-green-600">
                          Score: {item?.score}/100
                        </p>
                      )}
                    </div>
                  </div>
                  {item?.status == "Submitted" && (
                    <button className="w-full md:max-w-max flex items-center justify-center gap-2 rounded-lg border border-(--secondary)/10 px-4 py-2 text-xs font-bold text-(--secondary)/60 shadow-sm">
                      <View className="size-5" />
                      <span>View Submission</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
