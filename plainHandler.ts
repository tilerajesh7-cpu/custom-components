import type { DisplayHandler } from '../types';

/**
 * Default. No styling, formatter only. Cheapest possible path.
 *
 * Objects/arrays reaching a plain cell are almost always a nested payload meant
 * for a complex tooltip (e.g. riskBreakdown), not something to print — String()
 * on an object silently produces "[object Object]". Render a short summary
 * instead of letting that leak into the UI; the real detail still shows on hover
 * via CustomTooltip.
 */
export const plainHandler: DisplayHandler = {
  type: 'plain',
  getDisplayText: (value, ctx) => {
    if (value !== null && typeof value === 'object') {
      if (Array.isArray(value)) return `${value.length} item${value.length === 1 ? '' : 's'}`;
      const keys = Object.keys(value as Record<string, unknown>);
      return keys.length ? `${keys.length} field${keys.length === 1 ? '' : 's'}` : '';
    }
    return ctx.format(value);
  },
};
