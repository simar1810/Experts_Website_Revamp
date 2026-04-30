import { AlertCircle } from "lucide-react";

export default function InvalidPartner() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#b1271c10_100%)]" />

      <div className="max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="rounded-2xl bg-red-50 p-4 ring-1 ring-red-100">
            <AlertCircle className="h-12 w-12 text-[#b1271c]" />
          </div>
        </div>

        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-black sm:text-5xl">
          Partner <span className="text-[#b1271c]">Not Found</span>
        </h1>

        <p className="mb-10 text-lg font-medium text-[#7d778d]">
          The wellness portal you're looking for doesn't seem to exist or has been moved. Please check the URL or contact support.
        </p>
      </div>
    </div>
  )
}