type Props = {
  items: {
    title: string;
    onClick?: () => void;
  }[];
};

export default function Breadcrumb({ items = [] }: Props) {
  return (
    <p className="text-sm text-mutedForeground mb-2">
      {items.map((item, index) => (
        <span key={item.title}>
          {!!item.onClick ? (
            <button
              className={`text-sm hover:underline ${
                index === items?.length - 1
                  ? 'text-foreground'
                  : 'text-mutedForeground '
              }`}
              onClick={item.onClick}
            >
              {item.title}
            </button>
          ) : (
            <span
              className={`text-sm ${
                index === items?.length - 1
                  ? 'text-foreground'
                  : 'text-mutedForeground '
              }`}
            >
              {item.title}
            </span>
          )}

          {index < items.length - 1 && (
            <span className="text-foreground px-2"> &gt; </span>
          )}
        </span>
      ))}
    </p>
  );
}
