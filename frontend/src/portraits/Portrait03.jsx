export const Portrait03 = () => (
  <svg width="100%" viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" style={{maxWidth: '400px', margin: '0 auto'}}>
    <style>
      {`
        .title { font-size: 24px; font-weight: bold; font-family: Arial, sans-serif; }
        .text { font-size: 14px; font-family: Arial, sans-serif; }
        .line { fill: none; stroke: black; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
        .fill-black { fill: black; }
        .dashed { stroke-dasharray: 6,6; }
      `}
    </style>

    {/* 外框 */}
    <rect x="20" y="20" width="360" height="460" fill="white" stroke="black" strokeWidth="3" rx="8"/>

    {/* 标题 */}
    <text x="200" y="60" textAnchor="middle" className="title">虚实混淆大师</text>

    {/* 左半边头：涂黑的 */}
    <circle cx="160" cy="130" r="35" className="fill-black"/>

    {/* 右半边头：空心的 */}
    <circle cx="240" cy="130" r="35" className="line"/>

    {/* 中间抖动的线 */}
    <path d="M 200 95 Q 196 130 200 165" className="dashed" style={{strokeWidth: '3'}}/>

    {/* 身体 */}
    <line x1="160" y1="165" x2="160" y2="280" className="line" style={{strokeWidth: '5', fill: 'black', stroke: 'black'}}/>
    <line x1="240" y1="165" x2="240" y2="280" className="line" style={{strokeWidth: '5'}}/>

    {/* 腿 */}
    <line x1="145" y1="280" x2="145" y2="350" className="line"/>
    <line x1="175" y1="280" x2="175" y2="350" className="line"/>
    <line x1="225" y1="280" x2="225" y2="350" className="line"/>
    <line x1="255" y1="280" x2="255" y2="350" className="line"/>

    {/* 脚 */}
    <line x1="130" y1="350" x2="190" y2="350" className="line"/>
    <line x1="210" y1="350" x2="270" y2="350" className="line"/>

    {/* 反讽文案 */}
    <text x="200" y="390" textAnchor="middle" className="text">既真诚又虚伪，既在场又缺席。</text>
    <text x="200" y="420" textAnchor="middle" className="text">你自己都搞清楚你是谁了吗？</text>
    <text x="200" y="450" textAnchor="middle" className="text">薛定谔都替你着急。</text>
  </svg>
);
