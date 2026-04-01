import { demoCards } from "../data/demoCards";
import { demoBackgrounds } from "../data/demoBackgrounds";

export default function DemoStartScreen() {
  const haloCards = demoCards.slice(0, 12);

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
      {/* Deep cathedral vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at center, rgba(0,0,0,0.35), rgba(0,0,0,0.96))",
          animation: "vignettePulse 9s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      {/* Rotating cathedral wheel */}
      <div
        style={{
          position: "relative",
          width: "880px",
          height: "880px",
          animation: "rotateCircle 40s linear infinite",
          filter: "drop-shadow(0 0 60px rgba(0,0,0,1))",
        }}
      >
        {haloCards.map((src, i) => {
          const angle = (i / haloCards.length) * Math.PI * 2;
          const radius = 360;

          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: `
                  translate(-50%, -50%)
                  translate(${x}px, ${y}px)
                  rotate(${angle}rad)
                `,
              }}
            >
              <img
                src={src}
                alt="halo card"
                style={{
                  width: "140px",
                  transform: `rotate(-${angle}rad)`,
                  filter: `
                    brightness(0.75)
                    contrast(1.1)
                    drop-shadow(0 0 14px rgba(0,0,0,1))
                  `,
                  animation: `floatCard 5.5s ease-in-out infinite ${i * 0.4}s`,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Title block */}
      <div
        style={{
          position: "absolute",
          textAlign: "center",
          zIndex: 20,
          transform: "translateY(-70px)",
        }}
      >
        {/* Dark Cathedral Title — NO GLOW, CARVED LOOK */}
        <h1
          style={{
            color: "#d9d2c2",
            fontSize: "160px",
            marginBottom: "10px",
            fontFamily: "'Cinzel Decorative', serif",
            letterSpacing: "0.20em",
            textTransform: "uppercase",
            fontWeight: 700,
            filter: "brightness(0.92) contrast(1.15)",
            textShadow: `
              0px 4px 2px rgba(0,0,0,0.9),
              0px 8px 6px rgba(0,0,0,0.85),
              0px 12px 10px rgba(0,0,0,0.8)
            `,
          }}
        >
          21orBust
        </h1>

        {/* Subtitle — carved inscription */}
        <p
          style={{
            color: "#c8bba3",
            fontSize: "34px",
            marginBottom: "60px",
            fontFamily: "'Spectral SC', serif",
            letterSpacing: "0.14em",
            opacity: 0.85,
            textShadow: `
              0px 3px 2px rgba(0,0,0,0.85),
              0px 6px 4px rgba(0,0,0,0.8)
            `,
          }}
        >
          A Ritual of Cards & Consequence
        </p>

        {/* Begin Run Button — keep your maroon/gold ritual seal */}
        <a
          href="/demo/game"
          style={{
            padding: "24px 64px",
            background: "linear-gradient(145deg, #3a0505, #7a1111)",
            borderRadius: "999px",
            border: "2px solid #f5d38a",
            color: "#f5e6c8",
            fontWeight: "700",
            fontSize: "30px",
            textDecoration: "none",
            boxShadow: `
              0 0 28px rgba(0,0,0,1),
              0 0 45px rgba(200,20,20,0.9)
            `,
            transition: "transform 0.25s ease, box-shadow 0.25s ease",
            fontFamily: "'Cinzel', serif",
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            display: "inline-block",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.1) translateY(-4px)";
            e.target.style.boxShadow =
              "0 0 40px rgba(0,0,0,1), 0 0 60px rgba(255,40,40,1)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1) translateY(0)";
            e.target.style.boxShadow =
              "0 0 28px rgba(0,0,0,1), 0 0 45px rgba(200,20,20,0.9)";
          }}
        >
          Begin the Run
        </a>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes floatCard {
            0%   { transform: translateY(0px) scale(1); }
            50%  { transform: translateY(-14px) scale(1.06); }
            100% { transform: translateY(0px) scale(1); }
          }

          @keyframes rotateCircle {
            0%   { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes vignettePulse {
            0%   { opacity: 0.9; }
            50%  { opacity: 1; }
            100% { opacity: 0.9; }
          }
        `}
      </style>
    </div>
  );
}
