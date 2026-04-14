export const Portrait04 = () => (
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
    <text x="200" y="60" textAnchor="middle" className="title">虚实兼备平衡家</text>

    {/* 跷跷板 */}
    <line x1="80" y1="180" x2="320" y2="180" className="line" strokeWidth="4"/>
    <circle cx="200" cy="190" r="8" className="fill-black"/>

    {/* 左边人（笑脸） */}
    <circle cx="130" cy="120" r="30" className="line"/>
    <circle cx="118" cy="108" r="5" className="fill-black"/>
    <circle cx="142" cy="108" r="5" className="fill-black"/>
    <path d="M 118 130 Q 130 142 142 130" className="line" strokeWidth="2"/>

    {/* 右边人（哭脸） */}
    <circle cx="270" cy="100" r="30" className="line"/>
    <circle cx="258" cy="88" r="5" className="fill-black"/>
    <circle cx="282" cy="88" r="5" className="fill-black"/>
    <path d="M 258 110 Q 270 98 282 110" className="line" strokeWidth="2"/>

    {/* 身体 */}
    <line x1="130" y1="150" x2="130" y2="180" className="line"/>
    <line x1="270" y1="130" x2="270" y2="180" className="line"/>

    {/* 腿 */}
    <line x1="115" y1="180" x2="115" y2="250" className="line"/>
    <line x1="145" y1="180" x2="145" y2="250" className="line"/>
    <line x1="255" y1="180" x2="255" y2="250" className="line"/>
    <line x1="285" y1="180" x2="285" y2="250" className="line"/>

    {/* 脚 */}
    <line x1="100" y1="250" x2="160" y2="250" className="line"/>
    <line x1="240" y1="250" x2="300" y2="250" className="line"/>

    {/* 反讽文案 */}
    <text x="200" y="320" textAnchor="middle" className="text">活得真均衡啊，50分真诚50分表演。</text>
    <text x="200" y="350" textAnchor="middle" className="text">但你是真在平衡，还是根本没立场？</text>
    <text x="200" y="380" textAnchor="middle" className="text">完美到有点可疑。</text>
  </svg>
);
