export const Portrait06 = () => (
  <svg width="100%" viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" style={{maxWidth: '400px', margin: '0 auto'}}>
    <style>
      {`
        .title { font-size: 24px; font-weight: bold; font-family: Arial, sans-serif; }
        .text { font-size: 14px; font-family: Arial, sans-serif; }
        .line { fill: none; stroke: black; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
        .fill-black { fill: black; }
      `}
    </style>

    {/* 外框 */}
    <rect x="20" y="20" width="360" height="460" fill="white" stroke="black" strokeWidth="3" rx="8"/>

    {/* 标题 */}
    <text x="200" y="60" textAnchor="middle" className="title">直肠子大实话家</text>

    {/* 头（没有嘴） */}
    <circle cx="200" cy="130" r="35" className="line"/>

    {/* 眼睛 */}
    <circle cx="185" cy="115" r="4" className="fill-black"/>
    <circle cx="215" cy="115" r="4" className="fill-black"/>

    {/* 身体是一条直线刺穿 */}
    <line x1="200" y1="165" x2="200" y2="340" className="line" strokeWidth="5"/>

    {/* 两条腿也是直线向两边射出 */}
    <line x1="160" y1="250" x2="100" y2="310" className="line" strokeWidth="4"/>
    <line x1="240" y1="250" x2="300" y2="310" className="line" strokeWidth="4"/>

    {/* 箭头表示刺穿 */}
    <polygon points="200,330 190,310 210,310" className="fill-black"/>

    {/* 脚 */}
    <line x1="85" y1="310" x2="115" y2="310" className="line"/>
    <line x1="285" y1="310" x2="315" y2="310" className="line"/>

    {/* 反讽文案 */}
    <text x="200" y="390" textAnchor="middle" className="text">你的人啊，我最怕。真话就像刀，</text>
    <text x="200" y="420" textAnchor="middle" className="text">太锋利了，扎人不带血的。</text>
    <text x="200" y="450" textAnchor="middle" className="text">求求你，偶尔留点情面吧。</text>
  </svg>
);
