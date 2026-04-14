export const Portrait07 = () => (
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
    <text x="200" y="60" textAnchor="middle" className="title">真诚到发光的人</text>

    {/* 歪斜的光线（问题的灯） */}
    <line x1="200" y1="40" x2="220" y2="100" className="line"/>
    <line x1="200" y1="40" x2="180" y2="110" className="line"/>
    <line x1="200" y1="40" x2="140" y2="90" className="line"/>
    <line x1="200" y1="40" x2="260" y2="70" className="line"/>
    
    {/* 下面的光线 */}
    <line x1="200" y1="240" x2="240" y2="290" className="line"/>
    <line x1="200" y1="240" x2="160" y2="290" className="line"/>

    {/* 头 */}
    <circle cx="200" cy="130" r="35" className="line"/>

    {/* 眼睛 */}
    <circle cx="185" cy="115" r="4" className="fill-black"/>
    <circle cx="215" cy="115" r="4" className="fill-black"/>

    {/* 微笑 */}
    <path d="M 185 150 Q 200 160 215 150" className="line" strokeWidth="2"/>

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
    <text x="200" y="390" textAnchor="middle" className="text">你真诚到有点可怕，像个行走的谎言检测仪。</text>
    <text x="200" y="420" textAnchor="middle" className="text">所有不诚实的人都想躲得远远的。</text>
    <text x="200" y="450" textAnchor="middle" className="text">往死里较真吧，我看好你。</text>
  </svg>
);
