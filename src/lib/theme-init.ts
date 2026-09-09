/**
 * Applies the saved light/dark choice before the browser paints.
 *
 * `ModeSwitcher` reads localStorage in an effect, which runs after first paint,
 * so a visitor who chose light saw a dark page flash first on every navigation.
 * The fix has to be an inline script in `<head>`: nothing that waits for React
 * can run early enough, because the paint has already happened by then.
 *
 * Kept as a string rather than a module so it can be inlined by `headScripts`
 * without a network round trip — a deferred or external script would land after
 * the paint it exists to beat.
 *
 * Must stay in sync with the storage key `ModeSwitcher` writes.
 */
export function buildThemeInitScript(defaultMode: 'light' | 'dark' = 'dark'): string {
  return `(function(){try{
var stored=localStorage.getItem('theme');
var mode=stored==='light'||stored==='dark'?stored:${JSON.stringify(defaultMode)};
var root=document.documentElement;
root.classList.toggle('dark',mode==='dark');
root.style.colorScheme=mode;
}catch(e){}})();`;
}
