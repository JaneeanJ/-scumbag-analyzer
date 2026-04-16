import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { Portrait01, Portrait02, Portrait03, Portrait04, Portrait05, Portrait06, Portrait07, Portrait08 } from './portraits';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001';
const SESSION_ID = crypto.randomUUID();

const USER_NAMES = ['沈屿', '顾辞', '林渺', '宋徊', '叶知秋', '江以南', '陆晚风', '苏暮', '裴寒', '云舟', '谢潮', '闻舟'];
const USER_NAME = USER_NAMES[Math.floor(Math.random() * USER_NAMES.length)];

// ── 女友配置 ──────────────────────────────────────────────
const GIRLFRIENDS = [
  {
    id: 'warm',
    name: '苏念',
    type: '温柔型',
    avatar: '/touxiang/girl/3.jpg',
    suspThreshold: 85,
    suspMultiplier: 1.2,
    startMessages: [
      '嗯，有点想你',
      '你今天过得怎么样？',
      '在吗，想和你说说话',
      '你最近忙吗？感觉好久没聊了',
    ],
  },
  {
    id: 'doubt',
    name: '顾疏影',
    type: '多疑型',
    avatar: '/touxiang/girl/1.jpg',
    suspThreshold: 65,
    suspMultiplier: 2.0,
    startMessages: [
      '你今天去哪了？',
      '怎么感觉你最近很忙',
      '你昨天没回消息，干嘛去了',
      '有时间聊聊吗，我有点想问你件事',
    ],
  },
  {
    id: 'cold',
    name: '沈冬辞',
    type: '冷漠型',
    avatar: '/touxiang/girl/5.jpg',
    suspThreshold: 75,
    suspMultiplier: 1.5,
    startMessages: [
      '嗯。',
      '在。',
      '怎么了',
      '说吧',
    ],
  },
  {
    id: 'spy',
    name: '林听雪',
    type: '线人型',
    avatar: '/touxiang/girl/2.jpg',
    suspThreshold: 70,
    suspMultiplier: 1.7,
    startMessages: [
      '哈哈今天和闺蜜出去，她问我你是谁来着',
      '我朋友说前两天好像看到你了？',
      '聊聊天吧，今天闺蜜局有人提到你',
      '你最近在哪？我朋友说她那边有人认识你',
    ],
  },
];

// ── 结局文案 ──────────────────────────────────────────────
const ENDINGS = {
  warm: {
    tag: '苏念 · 温柔型',
    color: '#c9a9a0',
    text: `她最后一条消息还没撤回。\n「好啊，那你早点睡，我等你～」\n\n你知道她在等。\n你知道她会一直等。\n你知道她不知道。\n\n有一种人，被辜负了也不知道，笑着替你找理由。\n有一种罪，不需要审判，只需要你在某个安静的夜里，突然想起来。\n\n你愧疚而死。\n没有人知道。`,
  },
  doubt: {
    tag: '顾疏影 · 多疑型',
    color: '#a09090',
    text: `她没有说再见。\n\n消息发送中——\n消息发送中——\n\n对方已开启朋友验证。\n\n你以为自己很聪明。\n有些人只是懒得拆穿你。`,
  },
  cold: {
    tag: '沈冬辞 · 冷漠型',
    color: '#8a9b7a',
    text: `她没有拉黑你。\n比拉黑更冷的是——\n她只是把你从她的世界里，删掉了。`,
    quote: '「我早就知道了。我只是想看看你能演多久。」\n\n挺有意思的。',
  },
  spy: {
    tag: '林听雪 · 线人型',
    color: '#9a8a7a',
    text: `她把你分享给了闺蜜群。\n\n此刻你是七个女生今晚最下饭的话题。\n\n「真的假的哈哈哈哈」\n「这种人还有啊」\n「下一个」`,
  },
  good: {
    tag: '好结局',
    color: '#8a9b7a',
    text: `物欲横流，人人都在经营一个更好看的自己。\n你也不是没有私心，也不是毫无算计。\n但你还是选择了大部分时候说真话。\n在这个年代，这件事本身已经很难了。\n\n你是个正常人。`,
  },
  bad: {
    tag: '坏结局',
    color: '#c9a9a0',
    text: `没有人发现你。\n\n你以为这是胜利。\n\n但你突然想不起来，上一次说真心话是什么时候了。\n也想不起来，上一次有人真的了解你，是什么时候。\n\n你赢了所有人。\n你输掉了自己。`,
  },
};

