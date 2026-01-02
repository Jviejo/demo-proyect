interface TruncateItemProps {
  item: string;
}

export const TruncateItem = ({ item }: TruncateItemProps) => {
  return (
    <div className="tooltip" data-tip={item}>
      <span className="truncate w-48 inline-block">{item}</span>
    </div>
  );
};
