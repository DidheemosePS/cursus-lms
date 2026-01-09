export default function CourseModal() {
  console.log("Interception Route");

  return (
    <div className="w-full h-dvh absolute inset-0 flex items-start justify-center z-500 bg-red-500">
      <div className="mt-10 bg-white p-4 rounded shadow-lg">Course Details</div>
    </div>
  );
}
