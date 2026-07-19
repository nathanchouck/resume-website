// Modifier-key-respecting SPA nav guard: lets cmd/ctrl/shift/alt-click
// fall through to native browser behavior (open in new tab, etc.),
// otherwise intercepts the click for client-side navigation.
export function spaClick(e, navigate) {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  navigate();
}
