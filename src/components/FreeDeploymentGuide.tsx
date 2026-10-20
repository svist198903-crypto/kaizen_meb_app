import React, { useState } from 'react';
import { 
  Rocket, 
  Bot, 
  Globe, 
  Database, 
  Terminal, 
  CheckCircle, 
  Copy, 
  ExternalLink, 
  Zap, 
  ShieldAlert, 
  Smartphone,
  ServerOff
} from 'lucide-react';

export const FreeDeploymentGuide: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const copyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(key);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const sharedAppUrl = window.location.origin;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Баннер */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white p-6 rounded-2xl shadow-lg border border-emerald-700/30">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-emerald-500/20 text-emerald-300 rounded-xl">
                <ServerOff className="w-6 h-6" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                Развертывание в Telegram на 100% бесплатно (0 рублей)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-2 max-w-2xl leading-relaxed">
              Вам <strong>не нужно покупать VPS или сервер</strong>. Для запуска полноценного Telegram Web App (TWA) с ботом, базой данных PostgreSQL и бланками печати используются официальные бесплатные облачные платформы (Free Tier).
            </p>
          </div>
          <span className="hidden sm:inline-block bg-emerald-500/20 text-emerald-300 text-xs px-3 py-1 rounded-full font-semibold border border-emerald-400/30">
            Бесплатный стек
          </span>
        </div>
      </div>

      {/* 3 Способа запуска */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Вариант 1 */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-300 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl">
            Самый быстрый (2 минуты)
          </div>
          <div>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm mb-3">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">Готовый URL + @BotFather</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Используйте уже работающий URL этого веб-приложения как Web App в Telegram прямо сейчас без настроек хостинга.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-emerald-700">
            Готово к подключению прямо сейчас →
          </div>
        </div>

        {/* Вариант 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm mb-3">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">Vercel (Frontend) + Render (Bot)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Фронтенд на Vercel (бесплатно, мгновенный CDN), Python-бот и FastAPI на Render.com (бесплатный Web Service).
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-blue-700">
            Стандартное продакшн решение →
          </div>
        </div>

        {/* Вариант 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-sm mb-3">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">Neon.tech (Бесплатный PostgreSQL)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Serverless PostgreSQL с 0.5 GB бесплатного диска и мгновенным пулом подключений без абонентской платы.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-purple-700">
            База данных навсегда бесплатная →
          </div>
        </div>
      </div>

      {/* Пошаговая инструкция */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Rocket className="w-5 h-5 text-emerald-600" />
          <span>Пошаговая инструкция подключения бота к Telegram за 4 шага</span>
        </h3>

        {/* Шаг 1 */}
        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center">1</span>
              Создание бота в @BotFather
            </span>
            <span className="text-[11px] text-slate-500">Занимает 1 минуту</span>
          </div>

          <ol className="text-xs text-slate-700 space-y-1.5 list-decimal list-inside pl-1 leading-relaxed">
            <li>Откройте официального бота в Telegram: <a href="https://t.me/BotFather" target="_blank" rel="noreferrer" className="text-emerald-700 font-semibold underline">@BotFather</a></li>
            <li>Отправьте команду <code className="bg-slate-200 px-1.5 py-0.5 rounded font-mono text-slate-900">/newbot</code></li>
            <li>Введите имя бота (например: <strong>MES Mebelain Kaizen</strong>)</li>
            <li>Введите юзернейм с окончанием на bot (например: <strong>mebelain_kaizen_bot</strong>)</li>
            <li>BotFather пришлет вам <strong>API Token</strong> вида: <code className="bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded font-mono">7123456789:AAH...</code> (сохраните его).</li>
          </ol>
        </div>

        {/* Шаг 2 */}
        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center">2</span>
              Привязка Web App кнопки к боту в @BotFather
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold">Важнейший шаг!</span>
          </div>

          <p className="text-xs text-slate-600">
            Чтобы у пользователей в Telegram внизу слева появилась постоянная кнопка <strong>«KAIZEN»</strong> для открытия бланка:
          </p>

          <ol className="text-xs text-slate-700 space-y-1.5 list-decimal list-inside pl-1 leading-relaxed">
            <li>В диалоге с <code className="font-bold text-slate-900">@BotFather</code> отправьте команду: <code className="bg-slate-200 px-1.5 py-0.5 rounded font-mono">/mybots</code></li>
            <li>Выберите созданного бота → перейдите в <strong>Bot Settings</strong> → <strong>Menu Button</strong> → <strong>Configure menu button</strong></li>
            <li>Отправьте URL вашего Web App:</li>
          </ol>

          <div className="flex items-center gap-2 bg-slate-900 text-emerald-400 p-2.5 rounded-lg text-xs font-mono">
            <span className="truncate flex-1">{sharedAppUrl}</span>
            <button
              onClick={() => copyText('url', sharedAppUrl)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded text-xs cursor-pointer flex items-center gap-1 shrink-0 font-sans"
            >
              {copiedIndex === 'url' ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedIndex === 'url' ? 'Скопировано' : 'Копировать URL'}</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-500">
            4. Введите текст кнопки для меню Telegram: например <code className="font-bold">KAIZEN</code> или <code className="font-bold">Подать идею</code>.
          </p>
        </div>

        {/* Шаг 3 */}
        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center">3</span>
              Бесплатная база данных PostgreSQL на Neon.tech (0$)
            </span>
            <span className="text-[11px] text-purple-600 font-semibold">PostgreSQL Free</span>
          </div>

          <ol className="text-xs text-slate-700 space-y-1.5 list-decimal list-inside pl-1 leading-relaxed">
            <li>Зарегистрируйтесь бесплатно через GitHub на сайте <a href="https://neon.tech" target="_blank" rel="noreferrer" className="text-purple-700 font-semibold underline">neon.tech</a></li>
            <li>Нажмите <strong>Create Project</strong> (выберите регион Frankfurt / Europe)</li>
            <li>Скопируйте полученную строку подключения (Connection String):
              <div className="bg-slate-100 p-2 rounded mt-1 font-mono text-[11px] text-slate-800 break-all">
                postgresql+asyncpg://neondb_owner:password@ep-cool-forest.eu-central-1.aws.neon.tech/neondb?ssl=require
              </div>
            </li>
          </ol>
        </div>

        {/* Шаг 4 */}
        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center">4</span>
              Бесплатный хостинг Python-бота и FastAPI на Render.com (0$)
            </span>
            <span className="text-[11px] text-blue-600 font-semibold">Render Free Web Service</span>
          </div>

          <ol className="text-xs text-slate-700 space-y-1.5 list-decimal list-inside pl-1 leading-relaxed">
            <li>Зарегистрируйтесь бесплатно на <a href="https://render.com" target="_blank" rel="noreferrer" className="text-blue-700 font-semibold underline">render.com</a></li>
            <li>Создайте репозиторий на GitHub с файлами бэкенда из вкладки «Код бэкенда»</li>
            <li>В панели Render нажмите <strong>New +</strong> → <strong>Web Service</strong> → подключите ваш GitHub-репозиторий</li>
            <li>В поле <strong>Build Command</strong> укажите: <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">pip install -r requirements.txt</code></li>
            <li>В поле <strong>Start Command</strong> укажите: <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">uvicorn main:app --host 0.0.0.0 --port $PORT</code></li>
            <li>Во вкладке <strong>Environment</strong> добавьте переменные:
              <ul className="list-disc list-inside pl-4 mt-1 space-y-0.5 text-[11px]">
                <li><code className="font-bold">BOT_TOKEN</code> = токен от @BotFather</li>
                <li><code className="font-bold">DATABASE_URL</code> = строка от Neon.tech</li>
                <li><code className="font-bold">WEB_APP_URL</code> = URL вашего Web App</li>
              </ul>
            </li>
          </ol>
        </div>
      </div>

      {/* Готовый файл requirements.txt и render.yaml */}
      <div className="bg-slate-900 text-slate-200 rounded-2xl p-5 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-100">
              Готовый файл requirements.txt для бесплатного хостинга
            </h4>
          </div>
          <button
            onClick={() => copyText('req', `fastapi==0.115.0\nuvicorn==0.31.0\naiogram==3.13.1\nsqlalchemy==2.0.35\nasyncpg==0.29.0\npydantic==2.9.2\npython-dotenv==1.0.1`)}
            className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
          >
            {copiedIndex === 'req' ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Скопировать</span>
          </button>
        </div>

        <pre className="font-mono text-xs bg-slate-950 p-3 rounded-lg text-emerald-300 overflow-x-auto">
{`fastapi==0.115.0
uvicorn==0.31.0
aiogram==3.13.1
sqlalchemy==2.0.35
asyncpg==0.29.0
pydantic==2.9.2
python-dotenv==1.0.1`}
        </pre>
      </div>
    </div>
  );
};
