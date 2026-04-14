export const Portrait02 = () => (
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
    <text x="200" y="60" textAnchor="middle" className="title">表演欲爆棚选手</text>

    {/* 头 */}
    <circle cx="200" cy="130" r="35" className="line"/>

    {/* 米粒眼睛 */}
    <circle cx="185" cy="115" r="4" className="fill-black"/>
    <circle cx="215" cy="115" r="4" className="fill-black"/>

    {/* 巨大嘴巴 */}
    <ellipse cx="200" cy="170" rx="60" ry="40" className="line"/>
    <path d="M 140 170 Q 200 220 260 170" className="line" strokeWidth="4"/>

    {/* 身体 */}
    <line x1="200" y1="165" x2="200" y2="250" className="line"/>
    <line x1="140" y1="200" x2="260" y2="200" className="line"/>

    {/* 腿 */}
    <line x1="165" y1="250" x2="165" y2="320" className="line"/>
    <line x1="235" y1="250" x2="235" y2="320" className="line"/>

    {/* 脚 */}
    <line x1="140" y1="320" x2="190" y2="320" className="line"/>
    <line x1="210" y1="320" x2="260" y2="320" className="line"/>

    {/* 反讽文案 */}
    <text x="200" y="380" textAnchor="middle" className="text">你的嘴巴占脸80%，声音却这么虚。</text>
    <text x="200" y="410" textAnchor="middle" className="text">你是不是把所有真心都用来演戏了？</text>
    <text x="200" y="440" textAnchor="middle" className="text">真心股票已经跌停。</text>
  </svg>
);
