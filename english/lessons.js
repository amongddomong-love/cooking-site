// Business English Coach — 학습 콘텐츠 (화면 코드와 분리된 유일한 원본)
// 문장 id 는 `${lesson.id}#${순번}` 으로 자동 생성되어 진도·복습 저장 키로 쓰인다.
// → 기존 레슨의 문장 순서를 바꾸거나 중간에 끼워 넣지 말고, 새 문장은 끝에 추가한다.
// audio 를 생략하면 브라우저 TTS 로 재생한다. 파일을 쓰려면 문장에
//   audio: { storage_type: "git", path: "audio/ALM/xxx.mp3" }
// 를 넣는다. (향후 storage_type: "gdrive", file_id: "..." — 서버리스 프록시 필요)

const EN_PHASES = [
  { phase: 1, months: [1, 3], title: "영어가 무섭지 않게", goal: "자기소개·업무소개·숫자·회의 기본 표현" },
  { phase: 2, months: [4, 6], title: "업무내용 영어 설명", goal: "보고·진행상황·시장·유동성·조달 설명" },
  { phase: 3, months: [7, 9], title: "영어회의 참여", goal: "의견·질문·동의/반대·정리·금리 전망" },
  { phase: 4, months: [10, 12], title: "실제 업무회의 대응", goal: "감독당국 미팅·임원 보고·발표와 Q&A" }
];

const EN_CATEGORIES = [
  { id: "daily", label: "기초·일상", emoji: "☕" },
  { id: "business", label: "업무영어", emoji: "💼" },
  { id: "meeting", label: "회의영어", emoji: "🗣" },
  { id: "alm", label: "금융·ALM", emoji: "🏦" }
];

