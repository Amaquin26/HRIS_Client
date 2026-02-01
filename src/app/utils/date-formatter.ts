import { format, parseISO, isValid } from 'date-fns';

/**
 * Formats an ISO date string to "MMM dd, yyyy"
 * Example: "2026-01-31T16:00:00Z" => "Feb 01, 2026"
 * 
 * @param isoDate - ISO date string
 * @returns formatted date string or empty string if invalid
 */
export function formatDate(isoDate: string | null | undefined): string {
    if (!isoDate) return '';
    
    const date = parseISO(isoDate);
    if (!isValid(date)) return '';

    return format(date, 'MMM dd, yyyy');
}
