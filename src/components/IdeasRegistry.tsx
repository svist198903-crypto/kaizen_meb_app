import React, { useState } from 'react';
import { KaizenIdea, CommissionStatus, Department } from '../types/kaizen';
import { Printer, Eye, CheckCircle2, Clock, XCircle, Wrench, Search, Filter, Calendar, User, Building2, AlertCircle } from 'lucide-react';

interface IdeasRegistryProps {
  ideas: KaizenIdea[];
  departments: Department[];
  onSelectForPrint: (idea: KaizenIdea) => void;
  onUpdateCommission: (ideaId: string, commissionData: KaizenIdea['commission'], comments?: string[]) => void;
}

export const IdeasRegistry: React.FC<IdeasRegistryProps> = ({
  ideas,
  departments,
  onSelectForPrint,
  onUpdateCommission,
}) => {
  const [filterDept, setFilterDept] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Состояние модалки решения комиссии
  const [editingIdea, setEditingIdea] = useState<KaizenIdea | null>(null);
  const [tempStatus, setTempStatus] = useState<CommissionStatus>('PENDING');
  const [tempReason, setTempReason] = useState('');
  const [tempResponsible, setTempResponsible] = useState('');
  const [tempDeadline, setTempDeadline] = useState('');
  const [tempComment1, setTempComment1] = useState('');
  const [tempComment2, setTempComment2] = useState('');
  const [tempComment3, setTempComment3] = useState('');

  const openCommissionModal = (idea: KaizenIdea) => {
    setEditingIdea(idea);
    setTempStatus(idea.commission.status || 'PENDING');
    setTempReason(idea.commission.rejectionReason || '');
    setTempResponsible(idea.commission.responsiblePerson || '');
    setTempDeadline(idea.commission.implementationDeadline || '');
    setTempComment1(idea.supervisorComments?.[0] || '');
    setTempComment2(idea.supervisorComments?.[1] || '');
    setTempComment3(idea.supervisorComments?.[2] || '');
  };

  const saveCommissionDecision = () => {
    if (!editingIdea) return;
    onUpdateCommission(
      editingIdea.id,
      {
        status: tempStatus,
        rejectionReason: tempStatus === 'REJECTED' ? tempReason : '',
        responsiblePerson: tempResponsible,
        implementationDeadline: tempDeadline,
        decidedAt: new Date().toLocaleDateString('ru-RU'),
        decidedBy: 'Кайдзен-комиссия MES Mebelain',
      },
      [tempComment1, tempComment2, tempComment3].filter(Boolean)
    );
    setEditingIdea(null);
  };

  const getStatusBadge = (status: CommissionStatus) => {
    switch (status) {
      case 'IN_WORK':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> &quot;В работу&quot;
          </span>
        );
      case 'PROJECT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <Wrench className="w-3 h-3 text-blue-600" /> &quot;Проект&quot;
          </span>
        );
      case 'REWORK':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" /> &quot;Доработать&quot;
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-600" /> &quot;Отклонить&quot;
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            <Clock className="w-3 h-3 text-slate-500" /> На рассмотрении
          </span>
        );
    }
  };

  const filteredIdeas = ideas.filter(idea => {
    const matchesDept = filterDept === 'ALL' || idea.targetDepartmentCode === filterDept;
    const matchesStatus = filterStatus === 'ALL' || idea.commission.status === filterStatus;
    const matchesSearch =
      searchQuery.trim() === '' ||
      idea.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.authorFullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.superIdeaText.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Панель фильтров */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Поиск по номеру, ФИО, идее..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full text-xs sm:text-sm pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterDept}
            onChange={e => setFilterDept(e.target.value)}
            className="text-xs sm:text-sm border border-slate-200 rounded-lg px-2.5 py-2 bg-white text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          >
            <option value="ALL">Все подразделения</option>
            {departments.map(d => (
              <option key={d.id} value={d.code}>{d.name}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="text-xs sm:text-sm border border-slate-200 rounded-lg px-2.5 py-2 bg-white text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          >
            <option value="ALL">Все статусы</option>
            <option value="IN_WORK">&quot;В работу&quot;</option>
            <option value="PROJECT">&quot;Проект&quot;</option>
            <option value="REWORK">&quot;Доработать&quot;</option>
            <option value="REJECTED">&quot;Отклонить&quot;</option>
            <option value="PENDING">На рассмотрении</option>
          </select>
        </div>
      </div>

      {/* Список предложений */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-xs">
                <th className="py-3 px-4">Бланк № / Дата</th>
                <th className="py-3 px-4">Автор и должность</th>
                <th className="py-3 px-4">Участок</th>
                <th className="py-3 px-4">Суть супер идеи</th>
                <th className="py-3 px-4">Фото</th>
                <th className="py-3 px-4">Решение комиссии</th>
                <th className="py-3 px-4 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredIdeas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Предложения не найдены по заданным критериям
                  </td>
                </tr>
              ) : (
                filteredIdeas.map(idea => (
                  <tr key={idea.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      <div>{idea.registrationNumber}</div>
                      <div className="text-[11px] font-normal text-slate-400">{idea.createdAt}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{idea.authorFullName}</div>
                      <div className="text-xs text-slate-500">{idea.authorPosition}</div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-block bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-semibold">
                        {idea.targetDepartmentCode === 'OTHER'
                          ? `Другое (${idea.targetDepartmentOtherText || '—'})`
                          : idea.targetDepartmentCode}
                      </span>
                    </td>

                    <td className="py-3 px-4 max-w-xs truncate text-slate-700" title={idea.superIdeaText}>
                      {idea.superIdeaText}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        {idea.currentSituationPhotoUrl && (
                          <span className="text-[10px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded" title="Есть фото БЫЛО">
                            Было
                          </span>
                        )}
                        {idea.superIdeaPhotoUrl && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded" title="Есть фото СТАЛО">
                            Стало
                          </span>
                        )}
                        {!idea.currentSituationPhotoUrl && !idea.superIdeaPhotoUrl && (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1 items-start">
                        {getStatusBadge(idea.commission.status)}
                        {idea.commission.responsiblePerson && (
                          <span className="text-[11px] text-slate-500">
                            Отв: {idea.commission.responsiblePerson}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openCommissionModal(idea)}
                          title="Заполнить решение комиссии и комментарии"
                          className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onSelectForPrint(idea)}
                          title="Открыть и напечатать официальный бланк A4"
                          className="flex items-center gap-1 bg-slate-900 hover:bg-emerald-700 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Бланк А4</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Модальное окно Решения комиссии / Комментариев руководителей */}
      {editingIdea && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Решение комиссии по бланку {editingIdea.registrationNumber}
                </h3>
                <p className="text-xs text-slate-500">
                  Автор: {editingIdea.authorFullName} ({editingIdea.targetDepartmentCode})
                </p>
              </div>
              <button
                onClick={() => setEditingIdea(null)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Выбор статуса */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                Статус предложения:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { key: 'IN_WORK', label: '"В работу"' },
                  { key: 'PROJECT', label: '"Проект"' },
                  { key: 'REWORK', label: '"Доработать"' },
                  { key: 'REJECTED', label: '"Отклонить"' },
                ].map(item => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setTempStatus(item.key as CommissionStatus)}
                    className={`p-2.5 rounded-xl border text-center font-semibold transition-all cursor-pointer ${
                      tempStatus === item.key
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-600'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Причина отклонения */}
            {tempStatus === 'REJECTED' && (
              <div>
                <label className="block text-xs font-semibold text-rose-700 mb-1">
                  Причина отклонения (печатается в бланке):
                </label>
                <input
                  type="text"
                  value={tempReason}
                  onChange={e => setTempReason(e.target.value)}
                  placeholder="Экономически нецелесообразно / нарушает регламент безопасности..."
                  className="w-full text-xs border border-rose-300 rounded-lg p-2.5 focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                />
              </div>
            )}

            {/* Ответственный и Срок внедрения */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ответственный за внедрение:
                </label>
                <input
                  type="text"
                  value={tempResponsible}
                  onChange={e => setTempResponsible(e.target.value)}
                  placeholder="ФИО и должность ответственного"
                  className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Срок внедрения:
                </label>
                <input
                  type="text"
                  value={tempDeadline}
                  onChange={e => setTempDeadline(e.target.value)}
                  placeholder="Например: 15.12.2026"
                  className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Редактирование строк комментариев */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Комментарии начальника участка и технолога:
              </label>
              <div className="space-y-1.5">
                <input
                  type="text"
                  value={tempComment1}
                  onChange={e => setTempComment1(e.target.value)}
                  placeholder="1. Комментарий..."
                  className="w-full text-xs border border-slate-200 rounded-md p-1.5"
                />
                <input
                  type="text"
                  value={tempComment2}
                  onChange={e => setTempComment2(e.target.value)}
                  placeholder="2. Комментарий..."
                  className="w-full text-xs border border-slate-200 rounded-md p-1.5"
                />
                <input
                  type="text"
                  value={tempComment3}
                  onChange={e => setTempComment3(e.target.value)}
                  placeholder="3. Комментарий..."
                  className="w-full text-xs border border-slate-200 rounded-md p-1.5"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setEditingIdea(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={saveCommissionDecision}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm cursor-pointer"
              >
                Сохранить в бланк
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
