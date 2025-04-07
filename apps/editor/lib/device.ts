export const isIOS = () =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

export const isAndroid = () => /Android/.test(navigator.userAgent);

export const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches;

export const isSafari = () => /Safari/.test(navigator.userAgent);
