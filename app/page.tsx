"use client";

import { useMemo, useState } from "react";

type Section = { title: string; paragraphs: string[] };
type Term = { term: string; definition: string };
type Check = { question: string; answer: string };
type Chapter = {
  id: string;
  number: string;
  title: string;
  en: string;
  question: string;
  thesis: string;
  color: string;
  firstPrinciples: string[];
  sections: Section[];
  terms: Term[];
  equations?: { expression: string; meaning: string }[];
  worked: { title: string; setup: string; steps: string[]; conclusion: string };
  lab: { title: string; goal: string; steps: string[]; evidence: string };
  checks: Check[];
};

const chapters: Chapter[] = [
  {
    id: "map",
    number: "00",
    title: "全景地图",
    en: "THE FIELD",
    question: "Physical AI 究竟是什么？",
    thesis: "Physical AI 不是某一种模型，也不等于人形机器人。它是一个智能体通过身体持续感知环境、估计状态、选择动作、控制执行，并用结果修正下一次行为的闭环。",
    color: "#ff6a3d",
    firstPrinciples: ["世界随时间变化", "智能体只能获得不完整、带噪的观察", "动作会改变世界，也可能造成不可逆后果", "因此智能必须存在于持续反馈的闭环中"],
    sections: [
      { title: "从屏幕 AI 到物理 AI", paragraphs: ["语言模型面对的是离散 token；物理智能面对的是连续时间、空间、接触、摩擦、延迟和能量。一次错误回答可以重新生成，但一次过大的电机力矩可能损坏物体或伤人。", "因此，Physical AI 的能力不能只用‘回答是否正确’衡量。它还必须在限定时间内行动、知道观察是否可信、处理意外、检测失败，并在不确定时停下或求助。"] },
      { title: "六层不是六个独立盒子", paragraphs: ["感知把相机、触觉和关节读数变成观察；世界模型把观察变成对当前状态和未来结果的估计；任务推理把目标拆成阶段；策略选择下一段动作；控制器以高频率修正误差；身体最终与世界交换力和运动。", "真实系统通常是分层的：语言或视觉语言模型可能在 1–5 Hz 做任务推理，学习策略以 10–50 Hz 输出动作块，而电机控制器以数百到数千 Hz 保持稳定。高层聪明不能补偿低层失稳。"] },
      { title: "什么不属于充分证据", paragraphs: ["一次剪辑过的成功视频不能说明可靠性；仿真成功不能自动说明现实成功；识别出物体不能说明能稳定抓取；完成单步技能不能说明能执行长任务。", "判断系统时要问：成功率的分母是多少？是否存在遥操作？起始条件是否随机？遇到失败会怎样？系统边界在哪里？这些问题比‘模型多大’更接近真实能力。"] },
    ],
    terms: [
      { term: "Embodiment", definition: "智能所依附的身体形态及其传感、动作和物理限制。" },
      { term: "Closed loop", definition: "动作结果重新成为下一次决策输入的反馈过程。" },
      { term: "State", definition: "足以描述系统当前情况并预测后续变化的变量集合。" },
      { term: "Policy", definition: "把当前观察或状态映射为动作的规则或模型。" },
    ],
    equations: [
      { expression: "xₜ₊₁ = f(xₜ, uₜ, wₜ)", meaning: "世界状态 x 在动作 u 和外部扰动 w 下演化。" },
      { expression: "yₜ = h(xₜ, vₜ)", meaning: "传感器只能得到真实状态经过测量过程和噪声 v 后的观察 y。" },
      { expression: "uₜ = π(bₜ, g)", meaning: "策略 π 根据对世界的信念 b 和目标 g 选择动作。" },
    ],
    worked: {
      title: "贯穿案例：把桌上的橙色方块放进盒子",
      setup: "机器人看到桌面，接到自然语言目标，并拥有一个机械臂与夹爪。这个看似简单的任务会贯穿整份教材。",
      steps: ["感知：找到方块、盒子、桌面和机械臂自身。", "估计：推断三维位置、物体尺寸、夹爪是否已接触。", "计划：生成接近、抓取、抬升、移动、放置、撤离阶段。", "策略与控制：把阶段目标变成连续动作并实时修正。", "验证：确认方块真的进入盒子；若滑落则重新定位或求助。"],
      conclusion: "任务成功不是一个模型的功劳，而是六层闭环在同一时间轴上协作的结果。",
    },
    lab: {
      title: "画出你的第一个系统",
      goal: "选一个现实动作，例如开门、倒水或穿衣，把它拆成六层。",
      steps: ["写出可观察量与不可直接观察量。", "写出每个动作可能改变哪些状态。", "标出最快和最慢的两个反馈回路。", "列出三个必须安全停止的条件。"],
      evidence: "一张包含信息流、动作流、频率和失败出口的系统图。",
    },
    checks: [
      { question: "为什么给机械臂接入强大的 LLM，并不自动得到 Physical AI？", answer: "LLM 只可能解决部分语义理解和高层推理；它没有自动获得状态估计、实时控制、接触处理、安全约束与可靠的动作接口。" },
      { question: "闭环与一次性的输入→输出模型，最根本的差异是什么？", answer: "闭环会观察动作造成的后果并据此修正下一步；一次性模型假设输出之后问题就结束。" },
    ],
  },
  {
    id: "sense",
    number: "01",
    title: "感知",
    en: "SENSE",
    question: "机器人究竟‘看见’了什么？",
    thesis: "传感器不提供世界真相，只提供某种物理量经过采样、标定、噪声和延迟后的测量。感知的工作是把这些有限证据变成对任务有用、带置信度的观察。",
    color: "#d6ff45",
    firstPrinciples: ["物理状态不能被直接读取", "每种传感器只响应某些物理量", "测量存在噪声、偏置、饱和和延迟", "所以感知必须同时表达结果与可信度"],
    sections: [
      { title: "外感知与本体感知", paragraphs: ["相机、深度相机、激光雷达和麦克风观察外部环境，称为外感知。编码器、IMU、电流、关节力矩和触觉传感器观察机器人的身体与接触，称为本体感知。", "只依赖视觉，机器人可能看见夹爪碰到杯子，却不知道抓力是否足够；只依赖力矩，又可能知道发生接触，却不知道碰到的是杯子还是桌面。多模态的价值来自互补，不是简单堆叠。"] },
      { title: "标定：把读数变成共同语言", paragraphs: ["相机像素、机械臂基座和夹爪尖端分别生活在不同坐标系中。标定估计这些坐标系之间的变换，以及传感器读数和真实物理量之间的关系。", "如果相机到机械臂的外参偏了 8 mm，检测模型即使像素级完美，抓取点仍会系统性偏离。工程中，先检查标定和时间同步，往往比立刻换更大的模型有效。"] },
      { title: "采样与可观测性", paragraphs: ["采样频率决定系统能看到多快的变化。30 FPS 相机每 33 ms 才产生一帧；高速滑移可能在两帧之间已经发生。延迟还包括曝光、传输、推理和执行队列。", "可观测性问的是：仅凭现有测量，能否区分不同的内部状态？单张图片通常无法区分静止物体与朝相机移动的物体；需要时间信息、深度或额外传感器。"] },
    ],
    terms: [
      { term: "Calibration", definition: "估计传感器参数及不同坐标系之间变换的过程。" },
      { term: "Latency", definition: "物理事件发生到其测量可被系统使用之间的时间差。" },
      { term: "Bias", definition: "测量长期、系统性偏离真实值的误差。" },
      { term: "Observability", definition: "是否能通过一段时间的观测推断系统内部状态。" },
    ],
    equations: [
      { expression: "pᵦ = Tᵦ꜀ · p꜀", meaning: "把相机坐标系中的点 p꜀ 通过标定变换 T 转到机器人基座坐标系。" },
      { expression: "measurement = signal + bias + noise", meaning: "读数通常同时包含真实信号、系统偏置和随机噪声。" },
    ],
    worked: {
      title: "为什么检测到方块仍抓不到",
      setup: "视觉模型在图像中给出方块中心，置信度 0.98，但夹爪总是落在方块右侧。",
      steps: ["检查像素检测：框的位置稳定，说明语义检测大概率正常。", "检查深度：边缘处深度受桌面混合像素影响。", "检查外参：相机坐标到机械臂基座的变换存在固定偏差。", "重新标定并在多个桌面位置测量残差，而不是只测中心。"],
      conclusion: "高模型置信度只说明模型相信自己的图像判断，不代表整条几何链路准确。",
    },
    lab: {
      title: "手机相机测量实验",
      goal: "理解标定、距离和光线如何影响空间估计。",
      steps: ["打印棋盘格并用 OpenCV 完成内参标定。", "选择一个已知尺寸物体，在三个距离估计其尺寸或位置。", "改变光线、角度和背景，每种条件重复十次。", "分别计算随机波动和固定偏差。"],
      evidence: "一张误差表和三张失败图；说明你会优先修复模型、标定还是传感器。",
    },
    checks: [
      { question: "模型置信度 99% 为什么不等于抓取成功率 99%？", answer: "模型置信度只覆盖其定义的预测任务；标定、深度、时间同步、规划、控制和接触仍会引入独立误差。" },
      { question: "什么时候增加第二种传感器真正有价值？", answer: "当它提供第一种传感器无法观察或容易混淆的信息，并且二者能够正确标定与同步时。" },
    ],
  },
  {
    id: "model",
    number: "02",
    title: "状态与世界模型",
    en: "MODEL",
    question: "观察之后，机器人相信世界是什么样？",
    thesis: "世界模型不是一张完美地图，而是对当前状态、物体关系、动力学和不确定性的可更新信念。好的模型只保留完成任务所需的信息，并能预测动作的后果。",
    color: "#87a9ff",
    firstPrinciples: ["观察不完整且可能相互矛盾", "决策需要当前状态而非原始传感流", "动作选择需要预测后果", "因此系统维护会随证据更新的 belief state"],
    sections: [
      { title: "状态不是所有数据", paragraphs: ["状态是一组足以支持预测和决策的变量。控制倒立摆可能只需角度与角速度；抓杯子需要杯子姿态、夹爪姿态、接触状态和可能的液体约束。保存整段视频不等于拥有可用状态。", "状态选择体现任务假设。若把杯子当刚体，系统可能无法处理软杯；若忽略桌面摩擦，推物任务的预测会失真。世界模型永远是有边界的。"] },
      { title: "从观测到信念", paragraphs: ["状态估计把过去的预测和新的传感证据结合。Kalman Filter 的核心不是复杂公式，而是根据两边的不确定性决定更相信模型还是测量。", "当相机被遮挡时，系统可以短暂依靠运动模型预测物体位置，但不确定性应持续增大。若界面仍显示一个精确坐标，系统是在隐藏不知道，而不是真正知道。"] },
      { title: "几何、动力学与可供性", paragraphs: ["几何模型描述物体在哪里、形状怎样；动力学模型描述施加动作后如何运动；可供性描述某个物体在当前情境下允许什么动作，例如把手可抓、平面可放、按钮可按。", "现代 Physical AI 可能用神经网络隐式学习这些关系，但部署时仍需要可观察的成功条件与约束。‘模型内部懂了’不是可审计的接口。"] },
    ],
    terms: [
      { term: "Belief state", definition: "对可能状态及其不确定性的概率性表示。" },
      { term: "State estimation", definition: "结合模型、历史和测量推断当前状态。" },
      { term: "Dynamics model", definition: "预测状态在动作和扰动下如何演化的模型。" },
      { term: "Affordance", definition: "环境或物体在特定身体与任务下提供的行动可能性。" },
    ],
    equations: [
      { expression: "prediction → measurement update → new belief", meaning: "状态估计反复执行预测与证据校正。" },
      { expression: "K ↑ when sensor is trusted", meaning: "Kalman gain K 越大，更新时越依赖新测量；反之越依赖模型预测。" },
    ],
    worked: {
      title: "方块被手遮住之后在哪里",
      setup: "机器人接近方块时，夹爪遮挡了相机两帧。检测器暂时没有结果。",
      steps: ["上一时刻 belief 包含方块位置与不确定性。", "根据桌面静止假设，预测方块仍在原处。", "遮挡期间扩大位置不确定性，而不是删除物体。", "触觉检测接触后，把‘方块在夹爪内’作为新证据。", "重新看见方块时再次校正。"],
      conclusion: "世界模型让系统跨越短暂缺失，但必须诚实传播不确定性。",
    },
    lab: {
      title: "噪声中的倒立摆",
      goal: "比较原始观测、移动平均和状态估计对控制的影响。",
      steps: ["为摆角加入高斯噪声和固定偏置。", "分别使用原始值、移动平均和简单 Kalman Filter。", "比较 RMSE、相位延迟和控制稳定时间。", "让传感器短时掉线，观察估计置信度。"],
      evidence: "三条时间曲线；解释哪种方法数值更平滑、哪种方法对控制真正更好。",
    },
    checks: [
      { question: "为什么保存更多原始数据并不自动得到更好的世界模型？", answer: "决策需要结构化、任务相关且带时间一致性的状态；更多数据也可能增加噪声、延迟和冲突。" },
      { question: "一个物体暂时看不见时，正确做法是继续相信还是立即忘记？", answer: "都不是绝对答案。应根据动力学和历史继续预测，同时扩大不确定性，并在超过阈值后重新观测或停止。" },
    ],
  },
  {
    id: "plan",
    number: "03",
    title: "任务与运动规划",
    en: "PLAN",
    question: "目标怎样变成一条可执行的路径？",
    thesis: "规划是在约束中寻找一段未来动作，使系统从当前状态到达目标状态。任务规划决定做哪些阶段，运动规划决定身体如何通过空间，轨迹优化进一步决定每个时刻的位置、速度和力。",
    color: "#d19aff",
    firstPrinciples: ["目标通常不是单个动作", "身体不能瞬间移动到目标", "空间中存在障碍、关节限制和接触约束", "因此必须搜索可行的状态与动作序列"],
    sections: [
      { title: "三种尺度的规划", paragraphs: ["任务规划把‘收拾桌面’拆成识别物体、决定顺序、抓取、分类和放置。运动规划在机器人的配置空间中寻找无碰撞路径。轨迹优化还会考虑速度、加速度、力矩和时间。", "这三者的输出频率与表示不同。语言模型适合提出任务步骤，却不应直接编造毫米级关节轨迹；运动规划器知道几何，却不理解‘先把易碎物放上层’这样的语义。"] },
      { title: "配置空间为何重要", paragraphs: ["机械臂在真实空间占据复杂体积，但规划常把每个关节角作为一个维度。一个六轴机械臂的配置 q 是六维向量。某些配置会碰撞，某些超出关节限制，可行路径必须绕开这些区域。", "末端直线运动不代表每个关节都安全，也可能经过奇异点。规划必须检查整个身体，而不是只画夹爪的线。"] },
      { title: "计划必须能被打断", paragraphs: ["开放环境会变化：人可能伸手、物体会滑动、抓取会失败。一次生成到底的计划假设世界静止，通常不可靠。", "更实用的模式是 receding horizon：执行短段动作、重新观察、更新状态、再规划。成功检测器决定何时进入下一阶段；超时和异常则触发恢复或安全停止。"] },
    ],
    terms: [
      { term: "Task planning", definition: "选择符号化步骤及其顺序来完成目标。" },
      { term: "Motion planning", definition: "在身体约束和障碍下寻找从一个配置到另一个配置的路径。" },
      { term: "Configuration space", definition: "以机器人自由度为坐标描述所有可能姿态的空间。" },
      { term: "Replanning", definition: "环境或状态变化后重新求解后续计划。" },
    ],
    equations: [
      { expression: "min Σ cost(xₜ, uₜ)", meaning: "规划在可行约束内最小化时间、能耗、风险或误差等代价。" },
      { expression: "qmin ≤ q ≤ qmax", meaning: "关节角必须始终位于机械和安全限制内。" },
    ],
    worked: {
      title: "抓取方块的阶段机",
      setup: "直接从当前姿态到抓取姿态容易碰桌或从侧面撞飞方块。",
      steps: ["PRE-GRASP：先移动到方块上方安全位置。", "APPROACH：沿受控方向缓慢接近。", "CLOSE：检测接触并闭合夹爪。", "LIFT：垂直抬升，确认物体随夹爪移动。", "TRANSFER／PLACE：移动到盒子上方、下降、释放并撤离。"],
      conclusion: "阶段机把连续问题切成可验证的小闭环；每一步都有进入条件、成功条件和失败出口。",
    },
    lab: {
      title: "二维机械臂路径规划",
      goal: "理解末端路径、关节路径和碰撞空间之间的差异。",
      steps: ["实现二连杆正向运动学。", "在平面加入矩形障碍。", "随机采样关节角并标出碰撞配置。", "寻找一条从起点到目标的无碰撞路径，再转换为末端轨迹。"],
      evidence: "配置空间图和现实空间动画；指出一条末端看似安全但手臂碰撞的路径。",
    },
    checks: [
      { question: "为什么 LLM 给出的合理步骤不能直接作为机械臂轨迹？", answer: "语言步骤缺少精确几何、时间、动力学、碰撞和关节约束；必须由状态估计与运动控制层落地。" },
      { question: "为什么长任务应当在中途重新观察？", answer: "动作会改变环境且可能失败；重新观察能阻止初始误差持续累积，并允许恢复。" },
    ],
  },
  {
    id: "policy",
    number: "04",
    title: "策略与机器人学习",
    en: "POLICY",
    question: "机器人怎样决定下一段动作？",
    thesis: "策略把状态、观察和目标映射为动作。它可以由人编程、通过优化求解、从示范模仿，或通过奖励试错学习。不同方法不是信仰之争，而是对模型知识、数据、实时性和泛化要求的不同选择。",
    color: "#ffce54",
    firstPrinciples: ["同一目标在不同状态下需要不同动作", "手写规则难以覆盖所有连续变化", "数据包含人类或环境给出的行为证据", "学习策略是在数据与目标约束下拟合可执行的动作规律"],
    sections: [
      { title: "四种得到策略的路径", paragraphs: ["手写策略适合规则清晰、状态有限的任务；模型预测控制用动力学在线优化；模仿学习从示范动作学习；强化学习通过奖励和试错寻找高回报行为。", "真实系统经常混合使用：高层阶段机是手写的，抓取策略来自模仿学习，平衡控制来自模型或 RL，最后再由安全控制器限制动作。组合并不‘不够端到端’，而是把不同风险放到合适层处理。"] },
      { title: "模仿学习为何会漂移", paragraphs: ["Behavior cloning 把示范中的观察映射到动作。但部署后一个很小的动作误差会把机器人带到训练数据没有覆盖的状态；下一步预测更差，误差继续累积。这叫 covariate shift。", "解决方式包括收集恢复示范、让人类在机器人偏离时介入、扩大起始条件、使用动作块和闭环重规划。数据价值不只在成功轨迹，边界与恢复往往更稀缺。"] },
      { title: "VLA 在做什么", paragraphs: ["Vision-Language-Action 模型把图像、语言目标和机器人状态编码后，输出离散动作 token、连续动作或一段 action chunk。视觉语言预训练提供语义先验，机器人轨迹教会模型如何把语义落到身体动作。", "跨机器人训练希望共享技能，但不同机械臂的关节、尺寸和控制接口不同。动作表示、归一化和 embodiment conditioning 决定知识能否迁移。通用模型仍需要本体适配与严格评测。"] },
    ],
    terms: [
      { term: "Behavior cloning", definition: "把示范数据视为监督学习，直接拟合观察到动作的映射。" },
      { term: "Reinforcement learning", definition: "智能体通过与环境交互，优化累计奖励。" },
      { term: "Action chunk", definition: "一次预测未来一小段连续动作，以减少推理频率并保持时序一致。" },
      { term: "Distribution shift", definition: "部署时遇到的状态或输入分布与训练数据不同。" },
    ],
    equations: [
      { expression: "aₜ = π(oₜ, g)", meaning: "策略根据当前观察 o 和目标 g 输出动作。" },
      { expression: "BC: min Σ ||π(oᵢ) − aᵢ||²", meaning: "行为克隆让预测动作接近示范动作。" },
      { expression: "RL: max E[Σ γᵗ rₜ]", meaning: "强化学习最大化折扣后的长期累计奖励。" },
    ],
    worked: {
      title: "同一个抓取，三种策略",
      setup: "目标都是把方块抓起，但可用数据、模型和环境复杂度不同。",
      steps: ["规则策略：根据估计姿态生成固定上方抓取；透明但对物体变化敏感。", "模仿策略：从遥操作示范学习视觉到动作；适合复杂接触，但会受数据分布限制。", "RL 策略：在仿真通过奖励试错；可优化动态行为，但 reward 与 sim-to-real 很关键。", "VLA：利用预训练语义并输出动作块；可接收语言目标，但计算与评测成本更高。"],
      conclusion: "先问任务变化来自哪里、失败代价多大、数据怎样获得，再选策略。",
    },
    lab: {
      title: "制造一次 distribution shift",
      goal: "亲眼看到训练误差低不等于闭环稳定。",
      steps: ["收集一个二维光标从固定起点到目标的示范。", "训练小网络预测下一步动作。", "部署时把起点平移 10%，记录误差如何累积。", "加入偏离状态下的恢复示范并重新训练。"],
      evidence: "两条 rollout 轨迹和逐步误差图；解释新增哪些数据后最有效。",
    },
    checks: [
      { question: "Behavior cloning 的验证集损失很低，为什么部署仍可能失败？", answer: "验证集通常与示范同分布；闭环中的小误差会把系统带到示范未覆盖的状态，随后错误累积。" },
      { question: "VLA 比经典控制更‘高级’，是否应该替代控制器？", answer: "不应该按高级低级替代。VLA 擅长语义与技能泛化，控制器擅长高频稳定、约束与安全，两者通常分层协作。" },
    ],
  },
  {
    id: "control",
    number: "05",
    title: "反馈控制",
    en: "CONTROL",
    question: "怎样让计划在真实物理中稳定发生？",
    thesis: "控制器不断比较目标与实际状态，并根据误差生成电机命令。它关心的不是‘动作看起来合理’，而是系统在延迟、扰动、模型误差和执行限制下是否稳定、准确且安全。",
    color: "#ff6a3d",
    firstPrinciples: ["身体有惯性，命令不会瞬间实现", "环境和模型永远有误差", "只靠预先计算的动作无法纠偏", "因此控制必须高频测量误差并反馈修正"],
    sections: [
      { title: "反馈为何强大", paragraphs: ["开环控制只发送预定命令，不检查结果。反馈控制测量输出 y，与目标 r 比较得到误差 e，再产生修正。即使模型不完美，只要误差可测且修正及时，系统仍能抵抗扰动。", "但反馈不是越强越好。增益过低，系统迟钝；过高，在延迟和噪声存在时会振荡。稳定性来自系统动力学、控制频率、增益和延迟的共同关系。"] },
      { title: "PID 的三个直觉", paragraphs: ["P 项对当前误差立即反应；I 项累计长期偏差，可消除恒定负载造成的残差；D 项观察误差变化趋势，提前抑制快速接近目标造成的超调。", "D 项也会放大高频噪声，I 项可能在执行器饱和时继续累积造成 windup。真实 PID 包含滤波、限幅和 anti-windup，而不是只套三项公式。"] },
      { title: "位置控制、力控制与顺应性", paragraphs: ["自由空间移动常用位置或速度目标；一旦发生接触，只坚持位置可能产生过大力。力控制、阻抗控制和导纳控制让机器人在接触时表现出虚拟弹簧与阻尼。", "例如插头插入时，末端需要沿插入方向施力，同时允许横向微小让步以自动对齐。顺应性不是软弱，而是把物理接触变成可控信息。"] },
    ],
    terms: [
      { term: "Feedback", definition: "用实际输出与目标的差异持续修正输入。" },
      { term: "Stability", definition: "系统受小扰动后不会无限偏离，并能回到目标附近。" },
      { term: "Impedance control", definition: "控制力与位移之间的动态关系，使机器人表现出期望的刚度与阻尼。" },
      { term: "Saturation", definition: "执行器命令达到物理上限，无法继续增加。" },
    ],
    equations: [
      { expression: "e(t) = r(t) − y(t)", meaning: "控制误差等于目标减去实际输出。" },
      { expression: "u = Kₚe + Kᵢ∫e dt + Kd·de/dt", meaning: "PID 分别响应当前、累计和变化中的误差。" },
      { expression: "F = K(xd − x) + D(vd − v)", meaning: "阻抗控制用虚拟弹簧 K 和阻尼 D 产生接触力。" },
    ],
    worked: {
      title: "夹爪接近方块时为什么抖动",
      setup: "高层策略输出正确抓取点，但夹爪在目标附近来回摆动。",
      steps: ["确认目标是否每帧因视觉噪声跳动。", "检查感知、策略和执行链路总延迟。", "检查位置增益是否在当前负载下过高。", "对目标与 D 项适当滤波，同时保持足够相位裕度。", "记录阶跃响应，而不是凭手感继续调参。"],
      conclusion: "‘AI 动作不稳定’可能根本不是策略问题，而是目标噪声、延迟与控制增益的组合。",
    },
    lab: {
      title: "倒立摆控制实验",
      goal: "建立反馈、增益、延迟和扰动之间的直觉。",
      steps: ["在 MuJoCo 或简单数值模型中加载倒立摆。", "从只使用 P 项开始，逐步增加增益直到出现振荡。", "加入 D 项并比较稳定时间与噪声敏感度。", "再加入 50–150 ms 延迟和一次外力冲击。"],
      evidence: "每组参数至少 20 次试验；报告稳定率、超调、恢复时间和控制能量。",
    },
    checks: [
      { question: "为什么提高控制增益有时反而更不稳定？", answer: "高增益会更猛烈地响应旧的、带噪的误差；在延迟和惯性存在时，修正到达时可能已经过头，形成振荡。" },
      { question: "接触任务中为什么纯位置控制危险？", answer: "环境会阻止位移继续发生，位置误差会驱动控制器持续增加力；缺少力限制或顺应性时可能损坏物体或机器人。" },
    ],
  },
  {
    id: "body",
    number: "06",
    title: "身体、执行器与接触",
    en: "BODY",
    question: "为什么身体不是模型的外壳？",
    thesis: "身体决定智能能够观察什么、施加什么力、以多快速度行动，以及犯错时会发生什么。电机、减速器、结构、末端执行器与材料共同塑造可学习的动作空间。",
    color: "#ef8fab",
    firstPrinciples: ["动作最终必须由物理执行器产生力或位移", "执行器受功率、速度、温度和强度限制", "接触包含摩擦、冲击与形变", "所以身体设计直接改变控制与学习问题的难度"],
    sections: [
      { title: "从电流到关节力矩", paragraphs: ["电机把电流转换为力矩。减速器用速度换取更大输出力矩，但会引入摩擦、间隙、效率损失和不可回驱性。编码器测位置，电流可近似反映力矩，但受温度和传动影响。", "高减速比让机器人容易保持姿态，却可能降低触碰外界时的自然顺应性。直接驱动响应透明但需要更大的电机。机械选择决定控制器能获得什么样的身体。"] },
      { title: "接触是混合动力学", paragraphs: ["自由空间中物体连续运动；发生碰撞时，速度可能瞬间改变，接触力受材料、形变和求解模型影响。抓取、行走、插接都在不断切换接触模式。", "库仑摩擦常用切向力不超过摩擦系数乘法向力来近似。若抓力太小会滑，太大可能压坏物体。现实摩擦还会受表面、速度、污染和磨损影响。"] },
      { title: "Morphological computation", paragraphs: ["合适的身体能替智能承担部分计算。漏斗形入口通过几何自动对齐零件；柔性夹爪适应形状差异；被动弹簧储存和释放步行能量。", "先问任务需要什么物理交互，再决定是否需要人形。若目标只是在仓库搬箱，轮式底盘加机械臂可能比双足身体更便宜、更稳定、更易维护。"] },
    ],
    terms: [
      { term: "Torque", definition: "使物体绕轴旋转的力矩，等于力与力臂的乘积。" },
      { term: "Backlash", definition: "传动方向反转时齿轮间隙造成的空程。" },
      { term: "Compliance", definition: "身体或控制系统在外力下允许位移的能力。" },
      { term: "End effector", definition: "直接与任务对象互动的末端工具，如夹爪、吸盘或手。" },
    ],
    equations: [
      { expression: "τ = r × F", meaning: "力 F 通过力臂 r 产生关节力矩 τ。" },
      { expression: "|Fₜ| ≤ μFₙ", meaning: "简化摩擦锥：切向力不能超过摩擦系数 μ 与法向力的乘积。" },
      { expression: "Power = torque × angular velocity", meaning: "大力矩和高速度同时出现时需要更高功率。" },
    ],
    worked: {
      title: "同一策略换夹爪后失败",
      setup: "原来的硬质平行夹爪换成柔性手指后，抓取点相同但物体容易旋转。",
      steps: ["柔性材料改变接触面积与变形。", "接触发生的位置和法向力分布变化。", "原策略假设的闭合距离与抓力不再对应。", "需要重新标定夹爪状态、调整动作速度并补充新 embodiment 数据。"],
      conclusion: "策略与身体共同定义动作含义；更换硬件不是无损替换输入输出接口。",
    },
    lab: {
      title: "摩擦与抓力实验",
      goal: "观察物体、夹爪材料和法向力如何共同决定滑移。",
      steps: ["用两块材料夹住相同物体并缓慢增加载荷。", "记录开始滑移时的抓力。", "换三种表面或物体重量重复。", "设计一个检测滑移后逐步增力、同时限制最大力的闭环。"],
      evidence: "抓力—滑移曲线；说明一个固定抓力为何无法覆盖所有物体。",
    },
    checks: [
      { question: "为什么‘相同关节角命令’在两台机器人上不一定代表相同动作？", answer: "连杆尺寸、零位、传动、刚度、控制模式和末端工具不同，都会改变实际空间运动与接触结果。" },
      { question: "柔顺性为什么既有价值又有代价？", answer: "它能吸收误差与冲击、适应形状，但也降低定位刚度，引入形变状态并增加估计难度。" },
    ],
  },
  {
    id: "data",
    number: "07",
    title: "数据、仿真与 Sim-to-Real",
    en: "LEARN",
    question: "机器人真正从什么数据中学习？",
    thesis: "机器人学习的基本单位不是孤立图片，而是包含观察、状态、动作、结果、时间和干预的轨迹。数据价值取决于覆盖的行为边界、标定一致性和是否能解释成功与失败。",
    color: "#63d0bd",
    firstPrinciples: ["策略学习需要状态与动作之间的对应证据", "真实数据昂贵且带安全风险", "仿真便宜但永远不完全等于现实", "因此需要真实数据、仿真、随机化、系统辨识和介入数据形成闭环"],
    sections: [
      { title: "一条 trajectory 包含什么", paragraphs: ["至少要有时间对齐的相机、本体状态、动作命令、任务描述和 episode 结果。若相机时间戳与动作偏了 100 ms，模型会学到看见旧状态时执行新动作的错误对应。", "数据集还需要记录机器人型号、标定、控制模式和动作单位。同样的数字 0.1 可能代表弧度、米、归一化关节目标或速度；缺少语义的数据无法可靠复用。"] },
      { title: "仿真能解决与不能解决的事", paragraphs: ["仿真适合快速试错、生成大量危险边界、获得完美状态标签和并行训练。它能验证算法结构，却不能自动证明真实接触、视觉和硬件延迟下仍然成立。", "Sim-to-real gap 来自几何、质量、摩擦、执行器、传感器、渲染和延迟差异。Domain randomization 在训练时变化这些参数，让策略不依赖单一完美世界；system identification 则让仿真更接近特定真实系统。"] },
      { title: "失败和人工介入是高密度数据", paragraphs: ["只收集成功示范，模型不知道偏离后如何回来。部署中人类接管的瞬间往往正好位于策略能力边界；保存介入前状态、修正动作和结果，可以形成恢复数据。", "数据飞轮不是‘部署越多自动越强’。必须能检测失败、选择高价值片段、保持标定一致、重新训练并用固定测试集验证，否则只是在积累视频。"] },
    ],
    terms: [
      { term: "Episode", definition: "从任务开始到成功、失败或超时的一次完整交互。" },
      { term: "Domain randomization", definition: "训练时随机变化仿真参数，以提高对现实差异的鲁棒性。" },
      { term: "System identification", definition: "从输入输出数据估计真实系统动力学参数。" },
      { term: "Human intervention", definition: "系统接近失败时由人类接管或修正，并记录为学习数据。" },
    ],
    equations: [
      { expression: "trajectory = {(oₜ, sₜ, aₜ, rₜ, doneₜ)}ₜ₌₀ᵀ", meaning: "轨迹按时间保存观察、状态、动作、反馈和终止信息。" },
      { expression: "θsim ~ P(θ)", meaning: "Domain randomization 从参数分布中采样不同质量、摩擦、延迟和视觉条件。" },
    ],
    worked: {
      title: "一个漂亮仿真策略为何到现实就掉物体",
      setup: "策略在仿真抓取成功率 98%，真实机器只有 42%。",
      steps: ["检查动作单位与控制频率是否一致。", "测量真实夹爪关闭延迟与最大力。", "辨识物体—夹爪摩擦范围。", "把延迟、摩擦和视觉噪声加入仿真随机化。", "用固定真实测试集比较，不在测试物体上继续调参。"],
      conclusion: "Sim-to-real 不是一次导出，而是找出真实差异、更新训练分布、再验证的迭代。",
    },
    lab: {
      title: "Robustness matrix",
      goal: "把‘感觉鲁棒’变成可检查的二维证据。",
      steps: ["选择两个关键参数，如摩擦与延迟。", "各取五个强度，形成 25 个组合。", "每个组合运行至少 20 次。", "画成功率热图，并圈出训练分布与失效边界。"],
      evidence: "包含置信区间的 25 格矩阵；指出下一批数据应该采集在哪里。",
    },
    checks: [
      { question: "为什么百万帧视频可能不如一百条高质量轨迹？", answer: "学习动作需要时间对齐、动作、状态、任务和结果；普通视频常缺少这些因果与控制信息。" },
      { question: "Domain randomization 是否越宽越好？", answer: "不是。过宽可能让环境不真实、增加学习难度并牺牲目标域性能；分布应覆盖合理不确定性并由真实测量校准。" },
    ],
  },
  {
    id: "system",
    number: "08",
    title: "完整系统逆向拆解",
    en: "CASE STUDY",
    question: "成熟 Physical AI 系统为什么通常是分层的？",
    thesis: "把一个自主抓取系统逆向拆开，会看到语义模型、几何估计、技能策略、控制器、安全监控和日志各自承担不同风险。系统能力来自接口、时序和失败恢复，而不只是核心模型。",
    color: "#ffffff",
    firstPrinciples: ["复杂任务包含不同时间尺度和风险", "单一组件无法同时优化语义、实时性与安全", "每层需要明确输入、输出和失败信号", "所以可部署系统通常采用分层架构与可观测接口"],
    sections: [
      { title: "需求先于架构", paragraphs: ["假设任务是在桌面上把指定物体放入目标容器。产品需求必须给出对象范围、环境变化、节拍、成功定义、允许的人工介入和碰撞限制。‘泛化抓取’不是可测试需求。", "如果目标是每小时处理 300 件相同商品，经典视觉与规划可能更合适；如果物品变化大、节拍较低且可远程介入，学习策略更有价值。架构应由分布和经济约束决定。"] },
      { title: "一条真实执行链", paragraphs: ["相机帧带时间戳进入感知节点；检测与深度生成候选物体；状态估计把它变换到机器人坐标系；任务层选择目标；抓取策略提出接近位姿；运动规划检查碰撞；控制器执行；力与视觉验证结果。", "旁路的安全监控持续检查关节、速度、力、工作空间和超时。日志记录每层输入输出，使失败能被归因。缺少日志时，‘模型偶尔不行’只是症状，不是诊断。"] },
      { title: "三类失败与不同修复", paragraphs: ["感知失败：目标位置偏差或误识别，应修标定、数据或传感器。规划失败：没有可行路径，应改场景、约束或抓取候选。执行失败：发生滑移、饱和或延迟，应改控制、夹爪或动力学模型。", "把所有失败都归为模型能力不足，会让团队不断换模型却不提高系统。Episode 级回放应能定位第一次偏离发生在哪一层、什么时间。"] },
    ],
    terms: [
      { term: "Interface contract", definition: "组件之间对数据单位、坐标、频率、时间戳和错误状态的明确约定。" },
      { term: "Success detector", definition: "独立判断阶段或任务是否真实完成的模块。" },
      { term: "Fallback", definition: "主路径失败时采用的安全替代行为，如重试、换抓法或求助。" },
      { term: "Observability stack", definition: "日志、指标与回放工具，使系统内部决策和失败可见。" },
    ],
    worked: {
      title: "最小可复现版本",
      setup: "不先购买机械臂，用 MuJoCo 的 Panda 或同类机械臂复现完整逻辑。",
      steps: ["固定物体类别，只随机化位置与朝向。", "先使用仿真真值姿态，完成规划与控制闭环。", "再替换为带噪视觉估计，测量性能下降。", "加入抓取成功检测和一次恢复尝试。", "最后加入一个学习策略，并与几何基线在同一测试集比较。"],
      conclusion: "按层替换能知道增益来自哪里；一开始端到端只会把所有错误混在一起。",
    },
    lab: {
      title: "建立 Episode 证据包",
      goal: "让任何一次失败都能在十分钟内定位到第一处异常。",
      steps: ["记录同步视频、状态、动作、阶段和安全事件。", "定义阶段开始、成功、失败和超时事件。", "自动截取失败前十秒。", "为失败标注感知、规划、策略、控制、身体或环境根因。"],
      evidence: "五十次 rollout 的成功率、失败树和三个可重放失败案例。",
    },
    checks: [
      { question: "为什么成功检测器最好不要完全复用动作策略的内部判断？", answer: "独立证据可以避免策略既执行又给自己打分；例如用外部视觉或重量变化确认物体真的进入容器。" },
      { question: "怎样区分症状和根因？", answer: "沿时间线找到最早偏离预期的可观测事件；掉落是症状，可能的根因是位置偏差、抓力不足、延迟或错误摩擦假设。" },
    ],
  },
  {
    id: "frontier",
    number: "09",
    title: "前沿、评测与安全",
    en: "FRONTIER",
    question: "如何判断最新 Physical AI 能力是真的？",
    thesis: "机器人基础模型正在扩大任务、场景和本体覆盖，但可靠部署仍取决于严格评测、分层安全和诚实的能力边界。前沿不是追逐最新缩写，而是提出能证伪的实验。",
    color: "#ff6a3d",
    firstPrinciples: ["演示选择最好结果，产品承受所有结果", "训练分布不可能覆盖现实全部变化", "物理错误存在成本与责任", "因此能力声明必须绑定评测分布、统计证据和安全边界"],
    sections: [
      { title: "机器人基础模型在扩展什么", paragraphs: ["Open X-Embodiment 把多实验室、多机器人的轨迹放入标准化混合数据；π₀ 等 VLA 使用视觉语言预训练与连续动作模型；LeRobot 降低数据采集、策略训练与硬件复现门槛。", "这些系统探索跨任务、跨场景和跨 embodiment 的迁移，但‘通用’仍是相对于评测分布而言。动作空间、控制频率、传感配置和硬件差异不会因为模型规模而消失。"] },
      { title: "一个可信评测需要什么", paragraphs: ["先冻结测试条件和成功定义，再运行足够 episode；报告平均值之外的逐任务结果、置信区间和失败类型。测试应包含训练分布内、单因素变化、组合扰动和长时序任务。", "必须公开遥操作、人工重置、重试选择和视频剪辑规则。最好加入简单基线：如果几何规则以更少数据达到同样结果，基础模型的比较价值尚未成立。"] },
      { title: "安全不是一句提示词", paragraphs: ["语言层可以拒绝危险指令，但真正的安全边界应在更低层独立执行：工作空间、速度、力、温度、碰撞、超时和急停。高层模型没有权限绕过这些限制。", "不确定性应触发减速、重新观察、请求确认或安全停止。安全失败不是能力不足的羞耻，而是可部署系统的重要能力。"] },
    ],
    terms: [
      { term: "In-distribution", definition: "与训练或开发数据的条件相近的测试。" },
      { term: "OOD", definition: "分布外条件，如新物体、新光线、组合扰动或未见任务。" },
      { term: "Confidence interval", definition: "由于有限样本造成的不确定范围，而不只是一个成功率数字。" },
      { term: "Safety envelope", definition: "系统允许动作、速度、力和空间范围的硬约束。" },
    ],
    equations: [
      { expression: "p̂ = successes / trials", meaning: "成功率必须同时报告试验次数；9/10 与 900/1000 可信度不同。" },
      { expression: "risk = probability × consequence", meaning: "低概率但高后果事件仍可能需要硬件或控制层防护。" },
    ],
    worked: {
      title: "如何审视一个人形机器人 demo",
      setup: "视频展示机器人在厨房连续完成多个动作，但没有完整方法说明。",
      steps: ["确认自主、遥操作和预编程分别占哪些阶段。", "寻找连续未剪辑时长、总试验次数与重置规则。", "区分训练物体、相似新物体和真正新任务。", "观察失败是否被展示，以及机器人如何恢复。", "估计速度、人工支持、维护和安全空间是否满足场景。"],
      conclusion: "不必否定 demo；只需把它降级为一个待验证假设，并列出下一项能区分能力与表演的实验。",
    },
    lab: {
      title: "设计一份可证伪评测协议",
      goal: "为你的贯穿项目建立在开发前就固定的毕业标准。",
      steps: ["定义二元成功条件和部分完成指标。", "固定 100 次测试的随机种子与条件。", "加入至少三类分布外扰动。", "记录人工介入、碰撞、超时与恢复。", "规定什么结果会推翻‘系统已经可靠’的判断。"],
      evidence: "一页 protocol、原始结果表、失败视频索引和结论边界。",
    },
    checks: [
      { question: "为什么展示几个 OOD 成功案例仍不足以证明泛化？", answer: "案例可能经过选择，且没有明确分布与分母；需要预先定义变化、重复试验和失败统计。" },
      { question: "安全层为什么必须能拒绝高层模型？", answer: "高层模型可能误解场景、被不当指令影响或超出训练分布；物理约束需要独立、确定且高频执行。" },
    ],
  },
];

