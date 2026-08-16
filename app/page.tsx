"use client";

import { useEffect, useMemo, useState } from "react";

type Resource = { label: string; url: string };
type Week = {
  week: number;
  phase: number;
  eyebrow: string;
  title: string;
  question: string;
  concepts: string[];
  build: string;
  proof: string;
  stress: string;
  resources: Resource[];
};

const phases = [
  { number: 1, range: "01—04", title: "身体与闭环", subtitle: "从状态、坐标到动力学与反馈控制", color: "#ff6a3d" },
  { number: 2, range: "05—08", title: "感知与系统", subtitle: "让传感、软件模块和动作计划接上", color: "#d6ff45" },
  { number: 3, range: "09—12", title: "从数据学习", subtitle: "强化学习、模仿学习与 sim-to-real", color: "#86a7ff" },
  { number: 4, range: "13—16", title: "通用策略与部署", subtitle: "VLA、分层智能、安全与毕业项目", color: "#d49bff" },
];

const weeks: Week[] = [
  {
    week: 1, phase: 1, eyebrow: "SYSTEM MAP", title: "先看见完整闭环", question: "Physical AI 到底比屏幕里的 AI 多了什么？",
    concepts: ["观察—状态—动作—环境", "频率、延迟与噪声", "高层推理 vs 低层控制"],
    build: "安装 Python 与 MuJoCo，运行一个现成机器人模型；画出它的传感、决策、执行和反馈路径。",
    proof: "一张系统图 + 90 秒口述：指出闭环中三个可能让 demo 失败的地方。",
    stress: "人为加入 100 ms 延迟或观测噪声，记录系统行为如何改变。",
    resources: [{ label: "MuJoCo 文档", url: "https://mujoco.readthedocs.io/en/stable/" }, { label: "NVIDIA: Physical AI", url: "https://developer.nvidia.com/blog/a-beginners-guide-to-simulating-and-testing-robots-with-ros-2-and-nvidia-isaac-sim/" }],
  },
  {
    week: 2, phase: 1, eyebrow: "GEOMETRY", title: "坐标、姿态与运动学", question: "机器人如何知道手在哪里，以及怎样到达目标？",
    concepts: ["坐标系与齐次变换", "正向／逆向运动学", "Jacobian 与奇异点"],
    build: "为一个 2D 两连杆机械臂实现正向运动学与数值逆解，并做一个可视化目标追踪。",
    proof: "随机生成 20 个可达目标，报告末端位置误差与失败案例。",
    stress: "把目标移到奇异位形附近，解释为什么求解会变得不稳定。",
    resources: [{ label: "Modern Robotics", url: "https://modernrobotics.northwestern.edu/nu-gm-book-resource/modern-robotics-a-free-course-and-book/" }],
  },
  {
    week: 3, phase: 1, eyebrow: "DYNAMICS + CONTROL", title: "让动作稳定发生", question: "有了目标姿态，为什么机器人仍会抖、倒或撞？",
    concepts: ["质量、惯量、接触", "PID 与反馈", "LQR／轨迹跟踪直觉"],
    build: "在 MuJoCo 中控制倒立摆：先用手调 PID，再实现或调用 LQR 做对照。",
    proof: "比较两种控制器的稳定时间、超调与扰动恢复，至少各跑 20 次。",
    stress: "改变杆长、质量和摩擦；找出控制器开始失效的边界。",
    resources: [{ label: "MIT Underactuated", url: "https://underactuated.mit.edu/" }, { label: "MuJoCo 控制示例", url: "https://mujoco.readthedocs.io/en/stable/python.html" }],
  },
  {
    week: 4, phase: 1, eyebrow: "STATE ESTIMATION", title: "从带噪信号推断状态", question: "传感器从不直接给出“真实世界”，该相信什么？",
    concepts: ["传感噪声与偏置", "滤波与状态估计", "置信度而非单点答案"],
    build: "融合带噪的位置和速度观测，为倒立摆构建一个简单互补滤波器或 Kalman Filter。",
    proof: "画出真值、原始观测和估计曲线；量化 RMSE 与延迟。",
    stress: "制造传感器漂移或短时掉线，让系统暴露错误的确定感。",
    resources: [{ label: "Underactuated: Estimation", url: "https://underactuated.mit.edu/state_estimation.html" }],
  },
  {
    week: 5, phase: 2, eyebrow: "VISION", title: "从像素得到空间", question: "看见物体与知道如何接触它，中间差了什么？",
    concepts: ["相机模型与标定", "RGB-D／点云", "检测、分割与 6D pose"],
    build: "用手机或网络摄像头完成相机标定，估计一个已知尺寸物体的位置。",
    proof: "在三种距离与两种光线下测误差；保存失败图像而不只展示最好结果。",
    stress: "加入遮挡、反光或低纹理背景，建立视觉失败分类表。",
    resources: [{ label: "OpenCV 标定", url: "https://docs.opencv.org/4.x/dc/dbb/tutorial_py_calibration.html" }],
  },
  {
    week: 6, phase: 2, eyebrow: "AFFORDANCE", title: "把视觉连接到动作", question: "为什么识别出“杯子”仍不足以完成抓取？",
    concepts: ["可供性与接触点", "抓取姿态", "碰撞与路径规划"],
    build: "在仿真中完成 pick-and-place：从物体 pose 生成预抓取、抓取、抬升和放置轨迹。",
    proof: "对 30 个随机物体位姿报告成功率，并标注规划失败和执行失败。",
    stress: "随机化物体尺寸、摩擦和起始位置，找出最敏感的参数。",
    resources: [{ label: "MoveIt 2 教程", url: "https://moveit.picknik.ai/main/doc/tutorials/tutorials.html" }, { label: "MuJoCo Menagerie", url: "https://github.com/google-deepmind/mujoco_menagerie" }],
  },
  {
    week: 7, phase: 2, eyebrow: "ROBOT SOFTWARE", title: "用 ROS 2 组织真实系统", question: "不同频率、不同故障模式的模块如何协作？",
    concepts: ["node／topic／service／action", "消息时间戳与 QoS", "记录、回放与诊断"],
    build: "建立三个节点：模拟相机发布观测、策略产生目标、控制器执行；用 rosbag 记录一次任务。",
    proof: "画出节点图，并从日志重放一次失败；能指出数据在哪个接口变坏。",
    stress: "让一个 topic 丢包或降频，验证系统是否能检测并安全停止。",
    resources: [{ label: "ROS 2 最新教程", url: "https://docs.ros.org/en/lyrical/Tutorials.html" }, { label: "ROS 2 接口选择", url: "https://docs.ros.org/en/jazzy/How-To-Guides/Topics-Services-Actions.html" }],
  },
  {
    week: 8, phase: 2, eyebrow: "MILESTONE 01", title: "闭环操作系统", question: "你的系统能否重复完成任务，而不是偶然成功？",
    concepts: ["端到端延迟", "成功检测", "恢复与安全停止"],
    build: "整合感知、规划和控制，完成一个带随机初始条件的仿真抓取或移动任务。",
    proof: "提交 50 次 rollout、成功率、延迟分布、五类失败和一段未剪辑演示。",
    stress: "设计三种分布外扰动；系统必须承认失败，而不是继续危险动作。",
    resources: [{ label: "ROS 2 rosbag", url: "https://docs.ros.org/en/lyrical/Tutorials/Beginner-CLI-Tools/Recording-And-Playing-Back-Data/Recording-And-Playing-Back-Data.html" }],
  },
  {
    week: 9, phase: 3, eyebrow: "REINFORCEMENT LEARNING", title: "让策略从试错中形成", question: "奖励函数怎样悄悄改变机器人学到的行为？",
    concepts: ["MDP／policy／return", "PPO 直觉", "reward hacking 与 sample efficiency"],
    build: "训练一个 CartPole 或 Panda Pick 策略；记录 reward 曲线、成功率和随机种子。",
    proof: "至少用 5 个随机种子评估；解释高 reward 是否真的等于好行为。",
    stress: "删除一个 reward 项或放大另一个，看策略如何钻空子。",
    resources: [{ label: "MuJoCo Playground", url: "https://github.com/google-deepmind/mujoco_playground" }, { label: "Berkeley CS285", url: "https://rail.eecs.berkeley.edu/deeprlcourse/" }],
  },
  {
    week: 10, phase: 3, eyebrow: "IMITATION LEARNING", title: "从人类示范学习", question: "为什么复制动作会在几秒后偏离训练分布？",
    concepts: ["behavior cloning", "covariate shift", "action chunking 与 diffusion policy"],
    build: "检查一个 LeRobot 数据集，训练或运行 ACT／SmolVLA 的小型基线；可先使用公开数据。",
    proof: "可视化 observation/action 时间序列，报告 train 与 held-out rollout 的差距。",
    stress: "从从未示范过的起始位置运行，记录误差如何累积。",
    resources: [{ label: "LeRobot 文档", url: "https://huggingface.co/docs/lerobot/index" }, { label: "LeRobot 数据集", url: "https://huggingface.co/docs/lerobot/lerobot-dataset-v3" }],
  },
  {
    week: 11, phase: 3, eyebrow: "SIM-TO-REAL", title: "训练不只适配一个世界", question: "仿真里的完美策略为什么到了现实就失灵？",
    concepts: ["reality gap", "domain randomization", "system identification"],
    build: "为控制或抓取环境随机化质量、摩擦、延迟、视觉和传感噪声，再训练或重评估。",
    proof: "制作 robustness matrix：每个扰动强度至少 20 次试验。",
    stress: "加入训练时没有覆盖的组合扰动，明确泛化边界。",
    resources: [{ label: "Isaac Lab", url: "https://developer.nvidia.com/isaac/lab" }, { label: "MuJoCo Playground", url: "https://playground.mujoco.org/" }],
  },
  {
    week: 12, phase: 3, eyebrow: "MILESTONE 02", title: "数据飞轮与恢复", question: "每一次失败能否成为下一轮能力增长的资产？",
    concepts: ["episode 级证据", "human intervention", "failure-driven data collection"],
    build: "做一个最小失败回放台：切出失败前片段、人工归因、加入恢复示范并重新评估。",
    proof: "用同一测试集比较修正前后；展示成功率之外的失败类型迁移。",
    stress: "检查是否只是记住旧失败；新增十个未见过的边界条件。",
    resources: [{ label: "LeRobot Human-in-the-loop", url: "https://huggingface.co/docs/lerobot/hilserl" }],
  },
  {
    week: 13, phase: 4, eyebrow: "ROBOT FOUNDATION MODELS", title: "读懂 VLA，而不是追缩写", question: "语言、视觉和连续动作如何进入同一个策略？",
    concepts: ["VLM + action expert", "action token／flow matching", "cross-embodiment data"],
    build: "拆解 π₀、SmolVLA 或 OpenVLA 的输入、动作表示、训练数据和控制频率；画出张量与时间流。",
    proof: "写一页 model card：能力、假设、评测协议、不可声称的结论。",
    stress: "找出论文 demo 无法回答的五个部署问题。",
    resources: [{ label: "π₀ 官方介绍", url: "https://www.physicalintelligence.company/blog/pi0" }, { label: "Open X-Embodiment", url: "https://robotics-transformer-x.github.io/" }, { label: "LeRobot Policies", url: "https://huggingface.co/docs/lerobot/index" }],
  },
  {
    week: 14, phase: 4, eyebrow: "ADAPT + EVALUATE", title: "评测一个通用策略", question: "“能做很多任务”应当怎样被证伪？",
    concepts: ["in-distribution／OOD", "task suite 与基线", "置信区间与可复现性"],
    build: "在 LIBERO 或 Meta-World 上运行预训练策略或轻量微调；建立固定评测脚本。",
    proof: "至少比较一个简单基线，并给出逐任务、逐种子结果与失败视频。",
    stress: "改写指令、换物体外观或增加长时序步骤，检查能力是否真实迁移。",
    resources: [{ label: "LeRobot LIBERO", url: "https://huggingface.co/docs/lerobot/main/libero" }, { label: "Isaac Lab Arena", url: "https://developer.nvidia.com/isaac/lab-arena" }],
  },
  {
    week: 15, phase: 4, eyebrow: "HIERARCHY + SAFETY", title: "把推理、策略和控制分层", question: "模型出错时，哪一层有权说“不”？",
    concepts: ["任务规划—skill policy—controller", "success detector", "约束、监督与 fallback"],
    build: "实现一个分层代理：高层拆任务，技能层执行，安全层检查工作空间、速度和超时。",
    proof: "展示正常、可恢复和必须停止三类路径；日志能解释是谁做了决定。",
    stress: "向高层输入含糊或危险指令，证明低层边界不会被语言绕过。",
    resources: [{ label: "Gemini Robotics-ER", url: "https://deepmind.google/blog/gemini-robotics-er-1-6/" }, { label: "ROS 2 Safety WG", url: "https://github.com/ros-safety/safety_working_group" }],
  },
  {
    week: 16, phase: 4, eyebrow: "CAPSTONE", title: "用证据毕业", question: "你构建的是一个 demo，还是一个可检验的系统？",
    concepts: ["baseline", "可靠性与边界", "可复现交付"],
    build: "完成毕业项目：闭环仿真任务、学习策略、扰动测试、失败恢复和安全停止。",
    proof: "代码 + 环境锁定 + 100 次评测 + 未剪辑视频 + 两页技术报告 + 失败数据集。",
    stress: "请另一人只按 README 复现；任何隐藏人工介入必须显式记录。",
    resources: [{ label: "LeRobot 真实机器人路径", url: "https://huggingface.co/docs/lerobot/main/getting_started_real_world_robot" }],
  },
];

