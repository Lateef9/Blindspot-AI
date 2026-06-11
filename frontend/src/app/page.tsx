import { FileUpload } from "@/components/FileUpload";

export default function Home() {
  return (
    <main className="min-h-screen p-8 sm:p-20 font-sans flex flex-col items-center justify-center bg-white dark:bg-slate-950">
      <div className="w-full max-w-2xl">
        <div className="mb-12 pb-6 border-b-2 border-slate-900 dark:border-slate-100">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100 uppercase tracking-widest">Blindspot Analytics</h1>
          <p className="text-sm font-mono font-bold text-slate-700 dark:text-slate-300 mt-3 uppercase tracking-wide">
            Secure Data Intake Portal v1.0
          </p>
        </div>
        <FileUpload />
      </div>
    </main>
  );
}
