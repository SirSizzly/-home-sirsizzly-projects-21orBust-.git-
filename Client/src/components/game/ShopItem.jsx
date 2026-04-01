export default function ShopItem({ item, onBuy }) {
  if (!item) return null;

  const affordable = item.affordable ?? true;

  return (
    <div
      style={{
        width: "150px",
        padding: "10px 10px 12px",
        borderRadius: "12px",
        background:
          "linear-gradient(to bottom, rgba(35,15,15,0.98), rgba(15,5,5,0.98))",
        border: "1px solid rgba(180,150,110,0.6)",
        boxShadow: `
          0 10px 22px rgba(0,0,0,0.95),
          inset 0 0 10px rgba(0,0,0,0.9)
        `,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: affordable ? 1 : 0.45,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "110px",
          borderRadius: "8px",
          background: "rgba(10,5,5,0.9)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          marginBottom: "8px",
        }}
      >
        {item.image && (
          <img
            src={item.image}
            alt={item.name}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.9))",
            }}
          />
        )}
      </div>

      <div
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: "13px",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "#f5e6c8",
          textAlign: "center",
          marginBottom: "4px",
        }}
      >
        {item.name}
      </div>

      <div
        style={{
          fontFamily: "'Spectral', serif",
          fontSize: "11px",
          color: "#d0c2aa",
          textAlign: "center",
          minHeight: "32px",
          opacity: 0.9,
        }}
      >
        {item.shortDescription}
      </div>

      <div
        style={{
          marginTop: "8px",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "'Cinzel', serif",
          fontSize: "12px",
          color: "#e8ddc8",
        }}
      >
        <span
          style={{
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            opacity: 0.8,
          }}
        >
          {item.rarity}
        </span>
        <span
          style={{
            padding: "3px 8px",
            borderRadius: "999px",
            border: "1px solid rgba(230,200,140,0.7)",
            background: "rgba(30,15,10,0.95)",
            fontSize: "11px",
          }}
        >
          {item.cost}
        </span>
      </div>

      <button
        onClick={affordable ? onBuy : undefined}
        style={{
          marginTop: "10px",
          width: "100%",
          padding: "6px 0",
          borderRadius: "999px",
          border: "1px solid rgba(200,170,120,0.7)",
          background: affordable
            ? "linear-gradient(135deg, #3a0505, #6f1010)"
            : "rgba(40,20,20,0.6)",
          color: "#f5e6c8",
          fontFamily: "'Cinzel', serif",
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          cursor: affordable ? "pointer" : "default",
          boxShadow: affordable
            ? "0 4px 10px rgba(0,0,0,0.9)"
            : "0 2px 6px rgba(0,0,0,0.7)",
        }}
      >
        {affordable ? "Buy" : "Not enough gold"}
      </button>
    </div>
  );
}
