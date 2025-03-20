//시스템의 아크모드 유무확인하는 함수명
function getSystemDarkModePreference(): boolean {
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return isDarkMode;
}

// 로컬스토리지나 시스템에 저장된 다크모드의 유무를 판단하는 함수명
function getDarkModePreference(): boolean {
  const isDarkMode = JSON.parse(localStorage.getItem('isDarkMode')!) ?? getSystemDarkModePreference();
  localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));

  return isDarkMode;
}

export { getDarkModePreference };
