const BasisUniversal = require('./NativeBasisUniversal').default;

export function multiply(a: number, b: number): number {
  return BasisUniversal.multiply(a, b);
}