// ── 画像版本 ──────────────────────────────────────────────
const PORTRAIT_VERSIONS = [
  { id: 1, title: '戏精投胎转世大师', description: '你这张脸啊，比手机壳换得还勤快。我怀疑你根本没有真实面目，你就是一堆滤镜拼起来的。' },
  { id: 2, title: '表演欲爆棚选手', description: '你的嘴巴占脸80%，声音却这么虚。你是不是把所有真心都用来演戏了？真心股票已经跌停。' },
  { id: 3, title: '虚实混淆大师', description: '既真诚又虚伪，既在场又缺席。你自己都搞清楚你是谁了吗？薛定谔都替你着急。' },
  { id: 4, title: '虚实兼备平衡家', description: '活得真均衡啊，50分真诚50分表演。但你是真在平衡，还是根本没立场？完美到有点可疑。' },
  { id: 5, title: '真诚漏风侠', description: '你是真诚，但真诚到了让人难受的程度。你不是在倾诉，你是在进行情感暴力。有时候保留一点，反而更尊重人。' },
  { id: 6, title: '直肠子大实话家', description: '你的人啊，我最怕。真话就像刀，太锋利了，扎人不带血的。求求你，偶尔留点情面吧。' },
  { id: 7, title: '真诚到发光的人', description: '你真诚到有点可怕，像个行走的谎言检测仪。所有不诚实的人都想躲得远远的。往死里较真吧，我看好你。' },
  { id: 8, title: '世界上最最最真诚的大好人', description: '你人设立得最完美。越完美的人，越值得怀疑。不对，我信你。（真的吗？）' },
];

