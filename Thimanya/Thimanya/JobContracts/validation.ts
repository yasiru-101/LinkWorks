import type { JobStatus } from '../../mobile/src/types/domain';

// The client creates a priced job with a title, category, and useful description.
export function validateOpenJob(input: {
  title: string;
  description: string;
  categoryId: string;
  budgetMinLkr?: number;
  budgetMaxLkr?: number;
}): string | null {
  if (input.title.trim().length < 5) return 'Title must have at least five characters.';
  if (input.description.trim().length < 10) return 'Description must have at least ten characters.';
  if (!input.categoryId.trim()) return 'Choose a category.';
  if (input.budgetMinLkr !== undefined && (!Number.isInteger(input.budgetMinLkr) || input.budgetMinLkr < 0)) return 'Minimum budget must be a whole LKR amount.';
  if (input.budgetMaxLkr !== undefined && (!Number.isInteger(input.budgetMaxLkr) || input.budgetMaxLkr < 0)) return 'Maximum budget must be a whole LKR amount.';
  if (input.budgetMinLkr !== undefined && input.budgetMaxLkr !== undefined && input.budgetMinLkr > input.budgetMaxLkr) return 'Minimum budget cannot exceed maximum budget.';
  return null;
}

// Keep the persisted lifecycle limited to the transitions agreed by the team.
export function canTransitionJob(from: JobStatus, to: JobStatus, actor: 'client' | 'assignedWorker'): boolean {
  return (from === 'open' && to === 'cancelled' && actor === 'client') ||
    (from === 'open' && to === 'assigned' && actor === 'client') ||
    (from === 'assigned' && to === 'in_progress' && actor === 'assignedWorker') ||
    (from === 'in_progress' && to === 'completed' && actor === 'client');
}

// Quotes must be whole positive LKR amounts before an application is written.
export function validateQuote(priceLkr: number, message: string): string | null {
  if (!Number.isInteger(priceLkr) || priceLkr <= 0) return 'Quote must be a positive whole LKR amount.';
  if (message.trim().length < 10) return 'Explain your quote in at least ten characters.';
  return null;
}
