import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import { type HistogramData, type LineData, type Time } from 'lightweight-charts';
import { type ResampleFrequency } from '@/interfaces/Dto/Stock';
import { type SymbolPrice } from '@/interfaces/Symbol';

dayjs.extend(weekday);

export const DeltaPriceType = {
  NO_CHANGE: '--',
  PLUS: '+',
  MINUS: '-',
} as const;

export const DeltaPriceColor = {
  NO_CHANGE: '#000',
  PLUS: '#E91B1B',
  MINUS: '#759DEB',
} as const;

export interface DataMinMaxReturnType<T extends LineData | HistogramData> {
  min: {
    target?: T;
    value: number;
  };
  max: {
    target?: T;
    value: number;
  };
}

export interface PriceInfo {
  delta: { type: keyof typeof DeltaPriceType; value: number; percent: number };
  close: number;
}

export function getTimeMarker(time: Time, resample: ResampleFrequency) {
  switch (resample) {
    case 'daily':
      return dayjs(time as string).format('M.DD');
    case 'weekly':
      const targetDate = dayjs(time as string);
      const month = targetDate.format('M');
      const startDayofMonth = targetDate.set('dates', 1);
      const week = parseInt('' + (startDayofMonth.get('day') - 1 + targetDate.get('D')) / 7) + 1;

      return `${month}월${week}주`;
    case 'monthly':
      return `${dayjs(time as string).format('M')}월`;
    default:
      return dayjs(time as string).format('M.DD');
  }
}

export const getDataMinMax: <T extends LineData | HistogramData>(
  data: T[],
) => { min: { target?: T; value: number }; max: { target?: T; value: number } } = (data) => {
  const maxValue = Math.max.apply(
    Math,
    data.map((chartData) => chartData.value),
  );

  const minValue = Math.min.apply(
    Math,
    data.map((chartData) => chartData.value),
  );

  const minTarget = data.find((chartData) => chartData.value === minValue);
  const maxTarget = data.find((chartData) => chartData.value === maxValue);

  return { min: { target: minTarget, value: minValue }, max: { target: maxTarget, value: maxValue } };
};

export function getPriceInfo({ today, yesterday }: { today: SymbolPrice; yesterday: SymbolPrice }): PriceInfo {
  function getDeltaType(delta: number): keyof typeof DeltaPriceType {
    if (delta === 0) return 'NO_CHANGE';
    if (delta > 0) return 'PLUS';
    if (delta < 0) return 'MINUS';

    return 'NO_CHANGE';
  }

  const todayPrice = today.close;
  const yesterdayPrice = yesterday.close;

  const deltaPrice = Number((todayPrice - yesterdayPrice).toFixed(2));

  return {
    delta: {
      type: getDeltaType(deltaPrice),
      value: Math.abs(deltaPrice),
      percent: Number(((Math.abs(deltaPrice) / yesterdayPrice) * 100).toFixed(1)),
    },
    close: todayPrice,
  };
}

export function getChartDate({ resample }: { resample: ResampleFrequency }) {
  const today = dayjs();

  switch (resample) {
    case 'daily':
      /* 
        startDate : 오늘 기준 26일 전
        endDate : 오늘 
      */
      return {
        startDate: today.subtract(26, 'days'),
        endDate: today.clone(),
      };
    case 'weekly':
      /* 
        startDate : 오늘 기준 26주전 월요일
        endDate : 오늘
      */
      return {
        startDate: today.subtract(26, 'weeks').weekday(1),
        endDate: today.clone(),
      };
    case 'monthly':
      /* 
        startDate : 오늘 기준 26개월전 1일
        endDate : 오늘 
      */
      return {
        startDate: today.subtract(26, 'months').date(1),
        endDate: today.clone(),
      };
    case 'annually':
      return {
        startDate: dayjs(`${today.get('year') - 5}-01-01`),
        endDate: today.clone(),
      };
  }
}
