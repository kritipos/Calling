// src/utils/constants.js
export const STATUS = {
  NEW: 'NEW',
  ALLOCATED: 'ALLOCATED',
  CALLED: 'CALLED',
  FOLLOWUP: 'FOLLOWUP',
  REJECT: 'REJECT',
  CONVERT: 'CONVERT',
  PROCESSED: 'PROCESSED'
};

export const STATUS_COLORS = {
  [STATUS.NEW]: '#4361ee',
  [STATUS.CALLED]: '#28a745',
  [STATUS.FOLLOWUP]: '#ffc107',
  [STATUS.REJECT]: '#dc3545',
  [STATUS.CONVERT]: '#6f42c1',
  [STATUS.ALLOCATED]: '#17a2b8',
  [STATUS.PROCESSED]: '#6c757d'
};

export const STATUS_LABELS = {
  [STATUS.NEW]: 'New',
  [STATUS.CALLED]: 'Called',
  [STATUS.FOLLOWUP]: 'Follow Up',
  [STATUS.REJECT]: 'Rejected',
  [STATUS.CONVERT]: 'Converted',
  [STATUS.ALLOCATED]: 'Allocated',
  [STATUS.PROCESSED]: 'Processed'
};

export const CALL_OUTCOMES = [
  { value: '1', label: 'Connected - Need to discuss', status: STATUS.CALLED },
  { value: '2', label: 'Asked to call back later', status: STATUS.FOLLOWUP },
  { value: '3', label: 'Not interested', status: STATUS.REJECT },
  { value: '4', label: 'Wrong number', status: STATUS.REJECT },
  { value: '5', label: 'Switch off - try later', status: STATUS.FOLLOWUP }
];

export const ROWS_PER_PAGE_OPTIONS = [10, 25, 50, 100];