interface BadgesProps {
  badge_variant: "LATE" | "PENDING" | "ALL_CAUGHT_UP";
  late?: number;
  pending?: number;
}

export default function Badges({ badgesProps }: { badgesProps: BadgesProps }) {
  const badge_variants = {
    LATE: (
      <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-bold bg-red-100 text-red-800">
        {badgesProps?.late} Late submissions
      </span>
    ),
    PENDING: (
      <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-bold bg-yellow-100 text-yellow-800">
        {badgesProps?.pending} Pending submission
      </span>
    ),
    ALL_CAUGHT_UP: (
      <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-bold bg-green-100 text-green-800">
        All caught up
      </span>
    ),
  };

  const BadgeComponent = badge_variants[badgesProps.badge_variant];
  return BadgeComponent;
}
