import React, { useState } from 'react';
import { Copy, Check, Terminal, Database, Cpu, Send, Layers } from 'lucide-react';

export const BackendCodeViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'models' | 'schemas' | 'fastapi' | 'aiogram' | 'migration'>('models');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const codeSnippets = {
    models: `# backend/models.py
"""
Модели SQLAlchemy 2.0 (Async) для PostgreSQL с поддержкой динамических справочников.
MES Mebelain KAIZEN System.
"""
import enum
from datetime import datetime
from typing import List, Optional
from sqlalchemy import (
    String, Text, Boolean, Integer, BigInteger, DateTime, 
    ForeignKey, Table, Column, Enum, func
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

class Base(DeclarativeBase):
    pass

class CommissionStatusEnum(str, enum.Enum):
    PENDING = "PENDING"
    IN_WORK = "IN_WORK"        # "В работу"
    PROJECT = "PROJECT"        # "Проект"
    REWORK = "REWORK"          # "Доработать"
    REJECTED = "REJECTED"      # "Отклонить"

# Таблица связи "Многие-ко-многим" между идеей и видами потерь (7 потерь Lean)
idea_loss_association = Table(
    "idea_loss_association",
    Base.metadata,
    Column("idea_id", Integer, ForeignKey("kaizen_ideas.id", ondelete="CASCADE"), primary_key=True),
    Column("loss_type_id", Integer, ForeignKey("loss_types.id", ondelete="CASCADE"), primary_key=True),
)

class Department(Base):
    """Справочник подразделений/участков (PL, KA, PO, BU, DE, MA + кастомные)"""
    __tablename__ = "departments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    code: Mapped[str] = mapped_column(String(20), unique=True, index=True) # PL, KA, PO, etc.
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    ideas: Mapped[List["KaizenIdea"]] = relationship("KaizenIdea", back_populates="department")

class LossType(Base):
    """Справочник видов потерь (Перепроизводство, Излишние запасы, Брак и др.)"""
    __tablename__ = "loss_types"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    code: Mapped[str] = mapped_column(String(50), unique=True, index=True) # OVERPRODUCTION, etc.
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    ideas: Mapped[List["KaizenIdea"]] = relationship(
        "KaizenIdea", secondary=idea_loss_association, back_populates="losses"
    )

class KaizenIdea(Base):
    """Основная сущность KAIZEN-предложения, строго соответствующая официальному бланку"""
    __tablename__ = "kaizen_ideas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    reg_number: Mapped[str] = mapped_column(String(30), unique=True, index=True) # Номер бланка: KZ-2026-042
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    # Данные автора
    author_full_name: Mapped[str] = mapped_column(String(150), nullable=False)
    author_position: Mapped[str] = mapped_column(String(100), nullable=False)
    author_section: Mapped[str] = mapped_column(String(100), nullable=False) # Участок
    author_telegram_id: Mapped[Optional[int]] = mapped_column(BigInteger, index=True, nullable=True)
    author_telegram_username: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    # Подразделение внедрения
    department_id: Mapped[Optional[int]] = mapped_column(ForeignKey("departments.id", ondelete="SET NULL"), nullable=True)
    department_other_text: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    department: Mapped[Optional["Department"]] = relationship("Department", back_populates="ideas")

    # Ваше предложение:
    increases_safety: Mapped[bool] = mapped_column(Boolean, default=False)
    improves_quality: Mapped[bool] = mapped_column(Boolean, default=False)
    eliminates_losses: Mapped[bool] = mapped_column(Boolean, default=False)

    # Устраняемые потери (связь many-to-many)
    losses: Mapped[List["LossType"]] = relationship(
        "LossType", secondary=idea_loss_association, back_populates="ideas"
    )

    # Описание и Фото ("Было" vs "Стало")
    current_situation_text: Mapped[str] = mapped_column(Text, nullable=False)
    current_situation_photo_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

    super_idea_text: Mapped[str] = mapped_column(Text, nullable=False)
    super_idea_photo_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

    # Комментарии начальника участка и технолога (3 пронумерованные строки на бланке)
    supervisor_comment_1: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    supervisor_comment_2: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    supervisor_comment_3: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

    # Решение комиссии
    commission_status: Mapped[CommissionStatusEnum] = mapped_column(
        Enum(CommissionStatusEnum), default=CommissionStatusEnum.PENDING
    )
    rejection_reason: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    responsible_person: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    implementation_deadline: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    commission_decided_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
`,

    schemas: `# backend/schemas.py
"""
Pydantic v2 схемы валидации для FastAPI и Telegram Web App API.
"""
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field
from models import CommissionStatusEnum

class DepartmentBase(BaseModel):
    code: str = Field(..., max_length=20, examples=["PL"])
    name: str = Field(..., max_length=100, examples=["PL — Плитный участок"])
    is_active: bool = True

class DepartmentResponse(DepartmentBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class LossTypeBase(BaseModel):
    code: str = Field(..., max_length=50)
    name: str = Field(..., max_length=100)
    description: Optional[str] = None
    is_active: bool = True

class LossTypeResponse(LossTypeBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class KaizenIdeaCreate(BaseModel):
    """Схема создания идеи из Telegram Web App за 60 секунд"""
    author_full_name: str = Field(..., min_length=2, max_length=150)
    author_position: str = Field(..., min_length=2, max_length=100)
    author_section: str = Field(..., min_length=2, max_length=100)
    
    # ID подразделения или текст "Другое"
    department_code: str = Field(..., description="PL, KA, PO, BU, DE, MA или OTHER")
    department_other_text: Optional[str] = None
    
    # Цели
    increases_safety: bool = False
    improves_quality: bool = False
    eliminates_losses: bool = False
    loss_codes: List[str] = Field(default_factory=list)

    # Описание + Фото
    current_situation_text: str = Field(..., min_length=5)
    current_situation_photo_url: Optional[str] = None

    super_idea_text: str = Field(..., min_length=5)
    super_idea_photo_url: Optional[str] = None

    # Комментарии (если уже получены у начальника/технолога)
    supervisor_comments: List[str] = Field(default_factory=list, max_length=3)

class CommissionUpdate(BaseModel):
    """Обновление решения комиссии по бланку"""
    status: CommissionStatusEnum
    rejection_reason: Optional[str] = None
    responsible_person: Optional[str] = None
    implementation_deadline: Optional[str] = None
    supervisor_comments: Optional[List[str]] = None

class KaizenIdeaResponse(BaseModel):
    """Полная карточка предложения для вывода на экран и формирования печатного бланка A4"""
    id: int
    reg_number: str
    created_at: datetime
    author_full_name: str
    author_position: str
    author_section: str
    author_telegram_id: Optional[int]
    author_telegram_username: Optional[str]
    
    department_code: Optional[str]
    department_other_text: Optional[str]
    
    increases_safety: bool
    improves_quality: bool
    eliminates_losses: bool
    losses: List[LossTypeResponse]
    
    current_situation_text: str
    current_situation_photo_url: Optional[str]
    super_idea_text: str
    super_idea_photo_url: Optional[str]
    
    supervisor_comment_1: Optional[str]
    supervisor_comment_2: Optional[str]
    supervisor_comment_3: Optional[str]
    
    commission_status: CommissionStatusEnum
    rejection_reason: Optional[str]
    responsible_person: Optional[str]
    implementation_deadline: Optional[str]
    commission_decided_at: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)
`,

    fastapi: `# backend/main.py
"""
FastAPI REST API с безопасной валидацией Telegram initData (HMAC-SHA256).
"""
import hmac
import hashlib
import json
import os
from urllib.parse import parse_qsl
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, Header, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from database import get_db
from models import KaizenIdea, Department, LossType, CommissionStatusEnum
from schemas import (
    KaizenIdeaCreate, KaizenIdeaResponse, CommissionUpdate,
    DepartmentResponse, LossTypeResponse
)

BOT_TOKEN = os.getenv("BOT_TOKEN", "123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11")

app = FastAPI(
    title="MES Mebelain KAIZEN API",
    description="API для Telegram Web App и печати официальных бланков A4",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def verify_telegram_init_data(init_data: str) -> dict:
    """
    Криптографическая проверка подлинности initData от Telegram Web App
    по алгоритму HMAC-SHA256 в соответствии с официальной документацией Telegram.
    """
    if not init_data:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing initData")

    parsed_data = dict(parse_qsl(init_data, keep_blank_values=True))
    received_hash = parsed_data.pop("hash", None)
    if not received_hash:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing hash")

    # Формируем строку данных для хеширования в алфавитном порядке
    data_check_string = "\\n".join(f"{k}={v}" for k, v in sorted(parsed_data.items()))
    
    # Секретный ключ = HMAC-SHA256("WebAppData", bot_token)
    secret_key = hmac.new(b"WebAppData", BOT_TOKEN.encode(), hashlib.sha256).digest()
    calculated_hash = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()

    if not hmac.compare_digest(calculated_hash, received_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Telegram signature")

    user_raw = parsed_data.get("user")
    return json.loads(user_raw) if user_raw else {}

@app.get("/api/v1/departments", response_model=List[DepartmentResponse])
async def get_departments(db: AsyncSession = Depends(get_db)):
    """Получение списка активных участков/подразделений"""
    result = await db.execute(select(Department).where(Department.is_active == True))
    return result.scalars().all()

@app.get("/api/v1/loss-types", response_model=List[LossTypeResponse])
async def get_loss_types(db: AsyncSession = Depends(get_db)):
    """Получение справочника видов потерь Lean"""
    result = await db.execute(select(LossType).where(LossType.is_active == True))
    return result.scalars().all()

@app.post("/api/v1/ideas", response_model=KaizenIdeaResponse, status_code=status.HTTP_201_CREATED)
async def create_kaizen_idea(
    payload: KaizenIdeaCreate,
    x_telegram_init_data: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db)
):
    """
    Регистрация Kaizen-предложения от сотрудника завода.
    Генерирует уникальный регистрационный номер бланка KZ-YYYY-XXXX.
    """
    # Опциональная проверка TWA подписи
    tg_user = verify_telegram_init_data(x_telegram_init_data) if x_telegram_init_data else {}
    tg_id = tg_user.get("id")
    tg_username = tg_user.get("username")

    # Поиск департамента
    dept = None
    if payload.department_code != "OTHER":
        dept_result = await db.execute(select(Department).where(Department.code == payload.department_code))
        dept = dept_result.scalar_one_or_none()

    # Генерация регистрационного номера бланка
    current_year = 2026
    count_query = await db.execute(select(KaizenIdea))
    next_idx = len(count_query.scalars().all()) + 1
    reg_number = f"KZ-{current_year}-{next_idx:03d}"

    idea = KaizenIdea(
        reg_number=reg_number,
        author_full_name=payload.author_full_name,
        author_position=payload.author_position,
        author_section=payload.author_section,
        author_telegram_id=tg_id,
        author_telegram_username=tg_username,
        department_id=dept.id if dept else None,
        department_other_text=payload.department_other_text,
        increases_safety=payload.increases_safety,
        improves_quality=payload.improves_quality,
        eliminates_losses=payload.eliminates_losses,
        current_situation_text=payload.current_situation_text,
        current_situation_photo_url=payload.current_situation_photo_url,
        super_idea_text=payload.super_idea_text,
        super_idea_photo_url=payload.super_idea_photo_url,
        supervisor_comment_1=payload.supervisor_comments[0] if len(payload.supervisor_comments) > 0 else None,
        supervisor_comment_2=payload.supervisor_comments[1] if len(payload.supervisor_comments) > 1 else None,
        supervisor_comment_3=payload.supervisor_comments[2] if len(payload.supervisor_comments) > 2 else None,
        commission_status=CommissionStatusEnum.PENDING
    )

    # Привязка видов потерь
    if payload.loss_codes:
        losses_res = await db.execute(select(LossType).where(LossType.code.in_(payload.loss_codes)))
        idea.losses = list(losses_res.scalars().all())

    db.add(idea)
    await db.commit()
    await db.refresh(idea)
    return idea

@app.get("/api/v1/ideas/{idea_id}", response_model=KaizenIdeaResponse)
async def get_idea_for_print(idea_id: int, db: AsyncSession = Depends(get_db)):
    """Получение полных данных идеи для рендеринга и печати бланка A4"""
    idea = await db.get(KaizenIdea, idea_id)
    if not idea:
        raise HTTPException(status_code=404, detail="Kaizen idea not found")
    return idea
`,

    aiogram: `# bot/main.py
"""
Telegram-бот на aiogram 3.x с интеграцией TWA (Telegram Web App)
для подачи предложений и моментального вызова печати официального бланка А4.
"""
import asyncio
import os
from aiogram import Bot, Dispatcher, F
from aiogram.filters import CommandStart, Command
from aiogram.types import (
    Message, InlineKeyboardMarkup, InlineKeyboardButton, 
    WebAppInfo, MenuButtonWebApp
)

BOT_TOKEN = os.getenv("BOT_TOKEN", "YOUR_TELEGRAM_BOT_TOKEN")
# URL фронтенда приложения в проде
WEB_APP_URL = os.getenv("WEB_APP_URL", "https://your-domain.com")

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()

def get_main_menu_keyboard() -> InlineKeyboardMarkup:
    """Клавиатура с кнопкой запуска Telegram Web App"""
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="⚡️ Подать KAIZEN-предложение",
                    web_app=WebAppInfo(url=f"{WEB_APP_URL}?mode=create")
                )
            ],
            [
                InlineKeyboardButton(
                    text="📋 Мои идеи и Бланки А4",
                    web_app=WebAppInfo(url=f"{WEB_APP_URL}?mode=registry")
                )
            ],
            [
                InlineKeyboardButton(
                    text="🏭 Реестр фабрики (Комиссия)",
                    web_app=WebAppInfo(url=f"{WEB_APP_URL}?mode=admin")
                )
            ]
        ]
    )

@dp.message(CommandStart())
async def cmd_start(message: Message):
    """Приветственное сообщение с установкой WebApp Menu Button"""
    # Настройка кнопки в меню Telegram рядом с полем ввода
    await bot.set_chat_menu_button(
        chat_id=message.chat.id,
        menu_button=MenuButtonWebApp(
            text="KAIZEN",
            web_app=WebAppInfo(url=WEB_APP_URL)
        )
    )

    welcome_text = (
        f"👋 Здравствуйте, <b>{message.from_user.full_name}</b>!\\n\\n"
        "Добро пожаловать в систему подачи и учета <b>KAIZEN-предложений</b> "
        "фабрики <b>MES Mebelain by sba home</b>.\\n\\n"
        "✨ <b>Возможности:</b>\\n"
        "• ⚡️ Подача рацпредложения за 60 секунд\\n"
        "• 📸 Загрузка фото «Было» и «Стало» с камеры телефона\\n"
        "• 🖨 Генерация официального печатного бланка формата А4\\n"
        "• 👥 Отслеживание статуса комиссии («В работу», «Проект», «Доработать»)\\n\\n"
        "Нажмите кнопку ниже, чтобы открыть приложение:"
    )

    await message.answer(
        welcome_text,
        reply_markup=get_main_menu_keyboard(),
        parse_mode="HTML"
    )

@dp.message(Command("print"))
async def cmd_print_blank(message: Message):
    """Команда для быстрого перехода к печати конкретного бланка"""
    args = message.text.split()
    if len(args) > 1:
        idea_id = args[1]
        print_url = f"{WEB_APP_URL}?mode=print&idea_id={idea_id}"
        await message.answer(
            f"🖨 <b>Бланк KAIZEN #{idea_id} готов к печати:</b>\\n"
            "Нажмите кнопку ниже, чтобы открыть форму A4 и распечатать в 1 клик:",
            reply_markup=InlineKeyboardMarkup(
                inline_keyboard=[[
                    InlineKeyboardButton(
                        text="🖨 Открыть бланк А4",
                        web_app=WebAppInfo(url=print_url)
                    )
                ]]
            ),
            parse_mode="HTML"
        )
    else:
        await message.answer(
            "Для печати конкретного бланка укажите его ID:\\n<code>/print 42</code>",
            parse_mode="HTML"
        )

async def notify_committee_new_idea(idea_id: int, reg_number: str, author_name: str, dept_code: str):
    """Уведомление кайдзен-комиссии о новом предложении"""
    COMMITTEE_CHAT_ID = os.getenv("COMMITTEE_CHAT_ID", "-1001234567890")
    text = (
        f"🚨 <b>Новое Kaizen-предложение: {reg_number}</b>\\n\\n"
        f"👤 <b>Автор:</b> {author_name}\\n"
        f"🏢 <b>Участок:</b> {dept_code}\\n\\n"
        "Откройте карточку для рассмотрения комиссии и печати:"
    )
    url = f"{WEB_APP_URL}?mode=print&idea_id={idea_id}"
    await bot.send_message(
        chat_id=COMMITTEE_CHAT_ID,
        text=text,
        reply_markup=InlineKeyboardMarkup(
            inline_keyboard=[[
                InlineKeyboardButton(text="📄 Открыть бланк А4", web_app=WebAppInfo(url=url))
            ]]
        ),
        parse_mode="HTML"
    )

async def main():
    print("🚀 Запуск Telegram-бота Kaizen MES Mebelain...")
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
`,

    migration: `# backend/alembic/versions/001_initial_kaizen_schema.py
"""initial kaizen schema with seed data

Revision ID: 001_initial_kaizen_schema
Revises: 
Create Date: 2026-10-19 22:40:00
"""
from alembic import op
import sqlalchemy as sa

def upgrade():
    # 1. Создание таблицы departments
    op.create_table(
        'departments',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('code', sa.String(length=20), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('is_active', sa.Boolean(), server_default='true', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('code')
    )

    # 2. Создание таблицы loss_types
    op.create_table(
        'loss_types',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('code', sa.String(length=50), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('description', sa.String(length=255), nullable=True),
        sa.Column('is_active', sa.Boolean(), server_default='true', nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('code')
    )

    # 3. Создание таблицы kaizen_ideas
    op.create_table(
        'kaizen_ideas',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('reg_number', sa.String(length=30), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('author_full_name', sa.String(length=150), nullable=False),
        sa.Column('author_position', sa.String(length=100), nullable=False),
        sa.Column('author_section', sa.String(length=100), nullable=False),
        sa.Column('author_telegram_id', sa.BigInteger(), nullable=True),
        sa.Column('author_telegram_username', sa.String(length=100), nullable=True),
        sa.Column('department_id', sa.Integer(), nullable=True),
        sa.Column('department_other_text', sa.String(length=150), nullable=True),
        sa.Column('increases_safety', sa.Boolean(), server_default='false', nullable=False),
        sa.Column('improves_quality', sa.Boolean(), server_default='false', nullable=False),
        sa.Column('eliminates_losses', sa.Boolean(), server_default='false', nullable=False),
        sa.Column('current_situation_text', sa.Text(), nullable=False),
        sa.Column('current_situation_photo_url', sa.String(length=500), nullable=True),
        sa.Column('super_idea_text', sa.Text(), nullable=False),
        sa.Column('super_idea_photo_url', sa.String(length=500), nullable=True),
        sa.Column('supervisor_comment_1', sa.String(length=500), nullable=True),
        sa.Column('supervisor_comment_2', sa.String(length=500), nullable=True),
        sa.Column('supervisor_comment_3', sa.String(length=500), nullable=True),
        sa.Column('commission_status', sa.String(length=30), server_default='PENDING', nullable=False),
        sa.Column('rejection_reason', sa.String(length=500), nullable=True),
        sa.Column('responsible_person', sa.String(length=150), nullable=True),
        sa.Column('implementation_deadline', sa.String(length=50), nullable=True),
        sa.Column('commission_decided_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['department_id'], ['departments.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('reg_number')
    )

    # 4. Создание ассоциативной таблицы
    op.create_table(
        'idea_loss_association',
        sa.Column('idea_id', sa.Integer(), nullable=False),
        sa.Column('loss_type_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['idea_id'], ['kaizen_ideas.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['loss_type_id'], ['loss_types.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('idea_id', 'loss_type_id')
    )

    # Базовый сид подразделений фабрики MES Mebelain
    op.execute("""
        INSERT INTO departments (code, name, is_active) VALUES
        ('PL', 'PL — Плитный участок / Распил', true),
        ('KA', 'KA — Кромкооблицовочный участок', true),
        ('PO', 'PO — Покраска / Отделка', true),
        ('BU', 'BU — Сверлильно-присадочный участок', true),
        ('DE', 'DE — Участок деталей / Упаковка', true),
        ('MA', 'MA — Механический / Сборка', true);
    """)

    # Базовый сид 7 видов потерь
    op.execute("""
        INSERT INTO loss_types (code, name, is_active) VALUES
        ('OVERPRODUCTION', 'Перепроизводство', true),
        ('INVENTORY', 'Излишние запасы', true),
        ('REWORK', 'Переделка', true),
        ('TRANSPORTATION', 'Лишняя транспортировка', true),
        ('MOTION', 'Лишние движения', true),
        ('DEFECTS', 'Брак', true),
        ('WAITING', 'Ожидание', true);
    """)

def downgrade():
    op.drop_table('idea_loss_association')
    op.drop_table('kaizen_ideas')
    op.drop_table('loss_types')
    op.drop_table('departments')
`,
  };

  return (
    <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base text-white">
              Архитектура бэкенда (Python, SQLAlchemy 2.0, FastAPI, aiogram 3.x)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Готовый модульный код с типизацией Pydantic v2 и HMAC-валидацией Telegram initData
          </p>
        </div>

        <button
          onClick={() => copyToClipboard(codeSnippets[activeTab])}
          className="flex items-center gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Скопировано!' : 'Копировать код'}</span>
        </button>
      </div>

      {/* Вкладки файлов */}
      <div className="flex flex-wrap gap-2 text-xs">
        <button
          onClick={() => setActiveTab('models')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'models'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>models.py (SQLAlchemy)</span>
        </button>

        <button
          onClick={() => setActiveTab('schemas')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'schemas'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>schemas.py (Pydantic v2)</span>
        </button>

        <button
          onClick={() => setActiveTab('fastapi')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'fastapi'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>main.py (FastAPI REST)</span>
        </button>

        <button
          onClick={() => setActiveTab('aiogram')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'aiogram'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>bot.py (aiogram 3.x)</span>
        </button>

        <button
          onClick={() => setActiveTab('migration')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'migration'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>alembic_001.py (Миграция)</span>
        </button>
      </div>

      {/* Окно кода */}
      <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 p-4">
        <pre className="font-mono text-xs text-emerald-300 overflow-x-auto max-h-[500px] leading-relaxed">
          <code>{codeSnippets[activeTab]}</code>
        </pre>
      </div>
    </div>
  );
};
