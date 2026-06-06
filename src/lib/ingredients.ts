export const commonIngredients = [
  "arroz",
  "feijão",
  "ovo",
  "frango",
  "carne moída",
  "batata",
  "cenoura",
  "tomate",
  "cebola",
  "alho",
  "queijo",
  "leite",
  "macarrão",
  "brócolis",
  "alface",
  "banana",
  "maçã",
  "pão",
];

const aliases: Record<string, string> = {
  maca: "maçã",
  macas: "maçã",
  banana: "banana",
  bananas: "banana",
  batatas: "batata",
  tomates: "tomate",
  cebolas: "cebola",
  ovos: "ovo",
  pao: "pão",
  paes: "pão",
  brocolis: "brócolis",
  carne: "carne moída",
  "carne moida": "carne moída",
  "frango cozido": "frango",
  "frango desfiado": "frango",
};

export function normalizeIngredient(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

export function canonicalIngredient(value: string) {
  const normalized = normalizeIngredient(value);
  return aliases[normalized] ?? value.trim().toLowerCase();
}

export function parseIngredientInput(value: string) {
  return value
    .split(/[,;\n]/)
    .map((item) => canonicalIngredient(item))
    .filter(Boolean)
    .filter((item, index, array) => array.indexOf(item) === index);
}

export function mergeIngredients(current: string[], incoming: string[]) {
  const map = new Map<string, string>();

  [...current, ...incoming].forEach((item) => {
    const key = normalizeIngredient(item);
    if (key) {
      map.set(key, canonicalIngredient(item));
    }
  });

  return Array.from(map.values());
}
