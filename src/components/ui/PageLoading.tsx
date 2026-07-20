import React from "react";

interface PageLoadingProps {
  message?: string;
}

export function PageLoading({ message = "Carregando..." }: PageLoadingProps): React.JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center py-24 animate-fade-in-up">
      <div className="relative">
        <div className="h-10 w-10 rounded-full border-[3px] border-slate-200" />
        <div className="absolute inset-0 h-10 w-10 rounded-full border-[3px] border-blue-600 border-t-transparent animate-spin" />
      </div>
      <p className="mt-4 text-sm font-medium text-slate-500">{message}</p>
    </div>
  );
}
