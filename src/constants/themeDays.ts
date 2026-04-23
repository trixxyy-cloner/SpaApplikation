export interface ThemeDay {
    date: string;
    name: string;
}

export const THEME_DAY_PRICE = 1000; // per person
export const THEME_DAY_MAX_SEATS = 10;
export const THEME_DAY_HOURS = { start: 10, end: 17 };

export const THEME_DAYS_FIXED: ThemeDay[] = [
    { date: "2026-01-01", name: "Nyårsdagen" },
    { date: "2026-10-31", name: "Allahelgonaafton"},
];