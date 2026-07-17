/**
 * Evaluates a due date and returns a status string if it is overdue or due soon.
 * @param {string} dueDate - The ISO date string or valid date string.
 * @returns {'Overdue' | 'Due Soon' | null}
 */
export const getDueDateStatus = (dueDate) => {
  if (!dueDate) return null;
  
  const due = new Date(dueDate);
  if (isNaN(due.getTime())) return null;

  const now = new Date();
  
  // Strip time for accurate day comparison, especially if due dates are stored as date-only
  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (dueDay < today) {
    return 'Overdue';
  }

  // Calculate difference in days
  const diffTime = dueDay.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // If due today or tomorrow (within ~24-48 hours logically)
  if (diffDays >= 0 && diffDays <= 1) {
    return 'Due Soon';
  }

  return null;
};
