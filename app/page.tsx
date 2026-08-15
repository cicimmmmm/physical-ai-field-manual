"use client";

import { useEffect, useMemo, useState } from "react";

type Layer = {
  id: string;
  index: string;
  title: string;
  en: string;
  question: string;
  detail: string;
  failure: string;
  opportunity: string;
  accent: string;
};

const layers: Layer[] = [
  {
    id: "sense",
    index: "01",
    title: "感知",
    en: "SENSE",
    question: "世界现在是什么状态？",
    detail: "相机、深度、触觉、力矩与本体感觉，把连续的物理世界压缩成可用状态。",
    failure: "看见杯子，却不知道是否握稳；皮肤电变高，却误判成“焦虑”。",
    opportunity: "传感融合、触觉皮肤、信号质量与不确定性接口。",
    accent: "#ff6b35",
  },
  {
    id: "model",
    index: "02",
    title: "世界模型",
    en: "MODEL",
    question: "如果我这样做，会发生什么？",
    detail: "理解空间、物体可供性与因果关系，并预测动作之后的状态。",
    failure: "语言上“懂”倒水，物理上却没预测杯口、重力和溢出。",
    opportunity: "场景数字孪生、成功检测、物理一致性评测。",
    accent: "#9a7cff",
  },
  {
    id: "plan",
    index: "03",
    title: "任务推理",
    en: "PLAN",
    question: "目标要拆成哪些步骤？",
    detail: "把“收拾桌面”拆成寻找、排序、抓取、放置与失败恢复。",
    failure: "单步动作漂亮，但一到长任务就忘记进度或无法重规划。",
    opportunity: "垂直任务编排、过程记忆、人类规则接入。",
    accent: "#39b9ae",
  },
  {
    id: "policy",
    index: "04",
    title: "策略",
    en: "POLICY",
    question: "下一小段动作是什么？",
    detail: "VLA 或模仿学习策略将视觉和语言映射为连续动作块。",
    failure: "训练分布内成功，换光线、物体或起始位置就漂移。",
    opportunity: "少样本后训练、跨本体适配、恢复数据闭环。",
    accent: "#e1b94f",
  },
  {
    id: "control",
    index: "05",
    title: "控制",
    en: "CONTROL",
    question: "如何稳定、安全地执行？",
    detail: "高频控制器把动作目标变成关节、速度、力矩与接触约束。",
    failure: "高层计划正确，低层延迟、抖动或碰撞仍会让任务失败。",
    opportunity: "边缘推理、控制中间件、安全边界与实时监控。",
    accent: "#5e9cff",
  },
  {
    id: "body",
    index: "06",
    title: "身体",
    en: "BODY",
    question: "什么形态最适合这项任务？",
    detail: "身体不是模型外壳；尺寸、顺应性、末端执行器会决定可学习的动作空间。",
    failure: "先迷恋人形，再寻找任务；最终为昂贵自由度买单。",
    opportunity: "软体末端、可穿戴反馈、任务专用形态与改装套件。",
    accent: "#ec6f91",
  },
];

const schedule = [
  ["00–05", "先破除一个误解", "具身智能 ≠ 人形机器人；它是智能通过身体与环境形成闭环。"],
  ["05–18", "读懂六层系统", "点击下方认知地图，能用自己的话解释每一层。"],
  ["18–30", "理解它怎么学", "示范、仿真、网络视频与在线纠错如何形成数据飞轮。"],
  ["30–42", "看懂当前浪潮", "从传统模块化到 VLA，再到更务实的分层系统。"],
  ["42–55", "寻找创业楔子", "从真实失败与付费者出发，不从“我要做人形”出发。"],
  ["55–60", "写下你的判断", "生成一句创业假设，以及一个 30 天证伪实验。"],
];

