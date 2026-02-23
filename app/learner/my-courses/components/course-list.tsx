import CourseCard from "./course-card";

export interface Courses {
  course: {
    id: string;
    title: string;
    description: string;
    coverImageUrl: string;
    _count: {
      modules: number;
    };
  };
  progressStatus: "in_progress" | "not_started" | "completed";
  progressPercent: number;
}

export default function CourseList({ courseList }: { courseList: Courses[] }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-8">
      {courseList?.map((courses: Courses) => {
        return <CourseCard key={courses.course.id} courses={courses} />;
      })}
    </div>
  );
}
