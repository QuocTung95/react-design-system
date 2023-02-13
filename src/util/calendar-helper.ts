import dayjs, { Dayjs } from "dayjs";

export namespace CalendarHelper {
    /**
     * Ensures that the given value is transformed into a Dayjs format object (i.e. dayjs(2023-01-10))
     * @param calendarDate input Dayjs object
     */
    export const generateDays = (calendarDate: Dayjs): Dayjs[][] => {
        const firstDayOfTheMonth = calendarDate.startOf("month");

        const firstDayOfFirstWeekOfMonth =
            dayjs(firstDayOfTheMonth).startOf("week");

        const firstDayOfEachWeek = generateFirstDayOfEachWeek(
            firstDayOfFirstWeekOfMonth
        );

        return firstDayOfEachWeek.map((date) => generateWeek(date));
    };

    /**
     * Ensures that the given value is transformed into a Dayjs format object (i.e. dayjs(2023-01-10))
     * @param calendarDate input Dayjs object
     */
    export const generateMonths = (calendarDate: Dayjs): Dayjs[] => {
        const months: Dayjs[] = [];

        for (let i = 0; i < 12; i++) {
            const monthForSelectedDay = calendarDate.month(i);

            months.push(dayjs(monthForSelectedDay));
        }

        return months;
    };

    /**
     * Ensures that the given value is transformed into a Dayjs format object (i.e. dayjs(2023-01-10))
     * @param calendarDate input Dayjs object
     */
    export const generateDecadeOfYears = (calendarDate: Dayjs): Dayjs[] => {
        const year = calendarDate.year();
        const decade = Math.floor(year / 10) * 10;

        const base = calendarDate.year(decade);
        const prev = base.subtract(1, "year");

        const years = [prev, base];

        for (let i = 1; i < 11; i++) {
            years.push(base.add(i, "year"));
        }

        return years;
    };
}

const generateFirstDayOfEachWeek = (day: Dayjs): Dayjs[] => {
    const dates: Dayjs[] = [day];

    for (let i = 1; i < 6; i++) {
        const date = day.add(i, "week");
        dates.push(date);
    }

    return dates;
};

const generateWeek = (day: Dayjs): Dayjs[] => {
    const dates: Dayjs[] = [];

    for (let i = 0; i < 7; i++) {
        const date = day.add(i, "day");
        dates.push(date);
    }

    return dates;
};
