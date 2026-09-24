// 레시피 데이터. amount 는 기본 인분(servings) 기준 수치, 숫자가 아닌 분량은 amount: null + note 로 둔다.
const RECIPES = [
  {
    id: "kimchi-jjigae",
    title: "김치찌개",
    emoji: "🍲",
    category: "국·찌개",
    time: 30,
    level: "쉬움",
    servings: 2,
    desc: "잘 익은 김치와 돼지고기로 끓이는 가장 기본적인 집밥 찌개.",
    ingredients: [
      { name: "신김치", amount: 300, unit: "g" },
      { name: "돼지고기 앞다리살", amount: 200, unit: "g" },
      { name: "두부", amount: 0.5, unit: "모" },
      { name: "대파", amount: 0.5, unit: "대" },
      { name: "고춧가루", amount: 1, unit: "큰술" },
      { name: "다진 마늘", amount: 1, unit: "큰술" },
      { name: "김치 국물", amount: 100, unit: "ml" },
      { name: "물", amount: 500, unit: "ml" }
    ],
    steps: [
      { text: "냄비에 돼지고기를 넣고 중불에서 기름이 나올 때까지 볶는다." },
      { text: "김치를 넣고 김치가 투명해질 때까지 함께 볶는다.", timer: 5 },
      { text: "물, 김치 국물, 고춧가루, 다진 마늘을 넣고 끓인다." },
      { text: "끓어오르면 중약불로 줄여 푹 끓인다.", timer: 15 },
      { text: "두부와 대파를 넣고 한소끔 더 끓여 마무리한다.", timer: 3 }
    ],
    tip: "김치가 덜 익었다면 설탕을 반 작은술 넣으면 맛이 부드러워진다."
  },
  {
    id: "doenjang-jjigae",
    title: "된장찌개",
    emoji: "🥘",
    category: "국·찌개",
    time: 25,
    level: "쉬움",
    servings: 2,
    desc: "애호박, 두부, 감자를 넣은 구수한 된장찌개.",
    ingredients: [
      { name: "된장", amount: 2, unit: "큰술" },
      { name: "애호박", amount: 0.3, unit: "개" },
      { name: "감자", amount: 1, unit: "개" },
      { name: "두부", amount: 0.5, unit: "모" },
      { name: "양파", amount: 0.5, unit: "개" },
      { name: "청양고추", amount: 1, unit: "개" },
      { name: "멸치 육수", amount: 500, unit: "ml" }
    ],
    steps: [
      { text: "멸치 육수에 된장을 풀고 감자를 넣어 끓인다.", timer: 7 },
      { text: "양파와 애호박을 넣고 더 끓인다.", timer: 5 },
      { text: "두부와 청양고추를 넣고 한소끔 끓여 낸다.", timer: 3 }
    ],
    tip: "된장은 한 번에 다 넣지 말고 간을 보며 나눠 넣는다."
  },
  {
    id: "bulgogi",
    title: "소불고기",
    emoji: "🥩",
    category: "메인",
    time: 40,
    level: "보통",
    servings: 3,
    desc: "달콤짭짤한 간장 양념에 재운 부드러운 소불고기.",
    ingredients: [
      { name: "소고기 불고기용", amount: 500, unit: "g" },
      { name: "양파", amount: 1, unit: "개" },
      { name: "당근", amount: 0.3, unit: "개" },
      { name: "대파", amount: 1, unit: "대" },
      { name: "진간장", amount: 5, unit: "큰술" },
      { name: "설탕", amount: 2, unit: "큰술" },
      { name: "배 간 것", amount: 3, unit: "큰술" },
      { name: "다진 마늘", amount: 1, unit: "큰술" },
      { name: "참기름", amount: 1, unit: "큰술" },
      { name: "후추", amount: null, unit: "", note: "약간" }
    ],
    steps: [
      { text: "소고기는 키친타월로 핏물을 가볍게 제거한다." },
      { text: "간장, 설탕, 배, 마늘, 참기름, 후추를 섞어 양념장을 만든다." },
      { text: "고기에 양념을 버무려 냉장고에서 재운다.", timer: 30 },
      { text: "팬에 채 썬 양파·당근과 고기를 넣고 센 불에서 볶는다.", timer: 6 },
      { text: "대파를 넣고 1분 더 볶아 마무리한다.", timer: 1 }
    ],
    tip: "배가 없으면 사과나 키위 약간으로 대체할 수 있다(키위는 너무 오래 재우면 고기가 물러진다)."
  },
  {
    id: "jeyuk",
    title: "제육볶음",
    emoji: "🌶️",
    category: "메인",
    time: 25,
    level: "쉬움",
    servings: 2,
    desc: "고추장 양념의 매콤한 돼지고기 볶음. 밥도둑 1순위.",
    ingredients: [
      { name: "돼지고기 앞다리살", amount: 400, unit: "g" },
      { name: "양파", amount: 1, unit: "개" },
      { name: "대파", amount: 1, unit: "대" },
      { name: "고추장", amount: 2, unit: "큰술" },
      { name: "고춧가루", amount: 1, unit: "큰술" },
      { name: "간장", amount: 2, unit: "큰술" },
      { name: "설탕", amount: 1, unit: "큰술" },
      { name: "다진 마늘", amount: 1, unit: "큰술" },
      { name: "참기름", amount: 1, unit: "작은술" }
    ],
    steps: [
      { text: "고추장, 고춧가루, 간장, 설탕, 마늘을 섞어 양념장을 만든다." },
      { text: "고기에 양념장을 버무려 둔다.", timer: 10 },
      { text: "달군 팬에 고기를 넣고 센 불에서 볶는다.", timer: 5 },
      { text: "양파, 대파를 넣고 숨이 죽을 때까지 볶는다.", timer: 3 },
      { text: "불을 끄고 참기름을 둘러 마무리한다." }
    ],
    tip: "설탕을 먼저 고기에 버무리면 고기가 더 부드러워진다."
  },
  {
    id: "gyeran-mari",
    title: "계란말이",
    emoji: "🥚",
    category: "반찬",
    time: 15,
    level: "보통",
    servings: 2,
    desc: "채소를 송송 썰어 넣은 도톰한 도시락 반찬.",
    ingredients: [
      { name: "달걀", amount: 4, unit: "개" },
      { name: "당근", amount: 20, unit: "g" },
      { name: "쪽파", amount: 2, unit: "대" },
      { name: "소금", amount: 0.3, unit: "작은술" },
      { name: "식용유", amount: 1, unit: "큰술" }
    ],
    steps: [
      { text: "달걀을 풀고 잘게 썬 당근, 쪽파, 소금을 넣어 섞는다." },
      { text: "약불로 달군 팬에 기름을 두르고 달걀물의 1/3을 붓는다." },
      { text: "반쯤 익으면 한쪽 끝부터 돌돌 만다." },
      { text: "남은 달걀물을 나눠 부으며 이어서 만다.", timer: 5 },
      { text: "한 김 식힌 뒤 썰어야 모양이 흐트러지지 않는다.", timer: 3 }
    ],
    tip: "불은 끝까지 약불. 센 불이면 겉이 타고 속이 덜 익는다."
  },
  {
    id: "sigeumchi-namul",
    title: "시금치나물",
    emoji: "🥬",
    category: "반찬",
    time: 10,
    level: "쉬움",
    servings: 3,
    desc: "고소한 참기름 향의 기본 나물 반찬.",
    ingredients: [
      { name: "시금치", amount: 1, unit: "단" },
      { name: "국간장", amount: 1, unit: "작은술" },
      { name: "소금", amount: null, unit: "", note: "약간" },
      { name: "다진 마늘", amount: 0.5, unit: "작은술" },
      { name: "참기름", amount: 1, unit: "큰술" },
      { name: "통깨", amount: 1, unit: "작은술" }
    ],
    steps: [
      { text: "시금치 뿌리를 다듬고 흐르는 물에 씻는다." },
      { text: "끓는 소금물에 뿌리 쪽부터 넣어 데친다.", timer: 0.5 },
      { text: "찬물에 헹궈 물기를 꼭 짠다." },
      { text: "국간장, 마늘, 참기름, 깨를 넣고 조물조물 무친다." }
    ],
    tip: "데치는 시간은 30초면 충분하다. 오래 데치면 식감이 흐물해진다."
  },
  {
    id: "bibimbap",
    title: "비빔밥",
    emoji: "🍚",
    category: "밥·면",
    time: 30,
    level: "보통",
    servings: 2,
    desc: "냉장고 속 나물과 달걀 프라이로 만드는 한 그릇 식사.",
    ingredients: [
      { name: "밥", amount: 2, unit: "공기" },
      { name: "시금치나물", amount: 80, unit: "g" },
      { name: "콩나물", amount: 100, unit: "g" },
      { name: "애호박", amount: 0.3, unit: "개" },
      { name: "당근", amount: 0.3, unit: "개" },
      { name: "달걀", amount: 2, unit: "개" },
      { name: "고추장", amount: 2, unit: "큰술" },
      { name: "참기름", amount: 1, unit: "큰술" }
    ],
    steps: [
      { text: "콩나물은 뚜껑을 덮고 삶아 소금·참기름으로 무친다.", timer: 5 },
      { text: "애호박, 당근은 채 썰어 각각 소금 간을 해 볶는다.", timer: 3 },
      { text: "달걀은 반숙 프라이로 부친다.", timer: 2 },
      { text: "그릇에 밥을 담고 나물과 달걀을 올린 뒤 고추장, 참기름을 곁들인다." }
    ],
    tip: "고추장에 설탕·참기름·식초 약간을 섞으면 비빔장이 한층 맛있다."
  },
  {
    id: "kimchi-bokkeumbap",
    title: "김치볶음밥",
    emoji: "🍳",
    category: "밥·면",
    time: 15,
    level: "쉬움",
    servings: 1,
    desc: "찬밥과 김치만 있으면 뚝딱. 달걀 프라이는 필수.",
    ingredients: [
      { name: "밥", amount: 1, unit: "공기" },
      { name: "신김치", amount: 100, unit: "g" },
      { name: "스팸 또는 햄", amount: 50, unit: "g" },
      { name: "대파", amount: 0.3, unit: "대" },
      { name: "고춧가루", amount: 0.5, unit: "큰술" },
      { name: "간장", amount: 0.5, unit: "큰술" },
      { name: "달걀", amount: 1, unit: "개" },
      { name: "식용유", amount: 1, unit: "큰술" }
    ],
    steps: [
      { text: "기름에 대파를 볶아 파기름을 낸다.", timer: 1 },
      { text: "햄과 잘게 썬 김치를 넣고 볶는다.", timer: 3 },
      { text: "간장을 팬 가장자리에 둘러 눌려 향을 낸다." },
      { text: "밥과 고춧가루를 넣고 골고루 볶는다.", timer: 3 },
      { text: "달걀 프라이를 올려 완성한다." }
    ],
    tip: "갓 지은 밥보다 식은 밥이 덜 질척하게 볶인다."
  },
  {
    id: "janchi-guksu",
    title: "잔치국수",
    emoji: "🍜",
    category: "밥·면",
    time: 25,
    level: "쉬움",
    servings: 2,
    desc: "멸치 육수에 말아 먹는 따뜻하고 깔끔한 국수.",
    ingredients: [
      { name: "소면", amount: 200, unit: "g" },
      { name: "멸치 육수", amount: 1000, unit: "ml" },
      { name: "애호박", amount: 0.3, unit: "개" },
      { name: "달걀", amount: 1, unit: "개" },
      { name: "국간장", amount: 1, unit: "큰술" },
      { name: "김가루", amount: null, unit: "", note: "적당량" }
    ],
    steps: [
      { text: "멸치 육수를 끓여 국간장과 소금으로 간한다." },
      { text: "애호박은 채 썰어 볶고, 달걀은 지단을 부쳐 채 썬다.", timer: 3 },
      { text: "끓는 물에 소면을 삶는다. 끓어오르면 찬물을 반 컵 붓기를 두 번 한다.", timer: 4 },
      { text: "찬물에 비벼 헹군 뒤 그릇에 담고 육수와 고명을 올린다." }
    ],
    tip: "양념간장(간장+고춧가루+송송 썬 파)을 곁들이면 좋다."
  },
  {
    id: "haemul-pajeon",
    title: "해물파전",
    emoji: "🥞",
    category: "간식·전",
    time: 25,
    level: "보통",
    servings: 2,
    desc: "비 오는 날 생각나는 바삭한 해물파전.",
    ingredients: [
      { name: "쪽파", amount: 1, unit: "줌" },
      { name: "오징어", amount: 0.5, unit: "마리" },
      { name: "새우살", amount: 80, unit: "g" },
      { name: "부침가루", amount: 1, unit: "컵" },
      { name: "찬물", amount: 180, unit: "ml" },
      { name: "달걀", amount: 1, unit: "개" },
      { name: "식용유", amount: 4, unit: "큰술" }
    ],
    steps: [
      { text: "부침가루와 찬물을 섞어 반죽을 만든다." },
      { text: "팬에 기름을 넉넉히 두르고 쪽파를 가지런히 깐다." },
      { text: "반죽을 얇게 붓고 해물을 올린 뒤 풀어 둔 달걀을 끼얹는다." },
      { text: "중불에서 바닥이 노릇해질 때까지 굽는다.", timer: 4 },
      { text: "뒤집어 반대쪽도 굽는다.", timer: 3 }
    ],
    tip: "반죽 물은 얼음물을 쓰면 더 바삭해진다."
  },
  {
    id: "tteokbokki",
    title: "떡볶이",
    emoji: "🍢",
    category: "간식·전",
    time: 20,
    level: "쉬움",
    servings: 2,
    desc: "고추장 베이스의 달콤매콤 분식집 떡볶이.",
    ingredients: [
      { name: "떡볶이떡", amount: 300, unit: "g" },
      { name: "어묵", amount: 2, unit: "장" },
      { name: "대파", amount: 1, unit: "대" },
      { name: "고추장", amount: 2, unit: "큰술" },
      { name: "고춧가루", amount: 1, unit: "큰술" },
      { name: "설탕", amount: 2, unit: "큰술" },
      { name: "간장", amount: 1, unit: "큰술" },
      { name: "물", amount: 400, unit: "ml" }
    ],
    steps: [
      { text: "떡은 찬물에 담가 둔다(굳은 떡일 때).", timer: 10 },
      { text: "물에 고추장, 고춧가루, 설탕, 간장을 풀어 끓인다." },
      { text: "떡과 어묵을 넣고 저어 가며 졸인다.", timer: 7 },
      { text: "대파를 넣고 국물이 걸쭉해지면 완성.", timer: 2 }
    ],
    tip: "삶은 달걀을 함께 넣어 졸이면 금상첨화."
  },
  {
    id: "honey-toast",
    title: "허니 버터 토스트",
    emoji: "🍞",
    category: "간식·전",
    time: 10,
    level: "쉬움",
    servings: 1,
    desc: "버터와 꿀만으로 만드는 10분 디저트.",
    ingredients: [
      { name: "식빵(두꺼운 것)", amount: 1, unit: "장" },
      { name: "버터", amount: 15, unit: "g" },
      { name: "꿀", amount: 1, unit: "큰술" },
      { name: "시나몬 가루", amount: null, unit: "", note: "선택" }
    ],
    steps: [
      { text: "식빵 윗면에 격자로 칼집을 낸다." },
      { text: "녹인 버터를 골고루 바른다." },
      { text: "에어프라이어 180℃에서 굽는다.", timer: 6 },
      { text: "꿀을 뿌리고 취향에 따라 시나몬을 더한다." }
    ],
    tip: "아이스크림 한 스쿱을 올리면 카페 메뉴가 된다."
  }
];
