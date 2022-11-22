/**
 * Функция генерирует случайную строку случайной длины из латинских символов в разном регистре
 * @returns {string}
 */
export const generateHash = () => {
  const chars = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
  ];
  const pickedChar = (char) => {
    let hashItem = '';
    const picking = Math.random() > 0.5;
    const isLowerCase = Math.random() > 0.5;
    if (picking) {
      isLowerCase ? (hashItem = char) : (hashItem = char.toUpperCase());
    }
    return hashItem;
  };
  return chars.reduce((hash, char) => hash + pickedChar(char), '');
};