type HistoryEra = {
  period: string;
  phase: string;
  title: string;
  thesis: string;
  breakthroughs: string[];
  bottleneck: string;
  systems: { name: string; note: string; url: string }[];
  color: string;
};

const historyEras: HistoryEra[] = [
  {
    period: "1948–1950s",
    phase: "FEEDBACK",
    title: "控制论：机器第一次学会纠错",
    thesis: "Norbert Wiener 把动物与机器中的控制、通信和反馈放进同一框架。智能不再只是预先写好的动作，而可以比较目标与结果，用误差改变下一次行动。",
    breakthroughs: ["负反馈把偏差变成修正动作", "噪声与通信被纳入控制问题", "稳定性成为可分析、可设计的系统性质"],
    bottleneck: "反馈控制能让系统稳定，却不知道环境中有什么，也无法自己决定应该追求什么目标。",
    systems: [{ name: "Cybernetics", note: "1948 · Wiener", url: "https://mitpress.mit.edu/9780262355919/cybernetics-or-control-and-communication-in-the-animal-and-the-machine/" }],
    color: "#ff6a3d",
  },
  {
    period: "1959–1970s",
    phase: "AUTOMATION",
    title: "工业机器人：身体进入工厂",
    thesis: "Unimate 把可重复编程的机械臂带上生产线。机器人开始稳定执行搬运、焊接等危险和重复任务，证明了计算控制能够可靠地驱动物理身体。",
    breakthroughs: ["数字程序取代专用机械凸轮", "高重复精度支持大规模制造", "执行器、减速器与安全围栏形成工程体系"],
    bottleneck: "它的可靠来自环境固定、工件一致和人与机器隔离；一旦位置、物体或任务改变，能力就迅速消失。",
    systems: [{ name: "Unimate", note: "1961 · GM production line", url: "https://ifr.org/robot-history" }],
    color: "#ffce54",
  },
  {
    period: "1966–1980s",
    phase: "SYMBOLIC AI",
    title: "AI 进入机器人：先建模，再规划",
    thesis: "Shakey 把摄像机、环境模型、符号推理、路径规划和运动控制连接成一条感知—计划—行动链。机器人第一次能根据目标推导一串动作，而不只是重放轨迹。",
    breakthroughs: ["把感知结果写入显式世界模型", "使用符号规划把目标分解为步骤", "连接视觉、规划与真实移动底盘"],
    bottleneck: "现实必须被简化成干净的符号；感知和规划很慢，任何未建模变化都可能让整条推理链失效。",
    systems: [{ name: "Shakey", note: "1966–72 · SRI", url: "https://www.sri.com/hoi/shakey-the-robot/" }],
    color: "#87a9ff",
  },
  {
    period: "1980s–1990s",
    phase: "EMBODIMENT",
    title: "智能回到身体：先及时行动",
    thesis: "Rodney Brooks 的行为式机器人主张，不必先建立完整世界模型；多个简单感知—动作回路可以直接产生实时、鲁棒的行为。与此同时，operational-space control 让机械臂在任务空间直接控制位置与力。",
    breakthroughs: ["Subsumption architecture 用分层行为替代单一中央模型", "身体与环境本身参与计算", "任务空间控制把接触、位置和力放进闭环"],
    bottleneck: "反应式系统能避障和行走，却难以表示抽象目标、组合新技能，也缺乏长程规划与可解释记忆。",
    systems: [{ name: "Intelligence without representation", note: "1991 · Brooks", url: "https://people.csail.mit.edu/brooks/papers/BrooksIJCAI91.pdf" }],
    color: "#d6ff45",
  },
  {
    period: "1990s–2000s",
    phase: "AUTONOMY",
    title: "概率机器人：在不确定世界中行动",
    thesis: "Kalman filtering、particle filters、SLAM 与传感器融合让机器人不再假设测量等于真相，而是维护对自身与环境状态的概率信念。DARPA Grand Challenge 则把整套自治栈推向高速、开放环境。",
    breakthroughs: ["估计结果同时表达数值与不确定性", "SLAM 联合解决定位与地图构建", "感知—预测—规划—控制成为模块化自治栈"],
    bottleneck: "每个模块依赖人工特征、地图、规则和接口；系统可以很强，但扩展到新场景的工程成本极高。",
    systems: [{ name: "DARPA Grand Challenge", note: "2004–07 · autonomous driving", url: "https://www.darpa.mil/about/innovation-timeline/grand-challenge" }],
    color: "#d19aff",
  },
  {
    period: "2010s",
    phase: "ROBOT LEARNING",
    title: "从编程到训练：策略由数据长出来",
    thesis: "深度学习把图像直接连接到连续动作；模仿学习从人类示范提取行为，强化学习从奖励中试错。大规模抓取和 sim-to-real 证明，某些过去必须手写的能力可以通过数据获得。",
    breakthroughs: ["端到端 visuomotor policy 联合学习视觉与控制", "大规模机器人数据覆盖抓取变化", "域随机化与并行仿真降低现实试错成本"],
    bottleneck: "真实数据昂贵，训练分布之外容易失效；高平均成功率仍可能掩盖危险的长尾失败。",
    systems: [
      { name: "End-to-end visuomotor", note: "2015 · Levine et al.", url: "https://arxiv.org/abs/1504.00702" },
      { name: "800k grasp attempts", note: "2016 · large-scale grasping", url: "https://arxiv.org/abs/1603.02199" },
    ],
    color: "#5ed6b3",
  },
  {
    period: "2022–2024",
    phase: "FOUNDATION POLICIES",
    title: "VLA 与跨本体数据：一个模型，许多任务",
    thesis: "语言模型和视觉模型的语义知识开始被接到机器人动作上。RT-2 把动作表示成 token；Open X-Embodiment 汇集多种机器人数据；ALOHA/ACT 与 π₀ 探索动作块、流模型和跨本体策略。",
    breakthroughs: ["视觉、语言、目标与动作进入统一策略", "跨任务、跨机构的数据开始形成共同语料", "预训练知识支持语义泛化与新指令组合"],
    bottleneck: "不同身体的动作空间并不天然兼容；模型会犹豫、幻觉或执行失败，真实世界的可靠性远低于语言基准。",
    systems: [
      { name: "RT-2", note: "2023 · vision-language-action", url: "https://deepmind.google/blog/rt-2-new-model-translates-vision-and-language-into-action/" },
      { name: "Open X-Embodiment", note: "2023 · cross-robot dataset", url: "https://robotics-transformer-x.github.io/" },
      { name: "ALOHA / ACT", note: "2023 · action chunking", url: "https://arxiv.org/abs/2304.13705" },
      { name: "π₀", note: "2024 · flow-based VLA", url: "https://www.physicalintelligence.company/blog/pi0" },
    ],
    color: "#ff8eb9",
  },
  {
    period: "2024–2026",
    phase: "PHYSICAL AI",
    title: "Physical AI：把整个闭环重新看成一个问题",
    thesis: "Physical AI 成为连接基础模型、世界模型、仿真、机器人学习和真实身体的总称。Gemini Robotics 等系统强调空间推理与动作，产业则用数字孪生和合成数据训练、验证并部署真实机器。",
    breakthroughs: ["通用模型与高频控制器分层协作", "仿真、合成数据与真实日志形成数据闭环", "移动、操作、语言和安全被放进统一系统评测"],
    bottleneck: "前沿已从‘能否演示’转向长任务可靠性、失败检测、边缘实时性、跨本体迁移与可证明的物理安全。",
    systems: [
      { name: "Gemini Robotics", note: "2025 · embodied reasoning", url: "https://deepmind.google/blog/gemini-robotics-brings-ai-into-the-physical-world/" },
      { name: "Gemini Robotics-ER 1.6", note: "2026 · updated embodied reasoning", url: "https://deepmind.google/blog/gemini-robotics-er-1-6/" },
    ],
    color: "#ff6a3d",
  },
];

