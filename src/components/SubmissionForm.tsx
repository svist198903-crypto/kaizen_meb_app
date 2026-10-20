import React, { useState, useEffect } from 'react';
import { KaizenIdea, Department, LossType } from '../types/kaizen';
import { Camera, Check, Upload, Sparkles, AlertTriangle, ShieldCheck, Award, Zap, FileText, ArrowRight, User } from 'lucide-react';

interface SubmissionFormProps {
  departments: Department[];
  lossTypes: LossType[];
  onSubmit: (idea: KaizenIdea) => void;
  initialData?: Partial<KaizenIdea>;
}

export const SubmissionForm: React.FC<SubmissionFormProps> = ({
  departments,
  lossTypes,
  onSubmit,
  initialData,
}) => {
  // Автозаполнение из Telegram WebApp если доступно
  const [tgUser, setTgUser] = useState<{ id?: number; first_name?: string; last_name?: string; username?: string }>({});

  useEffect(() => {
    // @ts-ignore
    const tg = window?.Telegram?.WebApp;
    if (tg?.initDataUnsafe?.user) {
      setTgUser(tg.initDataUnsafe.user);
    }
  }, []);

  const [authorFullName, setAuthorFullName] = useState(
    initialData?.authorFullName || 
    (tgUser.first_name ? `${tgUser.first_name} ${tgUser.last_name || ''}`.trim() : 'Иванов Алексей Сергеевич')
  );
  const [authorPosition, setAuthorPosition] = useState(initialData?.authorPosition || 'Оператор станка');
  const [authorSection, setAuthorSection] = useState(initialData?.authorSection || 'Участок №1');

  const [targetDepartmentCode, setTargetDepartmentCode] = useState(initialData?.targetDepartmentCode || 'PL');
  const [targetDepartmentOtherText, setTargetDepartmentOtherText] = useState(initialData?.targetDepartmentOtherText || '');

  const [increasesSafety, setIncreasesSafety] = useState(initialData?.increasesSafety ?? false);
  const [improvesQuality, setImprovesQuality] = useState(initialData?.improvesQuality ?? true);
  const [eliminatesLosses, setEliminatesLosses] = useState(initialData?.eliminatesLosses ?? true);

  const [selectedLossCodes, setSelectedLossCodes] = useState<string[]>(
    initialData?.selectedLossCodes || ['DEFECTS', 'MOTION']
  );

  const [currentSituationText, setCurrentSituationText] = useState(
    initialData?.currentSituationText || ''
  );
  const [currentSituationPhotoUrl, setCurrentSituationPhotoUrl] = useState<string>(
    initialData?.currentSituationPhotoUrl || ''
  );

  const [superIdeaText, setSuperIdeaText] = useState(
    initialData?.superIdeaText || ''
  );
  const [superIdeaPhotoUrl, setSuperIdeaPhotoUrl] = useState<string>(
    initialData?.superIdeaPhotoUrl || ''
  );

  const [supervisorComment1, setSupervisorComment1] = useState(initialData?.supervisorComments?.[0] || '');
  const [supervisorComment2, setSupervisorComment2] = useState(initialData?.supervisorComments?.[1] || '');
  const [supervisorComment3, setSupervisorComment3] = useState(initialData?.supervisorComments?.[2] || '');

  const toggleLoss = (code: string) => {
    setSelectedLossCodes(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'before' | 'after') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          if (target === 'before') {
            setCurrentSituationPhotoUrl(reader.result);
          } else {
            setSuperIdeaPhotoUrl(reader.result);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.${today.getFullYear()}`;
    const randomNum = Math.floor(100 + Math.random() * 900);

    const newIdea: KaizenIdea = {
      id: initialData?.id || `kz-${Date.now()}`,
      registrationNumber: initialData?.registrationNumber || `KZ-2026-${randomNum}`,
      createdAt: initialData?.createdAt || formattedDate,
      authorFullName,
      authorPosition,
      authorSection,
      authorTelegramId: tgUser.id || 48921849,
      authorTelegramUsername: tgUser.username || 'kaizen_user',
      targetDepartmentCode,
      targetDepartmentOtherText: targetDepartmentCode === 'OTHER' ? targetDepartmentOtherText : '',
      increasesSafety,
      improvesQuality,
      eliminatesLosses,
      selectedLossCodes,
      currentSituationText,
      currentSituationPhotoUrl,
      superIdeaText,
      superIdeaPhotoUrl,
      supervisorComments: [supervisorComment1, supervisorComment2, supervisorComment3].filter(Boolean),
      commission: initialData?.commission || {
        status: 'PENDING',
        rejectionReason: '',
        responsiblePerson: '',
        implementationDeadline: '',
      },
    };

    onSubmit(newIdea);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 pb-12">
      {/* Шапка формы TWA */}
      <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-teal-900 text-white p-5 rounded-2xl shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-white/10 rounded-xl backdrop-blur-xs">
              <Sparkles className="w-6 h-6 text-emerald-300" />
            </span>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Подать KAIZEN-предложение</h2>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                MES Mebelain • 60-секундная подача с генерацией бланка А4
              </p>
            </div>
          </div>
          <span className="text-xs bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 px-2.5 py-1 rounded-full font-medium">
            TWA Ready
          </span>
        </div>
      </div>

      {/* 1. Блок автора */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
            <User className="w-4 h-4 text-emerald-600" />
            <span>Данные автора предложения</span>
          </div>
          {tgUser.username && (
            <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-md">
              @{tgUser.username}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">ФИО сотрудника *</label>
            <input
              type="text"
              required
              value={authorFullName}
              onChange={e => setAuthorFullName(e.target.value)}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              placeholder="Иванов Алексей Сергеевич"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Должность *</label>
            <input
              type="text"
              required
              value={authorPosition}
              onChange={e => setAuthorPosition(e.target.value)}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              placeholder="Оператор станка"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Участок автора *</label>
            <input
              type="text"
              required
              value={authorSection}
              onChange={e => setAuthorSection(e.target.value)}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              placeholder="Участок кромкооблицовки №2"
            />
          </div>
        </div>
      </div>

      {/* 2. Подразделение внедрения */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-3">
        <label className="block text-sm font-semibold text-slate-800">
          В каком подразделении собираешься внедрить свою идею? *
        </label>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {departments.map(dept => {
            const isSelected = targetDepartmentCode === dept.code;
            return (
              <button
                type="button"
                key={dept.id}
                onClick={() => setTargetDepartmentCode(dept.code)}
                className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-semibold ring-1 ring-emerald-600'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50/50'
                }`}
              >
                <span className="text-xs">{dept.name}</span>
                <span className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] ${
                  isSelected ? 'bg-emerald-600 text-white' : 'border border-slate-300'
                }`}>
                  {isSelected ? '✓' : ''}
                </span>
              </button>
            );
          })}
        </div>

        {targetDepartmentCode === 'OTHER' && (
          <div className="mt-2">
            <input
              type="text"
              value={targetDepartmentOtherText}
              onChange={e => setTargetDepartmentOtherText(e.target.value)}
              placeholder="Укажите конкретное подразделение или склад..."
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>
        )}
      </div>

      {/* 3. Цели и Виды потерь */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-2">
            Ваше предложение (выберите эффекты):
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setIncreasesSafety(!increasesSafety)}
              className={`flex items-center gap-2 p-3 rounded-xl border transition-all cursor-pointer ${
                increasesSafety
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className={`w-4 h-4 ${increasesSafety ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span className="text-xs">Увеличит безопасность</span>
            </button>

            <button
              type="button"
              onClick={() => setImprovesQuality(!improvesQuality)}
              className={`flex items-center gap-2 p-3 rounded-xl border transition-all cursor-pointer ${
                improvesQuality
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Award className={`w-4 h-4 ${improvesQuality ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span className="text-xs">Улучшит качество</span>
            </button>

            <button
              type="button"
              onClick={() => setEliminatesLosses(!eliminatesLosses)}
              className={`flex items-center gap-2 p-3 rounded-xl border transition-all cursor-pointer ${
                eliminatesLosses
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Zap className={`w-4 h-4 ${eliminatesLosses ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span className="text-xs">Уберёт потери</span>
            </button>
          </div>
        </div>

        {/* Виды потерь (7 видов Lean) */}
        {eliminatesLosses && (
          <div className="pt-3 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              А какие виды потерь бывают? (выберите устраняемые потери):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {lossTypes.map(loss => {
                const isSelected = selectedLossCodes.includes(loss.code);
                return (
                  <button
                    type="button"
                    key={loss.id}
                    onClick={() => toggleLoss(loss.code)}
                    className={`flex items-center justify-between p-2 rounded-lg border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-medium'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xs truncate">{loss.name}</span>
                    <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[9px] ${
                      isSelected ? 'bg-emerald-600 text-white' : 'border border-slate-300'
                    }`}>
                      {isSelected ? '✓' : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 4. Описание ситуации: БЫЛО vs СТАЛО + Загрузка фотографий */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Текущая ситуация (Было) */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-red-700 uppercase tracking-wider bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                Было (Текущая ситуация)
              </span>
              <label className="flex items-center gap-1 text-xs text-slate-600 hover:text-emerald-600 cursor-pointer bg-slate-100 hover:bg-emerald-50 px-2 py-1 rounded-md transition-colors">
                <Camera className="w-3.5 h-3.5" />
                <span>Фото &quot;Было&quot;</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={e => handleFileUpload(e, 'before')}
                />
              </label>
            </div>

            <textarea
              required
              rows={4}
              value={currentSituationText}
              onChange={e => setCurrentSituationText(e.target.value)}
              placeholder="Опишите ситуацию, которая существует на данный момент (проблема, задержка, перерасход, неудобство)..."
              className="w-full text-xs sm:text-sm border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          {currentSituationPhotoUrl && (
            <div className="mt-3 relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 max-h-40 flex items-center justify-center group">
              <img
                src={currentSituationPhotoUrl}
                alt="Предпросмотр ситуации"
                className="w-full h-40 object-cover"
              />
              <button
                type="button"
                onClick={() => setCurrentSituationPhotoUrl('')}
                className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Удалить фото
              </button>
            </div>
          )}
        </div>

        {/* Супер идея (Стало) */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                Стало (Супер идея)
              </span>
              <label className="flex items-center gap-1 text-xs text-slate-600 hover:text-emerald-600 cursor-pointer bg-slate-100 hover:bg-emerald-50 px-2 py-1 rounded-md transition-colors">
                <Camera className="w-3.5 h-3.5" />
                <span>Фото &quot;Стало&quot;</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={e => handleFileUpload(e, 'after')}
                />
              </label>
            </div>

            <textarea
              required
              rows={4}
              value={superIdeaText}
              onChange={e => setSuperIdeaText(e.target.value)}
              placeholder="Опиши свою супер идею (что конкретно сделать, переставить, изменить, доработать)..."
              className="w-full text-xs sm:text-sm border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          {superIdeaPhotoUrl && (
            <div className="mt-3 relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 max-h-40 flex items-center justify-center group">
              <img
                src={superIdeaPhotoUrl}
                alt="Предпросмотр идеи"
                className="w-full h-40 object-cover"
              />
              <button
                type="button"
                onClick={() => setSuperIdeaPhotoUrl('')}
                className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Удалить фото
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 5. Комментарии руководителя и технолога */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-3">
        <div>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
            Комментарии руководителя участка и технолога
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Обязательно согласуйте идею с руководителем участка, где внедряется рацпредложение
          </p>
        </div>

        <div className="space-y-2">
          <input
            type="text"
            value={supervisorComment1}
            onChange={e => setSupervisorComment1(e.target.value)}
            placeholder="1. Комментарий начальника участка (например: согласовано, поддерживаю)..."
            className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          />
          <input
            type="text"
            value={supervisorComment2}
            onChange={e => setSupervisorComment2(e.target.value)}
            placeholder="2. Комментарий технолога (по технической возможности / материалам)..."
            className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          />
          <input
            type="text"
            value={supervisorComment3}
            onChange={e => setSupervisorComment3(e.target.value)}
            placeholder="3. Дополнительные замечания или предложения по оснастке..."
            className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Кнопка отправки */}
      <div className="pt-2">
        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base"
        >
          <span>Зарегистрировать и сформировать печатный бланк KAIZEN</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};
