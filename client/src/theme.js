const THEME_KEY = 'theme'

export function enableDarkMode() {
  document.documentElement.classList.add('dark')
  localStorage.setItem(THEME_KEY, 'dark')
}

export function disableDarkMode() {
  document.documentElement.classList.remove('dark')
  localStorage.setItem(THEME_KEY, 'light')
}

export function toggleDarkMode() {
  const isDark = isDarkModeEnabled()
  if (isDark) {
    disableDarkMode()
  } else {
    enableDarkMode()
  }
}

export function isDarkModeEnabled() {
  return document.documentElement.classList.contains('dark')
}

export function loadSavedTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY)

  if (savedTheme === 'dark') {
    enableDarkMode()
  } else if (savedTheme === 'light') {
    disableDarkMode()
  } else {
    // Optional: match system preference if no saved theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    prefersDark ? enableDarkMode() : disableDarkMode()
  }
}