const bottleneckShifts = [
  ["反馈控制", "让机器自动纠错", "不理解环境与目标"],
  ["工业自动化", "让身体精确、重复工作", "环境必须固定"],
  ["符号机器人", "让目标变成计划", "世界模型太慢、太脆"],
  ["行为机器人", "让反应实时而鲁棒", "缺少长程推理"],
  ["概率自治", "让系统处理噪声与定位", "规则和模块难扩展"],
  ["深度机器人学习", "让策略从数据中获得", "数据昂贵、分布外脆弱"],
  ["VLA / Physical AI", "让知识、语言与动作迁移", "可靠性、安全与物理落地"],
];

const sources = [
  ["Modern Robotics", "运动学、动力学、规划与控制的免费课程和教材。", "https://modernrobotics.northwestern.edu/nu-gm-book-resource/modern-robotics-a-free-course-and-book/"],
  ["MIT Underactuated Robotics", "非线性动力学、控制、估计、优化与接触。", "https://underactuated.mit.edu/"],
  ["MuJoCo Documentation", "跨平台物理仿真、模型与 Python 接口。", "https://mujoco.readthedocs.io/en/stable/"],
  ["ROS 2 Tutorials", "机器人软件的节点、通信、记录与系统组织。", "https://docs.ros.org/en/lyrical/Tutorials.html"],
  ["LeRobot", "机器人数据集、模仿学习、RL、VLA 与硬件工作流。", "https://huggingface.co/docs/lerobot/index"],
  ["Open X-Embodiment", "跨机器人数据与 RT-X 模型的原始项目。", "https://robotics-transformer-x.github.io/"],
  ["Physical Intelligence π₀", "视觉语言动作 flow model 与跨本体训练。", "https://www.physicalintelligence.company/blog/pi0"],
  ["NVIDIA Isaac Lab", "GPU 并行机器人学习与仿真评测。", "https://developer.nvidia.com/isaac/lab"],
  ["Cybernetics", "Wiener 关于反馈、通信与控制的奠基文本。", "https://mitpress.mit.edu/9780262355919/cybernetics-or-control-and-communication-in-the-animal-and-the-machine/"],
  ["SRI Shakey", "首批把视觉、规划与真实移动连接起来的通用机器人。", "https://www.sri.com/hoi/shakey-the-robot/"],
  ["DARPA Grand Challenge", "推动现代自动驾驶自治栈走出实验室的挑战赛。", "https://www.darpa.mil/about/innovation-timeline/grand-challenge"],
  ["RT-2", "把视觉、语言与机器人动作统一为 token 的 VLA 系统。", "https://deepmind.google/blog/rt-2-new-model-translates-vision-and-language-into-action/"],
  ["Gemini Robotics", "Google DeepMind 的具身推理与机器人控制模型。", "https://deepmind.google/blog/gemini-robotics-brings-ai-into-the-physical-world/"],
];

