import React, { useState, useEffect } from 'react';
import { Select, Button, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import './calendar.css';

const { Option } = Select;

type ViewMode = 'month' | 'year';

const ResponsiveCalendar: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleYearChange = (year: number) => {
    setSelectedDate((prev) => prev.year(year));
  };

  const handleMonthChange = (month: number) => {
    setSelectedDate((prev) => prev.month(month));
  };

  const handleDateClick = (date: Dayjs) => {
    setSelectedDate(date);
  };

  const renderMonthView = () => {
    const start = selectedDate.startOf('month');
    const end = selectedDate.endOf('month');
    const startDay = start.day() === 0 ? 6 : start.day() - 1;
    const endDay = end.day() === 0 ? 6 : end.day() - 1;
    const days: Dayjs[] = [];

    for (let i = 0; i < startDay; i++) {
      days.push(start.subtract(startDay - i, 'day'));
    }
    for (let i = 0; i < selectedDate.daysInMonth(); i++) {
      days.push(start.add(i, 'day'));
    }
    for (let i = 1; i < 7 - endDay; i++) {
      days.push(end.add(i, 'day'));
    }

    return (
      <div className={`calendar-grid`}>
        {!isMobile &&
          ['一', '二', '三', '四', '五', '六', '日'].map((d) => (
            <div className="calendar-header" key={d}>
              {d}
            </div>
          ))}
        {days.map((d, i) => {
          const isSameMonth = d.month() === selectedDate.month();
          const isToday = d.isSame(dayjs(), 'day');
          const isSelected = d.isSame(selectedDate, 'day');

          return (
            <div
              key={i}
              className={`calendar-cell ${isSameMonth ? '' : 'dimmed'} ${
                isToday ? 'today' : ''
              } ${isSelected ? 'selected' : ''}`}
              onClick={() => handleDateClick(d)}
            >
              {d.date()}
            </div>
          );
        })}
      </div>
    );
  };

  const renderYearView = () => {
    return (
      <div className="year-grid">
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className={`calendar-cell ${
              selectedDate.month() === i ? 'selected' : ''
            }`}
            onClick={() => handleMonthChange(i)}
          >
            {i + 1}月
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="calendar-wrapper">
      <h2 className="calendar-title">自定义日历选择器</h2>

      <div className="calendar-selected">
        You selected date: {selectedDate.format('YYYY-MM-DD')}
      </div>

      <Space wrap style={{ marginBottom: 16 }}>
        <Select value={selectedDate.year()} onChange={handleYearChange}>
          {Array.from({ length: 20 }, (_, i) => {
            const year = 2010 + i;
            return (
              <Option key={year} value={year}>
                {year}年
              </Option>
            );
          })}
        </Select>
        <Select value={selectedDate.month()} onChange={handleMonthChange}>
          {Array.from({ length: 12 }, (_, i) => (
            <Option key={i} value={i}>
              {i + 1}月
            </Option>
          ))}
        </Select>
        <Button
          type={viewMode === 'month' ? 'primary' : 'default'}
          onClick={() => setViewMode('month')}
        >
          月
        </Button>
        <Button
          type={viewMode === 'year' ? 'primary' : 'default'}
          onClick={() => setViewMode('year')}
        >
          年
        </Button>
      </Space>

      {viewMode === 'month' ? renderMonthView() : renderYearView()}
    </div>
  );
};

export default ResponsiveCalendar;
