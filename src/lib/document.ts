export function normalizeDocument(raw: string): string {
  return raw.replace(/\D/g, "");
}

export function isValidDocument(raw: string): boolean {
  const digits = normalizeDocument(raw);
  if (digits.length === 11) return isValidCpf(digits);
  if (digits.length === 14) return isValidCnpj(digits);
  return false;
}

function isValidCpf(digits: string): boolean {
  if (/^(\d)\1+$/.test(digits)) return false;
  const calcDigit = (base: string, factor: number): number => {
    let sum = 0;
    for (let i = 0; i < factor; i++) {
      sum += Number(base.charAt(i)) * (factor + 1 - i);
    }
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };
  const d1 = calcDigit(digits, 9);
  if (Number(digits.charAt(9)) !== d1) return false;
  const d2 = calcDigit(digits, 10);
  return Number(digits.charAt(10)) === d2;
}

function isValidCnpj(digits: string): boolean {
  if (/^(\d)\1+$/.test(digits)) return false;
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const calc = (w: number[]): number => {
    let sum = 0;
    for (let i = 0; i < w.length; i++) {
      sum += Number(digits.charAt(i)) * w[i];
    }
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };
  const d1 = calc(weights1);
  if (Number(digits.charAt(12)) !== d1) return false;
  const d2 = calc(weights2);
  return Number(digits.charAt(13)) === d2;
}

export function maskDocument(raw: string): string {
  const digits = normalizeDocument(raw);
  if (digits.length <= 11) {
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  return digits
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

export function detectDocumentKind(raw: string): "INDIVIDUAL" | "BUSINESS" {
  return normalizeDocument(raw).length > 11 ? "BUSINESS" : "INDIVIDUAL";
}