const opportunities = [
  {
    rank: "01",
    score: "9.2",
    title: "机器人皮肤的数据与可信度层",
    tag: "最像你",
    thesis: "让机器人不只“碰到”，还知道这次触觉是否可信、是否需要人确认。",
    fit: "你已有电子皮肤、EDA/PPG/IMU、多模态与不确定性表达经验。关键迁移不是“识别情绪”，而是做个人/设备基线、运动伪影过滤与置信度。",
    buyer: "灵巧手团队、康复/护理机器人、可穿戴交互实验室",
    wedge: "先做一个夹爪贴片 + 数据质量 SDK：区分滑移、稳定接触、传感器漂移。",
    kill: "若 4 周内不能比单一力传感器显著减少掉落或误报，就停止。",
    tone: "orange",
  },
  {
    rank: "02",
    score: "8.6",
    title: "失败回放与恢复评测场",
    tag: "软件先行",
    thesis: "给小型机器人团队一套“每次失败都变成下一轮训练资产”的工具。",
    fit: "你做 local-first personal intelligence 时强调来源、诊断与可审计；这里正好迁移为 episode 级证据链。",
    buyer: "用 LeRobot / ALOHA / Unitree 做 PoC 的实验室与创业公司",
    wedge: "导入 100 条 rollout，自动切出失败前 10 秒、人工归因、生成恢复数据集。",
    kill: "若工程师每周失败复盘少于 2 小时，或现有日志已足够，就不成立。",
    tone: "purple",
  },
  {
    rank: "03",
    score: "8.0",
    title: "人类介入数据 OS",
    tag: "数据飞轮",
    thesis: "把“操作员救了一次机器人”自动变成高价值纠错训练样本。",
    fit: "你关心闭环反馈；介入不是失败后的客服，而是模型最缺的边界数据。",
    buyer: "仓储、清洁、巡检等已有小规模机器人 fleet 的运营商",
    wedge: "只做一种任务：远程接管、前后状态标注、恢复动作回灌与成功率看板。",
    kill: "若人工介入事件太少，或无法取得轨迹/视频权限，数据护城河不会形成。",
    tone: "teal",
  },
  {
    rank: "04",
    score: "7.4",
    title: "贴身具身交互原型工作室",
    tag: "材料差异化",
    thesis: "不是再做一块屏幕，而是让材料本身感知、形变并给出低刺激反馈。",
    fit: "连接 SkinPaper、湿度响应结构、电子皮肤与触觉反馈；这是你独特的物理—数字交叉点。",
    buyer: "康复机构、表演/时尚科技、HCI 研究团队",
    wedge: "30×30 cm 可拆卸模块：一种输入、一个可见形变、一个可量化结果。",
    kill: "若舒适度、耐久或反应时间不优于普通振动/屏幕，比较优势不存在。",
    tone: "blue",
  },
];

const sources = [
  ["Google DeepMind", "Gemini Robotics-ER 1.6：高层空间推理、规划与成功检测", "https://deepmind.google/blog/gemini-robotics-er-1-6/"],
  ["Physical Intelligence", "π₀：VLM + action expert 的通用机器人策略", "https://www.physicalintelligence.company/blog/pi0"],
  ["Open X-Embodiment", "跨机器人数据与 RT-X 模型", "https://robotics-transformer-x.github.io/"],
  ["NVIDIA Isaac GR00T", "开放模型、数据、仿真与部署参考栈", "https://developer.nvidia.com/isaac/gr00t"],
  ["Hugging Face LeRobot", "从采集数据、训练策略到真实机器人部署", "https://huggingface.co/docs/lerobot/index"],
  ["MuJoCo Playground", "GPU 加速机器人学习与 sim-to-real", "https://github.com/google-deepmind/mujoco_playground"],
  ["IFR 2025", "服务机器人：专业场景、RaaS 与垂直市场证据", "https://ifr.org/news/service-robots-see-global-growth-boom/1st-quarterly-newsletter-2009"],
];

