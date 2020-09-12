import React from 'react';

interface MonthStrings {
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  7: string;
  8: string;
  9: string;
  10: string;
  11: string;
}

const defaultMonthStrings: MonthStrings = {
  0: 'January',
  1: 'February',
  2: 'March',
  3: 'April',
  4: 'May',
  5: 'June',
  6: 'July',
  7: 'August',
  8: 'September',
  9: 'October',
  10: 'November',
  11: 'December',
};

interface DatePickerProps {
  monthStrings?: MonthStrings;
}

export const DatePicker: React.FC<DatePickerProps> = ({ monthStrings = defaultMonthStrings }) => {
  return <div>{monthStrings}</div>;
};
