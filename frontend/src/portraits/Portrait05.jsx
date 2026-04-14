export const Portrait05 = () => (
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
    <text x="200" y="60" textAnchor="middle" className="title">真诚漏风侠</text>

    {/* 头 */}
    <circle cx="200" cy="130" r="35" className="line"/>

    {/* 眼睛 */}
    <circle cx="185" cy="115" r="4" className="fill-black"/>
    <circle cx="215" cy="115" r="4" className="fill-black"/>

    {/* 开着的嘴巴 */}
    <ellipse cx="200" cy="160" rx="25" ry="20" className="line"/>

    {/* 漂出来的话（筛子眼 - 圆点） */}
    <circle cx="250" cy="100" r="4" className="fill-black"/>
    <circle cx="280" cy="110" r="4" className="fill-black"/>
    <circle cx="300" cy="140" r="4" className="fill-black"/>
    <circle cx="310" cy="170" r="4" className="fill-black"/>
    <circle cx="290" cy="190" r="4" className="fill-black"/>
    <circle cx="260" cy="180" r="4" className="fill-black"/>
    <circle cx="240" cy="150" r="4" className="fill-black"/>

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
    <text x="200" y="390" textAnchor="middle" className="text">你是真诚，但真诚到了让人难受的程度。</text>
    <text x="200" y="420" textAnchor="middle" className="text">你不是在倾诉，你是在进行情感暴力。</text>
    <text x="200" y="450" textAnchor="middle" className="text">有时候保留一点，反而更尊重人。</text>
  </svg>
);
