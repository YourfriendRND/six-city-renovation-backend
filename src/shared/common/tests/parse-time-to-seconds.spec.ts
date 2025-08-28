import { parseTimeToSeconds } from '../parse-time-to-seconds';

const SECONDS_IN_MINUTE = 60;
const SECONDS_IN_HOUR = 60 * SECONDS_IN_MINUTE;
const SECONDS_IN_DAY = 24 * SECONDS_IN_HOUR;
const SECONDS_IN_MONTH = 30 * SECONDS_IN_DAY; // Упрощенное значение (30 дней)
const SECONDS_IN_YEAR = 365 * SECONDS_IN_DAY; // Не учитываем високосные года

describe(parseTimeToSeconds.name, () => {
    // * Отдельный блок для валидных значений    
    describe('Valid values', () => {
        // * Проверка ввода секунд
        it('Input seconds', () => {
            expect(parseTimeToSeconds('45s')).toBe(45)
            expect(parseTimeToSeconds('500s')).toBe(500)
            expect(parseTimeToSeconds('1000s')).toBe(1000)
            expect(parseTimeToSeconds('60s')).toBe(SECONDS_IN_MINUTE)
        })
        // * Проверка ввода минут
        it('Input minutes', () => {
            expect(parseTimeToSeconds('1m')).toBe(SECONDS_IN_MINUTE)
            expect(parseTimeToSeconds('5m')).toBe(5 * SECONDS_IN_MINUTE)
            expect(parseTimeToSeconds('60m')).toBe(60 * SECONDS_IN_MINUTE)
            expect(parseTimeToSeconds('60m')).toBe(SECONDS_IN_HOUR)
        })
        // * Проверка ввода часов
        it('Input hours', () => {
            expect(parseTimeToSeconds('1h')).toBe(SECONDS_IN_HOUR)
            expect(parseTimeToSeconds('10h')).toBe(10 * SECONDS_IN_HOUR)
            expect(parseTimeToSeconds('24h')).toBe(24 * SECONDS_IN_HOUR)
            expect(parseTimeToSeconds('24h')).toBe(SECONDS_IN_DAY)
        })
        // * Проверка ввода дней
        it('Input days', () => {
            expect(parseTimeToSeconds('1d')).toBe(SECONDS_IN_DAY)
            expect(parseTimeToSeconds('5d')).toBe(5 * SECONDS_IN_DAY)
            expect(parseTimeToSeconds('30d')).toBe(30 * SECONDS_IN_DAY)
            expect(parseTimeToSeconds('30d')).toBe(SECONDS_IN_MONTH)
        })
        // * Проверка ввода месяцев
        it('Input months', () => {
            expect(parseTimeToSeconds('1M')).toBe(SECONDS_IN_MONTH)
            expect(parseTimeToSeconds('5M')).toBe(5 * SECONDS_IN_MONTH)
            expect(parseTimeToSeconds('12M')).toBe(12 * SECONDS_IN_MONTH)
        })
        // * Проверка ввода лет
        it('Input years', () => {
            expect(parseTimeToSeconds('1y')).toBe(SECONDS_IN_YEAR)
            expect(parseTimeToSeconds('5y')).toBe(5 * SECONDS_IN_YEAR)
            expect(parseTimeToSeconds('10y')).toBe(10 * SECONDS_IN_YEAR)
        })
    })

    // * Блок невалидных значений
    describe('Invalid values', () => {
        // * Проверка ввода пустой строки
        it('should throw an error for empty string', () => {
            expect(() => parseTimeToSeconds('')).toThrow('Time string is empty');
        })

        // * Проверка ввода строки без числа
        it('should throw an error for string without a number', () => {
            expect(() => parseTimeToSeconds('s')).toThrow(/Invalid time format/);
            expect(() => parseTimeToSeconds('m')).toThrow(/Invalid time format/);
            expect(() => parseTimeToSeconds('h')).toThrow(/Invalid time format/);
            expect(() => parseTimeToSeconds('d')).toThrow(/Invalid time format/);
            expect(() => parseTimeToSeconds('M')).toThrow(/Invalid time format/);
            expect(() => parseTimeToSeconds('y')).toThrow(/Invalid time format/);
        })

        // * Проверка ввода строки без единицы измерения
        it('should throw an error for string without a unit', () => {
            expect(() => parseTimeToSeconds('1')).toThrow(/Invalid time format/);
            expect(() => parseTimeToSeconds('5')).toThrow(/Invalid time format/);
            expect(() => parseTimeToSeconds('10')).toThrow(/Invalid time format/);
            expect(() => parseTimeToSeconds('20')).toThrow(/Invalid time format/);
            expect(() => parseTimeToSeconds('33')).toThrow(/Invalid time format/);
            expect(() => parseTimeToSeconds('444')).toThrow(/Invalid time format/);
        })

        // * Проверка ввода строки с невалидной единицей измерения
         it('should throw an error for string with invalid unit', () => {
            expect(() => parseTimeToSeconds('3x')).toThrow(/Invalid time format/);
            expect(() => parseTimeToSeconds('7D')).toThrow(/Invalid time format/);
            expect(() => parseTimeToSeconds('10J')).toThrow(/Invalid time format/);
            expect(() => parseTimeToSeconds('27u')).toThrow(/Invalid time format/);
            expect(() => parseTimeToSeconds('45G')).toThrow(/Invalid time format/);
            expect(() => parseTimeToSeconds('500H')).toThrow(/Invalid time format/);
        })

        // * Негативный: Проверка на некорректный формат, 0-ые или отрицательные значения
        it('should throw an error for zero or negative values', () => {
            expect(() => parseTimeToSeconds('0s')).toThrow(/Invalid time value/);
            expect(() => parseTimeToSeconds('0m')).toThrow(/Invalid time value/);
            expect(() => parseTimeToSeconds('-1s')).toThrow(/Invalid time format/);
            expect(() => parseTimeToSeconds('-10m')).toThrow(/Invalid time format/);
        })
        
        it('should throw an error for non-string values', () => {
            expect(() => parseTimeToSeconds(123 as unknown as string)).toThrow(/Invalid time format/);
            expect(() => parseTimeToSeconds(true as unknown as string)).toThrow(/Invalid time format/);
            expect(() => parseTimeToSeconds(null as unknown as string)).toThrow('Time string is empty');
            expect(() => parseTimeToSeconds(undefined as unknown as string)).toThrow('Time string is empty');
            expect(() => parseTimeToSeconds({} as unknown as string)).toThrow(/Invalid time format/);
            expect(() => parseTimeToSeconds([] as unknown as string)).toThrow(/Invalid time format/);
            expect(() => parseTimeToSeconds(Symbol('12h') as unknown as string)).toThrow(/Invalid time format/);
        })
    })

    // * Блок пограничных значений
    describe('Edge cases', () => {
        it('should handle minimum valid value (1s)', () => {
            expect(parseTimeToSeconds('1s')).toBe(1);
        });

        it('should handle maximum safe integer', () => {
            const maxSafe = Math.floor(Number.MAX_SAFE_INTEGER / SECONDS_IN_YEAR);
            expect(() => parseTimeToSeconds(`${maxSafe}y`)).not.toThrow();
        });
    })
})
