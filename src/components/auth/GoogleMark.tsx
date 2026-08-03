/** The standard Google "G" mark — shared between LoginForm and JoinFlow so both "Continue with Google" buttons are consistently branded rather than one having an icon and the other plain text. */
export function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.07 5.07 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.85A10.98 10.98 0 0 0 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 13.09A6.6 6.6 0 0 1 5.5 11c0-.72.13-1.42.34-2.09V6.06H2.18A11 11 0 0 0 1 11c0 1.77.42 3.45 1.18 4.94l3.66-2.85z"
      />
      <path
        fill="currentColor"
        d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.19 14.97 0 12 0 7.7 0 3.99 2.47 2.18 6.06l3.66 2.85C6.71 6.31 9.14 4.75 12 4.75z"
      />
    </svg>
  );
}
