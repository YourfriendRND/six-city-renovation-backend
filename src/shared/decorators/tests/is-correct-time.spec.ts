import { validate } from 'class-validator';
import { IsCorrectTime } from '../is-correct-time.decorator';

class TestClass {
    @IsCorrectTime()
    time: string;
}

describe(IsCorrectTime.name, () => {
    // * Позитивный: Проверка на корректный формат
    it('should validate correct time formats', async () => {
        const testCases = [
            '1h',
            '2d',
            '30d',
            '2m',
            '1y',
            '10y'
        ];

        for (const testCase of testCases) {
            const testObject = new TestClass();
            testObject.time = testCase;

            const errors = await validate(testObject);
            expect(errors.length).toBe(0);
        }
    })

    // * Негативный: Проверка на пустую строку
    it('should be reject empty-string', async () => {
        const testObject = new TestClass();
        testObject.time = '';

        const errors = await validate(testObject);
        expect(errors.length).toBe(1);
    })

    // * Негативный: Проверка на некорректный формат, нет количества
    it('should be reject string without numbers', async () => {
        const testCases = ['h', 'd', 'm', 'y'];
        
        const testObject = new TestClass();

        for (const testCase of testCases) {
            testObject.time = testCase;
            const errors = await validate(testObject);
            expect(errors.length).toBe(1);
        }
    })

    // * Негативный: Проверка на некорректный формат, нет единицы измерения
    it('should be reject string without unit', async () => {
        const testCases = ['10', '25', '38', '49', '51'];
        
        const testObject = new TestClass();
        
        for (const testCase of testCases) {
            testObject.time = testCase;
            const errors = await validate(testObject);
            expect(errors.length).toBe(1);
        }
    })

    // * Негативный: Проверка на некорректный формат, некорректная или не поддерживаемая единица измерения
    it('should be reject if value has incorrect unit', async () => {
        const testCases = [
            '1w',
            '100s',
            '1000M',
            '1C',
            '5D',
            '3H',
            '42Y'
        ];

        const testObject = new TestClass();

        for (const testCase of testCases) {
            testObject.time = testCase;
            const errors = await validate(testObject);
            expect(errors.length).toBe(1);
        }
    })

    // * Негативный: Проверка на некорректный формат, 0-ые или отрицательные значения
    it('should be reject zero or negative values', async () => {
        const testCases = [
            '0h',
            '0d',
            '0m',
            '0y',
            '-1h',
            '-2d',
            '-3m',
            '-4y'
        ];

        const testObject = new TestClass();

        for (const testCase of testCases) {
            testObject.time = testCase;
            const errors = await validate(testObject);
            expect(errors.length).toBe(1);
        }
    })

    // * Негативный: Проверка на некорректный формат валидируемых данных(не строка)
    it('should reject non-string values', async () => {
        const testCases = [
            8,
            undefined,
            null,
            true,
            567909034n,
            Symbol('2m'),
            { unit: '24h'},
            ['1h', '2d', '3m', '4y'],
        ];

        const testObject = new TestClass();

        for (const testCase of testCases) {
            testObject.time = testCase as unknown as string; // Говорим компилятору, что это строка
          
            const errors = await validate(testObject);
            expect(errors.length).toBe(1);
        }
    })

    // * Негативный: Проверяем, что сообщение об ошибке возвращается ожидвемое, и в тексте присутствует назвыание валидируемого поля в классе
    it('should return correct error message', async () => {
        const testObject = new TestClass();
        testObject.time = '1w';
        
        const errors = await validate(testObject);
        expect(errors.length).toBe(1);
        expect(errors[0].constraints.isCorrectTime).toBe('time must be a valid time string (e.g. 3h, 4d, 6m, 5y)');

    })
})
