import React, { useState } from 'react';
import { Department, LossType } from '../types/kaizen';
import { Plus, Trash2, Edit2, Check, X, Building, AlertOctagon, RefreshCw } from 'lucide-react';

interface CatalogsManagerProps {
  departments: Department[];
  lossTypes: LossType[];
  onAddDepartment: (dept: Department) => void;
  onRemoveDepartment: (id: string) => void;
  onAddLossType: (loss: LossType) => void;
  onRemoveLossType: (id: string) => void;
}

export const CatalogsManager: React.FC<CatalogsManagerProps> = ({
  departments,
  lossTypes,
  onAddDepartment,
  onRemoveDepartment,
  onAddLossType,
  onRemoveLossType,
}) => {
  const [newDeptCode, setNewDeptCode] = useState('');
  const [newDeptName, setNewDeptName] = useState('');

  const [newLossCode, setNewLossCode] = useState('');
  const [newLossName, setNewLossName] = useState('');
  const [newLossDesc, setNewLossDesc] = useState('');

  const handleAddDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptCode.trim() || !newDeptName.trim()) return;

    onAddDepartment({
      id: `dept-${Date.now()}`,
      code: newDeptCode.trim().toUpperCase(),
      name: `${newDeptCode.trim().toUpperCase()} — ${newDeptName.trim()}`,
      isActive: true,
    });

    setNewDeptCode('');
    setNewDeptName('');
  };

  const handleAddLoss = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLossCode.trim() || !newLossName.trim()) return;

    onAddLossType({
      id: `loss-${Date.now()}`,
      code: newLossCode.trim().toUpperCase(),
      name: newLossName.trim(),
      description: newLossDesc.trim(),
      isActive: true,
    });

    setNewLossCode('');
    setNewLossName('');
    setNewLossDesc('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Описание расширяемости */}
      <div className="bg-emerald-900/10 border border-emerald-500/20 p-4 rounded-xl flex items-start gap-3">
        <RefreshCw className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
        <div className="text-xs text-slate-700 leading-relaxed">
          <strong className="text-slate-900 block text-sm font-semibold mb-0.5">
            Динамические справочники системы
          </strong>
          Все подразделения (PL, KA, PO, BU, DE, MA) и виды потерь Lean хранятся в БД в нормализованных таблицах. Добавленные здесь элементы мгновенно становятся доступны при подаче новых идей в Telegram Web App и отображаются в бланке.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Справочник подразделений */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
              <Building className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Подразделения фабрики (Участки)</h3>
            </div>

            <div className="space-y-2 mb-4 max-h-64 overflow-y-auto pr-1">
              {departments.map(dept => (
                <div
                  key={dept.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/80 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold bg-slate-900 text-white px-2 py-0.5 rounded text-[10px]">
                      {dept.code}
                    </span>
                    <span className="font-medium text-slate-800">{dept.name}</span>
                  </div>

                  {dept.code !== 'OTHER' && (
                    <button
                      onClick={() => onRemoveDepartment(dept.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors cursor-pointer"
                      title="Удалить подразделение"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Форма добавления подразделения */}
          <form onSubmit={handleAddDept} className="pt-3 border-t border-slate-100 space-y-2">
            <span className="text-xs font-semibold text-slate-700 block">Добавить участок:</span>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Код (напр. LOG)"
                value={newDeptCode}
                onChange={e => setNewDeptCode(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 uppercase font-mono"
              />
              <input
                type="text"
                placeholder="Название участка"
                value={newDeptName}
                onChange={e => setNewDeptName(e.target.value)}
                className="col-span-2 text-xs border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-2 rounded-lg cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Добавить в справочник</span>
            </button>
          </form>
        </div>

        {/* 2. Справочник видов потерь */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
              <AlertOctagon className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Виды потерь (Lean Manufacturing)</h3>
            </div>

            <div className="space-y-2 mb-4 max-h-64 overflow-y-auto pr-1">
              {lossTypes.map(loss => (
                <div
                  key={loss.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/80 text-xs"
                >
                  <div>
                    <span className="font-semibold text-slate-800">{loss.name}</span>
                    {loss.description && (
                      <p className="text-[10px] text-slate-500">{loss.description}</p>
                    )}
                  </div>

                  <button
                    onClick={() => onRemoveLossType(loss.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors cursor-pointer"
                    title="Удалить вид потерь"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Форма добавления вида потерь */}
          <form onSubmit={handleAddLoss} className="pt-3 border-t border-slate-100 space-y-2">
            <span className="text-xs font-semibold text-slate-700 block">Добавить вид потерь:</span>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="КОД (ENERGY)"
                value={newLossCode}
                onChange={e => setNewLossCode(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 uppercase font-mono"
              />
              <input
                type="text"
                placeholder="Название (напр. Перерасход энергии)"
                value={newLossName}
                onChange={e => setNewLossName(e.target.value)}
                className="col-span-2 text-xs border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <input
              type="text"
              placeholder="Краткое описание"
              value={newLossDesc}
              onChange={e => setNewLossDesc(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-2 rounded-lg cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Добавить вид потерь</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