function formatTime(total: number) {
  const mins = Math.floor(total / 60).toString().padStart(2, "0");
  const secs = (total % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

export default function Home() {
  const [activeLayer, setActiveLayer] = useState(0);
  const [seconds, setSeconds] = useState(3600);
  const [running, setRunning] = useState(false);
  const [openOpportunity, setOpenOpportunity] = useState(0);
  const [customer, setCustomer] = useState("灵巧手团队");
  const [pain, setPain] = useState("触觉信号不可信");
  const [asset, setAsset] = useState("失败与恢复数据");

  useEffect(() => {
    if (!running || seconds <= 0) return;
    const id = window.setInterval(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearInterval(id);
  }, [running, seconds]);

  const progress = useMemo(() => ((3600 - seconds) / 3600) * 100, [seconds]);
  const layer = layers[activeLayer];

  const restartTimer = () => {
    setSeconds(3600);
    setRunning(false);
  };

  return (
    <main>
      <nav className="topbar" aria-label="页面导航">
        <a className="brand" href="#top" aria-label="返回顶部">
          <span className="brand-mark">E·01</span>
          <span>具身智能 / 一小时地图</span>
        </a>
        <div className="nav-links">
          <a href="#map">系统</a>
          <a href="#learn">学习</a>
          <a href="#opportunity">创业</a>
          <a href="#sources">资料</a>
        </div>
        <div className="timer" aria-label={`学习计时器 ${formatTime(seconds)}`}>
          <span className="timer-ring" style={{ "--progress": `${progress * 3.6}deg` } as React.CSSProperties} />
          <span className="timer-value">{formatTime(seconds)}</span>
          <button onClick={() => setRunning((value) => !value)}>{running ? "暂停" : seconds < 3600 ? "继续" : "开始"}</button>
          {seconds < 3600 && <button className="reset" onClick={restartTimer} aria-label="重置计时器">↺</button>}
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-copy">
          <p className="kicker"><span>PERSONAL FIELD GUIDE</span> · 为物理—数字创作者定制</p>
          <h1>一小时，建立你的<br /><em>具身智能</em>全景地图</h1>
          <p className="hero-deck">不从公司名单开始，也不把它等同于人形机器人。<br />先看懂一个智能体如何在真实世界里形成闭环。</p>
          <div className="hero-actions">
            <button className="primary" onClick={() => { setRunning(true); document.getElementById("route")?.scrollIntoView({ behavior: "smooth" }); }}>
              开始 60 分钟 <span>↓</span>
            </button>
            <a className="secondary" href="#opportunity">直接看创业地图 <span>↗</span></a>
          </div>
        </div>
        <div className="hero-system" aria-label="具身智能闭环示意图">
          <div className="orbit orbit-a" />
          <div className="orbit orbit-b" />
          <div className="system-core">
            <span className="core-pulse" />
            <strong>闭环</strong>
            <small>PERCEIVE · ACT · LEARN</small>
          </div>
          {layers.map((item, index) => (
            <button
              key={item.id}
              className={`orbit-node node-${index + 1}`}
              onClick={() => { setActiveLayer(index); document.getElementById("map")?.scrollIntoView({ behavior: "smooth" }); }}
              style={{ "--node-color": item.accent } as React.CSSProperties}
              aria-label={`查看${item.title}`}
            >
              <span>{item.index}</span>{item.title}
            </button>
          ))}
          <p className="hero-note"><span>关键判断</span> 价值不在“像人”，而在能否稳定完成有价值的现实任务。</p>
        </div>
      </section>

      <section className="route section-shell" id="route">
        <div className="section-heading compact">
          <p className="eyebrow">YOUR 60-MINUTE ROUTE</p>
          <h2>这一小时，你只需要带走三件事</h2>
        </div>
        <div className="three-takeaways">
          <article><span>01</span><h3>一张系统地图</h3><p>知道模型、数据、控制与身体分别解决什么。</p></article>
          <article><span>02</span><h3>一个反炒作滤镜</h3><p>区分漂亮 demo、可重复能力与可部署产品。</p></article>
          <article><span>03</span><h3>一个可证伪机会</h3><p>从你的材料与感知经验出发，设计 30 天实验。</p></article>
        </div>
        <div className="schedule" aria-label="一小时学习计划">
          {schedule.map(([time, title, text], index) => (
            <article key={time}>
              <div className="schedule-time"><span>{time}</span><small>MIN</small></div>
              <div className="schedule-line"><span style={{ width: `${(index + 1) * 16.6}%` }} /></div>
              <h3>{title}</h3><p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="map-section" id="map">
        <div className="section-shell">
          <div className="section-heading split">
            <div><p className="eyebrow">01 / THE SYSTEM</p><h2>从像素到力矩：六层系统</h2></div>
            <p>点击一层，看它负责的问题、最常见的失败，以及创业价值从哪里冒出来。</p>
          </div>
          <div className="layer-tabs" role="tablist" aria-label="具身智能系统层">
            {layers.map((item, index) => (
              <button
                key={item.id}
                className={activeLayer === index ? "active" : ""}
                onClick={() => setActiveLayer(index)}
                role="tab"
                aria-selected={activeLayer === index}
                style={{ "--layer-accent": item.accent } as React.CSSProperties}
              >
                <span>{item.index}</span>
                <b>{item.title}</b>
                <small>{item.en}</small>
              </button>
            ))}
          </div>
          <div className="layer-detail" style={{ "--layer-accent": layer.accent } as React.CSSProperties}>
            <div className="detail-main">
              <p className="detail-index">LAYER {layer.index}</p>
              <h3>{layer.question}</h3>
              <p>{layer.detail}</p>
            </div>
            <div className="detail-card failure"><span>FAILURE / 失败</span><p>{layer.failure}</p></div>
            <div className="detail-card chance"><span>VALUE / 机会</span><p>{layer.opportunity}</p></div>
          </div>
          <div className="loop-strip" aria-label="具身智能闭环">
            <span>环境</span><i>→</i><span>观察</span><i>→</i><span>内部状态</span><i>→</i><span>动作</span><i>→</i><span>新的环境</span><b>↺</b>
          </div>
        </div>
      </section>

      <section className="learn section-shell" id="learn">
        <div className="section-heading split">
          <div><p className="eyebrow">02 / HOW IT LEARNS</p><h2>模型不是“突然会了”<br />它吃的是交互轨迹</h2></div>
          <p>一条轨迹不是一张图片，而是连续的观察、动作、结果与纠错。机器人真正稀缺的是覆盖失败边界的高质量互动数据。</p>
        </div>
        <div className="data-flywheel">
          <div className="flywheel-center"><span>DATA</span><strong>数据飞轮</strong><small>更多部署 → 更多边界 → 更好策略</small></div>
          <article className="flywheel-card demo"><span>01</span><h3>人类示范</h3><p>遥操作记录“应该怎么做”。快，但贵，而且通常只有成功路径。</p><small>teleoperation · imitation</small></article>
          <article className="flywheel-card sim"><span>02</span><h3>仿真与合成</h3><p>低成本扩展姿态、场景与失败；难点是跨过 sim-to-real gap。</p><small>simulation · synthetic data</small></article>
          <article className="flywheel-card web"><span>03</span><h3>网络与跨本体数据</h3><p>迁移语义与动作先验，但不同身体的动作空间不能直接互换。</p><small>video · cross-embodiment</small></article>
          <article className="flywheel-card deploy"><span>04</span><h3>真实部署 + 人类介入</h3><p>最值钱的往往是“差点失败时，人如何救回来”的数据。</p><small>HIL · recovery · evaluation</small></article>
        </div>

        <div className="paradigm-block">
          <div className="paradigm-intro"><p className="eyebrow">THREE PARADIGMS</p><h2>今天不是“模块化 vs 端到端”二选一</h2><p>当前更有解释力的图景，是高层推理与低层策略各司其职，再让经典控制守住实时与安全边界。</p></div>
          <div className="paradigm-table" role="table" aria-label="三种机器人智能范式比较">
            <div className="table-row header" role="row"><span>范式</span><span>强项</span><span>软肋</span><span>适合</span></div>
            <div className="table-row" role="row"><strong>经典模块化</strong><span>可解释、可验证</span><span>规则脆、泛化弱</span><span>结构化工业环境</span></div>
            <div className="table-row featured" role="row"><strong>分层系统 <small>REALISTIC</small></strong><span>推理 + 灵巧 + 安全</span><span>接口与延迟复杂</span><span>近期真实部署</span></div>
            <div className="table-row" role="row"><strong>端到端 VLA</strong><span>数据驱动、可迁移</span><span>不可预测、数据饥渴</span><span>研究与高覆盖任务</span></div>
          </div>
        </div>
      </section>

      <section className="reality">
        <div className="section-shell reality-grid">
          <div className="reality-title"><p className="eyebrow">03 / ANTI-HYPE FILTER</p><h2>看 demo 时，<br />问这五个问题</h2><p>人形只是一个 embodiment。真正的商业门槛是：在真实分布里，谁为可靠结果付钱？</p></div>
          <ol className="reality-list">
            <li><span>01</span><div><h3>它是预录、遥操作，还是自主？</h3><p>先识别人的劳动藏在哪里。</p></div></li>
            <li><span>02</span><div><h3>成功率的分母是多少？</h3><p>十次最好的一次，和连续十次成功完全不同。</p></div></li>
            <li><span>03</span><div><h3>换物体、光线、场地还行吗？</h3><p>泛化边界比单次动作更重要。</p></div></li>
            <li><span>04</span><div><h3>失败后会停、会求助、还是会恢复？</h3><p>安全失败比假装万能更接近产品。</p></div></li>
            <li><span>05</span><div><h3>整套任务的单位经济成立吗？</h3><p>把人工接管、维护、停机与保险都算进去。</p></div></li>
          </ol>
        </div>
      </section>

      <section className="opportunity section-shell" id="opportunity">
        <div className="section-heading split opportunity-head">
          <div><p className="eyebrow">04 / YOUR OPPORTUNITY MAP</p><h2>你的优势不在造一台<br />“更像人”的机器人</h2></div>
          <div className="opportunity-principle"><span>创业原则</span><strong>从一个昂贵、反复发生的失败开始。</strong><p>形态以后再决定。先让一个具体任务的成功率、介入率或部署成本发生可测变化。</p></div>
        </div>

        <div className="opportunity-list">
          {opportunities.map((item, index) => (
            <article key={item.rank} className={`opportunity-item ${item.tone} ${openOpportunity === index ? "open" : ""}`}>
              <button onClick={() => setOpenOpportunity(openOpportunity === index ? -1 : index)} aria-expanded={openOpportunity === index}>
                <span className="opp-rank">{item.rank}</span>
                <div className="opp-name"><span>{item.tag}</span><h3>{item.title}</h3><p>{item.thesis}</p></div>
                <div className="opp-score"><small>与你的匹配</small><strong>{item.score}</strong><span>/ 10</span></div>
                <i>{openOpportunity === index ? "−" : "+"}</i>
              </button>
              <div className="opportunity-body">
                <div><span>WHY YOU / 为什么是你</span><p>{item.fit}</p></div>
                <div><span>FIRST BUYER / 谁付钱</span><p>{item.buyer}</p></div>
                <div><span>30-DAY WEDGE / 最小楔子</span><p>{item.wedge}</p></div>
                <div className="kill"><span>KILL TEST / 证伪线</span><p>{item.kill}</p></div>
              </div>
            </article>
          ))}
        </div>

        <div className="dont-build">
          <span className="dont-label">暂时不要做</span>
          <div><strong>通用人形本体</strong><p>资本与供应链密集，且你还没有独特任务数据。</p></div>
          <div><strong>又一个“通用机器人平台”</strong><p>没有首个垂直任务，平台只是未验证的抽象。</p></div>
          <div><strong>“识别人类情绪”的机器人</strong><p>身体信号不是情绪真值；先做个体基线与确认闭环。</p></div>
        </div>
      </section>

      <section className="thesis-lab">
        <div className="section-shell thesis-grid">
          <div><p className="eyebrow">05 / 5-MINUTE SYNTHESIS</p><h2>生成你的第一句<br />创业假设</h2><p>不是公司宣言。它必须把客户、反复失败和可积累资产锁在同一句里。</p></div>
          <div className="thesis-builder">
            <label>我先服务谁？
              <select value={customer} onChange={(e) => setCustomer(e.target.value)}>
                <option>灵巧手团队</option><option>护理机器人团队</option><option>仓储机器人运营商</option><option>可穿戴交互实验室</option>
              </select>
            </label>
            <label>他们反复遇到什么？
              <select value={pain} onChange={(e) => setPain(e.target.value)}>
                <option>触觉信号不可信</option><option>失败无法复现</option><option>人工接管成本高</option><option>穿戴反馈太打扰</option>
              </select>
            </label>
            <label>我会积累什么资产？
              <select value={asset} onChange={(e) => setAsset(e.target.value)}>
                <option>失败与恢复数据</option><option>个人/设备基线</option><option>真实场景评测集</option><option>材料响应数据</option>
              </select>
            </label>
            <div className="thesis-output">
              <span>YOUR THESIS</span>
              <p>我为<strong>{customer}</strong>解决<strong>{pain}</strong>，先用一个窄任务证明成功率提升，并持续积累别人难以复制的<strong>{asset}</strong>。</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sources section-shell" id="sources">
        <div className="section-heading split">
          <div><p className="eyebrow">PRIMARY SOURCES · UPDATED 2026.08</p><h2>继续学习，不追二手热词</h2></div>
          <p>这些入口覆盖当前主线：VLA、具身推理、跨本体数据、仿真、低成本真实机器人与行业部署。</p>
        </div>
        <div className="source-grid">
          {sources.map(([name, description, url], index) => (
            <a key={name} href={url} target="_blank" rel="noreferrer">
              <span>{String(index + 1).padStart(2, "0")}</span><div><strong>{name}</strong><p>{description}</p></div><i>↗</i>
            </a>
          ))}
        </div>
      </section>

      <footer>
        <div className="section-shell footer-grid">
          <div><span className="brand-mark">E·01</span><strong>Embodied Intelligence / Field Guide</strong></div>
          <p>最重要的一句：<br /><strong>智能不是“住在身体里的软件”，而是在感知—行动—反馈中长出来的能力。</strong></p>
          <a href="#top">回到顶部 ↑</a>
        </div>
      </footer>
    </main>
  );
}
