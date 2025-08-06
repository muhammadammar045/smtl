export function getMonthsBetweenDates(startDate, endDate) {
    const months = [];
    const current = new Date(startDate);
    current.setDate(1); // ensure first of month

    while (current <= endDate) {
        months.push({
            year: current.getFullYear(),
            month: String(current.getMonth() + 1).padStart(2, "0"),
            session_month: current.toLocaleString("default", {
                month: "short",
                year: "numeric",
            }),
        });
        current.setMonth(current.getMonth() + 1);
    }

    return months;
}
