export const fetchLogs = async (
  url: string,
  setLogEntries: React.Dispatch<React.SetStateAction<any[]>>
) => {
  const response = await fetch(url);

  if (!response.body) {
    throw new Error("Readable stream not supported by the browser.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let accumulatedText = "";
  let done = false;
  let batch: any[] = []; 
  const batchSize = 100;

  const processLogs = (logs: string[]) => {
    logs.forEach((log, index) => {
      try {
        if (log.trim()) {
          const logEntry = JSON.parse(log);
          batch.push(logEntry);

          // Once we have enough logs, update the state and reset the batch
          if (batch.length >= batchSize) {
            setLogEntries((prevLogs) => [...prevLogs, ...batch]);
            batch = []; // Reset the batch after adding to state
          }
        }
      } catch (e) {
        // Handle incomplete log entry or parse error
        accumulatedText = logs.slice(index).join("\n");
      }
    });
  };

  while (!done) {
    const { value, done: readerDone } = await reader.read();

    if (value) {
      accumulatedText += decoder.decode(value, { stream: true });
      const logs = accumulatedText.split("\n");
      processLogs(logs); // Process logs outside of the loop
    }

    done = readerDone;
  }

  // Push the remaining logs in the last batch to the state
  if (batch.length > 0) {
    setLogEntries((prevLogs) => [...prevLogs, ...batch]);
  }
};
