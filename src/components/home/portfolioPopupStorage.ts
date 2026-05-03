const STORAGE_KEY = 'portfolio-popup-dismissed'

export function shouldShowPortfolioPopup(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return sessionStorage.getItem(STORAGE_KEY) !== '1'
  } catch {
    return true
  }
}

export function markPortfolioPopupDismissed(): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, '1')
  } catch {
    // ignore (e.g., privacy mode)
  }
}
