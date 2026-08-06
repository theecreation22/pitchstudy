type IconProps = { color: string };

/* A ball, for the module that covers the game itself rather than a phase of
   it — deliberately unlike FoundationsIcon's concentric rings, which sit
   directly beneath it in the module list. */
function TheBasicsIcon({ color }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5 L15.7 10.2 L14.3 14.6 H9.7 L8.3 10.2 Z" />
      <path d="M12 7.5 V3.7 M15.7 10.2 L19.6 9 M14.3 14.6 L16.7 17.9 M9.7 14.6 L7.3 17.9 M8.3 10.2 L4.4 9" />
    </svg>
  );
}

function FoundationsIcon({ color }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke={color} strokeWidth="1.6">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function DefendingIcon({ color }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round">
      <path d="M12 3 L20 6.5 V12 C20 17 16.5 20.5 12 22 C7.5 20.5 4 17 4 12 V6.5 Z" />
    </svg>
  );
}

function MidfieldIcon({ color }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round">
      <circle cx="12" cy="12" r="2.5" />
      <line x1="12" y1="12" x2="12" y2="4" />
      <line x1="12" y1="12" x2="19" y2="16" />
      <line x1="12" y1="12" x2="5" y2="16" />
    </svg>
  );
}

function AttackingIcon({ color }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20 L14 10" />
      <path d="M14 10 H20 V16" />
    </svg>
  );
}

function SystemsIcon({ color }: IconProps) {
  const coords = [5, 12, 19];
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill={color} stroke="none">
      {coords.flatMap((cx) =>
        coords.map((cy) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.5" />),
      )}
    </svg>
  );
}

function ManagersMindsIcon({ color }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18 H15 M10 21 H14" />
      <path d="M12 3 C8 3 6 6 6 9 C6 11.5 7.5 13 8.5 14 C9 14.5 9 15 9 15.5 V16.5 H15 V15.5 C15 15 15 14.5 15.5 14 C16.5 13 18 11.5 18 9 C18 6 16 3 12 3 Z" />
    </svg>
  );
}

function TransitionsIcon({ color }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 8 H17 M17 8 L13 4 M17 8 L13 12" />
      <path d="M20 16 H7 M7 16 L11 12 M7 16 L11 20" />
    </svg>
  );
}

function SetPiecesIcon({ color }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 3 V21" />
      <path d="M7 4 H17 L13 8 L17 12 H7" />
    </svg>
  );
}

function GameManagementIcon({ color }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="13" r="8" />
      <path d="M12 8 V13 L16 15" />
      <path d="M9 2 H15" />
    </svg>
  );
}

const icons: Record<string, (props: IconProps) => React.JSX.Element> = {
  "the-basics": TheBasicsIcon,
  foundations: FoundationsIcon,
  defending: DefendingIcon,
  midfield: MidfieldIcon,
  attacking: AttackingIcon,
  systems: SystemsIcon,
  "managers-minds": ManagersMindsIcon,
  transitions: TransitionsIcon,
  "set-pieces": SetPiecesIcon,
  "game-management": GameManagementIcon,
};

export function ModuleIcon({ slug, color }: { slug: string; color: string }) {
  const Icon = icons[slug];
  if (!Icon) return null;
  return <Icon color={color} />;
}
