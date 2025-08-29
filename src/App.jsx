import React, { useState, useEffect } from 'react';

const coupons = [
  { id: 1, text: "Order a snack for me", cooldown: 8, question: "Anything specific on your mind?" },
  { id: 2, text: "Sing me a song", cooldown: 8 },
  { id: 3, text: "Plan a date", cooldown: 15 },
  { id: 4, text: "Play a game with me", cooldown: 8 },
  { id: 5, text: "Order desserts", cooldown: 8 },
  { id: 6, text: "Send pictures", cooldown: 8 },
  { id: 7, text: "Write something nice about me", cooldown: 8 },
];

export default function App() {
  const [welcome, setWelcome] = useState(true);
  const [lastRedeemed, setLastRedeemed] = useState(() => {
    const saved = localStorage.getItem("lastRedeemed");
    return saved ? JSON.parse(saved) : {};
  });
  const [ownerMode, setOwnerMode] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setWelcome(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const redeem = (c) => {
    const now = new Date();
    const daysSince = lastRedeemed[c.id]
      ? Math.floor((now - new Date(lastRedeemed[c.id])) / (1000*60*60*24))
      : null;
    if (daysSince !== null && daysSince < c.cooldown) {
      alert(`This coupon is on cooldown. Try again in ${c.cooldown - daysSince} days.`);
      return;
    }
    setLastRedeemed({ ...lastRedeemed, [c.id]: now });
    localStorage.setItem("lastRedeemed", JSON.stringify({ ...lastRedeemed, [c.id]: now }));
    alert(`Coupon selected: ${c.text}`);
  };

  if (welcome) {
    return <h1 style={{textAlign:"center", marginTop:"30%"}}>HELLO BHAVYA!</h1>;
  }

  return (
    <div style={{fontFamily:"Arial, sans-serif", padding:"20px"}}>
      {!ownerMode ? (
        <div>
          <h2>Available Coupons</h2>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px"}}>
            {coupons.map(c => (
              <button key={c.id} style={{padding:"20px", border:"1px solid #ccc", borderRadius:"10px"}} onClick={() => redeem(c)}>
                {c.text}
              </button>
            ))}
          </div>
          <p style={{marginTop:"20px", color:"gray"}}>
            Days since last coupon: {Object.keys(lastRedeemed).length === 0 ? "None yet" : ""}
          </p>
          <button onClick={() => setOwnerMode(true)} style={{marginTop:"20px"}}>Owner Mode</button>
        </div>
      ) : (
        <div>
          <h2>Owner Mode</h2>
          <p>Here you can track redeemed coupons.</p>
          <ul>
            {Object.entries(lastRedeemed).map(([id, date]) => (
              <li key={id}>{coupons.find(c => c.id == id)?.text} → {new Date(date).toLocaleString()}</li>
            ))}
          </ul>
          <button onClick={() => setOwnerMode(false)}>Back</button>
        </div>
      )}
    </div>
  );
}
