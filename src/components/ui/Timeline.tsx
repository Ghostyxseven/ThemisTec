import React from "react";
import { Movimentacao } from "../../specs/schemas/movimentacao.schema";

interface TimelineProps {
  movimentacoes: Movimentacao[];
}

export const Timeline: React.FC<TimelineProps> = ({ movimentacoes }) => {
  return (
    <div className="relative border-l border-slate-200 dark:border-slate-700 ml-3">
      {movimentacoes.map((mov) => (
        <div key={mov.id} className="mb-10 ml-6">
          <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
            {mov.origemCaptura === "automatica" ? (
              <span className="text-blue-800 text-xs">🤖</span>
            ) : (
              <span className="text-gray-500 text-xs">✍️</span>
            )}
          </span>
          <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
            {mov.titulo}
            {mov.origemCaptura === "automatica" && (
              <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-3">
                Captura Automática
              </span>
            )}
          </h3>
          <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
            {new Date(mov.dataEvento).toLocaleDateString("pt-BR")}
          </time>
          <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
            {mov.descricao}
          </p>
          {mov.origemCaptura !== "automatica" && (
            <button className="text-sm text-primary hover:underline">Editar</button>
          )}
        </div>
      ))}
    </div>
  );
};
