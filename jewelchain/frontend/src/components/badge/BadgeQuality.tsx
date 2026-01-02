interface BadgeQualityProps {
  quality: number;
}

export const BadgeQuality = ({ quality }: BadgeQualityProps) => {
  return (
    <span className={`badge ${getQualityBadgeColor(quality)}`}>{quality}%</span>
  );
};

function getQualityBadgeColor(quality: number): string {
  if (quality >= 90) return "badge-success";
  if (quality >= 70) return "badge-info";
  if (quality >= 50) return "badge-warning";
  return "badge-error";
}
