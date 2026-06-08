const OPTIN_KEY = 'fmc.maptiler-optin'

const canUseLocalStorage = () =>
  typeof window !== 'undefined' && typeof localStorage?.getItem === 'function'

export const getOptInCookie = (): boolean | null => {
  if (!canUseLocalStorage()) {
    return null
  }
  switch (localStorage.getItem(OPTIN_KEY)) {
    case 'true':
      return true
    case 'false':
      return false
    default:
      return null
  }
}

export const setOptInCookie = (val: boolean) => {
  if (!canUseLocalStorage()) {
    return
  }
  if (val == null) {
    localStorage.removeItem(OPTIN_KEY)
  }
  localStorage.setItem(OPTIN_KEY, val.toString())
}
