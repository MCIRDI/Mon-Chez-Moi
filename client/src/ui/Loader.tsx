export default function Loader({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] w-full gap-4">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="text-gray-500 text-lg">{message}</p>
    </div>
  );
}
