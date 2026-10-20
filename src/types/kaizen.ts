export interface Department {
  id: string;
  code: string; // e.g. 'PL', 'KA', 'PO', 'BU', 'DE', 'MA'
  name: string;
  description?: string;
  isActive: boolean;
}

export interface LossType {
  id: string;
  code: string;
  name: string;
  iconName?: string;
  description?: string;
  isActive: boolean;
}

export type CommissionStatus = 'IN_WORK' | 'PROJECT' | 'REWORK' | 'REJECTED' | 'PENDING';

export interface SupervisorComment {
  id: string;
  authorName?: string;
  role?: string;
  text: string;
  createdAt: string;
}

export interface CommissionDecision {
  status: CommissionStatus;
  rejectionReason?: string;
  responsiblePerson?: string;
  implementationDeadline?: string;
  decidedAt?: string;
  decidedBy?: string;
}

export interface KaizenIdea {
  id: string;
  registrationNumber: string; // e.g. "KZ-2026-084"
  createdAt: string; // e.g. "19.10.2026"
  
  // Данные автора
  authorFullName: string;
  authorPosition: string;
  authorSection: string; // Участок автора
  authorTelegramId?: number;
  authorTelegramUsername?: string;

  // Подразделение внедрения
  targetDepartmentCode: string; // PL, KA, PO, BU, DE, MA or 'OTHER'
  targetDepartmentOtherText?: string;

  // Цели предложения
  increasesSafety: boolean;
  improvesQuality: boolean;
  eliminatesLosses: boolean;

  // Виды потерь (множественный выбор)
  selectedLossCodes: string[]; // e.g. ['OVERPRODUCTION', 'DEFECTS', ...]

  // Описание проблемы и идеи
  currentSituationText: string;
  currentSituationPhotoUrl?: string; // Фото "Было"

  superIdeaText: string;
  superIdeaPhotoUrl?: string; // Фото "Стало"

  // Комментарии руководителя участка и технолога
  supervisorComments: string[]; // 3 линии на бланке

  // Решение комиссии
  commission: CommissionDecision;
}
