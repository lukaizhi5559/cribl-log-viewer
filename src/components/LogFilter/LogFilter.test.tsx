import { render, fireEvent } from '@testing-library/react';
import LogFilter from './index';
import { format } from 'date-fns';

describe('LogFilter', () => {
  const mockProps = {
    searchTerm: '',
    setSearchTerm: jest.fn(),
    cidOptions: ['123', '456'],
    channelOptions: ['A', 'B'],
    levelOptions: ['info', 'error'],
    selectedCid: '',
    setSelectedCid: jest.fn(),
    selectedChannel: '',
    setSelectedChannel: jest.fn(),
    selectedLevel: '',
    setSelectedLevel: jest.fn(),
    startDate: null,
    setStartDate: jest.fn(),
    endDate: null,
    setEndDate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls setSelectedCid when CID is selected', () => {
    const { getByTestId } = render(<LogFilter {...mockProps} />);
    const cidSelect = getByTestId('cid-select');
    fireEvent.change(cidSelect, { target: { value: '123' } });
    expect(mockProps.setSelectedCid).toHaveBeenCalledWith('123');
  });

  it('calls setSelectedChannel when a channel is selected', () => {
    const { getByTestId } = render(<LogFilter {...mockProps} />);
    const channelSelect = getByTestId('channel-select');
    fireEvent.change(channelSelect, { target: { value: 'A' } });
    expect(mockProps.setSelectedChannel).toHaveBeenCalledWith('A');
  });

  it('calls setSelectedLevel when a level is selected', () => {
    const { getByTestId } = render(<LogFilter {...mockProps} />);
    const levelSelect = getByTestId('level-select');
    fireEvent.change(levelSelect, { target: { value: 'info' } });
    expect(mockProps.setSelectedLevel).toHaveBeenCalledWith('info');
  });

  it('calls setStartDate when a start date is selected', () => {
    const { getByPlaceholderText } = render(<LogFilter {...mockProps} />);
    const startDatePicker = getByPlaceholderText('Start Date');
    const newStartDate = new Date('2023-01-01');
    fireEvent.change(startDatePicker, { target: { value: format(newStartDate, 'yyyy-MM-dd') } });
    
    expect(mockProps.setStartDate).toHaveBeenCalledWith(expect.any(Date));
    expect(mockProps.setStartDate.mock.calls[0][0].toISOString().split('T')[0]).toBe('2022-12-31');
  });

  it('calls setEndDate when an end date is selected', () => {
    const { getByPlaceholderText } = render(<LogFilter {...mockProps} />);
    const endDatePicker = getByPlaceholderText('End Date');
    const newEndDate = new Date('2023-12-31');
    fireEvent.change(endDatePicker, { target: { value: format(newEndDate, 'yyyy-MM-dd') } });
    
    expect(mockProps.setEndDate).toHaveBeenCalledWith(expect.any(Date));
    expect(mockProps.setEndDate.mock.calls[0][0].toISOString().split('T')[0]).toBe('2023-12-30');
  });
});
