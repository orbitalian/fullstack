const { weekFn } = require('../weekFn');

describe('weekFn', () => {

  // Коректні дні тижня
  describe('повертає назву дня для чисел 1..7', () => {
    test('1 → Понеділок', () => {
      expect(weekFn(1)).toBe('Понеділок');
    });
    test('2 → Вівторок', () => {
      expect(weekFn(2)).toBe('Вівторок');
    });
    test('3 → Середа', () => {
      expect(weekFn(3)).toBe('Середа');
    });
    test('4 → Четвер', () => {
      expect(weekFn(4)).toBe('Четвер');
    });
    test('5 → П\'ятниця', () => {
      expect(weekFn(5)).toBe('П\'ятниця');
    });
    test('6 → Субота', () => {
      expect(weekFn(6)).toBe('Субота');
    });
    test('7 → Неділя', () => {
      expect(weekFn(7)).toBe('Неділя');
    });
  });

  // Некоректні значення
  describe('повертає null для некоректних значень', () => {
    test('9 → null (число поза діапазоном)', () => {
      expect(weekFn(9)).toBeNull();
    });
    test('0 → null (число поза діапазоном)', () => {
      expect(weekFn(0)).toBeNull();
    });
    test('1.5 → null (дробове число)', () => {
      expect(weekFn(1.5)).toBeNull();
    });
    test('"2" → null (рядок)', () => {
      expect(weekFn('2')).toBeNull();
    });
    test('undefined → null', () => {
      expect(weekFn(undefined)).toBeNull();
    });
  });

});
