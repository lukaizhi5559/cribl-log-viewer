import { useState, useEffect } from 'react';
import useDebounce from './useDebounce';

const useFilteredLogs = (
  logEntries: any[]
) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCid, setSelectedCid] = useState("");
    const [selectedChannel, setSelectedChannel] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("");
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);  
    const [filteredLogEntries, setFilteredLogEntries] = useState<any[]>([]);
  
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    useEffect(() => {
        let filtered = logEntries;

        if (debouncedSearchTerm) {
        filtered = filtered.filter((entry) =>
            JSON.stringify(entry).toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        );
        }

        if (selectedCid) {
        filtered = filtered.filter((entry) => entry.cid === selectedCid);
        }

        if (selectedChannel) {
        filtered = filtered.filter((entry) => entry.channel === selectedChannel);
        }

        if (selectedLevel) {
        filtered = filtered.filter((entry) => entry.level === selectedLevel);
        }

        if (startDate) {
        filtered = filtered.filter((entry) => new Date(entry._time) >= startDate);
        }

        if (endDate) {
        filtered = filtered.filter((entry) => new Date(entry._time) <= endDate);
        }

        setFilteredLogEntries(filtered);
    }, [
        debouncedSearchTerm,
        selectedCid,
        selectedChannel,
        selectedLevel,
        startDate,
        endDate,
        logEntries
    ]);

    // Get unique options for dropdowns
    const cidOptions = [...new Set(logEntries.map((entry) => entry?.cid))];
    const channelOptions = [...new Set(logEntries.map((entry) => entry?.channel))];
    const levelOptions = [...new Set(logEntries.map((entry) => entry?.level))];

    return {
        searchTerm, 
        setSearchTerm,
        selectedCid, 
        setSelectedCid,
        selectedChannel, 
        setSelectedChannel,
        selectedLevel, 
        setSelectedLevel,
        startDate, 
        setStartDate,
        endDate, 
        setEndDate,
        cidOptions,
        channelOptions,
        levelOptions,
        filteredLogEntries,
    }
};

export default useFilteredLogs;
