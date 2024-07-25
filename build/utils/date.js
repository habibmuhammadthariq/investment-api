export function addDay(date, days) {
    let result = new Date(date.replace(/(\d+[/])(\d+[/])/, "$2$1"));
    result.setDate(result.getDate() + days);
    return result;
}
