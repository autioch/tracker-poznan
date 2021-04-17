const REGEXP = /[A-Za-z][a-z]*/g;

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.substring(1);
}

export function getLabel(text) {
  const words = text.match(REGEXP) || [];

  return words.map(capitalize).join(' ');
}
