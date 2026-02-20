export const CouponsTabs = ({ active, onChange, counts }) => {
  const tabs = [
    { key: "available", label: "Disponibles" },
    { key: "redeemed", label: "Canjeados" },
    { key: "expired", label: "Vencidos" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((t) => {
        const isActive = active === t.key;
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => onChange(t.key)}
            className={[
              "rounded-md px-4 py-2 text-sm font-medium transition border",
              isActive
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50",
            ].join(" ")}
          >
            {t.label}
            <span className={`ml-2 text-xs ${isActive ? "opacity-80" : "opacity-60"}`}>
              ({counts?.[t.key] ?? 0})
            </span>
          </button>
        );
      })}
    </div>
  );
};