function SectionBlock({ section }: { section: Section }) {
  return <section className="text-section"><h3>{section.title}</h3>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>;
}

export default function Home() {
  const [chapterIndex, setChapterIndex] = useState(0);
  const [revealed, setRevealed] = useState<number[]>([]);
  const [delay, setDelay] = useState(45);
  const [noise, setNoise] = useState(12);
  const [gain, setGain] = useState(1.2);
  const chapter = chapters[chapterIndex];

  const sim = useMemo(() => {
    const delayPenalty = Math.max(0, delay - 20) * 0.22;
    const noisePenalty = noise * Math.max(0.6, gain) * 0.72;
    const gainPenalty = Math.abs(gain - 1.15) * 24;
    const score = Math.max(4, Math.min(98, Math.round(100 - delayPenalty - noisePenalty - gainPenalty)));
    const overshoot = Math.max(2, Math.round((gain * 22) + (delay * gain * 0.09) + noise * 0.25));
    const settle = Math.max(0.4, Number((3.8 / Math.max(gain, 0.25) + delay / 180 + noise / 45).toFixed(1)));
    const state = score > 78 ? "稳定且可恢复" : score > 55 ? "可用，但边界脆弱" : score > 32 ? "持续振荡" : "失稳 / 应停止";
    return { score, overshoot, settle, state };
  }, [delay, noise, gain]);

  const selectChapter = (index: number) => {
    setChapterIndex(index);
    setRevealed([]);
    document.getElementById("reader")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main>
      <nav className="topbar">
        <a href="#top" className="brand"><span>P·AI</span><b>PHYSICAL AI FIELD MANUAL</b></a>
        <div className="navlinks"><a href="#atlas">地图</a><a href="#history">历史</a><a href="#reader">教材</a><a href="#lab">交互实验</a><a href="#case">案例</a></div>
        <a href="#reader" className="read-cta">开始阅读 ↘</a>
      </nav>

      <header className="hero" id="top">
        <div className="hero-grid" />
        <div className="hero-copy">
          <p className="kicker">AN INTERACTIVE FIELD MANUAL · 10 CHAPTERS</p>
          <h1>不是学习路线。<br /><em>这是教材本身。</em></h1>
          <p className="deck">从第一性原理理解感知、状态、规划、策略、控制与身体；沿着一个完整抓取案例，直到你能解释系统如何工作、为什么失败，以及怎样验证。</p>
          <div className="hero-actions"><a href="#reader">进入第一章 <span>↓</span></a><a href="#lab">先玩闭环实验 <span>↗</span></a></div>
          <div className="hero-proof"><span>10 章完整讲解</span><span>8 个历史阶段</span><span>10 个实验</span><span>20 道费曼自测</span></div>
        </div>
        <div className="hero-loop" aria-label="Physical AI 闭环图">
          <div className="loop-center"><small>PHYSICAL AI</small><strong>感知—行动<br />闭环</strong><p>observe · estimate · decide · act · verify</p></div>
          {chapters.slice(1, 7).map((item, index) => <button key={item.id} className={`loop-node node-${index + 1}`} onClick={() => selectChapter(index + 1)} style={{ "--tone": item.color } as React.CSSProperties}><span>{item.number}</span>{item.title}</button>)}
          <div className="loop-orbit orbit-one" /><div className="loop-orbit orbit-two" />
          <p className="loop-caption">点击任一层进入正文。没有任何一层能单独完成任务。</p>
        </div>
      </header>

      <section className="atlas shell" id="atlas">
        <div className="section-head split"><div><p className="eyebrow">FIELD ATLAS / 领域地图</p><h2>先知道每个问题<br />在系统的哪里</h2></div><p>Physical AI 横跨机器人学、控制、计算机视觉、机器学习和机械电子。下面不是课程清单，而是这些学科在同一个闭环中的职责边界。</p></div>
        <div className="atlas-grid">
          {chapters.slice(1, 7).map((item, index) => <button key={item.id} onClick={() => selectChapter(index + 1)} style={{ "--tone": item.color } as React.CSSProperties}><span>{item.number}</span><small>{item.en}</small><strong>{item.title}</strong><p>{item.question}</p><i>READ ↗</i></button>)}
        </div>
        <div className="skill-ladder">
          <div><p className="eyebrow">NOVICE → EXPERT</p><h3>能力差别不在知道多少名词</h3></div>
          <ol><li><span>01</span><b>初学者</b><p>能运行 demo，描述六层分别做什么。</p></li><li><span>02</span><b>构建者</b><p>能连接传感、规划和控制，量化误差。</p></li><li><span>03</span><b>系统工程师</b><p>能定位跨层失败，设计恢复与监控。</p></li><li><span>04</span><b>研究者／专家</b><p>能提出可证伪假设，改变数据、模型或身体边界。</p></li></ol>
        </div>
      </section>

      <section className="history" id="history">
        <div className="shell">
          <div className="section-head split history-head"><div><p className="eyebrow">PHYSICAL AI HISTORY / 八个阶段</p><h2>它不是突然出现。<br />每一代都在修补上一代。</h2></div><p>这段历史不是名字清单，而是一条问题链：先让机器纠错，再让身体可靠执行；再解决感知、规划、不确定性、学习、迁移，最后才走到今天的 Physical AI。</p></div>
          <div className="history-rail" aria-hidden="true">{historyEras.map((era, index) => <span key={era.period} style={{ "--tone": era.color } as React.CSSProperties}><i>{String(index + 1).padStart(2, "0")}</i><b>{era.period}</b></span>)}</div>
          <div className="era-list">
            {historyEras.map((era, index) => <article className="era" key={era.period} style={{ "--tone": era.color } as React.CSSProperties}>
              <div className="era-marker"><span>{String(index + 1).padStart(2, "0")}</span><i /><b>{era.period}</b><small>{era.phase}</small></div>
              <div className="era-body">
                <h3>{era.title}</h3>
                <p className="era-thesis">{era.thesis}</p>
                <div className="era-detail">
                  <div><span>WHAT CHANGED / 突破</span><ul>{era.breakthroughs.map((item) => <li key={item}>{item}</li>)}</ul></div>
                  <div className="era-limit"><span>THE NEXT BOTTLENECK / 新瓶颈</span><p>{era.bottleneck}</p></div>
                </div>
                <div className="era-systems"><span>REPRESENTATIVE SYSTEMS</span>{era.systems.map((system) => <a href={system.url} target="_blank" rel="noreferrer" key={system.url}><b>{system.name}</b><small>{system.note}</small><i>↗</i></a>)}</div>
              </div>
            </article>)}
          </div>

          <section className="bottleneck-map">
            <div><p className="eyebrow">THE PATTERN BENEATH THE TIMELINE</p><h3>能力增加，<br />问题并没有消失——<br />只是向上迁移。</h3><p>今天的 VLA 仍然依赖反馈控制、状态估计和安全系统。新范式通常包住旧范式，而不是把它删除。</p></div>
            <div className="shift-table"><div className="shift-head"><span>范式</span><span>解决了</span><span>留下了</span></div>{bottleneckShifts.map(([era, solved, left], index) => <div className="shift-row" key={era}><span><i>{String(index + 1).padStart(2, "0")}</i>{era}</span><span>{solved}</span><span>{left}</span></div>)}</div>
          </section>
        </div>
      </section>

      <section className="reader" id="reader">
        <aside className="chapter-nav">
          <div className="chapter-nav-head"><span>CONTENTS</span><b>10 CHAPTERS</b></div>
          {chapters.map((item, index) => <button key={item.id} className={index === chapterIndex ? "active" : ""} onClick={() => { setChapterIndex(index); setRevealed([]); }} style={{ "--tone": item.color } as React.CSSProperties}><span>{item.number}</span><div><b>{item.title}</b><small>{item.en}</small></div></button>)}
        </aside>

        <article className="chapter" style={{ "--tone": chapter.color } as React.CSSProperties}>
          <header className="chapter-head"><div><span>CHAPTER {chapter.number}</span><small>{chapter.en}</small></div><h2>{chapter.title}</h2><p>{chapter.question}</p></header>
          <div className="thesis"><span>ONE SENTENCE / 一句话</span><p>{chapter.thesis}</p></div>

          <section className="principles"><div><p className="eyebrow">FIRST PRINCIPLES</p><h3>从不可再省略的事实推出来</h3></div><ol>{chapter.firstPrinciples.map((item, index) => <li key={item}><span>0{index + 1}</span><p>{item}</p>{index < chapter.firstPrinciples.length - 1 && <i>↓</i>}</li>)}</ol></section>

          <div className="chapter-text">{chapter.sections.map((section) => <SectionBlock key={section.title} section={section} />)}</div>

          {chapter.equations && <section className="equations"><div className="subhead"><span>THE MATH, IN PLAIN LANGUAGE</span><h3>公式不是装饰，它压缩了因果关系</h3></div>{chapter.equations.map((equation) => <div className="equation" key={equation.expression}><code>{equation.expression}</code><p>{equation.meaning}</p></div>)}</section>}

          <section className="glossary"><div className="subhead"><span>WORKING VOCABULARY</span><h3>本章术语</h3></div><div>{chapter.terms.map((term) => <article key={term.term}><strong>{term.term}</strong><p>{term.definition}</p></article>)}</div></section>

          <section className="worked" id={chapter.id === "system" ? "case" : undefined}>
            <div className="worked-label"><span>REVERSE ENGINEERING</span><b>案例逆向拆解</b></div>
            <div className="worked-content"><h3>{chapter.worked.title}</h3><p>{chapter.worked.setup}</p><ol>{chapter.worked.steps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span>{step}</li>)}</ol><blockquote>{chapter.worked.conclusion}</blockquote></div>
          </section>

          <section className="mini-lab">
            <div className="lab-title"><span>BUILD TO UNDERSTAND</span><h3>{chapter.lab.title}</h3><p>{chapter.lab.goal}</p></div>
            <div className="lab-steps"><ol>{chapter.lab.steps.map((step, index) => <li key={step}><span>STEP {index + 1}</span><p>{step}</p></li>)}</ol><div><span>你必须留下的证据</span><p>{chapter.lab.evidence}</p></div></div>
          </section>

          <section className="feynman">
            <div className="subhead"><span>FEYNMAN CHECK</span><h3>合上资料，你能讲清楚吗？</h3><p>先用自己的话回答，再展开参考答案。</p></div>
            {chapter.checks.map((check, index) => <article key={check.question}><button onClick={() => setRevealed((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index])}><span>Q{index + 1}</span><b>{check.question}</b><i>{revealed.includes(index) ? "−" : "+"}</i></button>{revealed.includes(index) && <p>{check.answer}</p>}</article>)}
          </section>

          <footer className="chapter-footer"><button disabled={chapterIndex === 0} onClick={() => selectChapter(chapterIndex - 1)}>← 上一章</button><span>{chapterIndex + 1} / {chapters.length}</span><button disabled={chapterIndex === chapters.length - 1} onClick={() => selectChapter(chapterIndex + 1)}>下一章 →</button></footer>
        </article>
      </section>

      <section className="control-lab" id="lab">
        <div className="shell">
          <div className="section-head split dark"><div><p className="eyebrow">INTERACTIVE LAB / 闭环实验</p><h2>亲手破坏一个<br />反馈系统</h2></div><p>这是一个概念模拟器，不替代真实动力学计算。它让你观察三个关键变量如何共同影响稳定性：延迟、观测噪声和控制增益。</p></div>
          <div className="simulator">
            <div className="controls">
              <label><span>总延迟</span><b>{delay} ms</b><input type="range" min="0" max="220" value={delay} onChange={(event) => setDelay(Number(event.target.value))} /><small>感知、推理、通信与执行队列的总和</small></label>
              <label><span>观测噪声</span><b>{noise}%</b><input type="range" min="0" max="50" value={noise} onChange={(event) => setNoise(Number(event.target.value))} /><small>状态读数相对目标尺度的波动</small></label>
              <label><span>控制增益</span><b>{gain.toFixed(2)}×</b><input type="range" min="20" max="260" value={Math.round(gain * 100)} onChange={(event) => setGain(Number(event.target.value) / 100)} /><small>控制器对误差做出反应的强度</small></label>
            </div>
            <div className="sim-output">
              <div className="score" style={{ "--score": `${sim.score * 3.6}deg` } as React.CSSProperties}><div><strong>{sim.score}</strong><span>STABILITY</span></div></div>
              <h3>{sim.state}</h3>
              <div className="metrics"><div><span>估计超调</span><b>{sim.overshoot}%</b></div><div><span>稳定时间</span><b>{sim.settle}s</b></div><div><span>建议动作</span><b>{sim.score < 35 ? "安全停止" : sim.score < 65 ? "减速重观测" : "继续监控"}</b></div></div>
              <div className="response-chart" aria-label="概念响应曲线">{Array.from({ length: 18 }).map((_, index) => { const decay = Math.max(4, (sim.overshoot * Math.exp(-index * sim.score / 850))); const wave = Math.abs(Math.sin(index * gain * .72)) * decay; const height = Math.round(Math.min(94, 14 + wave) * 10) / 10; return <span key={index} style={{ height: `${height}%` }} />; })}<i /></div>
              <p>尝试：先把增益升高，再增加延迟。你会看到“更努力纠错”为什么可能变成更大的振荡。</p>
            </div>
          </div>
        </div>
      </section>

      <section className="source-room">
        <div className="shell"><div className="section-head split dark"><div><p className="eyebrow">PRIMARY SOURCES</p><h2>继续深入的原始资料</h2></div><p>正文给你可工作的心智模型；需要推导、实现细节或最新接口时，再进入这些官方教材与项目文档。</p></div>
          <div className="sources">{sources.map(([title, note, url], index) => <a key={url} href={url} target="_blank" rel="noreferrer"><span>{String(index + 1).padStart(2, "0")}</span><div><b>{title}</b><p>{note}</p></div><i>↗</i></a>)}</div>
        </div>
      </section>

      <footer className="site-footer"><div className="shell"><div className="brand"><span>P·AI</span><b>PHYSICAL AI FIELD MANUAL</b></div><p>真正理解一个系统，意味着你能解释它、构建它、故意破坏它，并预测它会在哪里失败。</p><a href="#top">回到顶部 ↑</a></div></footer>
    </main>
  );
}
