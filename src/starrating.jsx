import { useState } from "react";

export default function StarRating({ maxRating = 5, onSetRating }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  function handleRating(value) {
    setRating(value);
    onSetRating(value); // تبعت القيمة للـ parent
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <div style={{ display: "flex" }}>
        {Array.from({ length: maxRating }, (_, i) => {
          const starValue = i + 1;

          return (
            <span
              key={starValue}
              style={{
                cursor: "pointer",
                fontSize: "24px",
                color: starValue <= (hover || rating) ? "#fcc419" : "#ddd",
              }}
              onClick={() => handleRating(starValue)}
              onMouseEnter={() => setHover(starValue)}
              onMouseLeave={() => setHover(0)}
            >
              ★
            </span>
          );
        })}
      </div>

      <p>{hover || rating || ""}</p>
    </div>
  );
}
