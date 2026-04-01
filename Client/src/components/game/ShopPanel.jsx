import useShopState from "../../state/useShopState";
import ShopItem from "./ShopItem";

export default function ShopPanel() {
  const {
    gold,
    jokers,
    relics,
    enhancements,
    rerollCost,
    buyItem,
    rerollShop,
  } = useShopState();

  return (
    <div
      style={{
        position: "relative",
        zIndex: 5,
        width: "1100px",
        padding: "32px 40px 28px",
        borderRadius: "18px",
        background:
          "linear-gradient(to bottom, rgba(20,10,10,0.95), rgba(10,5,5,0.98))",
        boxShadow: "0 24px 60px rgba(0,0,0,0.95)",
        border: "1px solid rgba(200,170,120,0.4)",
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "18px",
        }}
      >
        <div
          style={{
            fontFamily: "'Cinzel', serif",
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: "#f5e6c8",
            fontSize: "24px",
            textShadow: "0 3px 4px rgba(0,0,0,0.9)",
          }}
        >
          Velvet Bazaar
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontFamily: "'Cinzel', serif",
            color: "#f5e6c8",
          }}
        >
          <span
            style={{
              fontSize: "18px",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              opacity: 0.85,
            }}
          >
            Gold:
          </span>
          <span
            style={{
              fontSize: "22px",
              padding: "6px 16px",
              borderRadius: "999px",
              border: "1px solid rgba(230,200,140,0.7)",
              background: "rgba(30,15,10,0.9)",
              boxShadow: "0 4px 10px rgba(0,0,0,0.9)",
            }}
          >
            {gold}
          </span>
          <button
            onClick={rerollShop}
            style={{
              padding: "10px 20px",
              borderRadius: "999px",
              border: "1px solid rgba(200,170,120,0.7)",
              background:
                "linear-gradient(135deg, #3a0505 0%, #6f1010 50%, #3a0505 100%)",
              color: "#f5e6c8",
              fontFamily: "'Cinzel', serif",
              fontSize: "14px",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.9)",
            }}
          >
            Reroll ({rerollCost})
          </button>
        </div>
      </div>

      {/* Velvet table strip */}
      <div
        style={{
          marginTop: "8px",
          marginBottom: "18px",
          height: "4px",
          borderRadius: "999px",
          background:
            "linear-gradient(to right, rgba(80,20,30,0.9), rgba(40,10,15,0.9))",
          boxShadow: "0 6px 18px rgba(0,0,0,0.9)",
        }}
      />

      {/* Sections: Jokers / Relics / Enhancements */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1.1fr 1.1fr",
          gap: "24px",
        }}
      >
        {/* Jokers */}
        <div>
          <SectionTitle label="Jokers" />
          <div
            style={{
              display: "flex",
              gap: "16px",
              marginTop: "10px",
            }}
          >
            {jokers.map((item) => (
              <ShopItem
                key={item.id}
                item={item}
                onBuy={() => buyItem("joker", item.id)}
              />
            ))}
          </div>
        </div>

        {/* Relics */}
        <div>
          <SectionTitle label="Relics" />
          <div
            style={{
              display: "flex",
              gap: "16px",
              marginTop: "10px",
            }}
          >
            {relics.map((item) => (
              <ShopItem
                key={item.id}
                item={item}
                onBuy={() => buyItem("relic", item.id)}
              />
            ))}
          </div>
        </div>

        {/* Enhancements */}
        <div>
          <SectionTitle label="Enhancements" />
          <div
            style={{
              display: "flex",
              gap: "16px",
              marginTop: "10px",
            }}
          >
            {enhancements.map((item) => (
              <ShopItem
                key={item.id}
                item={item}
                onBuy={() => buyItem("enhancement", item.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ label }) {
  return (
    <div
      style={{
        fontFamily: "'Cinzel', serif",
        textTransform: "uppercase",
        letterSpacing: "0.16em",
        fontSize: "16px",
        color: "#e8ddc8",
        opacity: 0.9,
      }}
    >
      {label}
    </div>
  );
}
