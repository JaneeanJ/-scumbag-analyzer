export const Portrait01 = () => (
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
    <text x="200" y="60" textAnchor="middle" className="title">戏精投胎转世大师</text>

    {/* 身体 */}
    <circle cx="200" cy="200" r="40" className="line"/>

    {/* 多张旋转的脸 */}
    <circle cx="200" cy="120" r="25" className="line"/>
    <circle cx="240" cy="145" r="25" className="line"/>
    <circle cx="230" cy="195" r="25" className="line"/>
    <circle cx="170" cy="195" r="25" className="line"/>
    <circle cx="160" cy="145" r="25" className="line"/>

    {/* 中心大问号 */}
    <text x="200" y="215" textAnchor="middle" style={{fontSize: '80px', fontWeight: 'bold'}}>?</text>

    {/* 腿 */}
    <line x1="175" y1="240" x2="175" y2="310" className="line"/>
    <line x1="225" y1="240" x2="225" y2="310" className="line"/>

    {/* 脚 */}
    <line x1="150" y1="310" x2="200" y2="310" className="line"/>
    <line x1="200" y1="310" x2="250" y2="310" className="line"/>

    {/* 反讽文案 */}
    <text x="200" y="380" textAnchor="middle" className="text">你这张脸啊，比手机壳换得还勤快。</text>
    <text x="200" y="410" textAnchor="middle" className="text">我怀疑你根本没有真实面目，</text>
    <text x="200" y="440" textAnchor="middle" className="text">你就是一堆滤镜拼起来的。</text>
  </svg>
);
