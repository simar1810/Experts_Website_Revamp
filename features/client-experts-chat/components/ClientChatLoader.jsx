import { Loader } from "lucide-react";

export default function ClientChatLoader() {
  return (
    <div className="flex min-h-[40vh] flex-1 flex-col items-center justify-center bg-[#F9FAFB]">
      <Loader className="h-6 w-6 animate-spin text-gray-400" />
      <p className="mt-4 text-sm font-medium text-gray-900">
        Setting things up…
      </p>
      <p className="mt-1 text-xs text-gray-500">Please wait a moment</p>
    </div>
  );
}
