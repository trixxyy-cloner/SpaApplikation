export interface ThemeDay {
    date: string;
    name: string;
}

export const THEME_DAY_PRICE = 1000; // per person
export const THEME_DAY_MAX_SEATS = 10;
export const THEME_DAY_HOURS = { start: 10, end: 17 };

interface OpenHolidayResponse {
  startDate: string;
  name: Array<{ text: string }>;
}

// Fetchar temadagar från OpenHolidays API
export const fetchThemeDaysForYear = async (year: number): Promise<ThemeDay[]> => {
  try {
    const response = await fetch(
      `https://openholidaysapi.org/PublicHolidays?countryIsoCode=SE&languageIsoCode=SV&validFrom=${year}-01-01&validTo=${year}-12-31`
    );
    const data = await response.json();

    const themeDayNames = ["Nyårsdagen", "Påskdagen", "Midsommardagen", "Alla helgons dag"];

    return (data || [])
      .map((holiday: OpenHolidayResponse) => ({
        date: holiday.startDate,
        name: holiday.name[0]?.text || ""
      }))
      .filter((holiday: ThemeDay) => themeDayNames.includes(holiday.name));
  } catch (error) {
    console.error(`Fel vid hämtning av temadagar för ${year}:`, error);
    return [];
  }
};