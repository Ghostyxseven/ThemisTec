"use client";
import { useState } from "react";
import { Switch } from "../../../components/ui/Switch";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/Card";

export default function ConfiguracoesPage() {
  const [syncEnabled, setSyncEnabled] = useState(false);

  const handleToggle = () => {
    // Aqui chamaria o ViewModel para salvar no banco
    setSyncEnabled(!syncEnabled);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Configurações</h1>
      <Card>
        <CardHeader>
          <CardTitle>Integrações de Sistema</CardTitle>
          <p className="text-sm text-gray-500">
            Ative e gerencie suas integrações com provedores externos de dados jurídicos.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800">Sincronização de Tribunais (Captura Automática)</h3>
              <p className="text-sm text-gray-500">
                Busca automaticamente os andamentos dos seus processos diariamente através da API Mock.
              </p>
            </div>
            <Switch checked={syncEnabled} onChange={handleToggle} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
