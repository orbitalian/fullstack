const { ageClassification } = require('../ageClassification');

describe('ageClassification', () => {

  // null
  describe('повертає null', () => {
    test('для від\'ємного числа (-1)', () => {
      expect(ageClassification(-1)).toBeNull();
    });
    test('для числа понад 122 (123)', () => {
      expect(ageClassification(123)).toBeNull();
    });
    test('для числа понад 122 (150)', () => {
      expect(ageClassification(150)).toBeNull();
    });
  });

  // Дитинство: 0..24
  describe('Дитинство (0..24)', () => {
    test('0 → Дитинство', () => {
      expect(ageClassification(0)).toBe('Дитинство');
    });
    test('1 → Дитинство', () => {
      expect(ageClassification(1)).toBe('Дитинство');
    });
    test('24 → Дитинство', () => {
      expect(ageClassification(24)).toBe('Дитинство');
    });
  });

  // Молодість: 24+..44
  describe('Молодість (24+..44)', () => {
    test('24.01 → Молодість', () => {
      expect(ageClassification(24.01)).toBe('Молодість');
    });
    test('44 → Молодість', () => {
      expect(ageClassification(44)).toBe('Молодість');
    });
  });

  // Зрілість: 44+..65
  describe('Зрілість (44+..65)', () => {
    test('44.01 → Зрілість', () => {
      expect(ageClassification(44.01)).toBe('Зрілість');
    });
    test('65 → Зрілість', () => {
      expect(ageClassification(65)).toBe('Зрілість');
    });
  });

  // Старість: 65+..75
  describe('Старість (65+..75)', () => {
    test('65.1 → Старість', () => {
      expect(ageClassification(65.1)).toBe('Старість');
    });
    test('75 → Старість', () => {
      expect(ageClassification(75)).toBe('Старість');
    });
  });

  // Довголіття: 75+..90
  describe('Довголіття (75+..90)', () => {
    test('75.01 → Довголіття', () => {
      expect(ageClassification(75.01)).toBe('Довголіття');
    });
    test('90 → Довголіття', () => {
      expect(ageClassification(90)).toBe('Довголіття');
    });
  });

  // Рекорд: 90+..122
  describe('Рекорд (90+..122)', () => {
    test('90.01 → Рекорд', () => {
      expect(ageClassification(90.01)).toBe('Рекорд');
    });
    test('122 → Рекорд', () => {
      expect(ageClassification(122)).toBe('Рекорд');
    });
  });

});
