/**
 * Design System - Color Tokens
 *
 * This is the single source of truth for all colors in the application.
 * Changes here automatically cascade throughout the entire application.
 */

export const colors = {
  // Brand colors
  primary: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    200: '#90CAF9',
    300: '#64B5F6',
    400: '#42A5F5',
    500: '#2196F3', // Main brand color
    600: '#1E88E5',
    700: '#1976D2',
    800: '#1565C0',
    900: '#0D47A1',
  },

  // Semantic colors for issue management
  priority: {
    highest: {
      bg: '#FFEBEE',
      text: '#C62828',
      border: '#EF5350'
    },
    high: {
      bg: '#FFF3E0',
      text: '#E65100',
      border: '#FB8C00'
    },
    medium: {
      bg: '#FFFDE7',
      text: '#F57F17',
      border: '#FDD835'
    },
    low: {
      bg: '#E8F5E9',
      text: '#2E7D32',
      border: '#66BB6A'
    },
    lowest: {
      bg: '#E3F2FD',
      text: '#1565C0',
      border: '#42A5F5'
    },
  },

  status: {
    todo: {
      bg: '#F5F5F5',
      text: '#616161',
      border: '#9E9E9E'
    },
    inProgress: {
      bg: '#E3F2FD',
      text: '#1565C0',
      border: '#2196F3'
    },
    inReview: {
      bg: '#F3E5F5',
      text: '#6A1B9A',
      border: '#9C27B0'
    },
    blocked: {
      bg: '#FFEBEE',
      text: '#C62828',
      border: '#EF5350'
    },
    done: {
      bg: '#E8F5E9',
      text: '#2E7D32',
      border: '#4CAF50'
    },
  },

  // Issue type colors
  issueType: {
    epic: '#9C27B0',
    story: '#2196F3',
    task: '#4CAF50',
    bug: '#F44336',
    subtask: '#9E9E9E',
  },

  // Neutral grays (professional)
  neutral: {
    0: '#FFFFFF',
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },

  // Health indicators
  health: {
    onTrack: '#4CAF50',
    atRisk: '#FF9800',
    behind: '#F44336',
  },

  // Feedback colors
  success: {
    light: '#E8F5E9',
    main: '#4CAF50',
    dark: '#2E7D32',
  },
  error: {
    light: '#FFEBEE',
    main: '#F44336',
    dark: '#C62828',
  },
  warning: {
    light: '#FFF3E0',
    main: '#FF9800',
    dark: '#E65100',
  },
  info: {
    light: '#E3F2FD',
    main: '#2196F3',
    dark: '#1565C0',
  },
} as const;

// Helper type for type safety
export type PriorityLevel = keyof typeof colors.priority;
export type StatusType = keyof typeof colors.status;
export type IssueType = keyof typeof colors.issueType;
export type HealthStatus = keyof typeof colors.health;
