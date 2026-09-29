/**
 * Adds a given number of working days to a startDate.
 * Skips Saturdays (6) and Sundays (0).
 */
exports.addWorkingDays = (startDate, days) => {
  let date = new Date(startDate);
  let addedDays = 0;
  while (addedDays < days) {
    date.setDate(date.getDate() + 1);
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      addedDays++;
    }
  }
  return date;
};
