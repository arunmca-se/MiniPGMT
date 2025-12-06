import type { PriorityLevel, StatusType } from '../design-system/tokens/colors';

/**
 * Transforms backend status format (uppercase with underscores) to frontend format (camelCase)
 * @param backendStatus - Status from backend API (e.g., "IN_PROGRESS", "TODO")
 * @returns Frontend status format (e.g., "inProgress", "todo")
 */
export function formatStatusFromBackend(backendStatus: string): StatusType {
  const statusMap: Record<string, StatusType> = {
    'TODO': 'todo',
    'IN_PROGRESS': 'inProgress',
    'IN_REVIEW': 'inReview',
    'BLOCKED': 'blocked',
    'DONE': 'done',
  };
  return statusMap[backendStatus] || 'todo';
}

/**
 * Transforms frontend status format (camelCase) to backend format (uppercase with underscores)
 * @param frontendStatus - Status from frontend (e.g., "inProgress", "todo")
 * @returns Backend status format (e.g., "IN_PROGRESS", "TODO")
 */
export function formatStatusToBackend(frontendStatus: StatusType): string {
  const statusMap: Record<StatusType, string> = {
    'todo': 'TODO',
    'inProgress': 'IN_PROGRESS',
    'inReview': 'IN_REVIEW',
    'blocked': 'BLOCKED',
    'done': 'DONE',
  };
  return statusMap[frontendStatus] || 'TODO';
}

/**
 * Transforms backend priority format (uppercase) to frontend format (camelCase)
 * @param backendPriority - Priority from backend API (e.g., "HIGHEST", "HIGH")
 * @returns Frontend priority format (e.g., "highest", "high")
 */
export function formatPriorityFromBackend(backendPriority: string): PriorityLevel {
  const priorityMap: Record<string, PriorityLevel> = {
    'HIGHEST': 'highest',
    'HIGH': 'high',
    'MEDIUM': 'medium',
    'LOW': 'low',
    'LOWEST': 'lowest',
  };
  return priorityMap[backendPriority] || 'medium';
}

/**
 * Transforms frontend priority format (camelCase) to backend format (uppercase)
 * @param frontendPriority - Priority from frontend (e.g., "highest", "high")
 * @returns Backend priority format (e.g., "HIGHEST", "HIGH")
 */
export function formatPriorityToBackend(frontendPriority: PriorityLevel): string {
  const priorityMap: Record<PriorityLevel, string> = {
    'highest': 'HIGHEST',
    'high': 'HIGH',
    'medium': 'MEDIUM',
    'low': 'LOW',
    'lowest': 'LOWEST',
  };
  return priorityMap[frontendPriority] || 'MEDIUM';
}