const EN_LESSONS = [
  // ───────── Phase 1 ─────────
  {
    id: "p1-self-intro", phase: 1, category: "daily", level: "Beginner", emoji: "👋",
    title: "첫 만남 자기소개",
    situation: "해외 금융기관 담당자를 처음 만나 악수하며 인사하는 자리.",
    sentences: [
      { en: "Hi, I'm Jihoon Park from Shinhan Bank. It's a pleasure to meet you.", ko: "안녕하세요, 신한은행의 박지훈입니다. 만나서 반갑습니다.",
        note: "이름과 소속을 한 문장에 묶는다. 이름은 내 이름으로 바꿔 말한다. 'It's a pleasure to meet you'는 'Nice to meet you'보다 격식 있다.",
        expr: [["It's a pleasure to meet you.", "만나서 반갑습니다 (격식)"], ["from + 회사명", "~ 소속의"]] },
      { en: "I work in the ALM team, which manages the bank's liquidity and interest rate risk.", ko: "저는 ALM팀에서 일하는데, 은행의 유동성과 금리리스크를 관리하는 부서입니다.",
        note: "부서명만 말하면 상대가 모를 수 있다. which 절로 부서가 하는 일을 한 줄 덧붙인다.",
        expr: [["I work in the ~ team", "~팀에서 일합니다"], ["which manages ~", "~을 관리하는 (부서 설명)"]] },
      { en: "I've been with the bank for about fifteen years.", ko: "은행에서 일한 지 15년 정도 됐습니다.",
        note: "현재완료(have been)는 '과거부터 지금까지 계속'을 뜻한다. 근속연수를 말할 때 쓴다.",
        expr: [["I've been with ~ for ~ years", "~에서 ~년째 근무 중"], ["about + 숫자", "~ 정도"]] }
    ],
    variation: { template: "I work in the ___ team, which ___.", hint: "내 부서 이름과 그 부서가 하는 일을 넣어 말해 보세요." }
  },
  {
    id: "p1-job-intro", phase: 1, category: "business", level: "Beginner", emoji: "💼",
    title: "내 업무 1분 소개",
    situation: "해외법인 담당자가 '어떤 일을 하세요?'라고 물었다. 1분 안에 설명해야 한다.",
    sentences: [
      { en: "My main role is to monitor the bank's liquidity position on a daily basis.", ko: "제 주 업무는 은행의 유동성 포지션을 매일 모니터링하는 것입니다.",
        note: "'My main role is to + 동사원형'은 업무 소개의 가장 무난한 시작 문장이다.",
        expr: [["My main role is to ~", "제 주요 역할은 ~입니다"], ["on a daily basis", "매일, 일 단위로"]] },
      { en: "I also prepare monthly reports for senior management.", ko: "경영진을 위한 월간 보고서도 작성합니다.",
        note: "'write a report'보다 'prepare a report'가 업무 맥락에서 더 자연스럽다.",
        expr: [["prepare a report", "보고서를 작성하다"], ["senior management", "경영진"]] },
      { en: "Basically, I help the bank make sure it has enough funding at all times.", ko: "쉽게 말해, 은행이 항상 충분한 자금을 확보하도록 돕는 일입니다.",
        note: "전문용어로 설명한 뒤 'Basically,'로 쉬운 요약을 붙이면 비전문가도 이해한다.",
        expr: [["Basically, ~", "쉽게 말하면 (요약 신호)"], ["make sure ~", "~을 확실히 하다"]] }
    ],
    variation: { template: "My main role is to ___ on a daily basis.", hint: "내가 매일 하는 핵심 업무 한 가지를 넣어 보세요." }
  },
  {
    id: "p1-clarify", phase: 1, category: "daily", level: "Beginner", emoji: "🙋",
    title: "다시 말해 주세요",
    situation: "상대가 너무 빨리 말해서 잘 못 알아들었다. 당황하지 말고 다시 요청한다.",
    sentences: [
      { en: "Sorry, could you say that again, please?", ko: "죄송하지만, 다시 한번 말씀해 주시겠어요?",
        note: "'What?'이나 'Pardon?' 단독은 무례하거나 어색하게 들릴 수 있다. 'Sorry,'를 쿠션으로 붙인다.",
        expr: [["Could you say that again?", "다시 말씀해 주시겠어요?"], ["Sorry, ~", "(끼어들 때 쓰는 쿠션어)"]] },
      { en: "Could you speak a little more slowly? English isn't my first language.", ko: "조금만 천천히 말씀해 주시겠어요? 영어가 모국어가 아니라서요.",
        note: "이유를 한 문장 덧붙이면 상대가 기꺼이 속도를 늦춘다. 부끄러운 말이 아니다.",
        expr: [["a little more slowly", "조금 더 천천히"], ["my first language", "모국어"]] },
      { en: "Just to make sure I understood, you mean the deadline is next Friday?", ko: "제가 제대로 이해했는지 확인하려고요, 마감이 다음 주 금요일이라는 말씀이시죠?",
        note: "이해한 내용을 되짚어 확인하는 문장. 숫자·날짜는 반드시 이렇게 확인하는 습관을 들인다.",
        expr: [["Just to make sure I understood, ~", "제가 이해한 게 맞는지 확인하자면"], ["You mean ~?", "~라는 말씀이시죠?"]] }
    ],
    variation: { template: "Just to make sure I understood, you mean ___?", hint: "최근 회의에서 확인하고 싶었던 내용을 넣어 보세요." }
  },
  {
    id: "p1-numbers", phase: 1, category: "business", level: "Beginner", emoji: "🔢",
    title: "숫자·금액 말하기",
    situation: "금액과 규모를 영어로 말해야 한다. 억·조 단위를 million·billion으로 바꾸는 연습. (예문 수치는 연습용)",
    sentences: [
      { en: "The total amount is 350 billion won.", ko: "총 금액은 3,500억 원입니다.",
        note: "1억 = 100 million, 10억 = 1 billion, 1,000억 = 100 billion, 1조 = 1 trillion. '억'을 만나면 0을 8개 붙여 세 자리씩 끊어 읽는다.",
        expr: [["billion", "십억 (10⁹)"], ["trillion", "조 (10¹²)"]] },
      { en: "That's roughly 250 million US dollars.", ko: "대략 2억 5천만 달러입니다.",
        note: "원화 금액을 말한 뒤 달러 환산을 덧붙이면 해외 상대가 규모를 바로 이해한다.",
        expr: [["roughly", "대략"], ["250 million", "2억 5천만"]] },
      { en: "The figure increased from 1.2 billion to 1.5 billion.", ko: "수치가 12억에서 15억으로 증가했습니다.",
        note: "1.2 billion은 'one point two billion'으로 읽는다. 'from A to B'로 변화 전후를 함께 말한다.",
        expr: [["increase from A to B", "A에서 B로 증가하다"], ["the figure", "(보고서 속) 수치"]] }
    ],
    variation: { template: "The total amount is ___ won.", hint: "최근 다룬 금액을 billion/trillion 단위로 바꿔 말해 보세요." }
  },
  {
    id: "p1-ratio-date", phase: 1, category: "business", level: "Beginner", emoji: "📅",
    title: "비율·bp·날짜",
    situation: "비율 변화, 금리 변화, 마감일을 정확히 말해야 한다. (예문 수치는 연습용)",
    sentences: [
      { en: "The ratio went up by 0.5 percentage points to 105 percent.", ko: "비율이 0.5%p 상승해 105%가 됐습니다.",
        note: "%와 %p를 꼭 구분한다. 'by'는 변화폭, 'to'는 도달한 수준이다.",
        expr: [["percentage points", "%p (퍼센트포인트)"], ["go up by A to B", "A만큼 올라 B가 되다"]] },
      { en: "Interest rates were cut by 25 basis points.", ko: "금리가 25bp 인하되었습니다.",
        note: "1bp = 0.01%p. 금리 대화에서는 bp로 말하는 것이 기본이다. 'bips'라고 줄여 말하기도 한다.",
        expr: [["basis points (bp)", "0.01%p"], ["be cut by ~", "~만큼 인하되다"]] },
      { en: "The report is due on the 30th of September.", ko: "보고서 마감은 9월 30일입니다.",
        note: "날짜는 서수(30th)로 읽는다. 'September 30th'도 같은 뜻이다.",
        expr: [["be due on ~", "~이 마감이다"], ["the 30th of September", "9월 30일 (서수로 읽기)"]] }
    ],
    variation: { template: "The ratio went up by ___ to ___.", hint: "내가 관리하는 지표 하나의 최근 변화를 말해 보세요." }
  },
  {
    id: "p1-small-talk", phase: 1, category: "daily", level: "Beginner", emoji: "☕",
    title: "회의 전 스몰토크",
    situation: "회의 시작 전, 한국을 방문한 해외 담당자와 가볍게 대화한다.",
    sentences: [
      { en: "How was your flight?", ko: "비행은 어떠셨어요?",
        note: "출장 온 손님에게 가장 무난한 첫 질문. 답이 오면 'Glad to hear that.'으로 받는다.",
        expr: [["How was ~?", "~는 어땠어요?"], ["Glad to hear that.", "다행이네요"]] },
      { en: "Is this your first time in Seoul?", ko: "서울은 처음이신가요?",
        note: "'Have you been to Seoul before?'로 바꿔 말해도 된다.",
        expr: [["Is this your first time in ~?", "~는 처음이세요?"], ["Have you been to ~ before?", "~에 와 보신 적 있으세요?"]] },
      { en: "If you have time, I'd recommend trying some Korean barbecue.", ko: "시간 되시면 한국식 바비큐를 꼭 드셔 보세요.",
        note: "'I'd recommend + ~ing'로 추천한다. 'You must try'보다 부드럽다.",
        expr: [["If you have time, ~", "시간이 되시면"], ["I'd recommend ~ing", "~해 보시길 추천해요"]] }
    ],
    variation: { template: "If you have time, I'd recommend ___.", hint: "우리 회사 근처 추천 장소나 음식을 넣어 보세요." }
  },
  {
    id: "p1-video-call", phase: 1, category: "daily", level: "Beginner", emoji: "💻",
    title: "화상회의 기본",
    situation: "Teams/Zoom 회의 접속 직후. 소리와 화면 공유를 확인한다.",
    sentences: [
      { en: "Can you hear me okay?", ko: "제 목소리 잘 들리세요?",
        note: "접속 직후 첫마디. 상대가 안 들리면 'I can't hear you.'라고 말한다.",
        expr: [["Can you hear me okay?", "잘 들리세요?"], ["I can't hear you.", "잘 안 들려요"]] },
      { en: "Sorry, I think you're on mute.", ko: "죄송한데, 음소거 상태이신 것 같아요.",
        note: "'I think'를 붙이면 지적이 부드러워진다.",
        expr: [["be on mute", "음소거 상태다"], ["I think ~", "~인 것 같아요 (완곡)"]] },
      { en: "Let me share my screen.", ko: "제 화면을 공유하겠습니다.",
        note: "'Let me ~'는 '제가 ~할게요'라는 뜻으로 회의 진행에 자주 쓴다.",
        expr: [["Let me ~", "제가 ~할게요"], ["share my screen", "화면을 공유하다"]] }
    ],
    variation: { template: "Let me ___.", hint: "회의 중 내가 할 행동을 넣어 보세요. (예: walk you through the numbers)" }
  },
  {
    id: "p1-meeting-basics", phase: 1, category: "meeting", level: "Beginner", emoji: "🗓",
    title: "회의 시작·안건 소개",
    situation: "내가 회의를 주재한다. 시작을 알리고 목적과 안건을 소개한다.",
    sentences: [
      { en: "Shall we get started?", ko: "시작할까요?",
        note: "회의를 여는 가장 자연스러운 한마디.",
        expr: [["Shall we ~?", "~할까요?"], ["get started", "시작하다"]] },
      { en: "The purpose of today's meeting is to review our funding plan.", ko: "오늘 회의의 목적은 자금조달 계획을 검토하는 것입니다.",
        note: "목적을 먼저 말하면 영어가 서툴러도 회의 흐름을 잡을 수 있다.",
        expr: [["The purpose of ~ is to ~", "~의 목적은 ~입니다"], ["review", "검토하다"]] },
      { en: "Let's move on to the next item.", ko: "다음 안건으로 넘어가겠습니다.",
        note: "안건(agenda item)을 전환할 때 쓴다.",
        expr: [["move on to ~", "~로 넘어가다"], ["item", "안건 (agenda item)"]] }
    ],
    variation: { template: "The purpose of today's meeting is to ___.", hint: "다음 회의의 목적을 영어로 말해 보세요." }
  },

  // ───────── Phase 2 ─────────
  {
    id: "p2-business-trip", phase: 2, category: "daily", level: "Beginner", emoji: "✈️",
    title: "출장: 공항·호텔",
    situation: "해외 출장 첫날. 입국 심사와 호텔 체크인.",
    sentences: [
      { en: "I'm here on a business trip for three days.", ko: "3일간 출장으로 왔습니다.",
        note: "입국 심사에서 방문 목적을 물으면 이 한 문장이면 충분하다.",
        expr: [["on a business trip", "출장으로"], ["for three days", "3일 동안"]] },
      { en: "I have a reservation under the name Park.", ko: "박이라는 이름으로 예약했습니다.",
        note: "'under the name ~'은 예약 확인 때 쓰는 고정 표현이다.",
        expr: [["I have a reservation", "예약했습니다"], ["under the name ~", "~ 이름으로"]] },
      { en: "Could I get a late checkout?", ko: "레이트 체크아웃 가능할까요?",
        note: "'Could I get ~?'은 요청할 때 정중하고 간단하다.",
        expr: [["Could I get ~?", "~해 주실 수 있나요?"], ["late checkout", "늦은 체크아웃"]] }
    ],
    variation: { template: "Could I get ___?", hint: "출장지에서 요청할 것을 넣어 보세요. (예: a receipt, a taxi)" }
  },
  {
    id: "p2-business-dinner", phase: 2, category: "daily", level: "Intermediate", emoji: "🍽",
    title: "업무 저녁식사",
    situation: "해외 거래 기관 담당자들과 저녁 식사. 감사 인사와 마무리.",
    sentences: [
      { en: "Thank you for taking the time to meet us.", ko: "시간 내 주셔서 감사합니다.",
        note: "만남의 시작과 끝 어디에 써도 좋은 감사 표현.",
        expr: [["take the time to ~", "시간을 내서 ~하다"], ["Thank you for ~ing", "~해 주셔서 감사합니다"]] },
      { en: "What would you recommend here?", ko: "여기서 뭘 추천하시나요?",
        note: "상대가 고른 식당이라면 메뉴 추천을 부탁하는 것 자체가 좋은 대화 소재다.",
        expr: [["What would you recommend?", "뭘 추천하세요?"]] },
      { en: "Let's keep in touch.", ko: "계속 연락하고 지내요.",
        note: "헤어질 때 관계를 이어가자는 인사.",
        expr: [["keep in touch", "연락을 유지하다"]] }
    ],
    variation: { template: "Thank you for ___.", hint: "상대에게 고마운 점을 ~ing 형태로 넣어 보세요." }
  },
  {
    id: "p2-explain-report", phase: 2, category: "business", level: "Intermediate", emoji: "📄",
    title: "보고서·장표 설명",
    situation: "영어로 만든 슬라이드를 한 장씩 설명한다.",
    sentences: [
      { en: "This slide shows the trend of our deposit balance over the past year.", ko: "이 슬라이드는 지난 1년간 예수금 잔액 추이를 보여 줍니다.",
        note: "모든 슬라이드를 'This slide shows ~'로 시작하면 발표가 안정된다.",
        expr: [["This slide shows ~", "이 슬라이드는 ~을 보여 줍니다"], ["over the past year", "지난 1년 동안"]] },
      { en: "As you can see, the balance has been stable since June.", ko: "보시다시피 6월 이후 잔액이 안정적입니다.",
        note: "차트를 가리키며 쓰는 표현. since는 현재완료와 함께 쓴다.",
        expr: [["As you can see, ~", "보시다시피"], ["since June", "6월 이후로"]] },
      { en: "The key takeaway is that our funding structure is well diversified.", ko: "핵심은 자금조달 구조가 잘 분산되어 있다는 점입니다.",
        note: "슬라이드 끝에서 핵심 메시지를 한 문장으로 정리한다.",
        expr: [["The key takeaway is that ~", "핵심 메시지는 ~입니다"], ["well diversified", "잘 분산된"]] }
    ],
    variation: { template: "The key takeaway is that ___.", hint: "최근 내 보고서의 핵심 메시지를 한 문장으로 말해 보세요." }
  },
  {
    id: "p2-status-update", phase: 2, category: "business", level: "Intermediate", emoji: "✅",
    title: "진행상황 보고",
    situation: "해외법인과 함께하는 프로젝트의 진행상황을 공유한다.",
    sentences: [
      { en: "We're on track to finish the project by the end of the month.", ko: "월말까지 프로젝트를 마칠 수 있도록 순조롭게 진행 중입니다.",
        note: "'on track'은 계획대로 가고 있다는 뜻. 반대는 'behind schedule'.",
        expr: [["be on track to ~", "~하도록 계획대로 진행 중"], ["by the end of the month", "월말까지"]] },
      { en: "We've run into a small issue with the data.", ko: "데이터에 작은 문제가 생겼습니다.",
        note: "문제를 알릴 때 'small'을 붙여 과장 없이 전달한다.",
        expr: [["run into an issue", "문제에 부딪히다"], ["behind schedule", "일정보다 늦은"]] },
      { en: "I'll send you an update by Wednesday.", ko: "수요일까지 업데이트 드리겠습니다.",
        note: "다음 공유 시점을 약속하며 마무리한다.",
        expr: [["send an update", "진행상황을 공유하다"], ["by Wednesday", "수요일까지"]] }
    ],
    variation: { template: "We're on track to ___ by ___.", hint: "지금 진행 중인 업무와 목표 시점을 넣어 보세요." }
  },
  {
    id: "p2-market-update", phase: 2, category: "alm", level: "Intermediate", emoji: "📈",
    title: "시장 상황 설명",
    situation: "해외 담당자에게 최근 금융시장 흐름을 짧게 설명한다. (예문은 연습용이며 실제 시황이 아님)",
    sentences: [
      { en: "Market volatility has increased due to uncertainty about the Fed's policy.", ko: "연준 정책 불확실성 때문에 시장 변동성이 커졌습니다.",
        note: "'due to + 명사'로 원인을 붙인다. the Fed = 미 연준.",
        expr: [["volatility", "변동성"], ["due to ~", "~ 때문에"]] },
      { en: "The won weakened against the dollar last week.", ko: "지난주 원화가 달러 대비 약세를 보였습니다.",
        note: "통화 강세/약세는 strengthen/weaken against로 표현한다.",
        expr: [["weaken against ~", "~ 대비 약세를 보이다"], ["strengthen against ~", "~ 대비 강세를 보이다"]] },
      { en: "Long-term bond yields have come down, so the curve has flattened.", ko: "장기 국채금리가 내려와 커브가 평탄화됐습니다.",
        note: "커브 모양 변화는 flatten(평탄화) / steepen(가팔라짐).",
        expr: [["bond yields", "채권 금리(수익률)"], ["the curve has flattened", "커브가 평탄화됐다 (↔ steepened)"]] }
    ],
    variation: { template: "___ has increased due to ___.", hint: "요즘 커진 시장 지표와 원인을 넣어 보세요." }
  },
  {
    id: "p2-liquidity", phase: 2, category: "alm", level: "Intermediate", emoji: "💧",
    title: "유동성리스크 기본 설명",
    situation: "외국인 동료에게 유동성리스크와 우리 은행의 대응을 설명한다.",
    sentences: [
      { en: "Liquidity risk is the risk that we can't meet our payment obligations when they come due.", ko: "유동성리스크는 지급 의무를 만기에 이행하지 못할 위험입니다.",
        note: "정의를 말할 때는 'A is the risk that ~' 구조를 쓴다.",
        expr: [["meet obligations", "의무를 이행하다"], ["come due", "만기가 도래하다"]] },
      { en: "We hold high-quality liquid assets, such as government bonds, as a buffer.", ko: "국채 같은 고유동성자산을 완충 장치로 보유합니다.",
        note: "HQLA를 풀어서 말할 줄 알아야 한다. 'such as'로 예시를 든다.",
        expr: [["high-quality liquid assets (HQLA)", "고유동성자산"], ["as a buffer", "완충 장치로"]] },
      { en: "Our liquidity position remains comfortable.", ko: "유동성 포지션은 여전히 여유 있는 수준입니다.",
        note: "'remain + 형용사'로 상태가 유지되고 있음을 말한다.",
        expr: [["remain comfortable", "여유 있는 상태를 유지하다"], ["liquidity position", "유동성 포지션"]] }
    ],
    variation: { template: "Our ___ remains ___.", hint: "내가 관리하는 지표의 현재 상태를 넣어 보세요." }
  },
  {
    id: "p2-funding", phase: 2, category: "alm", level: "Intermediate", emoji: "🏦",
    title: "자금조달 구조 설명",
    situation: "은행의 자금조달 구조와 조달비용 변화를 설명한다.",
    sentences: [
      { en: "Most of our funding comes from retail deposits.", ko: "자금조달 대부분은 소매 예금에서 나옵니다.",
        note: "'funding comes from ~'은 조달원을 말하는 기본 문장이다.",
        expr: [["funding comes from ~", "자금이 ~에서 조달되다"], ["retail deposits", "소매(개인) 예금"]] },
      { en: "We also issue bank debentures to secure long-term funding.", ko: "장기 자금 확보를 위해 은행채도 발행합니다.",
        note: "은행채는 bank debentures 또는 bank bonds.",
        expr: [["issue bonds", "채권을 발행하다"], ["secure funding", "자금을 확보하다"]] },
      { en: "Funding costs have gone up as deposit rates rose.", ko: "예금금리가 오르면서 조달비용이 상승했습니다.",
        note: "'as'는 '~하면서, ~함에 따라'라는 원인·동시 진행을 나타낸다.",
        expr: [["funding costs", "조달비용"], ["as ~", "~함에 따라"]] }
    ],
    variation: { template: "Most of our funding comes from ___.", hint: "우리 은행의 주요 조달원을 넣어 보세요." }
  },

  // ───────── Phase 3 ─────────
  {
    id: "p3-opinion", phase: 3, category: "meeting", level: "Intermediate", emoji: "💬",
    title: "의견 말하기",
    situation: "영어 회의에서 내 의견을 분명하지만 부드럽게 말한다.",
    sentences: [
      { en: "In my opinion, we should wait until the data is confirmed.", ko: "제 생각에는 데이터가 확정될 때까지 기다리는 게 좋겠습니다.",
        note: "의견의 시작을 알리는 신호어를 먼저 말하면 발언권을 잡기 쉽다.",
        expr: [["In my opinion, ~", "제 생각에는"], ["wait until ~", "~할 때까지 기다리다"]] },
      { en: "I think it would be better to take a more conservative approach.", ko: "좀 더 보수적인 접근을 하는 게 나을 것 같습니다.",
        note: "'it would be better to ~'는 제안을 부드럽게 만든다.",
        expr: [["it would be better to ~", "~하는 편이 낫겠다"], ["a conservative approach", "보수적 접근"]] },
      { en: "From a risk perspective, this could be a concern.", ko: "리스크 관점에서 이건 우려될 수 있습니다.",
        note: "내 전문 분야의 관점을 앞세우면 의견에 무게가 실린다.",
        expr: [["From a ~ perspective, ~", "~ 관점에서"], ["a concern", "우려 사항"]] }
    ],
    variation: { template: "From a ___ perspective, ___.", hint: "내 업무 관점(risk, liquidity, cost 등)에서 의견을 말해 보세요." }
  },
  {
    id: "p3-agree-disagree", phase: 3, category: "meeting", level: "Intermediate", emoji: "🤝",
    title: "동의·반대하기",
    situation: "상대 의견에 동의하거나, 예의 있게 반대 의견을 낸다.",
    sentences: [
      { en: "I agree with you on that point.", ko: "그 점에 대해서는 동의합니다.",
        note: "'on that point'를 붙이면 부분 동의임을 드러낼 수 있다.",
        expr: [["I agree with you on ~", "~에 대해 동의합니다"]] },
      { en: "I see your point, but I have a slightly different view.", ko: "말씀하신 취지는 알겠지만, 저는 조금 다르게 봅니다.",
        note: "먼저 인정하고(I see your point) 반대하는 것이 영어 회의의 기본 예절이다.",
        expr: [["I see your point, but ~", "무슨 말인지 알지만 ~ (부드러운 반대)"], ["a slightly different view", "약간 다른 견해"]] },
      { en: "I'm not sure that's the best option, considering the cost.", ko: "비용을 고려하면 그게 최선인지 잘 모르겠습니다.",
        note: "'I'm not sure ~'는 직접적인 'No'를 피하는 완곡한 반대다.",
        expr: [["I'm not sure ~", "~인지 잘 모르겠다 (완곡한 반대)"], ["considering ~", "~을 고려하면"]] }
    ],
    variation: { template: "I see your point, but ___.", hint: "최근 회의에서 반대하고 싶었던 의견을 넣어 보세요." }
  },
  {
    id: "p3-questions", phase: 3, category: "meeting", level: "Intermediate", emoji: "❓",
    title: "질문하기",
    situation: "발표를 들은 뒤 가정과 시나리오에 대해 질문한다.",
    sentences: [
      { en: "Can I ask a quick question?", ko: "잠깐 질문 하나 드려도 될까요?",
        note: "끼어들기 전에 허락을 구하는 한마디.",
        expr: [["Can I ask a quick question?", "짧게 질문해도 될까요?"]] },
      { en: "Could you give us more details on the assumptions?", ko: "가정에 대해 좀 더 자세히 설명해 주시겠어요?",
        note: "숫자 발표를 들었다면 가정(assumptions)을 묻는 것이 가장 좋은 질문이다.",
        expr: [["give more details on ~", "~에 대해 자세히 설명하다"], ["assumptions", "가정"]] },
      { en: "What would happen if rates went up by another 50 basis points?", ko: "금리가 50bp 더 오르면 어떻게 되나요?",
        note: "가정법(would + 과거형)으로 시나리오 질문을 한다.",
        expr: [["What would happen if ~?", "만약 ~하면 어떻게 될까요?"], ["another 50 basis points", "50bp 추가로"]] }
    ],
    variation: { template: "What would happen if ___?", hint: "내가 궁금한 시나리오를 넣어 보세요." }
  },
  {
    id: "p3-summarize", phase: 3, category: "meeting", level: "Intermediate", emoji: "📝",
    title: "정리·확인하기",
    situation: "회의가 끝나갈 때 논의 내용과 담당자를 정리한다.",
    sentences: [
      { en: "Let me summarize what we've discussed so far.", ko: "지금까지 논의한 내용을 정리해 보겠습니다.",
        note: "영어가 완벽하지 않아도 정리를 맡으면 회의 주도권을 잡을 수 있다.",
        expr: [["Let me summarize ~", "~을 정리하겠습니다"], ["so far", "지금까지"]] },
      { en: "So, the action items are as follows.", ko: "그럼, 후속 조치 사항은 다음과 같습니다.",
        note: "이어서 'First, ~ Second, ~'로 나열한다.",
        expr: [["action items", "후속 조치 사항"], ["as follows", "다음과 같이"]] },
      { en: "Could you clarify who will be responsible for this?", ko: "이건 누가 담당할지 명확히 해 주시겠어요?",
        note: "담당자가 모호하면 반드시 확인한다.",
        expr: [["clarify", "명확히 하다"], ["be responsible for ~", "~을 담당하다"]] }
    ],
    variation: { template: "Let me summarize ___.", hint: "오늘 회의 결론을 한 문장으로 정리해 보세요." }
  },
  {
    id: "p3-scheduling", phase: 3, category: "daily", level: "Intermediate", emoji: "📆",
    title: "일정 조율",
    situation: "전화나 메신저로 다음 미팅 일정을 잡는다.",
    sentences: [
      { en: "Would Tuesday afternoon work for you?", ko: "화요일 오후 괜찮으세요?",
        note: "'Would ~ work for you?'는 일정 제안의 정석.",
        expr: [["Would ~ work for you?", "~ 괜찮으세요?"]] },
      { en: "I'm afraid I have another meeting at that time.", ko: "죄송하지만 그 시간에 다른 회의가 있습니다.",
        note: "'I'm afraid ~'로 시작하면 거절이 부드러워진다.",
        expr: [["I'm afraid ~", "유감이지만 ~ (완곡한 거절)"]] },
      { en: "Let's reschedule for next week.", ko: "다음 주로 일정을 다시 잡죠.",
        note: "reschedule for + 새 시점.",
        expr: [["reschedule for ~", "~로 일정을 변경하다"]] }
    ],
    variation: { template: "Would ___ work for you?", hint: "가능한 요일·시간을 넣어 제안해 보세요." }
  },
  {
    id: "p3-rate-outlook", phase: 3, category: "alm", level: "Intermediate", emoji: "🔮",
    title: "금리 전망 말하기",
    situation: "외국계 기관과 금리 전망을 주고받는다. (예문은 연습용이며 실제 전망이 아님)",
    sentences: [
      { en: "We expect the Bank of Korea to cut rates once more this year.", ko: "한국은행이 올해 한 번 더 금리를 인하할 것으로 예상합니다.",
        note: "'We expect A to + 동사'로 전망을 말한다. 개인이 아닌 조직 의견은 We로.",
        expr: [["We expect A to ~", "A가 ~할 것으로 예상합니다"], ["cut rates", "금리를 인하하다"]] },
      { en: "The market is already pricing in a rate cut.", ko: "시장은 이미 금리 인하를 가격에 반영하고 있습니다.",
        note: "'price in'은 기대가 이미 가격에 반영됐다는 시장 용어다.",
        expr: [["price in ~", "~을 가격에 반영하다"]] },
      { en: "The main risk to our view is a rebound in inflation.", ko: "저희 전망의 주요 리스크는 물가 반등입니다.",
        note: "전망을 말한 뒤 리스크를 함께 말하면 신뢰도가 올라간다.",
        expr: [["The main risk to our view is ~", "전망의 주된 리스크는 ~"], ["a rebound in ~", "~의 반등"]] }
    ],
    variation: { template: "We expect ___ to ___.", hint: "내가 보는 전망 하나를 넣어 보세요." }
  },

  // ───────── Phase 4 ─────────
  {
    id: "p4-lcr-nsfr", phase: 4, category: "alm", level: "Advanced", emoji: "🛡",
    title: "LCR·NSFR 설명 (감독당국 미팅)",
    situation: "해외 감독당국과의 미팅에서 유동성 규제비율 현황을 설명한다. (예문은 연습용)",
    sentences: [
      { en: "Our LCR has consistently stayed above the regulatory minimum of 100 percent.", ko: "당행 LCR은 규제 최저 기준인 100%를 꾸준히 상회해 왔습니다.",
        note: "감독당국 앞에서는 추세(consistently)와 기준(regulatory minimum)을 함께 말한다.",
        expr: [["consistently", "꾸준히"], ["the regulatory minimum", "규제 최저 기준"]] },
      { en: "The NSFR measures whether we have enough stable funding over a one-year horizon.", ko: "NSFR은 1년 기간 동안 충분한 안정적 자금을 보유하는지를 측정합니다.",
        note: "지표의 정의를 'measures whether ~'로 설명한다.",
        expr: [["stable funding", "안정적 자금조달"], ["over a one-year horizon", "1년 기간에 걸쳐"]] },
      { en: "We run stress tests every month to check our resilience.", ko: "복원력을 점검하기 위해 매달 스트레스 테스트를 실시합니다.",
        note: "stress test는 'run' 또는 'conduct'와 함께 쓴다.",
        expr: [["run stress tests", "스트레스 테스트를 실시하다"], ["resilience", "복원력"]] }
    ],
    variation: { template: "We run ___ every ___ to ___.", hint: "내가 정기적으로 하는 점검 업무를 넣어 보세요." }
  },
  {
    id: "p4-irrbb", phase: 4, category: "alm", level: "Advanced", emoji: "⚖️",
    title: "금리리스크(IRRBB) 설명",
    situation: "해외법인 ALM 담당자와 금리리스크 측정 방식을 논의한다. (예문 수치는 연습용)",
    sentences: [
      { en: "We measure interest rate risk using both EVE and NII sensitivity.", ko: "금리리스크는 EVE와 NII 민감도 두 가지로 측정합니다.",
        note: "EVE = Economic Value of Equity, NII = Net Interest Income.",
        expr: [["using both A and B", "A와 B 둘 다를 이용해"], ["sensitivity", "민감도"]] },
      { en: "A 100 basis point rise in rates would reduce our NII by about 2 percent.", ko: "금리가 100bp 오르면 NII가 약 2% 감소합니다.",
        note: "시나리오 결과는 'would + 동사 + by 폭'으로 말한다.",
        expr: [["a 100 basis point rise", "100bp 상승"], ["reduce ~ by ~", "~을 ~만큼 감소시키다"]] },
      { en: "The main driver is the repricing gap in the short-term bucket.", ko: "주된 요인은 단기 구간의 금리재조정 갭입니다.",
        note: "원인을 말할 때 'The main driver is ~'가 간결하다.",
        expr: [["The main driver is ~", "주요 원인은 ~"], ["repricing gap", "금리재조정 갭"]] }
    ],
    variation: { template: "The main driver is ___.", hint: "최근 지표 변화의 주요 원인을 넣어 보세요." }
  },
  {
    id: "p4-exec-report", phase: 4, category: "business", level: "Advanced", emoji: "👔",
    title: "외국인 임원 보고",
    situation: "외국인 임원에게 결론부터 보고하고 승인을 요청한다. (예문 수치는 연습용)",
    sentences: [
      { en: "Let me start with the bottom line.", ko: "결론부터 말씀드리겠습니다.",
        note: "임원 보고는 결론 먼저. 'bottom line'은 핵심·결론이다.",
        expr: [["the bottom line", "결론, 핵심"], ["Let me start with ~", "~부터 말씀드리겠습니다"]] },
      { en: "We recommend increasing our long-term funding by 10 percent.", ko: "장기 조달을 10% 늘릴 것을 권고드립니다.",
        note: "recommend 뒤에는 ~ing 형태가 온다.",
        expr: [["We recommend ~ing", "~할 것을 권고합니다"]] },
      { en: "We'd like your approval to proceed.", ko: "진행할 수 있도록 승인 부탁드립니다.",
        note: "보고의 마지막은 원하는 결정을 분명히 요청한다.",
        expr: [["We'd like your approval to ~", "~하도록 승인 부탁드립니다"], ["proceed", "진행하다"]] }
    ],
    variation: { template: "We recommend ___.", hint: "내가 제안하고 싶은 조치를 ~ing 형태로 넣어 보세요." }
  },
  {
    id: "p4-presentation", phase: 4, category: "business", level: "Advanced", emoji: "🎤",
    title: "발표와 Q&A",
    situation: "5~10분 영어 발표. 오프닝, 모르는 질문 대응, 마무리.",
    sentences: [
      { en: "Today, I'd like to walk you through our ALM strategy for next year.", ko: "오늘은 내년 ALM 전략을 차근차근 설명드리겠습니다.",
        note: "'walk you through'는 '하나씩 안내하다'라는 발표 오프닝 표현이다.",
        expr: [["walk you through ~", "~을 차근차근 설명하다"], ["I'd like to ~", "~하고자 합니다"]] },
      { en: "That's a great question. Let me get back to you on that.", ko: "좋은 질문입니다. 확인 후 다시 답변드리겠습니다.",
        note: "바로 답하기 어려운 질문에 대한 안전한 대응. 추측으로 답하지 않는다.",
        expr: [["That's a great question.", "좋은 질문입니다"], ["Let me get back to you on that.", "확인 후 다시 알려드릴게요"]] },
      { en: "To wrap up, our priority is to keep the balance sheet stable.", ko: "마무리하자면, 저희의 우선순위는 대차대조표를 안정적으로 유지하는 것입니다.",
        note: "마무리 신호어로 청중의 주의를 다시 모은다.",
        expr: [["To wrap up, ~", "마무리하자면"], ["our priority is to ~", "우리의 우선순위는 ~"]] }
    ],
    variation: { template: "To wrap up, ___.", hint: "내 발표의 마지막 한 문장을 만들어 보세요." }
  }
];

