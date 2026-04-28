interface ActivityHeaderProps {
  title: string;
  subtitle: string;
}

export default function ActivityHeader({
  title,
  subtitle,
}: ActivityHeaderProps) {
  return (
    <header>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
      <h1 className="font-display text-3xl font-bold">{title}</h1>
    </header>
  );
}
