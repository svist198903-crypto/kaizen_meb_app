import React from 'react';
import { KaizenIdea, Department, LossType } from '../types/kaizen';
import { Printer, Camera, CheckSquare, Square, AlertCircle } from 'lucide-react';

interface KaizenPrintFormProps {
  idea: KaizenIdea;
  departments: Department[];
  lossTypes: LossType[];
  onPrint?: () => void;
  isPrintPreviewMode?: boolean;
}

export const KaizenPrintForm: React.FC<KaizenPrintFormProps> = ({
  idea,
  departments,
  lossTypes,
  onPrint,
  isPrintPreviewMode = false,
}) => {
  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  const isDeptSelected = (code: string) => idea.targetDepartmentCode === code;
  const isLossSelected = (code: string) => idea.selectedLossCodes.includes(code);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Кнопка печати и панель управления для экрана */}
      <div className="no-print w-full max-w-[210mm] mb-4 flex items-center justify-between bg-slate-900 text-white p-4 rounded-xl shadow-lg border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            A4
          </div>
          <div>
            <h3 className="font-semibold text-sm sm:text-base">Официальный печатный бланк KAIZEN</h3>
            <p className="text-xs text-slate-400">MES Mebelain by sba home • Формат A4 с авто-подгонкой полей</p>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition-all text-white font-medium px-4 py-2.5 rounded-lg shadow-sm cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Распечатать бланк</span>
        </button>
      </div>

      {/* Лист А4 (Отображается на экране как лист бумаги 210x297мм, а при @media print строго занимает 1 страницу) */}
      <div className="print-page-container bg-white text-slate-900 w-full max-w-[210mm] min-h-[297mm] p-6 sm:p-8 sm:shadow-2xl sm:rounded-sm border border-slate-300 print:border-none print:shadow-none print:p-0 flex flex-col justify-between font-sans leading-tight text-[11px] selection:bg-emerald-100">
        
        {/* ================= ВЕРХНЯЯ ШАПКА ================= */}
        <div>
          <div className="flex items-center justify-between border-b-2 border-slate-800 pb-2 mb-3">
            {/* Логотип MES */}
            <div className="flex items-center gap-2">
              <div className="relative w-16 h-12 flex items-center justify-center">
                <svg viewBox="0 0 120 70" className="w-16 h-10">
                  <ellipse cx="60" cy="35" rx="55" ry="30" fill="none" stroke="#1e293b" strokeWidth="2.5" />
                  <path d="M 12 35 C 30 10, 80 10, 108 35" fill="none" stroke="#eab308" strokeWidth="4" strokeLinecap="round" />
                  <path d="M 15 42 C 40 60, 85 58, 105 38" fill="none" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
                  <path d="M 25 50 C 50 64, 75 62, 95 48" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
                  <text x="60" y="42" textAnchor="middle" fill="#0f172a" fontSize="22" fontWeight="900" fontFamily="sans-serif" letterSpacing="1">
                    MES
                  </text>
                </svg>
              </div>
            </div>

            {/* Центральный заголовок: KAIZEN No [    ] */}
            <div className="flex items-center gap-3">
              <span className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-wider">
                KAIZEN
              </span>
              <div className="flex items-center gap-1.5 border-2 border-slate-900 px-3 py-1 bg-slate-50 rounded-xs">
                <span className="font-bold text-slate-700 underline text-xs">No</span>
                <span className="font-mono font-bold text-xs sm:text-sm text-slate-900 min-w-[70px] text-center">
                  {idea.registrationNumber || '________'}
                </span>
              </div>
            </div>

            {/* Логотип Mebelain by sba home */}
            <div className="flex items-center gap-2 text-right">
              <svg viewBox="0 0 140 45" className="w-28 sm:w-32 h-10">
                <circle cx="20" cy="22" r="14" fill="none" stroke="#059669" strokeWidth="3.5" />
                <path d="M 13 22 A 7 7 0 1 1 20 29 A 4 4 0 1 1 20 25" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
                <text x="42" y="22" fill="#059669" fontSize="16" fontWeight="800" fontFamily="sans-serif">
                  Mebelain
                </text>
                <text x="43" y="34" fill="#059669" fontSize="9" fontWeight="600" fontFamily="sans-serif">
                  by sba home
                </text>
              </svg>
            </div>
          </div>

          {/* ================= ДАННЫЕ АВТОРА И ПОДРАЗДЕЛЕНИЕ ================= */}
          <div className="grid grid-cols-12 gap-3 mb-3 text-[11px]">
            {/* Левый блок: Автор */}
            <div className="col-span-6 space-y-1.5 pr-2">
              <div className="flex items-baseline">
                <span className="font-bold w-20 text-slate-800">Дата:</span>
                <div className="flex-1 border-b border-slate-700 font-medium px-1 text-slate-900 pb-0.5">
                  {idea.createdAt || '_______________'}
                </div>
              </div>
              <div className="flex items-baseline">
                <span className="font-bold w-20 text-slate-800">ФИО:</span>
                <div className="flex-1 border-b border-slate-700 font-semibold px-1 text-slate-900 pb-0.5 truncate">
                  {idea.authorFullName || '______________________________'}
                </div>
              </div>
              <div className="flex items-baseline">
                <span className="font-bold w-20 text-slate-800">Должность:</span>
                <div className="flex-1 border-b border-slate-700 font-medium px-1 text-slate-800 pb-0.5 truncate">
                  {idea.authorPosition || '______________________________'}
                </div>
              </div>
              <div className="flex items-baseline">
                <span className="font-bold w-20 text-slate-800">Участок:</span>
                <div className="flex-1 border-b border-slate-700 font-medium px-1 text-slate-800 pb-0.5 truncate">
                  {idea.authorSection || '______________________________'}
                </div>
              </div>
            </div>

            {/* Правый блок: Подразделение внедрения */}
            <div className="col-span-6 pl-2 border-l border-slate-300">
              <p className="font-bold text-slate-800 mb-1.5 text-[10.5px]">
                В каком подразделении собираешься внедрить свою идею?
              </p>
              <div className="grid grid-cols-4 gap-y-1.5 gap-x-2 text-[10.5px]">
                {/* 1 ряд: PL, KA, PO, Другое */}
                <label className="flex items-center gap-1 cursor-default">
                  <span className={`w-3.5 h-3.5 border border-slate-800 flex items-center justify-center font-bold text-[10px] ${isDeptSelected('PL') ? 'bg-slate-900 text-white' : 'bg-white'}`}>
                    {isDeptSelected('PL') ? '✓' : ''}
                  </span>
                  <span className="font-semibold">PL</span>
                </label>

                <label className="flex items-center gap-1 cursor-default">
                  <span className={`w-3.5 h-3.5 border border-slate-800 flex items-center justify-center font-bold text-[10px] ${isDeptSelected('KA') ? 'bg-slate-900 text-white' : 'bg-white'}`}>
                    {isDeptSelected('KA') ? '✓' : ''}
                  </span>
                  <span className="font-semibold">KA</span>
                </label>

                <label className="flex items-center gap-1 cursor-default">
                  <span className={`w-3.5 h-3.5 border border-slate-800 flex items-center justify-center font-bold text-[10px] ${isDeptSelected('PO') ? 'bg-slate-900 text-white' : 'bg-white'}`}>
                    {isDeptSelected('PO') ? '✓' : ''}
                  </span>
                  <span className="font-semibold">PO</span>
                </label>

                <div className="flex items-center gap-1 col-span-1">
                  <span className={`w-3.5 h-3.5 border border-slate-800 flex items-center justify-center font-bold text-[10px] ${isDeptSelected('OTHER') ? 'bg-slate-900 text-white' : 'bg-white'}`}>
                    {isDeptSelected('OTHER') ? '✓' : ''}
                  </span>
                  <span className="text-[10px]">Другое</span>
                </div>

                {/* 2 ряд: BU, DE, MA, текст для другое */}
                <label className="flex items-center gap-1 cursor-default">
                  <span className={`w-3.5 h-3.5 border border-slate-800 flex items-center justify-center font-bold text-[10px] ${isDeptSelected('BU') ? 'bg-slate-900 text-white' : 'bg-white'}`}>
                    {isDeptSelected('BU') ? '✓' : ''}
                  </span>
                  <span className="font-semibold">BU</span>
                </label>

                <label className="flex items-center gap-1 cursor-default">
                  <span className={`w-3.5 h-3.5 border border-slate-800 flex items-center justify-center font-bold text-[10px] ${isDeptSelected('DE') ? 'bg-slate-900 text-white' : 'bg-white'}`}>
                    {isDeptSelected('DE') ? '✓' : ''}
                  </span>
                  <span className="font-semibold">DE</span>
                </label>

                <label className="flex items-center gap-1 cursor-default">
                  <span className={`w-3.5 h-3.5 border border-slate-800 flex items-center justify-center font-bold text-[10px] ${isDeptSelected('MA') ? 'bg-slate-900 text-white' : 'bg-white'}`}>
                    {isDeptSelected('MA') ? '✓' : ''}
                  </span>
                  <span className="font-semibold">MA</span>
                </label>

                <div className="border-b border-slate-700 text-[10px] px-1 truncate">
                  {idea.targetDepartmentOtherText || ''}
                </div>
              </div>
            </div>
          </div>

          {/* ================= ЦЕЛИ ПРЕДЛОЖЕНИЯ И ВИДЫ ПОТЕРЬ ================= */}
          <div className="border-t border-slate-300 pt-2 mb-3">
            <div className="grid grid-cols-12 gap-2">
              {/* Левый блок целей */}
              <div className="col-span-4 space-y-1">
                <p className="font-bold text-slate-800 text-[10.5px]">Ваше предложение:</p>
                <div className="flex items-center gap-1.5">
                  <span className={`w-3.5 h-3.5 border border-slate-800 flex items-center justify-center font-bold text-[10px] ${idea.increasesSafety ? 'bg-slate-900 text-white' : 'bg-white'}`}>
                    {idea.increasesSafety ? '✓' : ''}
                  </span>
                  <span>увеличит безопасность</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-3.5 h-3.5 border border-slate-800 flex items-center justify-center font-bold text-[10px] ${idea.improvesQuality ? 'bg-slate-900 text-white' : 'bg-white'}`}>
                    {idea.improvesQuality ? '✓' : ''}
                  </span>
                  <span>улучшит качество</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-3.5 h-3.5 border border-slate-800 flex items-center justify-center font-bold text-[10px] ${idea.eliminatesLosses ? 'bg-slate-900 text-white' : 'bg-white'}`}>
                    {idea.eliminatesLosses ? '✓' : ''}
                  </span>
                  <span className="font-medium">уберёт потери:</span>
                </div>
              </div>

              {/* Правый блок: А какие виды потерь бывают? (с 7 видами потерь) */}
              <div className="col-span-8 bg-slate-50/70 p-1.5 rounded-sm border border-slate-200">
                <div className="flex items-center gap-1 mb-1 text-slate-700 font-bold text-[10px]">
                  <span className="text-amber-500 font-extrabold text-xs">?</span>
                  <span>А какие виды потерь бывают?</span>
                </div>

                <div className="grid grid-cols-4 gap-1.5 text-[9.5px]">
                  {/* 1. Перепроизводство */}
                  <div className="flex items-center gap-1">
                    <span className={`w-3 h-3 border border-slate-700 flex items-center justify-center font-bold text-[8px] ${isLossSelected('OVERPRODUCTION') ? 'bg-slate-900 text-white' : 'bg-white'}`}>
                      {isLossSelected('OVERPRODUCTION') ? '✓' : ''}
                    </span>
                    <span className="leading-tight">Перепроизводство</span>
                  </div>

                  {/* 2. Излишние запасы */}
                  <div className="flex items-center gap-1">
                    <span className={`w-3 h-3 border border-slate-700 flex items-center justify-center font-bold text-[8px] ${isLossSelected('INVENTORY') ? 'bg-slate-900 text-white' : 'bg-white'}`}>
                      {isLossSelected('INVENTORY') ? '✓' : ''}
                    </span>
                    <span className="leading-tight">Излишние запасы</span>
                  </div>

                  {/* 3. Лишние движения */}
                  <div className="flex items-center gap-1">
                    <span className={`w-3 h-3 border border-slate-700 flex items-center justify-center font-bold text-[8px] ${isLossSelected('MOTION') ? 'bg-slate-900 text-white' : 'bg-white'}`}>
                      {isLossSelected('MOTION') ? '✓' : ''}
                    </span>
                    <span className="leading-tight">Лишние движения</span>
                  </div>

                  {/* 4. Брак */}
                  <div className="flex items-center gap-1">
                    <span className={`w-3 h-3 border border-slate-700 flex items-center justify-center font-bold text-[8px] ${isLossSelected('DEFECTS') ? 'bg-slate-900 text-white' : 'bg-white'}`}>
                      {isLossSelected('DEFECTS') ? '✓' : ''}
                    </span>
                    <span className="leading-tight font-semibold">Брак</span>
                  </div>

                  {/* 5. Переделка */}
                  <div className="flex items-center gap-1">
                    <span className={`w-3 h-3 border border-slate-700 flex items-center justify-center font-bold text-[8px] ${isLossSelected('REWORK') ? 'bg-slate-900 text-white' : 'bg-white'}`}>
                      {isLossSelected('REWORK') ? '✓' : ''}
                    </span>
                    <span className="leading-tight">Переделка</span>
                  </div>

                  {/* 6. Лишняя транспортировка */}
                  <div className="flex items-center gap-1 col-span-2">
                    <span className={`w-3 h-3 border border-slate-700 flex items-center justify-center font-bold text-[8px] ${isLossSelected('TRANSPORTATION') ? 'bg-slate-900 text-white' : 'bg-white'}`}>
                      {isLossSelected('TRANSPORTATION') ? '✓' : ''}
                    </span>
                    <span className="leading-tight">Лишняя транспортировка</span>
                  </div>

                  {/* 7. Ожидание */}
                  <div className="flex items-center gap-1">
                    <span className={`w-3 h-3 border border-slate-700 flex items-center justify-center font-bold text-[8px] ${isLossSelected('WAITING') ? 'bg-slate-900 text-white' : 'bg-white'}`}>
                      {isLossSelected('WAITING') ? '✓' : ''}
                    </span>
                    <span className="leading-tight">Ожидание</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= ГЛАВНЫЙ БЛОК: ТЕКУЩАЯ СИТУАЦИЯ VS СУПЕР ИДЕЯ ================= */}
          <div className="border-2 border-slate-900 mb-3">
            {/* Заголовок двух колонок */}
            <div className="grid grid-cols-2 border-b-2 border-slate-900 font-bold text-[10.5px]">
              <div className="p-1.5 border-r-2 border-slate-900 bg-slate-100/90 text-slate-900">
                Опиши ситуацию, которая существует на данный момент:
              </div>
              <div className="p-1.5 bg-slate-100/90 text-slate-900">
                <span>Опиши свою супер идею:</span>
              </div>
            </div>

            {/* Подзаголовок: (прокомментируй, зарисуй...) */}
            <div className="border-b border-slate-400 bg-slate-50 py-0.5 text-center text-[9px] text-slate-600 italic">
              (прокомментируй, зарисуй, чтобы было просто и понятно, что за идею ты хочешь реализовать)
            </div>

            {/* Два больших бокса: Было и Стало с водяными знаками */}
            <div className="grid grid-cols-2 min-h-[260px] relative">
              {/* Левый бокс: Текущая ситуация (Было) */}
              <div className="p-2.5 border-r-2 border-slate-900 flex flex-col justify-between relative overflow-hidden bg-white">
                {/* Фоновый водяной знак (знаки вопроса ???) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.06] select-none">
                  <div className="text-[120px] font-black text-slate-900 tracking-tighter">
                    ???
                  </div>
                </div>

                {/* Контент: Фото "Было" + Описание */}
                <div className="relative z-10 flex flex-col h-full">
                  {idea.currentSituationPhotoUrl ? (
                    <div className="mb-2 w-full">
                      <div className="relative border border-slate-300 rounded overflow-hidden max-h-[140px] bg-slate-100 flex items-center justify-center">
                        <img
                          src={idea.currentSituationPhotoUrl}
                          alt="Текущая ситуация (Было)"
                          className="w-full h-[140px] object-cover"
                          crossOrigin="anonymous"
                        />
                        <div className="absolute top-1 left-1 bg-red-600/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                          БЫЛО
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <div className="text-[10px] leading-relaxed text-slate-800 whitespace-pre-wrap flex-1">
                    {idea.currentSituationText || (
                      <span className="text-slate-400 italic">
                        [Опишите текущую проблему, задержку или дефект...]
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Правый бокс: Супер идея (Стало) */}
              <div className="p-2.5 flex flex-col justify-between relative overflow-hidden bg-white">
                {/* Фоновый водяной знак (лампочка идеи) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05] select-none">
                  <svg viewBox="0 0 100 100" className="w-48 h-48 fill-slate-900">
                    <path d="M50 15 A25 25 0 0 0 25 40 C25 50 35 58 35 65 L65 65 C65 58 75 50 75 40 A25 25 0 0 0 50 15 Z M40 70 L60 70 L58 78 L42 78 Z M45 80 L55 80 L53 84 L47 84 Z" />
                  </svg>
                </div>

                {/* Контент: Фото "Стало" + Описание */}
                <div className="relative z-10 flex flex-col h-full">
                  {idea.superIdeaPhotoUrl ? (
                    <div className="mb-2 w-full">
                      <div className="relative border border-slate-300 rounded overflow-hidden max-h-[140px] bg-slate-100 flex items-center justify-center">
                        <img
                          src={idea.superIdeaPhotoUrl}
                          alt="Супер идея (Стало)"
                          className="w-full h-[140px] object-cover"
                          crossOrigin="anonymous"
                        />
                        <div className="absolute top-1 left-1 bg-emerald-600/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                          СТАЛО
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <div className="text-[10px] leading-relaxed text-slate-800 whitespace-pre-wrap flex-1">
                    {idea.superIdeaText || (
                      <span className="text-slate-400 italic">
                        [Опишите ваше решение, рацпредложение, чертеж или схему...]
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= КОММЕНТАРИИ РУКОВОДИТЕЛЯ И ТЕХНОЛОГА ================= */}
          <div className="mb-3">
            <p className="font-bold text-slate-900 text-[10px] mb-0.5">
              Обязательно подойди к руководителю участка и технологу (если применимо), где собираешься внедрить свою идею!
            </p>
            <p className="font-bold text-slate-800 text-[10px] mb-1">
              Напиши их комментарии
            </p>

            <div className="space-y-1">
              <div className="border border-slate-800 px-2 py-1 min-h-[22px] flex items-center text-[10px] bg-slate-50/50">
                <span className="font-bold mr-1.5 text-slate-700">1.</span>
                <span className="text-slate-900 flex-1 truncate">{idea.supervisorComments?.[0] || ''}</span>
              </div>
              <div className="border border-slate-800 px-2 py-1 min-h-[22px] flex items-center text-[10px] bg-slate-50/50">
                <span className="font-bold mr-1.5 text-slate-700">2.</span>
                <span className="text-slate-900 flex-1 truncate">{idea.supervisorComments?.[1] || ''}</span>
              </div>
              <div className="border border-slate-800 px-2 py-1 min-h-[22px] flex items-center text-[10px] bg-slate-50/50">
                <span className="font-bold mr-1.5 text-slate-700">3.</span>
                <span className="text-slate-900 flex-1 truncate">{idea.supervisorComments?.[2] || ''}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= РЕШЕНИЕ КОМИССИИ (НИЖНИЙ БЛОК) ================= */}
        <div className="border-2 border-slate-900 flex mt-auto">
          {/* Вертикальная плашка: заполняется комиссией */}
          <div className="border-r-2 border-slate-900 bg-slate-200/90 px-1 py-2 flex items-center justify-center">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-700 vertical-text">
              заполняется комиссией
            </span>
          </div>

          {/* Центральный блок статусов комиссии */}
          <div className="p-2 border-r-2 border-slate-900 flex-1 space-y-1 text-[10.5px]">
            <p className="font-bold text-slate-900 mb-1">Статус:</p>
            
            <div className="flex items-center gap-1.5">
              <span className={`w-3.5 h-3.5 border border-slate-800 flex items-center justify-center font-bold text-[10px] ${idea.commission.status === 'IN_WORK' ? 'bg-slate-900 text-white' : 'bg-white'}`}>
                {idea.commission.status === 'IN_WORK' ? '✓' : ''}
              </span>
              <span className="font-semibold">&quot;В работу&quot;</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className={`w-3.5 h-3.5 border border-slate-800 flex items-center justify-center font-bold text-[10px] ${idea.commission.status === 'PROJECT' ? 'bg-slate-900 text-white' : 'bg-white'}`}>
                {idea.commission.status === 'PROJECT' ? '✓' : ''}
              </span>
              <span className="font-semibold">&quot;Проект&quot;</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className={`w-3.5 h-3.5 border border-slate-800 flex items-center justify-center font-bold text-[10px] ${idea.commission.status === 'REWORK' ? 'bg-slate-900 text-white' : 'bg-white'}`}>
                {idea.commission.status === 'REWORK' ? '✓' : ''}
              </span>
              <span className="font-semibold">&quot;Доработать&quot;</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className={`w-3.5 h-3.5 border border-slate-800 flex items-center justify-center font-bold text-[10px] ${idea.commission.status === 'REJECTED' ? 'bg-slate-900 text-white' : 'bg-white'}`}>
                {idea.commission.status === 'REJECTED' ? '✓' : ''}
              </span>
              <span className="font-semibold">&quot;Отклонить&quot;</span>
              <span className="text-[10px] text-slate-600">по причине:</span>
              <span className="border-b border-slate-800 flex-1 font-normal px-1 text-[9.5px] truncate">
                {idea.commission.rejectionReason || ''}
              </span>
            </div>
          </div>

          {/* Правый блок: Ответственный и Срок внедрения */}
          <div className="p-2 w-56 flex flex-col justify-around text-[10.5px]">
            <div>
              <span className="font-bold text-slate-800 block mb-0.5">Ответственный:</span>
              <div className="border-b border-slate-800 font-semibold text-slate-900 pb-0.5 min-h-[18px] text-[10.5px]">
                {idea.commission.responsiblePerson || ''}
              </div>
            </div>

            <div className="mt-2">
              <span className="font-bold text-slate-800 block mb-0.5">Срок внедрения:</span>
              <div className="border-b border-slate-800 font-semibold text-slate-900 pb-0.5 min-h-[18px] text-[10.5px]">
                {idea.commission.implementationDeadline || ''}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
