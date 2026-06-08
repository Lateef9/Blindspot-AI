import { FileUpload } from "@/components/FileUpload";

export default function Home() {
  return (
    <main className="min-h-screen p-8 sm:p-20 font-sans flex flex-col items-center justify-center">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4 tracking-tight">Blindspot AI</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-lg">
          Upload your PDF documents for analysis. We only support PDF files up to 20MB.
        </p>
      </div>

      <FileUpload />
    </main>
  );
}
