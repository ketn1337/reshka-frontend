// Утилита для программной навигации в кастомном роутере.
export function pushPath(path: string): void {
  if (window.location.pathname === path && window.location.search === '') return;
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0 });
}

export function replacePath(path: string): void {
  window.history.replaceState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}
