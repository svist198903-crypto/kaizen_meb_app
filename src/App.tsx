import React, { useState, useEffect } from 'react';
import { INITIAL_DEPARTMENTS, INITIAL_LOSS_TYPES, SAMPLE_IDEAS } from './data/initialData';
import { KaizenIdea, Department, LossType } from './types/kaizen';
import { KaizenPrintForm } from './components/KaizenPrintForm';
import { SubmissionForm } from './components/SubmissionForm';
import { IdeasRegistry } from './components/IdeasRegistry';
import { CatalogsManager } from './components/CatalogsManager';
import { BackendCodeViewer } from './components/BackendCodeViewer';
import { FreeDeploymentGuide } from './components/FreeDeploymentGuide';
import { 
  FileText, 
  Printer, 
  PlusCircle, 
  Database, 
  Code2, 
  Smartphone, 
  CheckCircle,
  HelpCircle,
  ChevronRight,
  ExternalLink,
  Rocket
} from 'lucide-react';

export default function App() {
  const [departments, setDepartments] = useState<Department[]>(INITIAL_DEPARTMENTS);
  const [lossTypes, setLossTypes] = useState<LossType[]>(INITIAL_LOSS_TYPES);
  const [ideas, setIdeas] = useState<KaizenIdea[]>(SAMPLE_IDEAS);

  // Выбранная идея для предпросмотра и печати
  const [selectedIdeaForPrint, setSelectedIdeaForPrint] = useState<KaizenIdea>(SAMPLE_IDEAS[0]);

  // Текущая активная вкладка
  const [activeTab, setActiveTab] = useState<'submit' | 'print' | 'registry' | 'catalogs' | 'backend' | 'deploy'>('print');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Инициализация из URL параметров если переданы (например ?mode=print&idea_id=kz-1)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    const ideaId = params.get('idea_id');

    if (ideaId) {
      const found = ideas.find(i => i.id === ideaId || i.registrationNumber === ideaId);
      if (found) {
        setSelectedIdeaForPrint(found);
      }
    }

    if (mode === 'print') {
      setActiveTab('print');
    } else if (mode === 'create') {
      setActiveTab('submit');
    } else if (mode === 'registry' || mode === 'admin') {
      setActiveTab('registry');
    } else if (mode === 'deploy') {
      setActiveTab('deploy');
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleNewSubmission = (newIdea: KaizenIdea) => {
    setIdeas(prev => [newIdea, ...prev]);
    setSelectedIdeaForPrint(newIdea);
    setActiveTab('print');
    showToast(`Предложение ${newIdea.registrationNumber} успешно зарегистрировано! Сформирован официальный бланк.`);
  };

  const handleUpdateCommission = (
    ideaId: string, 
    commissionData: KaizenIdea['commission'], 
    comments?: string[]
  ) => {
    setIdeas(prev =>
      prev.map(i => {
        if (i.id === ideaId) {
          const updated: KaizenIdea = {
            ...i,
            commission: commissionData,
            supervisorComments: comments || i.supervisorComments,
          };
          if (selectedIdeaForPrint.id === ideaId) {
            setSelectedIdeaForPrint(updated);
          }
          return updated;
        }
        return i;
      })
    );
    showToast('Решение комиссии и комментарии сохранены в бланк!');
  };

  const handleSelectForPrint = (idea: KaizenIdea) => {
    setSelectedIdeaForPrint(idea);
    setActiveTab('print');
  };

  const handleAddDepartment = (dept: Department) => {
    setDepartments(prev => [...prev.filter(d => d.code !== 'OTHER'), dept, prev.find(d => d.code === 'OTHER')!].filter(Boolean));
    showToast(`Подразделение ${dept.code} добавлено в справочник`);
  };

  const handleRemoveDepartment = (id: string) => {
    setDepartments(prev => prev.filter(d => d.id !== id));
    showToast('Подразделение удалено из справочника');
  };

  const handleAddLossType = (loss: LossType) => {
    setLossTypes(prev => [...prev, loss]);
    showToast(`Вид потерь «${loss.name}» добавлен`);
  };

  const handleRemoveLossType = (id: string) => {
    setLossTypes(prev => prev.filter(l => l.id !== id));
    showToast('Вид потерь удален');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans">
      
      {/* Верхний баннер Telegram Web App / Навигация (скрывается при печати @media print) */}
      <header className="no-print bg-slate-900 border-b border-slate-800 sticky top-0 z-40 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2">
          
          {/* Бренд и статус TWA */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-black text-white text-xs shadow-inner">
              KZ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-wide">MES Mebelain KAIZEN</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-mono">
                  v2.4
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Telegram Web App &amp; Официальный бланк A4
              </p>
            </div>
          </div>

          {/* Навигационные табы */}
          <nav className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 sm:pb-0 text-xs">
            <button
              onClick={() => setActiveTab('print')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'print'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Печатный бланк А4</span>
            </button>

            <button
              onClick={() => setActiveTab('submit')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'submit'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Подать идею (TWA)</span>
            </button>

            <button
              onClick={() => setActiveTab('registry')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'registry'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Реестр ({ideas.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('catalogs')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'catalogs'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Справочники</span>
            </button>

            <button
              onClick={() => setActiveTab('backend')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'backend'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Код бэкенда</span>
            </button>

            <button
              onClick={() => setActiveTab('deploy')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'deploy'
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                  : 'bg-emerald-950/80 text-emerald-300 hover:text-white border border-emerald-500/40 hover:bg-emerald-900/60'
              }`}
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>Деплой без сервера (0 ₽)</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Всплывающее уведомление (Toast) */}
      {toastMessage && (
        <div className="no-print fixed bottom-5 right-5 z-50 bg-emerald-700 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-emerald-600 animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Основной контент */}
      <main className="flex-1 w-full max-w-6xl mx-auto p-4 sm:p-6">
        
        {/* Вкладка 1: Печатный бланк А4 */}
        {activeTab === 'print' && (
          <div className="space-y-4">
            {/* Селектор предложения для печати (скрывается при @media print) */}
            <div className="no-print bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">Выбранный бланк:</span>
                <select
                  value={selectedIdeaForPrint.id}
                  onChange={e => {
                    const found = ideas.find(i => i.id === e.target.value);
                    if (found) setSelectedIdeaForPrint(found);
                  }}
                  className="font-mono font-bold text-slate-900 border border-slate-300 rounded-lg px-2.5 py-1.5 bg-slate-50 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  {ideas.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.registrationNumber} — {item.authorFullName} ({item.targetDepartmentCode})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 text-slate-500">
                <span>Совет: для сохранения в PDF в окне печати выберите «Сохранить как PDF»</span>
              </div>
            </div>

            {/* Официальный компонент бланка */}
            <KaizenPrintForm
              idea={selectedIdeaForPrint}
              departments={departments}
              lossTypes={lossTypes}
              isPrintPreviewMode={true}
            />
          </div>
        )}

        {/* Вкладка 2: 60-секундная подача из Telegram Web App */}
        {activeTab === 'submit' && (
          <SubmissionForm
            departments={departments}
            lossTypes={lossTypes}
            onSubmit={handleNewSubmission}
          />
        )}

        {/* Вкладка 3: Реестр идей и кабинет комиссии */}
        {activeTab === 'registry' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Реестр предложений KAIZEN</h2>
                <p className="text-xs text-slate-500">
                  Учет поданных рацпредложений, заполнение решения комиссии и печать бланков A4
                </p>
              </div>
              <button
                onClick={() => setActiveTab('submit')}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Новое предложение</span>
              </button>
            </div>

            <IdeasRegistry
              ideas={ideas}
              departments={departments}
              onSelectForPrint={handleSelectForPrint}
              onUpdateCommission={handleUpdateCommission}
            />
          </div>
        )}

        {/* Вкладка 4: Справочники участков и видов потерь */}
        {activeTab === 'catalogs' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Справочники системы</h2>
              <p className="text-xs text-slate-500">
                Динамическое добавление и редактирование участков (PL, KA, PO, BU, DE, MA) и видов потерь
              </p>
            </div>

            <CatalogsManager
              departments={departments}
              lossTypes={lossTypes}
              onAddDepartment={handleAddDepartment}
              onRemoveDepartment={handleRemoveDepartment}
              onAddLossType={handleAddLossType}
              onRemoveLossType={handleRemoveLossType}
            />
          </div>
        )}

        {/* Вкладка 5: Исходный код бэкенда */}
        {activeTab === 'backend' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Серверная архитектура системы</h2>
              <p className="text-xs text-slate-500">
                Полный стек: PostgreSQL + SQLAlchemy 2.0 (Async) + Pydantic v2 + FastAPI + aiogram 3.x
              </p>
            </div>

            <BackendCodeViewer />
          </div>
        )}

        {/* Вкладка 6: Деплой без сервера (0 ₽) */}
        {activeTab === 'deploy' && (
          <FreeDeploymentGuide />
        )}

      </main>

      {/* Подвал (скрывается при печати) */}
      <footer className="no-print bg-white border-t border-slate-200 py-4 mt-auto text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 MES Mebelain by sba home — Система непрерывного совершенствования KAIZEN</p>
          <div className="flex items-center gap-3">
            <span>React 19</span>
            <span>•</span>
            <span>Tailwind CSS</span>
            <span>•</span>
            <span>FastAPI</span>
            <span>•</span>
            <span>aiogram 3.x</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
