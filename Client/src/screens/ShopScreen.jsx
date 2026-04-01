// Client/src/screens/ShopScreen.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getShop, buyItem } from "../api/shopApi";
import CardFactory from "../components/cards/CardFactory";
import EnhancementSelection from "../components/EnhancementSelection";

export default function ShopScreen() {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const runId = params.get("runId");

  const [shop, setShop] = useState(null);
  const [enhOptions, setEnhOptions] = useState(null);

  useEffect(() => {
    if (!runId) return;
    getShop(runId)
      .then(setShop)
      .catch((err) => {
        console.error("Error loading shop:", err);
      });
  }, [runId]);

  if (!shop) {
    return <div style={styles.loading}>Loading shop...</div>;
  }

  const handleBuy = async (type, index = null) => {
    try {
      const updated = await buyItem(runId, type, index);
      if (updated.packOptions) {
        setEnhOptions(updated.packOptions);
      }
      setShop(updated);
    } catch (err) {
      console.error("Buy error:", err);
    }
  };

  const handleChooseEnhancement = async (enh) => {
    try {
      const updated = await buyItem(runId, "choose_enhancement", enh.key);
      setEnhOptions(null);
      setShop(updated);
    } catch (err) {
      console.error("Enhancement choose error:", err);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.goldPanel}>
        <span style={styles.goldText}>Gold: {shop.gold}</span>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Jokers</h2>
        <div style={styles.row}>
          {shop.jokers.map((joker, idx) => (
            <div
              key={idx}
              style={styles.itemWrapper}
              onClick={() => handleBuy("joker", idx)}
            >
              <CardFactory card={joker} />
              <div style={styles.priceTag}>{joker.price}g</div>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Relic & Enhancement</h2>
        <div style={styles.row}>
          {shop.relic && (
            <div style={styles.itemWrapper} onClick={() => handleBuy("relic")}>
              <CardFactory card={shop.relic} />
              <div style={styles.priceTag}>{shop.relic.price}g</div>
            </div>
          )}

          {shop.pack && (
            <div
              style={styles.itemWrapper}
              onClick={() => handleBuy("enhancement_pack")}
            >
              <CardFactory card={shop.pack} />
              <div style={styles.priceTag}>{shop.pack.price}g</div>
            </div>
          )}
        </div>
      </div>

      <div style={styles.actions}>
        <button style={styles.rerollButton} onClick={() => handleBuy("reroll")}>
          Reroll (3g)
        </button>
        <button style={styles.backButton} onClick={() => navigate("/game")}>
          Back to Run
        </button>
      </div>

      {enhOptions && (
        <EnhancementSelection
          options={enhOptions}
          onChoose={handleChooseEnhancement}
        />
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "url('/stone-wall.png'), #0a0a0a",
    backgroundSize: "cover",
    padding: "20px",
    color: "#e6e6e6",
    fontFamily: "Cinzel, serif",
  },
  loading: {
    color: "white",
    fontSize: "2rem",
    textAlign: "center",
    marginTop: "40vh",
  },
  goldPanel: {
    textAlign: "right",
    marginBottom: "20px",
  },
  goldText: {
    fontSize: "1.5rem",
    color: "#ffcc66",
    textShadow: "0 0 10px rgba(255, 200, 100, 0.5)",
  },
  section: {
    marginBottom: "30px",
  },
  sectionTitle: {
    color: "#ffcc66",
    marginBottom: "10px",
  },
  row: {
    display: "flex",
    gap: "20px",
  },
  itemWrapper: {
    position: "relative",
    cursor: "pointer",
  },
  priceTag: {
    position: "absolute",
    bottom: "-10px",
    right: "0px",
    background: "rgba(0,0,0,0.75)",
    padding: "4px 8px",
    borderRadius: "6px",
    color: "#ffcc66",
    fontWeight: "bold",
    fontSize: "0.9rem",
  },
  actions: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "30px",
  },
  rerollButton: {
    padding: "12px 20px",
    background: "#330000",
    border: "2px solid #660000",
    color: "#ffcccc",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1.1rem",
  },
  backButton: {
    padding: "12px 20px",
    background: "#003300",
    border: "2px solid #006600",
    color: "#ccffcc",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1.1rem",
  },
};