const coreResources = [
  { tag: "FOUNDATION", title: "Modern Robotics", note: "坐标、运动学、动力学、规划与控制的完整骨架。", url: "https://modernrobotics.northwestern.edu/nu-gm-book-resource/modern-robotics-a-free-course-and-book/" },
  { tag: "CONTROL", title: "MIT Underactuated Robotics", note: "用摆、腿式机器人与接触理解非线性动力学和控制。", url: "https://underactuated.mit.edu/" },
  { tag: "SIM", title: "MuJoCo", note: "轻量、跨平台；macOS 主线仿真器。", url: "https://mujoco.readthedocs.io/en/stable/" },
  { tag: "SYSTEM", title: "ROS 2", note: "理解机器人模块如何通信、记录、诊断和部署。", url: "https://docs.ros.org/en/lyrical/Tutorials.html" },
  { tag: "LEARNING", title: "LeRobot", note: "数据、模仿学习、RL、VLA 与真实机器人工作流。", url: "https://huggingface.co/docs/lerobot/index" },
  { tag: "GPU TRACK", title: "Isaac Lab", note: "需要 NVIDIA Linux／云端时，用于并行训练与高保真评测。", url: "https://isaac-sim.github.io/IsaacLab/develop/source/setup/quickstart.html" },
];

