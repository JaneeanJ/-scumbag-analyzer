import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { Portrait01, Portrait02, Portrait03, Portrait04, Portrait05, Portrait06, Portrait07, Portrait08 } from './portraits';
import { vocabularyData } from './vocabularyData';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001';

// 每次应用启动时生成一个随机会话 ID，用于后端去重
const SESSION_ID = crypto.randomUUID();

const TeaDiagnosisChat = () => {
  const [conversations, setConversations] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [cumulativeScores, setCumulativeScores] = useState({
    performance: 50,
    authenticity: 50,
  });
  const [totalMessages, setTotalMessages] = useState(0);
  const [finished, setFinished] = useState(false);
  const [finalEvaluation, setFinalEvaluation] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [boyAvatar, setBoyAvatar] = useState(null);
  const [girlAvatar, setGirlAvatar] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const messagesEndRef = useRef(null);

  const portraits = [Portrait01, Portrait02, Portrait03, Portrait04, Portrait05, Portrait06, Portrait07, Portrait08];

  const getRandomAvatar = (folder) => {
    const randomNum = Math.floor(Math.random() * 6) + 1;
    return `/touxiang/${folder}/${randomNum}.jpg`;
  };

  const COQUETTISH_KEYWORDS = {
    suffixes: ['~', '呀', '呢', '啦', '啊', '哈', '呗', '吖', '呃', '嗯呀', '嘿', '嘚'],
    nicknames: ['宝宝', '宝贝', '亲亲', '学宝', '亲爱的', '亲', '宝', '亲爹', '亲娘', '宝爷', '老公', '老婆', '男神', '女神', '主人', '大人'],
    soundwords: ['呜呜', '呜', '呵呵', '嘻嘻', '嘘', '嗯哼', '哼', '啊呀', '呃呃', '嘿嘿', '噗嗤', '呸'],
    exaggerations: ['最最最', '超级', '特别', '非常', '简直', '啊呀', '哎呀', '天哪', '真的呢', '特别特别', '真的真的'],
    pitiful: ['委屈', '难受', '伤心', '心疼', '怀念', '思念', '渴望', '期待', '只有你', '没有你不行', '都是我的错'],
    emoticons: ['qwq', 'Q_Q', '>-<', 'TvT', '°_°', 'ಠ_ಠ', '(´；ω；`)', '(´•́ ω •̀`)', '(´；︿；`)', '😭', '😢', '😖', '😣', '😩'],
    dragging: ['呐~', '啦~', '啊~', '呀~', '嘻~', '哈~', '呜~', '嗯~']
  };

  const hasCoquettishTone = (text) => {
    const allCoquettishWords = [
      ...COQUETTISH_KEYWORDS.suffixes,
      ...COQUETTISH_KEYWORDS.nicknames,
      ...COQUETTISH_KEYWORDS.soundwords,
      ...COQUETTISH_KEYWORDS.exaggerations,
      ...COQUETTISH_KEYWORDS.pitiful,
      ...COQUETTISH_KEYWORDS.emoticons,
      ...COQUETTISH_KEYWORDS.dragging
    ];
    return allCoquettishWords.some(keyword => text.includes(keyword));
  };

  const IMPROVED_CLAUDE_PROMPT = `你是一个中文情感分析专家，擅长识别"茶艺虚伪"和"真诚坦白"。分析这句话的"虚伪程度"，返回0-100的分数。
【第一层】识别语气成分
- 撒娇语气 → +30分
- 夸张表达 → +20分  
- 装可怜/制造依赖感 → +25分
- 模糊承诺 → +20分
- 制造内疚感 → +15分

【第二层】评估行动承诺
- 真诚的行动词 → -30分
- 具体承诺 → -25分
- 承认自己不足 → -25分
- 坦白心声 → -20分
- 只说不做的"承诺" → +35分

【第三层】整体"意图"评估
检查是否在"制造幻想"、"制造内疚"、"博同情"、"套路感强"

返回ONLY一个数字0-100。`;

  const girlfriendReplies = {
    start: [
      "嘿，在吗？我想和你说说话...",
      "你最近怎么样啊？感觉你好久没好好陪我了呢😢",
      "宝贝，今天过得怎么样？有没有想我呀？",
      "你有没有想起我啊？我在这里等你呢...",
      "嗯，有时间吗？我想和你聊聊天",
      "你在干什么呢？想听听你的声音...",
    ],
    afterMessage: [
      [
        "是这样啊...（其实我不信）",
        "哼，你又在骗我呢，是不是？",
        "你这话听起来怪怪的，真的吗？",
        "我怎么感觉你在装呢...",
        "你是不是有什么在隐瞒我？",
        "为什么你每次都这样说？",
        "我知道你是怎么想的，别骗我了",
        "你能不能真诚一点啊？",
      ],
      [
        "嗯...我在听啊，继续说吧",
        "你的意思是...？",
        "这样啊，那你呢？",
        "听起来不错，但我总感觉有点不对劲",
        "你真的是这么想的吗？",
        "我需要更多证明啊",
        "说得漂亮，但行动呢？",
        "你觉得我会相信吗？",
      ],
      [
        "又来这套？我都听过多少遍了！",
        "你知道吗，你这样真的让我很累。",
        "我受够你的借口了！",
        "你能不能有点新意啊？",
        "每次都这样，你有想过我的感受吗？",
        "我在这里等你，你呢？",
        "你说的全是废话！",
        "我没工夫听你编故事。",
      ]
    ]
  };

  const portraitVersions = [
    {
      id: 1,
      title: '戏精投胎转世大师',
      description: '你这张脸啊，比手机壳换得还勤快。我怀疑你根本没有真实面目，你就是一堆滤镜拼起来的。',
    },
    {
      id: 2,
      title: '表演欲爆棚选手',
      description: '你的嘴巴占脸80%，声音却这么虚。你是不是把所有真心都用来演戏了？真心股票已经跌停。',
    },
    {
      id: 3,
      title: '虚实混淆大师',
      description: '既真诚又虚伪，既在场又缺席。你自己都搞清楚你是谁了吗？薛定谔都替你着急。',
    },
    {
      id: 4,
      title: '虚实兼备平衡家',
      description: '活得真均衡啊，50分真诚50分表演。但你是真在平衡，还是根本没立场？完美到有点可疑。',
    },
    {
      id: 5,
      title: '真诚漏风侠',
      description: '你是真诚，但真诚到了让人难受的程度。你不是在倾诉，你是在进行情感暴力。有时候保留一点，反而更尊重人。',
    },
    {
      id: 6,
      title: '直肠子大实话家',
      description: '你的人啊，我最怕。真话就像刀，太锋利了，扎人不带血的。求求你，偶尔留点情面吧。',
    },
    {
      id: 7,
      title: '真诚到发光的人',
      description: '你真诚到有点可怕，像个行走的谎言检测仪。所有不诚实的人都想躲得远远的。往死里较真吧，我看好你。',
    },
    {
      id: 8,
      title: '世界上最最最真诚的大好人',
      description: '你人设立得最完美。越完美的人，越值得怀疑。不对，我信你。（真的吗？）',
    }
  ];

  const analyzeWithClaude = async (text) => {
    try {
      setIsAnalyzing(true);
      const response = await fetch(`${API_BASE}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? '分析失败');
      setIsAnalyzing(false);
      return {
        performance: data.performance,
        authenticity: data.authenticity,
        fromAPI: data.source === 'claude',
      };
    } catch (error) {
      console.error('API分析失败:', error);
    }
    setIsAnalyzing(false);
    return null;
  };

  const calculateSingleScoreKeyword = (text) => {
    let performanceScore = 0;
    let authenticityScore = 0;
    Object.keys(vocabularyData.performance).forEach(category => {
      const words = vocabularyData.performance[category].words;
      words.forEach(word => {
        if (text.includes(word)) {
          performanceScore += 1;
        }
      });
    });
    Object.keys(vocabularyData.authenticity).forEach(category => {
      const words = vocabularyData.authenticity[category].words;
      words.forEach(word => {
        if (text.includes(word)) {
          authenticityScore += 1;
        }
      });
    });
    const total = performanceScore + authenticityScore;
    let performance, authenticity;
    if (total === 0) {
      performance = 50;
      authenticity = 50;
    } else {
      performance = Math.round((performanceScore / total) * 100);
      authenticity = Math.round((authenticityScore / total) * 100);
    }
    return {
      performance,
      authenticity,
      fromAPI: false
    };
  };

  const calculateSingleScore = async (text) => {
    if (hasCoquettishTone(text)) {
      setIsAnalyzing(false);
      return {
        performance: 80,
        authenticity: 20,
        fromAPI: false,
        hasCoquettish: true
      };
    }
    let apiScore = await analyzeWithClaude(text);
    let score;
    if (apiScore) {
      score = apiScore;
    } else {
      score = calculateSingleScoreKeyword(text);
    }
    return score;
  };

  const applyOppositionLogic = (score) => {
    const isPerfDominant = score.performance > score.authenticity;
    if (isPerfDominant) {
      return {
        performance: 15,
        authenticity: -10,
        label: '🎭'
      };
    } else {
      return {
        performance: -10,
        authenticity: 15,
        label: '❤️'
      };
    }
  };

  const getGirlfriendReply = (messageIndex, score) => {
    const replies = girlfriendReplies.afterMessage;
    const index = messageIndex % replies[1].length;
    let replyCategory;
    if (score.performance > score.authenticity + 10) {
      replyCategory = 0;
    } else if (score.authenticity > score.performance + 10) {
      replyCategory = 2;
    } else {
      replyCategory = 1;
    }
    return replies[replyCategory][index];
  };

  const getStartMessage = () => {
    return girlfriendReplies.start[Math.floor(Math.random() * girlfriendReplies.start.length)];
  };

  useEffect(() => {
    if (conversations.length === 0) {
      const randomBg = Math.floor(Math.random() * 9) + 1;
      setBackgroundImage(`/background/${randomBg}.jpg`);
      setBoyAvatar(getRandomAvatar('boy'));
      setGirlAvatar(getRandomAvatar('girl'));
      setConversations([{ type: 'girlfriend', text: getStartMessage(), id: 0 }]);
      setCumulativeScores({ performance: 50, authenticity: 50 });
      setTotalMessages(0);
    }
  }, []);

  const handleSubmit = async () => {
    if (!userInput.trim() || finished || isAnalyzing) return;
    const apiScore = await calculateSingleScore(userInput);
    if (!apiScore) {
      alert('分析失败，请重试');
      return;
    }
    const opposition = applyOppositionLogic(apiScore);
    const newCumulativeScores = {
      performance: Math.max(Math.min(cumulativeScores.performance + opposition.performance, 100), 0),
      authenticity: Math.max(Math.min(cumulativeScores.authenticity + opposition.authenticity, 100), 0)
    };
    setCumulativeScores(newCumulativeScores);
    setTotalMessages(totalMessages + 1);
    const userMessage = {
      type: 'user',
      text: userInput,
      id: conversations.length,
      singleScore: opposition,
      displayScore: apiScore,
      cumulativeScores: newCumulativeScores
    };
    const girlfriendMessage = {
      type: 'girlfriend',
      text: getGirlfriendReply(totalMessages, apiScore),
      id: conversations.length + 1
    };
    setConversations([...conversations, userMessage, girlfriendMessage]);
    setUserInput('');
  };

  const handleFinish = async () => {
    let selectedVersion = portraitVersions[3];
    const perf = cumulativeScores.performance;
    const auth = cumulativeScores.authenticity;
    if (perf >= 75 && auth <= 30) {
      selectedVersion = portraitVersions[0];
    } else if (perf >= 70 && auth <= 35) {
      selectedVersion = portraitVersions[1];
    } else if (perf >= 60 && auth <= 40) {
      selectedVersion = portraitVersions[2];
    } else if (perf >= 45 && perf <= 55 && auth >= 45 && auth <= 55) {
      selectedVersion = portraitVersions[3];
    } else if (perf >= 40 && auth >= 65) {
      selectedVersion = portraitVersions[4];
    } else if (perf <= 35 && auth >= 70) {
      selectedVersion = portraitVersions[5];
    } else if (perf <= 25 && auth >= 80) {
      selectedVersion = portraitVersions[6];
    } else if (perf <= 20 && auth >= 85) {
      selectedVersion = portraitVersions[7];
    } else {
      if (perf > auth) {
        selectedVersion = portraitVersions[2];
      } else if (auth > perf) {
        selectedVersion = portraitVersions[5];
      }
    }
    setFinalEvaluation({
      ...selectedVersion,
      finalPerf: perf,
      finalAuth: auth,
      diff: perf - auth
    });
    setFinished(true);

    // 保存诊断结果到数据库（静默，失败不影响用户体验）
    fetch(`${API_BASE}/api/diagnosis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: SESSION_ID,
        finalPerformance: perf,
        finalAuthenticity: auth,
        diagnosisTitle: selectedVersion.title,
        totalMessages,
      }),
    }).catch(() => {});
  };

  const handleReset = () => {
    setCumulativeScores({ performance: 50, authenticity: 50 });
    setTotalMessages(0);
    setConversations([{ type: 'girlfriend', text: getStartMessage(), id: 0 }]);
    setFinished(false);
    setFinalEvaluation(null);
    setUserInput('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations]);

  return (
    <div className="scumbag-analyzer" style={{
      backgroundImage: backgroundImage ? `url('${backgroundImage}')` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <div className="background-overlay" />
      <div className="wechat-header">
        <div className="header-title">
          <h2>💬 双维诊断仪</h2>
          <p>她想听听你的故事</p>
        </div>
      </div>
      {!finished ? (
        <div className="chat-page">
          <div className="chat-header">
            <h3>对话中...</h3>
            <p>表演: {Math.round(cumulativeScores.performance)}% | 真诚: {Math.round(cumulativeScores.authenticity)}%</p>
          </div>
          <div className="messages-container">
            {conversations.map((conv, idx) => (
              <div key={conv.id} className={`message-group ${conv.type}`}>
                {conv.type === 'girlfriend' && girlAvatar && (
                  <img src={girlAvatar} alt="girl" className="avatar-image" />
                )}
                <div className="message-bubble">
                  <p className="message-text">{conv.text}</p>
                  {conv.singleScore && (
                    <div className="score-display">
                      <span className="score-badge" style={{background: conv.singleScore.performance > 0 ? '#c9a9a0' : '#8a9b7a'}}>
                        {conv.singleScore.label} {conv.singleScore.performance > 0 ? `表演 +${conv.singleScore.performance}%` : `真诚 +${conv.singleScore.authenticity}%`}
                      </span>
                    </div>
                  )}
                </div>
                {conv.type === 'user' && boyAvatar && (
                  <img src={boyAvatar} alt="boy" className="avatar-image" />
                )}
              </div>
            ))}
            {isAnalyzing && (
              <div style={{textAlign: 'center', padding: '12px', color: '#a89a8f', fontSize: '12px'}}>
                Claude正在深度分析中...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="input-box">
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="跟她说点什么吧..."
              disabled={isAnalyzing}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !isAnalyzing) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
            <button onClick={handleSubmit} className="send-btn" disabled={isAnalyzing}>
              {isAnalyzing ? '分析中...' : '发送'}
            </button>
          </div>
          <div style={{padding: '12px 20px', textAlign: 'center', background: 'rgba(250, 248, 246, 0.95)'}}>
            <button onClick={handleFinish} style={{
              padding: '10px 24px',
              background: '#8a9b7a',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.3s'
            }} onMouseEnter={(e) => e.target.style.background = 'rgba(138, 155, 122, 0.85)'} onMouseLeave={(e) => e.target.style.background = '#8a9b7a'}>
              结束诊断
            </button>
          </div>
        </div>
      ) : (
        <div className="chat-page">
          <div style={{flex: 1, overflowY: 'auto', padding: '20px', textAlign: 'center'}}>
            {finalEvaluation && (
              <div style={{animation: 'slideIn 0.5s ease-out', maxWidth: '480px', margin: '0 auto'}}>
                <div style={{textAlign: 'center', marginBottom: '2.5rem'}}>
                  <div style={{fontSize: '100px', lineHeight: '1', marginBottom: '1rem'}}>
                    {portraits[finalEvaluation.id - 1]()}
                  </div>
                </div>
                <div style={{
                  marginBottom: '2rem',
                  padding: '1.25rem 1.5rem',
                  background: 'rgba(255, 255, 255, 0.92)',
                  borderRadius: '8px',
                  backdropFilter: 'blur(4px)',
                  border: '0.5px solid rgba(255, 255, 255, 0.5)'
                }}>
                  <h2 style={{
                    fontSize: '26px',
                    fontWeight: '400',
                    color: '#5a5550',
                    margin: '0',
                    fontFamily: 'Playfair Display, serif',
                    letterSpacing: '0.5px'
                  }}>
                    {finalEvaluation.title}
                  </h2>
                </div>
                <div style={{
                  marginBottom: '2rem',
                  padding: '1rem 1.5rem',
                  background: 'rgba(255, 255, 255, 0.92)',
                  borderRadius: '8px',
                  backdropFilter: 'blur(4px)',
                  border: '0.5px solid rgba(255, 255, 255, 0.5)'
                }}>
                  <p style={{
                    fontSize: '14px',
                    color: '#5a5550',
                    margin: '0',
                    letterSpacing: '0.3px'
                  }}>
                    表演度 <span style={{fontWeight: '500'}}>{Math.round(finalEvaluation.finalPerf)}%</span> / 真诚度 <span style={{fontWeight: '500'}}>{Math.round(finalEvaluation.finalAuth)}%</span>
                  </p>
                </div>
                <div style={{
                  marginBottom: '2rem',
                  padding: '1.5rem',
                  background: 'rgba(255, 255, 255, 0.92)',
                  borderRadius: '8px',
                  backdropFilter: 'blur(4px)',
                  border: '0.5px solid rgba(255, 255, 255, 0.5)',
                  borderLeft: '3px solid #c9a9a0'
                }}>
                  <p style={{
                    fontSize: '15px',
                    lineHeight: '1.8',
                    color: '#5a5550',
                    margin: '0',
                    fontFamily: 'Lora, serif',
                    fontStyle: 'italic'
                  }}>
                    {finalEvaluation.description}
                  </p>
                </div>
                <div style={{
                  marginBottom: '2.5rem',
                  padding: '1.5rem',
                  background: 'rgba(255, 255, 255, 0.92)',
                  borderRadius: '8px',
                  backdropFilter: 'blur(4px)',
                  border: '0.5px solid rgba(255, 255, 255, 0.5)',
                  borderLeft: '3px solid #8a9b7a'
                }}>
                  <p style={{
                    fontSize: '13px',
                    lineHeight: '1.7',
                    color: '#5a5550',
                    margin: '0'
                  }}>
                    她说：「{finalEvaluation.finalPerf > finalEvaluation.finalAuth ? '我早就看穿你了，别在我面前演了。' : finalEvaluation.finalAuth > finalEvaluation.finalPerf ? '你这样的人啊，我最害怕，因为你太真诚了。' : '你啊，我还真看不透你呢。'}」
                  </p>
                </div>
                <div style={{textAlign: 'center'}}>
                  <button
                    onClick={handleReset}
                    style={{
                      padding: '12px 36px',
                      background: 'rgba(255, 255, 255, 0.92)',
                      color: '#5a5550',
                      border: '0.5px solid rgba(255, 255, 255, 0.5)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '400',
                      letterSpacing: '0.3px',
                      transition: 'all 0.2s',
                      backdropFilter: 'blur(4px)'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.98)'}
                    onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.92)'}
                  >
                    重新诊断
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeaDiagnosisChat;
