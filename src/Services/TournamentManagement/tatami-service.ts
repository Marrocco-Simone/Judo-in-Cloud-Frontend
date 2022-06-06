const TATAMI_KEY = 'JIC.TATAMI';

export function storeTatami (tatami: number): void {
  localStorage.setItem(TATAMI_KEY, `${tatami}`);
}

export function deleteTatami (): void {
  localStorage.removeItem(TATAMI_KEY);
}

export function getTatami(): number | null {
  const tatamiStr = localStorage.getItem(TATAMI_KEY);
  if (tatamiStr === null) {
    return null;
  }
  const tatami = parseInt(tatamiStr, 10);
  if (isNaN(tatami)) {
    deleteTatami();
    return null;
  }
  return tatami;
}
