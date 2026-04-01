import ShopPanel from "../components/game/ShopPanel";
import { demoBackgrounds } from "../data/demoBackgrounds"; // or adjust path

export default function ShopScreen() {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundImage: `url(${demoBackgrounds.main})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px",
      }}
    >
      {/* Velvet vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at center, rgba(0,0,0,0.25), rgba(0,0,0,0.9))",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
      <ShopPanel />
    </div>
  );
}
