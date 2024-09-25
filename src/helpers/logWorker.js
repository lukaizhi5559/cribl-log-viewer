// Worker function to process logs in the background
/* eslint-disable no-restricted-globals */
self.onmessage = function (e) {
    const { logEntries } = e.data;

    // Group log entries by day
    const groupedLogs = logEntries.reduce((acc, entry) => {
    const day = new Date(entry._time).toISOString().substring(0, 10); // Group by day
    acc[day] = (acc[day] || 0) + 1; // Increment the count for that day
    return acc;
    }, {});

    // Find the earliest and latest dates in the log entries
    const dates = logEntries.map((entry) => new Date(entry._time));
    const startDate = new Date(Math.min(...dates.map((date) => date.getTime())));
    const endDate = new Date(Math.max(...dates.map((date) => date.getTime())));

    // Generate all dates between the start and end date
    const allDates = [];
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
    allDates.push(new Date(currentDate).toISOString().substring(0, 10)); // Format YYYY-MM-DD
    currentDate.setDate(currentDate.getDate() + 1); // Increment by one day
    }

    // Create data array with log counts, filling in missing dates with count 0
    const data = allDates.map((day) => ({
        day,
        logs: groupedLogs[day] || 0,
    }));

    // Post data back to the main thread
    self.postMessage(data);
    /* eslint-enable no-restricted-globals */
};
  