const projectOptions = [
  { index: "A", title: "操作：会恢复的 Pick-and-Place", fit: "最短反馈回路", brief: "视觉或状态输入 → 抓取策略 → 成功检测 → 失败恢复。", metric: "100 次随机测试；成功率、恢复率、碰撞率、p95 延迟。" },
  { index: "B", title: "人形：受扰动的平衡／行走", fit: "偏动力学与控制", brief: "仿真人形在质量、摩擦和外力变化下维持或恢复步态。", metric: "跌倒率、速度跟踪误差、能耗、未见扰动鲁棒性。" },
  { index: "C", title: "触觉：滑移检测与抓力闭环", fit: "偏传感与电子皮肤", brief: "触觉／力信号质量估计 → 滑移检测 → 自适应抓力。", metric: "掉落率、误报率、响应时间、跨物体泛化。" },
];

function padWeek(value: number) { return String(value).padStart(2, "0"); }

export default function Home() {
  const [activePhase, setActivePhase] = useState(0);
  const [openWeek, setOpenWeek] = useState(1);
  const [completed, setCompleted] = useState<number[]>([]);
  const [hours, setHours] = useState(8);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      const saved = window.localStorage.getItem("physical-ai-progress-v1");
      if (saved) {
        try { setCompleted(JSON.parse(saved)); } catch { /* ignore invalid local data */ }
      }
      setLoaded(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (loaded) window.localStorage.setItem("physical-ai-progress-v1", JSON.stringify(completed));
  }, [completed, loaded]);

  const visibleWeeks = activePhase === 0 ? weeks : weeks.filter((item) => item.phase === activePhase);
  const progress = Math.round((completed.length / weeks.length) * 100);
  const nextWeek = weeks.find((item) => !completed.includes(item.week)) ?? weeks[weeks.length - 1];
  const allocation = useMemo(() => ({ map: Math.max(0.5, hours * 0.12), build: hours * 0.5, test: hours * 0.25, log: hours * 0.13 }), [hours]);

  const toggleComplete = (week: number) => {
    setCompleted((current) => current.includes(week) ? current.filter((item) => item !== week) : [...current, week].sort((a, b) => a - b));
  };

  return (
    <main>
      <nav className="topbar" aria-label="课程导航">
        <a className="brand" href="#top"><span className="brand-mark">P·AI</span><span>PHYSICAL AI FIELD SCHOOL</span></a>
        <div className="nav-links"><a href="#map">能力地图</a><a href="#curriculum">16 周课程</a><a href="#capstone">毕业项目</a><a href="#resources">资源</a></div>
        <a className="nav-cta" href="#curriculum">开始学习 <span>↘</span></a>
      </nav>

      <section className="hero" id="top">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-copy">
          <p className="kicker">16 WEEKS · 8 HOURS / WEEK · SIMULATION FIRST</p>
          <h1>从“懂 AI”到<br /><em>让智能进入物理世界</em></h1>
          <p className="hero-deck">一套以作品和证据为中心的 Physical AI 学习计划。先在 Mac 上建立闭环，再进入机器人学习、VLA 与真实部署。</p>
          <div className="hero-actions">
            <a className="primary" href="#curriculum">查看本周任务 <span>↓</span></a>
            <a className="secondary" href="#rules">学习规则 <span>↗</span></a>
          </div>
          <div className="hero-stats">
            <div><strong>16</strong><span>周 / WEEKS</span></div><div><strong>03</strong><span>阶段作品</span></div><div><strong>100×</strong><span>毕业评测</span></div>
          </div>
        </div>
        <div className="hero-system" aria-label="Physical AI 闭环">
          <div className="loop-rail"><span>世界</span><i>01</i><span>感知</span><i>02</i><span>状态</span><i>03</i><span>策略</span><i>04</i><span>控制</span><i>05</i><span>身体</span></div>
          <div className="loop-core"><small>THE LEARNING OBJECT</small><strong>闭环</strong><p>不是模型分数，而是系统在扰动下仍能感知、行动、发现失败并恢复。</p><b>↻</b></div>
          <div className="signal signal-a" /><div className="signal signal-b" /><div className="signal signal-c" />
          <p className="hero-note"><span>课程原则</span>每学一个概念，必须立刻改变一次仿真、一次测量或一次决策。</p>
        </div>
      </section>

      <section className="definition section-shell" id="map">
        <div className="section-title split"><div><p className="eyebrow">00 / ORIENTATION</p><h2>Physical AI 是六层闭环，<br />不是“给机器人接一个 LLM”</h2></div><p>Physical AI 研究能在真实或仿真物理环境中持续感知、预测、决策和作用的智能体。身体、接触、延迟与失败代价都是问题本身。</p></div>
        <div className="six-layers">
          {["感知\nSENSE", "世界模型\nMODEL", "任务推理\nPLAN", "策略\nPOLICY", "控制\nCONTROL", "身体\nBODY"].map((item, index) => <div key={item}><span>0{index + 1}</span><strong>{item.split("\n")[0]}</strong><small>{item.split("\n")[1]}</small></div>)}
        </div>
        <div className="map-note"><strong>学习顺序为什么不是从 VLA 开始？</strong><p>如果不知道动作表示、控制频率、状态估计和接触如何工作，你无法判断一个基础模型究竟学会了什么，也无法解释它为何失败。</p></div>
      </section>

      <section className="rules" id="rules">
        <div className="section-shell">
          <div className="section-title split light"><div><p className="eyebrow">YOUR WEEKLY LOOP</p><h2>每周不追求“看完”，<br />追求留下可检查的证据</h2></div><p>默认每周 8 小时。时间更少时缩小实验，不跳过压力测试和复盘；时间更多时增加重复次数，而不是继续堆课程。</p></div>
          <div className="hours-lab">
            <div className="hours-control"><label htmlFor="hours">每周可投入时间</label><strong>{hours}<small>小时</small></strong><input id="hours" type="range" min="4" max="14" step="1" value={hours} onChange={(event) => setHours(Number(event.target.value))} /></div>
            <div className="allocation">
              <div style={{ "--share": "12%" } as React.CSSProperties}><span>01</span><strong>建立地图</strong><b>{allocation.map.toFixed(1)}h</b><small>读核心概念，先画结构</small></div>
              <div style={{ "--share": "50%" } as React.CSSProperties}><span>02</span><strong>动手构建</strong><b>{allocation.build.toFixed(1)}h</b><small>让代码或系统真的运行</small></div>
              <div style={{ "--share": "25%" } as React.CSSProperties}><span>03</span><strong>压力测试</strong><b>{allocation.test.toFixed(1)}h</b><small>改变条件，寻找失败边界</small></div>
              <div style={{ "--share": "13%" } as React.CSSProperties}><span>04</span><strong>解释与复盘</strong><b>{allocation.log.toFixed(1)}h</b><small>写判断、证据与下一步</small></div>
            </div>
          </div>
        </div>
      </section>

      <section className="curriculum section-shell" id="curriculum">
        <div className="curriculum-head">
          <div><p className="eyebrow">THE 16-WEEK PROGRAM</p><h2>从一个倒立摆，走到<br />可评测的 Physical AI 系统</h2></div>
          <div className="progress-card" aria-label={`课程进度 ${progress}%`}><div className="progress-ring" style={{ "--progress": `${progress * 3.6}deg` } as React.CSSProperties}><strong>{progress}%</strong></div><div><span>当前进度</span><b>{completed.length} / 16 周</b><small>下一步：W{padWeek(nextWeek.week)} · {nextWeek.title}</small></div></div>
        </div>

        <div className="phase-overview">
          {phases.map((phase) => <button key={phase.number} className={activePhase === phase.number ? "active" : ""} onClick={() => setActivePhase(activePhase === phase.number ? 0 : phase.number)} style={{ "--phase": phase.color } as React.CSSProperties}><span>PHASE 0{phase.number} / W{phase.range}</span><strong>{phase.title}</strong><small>{phase.subtitle}</small></button>)}
        </div>
        <div className="filter-row"><span>{activePhase === 0 ? "显示全部 16 周" : `仅显示阶段 0${activePhase}`}</span>{activePhase !== 0 && <button onClick={() => setActivePhase(0)}>清除筛选 ×</button>}</div>

        <div className="week-list">
          {visibleWeeks.map((item) => {
            const open = openWeek === item.week;
            const done = completed.includes(item.week);
            const phase = phases[item.phase - 1];
            return <article key={item.week} className={`week-row ${open ? "open" : ""} ${done ? "done" : ""}`} style={{ "--phase": phase.color } as React.CSSProperties}>
              <button className="week-summary" onClick={() => setOpenWeek(open ? 0 : item.week)} aria-expanded={open}>
                <span className="week-number">W{padWeek(item.week)}</span><span className="week-phase">P0{item.phase}</span><div><small>{item.eyebrow}</small><h3>{item.title}</h3><p>{item.question}</p></div><span className="week-proof">交付物<br /><b>{item.proof.split("；")[0]}</b></span><i>{open ? "−" : "+"}</i>
              </button>
              {open && <div className="week-body">
                <div className="week-concepts"><span>CORE CONCEPTS</span><ul>{item.concepts.map((concept) => <li key={concept}>{concept}</li>)}</ul></div>
                <div className="week-action"><span>BUILD / 动手</span><p>{item.build}</p></div>
                <div className="week-action"><span>PROOF / 证明</span><p>{item.proof}</p></div>
                <div className="week-action stress"><span>STRESS / 破坏</span><p>{item.stress}</p></div>
                <div className="week-footer"><div>{item.resources.map((resource) => <a key={resource.url} href={resource.url} target="_blank" rel="noreferrer">{resource.label} ↗</a>)}</div><button className={done ? "complete active" : "complete"} onClick={() => toggleComplete(item.week)}><span>{done ? "✓" : ""}</span>{done ? "已完成，有证据" : "标记完成"}</button></div>
              </div>}
            </article>;
          })}
        </div>
      </section>

      <section className="environment">
        <div className="section-shell environment-grid">
          <div><p className="eyebrow">MAC-FIRST SETUP</p><h2>先用现有电脑学习，<br />不要先买人形机器人</h2><p>MuJoCo 提供 Apple Silicon 原生构建，足够完成前 12 周的大部分核心实验。ROS 2 可在 Mac 尝试，但若依赖兼容性影响学习，使用 Ubuntu 虚拟机或远程 Linux。</p></div>
          <div className="stack-cards">
            <article><span>NOW / 本机</span><strong>Python · NumPy · PyTorch<br />MuJoCo · Jupyter · Git</strong><p>建立动力学、控制、感知和学习闭环。</p></article>
            <article><span>LATER / 云端或 Linux</span><strong>ROS 2 · Isaac Lab<br />CUDA · LIBERO</strong><p>需要 GPU 并行训练或更完整系统集成时再进入。</p></article>
            <article className="hardware"><span>OPTIONAL / 第 13 周以后</span><strong>SO-101 或自有传感器原型</strong><p>只有当毕业项目的问题已经清楚，硬件才是加速器。</p></article>
          </div>
        </div>
      </section>

      <section className="capstone section-shell" id="capstone">
        <div className="section-title split"><div><p className="eyebrow">CAPSTONE / CHOOSE ONE</p><h2>毕业不是“跑起来”，<br />而是知道它什么时候不工作</h2></div><p>三个方向都覆盖完整闭环。选择能最快获得真实反馈的一个，不需要同时证明自己会控制、视觉、VLA、硬件和机械设计。</p></div>
        <div className="project-grid">
          {projectOptions.map((project) => <article key={project.index}><div><span>{project.index}</span><small>{project.fit}</small></div><h3>{project.title}</h3><p>{project.brief}</p><footer><span>PASS METRIC</span><strong>{project.metric}</strong></footer></article>)}
        </div>
        <div className="graduation-rubric">
          <div><p className="eyebrow">GRADUATION GATE</p><h3>五项全部有证据，才算完成</h3></div>
          <ol><li><span>01</span>有一个可复现的简单基线</li><li><span>02</span>固定测试集上至少 100 次评测</li><li><span>03</span>至少三种未见扰动与失败分类</li><li><span>04</span>明确恢复、求助和安全停止边界</li><li><span>05</span>未剪辑视频、代码与两页报告</li></ol>
        </div>
      </section>

      <section className="resources" id="resources">
        <div className="section-shell"><div className="section-title split light"><div><p className="eyebrow">SOURCE LADDER</p><h2>少而硬的主线资料</h2></div><p>资料按需要打开。每周最多一个主资源、一个参考资源；遇到项目卡点再查文档，不把收藏当成学习。</p></div>
          <div className="resource-list">{coreResources.map((resource, index) => <a key={resource.url} href={resource.url} target="_blank" rel="noreferrer"><span>{padWeek(index + 1)}</span><div><small>{resource.tag}</small><strong>{resource.title}</strong><p>{resource.note}</p></div><i>↗</i></a>)}</div>
          <div className="source-note"><span>资料校准 · 2026.08</span><p>课程优先链接官方文档、大学课程与项目原始页面。Physical AI 工具链变化很快；开始对应周次时，再检查安装版本与硬件要求。</p></div>
        </div>
      </section>

      <footer className="site-footer"><div className="section-shell footer-grid"><div><span className="brand-mark">P·AI</span><b>PHYSICAL AI FIELD SCHOOL</b></div><p>不要问“我看完了吗？”<br />问：<strong>我能预测、构建、破坏并解释它吗？</strong></p><a href="#top">回到顶部 ↑</a></div></footer>
    </main>
  );
}
