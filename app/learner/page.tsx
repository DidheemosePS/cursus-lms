import Progression from "./components/progression";
import Completed from "./components/completed";
import Pending from "./components/pending";

export default function Page() {
  return (
    <div className="px-4 py-8 md:px-12">
      <header className="mb-8">
        <p className="text-2xl font-bold tracking-tight text-(--secondary)">
          Overview
        </p>
        <p className="mt-1 text-sm text-(--secondary)/60">
          Focus on your progress and upcoming tasks
        </p>
      </header>
      {/* Linear Course Progression */}
      <Progression />
      {/* Pending Actions */}
      <Pending />
      {/* Completed Works */}
      <Completed />
    </div>
  );
}
