type CounterProps = {
  value: string;
  label: string;
};

/** Chiffre clé. Affichage statique pour l'instant —
    le count-up animé au scroll sera câblé à l'étape 5. */
export default function Counter({ value, label }: CounterProps) {
  return (
    <div className="text-center">
      <div className="font-heading text-5xl font-bold tabular-nums text-accent sm:text-6xl">
        {value}
      </div>
      <div className="mt-3 text-muted">{label}</div>
    </div>
  );
}
