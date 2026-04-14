export const Portrait08 = () => (
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
    <text x="200" y="60" textAnchor="middle" className="title">世界上最真诚的大好人</text>

    {/* 天使头环 */}
    <circle cx="200" cy="95" r="45" className="line"/>

    {/* 头 */}
    <circle cx="200" cy="130" r="35" className="line"/>

    {/* 眼睛 */}
    <circle cx="185" cy="115" r="4" className="fill-black"/>
    <circle cx="215" cy="115" r="4" className="fill-black"/>

    {/* 微笑 */}
    <path d="M 185 150 Q 200 160 215 150" className="line" strokeWidth="2"/>

    {/* 翅膀左边（由小谎言组成） */}
    <path d="M 165 140 Q 120 110 110 160" className="line"/>
    <line x1="140" y1="130" x2="125" y2="145" className="line"/>
    <line x1="145" y1="120" x2="123" y2="155" className="line"/>
    <line x1="150" y1="130" x2="120" y2="165" className="line"/>

    {/* 翅膀右边（由小谎言组成） */}
    <path d="M 235 140 Q 280 110 290 160" className="line"/>
    <line x1="260" y1="130" x2="275" y2="145" className="line"/>
    <line x1="255" y1="120" x2="277" y2="155" className="line"/>
    <line x1="250" y1="130" x2="280" y2="165" className="line"/>

    {/* 身体 */}
    <line x1="200" y1="165" x2="200" y2="260" className="line"/>
    <line x1="150" y1="200" x2="250" y2="200" className="line"/>

    {/* 腿 */}
    <line x1="170" y1="260" x2="170" y2="330" className="line"/>
    <line x1="230" y1="260" x2="230" y2="330" className="line"/>

    {/* 脚 */}
    <line x1="145" y1="330" x2="195" y2="330" className="line"/>
    <line x1="205" y1="330" x2="255" y2="330" className="line"/>

    {/* 反讽文案 */}
    <text x="200" y="390" textAnchor="middle" className="text">你人设立得最完美。越完美的人，</text>
    <text x="200" y="420" textAnchor="middle" className="text">越值得怀疑。不对，我信你。</text>
    <text x="200" y="450" textAnchor="middle" className="text">（真的吗？）</text>
  </svg>
);