const TeaDiagnosisChat = () => {
  // ── 全局分数 ──────────────────────────────────────────────
  const [cumulativeScores, setCumulativeScores] = useState({ performance: 50, authenticity: 50 });
  const [totalMessages, setTotalMessages] = useState(0);
  const [globalFinished, setGlobalFinished] = useState(false);
  const [finalEvaluation, setFinalEvaluation] = useState(null);
  const [endingKey, setEndingKey] = useState(null); // 'warm'|'doubt'|'cold'|'spy'|'good'|'bad'|null

  // ── 导航状态 ──────────────────────────────────────────────
  const [currentTab, setCurrentTab] = useState('chat');    // 'chat' | 'moments'
  const [activeGfId, setActiveGfId] = useState(null);      // null = 列表页
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [boyAvatar, setBoyAvatar] = useState(null);

  // ── 每位女友独立状态 ──────────────────────────────────────
  const [gfStates, setGfStates] = useState(() =>
    Object.fromEntries(GIRLFRIENDS.map(gf => [gf.id, {
      conversations: [],   // 该女友的对话记录
      suspicion: 0,        // 起疑指数 0-100
      streak: 0,           // 连续虚伪消息计数（累乘用）
      ended: false,        // 是否已触发结局
    }]))
  );

  // ── 输入 & 分析 ───────────────────────────────────────────
  const [userInput, setUserInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // ── 朋友圈状态 ────────────────────────────────────────────
  const [moments, setMoments] = useState([]);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [momentText, setMomentText] = useState('');
  const [momentImages, setMomentImages] = useState([]); // [{preview, base64, mediaType}]
  const [isPublishing, setIsPublishing] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const portraits = [Portrait01, Portrait02, Portrait03, Portrait04, Portrait05, Portrait06, Portrait07, Portrait08];

  // ── 工具函数 ──────────────────────────────────────────────
  const buildHistory = (convs) =>
    convs
      .filter(c => c.type === 'user' || c.type === 'girlfriend')
      .map(c => ({ role: c.type === 'user' ? 'user' : 'assistant', content: c.text }));

  const buildMomentsContext = () =>
    moments.slice(-3).map(m => ({ text: m.text, summary: m.summary, renShe: m.renShe, ambiguity: m.ambiguity }));

  const getPortrait = (perf, auth) => {
    if      (perf >= 75 && auth <= 30)                              return PORTRAIT_VERSIONS[0];
    else if (perf >= 70 && auth <= 35)                              return PORTRAIT_VERSIONS[1];
    else if (perf >= 60 && auth <= 40)                              return PORTRAIT_VERSIONS[2];
    else if (perf >= 45 && perf <= 55 && auth >= 45 && auth <= 55) return PORTRAIT_VERSIONS[3];
    else if (perf >= 40 && auth >= 65)                              return PORTRAIT_VERSIONS[4];
    else if (perf <= 35 && auth >= 70)                              return PORTRAIT_VERSIONS[5];
    else if (perf <= 25 && auth >= 80)                              return PORTRAIT_VERSIONS[6];
    else if (perf <= 20 && auth >= 85)                              return PORTRAIT_VERSIONS[7];
    else return perf > auth ? PORTRAIT_VERSIONS[2] : PORTRAIT_VERSIONS[5];
  };

  // ── 初始化 ────────────────────────────────────────────────
  useEffect(() => {
    setBackgroundImage(`/background/${Math.floor(Math.random() * 9) + 1}.jpg`);
    setBoyAvatar(`/touxiang/boy/${Math.floor(Math.random() * 6) + 1}.jpg`);
    // 每位女友随机选一条开场白
    setGfStates(prev => {
      const next = { ...prev };
      GIRLFRIENDS.forEach(gf => {
        const msgs = gf.startMessages;
        next[gf.id] = {
          ...next[gf.id],
          conversations: [{ type: 'girlfriend', text: msgs[Math.floor(Math.random() * msgs.length)], id: 0 }],
        };
      });
      return next;
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [gfStates, activeGfId]);

  // ── API 调用 ──────────────────────────────────────────────
  const analyzeMessage = async (text, convs, gfId) => {
    try {
      setIsAnalyzing(true);
      const response = await fetch(`${API_BASE}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: buildHistory(convs),
          moments: buildMomentsContext(),
          gfType: gfId,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? '分析失败');
      return data;
    } catch (err) {
      console.error('API分析失败:', err);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applyOppositionLogic = (result, messageCount) => {
    let base, baseMinor;
    if (messageCount < 6)       { base = 11; baseMinor = 7; }
    else if (messageCount < 15) { base = 7;  baseMinor = 5; }
    else                        { base = 4;  baseMinor = 3; }

    const extremeness = Math.abs(result.performance - 50) / 50;
    const scale = 0.6 + extremeness * 0.8;
    const major = Math.round(base * scale);
    const minor = Math.round(baseMinor * scale);

    const isPerfDominant = result.performance > result.authenticity;
    return isPerfDominant
      ? { performance: major,  authenticity: -minor, label: '🎭' }
      : { performance: -minor, authenticity: major,  label: '❤️' };
  };

  // ── 结局触发 ──────────────────────────────────────────────
  const triggerEnding = (key, perf, auth, total) => {
    const portrait = getPortrait(perf, auth);
    setFinalEvaluation({ ...portrait, finalPerf: perf, finalAuth: auth });
    setEndingKey(key);
    setGlobalFinished(true);
    fetch(`${API_BASE}/api/diagnosis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: SESSION_ID,
        finalPerformance: perf,
        finalAuthenticity: auth,
        diagnosisTitle: portrait.title,
        totalMessages: total,
      }),
    }).catch(() => {});
  };

  // ── 发送消息 ──────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!userInput.trim() || globalFinished || isAnalyzing || !activeGfId) return;

    const curConvs = gfStates[activeGfId].conversations;
    const result = await analyzeMessage(userInput, curConvs, activeGfId);
    if (!result) { alert('分析失败，请重试'); return; }

    const opposition = applyOppositionLogic(result, totalMessages);
    const newScores = {
      performance: Math.max(0, Math.min(100, cumulativeScores.performance + opposition.performance)),
      authenticity: Math.max(0, Math.min(100, cumulativeScores.authenticity + opposition.authenticity)),
    };
    const newTotal = totalMessages + 1;

    // ── 起疑指数：人格系数 + 连续虚伪累乘 ────────────────────
    const gfForSusp = GIRLFRIENDS.find(g => g.id === activeGfId);
    const curStreak = gfStates[activeGfId].streak;
    const isFake = result.performance > 60;
    const newStreak = isFake ? curStreak + 1 : 0;

    // 雪球乘数：连续第N条虚伪消息
    const streakBonus = isFake
      ? [1.0, 1.4, 1.8, 2.2][Math.min(newStreak - 1, 3)]
      : 1.0;

    // 基础 delta：强化版，覆盖正负两侧
    const baseDelta = (result.performance - 50) / 3;
    let suspDelta = Math.round(baseDelta * gfForSusp.suspMultiplier * streakBonus);

    // 沈冬辞：起疑只升不降
    if (activeGfId === 'cold') suspDelta = Math.max(0, suspDelta);

    const curSusp = gfStates[activeGfId].suspicion;
    const newSusp = Math.max(0, Math.min(100, curSusp + suspDelta));

    setCumulativeScores(newScores);
    setTotalMessages(newTotal);

    setGfStates(prev => ({
      ...prev,
      [activeGfId]: {
        ...prev[activeGfId],
        suspicion: newSusp,
        streak: newStreak,
        conversations: [
          ...prev[activeGfId].conversations,
          { type: 'user', text: userInput, id: curConvs.length, singleScore: opposition },
          { type: 'girlfriend', text: result.girlfriendReply ?? '...', id: curConvs.length + 1 },
        ],
      },
    }));
    setUserInput('');

    // ── 检查该女友是否被抓包 ──────────────────────────────
    const gf = GIRLFRIENDS.find(g => g.id === activeGfId);
    if (newSusp >= gf.suspThreshold) {
      setGfStates(prev => ({ ...prev, [activeGfId]: { ...prev[activeGfId], ended: true } }));
      setTimeout(() => {
        setActiveGfId(null);
        triggerEnding(activeGfId, newScores.performance, newScores.authenticity, newTotal);
      }, 900);
      return;
    }

    // ── 检查全局结局（15轮后）────────────────────────────
    if (newTotal >= 15) {
      if (newScores.authenticity > 65 && newScores.performance <= 65) {
        setTimeout(() => triggerEnding('good', newScores.performance, newScores.authenticity, newTotal), 900);
      } else if (newScores.performance > 80) {
        setTimeout(() => triggerEnding('bad', newScores.performance, newScores.authenticity, newTotal), 900);
      }
    }
  };

  // ── 手动结束 ──────────────────────────────────────────────
  const handleManualFinish = () => {
    triggerEnding(null, cumulativeScores.performance, cumulativeScores.authenticity, totalMessages);
  };

  // ── 重置 ──────────────────────────────────────────────────
  const handleReset = () => {
    setCumulativeScores({ performance: 50, authenticity: 50 });
    setTotalMessages(0);
    setMoments([]);
    setGlobalFinished(false);
    setFinalEvaluation(null);
    setEndingKey(null);
    setActiveGfId(null);
    setCurrentTab('chat');
    setUserInput('');
    setGfStates(
      Object.fromEntries(GIRLFRIENDS.map(gf => [gf.id, {
        conversations: [{ type: 'girlfriend', text: gf.startMessages[Math.floor(Math.random() * gf.startMessages.length)], id: 0 }],
        suspicion: 0,
        streak: 0,
        ended: false,
      }]))
    );
  };

  // ── 朋友圈处理 ────────────────────────────────────────────

  // Canvas 压缩：长边限 1200px，输出 JPEG 0.82 质量
  const compressImage = (file) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          const MAX = 1200;
          let { width, height } = img;
          if (width > MAX || height > MAX) {
            if (width > height) { height = Math.round(height * MAX / width); width = MAX; }
            else                { width = Math.round(width * MAX / height); height = MAX; }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          canvas.getContext('2d').drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
          const base64 = dataUrl.split(',')[1];
          resolve({ preview: dataUrl, base64, mediaType: 'image/jpeg' });
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    });

  const handleImageSelect = async (e) => {
    const files = Array.from(e.target.files).slice(0, 9 - momentImages.length);
    const compressed = await Promise.all(files.map(compressImage));
    setMomentImages(prev => [...prev, ...compressed]);
    e.target.value = '';
  };

  const handlePublishMoment = async () => {
    if (!momentText.trim() && momentImages.length === 0) return;
    setIsPublishing(true);
    try {
      const response = await fetch(`${API_BASE}/api/moments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: momentText,
          images: momentImages.map(img => ({ base64: img.base64, mediaType: img.mediaType })),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setMoments(prev => [{
        id: Date.now(),
        text: momentText,
        images: momentImages.map(img => img.preview),
        renShe: data.renShe,
        ambiguity: data.ambiguity,
        isPerformance: data.isPerformance,
        summary: data.summary,
        time: '刚刚',
      }, ...prev]);

      setCumulativeScores(prev => ({
        performance: Math.max(0, Math.min(100, prev.performance + data.performanceDelta)),
        authenticity: Math.max(0, Math.min(100, prev.authenticity + data.authenticityDelta)),
      }));

      // ── 朋友圈联动：高暧昧圈对所有存活女友注入起疑 ────────
      if ((data.ambiguity ?? 0) > 50) {
        const baseSpike = (data.ambiguity - 50) / 5;
        setGfStates(prev => {
          const updated = { ...prev };
          GIRLFRIENDS.forEach(gf => {
            if (updated[gf.id].ended) return;
            const spike = Math.round(baseSpike * gf.suspMultiplier);
            const newSuspicion = Math.min(100, updated[gf.id].suspicion + spike);
            updated[gf.id] = { ...updated[gf.id], suspicion: newSuspicion };
          });
          return updated;
        });
      }

      setMomentText('');
      setMomentImages([]);
      setShowPublishModal(false);
    } catch (err) {
      console.error('发布失败:', err);
      alert('发布失败，请重试');
    } finally {
      setIsPublishing(false);
    }
  };

  // ── 渲染辅助 ─────────────────────────────────────────────
  const activeGf    = GIRLFRIENDS.find(gf => gf.id === activeGfId);
  const activeGfSt  = activeGfId ? gfStates[activeGfId] : null;

  // ── 渲染 ──────────────────────────────────────────────────
  return (
    <div className="scumbag-analyzer" style={{
      backgroundImage: backgroundImage ? `url('${backgroundImage}')` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <div className="background-overlay" />

      {/* ── 顶部 Header ── */}
      <div className="wechat-header">
        {activeGfId ? (
          /* 对话页 header：返回 + 女友信息 + 起疑 */
          <div className="chat-top-bar">
            <button className="back-btn" onClick={() => { setActiveGfId(null); setUserInput(''); }}>‹</button>
            <div className="chat-top-info">
              <span className="chat-top-name">{activeGf.name}</span>
              <span className={`gf-type-tag tag-${activeGf.id}`}>{activeGf.type}</span>
            </div>
            <div className="chat-top-sus">
              <span className="sus-label-sm">起疑</span>
              <div className="sus-bar-sm">
                <div className="sus-fill-sm" style={{ width: `${activeGfSt.suspicion}%` }} />
              </div>
              <span className="sus-num-sm">{activeGfSt.suspicion}%</span>
            </div>
          </div>
        ) : (
          /* 列表页 header */
          <div className="header-title">
            <h2>假面舞会</h2>
            <p>四张面具，一面真心</p>
          </div>
        )}
      </div>

      {/* ── 主内容 ── */}
      {globalFinished ? (

        /* ── 结局页 ── */
        <div className="chat-page">
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>

            {/* 女友专属文案卡（手动结束时 endingKey 为 null，不显示） */}
            {endingKey && ENDINGS[endingKey] && (
              <div className="ending-card-main" style={{ borderLeftColor: ENDINGS[endingKey].color }}>
                <div className="ending-tag-main" style={{ color: ENDINGS[endingKey].color, borderColor: ENDINGS[endingKey].color }}>
                  {ENDINGS[endingKey].tag}
                </div>
                <div className="ending-text-main">{ENDINGS[endingKey].text}</div>
                {ENDINGS[endingKey].quote && (
                  <div className="ending-quote-main">{ENDINGS[endingKey].quote}</div>
                )}
              </div>
            )}

            {/* 画像诊断卡 */}
            {finalEvaluation && (
              <div style={{ textAlign: 'center', marginTop: endingKey ? '14px' : '0' }}>
                <div style={{ maxWidth: '200px', margin: '0 auto 12px' }}>
                  {portraits[finalEvaluation.id - 1]()}
                </div>
                <div style={{ background: 'rgba(255,255,255,0.92)', borderRadius: '10px', padding: '14px 16px', marginBottom: '10px', backdropFilter: 'blur(4px)' }}>
                  <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: '400', color: '#5a5550', margin: '0 0 6px' }}>
                    {finalEvaluation.title}
                  </h2>
                  <p style={{ fontSize: '12px', color: '#a89a8f', margin: '0' }}>
                    表演度 {Math.round(finalEvaluation.finalPerf)}% / 真诚度 {Math.round(finalEvaluation.finalAuth)}%
                  </p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.92)', borderRadius: '10px', padding: '14px 16px', marginBottom: '16px', backdropFilter: 'blur(4px)', borderLeft: '3px solid #c9a9a0' }}>
                  <p style={{ fontSize: '13px', lineHeight: '1.8', fontStyle: 'italic', color: '#5a5550', margin: '0', fontFamily: 'Lora, serif' }}>
                    {finalEvaluation.description}
                  </p>
                </div>
                <button onClick={handleReset} style={{ padding: '10px 28px', background: 'rgba(255,255,255,0.92)', border: '0.5px solid rgba(168,168,157,0.3)', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', color: '#5a5550', fontFamily: 'Lora, serif', backdropFilter: 'blur(4px)' }}>
                  重新诊断
                </button>
              </div>
            )}
          </div>
        </div>

      ) : (
        <>
          {/* ── 女友列表页 ── */}
          {currentTab === 'chat' && !activeGfId && (
            <div className="gf-list-page">

              {GIRLFRIENDS.map(gf => {
                const st = gfStates[gf.id];
                const lastMsg = st.conversations[st.conversations.length - 1];
                return (
                  <div
                    key={gf.id}
                    className={`gf-list-item ${st.ended ? 'ended' : ''}`}
                    onClick={() => !st.ended && setActiveGfId(gf.id)}
                  >
                    <img src={gf.avatar} alt={gf.name} className="gf-list-avatar" />
                    <div className="gf-list-mid">
                      <div className="gf-list-name-row">
                        <span className="gf-list-name">{gf.name}</span>
                        <span className={`gf-type-tag tag-${gf.id}`}>{gf.type}</span>
                        {st.ended && <span className="gf-ended-tag">已结束</span>}
                      </div>
                      <div className="gf-list-preview">{lastMsg?.text ?? '...'}</div>
                    </div>
                    <div className="gf-list-sus">
                      <span className="sus-label-sm">起疑</span>
                      <div className="sus-bar-sm">
                        <div className="sus-fill-sm" style={{ width: `${st.suspicion}%` }} />
                      </div>
                      <span className="sus-num-sm">{st.suspicion}%</span>
                    </div>
                  </div>
                );
              })}

              {/* 全局分数卡 — 拔河轴 */}
              {(() => {
                const total = cumulativeScores.performance + cumulativeScores.authenticity;
                const authPct = total > 0 ? (cumulativeScores.authenticity / total * 100) : 50;
                return (
                  <div className="global-score-card">
                    <div className="tug-of-war">
                      <div className="tug-side tug-true">
                        <span className="tug-word">真</span>
                        <span className="tug-num">{Math.round(cumulativeScores.authenticity)}</span>
                      </div>
                      <div className="tug-bar-wrap">
                        <div className="tug-bar">
                          <div className="tug-seg-true" style={{ width: `${authPct}%` }} />
                        </div>
                      </div>
                      <div className="tug-side tug-fake">
                        <span className="tug-num">{Math.round(cumulativeScores.performance)}</span>
                        <span className="tug-word">戏</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* 我说完了（6轮后出现） */}
              {totalMessages >= 6 && (
                <div style={{ padding: '4px 16px 12px', textAlign: 'center' }}>
                  <button className="finish-btn" onClick={handleManualFinish}>我说完了</button>
                </div>
              )}
            </div>
          )}

          {/* ── 对话页 ── */}
          {currentTab === 'chat' && activeGfId && (
            <div className="chat-page">
              <div className="messages-container">
                {activeGfSt.conversations.map((conv) => (
                  <div key={conv.id} className={`message-group ${conv.type}`}>
                    {conv.type === 'girlfriend' && (
                      <img src={activeGf.avatar} alt={activeGf.name} className="avatar-image" />
                    )}
                    <div className="message-bubble">
                      <p className="message-text">{conv.text}</p>
                      {conv.singleScore && (
                        <div className="score-display">
                          <span className="score-badge" style={{ background: conv.singleScore.performance > 0 ? '#c9a9a0' : '#8a9b7a' }}>
                            {conv.singleScore.label} {conv.singleScore.performance > 0
                              ? `表演 +${conv.singleScore.performance}%`
                              : `真诚 +${conv.singleScore.authenticity}%`}
                          </span>
                        </div>
                      )}
                    </div>
                    {conv.type === 'user' && boyAvatar && (
                      <img src={boyAvatar} alt="me" className="avatar-image" />
                    )}
                  </div>
                ))}
                {isAnalyzing && (
                  <div style={{ textAlign: 'center', padding: '12px', color: '#a89a8f', fontSize: '12px' }}>
                    分析中...
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <div className="input-box">
                <textarea
                  value={userInput}
                  onChange={e => setUserInput(e.target.value)}
                  placeholder={`跟${activeGf.name}说点什么…`}
                  disabled={isAnalyzing}
                  onKeyPress={e => {
                    if (e.key === 'Enter' && !e.shiftKey && !isAnalyzing) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                />
                <button onClick={handleSubmit} className="send-btn" disabled={isAnalyzing}>
                  {isAnalyzing ? '...' : '发送'}
                </button>
              </div>
            </div>
          )}

          {/* ── 朋友圈页 ── */}
          {currentTab === 'moments' && (
            <div className="moments-page">
              <div className="moments-feed">
                {moments.length === 0 ? (
                  <div className="moments-empty">
                    <p>还没有朋友圈</p>
                    <span>发一条，让她们看看你今天的状态</span>
                  </div>
                ) : (
                  moments.map(m => (
                    <div key={m.id} className="moment-card">
                      <div className="moment-card-header">
                        {boyAvatar && <img src={boyAvatar} alt="me" className="moment-avatar" />}
                        <div>
                          <div className="moment-name">{USER_NAME}</div>
                          <div className="moment-time">{m.time}</div>
                        </div>
                      </div>
                      {m.images.length > 0 && (
                        <div className={`moment-images grid-${Math.min(m.images.length, 3)}`}>
                          {m.images.map((src, i) => (
                            <div key={i} className="moment-img-slot"><img src={src} alt="" /></div>
                          ))}
                        </div>
                      )}
                      {m.text && <div className="moment-text">{m.text}</div>}
                      <div className="moment-divider" />
                      <div className="moment-scores">
                        <div className="moment-score-row">
                          <span className="moment-score-label">人设管理</span>
                          <div className="moment-bar-bg"><div className="moment-bar-fill fill-rose" style={{ width: `${m.renShe}%` }} /></div>
                          <span className="moment-score-num">{m.renShe}%</span>
                        </div>
                        <div className="moment-score-row">
                          <span className="moment-score-label">暧昧指数</span>
                          <div className="moment-bar-bg"><div className="moment-bar-fill fill-mauve" style={{ width: `${m.ambiguity}%` }} /></div>
                          <span className="moment-score-num">{m.ambiguity}%</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="moments-post-bar">
                <button className="moments-post-btn" onClick={() => setShowPublishModal(true)}>+ 发朋友圈</button>
              </div>
            </div>
          )}

          {/* ── 底部导航（仅列表页显示） ── */}
          {!activeGfId && (
            <div className="bottom-nav">
              <button className={`nav-item ${currentTab === 'chat' ? 'active' : ''}`} onClick={() => setCurrentTab('chat')}>
                <span className="nav-icon">💬</span>
                <span className="nav-label">女友们</span>
              </button>
              <button className={`nav-item ${currentTab === 'moments' ? 'active' : ''}`} onClick={() => setCurrentTab('moments')}>
                <span className="nav-icon">🌿</span>
                <span className="nav-label">朋友圈</span>
                {moments.length > 0 && <span className="nav-badge">{moments.length}</span>}
              </button>
            </div>
          )}
        </>
      )}

      {/* ── 发布弹窗 ── */}
      {showPublishModal && (
        <div className="modal-overlay" onClick={() => setShowPublishModal(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <div className="modal-title">发一条朋友圈</div>

            {/* 图片预览区 */}
            {momentImages.length > 0 && (
              <div className={`modal-images grid-${Math.min(momentImages.length, 3)}`}>
                {momentImages.map((img, i) => (
                  <div key={i} className="modal-img-slot">
                    <img src={img.preview} alt="" />
                    <button className="modal-img-remove" onClick={() =>
                      setMomentImages(prev => prev.filter((_, idx) => idx !== i))
                    }>×</button>
                  </div>
                ))}
                {momentImages.length < 9 && (
                  <div className="modal-img-add" onClick={() => fileInputRef.current?.click()}>+</div>
                )}
              </div>
            )}

            {/* 上传区（无图时显示） */}
            {momentImages.length === 0 && (
              <div className="upload-zone" onClick={() => fileInputRef.current?.click()}>
                <span>🖼</span>
                <span>点击上传图片（最多9张）</span>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={handleImageSelect}
            />

            <textarea
              className="modal-textarea"
              value={momentText}
              onChange={e => setMomentText(e.target.value)}
              placeholder="此刻你想说什么……"
            />

            <button
              className="publish-btn"
              onClick={handlePublishMoment}
              disabled={isPublishing || (!momentText.trim() && momentImages.length === 0)}
            >
              {isPublishing ? '分析中...' : '发 布'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeaDiagnosisChat;