// Role Play 시나리오 — 상대방 대사 · 한국어 힌트 · 모범답안 · 핵심 키워드("a|b" = 둘 중 하나)
const EN_ROLEPLAYS = [
  {
    id: "rp-liquidity-meeting", emoji: "💧", title: "해외은행 ALM 담당자와 유동성 회의",
    partner: "Emma · 싱가포르 지점 ALM 헤드", phase: 2,
    turns: [
      { say: "Hi, thanks for joining. Could you give us a quick overview of your liquidity position?", ko: "참석 감사합니다. 유동성 포지션을 간단히 설명해 주시겠어요?",
        hint: "유동성은 여유 있고, LCR이 규제 기준을 웃돈다고 답하기", model: "Sure. Our liquidity position remains comfortable, and our LCR is well above the regulatory minimum.", keywords: ["comfortable", "LCR", "above"] },
      { say: "What are your main sources of funding?", ko: "주요 조달원은 무엇인가요?",
        hint: "대부분 소매 예금이고, 장기 조달용으로 은행채도 발행한다고 답하기", model: "Most of our funding comes from retail deposits, and we also issue bank debentures for long-term funding.", keywords: ["deposits", "debentures|bonds", "long-term"] },
      { say: "How do you prepare for a stress scenario?", ko: "스트레스 상황에는 어떻게 대비하나요?",
        hint: "매달 스트레스 테스트를 하고, 국채 같은 버퍼를 보유한다고 답하기", model: "We run stress tests every month and hold government bonds as a liquidity buffer.", keywords: ["stress test", "every month|monthly", "buffer"] },
      { say: "Great. Shall we schedule a follow-up call next month?", ko: "좋네요. 다음 달에 후속 통화 일정을 잡을까요?",
        hint: "좋다고 하고, 다음 달 둘째 주가 괜찮은지 물어보기", model: "Sounds good. Would the second week of next month work for you?", keywords: ["sounds good|good", "work for you", "next month"] }
    ]
  },
  {
    id: "rp-exec-funding", emoji: "👔", title: "외국인 임원에게 Funding 상황 설명",
    partner: "Mr. Anderson · 외국인 부행장", phase: 4,
    turns: [
      { say: "So, what's the bottom line on our funding situation?", ko: "그래서 조달 상황의 결론이 뭔가요?",
        hint: "결론: 조달은 안정적이지만 비용이 올랐다", model: "The bottom line is that our funding is stable, but costs have gone up.", keywords: ["bottom line", "stable", "cost"] },
      { say: "Why have funding costs increased?", ko: "조달비용이 왜 올랐나요?",
        hint: "예금금리 상승과 예금 유치 경쟁 때문이라고 답하기", model: "Funding costs have gone up because deposit rates rose and competition for deposits increased.", keywords: ["deposit rates", "because|due to", "competition"] },
      { say: "What do you recommend?", ko: "무엇을 권고하나요?",
        hint: "차환 위험을 줄이기 위해 장기 조달을 늘리자고 권고하기", model: "We recommend increasing long-term funding to reduce refinancing risk.", keywords: ["recommend", "long-term", "risk"] },
      { say: "Okay. What do you need from me?", ko: "알겠어요. 제가 뭘 해 드리면 되죠?",
        hint: "채권 발행을 진행할 수 있도록 승인을 요청하기", model: "We'd like your approval to proceed with the bond issuance.", keywords: ["approval", "proceed"] }
    ]
  },
  {
    id: "rp-regulator", emoji: "🛡", title: "해외 감독당국과 LCR/NSFR 미팅",
    partner: "Ms. Chen · 감독당국 검사역", phase: 4,
    turns: [
      { say: "Can you explain how your LCR has changed over the past year?", ko: "지난 1년간 LCR이 어떻게 변했는지 설명해 주시겠어요?",
        hint: "꾸준히 100%를 넘었고 올해 소폭 상승했다고 답하기", model: "Our LCR has consistently stayed above 100 percent, and it went up slightly this year.", keywords: ["consistently", "100 percent|100%", "went up|increased|rose"] },
      { say: "What drives changes in your NSFR?", ko: "NSFR 변화의 요인은 무엇인가요?",
        hint: "주요 요인은 조달 만기 구조, 특히 장기 예금이라고 답하기", model: "The main driver is the maturity structure of our funding, especially long-term deposits.", keywords: ["main driver", "funding", "long-term"] },
      { say: "How often do you run liquidity stress tests?", ko: "유동성 스트레스 테스트는 얼마나 자주 하나요?",
        hint: "매달 하고 결과를 경영진에 보고한다고 답하기", model: "We run them every month and report the results to senior management.", keywords: ["every month|monthly", "report", "management"] },
      { say: "Are there any areas you plan to improve?", ko: "개선할 계획인 부분이 있나요?",
        hint: "조달원을 더 다변화할 계획이라고 답하기", model: "Yes, we plan to diversify our funding sources further.", keywords: ["plan to", "diversify"] }
    ]
  },
  {
    id: "rp-rate-outlook", emoji: "🔮", title: "외국계 금융기관과 금리 전망 회의",
    partner: "David · 외국계 증권사 이코노미스트", phase: 3,
    turns: [
      { say: "What's your view on Korean interest rates?", ko: "한국 금리에 대한 견해는 어떤가요?",
        hint: "한은이 점진적으로 금리를 인하할 것으로 예상한다고 말하기 (연습용 의견)", model: "We expect the Bank of Korea to cut rates gradually.", keywords: ["expect", "cut"] },
      { say: "Isn't the market already pricing that in?", ko: "시장이 이미 그걸 반영하고 있지 않나요?",
        hint: "부분적으로는 그렇다. 한 번은 반영됐지만 두 번째는 아니다", model: "Partly, yes. The market is already pricing in one cut, but not a second one.", keywords: ["partly|yes", "pricing in", "second"] },
      { say: "What's the main risk to your view?", ko: "그 전망의 주요 리스크는 뭔가요?",
        hint: "물가 반등이 주요 리스크라고 답하기", model: "The main risk to our view is a rebound in inflation.", keywords: ["main risk", "inflation"] },
      { say: "How would that affect your bank?", ko: "그러면 귀행에는 어떤 영향이 있나요?",
        hint: "금리가 높아지면 조달비용 부담이 커진다고 답하기", model: "Higher rates would put pressure on our funding costs.", keywords: ["funding cost", "pressure|increase|higher"] }
    ]
  },
  {
    id: "rp-business-trip", emoji: "✈️", title: "해외 출장 중 업무 대화",
    partner: "Sarah · 런던 지점 매니저", phase: 1,
    turns: [
      { say: "Welcome to London! How was your flight?", ko: "런던에 오신 걸 환영해요! 비행은 어떠셨어요?",
        hint: "길었지만 편했다, 초대해 줘서 고맙다고 답하기", model: "It was long, but comfortable. Thank you for having me.", keywords: ["long|comfortable|good", "thank you"] },
      { say: "Is this your first time visiting our office?", ko: "저희 사무실은 처음 방문하시는 건가요?",
        hint: "처음이고, 와서 정말 기쁘다고 답하기", model: "Yes, it's my first time. I'm really glad to be here.", keywords: ["first time", "glad|happy"] },
      { say: "Could you tell us a little about your team?", ko: "팀에 대해 조금 소개해 주시겠어요?",
        hint: "ALM팀이고 유동성과 금리리스크를 관리한다고 소개하기", model: "Sure. I work in the ALM team, which manages the bank's liquidity and interest rate risk.", keywords: ["ALM", "liquidity", "interest rate"] },
      { say: "Shall we go through today's agenda?", ko: "오늘 안건을 살펴볼까요?",
        hint: "시작하자고 하고, 오늘 목적은 조달 계획 공유라고 말하기", model: "Yes, let's get started. The purpose of today's meeting is to share our funding plans.", keywords: ["get started|start", "purpose"] }
    ]
  },
  {
    id: "rp-presentation-qa", emoji: "🎤", title: "영어 프레젠테이션 및 Q&A",
    partner: "사회자와 청중", phase: 4,
    turns: [
      { say: "Thank you for coming. The floor is yours.", ko: "와 주셔서 감사합니다. 이제 발표하시죠.",
        hint: "감사 인사 후, 내년 ALM 전략을 차근차근 설명하겠다고 오프닝하기", model: "Thank you. Today, I'd like to walk you through our ALM strategy for next year.", keywords: ["walk you through", "strategy"] },
      { say: "Could you explain why you expect deposit growth to slow down?", ko: "예금 증가세가 둔화될 거라고 보는 이유를 설명해 주시겠어요?",
        hint: "좋은 질문이라고 받고, 고객이 고금리 상품으로 이동 중이라고 답하기", model: "That's a great question. It's mainly because customers are moving money into higher-yielding products.", keywords: ["great question", "because|mainly", "higher"] },
      { say: "What's your NII sensitivity to a rate cut?", ko: "금리 인하에 대한 NII 민감도는 어느 정도인가요?",
        hint: "정확한 수치는 확인 후 답하겠지만 영향은 관리 가능한 수준이라고 답하기", model: "Let me get back to you on the exact figure, but the impact is manageable.", keywords: ["get back to you", "manageable"] },
      { say: "Any final remarks?", ko: "마지막으로 하실 말씀 있으신가요?",
        hint: "마무리 신호어와 함께 우선순위는 대차대조표 안정이라고 말하기", model: "To wrap up, our priority is to keep the balance sheet stable.", keywords: ["wrap up", "priority", "stable"] }
    ]
  }
];
