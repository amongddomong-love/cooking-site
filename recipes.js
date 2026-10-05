// 레시피 데이터. 초보자용 한식·양식·이색 가정식. cuisine(한식/양식/이색) 아래 category 로 나뉜다.
// amount 는 기본 인분(servings) 기준 수치, 숫자가 아닌 분량은 amount: null + note. skills 는 skills.js 의 기초 스킬 id. tags: kids(초등 메뉴)·night(야식).
// img 는 Kling 생성 사진(COOKING/tools/gen_food_images.py) — 없으면 카드에 emoji 가 대신 나온다.
const RECIPES = [
  {
    "id": "kimchi-jjigae",
    "title": "7분 김치찌개",
    "emoji": "🍲",
    "cuisine": "한식",
    "img": "img/kimchi-jjigae.jpg",
    "category": "국·찌개",
    "time": 30,
    "level": "쉬움",
    "servings": 4,
    "desc": "육수 없이 쌀뜨물에 돼지고기를 먼저 끓여 기름 맛을 우린 뒤 김치를 넣는 빠른 김치찌개입니다.",
    "source": {
      "title": "만개의레시피 참고 레시피",
      "url": "https://www.10000recipe.com/recipe/6872490"
    },
    "ingredients": [
      {
        "name": "묵은지",
        "amount": 0.25,
        "unit": "포기",
        "note": "종이컵 3컵 분량"
      },
      {
        "name": "돼지고기",
        "amount": 150,
        "unit": "g",
        "note": "종이컵 1컵 분량"
      },
      {
        "name": "쌀뜨물",
        "amount": 4,
        "unit": "컵"
      },
      {
        "name": "된장",
        "amount": 0.5,
        "unit": "큰술"
      },
      {
        "name": "청양고추",
        "amount": 1,
        "unit": "개",
        "note": "취향껏"
      },
      {
        "name": "다진 마늘",
        "amount": 1,
        "unit": "큰술"
      },
      {
        "name": "고춧가루",
        "amount": 2,
        "unit": "큰술"
      },
      {
        "name": "대파",
        "amount": null,
        "unit": "",
        "note": "적당량"
      },
      {
        "name": "국간장",
        "amount": 1,
        "unit": "큰술"
      },
      {
        "name": "새우젓",
        "amount": 1,
        "unit": "큰술"
      }
    ],
    "steps": [
      {
        "text": "묵은지는 속을 털어내고 잘게 썰고, 돼지고기와 청양고추·대파도 손질해 둡니다."
      },
      {
        "text": "냄비에 쌀뜨물과 돼지고기를 넣고 된장 반 큰술을 풀어 잡내를 잡으며 끓이고, 떠오르는 거품은 걷어냅니다."
      },
      {
        "text": "고기 기름이 국물에 충분히 우러나면 썰어 둔 김치를 넣습니다."
      },
      {
        "text": "고춧가루·다진 마늘·국간장을 넣고 새우젓으로 간을 맞춥니다."
      },
      {
        "text": "싱거우면 김칫국물을 3~4큰술 더하고 청양고추를 넣어 한소끔 끓입니다."
      },
      {
        "text": "마지막에 대파를 올려 마무리합니다."
      }
    ],
    "tip": "김치와 고기 비율을 3:1로 맞추고, 쌀뜨물에 된장을 아주 조금 풀어 돼지고기 잡내를 잡는 것이 핵심입니다.",
    "skills": [
      "broth",
      "seasoning",
      "knife"
    ],
    "tags": []
  },
  {
    "id": "doenjang-jjigae",
    "title": "구수한 된장찌개",
    "emoji": "🥘",
    "cuisine": "한식",
    "img": "img/doenjang-jjigae.jpg",
    "category": "국·찌개",
    "time": 45,
    "level": "쉬움",
    "servings": 3,
    "desc": "쌀뜨물에 무를 먼저 끓여 단맛을 내고 된장을 넉넉히 풀어 오래 끓인 뒤 설탕을 살짝 넣는 구수한 된장찌개입니다.",
    "source": {
      "title": "만개의레시피 참고 레시피",
      "url": "https://www.10000recipe.com/recipe/6941371"
    },
    "ingredients": [
      {
        "name": "쌀뜨물",
        "amount": 7,
        "unit": "컵"
      },
      {
        "name": "된장",
        "amount": 4,
        "unit": "큰술"
      },
      {
        "name": "다진 마늘",
        "amount": 0.5,
        "unit": "큰술"
      },
      {
        "name": "고춧가루",
        "amount": 0.5,
        "unit": "큰술"
      },
      {
        "name": "설탕",
        "amount": 0.3,
        "unit": "큰술"
      },
      {
        "name": "무",
        "amount": 1,
        "unit": "토막"
      },
      {
        "name": "감자",
        "amount": 1,
        "unit": "개"
      },
      {
        "name": "두부",
        "amount": 0.5,
        "unit": "모"
      },
      {
        "name": "버섯",
        "amount": 1,
        "unit": "줌"
      },
      {
        "name": "청양고추",
        "amount": 1,
        "unit": "개"
      },
      {
        "name": "홍고추",
        "amount": 0.5,
        "unit": "개"
      },
      {
        "name": "대파",
        "amount": 0.2,
        "unit": "대"
      }
    ],
    "steps": [
      {
        "text": "냄비에 쌀뜨물을 붓고 끓입니다."
      },
      {
        "text": "납작하게 썬 무를 넣고 끓여 국물에 단맛을 냅니다.",
        "timer": 10
      },
      {
        "text": "된장을 국물에 잘 풀어 줍니다."
      },
      {
        "text": "불을 줄여 된장 맛이 깊게 배도록 더 끓입니다.",
        "timer": 15
      },
      {
        "text": "다진 마늘·고춧가루·설탕을 넣습니다."
      },
      {
        "text": "깍둑 썬 감자·두부·버섯과 고추·대파를 넣고 감자와 두부에 맛이 밸 때까지 바글바글 끓입니다."
      }
    ],
    "tip": "된장을 푼 뒤 약불에서 15~20분 충분히 끓여 떫은맛을 날리고, 설탕을 아주 조금 넣어 된장의 짠맛을 둥글게 잡습니다.",
    "skills": [
      "broth",
      "knife",
      "seasoning"
    ],
    "tags": []
  },
  {
    "id": "bulgogi",
    "title": "간단 소불고기",
    "emoji": "🥩",
    "cuisine": "한식",
    "img": "img/bulgogi.jpg",
    "category": "메인",
    "time": 20,
    "level": "쉬움",
    "servings": 2,
    "desc": "간장 대신 액젓으로 간을 하고 설탕을 가장 먼저 버무리는, 간단하지만 감칠맛이 깊은 소불고기입니다.",
    "source": {
      "title": "만개의레시피 참고 레시피",
      "url": "https://www.10000recipe.com/recipe/6941945"
    },
    "ingredients": [
      {
        "name": "소고기 불고기감",
        "amount": 500,
        "unit": "g"
      },
      {
        "name": "설탕",
        "amount": 4,
        "unit": "큰술"
      },
      {
        "name": "다진 마늘",
        "amount": 2,
        "unit": "큰술"
      },
      {
        "name": "대파",
        "amount": 1,
        "unit": "줌",
        "note": "썬 것"
      },
      {
        "name": "액젓",
        "amount": 4,
        "unit": "큰술"
      },
      {
        "name": "양파",
        "amount": 0.5,
        "unit": "개"
      },
      {
        "name": "참기름",
        "amount": 1,
        "unit": "큰술",
        "note": "1~2큰술"
      }
    ],
    "steps": [
      {
        "text": "불고기감을 볼에 담고 가위로 먹기 좋게 자릅니다(도마에 기름이 묻지 않음)."
      },
      {
        "text": "설탕을 먼저 넣고 고기에 고루 버무립니다."
      },
      {
        "text": "다진 마늘과 썬 대파를 넣고 섞은 뒤 액젓으로 간을 합니다."
      },
      {
        "text": "참기름을 두르고 채 썬 양파를 넣어 한 번 더 버무립니다."
      },
      {
        "text": "기름 두르지 않은 팬을 중불로 달군 뒤 양념한 고기를 넣고 집게로 뒤적이며 익힙니다."
      }
    ],
    "tip": "설탕을 다른 양념보다 먼저 버무려야 단맛이 고기에 잘 배고, 간장 대신 액젓을 쓰면 감칠맛이 살아납니다.",
    "skills": [
      "meat",
      "sauce",
      "measure"
    ],
    "tags": []
  },
  {
    "id": "jeyuk",
    "title": "달큰 매콤 제육볶음",
    "emoji": "🌶️",
    "cuisine": "한식",
    "img": "img/jeyuk.jpg",
    "category": "메인",
    "time": 60,
    "level": "보통",
    "servings": 2,
    "desc": "고기를 먼저 볶다가 설탕으로 단맛을 코팅한 뒤 양념장을 넣는 순서가 핵심인 제육볶음입니다.",
    "source": {
      "title": "만개의레시피 참고 레시피",
      "url": "https://www.10000recipe.com/recipe/6831543"
    },
    "ingredients": [
      {
        "name": "제육용 돼지고기",
        "amount": 600,
        "unit": "g"
      },
      {
        "name": "양배추",
        "amount": 0.2,
        "unit": "통"
      },
      {
        "name": "당근",
        "amount": 0.33,
        "unit": "개"
      },
      {
        "name": "버섯",
        "amount": 1,
        "unit": "줌"
      },
      {
        "name": "청양고추",
        "amount": 1,
        "unit": "개"
      },
      {
        "name": "대파",
        "amount": 1,
        "unit": "대"
      },
      {
        "name": "양파",
        "amount": 1,
        "unit": "개"
      },
      {
        "name": "설탕",
        "amount": 2,
        "unit": "큰술"
      },
      {
        "name": "고추장",
        "amount": 2,
        "unit": "큰술",
        "note": "양념장"
      },
      {
        "name": "굴소스",
        "amount": 1,
        "unit": "큰술",
        "note": "양념장"
      },
      {
        "name": "간장",
        "amount": 2,
        "unit": "큰술",
        "note": "양념장"
      },
      {
        "name": "다진 마늘",
        "amount": 1,
        "unit": "큰술",
        "note": "양념장"
      },
      {
        "name": "고춧가루",
        "amount": 2,
        "unit": "큰술",
        "note": "양념장"
      },
      {
        "name": "올리고당",
        "amount": 2,
        "unit": "큰술",
        "note": "양념장"
      },
      {
        "name": "맛술(또는 소주)·마늘·후추",
        "amount": null,
        "unit": "",
        "note": "밑간용, 분량 미기재"
      }
    ],
    "steps": [
      {
        "text": "돼지고기에 맛술(또는 소주)·마늘·후추로 밑간해 잡내를 뺍니다.",
        "timer": 30
      },
      {
        "text": "채소는 모두 먹기 좋은 크기로 썰고, 양념장 재료는 미리 섞어 둡니다."
      },
      {
        "text": "팬에 고기를 넣고 핏기가 없어질 때까지 볶습니다."
      },
      {
        "text": "설탕을 넣어 고기에 단맛이 배도록 조금 더 볶은 뒤 양념장을 넣어 고루 섞습니다."
      },
      {
        "text": "대파·고추를 뺀 채소를 넣고 숨이 죽을 때까지 볶습니다."
      },
      {
        "text": "마지막에 대파와 고추를 넣고 바로 불을 끕니다."
      }
    ],
    "tip": "양념장보다 설탕을 먼저 넣어 고기를 볶아 단맛을 입히는 것이 포인트이며, 원 레시피는 단맛이 강한 편이라 입맛에 맞게 줄여도 됩니다.",
    "skills": [
      "meat",
      "sauce",
      "heat",
      "measure"
    ],
    "tags": []
  },
  {
    "id": "gyeran-mari",
    "title": "도톰 계란말이",
    "emoji": "🥚",
    "cuisine": "한식",
    "img": "img/gyeran-mari.jpg",
    "category": "반찬",
    "time": 10,
    "level": "쉬움",
    "servings": 2,
    "desc": "달걀물에 설탕을 소금과 같은 양으로 넣어 비린 맛을 잡고, 세 번에 나눠 부어 도톰하게 마는 계란말이입니다.",
    "source": {
      "title": "만개의레시피 참고 레시피",
      "url": "https://www.10000recipe.com/recipe/6879106"
    },
    "ingredients": [
      {
        "name": "달걀",
        "amount": 3,
        "unit": "개"
      },
      {
        "name": "당근",
        "amount": 0.17,
        "unit": "개",
        "note": "1/6개"
      },
      {
        "name": "쪽파",
        "amount": 4,
        "unit": "대"
      },
      {
        "name": "소금",
        "amount": 0.5,
        "unit": "작은술"
      },
      {
        "name": "설탕",
        "amount": 0.5,
        "unit": "작은술"
      },
      {
        "name": "식용유",
        "amount": 1,
        "unit": "큰술"
      }
    ],
    "steps": [
      {
        "text": "쪽파는 송송 썰고 당근은 잘게 다집니다."
      },
      {
        "text": "달걀을 풀어 채소를 넣고 설탕·소금으로 간해 잘 섞습니다."
      },
      {
        "text": "팬에 기름을 두르고 키친타월로 얇게 펴 바른 뒤 약불로 줄입니다."
      },
      {
        "text": "달걀물 1/3을 붓고 익으면 한쪽으로 말아 밀고, 나머지도 두 번에 나눠 부어 같은 방법으로 맙니다."
      },
      {
        "text": "뒤집개로 눌러 모양을 잡고 옆면까지 익힙니다."
      },
      {
        "text": "한 김 식힌 뒤 썰면 단면이 깔끔합니다."
      }
    ],
    "tip": "설탕을 소금과 같은 양만큼 넣으면 달걀 비린내가 가려지고, 기름은 키친타월로 닦아 얇게만 남겨야 매끈하게 말립니다.",
    "skills": [
      "egg",
      "heat"
    ],
    "tags": [
      "kids"
    ]
  },
  {
    "id": "sigeumchi-namul",
    "title": "시금치나물",
    "emoji": "🥬",
    "cuisine": "한식",
    "img": "img/sigeumchi-namul.jpg",
    "category": "반찬",
    "time": 15,
    "level": "쉬움",
    "servings": 2,
    "desc": "소금물에 시금치를 아주 짧게 데쳐 국간장과 참기름으로만 담백하게 무치는 기본 나물입니다.",
    "source": {
      "title": "만개의레시피 참고 레시피",
      "url": "https://www.10000recipe.com/recipe/6862530"
    },
    "ingredients": [
      {
        "name": "시금치",
        "amount": 1,
        "unit": "단"
      },
      {
        "name": "소금",
        "amount": 0.5,
        "unit": "큰술",
        "note": "데칠 때"
      },
      {
        "name": "다진 마늘",
        "amount": 0.5,
        "unit": "큰술"
      },
      {
        "name": "국간장",
        "amount": 2,
        "unit": "큰술",
        "note": "1큰술부터 넣고 간 보며 추가"
      },
      {
        "name": "참기름",
        "amount": 1,
        "unit": "큰술"
      },
      {
        "name": "깨소금 또는 통깨",
        "amount": null,
        "unit": "",
        "note": "약간"
      }
    ],
    "steps": [
      {
        "text": "시금치는 뿌리 쪽 흙이 남지 않게 깨끗이 씻습니다."
      },
      {
        "text": "끓는 물에 소금을 넣고 시금치를 20~40초만 데친 뒤 바로 건집니다."
      },
      {
        "text": "찬물에 헹궈 식힌 뒤 물기를 꼭 짜고 반으로 자릅니다."
      },
      {
        "text": "다진 마늘·국간장·참기름·깨를 넣고 조물조물 무칩니다."
      },
      {
        "text": "간을 보고 부족하면 소금으로 맞춥니다."
      }
    ],
    "tip": "국간장은 시금치 양에 따라 1큰술만 먼저 넣고 맛을 본 뒤 더하는 것이 실패하지 않는 방법입니다.",
    "skills": [
      "veggie",
      "seasoning",
      "pantry"
    ],
    "tags": []
  },
  {
    "id": "bibimbap",
    "title": "볶음고추장 비빔밥",
    "emoji": "🍚",
    "cuisine": "한식",
    "img": "img/bibimbap.jpg",
    "category": "밥·면",
    "time": 30,
    "level": "쉬움",
    "servings": 1,
    "desc": "다진 소고기와 양파·대파를 볶아 만든 볶음고추장 하나로 간단히 비벼 먹는 비빔밥입니다.",
    "source": {
      "title": "만개의레시피 참고 레시피",
      "url": "https://www.10000recipe.com/recipe/6981296"
    },
    "servingsNote": "볶음고추장은 6인분 이상 만들어 두고 비빔밥 1그릇에 1~2큰술 사용",
    "ingredients": [
      {
        "name": "다진 소고기",
        "amount": 50,
        "unit": "g",
        "note": "볶음고추장용, 50~150g"
      },
      {
        "name": "고추장",
        "amount": 100,
        "unit": "g",
        "note": "볶음고추장용"
      },
      {
        "name": "양파",
        "amount": 0.5,
        "unit": "개",
        "note": "작은 것, 볶음고추장용"
      },
      {
        "name": "대파",
        "amount": 15,
        "unit": "cm",
        "note": "볶음고추장용"
      },
      {
        "name": "진간장",
        "amount": 1,
        "unit": "큰술",
        "note": "볶음고추장용"
      },
      {
        "name": "설탕",
        "amount": 1.5,
        "unit": "큰술",
        "note": "볶음고추장용"
      },
      {
        "name": "다진 마늘",
        "amount": 0.5,
        "unit": "큰술",
        "note": "볶음고추장용"
      },
      {
        "name": "식용유",
        "amount": 2,
        "unit": "큰술",
        "note": "2~3큰술"
      },
      {
        "name": "밥",
        "amount": 1,
        "unit": "공기"
      },
      {
        "name": "볶음고추장",
        "amount": 1,
        "unit": "큰술",
        "note": "1~2큰술"
      },
      {
        "name": "새싹채소",
        "amount": null,
        "unit": "",
        "note": "적당량"
      },
      {
        "name": "달걀",
        "amount": 1,
        "unit": "개"
      },
      {
        "name": "참기름",
        "amount": 1,
        "unit": "큰술"
      }
    ],
    "steps": [
      {
        "text": "양파와 대파를 잘게 다집니다."
      },
      {
        "text": "팬에 기름을 두르고 양파·대파·다진 소고기·다진 마늘을 중불에서 고기가 익고 양파가 투명해질 때까지 볶습니다."
      },
      {
        "text": "진간장과 설탕을 넣고 중약불에서 더 볶습니다."
      },
      {
        "text": "고추장을 넣고 약불에서 눌어붙지 않게 저어 가며 볶아 볶음고추장을 완성합니다.",
        "timer": 5
      },
      {
        "text": "새싹채소는 씻어 물기를 빼고 달걀은 프라이합니다."
      },
      {
        "text": "밥 위에 볶음고추장·새싹채소·달걀프라이를 올리고 참기름을 둘러 비빕니다."
      }
    ],
    "tip": "고추장은 맨 마지막에 넣고 약불에서 볶아야 타지 않으며, 만들어 둔 볶음고추장은 냉장 2~3주 보관해 두고 쓸 수 있습니다.",
    "skills": [
      "rice",
      "veggie",
      "sauce",
      "pantry"
    ],
    "tags": []
  },
  {
    "id": "kimchi-bokkeumbap",
    "title": "김치볶음밥",
    "emoji": "🍳",
    "cuisine": "한식",
    "img": "img/kimchi-bokkeumbap.jpg",
    "category": "밥·면",
    "time": 20,
    "level": "쉬움",
    "servings": 2,
    "desc": "파기름에 멸치액젓과 설탕을 먼저 눌려 감칠맛을 낸 뒤 김치를 볶는 '어남선생' 스타일 김치볶음밥입니다.",
    "source": {
      "title": "만개의레시피 참고 레시피",
      "url": "https://www.10000recipe.com/recipe/7030515"
    },
    "ingredients": [
      {
        "name": "김치",
        "amount": 1.5,
        "unit": "컵"
      },
      {
        "name": "밥",
        "amount": 2,
        "unit": "공기"
      },
      {
        "name": "다진 대파",
        "amount": 3,
        "unit": "큰술",
        "note": "3~4큰술"
      },
      {
        "name": "식용유",
        "amount": 2,
        "unit": "큰술",
        "note": "2~3큰술"
      },
      {
        "name": "김칫국물",
        "amount": 0.5,
        "unit": "컵"
      },
      {
        "name": "멸치액젓",
        "amount": 2,
        "unit": "큰술"
      },
      {
        "name": "설탕",
        "amount": 2,
        "unit": "큰술"
      },
      {
        "name": "달걀",
        "amount": 2,
        "unit": "개"
      },
      {
        "name": "소금",
        "amount": null,
        "unit": "",
        "note": "2~3꼬집"
      },
      {
        "name": "김가루",
        "amount": null,
        "unit": "",
        "note": "고명용, 약간"
      }
    ],
    "steps": [
      {
        "text": "김치는 썰고 대파는 잘게 다집니다."
      },
      {
        "text": "팬에 기름과 다진 파를 넣고 지글지글 소리가 나며 향이 날 때까지 볶아 파기름을 냅니다."
      },
      {
        "text": "멸치액젓과 설탕을 팬에 넣어 살짝 눌린 뒤 김치를 넣고 불을 줄여 어우러지게 볶습니다."
      },
      {
        "text": "밥을 넣고 뭉치지 않게 꾹꾹 눌러 가며 섞습니다."
      },
      {
        "text": "김칫국물을 부어 칼칼한 맛을 더하고, 잠시 뒤적이지 않고 두어 맛이 배게 합니다."
      },
      {
        "text": "따로 달걀프라이를 만들어 올리고 김가루를 뿌려 냅니다."
      }
    ],
    "tip": "김치보다 액젓과 설탕을 먼저 뜨거운 파기름에 넣어 살짝 눌리면 감칠맛과 불향이 살아납니다.",
    "skills": [
      "rice",
      "egg",
      "heat",
      "pantry"
    ],
    "tags": [
      "night"
    ]
  },
  {
    "id": "janchi-guksu",
    "title": "잔치국수",
    "emoji": "🍜",
    "cuisine": "한식",
    "img": "img/janchi-guksu.jpg",
    "category": "밥·면",
    "time": 40,
    "level": "쉬움",
    "servings": 2,
    "desc": "멸치·다시마 국물에 채소를 넣어 끓이고 달걀을 풀어 마무리한 뒤 진간장 양념장으로 간을 더하는 잔치국수입니다.",
    "source": {
      "title": "만개의레시피 참고 레시피",
      "url": "https://www.10000recipe.com/recipe/6980895"
    },
    "ingredients": [
      {
        "name": "소면",
        "amount": 100,
        "unit": "g",
        "note": "1인 기준"
      },
      {
        "name": "양파",
        "amount": 0.5,
        "unit": "개"
      },
      {
        "name": "애호박",
        "amount": 0.5,
        "unit": "개"
      },
      {
        "name": "표고버섯",
        "amount": 2,
        "unit": "개"
      },
      {
        "name": "당근",
        "amount": 30,
        "unit": "g"
      },
      {
        "name": "달걀",
        "amount": 1,
        "unit": "개"
      },
      {
        "name": "물",
        "amount": 1300,
        "unit": "ml",
        "note": "육수용"
      },
      {
        "name": "국간장",
        "amount": 5,
        "unit": "큰술",
        "note": "5~6큰술, 육수용"
      },
      {
        "name": "다시마",
        "amount": 5,
        "unit": "g",
        "note": "육수용"
      },
      {
        "name": "국물용 멸치",
        "amount": 1,
        "unit": "줌",
        "note": "육수용"
      },
      {
        "name": "소금·후추",
        "amount": null,
        "unit": "",
        "note": "약간"
      },
      {
        "name": "진간장",
        "amount": 4,
        "unit": "큰술",
        "note": "4~5큰술, 양념장"
      },
      {
        "name": "대파",
        "amount": 0.33,
        "unit": "대",
        "note": "양념장"
      },
      {
        "name": "고춧가루",
        "amount": 0.5,
        "unit": "큰술",
        "note": "양념장"
      },
      {
        "name": "참기름",
        "amount": 1,
        "unit": "큰술",
        "note": "양념장"
      },
      {
        "name": "깨",
        "amount": 0.5,
        "unit": "큰술",
        "note": "양념장"
      },
      {
        "name": "설탕",
        "amount": 2,
        "unit": "g",
        "note": "약 1/6큰술, 양념장"
      },
      {
        "name": "다진 마늘",
        "amount": 0.33,
        "unit": "큰술",
        "note": "양념장"
      },
      {
        "name": "청양고추",
        "amount": 1,
        "unit": "개",
        "note": "양념장"
      }
    ],
    "steps": [
      {
        "text": "진간장·설탕·고춧가루·마늘·다진 대파·청양고추·참기름·깨를 섞어 양념장을 만듭니다."
      },
      {
        "text": "양파·애호박·당근은 채 썰고 표고는 얇게 썰며, 멸치는 머리와 내장을 뗍니다."
      },
      {
        "text": "소면을 중강불에서 저어 가며 삶은 뒤 찬물에 여러 번 헹궈 건집니다.",
        "timer": 4
      },
      {
        "text": "물에 멸치와 다시마를 넣고 끓이다가 끓기 시작하면 다시마를 건집니다."
      },
      {
        "text": "채소를 넣고 끓인 뒤 멸치를 건져 내고 국간장과 소금으로 간합니다.",
        "timer": 10
      },
      {
        "text": "달걀물을 가늘게 둘러 넣고 바로 불을 끕니다."
      },
      {
        "text": "그릇에 국수를 담고 국물을 부은 뒤 후추를 뿌려 양념장과 함께 냅니다."
      }
    ],
    "tip": "국물은 국간장으로 간을 하되 맑게 내고 싶으면 국간장을 줄이고 소금으로 간을 맞추며, 부족한 간은 양념장으로 각자 조절합니다.",
    "skills": [
      "noodle",
      "broth"
    ],
    "tags": []
  },
  {
    "id": "haemul-pajeon",
    "title": "해물파전",
    "emoji": "🥞",
    "cuisine": "한식",
    "img": "img/haemul-pajeon.jpg",
    "category": "간식·전",
    "time": 15,
    "level": "쉬움",
    "servings": 1,
    "desc": "부침가루에 튀김가루를 섞어 바삭함을 살리고, 반죽을 얇게 깐 위에 파와 해물을 올린 뒤 다시 반죽을 덮는 해물파전입니다.",
    "source": {
      "title": "만개의레시피 참고 레시피",
      "url": "https://www.10000recipe.com/recipe/6838188"
    },
    "servingsNote": "1인분(전 2장)",
    "ingredients": [
      {
        "name": "쪽파(골파)",
        "amount": null,
        "unit": "",
        "note": "적당량"
      },
      {
        "name": "감자",
        "amount": 1,
        "unit": "개"
      },
      {
        "name": "양파",
        "amount": 1,
        "unit": "개",
        "note": "생략 가능"
      },
      {
        "name": "해산물(오징어·새우·홍합)",
        "amount": 1,
        "unit": "컵",
        "note": "종이컵(180ml)"
      },
      {
        "name": "고추",
        "amount": null,
        "unit": "",
        "note": "조금"
      },
      {
        "name": "애호박·당근",
        "amount": null,
        "unit": "",
        "note": "약간, 생략 가능"
      },
      {
        "name": "부침가루",
        "amount": 1.5,
        "unit": "컵",
        "note": "종이컵(180ml)"
      },
      {
        "name": "튀김가루",
        "amount": 0.5,
        "unit": "컵",
        "note": "종이컵(180ml), 생략 가능"
      },
      {
        "name": "소금",
        "amount": null,
        "unit": "",
        "note": "조금"
      },
      {
        "name": "설탕",
        "amount": null,
        "unit": "",
        "note": "조금"
      },
      {
        "name": "물",
        "amount": 1,
        "unit": "컵",
        "note": "종이컵(180ml)"
      }
    ],
    "steps": [
      {
        "text": "채소는 모두 가늘게 채 썰고 해산물도 손질해 둡니다."
      },
      {
        "text": "부침가루·튀김가루·설탕·소금에 물을 넣고 멍울 없이 반죽합니다."
      },
      {
        "text": "팬에 기름을 넉넉히 달군 뒤 반죽 한 국자를 얇게 펴고 파를 깔아 줍니다."
      },
      {
        "text": "나머지 재료를 올리고 가장자리에 기름을 1~2큰술 더 두른 뒤 남은 반죽을 위에 덮습니다."
      },
      {
        "text": "중불에서 바닥이 노릇해지면 뒤집어 반대쪽도 노릇하게 지집니다."
      }
    ],
    "tip": "부침가루에 튀김가루를 섞어 바삭함을 높이고, 도톰하게 원하면 달걀 하나를 풀어 전 가장자리에 둘러 줍니다.",
    "skills": [
      "seafood",
      "heat"
    ],
    "tags": [
      "night"
    ]
  },
  {
    "id": "tteokbokki",
    "title": "분식점 떡볶이",
    "emoji": "🍢",
    "cuisine": "한식",
    "img": "img/tteokbokki.jpg",
    "category": "간식·전",
    "time": 15,
    "level": "쉬움",
    "servings": 2,
    "desc": "육수 없이 물에 고추장·고춧가루·간장·설탕만 넣고 졸이는, 설탕 단맛이 앞서는 분식집 스타일 떡볶이입니다.",
    "source": {
      "title": "만개의레시피 참고 레시피",
      "url": "https://www.10000recipe.com/recipe/6894096"
    },
    "ingredients": [
      {
        "name": "떡볶이 떡",
        "amount": 2,
        "unit": "컵"
      },
      {
        "name": "물",
        "amount": 2,
        "unit": "컵"
      },
      {
        "name": "대파",
        "amount": 0.5,
        "unit": "대"
      },
      {
        "name": "통깨",
        "amount": null,
        "unit": "",
        "note": "약간"
      },
      {
        "name": "고추장",
        "amount": 2,
        "unit": "큰술"
      },
      {
        "name": "고춧가루",
        "amount": 1.5,
        "unit": "큰술"
      },
      {
        "name": "간장",
        "amount": 2,
        "unit": "큰술"
      },
      {
        "name": "설탕",
        "amount": 3,
        "unit": "큰술"
      },
      {
        "name": "어묵",
        "amount": null,
        "unit": "",
        "note": "선택 재료, 분량 미기재"
      }
    ],
    "steps": [
      {
        "text": "센불에 물을 끓이며 떡을 넣습니다(냉동 떡은 잠시 해동)."
      },
      {
        "text": "물이 끓으면 고추장·고춧가루·간장·설탕을 모두 넣고 잘 풀어 줍니다."
      },
      {
        "text": "국물이 걸쭉해질 때까지 저어 가며 졸입니다."
      },
      {
        "text": "대파를 가위로 잘라 넣고 통깨를 뿌려 마무리합니다."
      }
    ],
    "tip": "설탕을 고추장보다 많이 넣어 분식집 특유의 단맛을 내는 것이 포인트이며, 단 것이 싫으면 설탕만 줄이면 됩니다.",
    "skills": [
      "sauce",
      "heat",
      "measure"
    ],
    "tags": [
      "night"
    ]
  },
  {
    "id": "honey-toast",
    "title": "길거리 토스트",
    "emoji": "🍞",
    "cuisine": "한식",
    "img": "img/honey-toast.jpg",
    "category": "간식·전",
    "time": 30,
    "level": "쉬움",
    "servings": 2,
    "desc": "채소를 듬뿍 넣은 달걀부침에 설탕과 케첩을 뿌려 내는 추억의 길거리 토스트입니다.",
    "source": {
      "title": "만개의레시피 참고 레시피",
      "url": "https://www.10000recipe.com/recipe/6874058"
    },
    "ingredients": [
      {
        "name": "식빵",
        "amount": 4,
        "unit": "장"
      },
      {
        "name": "달걀",
        "amount": 3,
        "unit": "개"
      },
      {
        "name": "양배추",
        "amount": 1,
        "unit": "줌"
      },
      {
        "name": "당근",
        "amount": 0.2,
        "unit": "개"
      },
      {
        "name": "대파",
        "amount": 1,
        "unit": "대"
      },
      {
        "name": "슬라이스 치즈",
        "amount": 2,
        "unit": "장"
      },
      {
        "name": "맛술",
        "amount": 1,
        "unit": "큰술"
      },
      {
        "name": "설탕",
        "amount": null,
        "unit": "",
        "note": "적당량"
      },
      {
        "name": "케첩",
        "amount": null,
        "unit": "",
        "note": "적당량"
      }
    ],
    "steps": [
      {
        "text": "달걀 3개를 곱게 풀고 맛술 1큰술을 넣어 비린내를 잡습니다."
      },
      {
        "text": "양배추·당근·대파를 모두 가늘게 채 썰어 달걀물에 섞습니다."
      },
      {
        "text": "기름 두른 팬에 달걀 반죽을 두 장으로 나눠 부칩니다."
      },
      {
        "text": "같은 팬에 식빵을 노릇하게 굽습니다."
      },
      {
        "text": "구운 식빵 위에 달걀부침을 빵 크기에 맞춰 올리고 설탕을 솔솔 뿌립니다."
      },
      {
        "text": "케첩을 지그재그로 뿌리고 치즈를 올린 뒤 나머지 빵을 덮어 냅니다."
      }
    ],
    "tip": "달걀물에 맛술을 꼭 넣어 비린내를 잡고, 설탕+케첩 조합이 길거리 맛의 핵심입니다.",
    "skills": [
      "egg",
      "heat"
    ],
    "tags": [
      "kids"
    ]
  },
  {
    "id": "miyeok-guk",
    "title": "소고기 미역국",
    "emoji": "🥣",
    "cuisine": "한식",
    "category": "국·찌개",
    "time": 40,
    "level": "쉬움",
    "servings": 3,
    "desc": "참기름에 소고기와 미역을 달달 볶은 뒤 푹 끓이는 기본 국. 불 조절과 국간장 간 맞추기를 익히기 좋아요.",
    "ingredients": [
      {
        "name": "마른 미역",
        "amount": 10,
        "unit": "g",
        "note": "한 줌"
      },
      {
        "name": "소고기 국거리",
        "amount": 150,
        "unit": "g"
      },
      {
        "name": "참기름",
        "amount": 1,
        "unit": "큰술"
      },
      {
        "name": "국간장",
        "amount": 2,
        "unit": "큰술"
      },
      {
        "name": "다진 마늘",
        "amount": 0.5,
        "unit": "큰술"
      },
      {
        "name": "물",
        "amount": 6,
        "unit": "컵",
        "note": "종이컵 기준"
      },
      {
        "name": "소금",
        "amount": null,
        "unit": "",
        "note": "약간"
      }
    ],
    "steps": [
      {
        "text": "마른 미역을 찬물에 담가 불립니다. 10g 이 한 냄비 가득 불어나니 많이 넣지 마세요.",
        "timer": 15
      },
      {
        "text": "불린 미역을 바락바락 주물러 2~3번 헹군 뒤 물기를 꼭 짜고 먹기 좋게 자릅니다."
      },
      {
        "text": "냄비에 참기름을 두르고 중불에서 소고기를 볶다가 겉이 회색으로 변하면 미역과 국간장 1큰술을 넣어 함께 볶습니다.",
        "timer": 3
      },
      {
        "text": "물을 붓고 센불로 끓어오르면 중약불로 줄여 뭉근하게 끓입니다.",
        "timer": 20
      },
      {
        "text": "다진 마늘과 남은 국간장을 넣고, 맛을 본 뒤 부족한 간은 소금으로 맞춥니다."
      }
    ],
    "tip": "국간장으로 간을 다 맞추면 색이 탁해져요. 국간장은 2큰술까지만 넣고 나머지는 소금으로 채우세요.",
    "skills": [
      "seasoning",
      "heat",
      "measure",
      "pantry"
    ],
    "tags": []
  },
  {
    "id": "gyeran-jjim",
    "title": "폭신 뚝배기 계란찜",
    "emoji": "🍮",
    "cuisine": "한식",
    "category": "반찬",
    "time": 15,
    "level": "쉬움",
    "servings": 2,
    "desc": "달걀물을 저어가며 익히다가 뚜껑을 덮어 부풀리는 계란찜. 약불 다루는 연습에 딱 맞아요.",
    "ingredients": [
      {
        "name": "달걀",
        "amount": 3,
        "unit": "개"
      },
      {
        "name": "물",
        "amount": 150,
        "unit": "ml",
        "note": "달걀과 같은 양"
      },
      {
        "name": "새우젓",
        "amount": 0.5,
        "unit": "큰술",
        "note": "또는 소금 두 꼬집"
      },
      {
        "name": "대파",
        "amount": 0.2,
        "unit": "대"
      },
      {
        "name": "참기름",
        "amount": null,
        "unit": "",
        "note": "약간"
      },
      {
        "name": "깨",
        "amount": null,
        "unit": "",
        "note": "약간"
      }
    ],
    "steps": [
      {
        "text": "달걀을 그릇에 깨서 알끈이 보이지 않을 때까지 충분히 풀고, 체에 한 번 거르면 더 부드러워요."
      },
      {
        "text": "물과 다진 새우젓을 넣어 섞습니다. 대파는 잘게 썹니다."
      },
      {
        "text": "뚝배기에 달걀물을 붓고 중불에서 숟가락으로 바닥을 긁듯 계속 저어 몽글몽글해질 때까지 익힙니다.",
        "timer": 2
      },
      {
        "text": "대파를 올리고 불을 가장 약하게 줄인 뒤, 뚜껑을 덮어 부풀어 오를 때까지 둡니다.",
        "timer": 3
      },
      {
        "text": "불을 끄고 참기름과 깨를 뿌려 뚝배기째 냅니다."
      }
    ],
    "tip": "뚝배기가 없으면 전자레인지용 그릇에 담아 랩을 씌우고 구멍을 낸 뒤 1분씩 끊어 3분 정도 돌리세요.",
    "skills": [
      "egg",
      "heat"
    ],
    "tags": [
      "kids"
    ]
  },
  {
    "id": "eomuk-bokkeum",
    "title": "달달 간장 어묵볶음",
    "emoji": "🍥",
    "cuisine": "한식",
    "category": "반찬",
    "time": 15,
    "level": "쉬움",
    "servings": 3,
    "desc": "어묵을 한 번 데쳐 기름기를 빼고 간장 양념에 볶는 도시락 단골 반찬. 양념장 비율을 익히기 좋아요.",
    "ingredients": [
      {
        "name": "어묵",
        "amount": 200,
        "unit": "g",
        "note": "사각어묵 4장"
      },
      {
        "name": "양파",
        "amount": 0.5,
        "unit": "개"
      },
      {
        "name": "당근",
        "amount": 20,
        "unit": "g",
        "note": "선택"
      },
      {
        "name": "진간장",
        "amount": 2,
        "unit": "큰술"
      },
      {
        "name": "설탕",
        "amount": 1,
        "unit": "큰술"
      },
      {
        "name": "물엿",
        "amount": 1,
        "unit": "큰술"
      },
      {
        "name": "다진 마늘",
        "amount": 0.5,
        "unit": "큰술"
      },
      {
        "name": "물",
        "amount": 3,
        "unit": "큰술"
      },
      {
        "name": "식용유",
        "amount": 1,
        "unit": "큰술"
      },
      {
        "name": "깨",
        "amount": null,
        "unit": "",
        "note": "약간"
      }
    ],
    "steps": [
      {
        "text": "어묵은 한입 크기로 썰고, 양파·당근은 채 썹니다."
      },
      {
        "text": "끓는 물에 어묵을 잠깐 데쳐 체에 밭칩니다. 기름기와 잡내가 빠져요.",
        "timer": 0.5
      },
      {
        "text": "진간장·설탕·다진 마늘·물을 미리 섞어 양념장을 만듭니다."
      },
      {
        "text": "팬에 식용유를 두르고 중불에서 양파·당근을 볶다가 어묵을 넣고 함께 볶습니다.",
        "timer": 1
      },
      {
        "text": "양념장을 붓고 국물이 거의 졸아들 때까지 볶습니다.",
        "timer": 2
      },
      {
        "text": "불을 끄고 물엿과 깨를 넣어 윤기 나게 버무립니다."
      }
    ],
    "tip": "물엿은 불을 끈 뒤에 넣어야 딱딱하게 굳지 않아요. 매콤하게 먹으려면 고춧가루 ½큰술을 양념장에 더하세요.",
    "skills": [
      "sauce",
      "knife"
    ],
    "tags": [
      "kids"
    ]
  },
  {
    "id": "dakbokkeumtang",
    "title": "감자 듬뿍 닭볶음탕",
    "emoji": "🍗",
    "cuisine": "한식",
    "category": "메인",
    "time": 50,
    "level": "보통",
    "servings": 3,
    "desc": "닭을 한 번 데친 뒤 매콤한 양념에 감자와 함께 졸이는 한 냄비 요리. 재료를 넣는 순서만 지키면 실패가 없어요.",
    "ingredients": [
      {
        "name": "닭 볶음탕용",
        "amount": 1,
        "unit": "kg",
        "note": "한 마리"
      },
      {
        "name": "감자",
        "amount": 2,
        "unit": "개"
      },
      {
        "name": "당근",
        "amount": 0.5,
        "unit": "개"
      },
      {
        "name": "양파",
        "amount": 1,
        "unit": "개"
      },
      {
        "name": "대파",
        "amount": 1,
        "unit": "대"
      },
      {
        "name": "청양고추",
        "amount": 1,
        "unit": "개",
        "note": "선택"
      },
      {
        "name": "고추장",
        "amount": 2,
        "unit": "큰술"
      },
      {
        "name": "고춧가루",
        "amount": 3,
        "unit": "큰술"
      },
      {
        "name": "진간장",
        "amount": 5,
        "unit": "큰술"
      },
      {
        "name": "설탕",
        "amount": 2,
        "unit": "큰술"
      },
      {
        "name": "다진 마늘",
        "amount": 1.5,
        "unit": "큰술"
      },
      {
        "name": "물",
        "amount": 3,
        "unit": "컵"
      },
      {
        "name": "후추",
        "amount": null,
        "unit": "",
        "note": "약간"
      }
    ],
    "steps": [
      {
        "text": "감자·당근은 큼직하게, 양파는 4~6등분, 대파·고추는 어슷 썹니다."
      },
      {
        "text": "닭은 끓는 물에 넣어 겉이 하얗게 될 때까지 데친 뒤 찬물에 헹궈 기름과 불순물을 씻어냅니다.",
        "timer": 5
      },
      {
        "text": "고추장·고춧가루·진간장·설탕·다진 마늘·후추를 섞어 양념장을 만듭니다."
      },
      {
        "text": "냄비에 닭·물·양념장을 넣고 센불에서 끓입니다.",
        "timer": 10
      },
      {
        "text": "감자·당근을 넣고 중불로 줄여 감자가 젓가락으로 쑥 들어갈 때까지 끓입니다. 가끔 바닥을 저어 주세요.",
        "timer": 15
      },
      {
        "text": "양파·대파·고추를 넣고 국물이 자작해질 때까지 조금 더 끓입니다.",
        "timer": 5
      }
    ],
    "tip": "닭 껍질 쪽 기름이 싫다면 데치기 전에 가위로 껍질 일부를 잘라내세요. 국물이 너무 졸면 물을 ½컵씩 보충합니다.",
    "skills": [
      "meat",
      "sauce",
      "knife",
      "hygiene"
    ],
    "tags": []
  },
  {
    "id": "tomato-pasta",
    "title": "기본 토마토 스파게티",
    "emoji": "🍝",
    "cuisine": "양식",
    "category": "파스타",
    "time": 25,
    "level": "쉬움",
    "servings": 2,
    "desc": "시판 토마토소스에 볶은 양파·마늘을 더해 깊은 맛을 내는 첫 파스타. 면 삶기와 면수 활용을 배워요.",
    "ingredients": [
      {
        "name": "스파게티",
        "amount": 200,
        "unit": "g"
      },
      {
        "name": "토마토 파스타소스",
        "amount": 300,
        "unit": "g",
        "note": "시판"
      },
      {
        "name": "양파",
        "amount": 0.5,
        "unit": "개"
      },
      {
        "name": "마늘",
        "amount": 3,
        "unit": "쪽"
      },
      {
        "name": "올리브유",
        "amount": 2,
        "unit": "큰술"
      },
      {
        "name": "소금",
        "amount": 1,
        "unit": "큰술",
        "note": "면 삶는 물용"
      },
      {
        "name": "파마산 치즈",
        "amount": null,
        "unit": "",
        "note": "취향껏"
      },
      {
        "name": "후추",
        "amount": null,
        "unit": "",
        "note": "약간"
      }
    ],
    "steps": [
      {
        "text": "큰 냄비에 물 2L 를 끓이고 소금 1큰술을 넣습니다. 양파는 잘게 썰고 마늘은 편 썹니다."
      },
      {
        "text": "물이 팔팔 끓으면 스파게티를 펼쳐 넣고 포장지 시간보다 1분 짧게 삶습니다. 처음 1분은 붙지 않게 저어 주세요.",
        "timer": 8
      },
      {
        "text": "면이 삶아지는 동안 팬에 올리브유를 두르고 중약불에서 마늘·양파를 투명해질 때까지 볶습니다.",
        "timer": 3
      },
      {
        "text": "토마토소스를 붓고 약불에서 보글보글 데웁니다. 면수는 버리기 전에 한 국자 떠 둡니다."
      },
      {
        "text": "건진 면과 면수 반 국자를 소스에 넣고 센불에서 섞어 소스가 면에 붙게 합니다.",
        "timer": 1
      },
      {
        "text": "접시에 담고 파마산 치즈와 후추를 뿌립니다."
      }
    ],
    "tip": "소스가 뻑뻑하면 면수를 조금씩 더하세요. 면수의 전분과 소금기가 소스를 면에 착 붙게 해 줍니다.",
    "skills": [
      "noodle",
      "heat",
      "knife"
    ],
    "tags": [
      "kids"
    ]
  },
  {
    "id": "aglio-olio",
    "title": "마늘 듬뿍 알리오 올리오",
    "emoji": "🧄",
    "cuisine": "양식",
    "category": "파스타",
    "time": 20,
    "level": "쉬움",
    "servings": 1,
    "desc": "재료는 단순하지만 마늘을 약불에서 천천히 익히는 것이 전부인 파스타. 불 조절 연습용으로 최고예요.",
    "ingredients": [
      {
        "name": "스파게티",
        "amount": 100,
        "unit": "g"
      },
      {
        "name": "마늘",
        "amount": 6,
        "unit": "쪽"
      },
      {
        "name": "올리브유",
        "amount": 5,
        "unit": "큰술"
      },
      {
        "name": "페페론치노",
        "amount": 3,
        "unit": "개",
        "note": "또는 마른 청양고추"
      },
      {
        "name": "소금",
        "amount": 0.5,
        "unit": "큰술",
        "note": "면 삶는 물용"
      },
      {
        "name": "면수",
        "amount": 1,
        "unit": "국자"
      },
      {
        "name": "파슬리",
        "amount": null,
        "unit": "",
        "note": "선택"
      }
    ],
    "steps": [
      {
        "text": "물 1L 에 소금 ½큰술을 넣어 끓이고, 마늘은 얇게 편 썹니다."
      },
      {
        "text": "스파게티를 넣고 포장지 시간보다 1분 짧게 삶습니다.",
        "timer": 7
      },
      {
        "text": "차가운 팬에 올리브유와 마늘을 함께 넣고 약불에서 마늘이 연한 갈색이 될 때까지 천천히 익힙니다. 진한 갈색이 되면 쓴맛이 나요.",
        "timer": 3
      },
      {
        "text": "페페론치노를 손으로 부숴 넣고 10초만 볶습니다."
      },
      {
        "text": "면과 면수 한 국자를 넣고 팬을 흔들며 섞어 기름과 면수가 뽀얗게 어우러지게 합니다.",
        "timer": 1
      },
      {
        "text": "맛을 보고 싱거우면 소금을 조금 더하고 파슬리를 뿌립니다."
      }
    ],
    "tip": "기름이 뜨거운 상태에서 마늘을 넣으면 금방 타요. 반드시 찬 기름에 마늘부터 넣고 불을 켜세요.",
    "skills": [
      "noodle",
      "heat"
    ],
    "tags": [
      "night"
    ]
  },
  {
    "id": "cream-pasta",
    "title": "베이컨 크림 파스타",
    "emoji": "🥛",
    "cuisine": "양식",
    "category": "파스타",
    "time": 25,
    "level": "쉬움",
    "servings": 2,
    "desc": "생크림과 우유를 반반 섞어 느끼하지 않게 만든 크림 파스타. 소스 농도 맞추는 감을 익혀요.",
    "ingredients": [
      {
        "name": "스파게티",
        "amount": 200,
        "unit": "g"
      },
      {
        "name": "베이컨",
        "amount": 4,
        "unit": "줄"
      },
      {
        "name": "양파",
        "amount": 0.5,
        "unit": "개"
      },
      {
        "name": "마늘",
        "amount": 3,
        "unit": "쪽"
      },
      {
        "name": "생크림",
        "amount": 200,
        "unit": "ml"
      },
      {
        "name": "우유",
        "amount": 200,
        "unit": "ml"
      },
      {
        "name": "파마산 치즈",
        "amount": 2,
        "unit": "큰술"
      },
      {
        "name": "소금",
        "amount": 1,
        "unit": "큰술",
        "note": "면 삶는 물용"
      },
      {
        "name": "버섯",
        "amount": 1,
        "unit": "줌",
        "note": "선택"
      },
      {
        "name": "후추",
        "amount": null,
        "unit": "",
        "note": "약간"
      }
    ],
    "steps": [
      {
        "text": "물 2L 에 소금 1큰술을 넣어 끓이고, 베이컨은 2cm 폭, 양파는 채, 마늘은 편으로 썹니다."
      },
      {
        "text": "스파게티를 포장지 시간보다 1분 짧게 삶습니다.",
        "timer": 7
      },
      {
        "text": "팬에 기름 없이 베이컨을 중불로 볶아 기름을 내고, 그 기름에 양파·마늘·버섯을 볶습니다.",
        "timer": 3
      },
      {
        "text": "생크림과 우유를 붓고 약불에서 가장자리가 보글거릴 때까지 데웁니다. 센불이면 우유가 분리돼요.",
        "timer": 2
      },
      {
        "text": "면을 넣고 소스가 면에 묻을 정도로 걸쭉해질 때까지 졸입니다.",
        "timer": 2
      },
      {
        "text": "불을 끄고 파마산 치즈와 후추를 넣어 섞고, 짜기 전에 맛부터 봅니다."
      }
    ],
    "tip": "베이컨과 치즈가 짜서 소금은 마지막에 맛을 보고 넣으세요. 식으면 금방 되직해지니 접시도 미리 데워 두면 좋아요.",
    "skills": [
      "noodle",
      "heat",
      "seasoning"
    ],
    "tags": [
      "kids"
    ]
  },
  {
    "id": "omurice",
    "title": "케첩 오므라이스",
    "emoji": "🍳",
    "cuisine": "양식",
    "category": "메인",
    "time": 25,
    "level": "쉬움",
    "servings": 1,
    "desc": "케첩 볶음밥 위에 반숙 달걀을 덮는 경양식 메뉴. 남은 밥과 냉장고 재료로 만들 수 있어요.",
    "ingredients": [
      {
        "name": "밥",
        "amount": 1,
        "unit": "공기"
      },
      {
        "name": "달걀",
        "amount": 2,
        "unit": "개"
      },
      {
        "name": "양파",
        "amount": 0.3,
        "unit": "개"
      },
      {
        "name": "당근",
        "amount": 20,
        "unit": "g"
      },
      {
        "name": "햄",
        "amount": 50,
        "unit": "g",
        "note": "또는 소시지"
      },
      {
        "name": "케첩",
        "amount": 3,
        "unit": "큰술"
      },
      {
        "name": "식용유",
        "amount": 1,
        "unit": "큰술"
      },
      {
        "name": "우유",
        "amount": 1,
        "unit": "큰술"
      },
      {
        "name": "소금",
        "amount": null,
        "unit": "",
        "note": "약간"
      },
      {
        "name": "버터",
        "amount": null,
        "unit": "",
        "note": "선택"
      }
    ],
    "steps": [
      {
        "text": "양파·당근·햄을 밥알 크기로 잘게 썹니다."
      },
      {
        "text": "팬에 식용유를 두르고 중불에서 당근→양파→햄 순서로 볶습니다.",
        "timer": 2
      },
      {
        "text": "밥과 케첩 2큰술을 넣고 밥알이 뭉치지 않게 주걱으로 자르듯 볶아 접시에 타원형으로 담습니다.",
        "timer": 2
      },
      {
        "text": "달걀에 우유·소금을 넣어 풀고, 팬을 닦은 뒤 약불에 버터나 기름을 둘러 달걀물을 붓습니다."
      },
      {
        "text": "젓가락으로 크게 몇 번 휘저어 윗면이 촉촉한 반숙일 때 불을 끕니다.",
        "timer": 1
      },
      {
        "text": "달걀을 밥 위에 미끄러지듯 덮고 남은 케첩을 뿌립니다."
      }
    ],
    "tip": "달걀은 약불에서 부드럽게! 다 익혀 버리면 밥을 감쌀 때 찢어져요. 처음엔 그냥 밥 위에 올리기만 해도 충분합니다.",
    "skills": [
      "egg",
      "rice",
      "knife"
    ],
    "tags": [
      "kids"
    ]
  },
  {
    "id": "hamburg-steak",
    "title": "육즙 함박스테이크",
    "emoji": "🍔",
    "cuisine": "양식",
    "category": "메인",
    "time": 40,
    "level": "보통",
    "servings": 2,
    "desc": "소·돼지 다진 고기를 섞어 치댄 패티를 굽고 물을 부어 속까지 익히는 방법. 고기 익힘 확인법을 배워요.",
    "ingredients": [
      {
        "name": "다진 소고기",
        "amount": 200,
        "unit": "g"
      },
      {
        "name": "다진 돼지고기",
        "amount": 100,
        "unit": "g"
      },
      {
        "name": "양파",
        "amount": 0.5,
        "unit": "개"
      },
      {
        "name": "빵가루",
        "amount": 4,
        "unit": "큰술"
      },
      {
        "name": "우유",
        "amount": 2,
        "unit": "큰술"
      },
      {
        "name": "달걀",
        "amount": 1,
        "unit": "개"
      },
      {
        "name": "소금",
        "amount": 0.5,
        "unit": "작은술"
      },
      {
        "name": "후추",
        "amount": null,
        "unit": "",
        "note": "약간"
      },
      {
        "name": "케첩",
        "amount": 3,
        "unit": "큰술",
        "note": "소스"
      },
      {
        "name": "돈가스소스",
        "amount": 3,
        "unit": "큰술",
        "note": "소스"
      },
      {
        "name": "설탕",
        "amount": 0.5,
        "unit": "큰술",
        "note": "소스"
      },
      {
        "name": "버터",
        "amount": 10,
        "unit": "g",
        "note": "소스"
      }
    ],
    "steps": [
      {
        "text": "양파를 잘게 다져 기름 두른 팬에 갈색이 돌 때까지 볶은 뒤 완전히 식힙니다.",
        "timer": 3
      },
      {
        "text": "볼에 고기·식힌 양파·빵가루·우유·달걀·소금·후추를 넣고 끈기가 생길 때까지 1~2분 치댑니다."
      },
      {
        "text": "2등분해 손바닥으로 공 던지듯 주고받아 공기를 빼고, 1.5cm 두께로 납작하게 만든 뒤 가운데를 살짝 누릅니다."
      },
      {
        "text": "중불로 달군 팬에 올려 한 면당 갈색이 날 때까지 굽습니다.",
        "timer": 3
      },
      {
        "text": "뒤집은 뒤 물 3큰술을 붓고 뚜껑을 덮어 약불에서 속까지 익힙니다. 젓가락으로 찔러 맑은 육즙이 나오면 완성.",
        "timer": 6
      },
      {
        "text": "패티를 꺼낸 팬에 케첩·돈가스소스·설탕·물 3큰술·버터를 넣고 걸쭉하게 졸여 패티 위에 붓습니다.",
        "timer": 2
      }
    ],
    "tip": "가운데를 오목하게 눌러야 구울 때 가운데가 부풀지 않고 고르게 익어요. 붉은 육즙이 나오면 뚜껑을 덮고 2분 더!",
    "skills": [
      "meat",
      "heat",
      "knife"
    ],
    "tags": [
      "kids"
    ]
  },
  {
    "id": "gambas",
    "title": "새우 감바스 알 아히요",
    "emoji": "🦐",
    "cuisine": "양식",
    "category": "메인",
    "time": 20,
    "level": "쉬움",
    "servings": 2,
    "desc": "올리브유에 마늘과 새우를 익혀 빵에 찍어 먹는 스페인식 요리. 냉동 새우 다루는 법을 익혀요.",
    "ingredients": [
      {
        "name": "냉동 새우",
        "amount": 250,
        "unit": "g",
        "note": "중하 15마리 정도"
      },
      {
        "name": "마늘",
        "amount": 10,
        "unit": "쪽"
      },
      {
        "name": "올리브유",
        "amount": 150,
        "unit": "ml"
      },
      {
        "name": "페페론치노",
        "amount": 4,
        "unit": "개",
        "note": "또는 마른 청양고추"
      },
      {
        "name": "소금",
        "amount": null,
        "unit": "",
        "note": "약간"
      },
      {
        "name": "후추",
        "amount": null,
        "unit": "",
        "note": "약간"
      },
      {
        "name": "바게트",
        "amount": null,
        "unit": "",
        "note": "곁들임"
      },
      {
        "name": "파슬리",
        "amount": null,
        "unit": "",
        "note": "선택"
      }
    ],
    "steps": [
      {
        "text": "냉동 새우를 찬 소금물에 담가 해동합니다.",
        "timer": 10
      },
      {
        "text": "해동한 새우는 키친타월로 물기를 꼼꼼히 닦고 소금·후추를 살짝 뿌립니다. 물기가 남으면 기름이 튀어요."
      },
      {
        "text": "마늘은 반은 편 썰고 반은 통으로 둡니다."
      },
      {
        "text": "작은 팬에 올리브유와 마늘을 넣고 약불에서 마늘이 노릇해질 때까지 익힙니다.",
        "timer": 4
      },
      {
        "text": "페페론치노를 부숴 넣고 새우를 넣어 색이 주황빛으로 변할 때까지 익힙니다.",
        "timer": 3
      },
      {
        "text": "소금으로 간하고 파슬리를 뿌린 뒤, 구운 바게트를 곁들입니다."
      }
    ],
    "tip": "남은 기름은 버리지 말고 다음 날 알리오 올리오 기름으로 쓰면 새우 향이 그대로 살아나요.",
    "skills": [
      "seafood",
      "heat",
      "hygiene"
    ],
    "tags": [
      "night"
    ]
  },
  {
    "id": "french-toast",
    "title": "촉촉 프렌치토스트",
    "emoji": "🍞",
    "cuisine": "양식",
    "category": "브런치",
    "time": 15,
    "level": "쉬움",
    "servings": 2,
    "desc": "달걀물을 머금은 식빵을 버터에 굽는 간단한 브런치. 약불에서 천천히 굽는 감을 익혀요.",
    "ingredients": [
      {
        "name": "식빵",
        "amount": 4,
        "unit": "장"
      },
      {
        "name": "달걀",
        "amount": 2,
        "unit": "개"
      },
      {
        "name": "우유",
        "amount": 100,
        "unit": "ml"
      },
      {
        "name": "설탕",
        "amount": 1,
        "unit": "큰술"
      },
      {
        "name": "버터",
        "amount": 10,
        "unit": "g"
      },
      {
        "name": "소금",
        "amount": null,
        "unit": "",
        "note": "한 꼬집"
      },
      {
        "name": "시나몬 가루",
        "amount": null,
        "unit": "",
        "note": "선택"
      },
      {
        "name": "메이플시럽",
        "amount": null,
        "unit": "",
        "note": "곁들임"
      }
    ],
    "steps": [
      {
        "text": "넓은 그릇에 달걀·우유·설탕·소금(있으면 시나몬)을 넣고 잘 풉니다."
      },
      {
        "text": "식빵을 앞뒤로 각각 10초 정도 담가 달걀물을 충분히 먹입니다."
      },
      {
        "text": "팬을 약불로 달구고 버터를 녹입니다. 버터가 갈색으로 타면 너무 센 불이에요."
      },
      {
        "text": "식빵을 올려 한 면이 노릇해질 때까지 굽습니다.",
        "timer": 2
      },
      {
        "text": "뒤집어 반대쪽도 노릇하게 굽습니다.",
        "timer": 2
      },
      {
        "text": "접시에 담아 메이플시럽이나 꿀, 과일을 곁들입니다."
      }
    ],
    "tip": "하루 지난 식빵이 달걀물을 더 잘 머금어요. 불이 세면 겉만 타고 속은 날달걀이 되니 꼭 약불!",
    "skills": [
      "egg",
      "heat"
    ],
    "tags": [
      "kids"
    ]
  },
  {
    "id": "japanese-curry",
    "title": "일본식 카레라이스",
    "emoji": "🍛",
    "cuisine": "이색",
    "category": "일본",
    "time": 40,
    "level": "쉬움",
    "servings": 4,
    "desc": "고형 카레 블록으로 만드는 진하고 달콤한 일본 가정식 카레. 깍둑썰기와 불 끄고 블록 녹이기가 핵심이에요.",
    "ingredients": [
      {
        "name": "고형 카레",
        "amount": 100,
        "unit": "g",
        "note": "블록 4조각, 약 반 팩"
      },
      {
        "name": "돼지고기",
        "amount": 200,
        "unit": "g",
        "note": "카레용 앞다리"
      },
      {
        "name": "감자",
        "amount": 2,
        "unit": "개"
      },
      {
        "name": "당근",
        "amount": 1,
        "unit": "개"
      },
      {
        "name": "양파",
        "amount": 2,
        "unit": "개"
      },
      {
        "name": "식용유",
        "amount": 1,
        "unit": "큰술"
      },
      {
        "name": "물",
        "amount": 600,
        "unit": "ml"
      },
      {
        "name": "밥",
        "amount": 4,
        "unit": "공기"
      }
    ],
    "steps": [
      {
        "text": "감자·당근·고기는 한입 크기로 깍둑 썰고 양파는 채 썹니다."
      },
      {
        "text": "냄비에 식용유를 두르고 중불에서 양파를 갈색빛이 돌 때까지 볶습니다. 오래 볶을수록 단맛이 깊어져요.",
        "timer": 5
      },
      {
        "text": "고기를 넣어 겉면이 익으면 감자·당근을 넣고 1~2분 더 볶습니다."
      },
      {
        "text": "물을 붓고 끓어오르면 거품을 걷어낸 뒤 중약불에서 감자가 익을 때까지 끓입니다.",
        "timer": 15
      },
      {
        "text": "불을 끄고 카레 블록을 넣어 완전히 녹입니다. 끓는 상태에서 넣으면 덩어리가 져요."
      },
      {
        "text": "다시 약불로 바닥이 눌지 않게 저으며 걸쭉해질 때까지 끓여 밥에 곁들입니다.",
        "timer": 5
      }
    ],
    "tip": "하룻밤 지나면 더 맛있어요. 단, 감자가 든 카레는 상온에 두지 말고 식혀서 바로 냉장 보관하세요.",
    "skills": [
      "knife",
      "heat",
      "hygiene"
    ],
    "tags": [
      "kids"
    ]
  },
  {
    "id": "gyudon",
    "title": "규동 (소고기덮밥)",
    "emoji": "🥩",
    "cuisine": "이색",
    "category": "일본",
    "time": 20,
    "level": "쉬움",
    "servings": 2,
    "desc": "달짝지근한 간장 국물에 양파와 얇은 소고기를 살짝 끓여 밥에 올리는 일본식 덮밥. 20분이면 충분해요.",
    "ingredients": [
      {
        "name": "소고기 불고기감",
        "amount": 200,
        "unit": "g",
        "note": "또는 차돌박이"
      },
      {
        "name": "양파",
        "amount": 1,
        "unit": "개"
      },
      {
        "name": "물",
        "amount": 150,
        "unit": "ml"
      },
      {
        "name": "진간장",
        "amount": 3,
        "unit": "큰술"
      },
      {
        "name": "맛술",
        "amount": 3,
        "unit": "큰술"
      },
      {
        "name": "설탕",
        "amount": 1,
        "unit": "큰술"
      },
      {
        "name": "다진 생강",
        "amount": null,
        "unit": "",
        "note": "약간, 선택"
      },
      {
        "name": "밥",
        "amount": 2,
        "unit": "공기"
      },
      {
        "name": "쪽파",
        "amount": null,
        "unit": "",
        "note": "약간"
      },
      {
        "name": "달걀노른자",
        "amount": null,
        "unit": "",
        "note": "선택"
      }
    ],
    "steps": [
      {
        "text": "양파는 0.5cm 두께로 채 썰고, 소고기는 키친타월로 핏물을 가볍게 눌러 닦습니다."
      },
      {
        "text": "냄비에 물·진간장·맛술·설탕(생강)을 넣고 끓입니다."
      },
      {
        "text": "양파를 넣고 숨이 죽을 때까지 끓입니다.",
        "timer": 3
      },
      {
        "text": "소고기를 한 장씩 펼쳐 넣고 젓가락으로 풀며 익힙니다. 떠오르는 거품은 걷어냅니다.",
        "timer": 3
      },
      {
        "text": "그릇에 밥을 담고 고기와 양파를 국물째 올린 뒤 쪽파를 뿌립니다. 노른자를 올리면 더 부드러워요."
      }
    ],
    "tip": "고기는 오래 끓이면 질겨져요. 색이 변하자마자 불을 끄세요. 간장·맛술 1:1 비율은 일본식 덮밥의 기본 양념입니다.",
    "skills": [
      "meat",
      "sauce",
      "rice"
    ],
    "tags": []
  },
  {
    "id": "oyakodon",
    "title": "오야코동 (닭고기 달걀덮밥)",
    "emoji": "🐔",
    "cuisine": "이색",
    "category": "일본",
    "time": 20,
    "level": "쉬움",
    "servings": 1,
    "desc": "닭고기와 달걀을 달큰한 간장 국물에 익혀 밥에 올리는 덮밥. 달걀을 반숙으로 멈추는 타이밍을 배워요.",
    "ingredients": [
      {
        "name": "닭다리살",
        "amount": 150,
        "unit": "g"
      },
      {
        "name": "양파",
        "amount": 0.5,
        "unit": "개"
      },
      {
        "name": "달걀",
        "amount": 2,
        "unit": "개"
      },
      {
        "name": "물",
        "amount": 100,
        "unit": "ml"
      },
      {
        "name": "진간장",
        "amount": 2,
        "unit": "큰술"
      },
      {
        "name": "맛술",
        "amount": 2,
        "unit": "큰술"
      },
      {
        "name": "설탕",
        "amount": 0.5,
        "unit": "큰술"
      },
      {
        "name": "밥",
        "amount": 1,
        "unit": "공기"
      },
      {
        "name": "쪽파",
        "amount": null,
        "unit": "",
        "note": "약간"
      }
    ],
    "steps": [
      {
        "text": "닭다리살은 한입 크기로, 양파는 채 썹니다. 달걀은 흰자와 노른자가 대충 섞일 정도로만 풉니다."
      },
      {
        "text": "작은 팬에 물·진간장·맛술·설탕을 넣고 끓으면 양파를 넣습니다."
      },
      {
        "text": "닭고기를 넣고 뒤집어 가며 속까지 익힙니다. 가장 두꺼운 조각을 잘라 분홍빛이 없는지 확인하세요.",
        "timer": 5
      },
      {
        "text": "달걀물의 ⅔를 둘러 붓고 가장자리가 익기 시작하면 나머지를 붓습니다."
      },
      {
        "text": "뚜껑을 덮고 약불에서 달걀이 반숙이 될 때까지만 둔 뒤 불을 끕니다.",
        "timer": 1
      },
      {
        "text": "밥 위에 미끄러지듯 올리고 쪽파를 뿌립니다."
      }
    ],
    "tip": "달걀을 두 번에 나눠 부으면 익은 부분과 촉촉한 부분이 함께 있어 식감이 좋아요.",
    "skills": [
      "egg",
      "meat",
      "rice"
    ],
    "tags": []
  },
  {
    "id": "pad-thai",
    "title": "새우 팟타이",
    "emoji": "🍜",
    "cuisine": "이색",
    "category": "태국",
    "time": 30,
    "level": "보통",
    "servings": 2,
    "desc": "불린 쌀국수를 새콤달콤한 소스에 볶는 태국 대표 볶음면. 구하기 어려운 재료는 마트 재료로 바꿨어요.",
    "ingredients": [
      {
        "name": "쌀국수",
        "amount": 150,
        "unit": "g",
        "note": "5mm 납작면"
      },
      {
        "name": "새우",
        "amount": 10,
        "unit": "마리"
      },
      {
        "name": "달걀",
        "amount": 2,
        "unit": "개"
      },
      {
        "name": "숙주",
        "amount": 100,
        "unit": "g"
      },
      {
        "name": "부추",
        "amount": 1,
        "unit": "줌",
        "note": "또는 쪽파"
      },
      {
        "name": "다진 마늘",
        "amount": 1,
        "unit": "큰술"
      },
      {
        "name": "식용유",
        "amount": 2,
        "unit": "큰술"
      },
      {
        "name": "땅콩",
        "amount": 2,
        "unit": "큰술",
        "note": "다진 것"
      },
      {
        "name": "피시소스",
        "amount": 2,
        "unit": "큰술",
        "note": "또는 멸치액젓"
      },
      {
        "name": "굴소스",
        "amount": 1,
        "unit": "큰술"
      },
      {
        "name": "설탕",
        "amount": 1.5,
        "unit": "큰술"
      },
      {
        "name": "식초",
        "amount": 1,
        "unit": "큰술"
      },
      {
        "name": "물",
        "amount": 3,
        "unit": "큰술"
      },
      {
        "name": "라임",
        "amount": null,
        "unit": "",
        "note": "또는 레몬, 선택"
      }
    ],
    "steps": [
      {
        "text": "쌀국수를 미지근한 물에 담가 불립니다. 살짝 심이 남을 정도까지만 불려야 볶을 때 퍼지지 않아요.",
        "timer": 20
      },
      {
        "text": "피시소스·굴소스·설탕·식초·물을 섞어 소스를 만들고, 부추는 5cm 길이로 썹니다."
      },
      {
        "text": "팬에 식용유를 두르고 중불에서 마늘과 새우를 볶습니다.",
        "timer": 2
      },
      {
        "text": "재료를 한쪽으로 밀고 빈 곳에 달걀을 깨 넣어 스크램블한 뒤 섞습니다."
      },
      {
        "text": "물기 뺀 쌀국수와 소스를 넣고 센불에서 면이 소스를 흡수할 때까지 볶습니다. 면이 뻣뻣하면 물을 1~2큰술 더하세요.",
        "timer": 2
      },
      {
        "text": "숙주·부추를 넣고 30초만 더 볶아 접시에 담고 땅콩과 라임을 곁들입니다."
      }
    ],
    "tip": "태국 현지는 타마린드로 신맛을 내지만, 식초+설탕으로도 충분히 비슷한 새콤달콤함이 납니다.",
    "skills": [
      "noodle",
      "global",
      "seafood"
    ],
    "tags": []
  },
  {
    "id": "gapao-rice",
    "title": "가파오 라이스 (바질 돼지고기 덮밥)",
    "emoji": "🌿",
    "cuisine": "이색",
    "category": "태국",
    "time": 20,
    "level": "쉬움",
    "servings": 2,
    "desc": "다진 돼지고기를 굴소스·피시소스에 볶고 바질 향을 입혀 달걀프라이와 먹는 태국 길거리 덮밥이에요.",
    "ingredients": [
      {
        "name": "다진 돼지고기",
        "amount": 250,
        "unit": "g"
      },
      {
        "name": "양파",
        "amount": 0.5,
        "unit": "개"
      },
      {
        "name": "파프리카",
        "amount": 0.5,
        "unit": "개"
      },
      {
        "name": "마늘",
        "amount": 4,
        "unit": "쪽"
      },
      {
        "name": "청양고추",
        "amount": 2,
        "unit": "개"
      },
      {
        "name": "바질",
        "amount": 1,
        "unit": "줌",
        "note": "또는 깻잎"
      },
      {
        "name": "굴소스",
        "amount": 1.5,
        "unit": "큰술"
      },
      {
        "name": "피시소스",
        "amount": 1,
        "unit": "큰술",
        "note": "또는 멸치액젓"
      },
      {
        "name": "진간장",
        "amount": 0.5,
        "unit": "큰술"
      },
      {
        "name": "설탕",
        "amount": 0.3,
        "unit": "큰술"
      },
      {
        "name": "식용유",
        "amount": 3,
        "unit": "큰술"
      },
      {
        "name": "달걀",
        "amount": 2,
        "unit": "개"
      },
      {
        "name": "밥",
        "amount": 2,
        "unit": "공기"
      }
    ],
    "steps": [
      {
        "text": "마늘·청양고추는 다지고 양파·파프리카는 1cm 크기로 썹니다."
      },
      {
        "text": "팬에 식용유 2큰술을 넉넉히 두르고 달걀을 하나씩 깨 넣어 가장자리가 바삭한 반숙 프라이를 만듭니다.",
        "timer": 2
      },
      {
        "text": "팬에 남은 기름에 마늘·고추를 중불로 볶아 향을 냅니다."
      },
      {
        "text": "다진 돼지고기를 넣고 덩어리를 풀며 붉은 기가 없을 때까지 볶습니다.",
        "timer": 3
      },
      {
        "text": "양파·파프리카와 굴소스·피시소스·간장·설탕을 넣고 센불에서 빠르게 볶습니다.",
        "timer": 1
      },
      {
        "text": "불을 끄고 바질을 넣어 섞은 뒤 밥 위에 올리고 달걀프라이를 얹습니다."
      }
    ],
    "tip": "바질은 열에 약해 불을 끈 뒤 넣어야 향이 살아요. 바질이 없으면 깻잎을 채 썰어 넣어도 잘 어울립니다.",
    "skills": [
      "global",
      "meat",
      "egg"
    ],
    "tags": []
  },
  {
    "id": "mapo-tofu",
    "title": "마파두부",
    "emoji": "🌶️",
    "cuisine": "이색",
    "category": "중국",
    "time": 25,
    "level": "보통",
    "servings": 2,
    "desc": "두반장과 고춧가루로 낸 얼얼한 소스에 부드러운 두부를 졸이는 중국 가정식. 전분물 농도 맞추기를 배워요.",
    "ingredients": [
      {
        "name": "두부",
        "amount": 1,
        "unit": "모",
        "note": "약 380g"
      },
      {
        "name": "다진 돼지고기",
        "amount": 100,
        "unit": "g"
      },
      {
        "name": "대파",
        "amount": 0.5,
        "unit": "대"
      },
      {
        "name": "다진 마늘",
        "amount": 1,
        "unit": "큰술"
      },
      {
        "name": "다진 생강",
        "amount": null,
        "unit": "",
        "note": "약간, 선택"
      },
      {
        "name": "두반장",
        "amount": 1.5,
        "unit": "큰술"
      },
      {
        "name": "고춧가루",
        "amount": 1,
        "unit": "큰술"
      },
      {
        "name": "진간장",
        "amount": 1,
        "unit": "큰술"
      },
      {
        "name": "설탕",
        "amount": 0.5,
        "unit": "큰술"
      },
      {
        "name": "물",
        "amount": 200,
        "unit": "ml"
      },
      {
        "name": "전분",
        "amount": 1,
        "unit": "큰술",
        "note": "물 2큰술에 갠다"
      },
      {
        "name": "식용유",
        "amount": 2,
        "unit": "큰술"
      },
      {
        "name": "참기름",
        "amount": null,
        "unit": "",
        "note": "약간"
      }
    ],
    "steps": [
      {
        "text": "두부는 2cm 깍둑썰기, 대파는 잘게 썹니다. 전분은 물 2큰술에 미리 개어 둡니다."
      },
      {
        "text": "끓는 물에 소금 한 꼬집과 두부를 넣어 데친 뒤 건집니다. 두부가 단단해져 덜 부서져요.",
        "timer": 2
      },
      {
        "text": "팬에 식용유를 두르고 약불에서 대파 절반·마늘(생강)을 볶아 향을 냅니다.",
        "timer": 1
      },
      {
        "text": "다진 고기를 넣고 중불에서 볶다가, 불을 약하게 줄여 두반장·고춧가루를 넣고 타지 않게 볶습니다."
      },
      {
        "text": "물·간장·설탕을 넣고 끓으면 두부를 넣어 국자로 살살 밀듯이 섞으며 끓입니다.",
        "timer": 3
      },
      {
        "text": "전분물을 다시 저어 2~3번에 나눠 넣으며 원하는 농도가 되면 멈추고, 참기름과 남은 대파를 뿌립니다."
      }
    ],
    "tip": "두반장이 없으면 고추장 1큰술 + 된장 ½큰술 + 고춧가루 ½큰술로 대신할 수 있어요. 전분물은 가라앉으니 넣기 직전에 꼭 저으세요.",
    "skills": [
      "global",
      "sauce",
      "heat"
    ],
    "tags": []
  },
  {
    "id": "tomato-egg",
    "title": "토마토 달걀볶음",
    "emoji": "🍅",
    "cuisine": "이색",
    "category": "중국",
    "time": 15,
    "level": "쉬움",
    "servings": 2,
    "desc": "중국 가정에서 가장 흔한 반찬. 달걀을 먼저 반숙으로 볶아 빼 두는 것만 기억하면 10분 완성이에요.",
    "ingredients": [
      {
        "name": "토마토",
        "amount": 2,
        "unit": "개"
      },
      {
        "name": "달걀",
        "amount": 3,
        "unit": "개"
      },
      {
        "name": "대파",
        "amount": 0.3,
        "unit": "대"
      },
      {
        "name": "식용유",
        "amount": 3,
        "unit": "큰술"
      },
      {
        "name": "설탕",
        "amount": 0.5,
        "unit": "큰술"
      },
      {
        "name": "굴소스",
        "amount": 0.5,
        "unit": "큰술",
        "note": "또는 소금 약간"
      },
      {
        "name": "소금",
        "amount": null,
        "unit": "",
        "note": "약간"
      }
    ],
    "steps": [
      {
        "text": "토마토는 꼭지를 떼고 8등분 웨지 모양으로 썰고, 대파는 송송 썹니다. 달걀은 소금을 조금 넣어 풉니다."
      },
      {
        "text": "팬에 식용유 2큰술을 두르고 센불로 달군 뒤 달걀물을 부어 크게 저어 몽글한 반숙일 때 그릇에 덜어 둡니다.",
        "timer": 0.5
      },
      {
        "text": "같은 팬에 기름 1큰술과 대파를 넣어 향을 내고 토마토를 넣어 즙이 나올 때까지 볶습니다.",
        "timer": 2
      },
      {
        "text": "설탕·굴소스를 넣어 간을 맞춥니다."
      },
      {
        "text": "덜어 둔 달걀을 다시 넣고 토마토 즙과 함께 10초만 섞어 불을 끕니다."
      }
    ],
    "tip": "토마토의 신맛은 설탕이 잡아 줘요. 밥 위에 그대로 올리면 훌륭한 덮밥이 됩니다.",
    "skills": [
      "egg",
      "knife",
      "seasoning"
    ],
    "tags": []
  },
  {
    "id": "wolnamssam",
    "title": "알록달록 월남쌈",
    "emoji": "🥗",
    "cuisine": "이색",
    "category": "베트남",
    "time": 30,
    "level": "쉬움",
    "servings": 2,
    "desc": "불 쓸 일이 거의 없는 베트남식 쌈. 채소 채썰기만 하면 각자 싸 먹는 재미있는 한 상이 차려져요.",
    "ingredients": [
      {
        "name": "라이스페이퍼",
        "amount": 12,
        "unit": "장"
      },
      {
        "name": "새우",
        "amount": 10,
        "unit": "마리"
      },
      {
        "name": "파프리카",
        "amount": 1,
        "unit": "개",
        "note": "빨강·노랑 반씩"
      },
      {
        "name": "오이",
        "amount": 1,
        "unit": "개"
      },
      {
        "name": "당근",
        "amount": 0.5,
        "unit": "개"
      },
      {
        "name": "깻잎",
        "amount": 10,
        "unit": "장"
      },
      {
        "name": "게맛살",
        "amount": 6,
        "unit": "줄"
      },
      {
        "name": "파인애플",
        "amount": null,
        "unit": "",
        "note": "선택"
      },
      {
        "name": "스위트칠리소스",
        "amount": 4,
        "unit": "큰술",
        "note": "찍어 먹는 소스"
      }
    ],
    "steps": [
      {
        "text": "파프리카·오이·당근은 5cm 길이로 가늘게 채 썰고, 게맛살은 결대로 찢습니다."
      },
      {
        "text": "새우는 끓는 물에 넣어 주황빛이 될 때까지 데친 뒤 반으로 가릅니다.",
        "timer": 2
      },
      {
        "text": "채소를 색깔별로 큰 접시에 둘러 담고, 넓은 그릇에 따뜻한 물을 준비합니다."
      },
      {
        "text": "라이스페이퍼를 따뜻한 물에 2~3초만 담갔다 꺼냅니다. 아직 빳빳해도 금방 부드러워져요."
      },
      {
        "text": "깻잎을 깔고 채소·새우를 올린 뒤 양옆을 접고 앞에서부터 돌돌 맙니다. 스위트칠리소스에 찍어 먹습니다."
      }
    ],
    "tip": "라이스페이퍼를 오래 담그면 찢어지고 서로 달라붙어요. 젖은 면끼리 닿지 않게 접시에 하나씩 놓고 싸세요.",
    "skills": [
      "knife",
      "veggie",
      "seafood"
    ],
    "tags": []
  },
  {
    "id": "quesadilla",
    "title": "치킨 퀘사디아",
    "emoji": "🌮",
    "cuisine": "이색",
    "category": "멕시코",
    "time": 20,
    "level": "쉬움",
    "servings": 2,
    "desc": "토르티야에 치즈와 닭고기를 넣어 반으로 접어 굽는 멕시코 간식. 마른 팬에 굽기만 하면 끝이에요.",
    "ingredients": [
      {
        "name": "토르티야",
        "amount": 4,
        "unit": "장",
        "note": "8인치"
      },
      {
        "name": "닭가슴살",
        "amount": 150,
        "unit": "g",
        "note": "삶거나 훈제 제품"
      },
      {
        "name": "모짜렐라 치즈",
        "amount": 100,
        "unit": "g"
      },
      {
        "name": "양파",
        "amount": 0.3,
        "unit": "개"
      },
      {
        "name": "파프리카",
        "amount": 0.5,
        "unit": "개"
      },
      {
        "name": "옥수수콘",
        "amount": 3,
        "unit": "큰술"
      },
      {
        "name": "살사소스",
        "amount": null,
        "unit": "",
        "note": "또는 케첩, 곁들임"
      }
    ],
    "steps": [
      {
        "text": "닭가슴살은 잘게 찢고 양파·파프리카는 잘게 썰어 옥수수콘과 섞습니다."
      },
      {
        "text": "토르티야 반쪽에 치즈 → 속재료 → 치즈 순서로 올리고 반으로 접습니다. 치즈가 접착제 역할을 해요."
      },
      {
        "text": "기름 없이 마른 팬을 중약불로 달구고 토르티야를 올려 아랫면이 노릇해질 때까지 굽습니다.",
        "timer": 2
      },
      {
        "text": "뒤집개로 조심히 뒤집어 반대쪽도 치즈가 녹을 때까지 굽습니다.",
        "timer": 2
      },
      {
        "text": "3등분으로 잘라 살사소스를 곁들입니다."
      }
    ],
    "tip": "남은 불고기나 볶음 재료를 넣어도 맛있어요. 속을 너무 많이 넣으면 뒤집을 때 쏟아지니 얇게!",
    "skills": [
      "heat",
      "knife"
    ],
    "tags": [
      "kids",
      "night"
    ]
  },
  {
    "cuisine": "한식",
    "id": "myeolchi-bokkeum",
    "title": "바삭 멸치볶음",
    "emoji": "🐟",
    "category": "반찬",
    "time": 15,
    "level": "쉬움",
    "servings": 4,
    "desc": "마른 팬에 먼저 볶아 비린내를 날리고 물엿으로 윤기를 낸 상비 반찬.",
    "ingredients": [
      {
        "name": "잔멸치",
        "amount": 100,
        "unit": "g"
      },
      {
        "name": "식용유",
        "amount": 2,
        "unit": "큰술"
      },
      {
        "name": "진간장",
        "amount": 1,
        "unit": "큰술"
      },
      {
        "name": "설탕",
        "amount": 1,
        "unit": "큰술"
      },
      {
        "name": "물엿",
        "amount": 2,
        "unit": "큰술"
      },
      {
        "name": "다진 마늘",
        "amount": 0.5,
        "unit": "큰술"
      },
      {
        "name": "깨",
        "amount": null,
        "unit": "",
        "note": "약간"
      }
    ],
    "steps": [
      {
        "text": "잔멸치를 체에 털어 가루를 버립니다."
      },
      {
        "text": "마른 팬에 멸치를 넣고 중약불에서 수분을 날리듯 볶아 덜어 둡니다.",
        "timer": 2
      },
      {
        "text": "팬에 식용유·다진 마늘을 넣고 약불에서 향을 냅니다.",
        "timer": 0.5
      },
      {
        "text": "멸치를 다시 넣고 진간장·설탕을 넣어 고루 볶습니다.",
        "timer": 1
      },
      {
        "text": "불을 끄고 물엿과 깨를 넣어 버무린 뒤 넓게 펼쳐 식힙니다."
      }
    ],
    "tip": "물엿은 불을 끈 뒤에! 펼쳐 식혀야 서로 뭉치지 않고 바삭해요.",
    "skills": [
      "heat",
      "sauce"
    ],
    "tags": []
  },
  {
    "cuisine": "한식",
    "id": "gamja-jorim",
    "title": "간장 감자조림",
    "emoji": "🥔",
    "category": "반찬",
    "time": 25,
    "level": "쉬움",
    "servings": 4,
    "desc": "포슬한 감자를 달큰한 간장에 졸인 아이들도 좋아하는 반찬.",
    "ingredients": [
      {
        "name": "감자",
        "amount": 3,
        "unit": "개"
      },
      {
        "name": "양파",
        "amount": 0.5,
        "unit": "개"
      },
      {
        "name": "진간장",
        "amount": 4,
        "unit": "큰술"
      },
      {
        "name": "설탕",
        "amount": 1.5,
        "unit": "큰술"
      },
      {
        "name": "물엿",
        "amount": 1,
        "unit": "큰술"
      },
      {
        "name": "다진 마늘",
        "amount": 0.5,
        "unit": "큰술"
      },
      {
        "name": "물",
        "amount": 1,
        "unit": "컵"
      },
      {
        "name": "식용유",
        "amount": 1,
        "unit": "큰술"
      },
      {
        "name": "깨",
        "amount": null,
        "unit": "",
        "note": "약간"
      }
    ],
    "steps": [
      {
        "text": "감자는 2cm 깍둑썰기해 찬물에 담가 전분을 빼고, 양파도 같은 크기로 썹니다.",
        "timer": 5
      },
      {
        "text": "팬에 식용유를 두르고 감자를 중불에서 겉이 투명해질 때까지 볶습니다.",
        "timer": 3
      },
      {
        "text": "물·진간장·설탕·다진 마늘을 넣고 뚜껑을 덮어 끓입니다.",
        "timer": 8
      },
      {
        "text": "양파를 넣고 뚜껑을 열어 국물이 자작해질 때까지 졸입니다. 가끔 뒤적여 주세요.",
        "timer": 5
      },
      {
        "text": "불을 끄고 물엿·깨를 넣어 윤기 나게 섞습니다."
      }
    ],
    "tip": "감자를 먼저 기름에 볶으면 졸여도 부서지지 않아요.",
    "skills": [
      "knife",
      "sauce"
    ],
    "tags": [
      "kids"
    ]
  },
  {
    "cuisine": "한식",
    "id": "kongnamul-muchim",
    "title": "콩나물무침",
    "emoji": "🌱",
    "category": "반찬",
    "time": 15,
    "level": "쉬움",
    "servings": 3,
    "desc": "소금과 참기름만으로 고소하게. 아삭함을 살리는 데치기 시간이 핵심.",
    "ingredients": [
      {
        "name": "콩나물",
        "amount": 300,
        "unit": "g"
      },
      {
        "name": "소금",
        "amount": 0.5,
        "unit": "작은술"
      },
      {
        "name": "다진 마늘",
        "amount": 0.5,
        "unit": "큰술"
      },
      {
        "name": "대파",
        "amount": 0.2,
        "unit": "대"
      },
      {
        "name": "참기름",
        "amount": 1,
        "unit": "큰술"
      },
      {
        "name": "깨",
        "amount": null,
        "unit": "",
        "note": "약간"
      },
      {
        "name": "고춧가루",
        "amount": null,
        "unit": "",
        "note": "선택, 0.5큰술"
      }
    ],
    "steps": [
      {
        "text": "콩나물은 껍질을 골라내고 헹굽니다."
      },
      {
        "text": "냄비에 물 1컵과 소금 약간, 콩나물을 넣고 뚜껑을 덮어 데칩니다. 중간에 뚜껑을 열지 마세요.",
        "timer": 5
      },
      {
        "text": "건져서 넓게 펼쳐 식힙니다. 찬물에 헹구면 맛이 빠져요."
      },
      {
        "text": "다진 마늘·대파·소금·참기름·깨를 넣고 살살 무칩니다."
      }
    ],
    "tip": "빨간 무침은 고춧가루만 더하면 끝. 맛보고 소금은 한 꼬집씩.",
    "skills": [
      "veggie",
      "seasoning"
    ],
    "tags": []
  },
  {
    "cuisine": "한식",
    "id": "musaengchae",
    "title": "새콤달콤 무생채",
    "emoji": "🥕",
    "category": "반찬",
    "time": 20,
    "level": "쉬움",
    "servings": 4,
    "desc": "무를 채 썰어 고춧가루 물을 먼저 들이고 새콤달콤하게 무친 반찬.",
    "ingredients": [
      {
        "name": "무",
        "amount": 400,
        "unit": "g"
      },
      {
        "name": "고춧가루",
        "amount": 2,
        "unit": "큰술"
      },
      {
        "name": "설탕",
        "amount": 1,
        "unit": "큰술"
      },
      {
        "name": "식초",
        "amount": 1,
        "unit": "큰술"
      },
      {
        "name": "멸치액젓",
        "amount": 1,
        "unit": "큰술"
      },
      {
        "name": "소금",
        "amount": 0.5,
        "unit": "작은술"
      },
      {
        "name": "다진 마늘",
        "amount": 0.5,
        "unit": "큰술"
      },
      {
        "name": "대파",
        "amount": 0.2,
        "unit": "대"
      },
      {
        "name": "깨",
        "amount": null,
        "unit": "",
        "note": "약간"
      }
    ],
    "steps": [
      {
        "text": "무는 0.3cm 두께로 가늘게 채 썹니다."
      },
      {
        "text": "고춧가루를 먼저 넣고 버무려 무에 빨간 물을 들입니다.",
        "timer": 3
      },
      {
        "text": "설탕·식초·멸치액젓·소금·다진 마늘을 넣어 무칩니다."
      },
      {
        "text": "대파·깨를 넣고 섞습니다. 바로 먹거나 냉장고에 30분 두면 맛이 뱁니다."
      }
    ],
    "tip": "고춧가루를 먼저 넣어야 색이 곱고, 물이 덜 생겨요.",
    "skills": [
      "knife",
      "seasoning"
    ],
    "tags": []
  },
  {
    "cuisine": "한식",
    "id": "oi-muchim",
    "title": "아삭 오이무침",
    "emoji": "🥒",
    "category": "반찬",
    "time": 20,
    "level": "쉬움",
    "servings": 3,
    "desc": "소금에 살짝 절여 물기를 짜고 무치면 하루가 지나도 아삭해요.",
    "ingredients": [
      {
        "name": "오이",
        "amount": 2,
        "unit": "개"
      },
      {
        "name": "소금",
        "amount": 0.5,
        "unit": "큰술",
        "note": "절임용"
      },
      {
        "name": "양파",
        "amount": 0.3,
        "unit": "개"
      },
      {
        "name": "고춧가루",
        "amount": 1,
        "unit": "큰술"
      },
      {
        "name": "식초",
        "amount": 1,
        "unit": "큰술"
      },
      {
        "name": "설탕",
        "amount": 0.5,
        "unit": "큰술"
      },
      {
        "name": "다진 마늘",
        "amount": 0.5,
        "unit": "큰술"
      },
      {
        "name": "참기름",
        "amount": 0.5,
        "unit": "큰술"
      },
      {
        "name": "깨",
        "amount": null,
        "unit": "",
        "note": "약간"
      }
    ],
    "steps": [
      {
        "text": "오이는 굵은소금으로 문질러 씻고 0.5cm 두께로 동그랗게 썹니다."
      },
      {
        "text": "소금을 뿌려 버무리고 절입니다.",
        "timer": 10
      },
      {
        "text": "절인 오이를 헹구지 말고 손으로 물기를 꼭 짭니다. 양파는 채 썹니다."
      },
      {
        "text": "모든 양념을 넣고 가볍게 무칩니다."
      }
    ],
    "tip": "절여서 물기를 짜는 과정이 아삭함의 비결이에요.",
    "skills": [
      "knife",
      "seasoning"
    ],
    "tags": []
  },
  {
    "cuisine": "한식",
    "id": "jinmichae",
    "title": "부드러운 진미채볶음",
    "emoji": "🦑",
    "category": "반찬",
    "time": 15,
    "level": "쉬움",
    "servings": 4,
    "desc": "마요네즈로 먼저 버무려 딱딱해지지 않는 진미채 고추장볶음.",
    "ingredients": [
      {
        "name": "진미채",
        "amount": 150,
        "unit": "g"
      },
      {
        "name": "마요네즈",
        "amount": 1,
        "unit": "큰술"
      },
      {
        "name": "고추장",
        "amount": 1.5,
        "unit": "큰술"
      },
      {
        "name": "설탕",
        "amount": 1,
        "unit": "큰술"
      },
      {
        "name": "물엿",
        "amount": 1.5,
        "unit": "큰술"
      },
      {
        "name": "진간장",
        "amount": 0.5,
        "unit": "큰술"
      },
      {
        "name": "다진 마늘",
        "amount": 0.5,
        "unit": "큰술"
      },
      {
        "name": "식용유",
        "amount": 1,
        "unit": "큰술"
      },
      {
        "name": "물",
        "amount": 2,
        "unit": "큰술"
      },
      {
        "name": "깨",
        "amount": null,
        "unit": "",
        "note": "약간"
      }
    ],
    "steps": [
      {
        "text": "진미채를 가위로 먹기 좋게 자르고 물에 살짝 헹궈 물기를 짭니다."
      },
      {
        "text": "마요네즈를 넣고 조물조물 버무려 둡니다."
      },
      {
        "text": "팬에 식용유·고추장·설탕·진간장·다진 마늘·물을 넣고 약불에서 바글바글 끓입니다.",
        "timer": 1
      },
      {
        "text": "불을 끄고 진미채를 넣어 양념을 고루 묻힙니다. 진미채는 불 위에서 볶지 않아요."
      },
      {
        "text": "물엿·깨를 넣어 마무리합니다."
      }
    ],
    "tip": "양념만 끓이고 불을 끈 뒤 버무려야 질기지 않아요.",
    "skills": [
      "sauce",
      "heat"
    ],
    "tags": []
  },
  {
    "cuisine": "한식",
    "id": "mechurial-jangjorim",
    "title": "메추리알 장조림",
    "emoji": "🥚",
    "category": "반찬",
    "time": 30,
    "level": "쉬움",
    "servings": 4,
    "desc": "깐 메추리알과 통마늘을 간장에 졸인 도시락 단골 반찬.",
    "ingredients": [
      {
        "name": "깐 메추리알",
        "amount": 300,
        "unit": "g"
      },
      {
        "name": "마늘",
        "amount": 5,
        "unit": "쪽"
      },
      {
        "name": "진간장",
        "amount": 5,
        "unit": "큰술"
      },
      {
        "name": "물",
        "amount": 1.5,
        "unit": "컵"
      },
      {
        "name": "설탕",
        "amount": 2,
        "unit": "큰술"
      },
      {
        "name": "물엿",
        "amount": 1,
        "unit": "큰술"
      },
      {
        "name": "꽈리고추",
        "amount": null,
        "unit": "",
        "note": "선택, 한 줌"
      }
    ],
    "steps": [
      {
        "text": "메추리알을 찬물에 헹궈 체에 밭칩니다."
      },
      {
        "text": "냄비에 물·진간장·설탕·마늘을 넣고 끓입니다."
      },
      {
        "text": "메추리알을 넣고 중약불에서 굴려 가며 졸입니다.",
        "timer": 15
      },
      {
        "text": "꽈리고추를 넣고 조금 더 졸입니다.",
        "timer": 3
      },
      {
        "text": "불을 끄고 물엿을 넣어 섞고 국물째 식혀 보관합니다."
      }
    ],
    "tip": "국물에 담가 두면 간이 고루 배고 냉장 일주일 정도 먹을 수 있어요.",
    "skills": [
      "sauce",
      "egg"
    ],
    "tags": [
      "kids"
    ]
  },
  {
    "cuisine": "한식",
    "id": "hobak-bokkeum",
    "title": "새우젓 애호박볶음",
    "emoji": "🥒",
    "category": "반찬",
    "time": 15,
    "level": "쉬움",
    "servings": 3,
    "desc": "새우젓으로 간해 색은 맑고 맛은 깊은 10분 반찬.",
    "ingredients": [
      {
        "name": "애호박",
        "amount": 1,
        "unit": "개"
      },
      {
        "name": "양파",
        "amount": 0.3,
        "unit": "개"
      },
      {
        "name": "새우젓",
        "amount": 0.5,
        "unit": "큰술"
      },
      {
        "name": "다진 마늘",
        "amount": 0.5,
        "unit": "큰술"
      },
      {
        "name": "식용유",
        "amount": 1,
        "unit": "큰술"
      },
      {
        "name": "참기름",
        "amount": null,
        "unit": "",
        "note": "약간"
      },
      {
        "name": "깨",
        "amount": null,
        "unit": "",
        "note": "약간"
      }
    ],
    "steps": [
      {
        "text": "애호박은 반달 모양으로 0.5cm 두께로 썰고, 양파는 채 썹니다."
      },
      {
        "text": "팬에 식용유·다진 마늘을 넣고 중불에서 향을 낸 뒤 애호박·양파를 볶습니다.",
        "timer": 2
      },
      {
        "text": "다진 새우젓을 넣고 애호박이 투명해질 때까지 볶습니다.",
        "timer": 2
      },
      {
        "text": "불을 끄고 참기름·깨를 뿌립니다."
      }
    ],
    "tip": "너무 오래 볶으면 물러져요. 살짝 투명해지면 바로 불을 끄세요.",
    "skills": [
      "knife",
      "seasoning"
    ],
    "tags": []
  },
  {
    "cuisine": "한식",
    "id": "dubu-jorim",
    "title": "매콤 두부조림",
    "emoji": "🧈",
    "category": "반찬",
    "time": 25,
    "level": "쉬움",
    "servings": 3,
    "desc": "노릇하게 부친 두부에 양념장을 끼얹어 졸인 밥도둑 반찬.",
    "ingredients": [
      {
        "name": "두부",
        "amount": 1,
        "unit": "모"
      },
      {
        "name": "진간장",
        "amount": 3,
        "unit": "큰술"
      },
      {
        "name": "고춧가루",
        "amount": 1,
        "unit": "큰술"
      },
      {
        "name": "설탕",
        "amount": 0.5,
        "unit": "큰술"
      },
      {
        "name": "다진 마늘",
        "amount": 0.5,
        "unit": "큰술"
      },
      {
        "name": "물",
        "amount": 0.5,
        "unit": "컵"
      },
      {
        "name": "대파",
        "amount": 0.3,
        "unit": "대"
      },
      {
        "name": "식용유",
        "amount": 2,
        "unit": "큰술"
      },
      {
        "name": "참기름",
        "amount": null,
        "unit": "",
        "note": "약간"
      }
    ],
    "steps": [
      {
        "text": "두부는 1cm 두께로 썰어 키친타월로 물기를 닦고 소금을 살짝 뿌립니다."
      },
      {
        "text": "팬에 식용유를 두르고 중불에서 앞뒤로 노릇하게 부칩니다.",
        "timer": 4
      },
      {
        "text": "진간장·고춧가루·설탕·다진 마늘·물·대파를 섞어 양념장을 만듭니다."
      },
      {
        "text": "두부 위에 양념장을 끼얹고 국물을 숟가락으로 계속 끼얹으며 졸입니다.",
        "timer": 5
      },
      {
        "text": "참기름을 둘러 마무리합니다."
      }
    ],
    "tip": "아이용은 고춧가루를 빼고 설탕을 조금 더하면 간장 두부조림이 돼요.",
    "skills": [
      "heat",
      "sauce"
    ],
    "tags": []
  },
  {
    "cuisine": "한식",
    "id": "chamchi-jumeokbap",
    "title": "참치마요 주먹밥",
    "emoji": "🍙",
    "category": "밥·면",
    "time": 15,
    "level": "쉬움",
    "servings": 2,
    "desc": "아이와 함께 굴려 만드는 한입 주먹밥.",
    "ingredients": [
      {
        "name": "밥",
        "amount": 2,
        "unit": "공기"
      },
      {
        "name": "참치캔",
        "amount": 1,
        "unit": "개",
        "note": "150g, 기름 뺀 것"
      },
      {
        "name": "마요네즈",
        "amount": 2,
        "unit": "큰술"
      },
      {
        "name": "참기름",
        "amount": 1,
        "unit": "큰술"
      },
      {
        "name": "소금",
        "amount": null,
        "unit": "",
        "note": "약간"
      },
      {
        "name": "김가루",
        "amount": 1,
        "unit": "줌"
      },
      {
        "name": "깨",
        "amount": null,
        "unit": "",
        "note": "약간"
      }
    ],
    "steps": [
      {
        "text": "참치는 체에 밭쳐 기름을 꼭 짜고 마요네즈와 섞습니다."
      },
      {
        "text": "따뜻한 밥에 참기름·소금·깨를 넣어 섞습니다."
      },
      {
        "text": "손에 물을 살짝 묻히고 밥을 펼쳐 참치마요를 넣고 동그랗게 뭉칩니다."
      },
      {
        "text": "김가루에 굴려 완성합니다."
      }
    ],
    "tip": "아이 손에 위생장갑을 끼워 주면 직접 굴리며 재밌게 만들 수 있어요.",
    "skills": [
      "rice"
    ],
    "tags": [
      "kids"
    ]
  },
  {
    "cuisine": "한식",
    "id": "kkoma-gimbap",
    "title": "꼬마김밥",
    "emoji": "🍱",
    "category": "밥·면",
    "time": 30,
    "level": "쉬움",
    "servings": 2,
    "desc": "김 한 장을 4등분해 작게 마는 첫 김밥. 쉽고 귀여워요.",
    "ingredients": [
      {
        "name": "밥",
        "amount": 2,
        "unit": "공기"
      },
      {
        "name": "김밥김",
        "amount": 3,
        "unit": "장",
        "note": "4등분"
      },
      {
        "name": "단무지",
        "amount": 6,
        "unit": "줄",
        "note": "반으로 가르기"
      },
      {
        "name": "당근",
        "amount": 0.5,
        "unit": "개"
      },
      {
        "name": "햄",
        "amount": 100,
        "unit": "g",
        "note": "김밥용"
      },
      {
        "name": "참기름",
        "amount": 1,
        "unit": "큰술"
      },
      {
        "name": "소금",
        "amount": null,
        "unit": "",
        "note": "약간"
      },
      {
        "name": "깨",
        "amount": null,
        "unit": "",
        "note": "약간"
      }
    ],
    "steps": [
      {
        "text": "밥에 참기름·소금·깨를 넣어 섞습니다."
      },
      {
        "text": "당근은 채 썰어 기름에 소금 한 꼬집 넣고 볶고, 햄은 길게 썰어 굽습니다.",
        "timer": 2
      },
      {
        "text": "김을 4등분해 거친 면이 위로 오게 놓고 밥을 얇게 펼칩니다. 끝 1cm 는 비워 둡니다."
      },
      {
        "text": "단무지·당근·햄을 올리고 손으로 돌돌 맙니다."
      },
      {
        "text": "겉에 참기름을 바르고 깨를 뿌립니다."
      }
    ],
    "tip": "작아서 김발이 없어도 손으로 쉽게 말려요. 겨자 대신 케첩을 찍어 줘도 좋아요.",
    "skills": [
      "rice",
      "knife"
    ],
    "tags": [
      "kids"
    ]
  },
  {
    "cuisine": "한식",
    "id": "sausage-yachae",
    "title": "소시지 야채볶음",
    "emoji": "🌭",
    "category": "반찬",
    "time": 15,
    "level": "쉬움",
    "servings": 3,
    "desc": "케첩 양념으로 달콤하게. 반찬도 되고 야식 안주도 되는 메뉴.",
    "ingredients": [
      {
        "name": "비엔나소시지",
        "amount": 200,
        "unit": "g"
      },
      {
        "name": "양파",
        "amount": 0.5,
        "unit": "개"
      },
      {
        "name": "파프리카",
        "amount": 0.5,
        "unit": "개"
      },
      {
        "name": "케첩",
        "amount": 3,
        "unit": "큰술"
      },
      {
        "name": "진간장",
        "amount": 0.5,
        "unit": "큰술"
      },
      {
        "name": "설탕",
        "amount": 0.5,
        "unit": "큰술"
      },
      {
        "name": "물엿",
        "amount": 1,
        "unit": "큰술"
      },
      {
        "name": "식용유",
        "amount": 1,
        "unit": "큰술"
      }
    ],
    "steps": [
      {
        "text": "소시지에 칼집을 2~3개 넣고, 양파·파프리카는 한입 크기로 썹니다."
      },
      {
        "text": "소시지를 끓는 물에 데쳐 첨가물과 기름을 빼 줍니다.",
        "timer": 0.5
      },
      {
        "text": "팬에 식용유를 두르고 중불에서 양파·파프리카를 볶습니다.",
        "timer": 1
      },
      {
        "text": "소시지를 넣고 케첩·진간장·설탕을 넣어 볶습니다.",
        "timer": 1
      },
      {
        "text": "불을 끄고 물엿을 넣어 섞습니다."
      }
    ],
    "tip": "칼집을 넣으면 양념이 잘 배고 문어 모양처럼 벌어져 아이들이 좋아해요.",
    "skills": [
      "knife",
      "sauce"
    ],
    "tags": [
      "kids",
      "night"
    ]
  },
  {
    "cuisine": "한식",
    "id": "gamja-cheese-jeon",
    "title": "감자채 치즈전",
    "emoji": "🧀",
    "category": "간식·전",
    "time": 20,
    "level": "쉬움",
    "servings": 2,
    "desc": "채 썬 감자에 치즈를 올려 바삭하게 부친 간식.",
    "ingredients": [
      {
        "name": "감자",
        "amount": 2,
        "unit": "개"
      },
      {
        "name": "모짜렐라 치즈",
        "amount": 50,
        "unit": "g"
      },
      {
        "name": "부침가루",
        "amount": 2,
        "unit": "큰술"
      },
      {
        "name": "소금",
        "amount": null,
        "unit": "",
        "note": "약간"
      },
      {
        "name": "식용유",
        "amount": 3,
        "unit": "큰술"
      }
    ],
    "steps": [
      {
        "text": "감자는 가늘게 채 썰어 물에 헹구지 말고 부침가루·소금과 버무립니다."
      },
      {
        "text": "팬에 식용유를 넉넉히 두르고 감자채를 얇고 동그랗게 펼칩니다."
      },
      {
        "text": "중약불에서 아랫면이 노릇해질 때까지 굽습니다.",
        "timer": 4
      },
      {
        "text": "뒤집어 치즈를 올리고 뚜껑을 덮어 치즈를 녹입니다.",
        "timer": 3
      }
    ],
    "tip": "감자 전분이 접착제 역할을 하니 채 썬 뒤 물에 씻지 마세요.",
    "skills": [
      "knife",
      "heat"
    ],
    "tags": [
      "kids"
    ]
  },
  {
    "cuisine": "한식",
    "id": "dakbong-gui",
    "title": "에어프라이어 간장 닭봉",
    "emoji": "🍗",
    "category": "메인",
    "time": 45,
    "level": "쉬움",
    "servings": 3,
    "desc": "기름 없이 에어프라이어에 굽고 단짠 간장 양념을 바른 닭봉.",
    "ingredients": [
      {
        "name": "닭봉",
        "amount": 600,
        "unit": "g"
      },
      {
        "name": "우유",
        "amount": 1,
        "unit": "컵",
        "note": "잡내 제거"
      },
      {
        "name": "진간장",
        "amount": 3,
        "unit": "큰술"
      },
      {
        "name": "맛술",
        "amount": 2,
        "unit": "큰술"
      },
      {
        "name": "설탕",
        "amount": 1,
        "unit": "큰술"
      },
      {
        "name": "물엿",
        "amount": 1,
        "unit": "큰술"
      },
      {
        "name": "다진 마늘",
        "amount": 1,
        "unit": "큰술"
      },
      {
        "name": "후추",
        "amount": null,
        "unit": "",
        "note": "약간"
      },
      {
        "name": "깨",
        "amount": null,
        "unit": "",
        "note": "약간"
      }
    ],
    "steps": [
      {
        "text": "닭봉을 우유에 담가 잡내를 뺍니다.",
        "timer": 15
      },
      {
        "text": "헹궈서 물기를 닦고 칼집을 2개씩 넣은 뒤 후추를 뿌립니다."
      },
      {
        "text": "에어프라이어 180℃ 에서 굽습니다.",
        "timer": 15
      },
      {
        "text": "뒤집어서 더 굽습니다.",
        "timer": 10
      },
      {
        "text": "그동안 진간장·맛술·설탕·물엿·다진 마늘을 팬에 넣고 걸쭉하게 졸입니다.",
        "timer": 2
      },
      {
        "text": "구운 닭봉에 양념을 바르고 180℃ 에서 더 구운 뒤 깨를 뿌립니다.",
        "timer": 5
      }
    ],
    "tip": "가장 두꺼운 부분을 잘라 분홍빛이 없으면 다 익은 거예요. 기종마다 화력이 달라 처음엔 확인하며 구우세요.",
    "skills": [
      "meat",
      "sauce"
    ],
    "tags": [
      "kids"
    ]
  },
  {
    "cuisine": "한식",
    "id": "kimchi-jeon",
    "title": "바삭 김치전",
    "emoji": "🥞",
    "category": "간식·전",
    "time": 20,
    "level": "쉬움",
    "servings": 2,
    "desc": "신 김치와 김칫국물만 있으면 되는 비 오는 날 야식.",
    "ingredients": [
      {
        "name": "김치",
        "amount": 200,
        "unit": "g",
        "note": "잘 익은 것"
      },
      {
        "name": "부침가루",
        "amount": 100,
        "unit": "g",
        "note": "1컵"
      },
      {
        "name": "물",
        "amount": 140,
        "unit": "ml"
      },
      {
        "name": "김칫국물",
        "amount": 3,
        "unit": "큰술"
      },
      {
        "name": "설탕",
        "amount": 0.3,
        "unit": "큰술"
      },
      {
        "name": "양파",
        "amount": 0.3,
        "unit": "개"
      },
      {
        "name": "식용유",
        "amount": 4,
        "unit": "큰술"
      }
    ],
    "steps": [
      {
        "text": "김치와 양파를 잘게 썹니다."
      },
      {
        "text": "볼에 부침가루·물·김칫국물·설탕을 넣고 덩어리 없이 섞은 뒤 김치·양파를 넣습니다."
      },
      {
        "text": "팬에 식용유를 넉넉히 두르고 중불로 달군 뒤 반죽을 얇게 펼칩니다."
      },
      {
        "text": "가장자리가 바삭해질 때까지 굽습니다.",
        "timer": 3
      },
      {
        "text": "뒤집어서 뒤집개로 꾹 누르며 굽습니다.",
        "timer": 3
      }
    ],
    "tip": "반죽을 얇게, 기름은 넉넉히! 차가운 물로 반죽하면 더 바삭해요.",
    "skills": [
      "heat"
    ],
    "tags": [
      "night"
    ]
  },
  {
    "cuisine": "한식",
    "id": "golbaengi-muchim",
    "title": "골뱅이 소면무침",
    "emoji": "🐚",
    "category": "밥·면",
    "time": 25,
    "level": "쉬움",
    "servings": 2,
    "desc": "새콤매콤한 양념에 골뱅이와 채소를 무쳐 소면을 곁들인 대표 야식.",
    "ingredients": [
      {
        "name": "골뱅이캔",
        "amount": 1,
        "unit": "개",
        "note": "400g"
      },
      {
        "name": "소면",
        "amount": 150,
        "unit": "g"
      },
      {
        "name": "오이",
        "amount": 0.5,
        "unit": "개"
      },
      {
        "name": "양파",
        "amount": 0.5,
        "unit": "개"
      },
      {
        "name": "대파",
        "amount": 0.5,
        "unit": "대"
      },
      {
        "name": "고추장",
        "amount": 2,
        "unit": "큰술"
      },
      {
        "name": "고춧가루",
        "amount": 2,
        "unit": "큰술"
      },
      {
        "name": "식초",
        "amount": 3,
        "unit": "큰술"
      },
      {
        "name": "설탕",
        "amount": 2,
        "unit": "큰술"
      },
      {
        "name": "다진 마늘",
        "amount": 1,
        "unit": "큰술"
      },
      {
        "name": "진간장",
        "amount": 1,
        "unit": "큰술"
      },
      {
        "name": "참기름",
        "amount": 1,
        "unit": "큰술"
      },
      {
        "name": "깨",
        "amount": null,
        "unit": "",
        "note": "약간"
      }
    ],
    "steps": [
      {
        "text": "골뱅이는 체에 밭쳐 국물을 빼고 큰 것은 반으로 자릅니다. 국물 2큰술은 양념에 씁니다."
      },
      {
        "text": "오이·양파는 채 썰고 대파는 길게 채 썹니다. 양파는 찬물에 담가 매운맛을 뺍니다."
      },
      {
        "text": "고추장·고춧가루·식초·설탕·다진 마늘·진간장·골뱅이 국물을 섞어 양념장을 만듭니다."
      },
      {
        "text": "소면을 삶아 찬물에 비벼 헹구고 물기를 뺍니다.",
        "timer": 4
      },
      {
        "text": "골뱅이·채소에 양념장을 넣어 무치고 참기름·깨를 뿌린 뒤 소면을 곁들입니다."
      }
    ],
    "tip": "양념은 먹기 직전에 무쳐야 채소에서 물이 덜 나와요.",
    "skills": [
      "noodle",
      "sauce"
    ],
    "tags": [
      "night"
    ]
  },
  {
    "cuisine": "한식",
    "id": "rabokki",
    "title": "라볶이",
    "emoji": "🍜",
    "category": "간식·전",
    "time": 20,
    "level": "쉬움",
    "servings": 2,
    "desc": "떡볶이에 라면사리를 더한 분식집 야식.",
    "ingredients": [
      {
        "name": "떡볶이떡",
        "amount": 200,
        "unit": "g"
      },
      {
        "name": "라면사리",
        "amount": 1,
        "unit": "개"
      },
      {
        "name": "어묵",
        "amount": 2,
        "unit": "장"
      },
      {
        "name": "대파",
        "amount": 0.5,
        "unit": "대"
      },
      {
        "name": "물",
        "amount": 500,
        "unit": "ml"
      },
      {
        "name": "고추장",
        "amount": 2,
        "unit": "큰술"
      },
      {
        "name": "고춧가루",
        "amount": 1,
        "unit": "큰술"
      },
      {
        "name": "설탕",
        "amount": 1.5,
        "unit": "큰술"
      },
      {
        "name": "진간장",
        "amount": 1,
        "unit": "큰술"
      },
      {
        "name": "삶은 달걀",
        "amount": null,
        "unit": "",
        "note": "선택"
      }
    ],
    "steps": [
      {
        "text": "떡은 물에 헹궈 두고, 어묵은 삼각형으로, 대파는 어슷 썹니다."
      },
      {
        "text": "냄비에 물·고추장·고춧가루·설탕·진간장을 풀어 끓입니다."
      },
      {
        "text": "떡·어묵을 넣고 중불에서 떡이 말랑해질 때까지 끓입니다.",
        "timer": 5
      },
      {
        "text": "라면사리를 넣고 면이 풀릴 때까지 끓입니다. 국물이 졸면 물을 조금 더합니다.",
        "timer": 3
      },
      {
        "text": "대파·삶은 달걀을 넣고 한소끔 끓입니다."
      }
    ],
    "tip": "라면은 금방 불어요. 모든 재료가 익은 뒤 마지막에 넣고 바로 드세요.",
    "skills": [
      "sauce",
      "noodle"
    ],
    "tags": [
      "night"
    ]
  },
  {
    "cuisine": "한식",
    "id": "budae-jjigae",
    "title": "간단 부대찌개",
    "emoji": "🍲",
    "category": "국·찌개",
    "time": 25,
    "level": "쉬움",
    "servings": 2,
    "desc": "햄·소시지·김치를 담아 끓이는 한 냄비 야식. 라면사리는 필수.",
    "ingredients": [
      {
        "name": "스팸",
        "amount": 100,
        "unit": "g"
      },
      {
        "name": "비엔나소시지",
        "amount": 100,
        "unit": "g"
      },
      {
        "name": "김치",
        "amount": 100,
        "unit": "g"
      },
      {
        "name": "양파",
        "amount": 0.5,
        "unit": "개"
      },
      {
        "name": "대파",
        "amount": 0.5,
        "unit": "대"
      },
      {
        "name": "두부",
        "amount": 0.5,
        "unit": "모"
      },
      {
        "name": "라면사리",
        "amount": 1,
        "unit": "개"
      },
      {
        "name": "슬라이스 치즈",
        "amount": 1,
        "unit": "장"
      },
      {
        "name": "물",
        "amount": 3,
        "unit": "컵",
        "note": "또는 육수"
      },
      {
        "name": "고춧가루",
        "amount": 2,
        "unit": "큰술"
      },
      {
        "name": "고추장",
        "amount": 1,
        "unit": "큰술"
      },
      {
        "name": "진간장",
        "amount": 1,
        "unit": "큰술"
      },
      {
        "name": "다진 마늘",
        "amount": 1,
        "unit": "큰술"
      },
      {
        "name": "설탕",
        "amount": 0.3,
        "unit": "큰술"
      }
    ],
    "steps": [
      {
        "text": "스팸·두부는 납작하게, 소시지는 어슷하게, 양파는 채, 대파는 어슷 썹니다."
      },
      {
        "text": "고춧가루·고추장·진간장·다진 마늘·설탕을 섞어 양념장을 만듭니다."
      },
      {
        "text": "냄비에 김치·양파·햄·소시지·두부를 둘러 담고 가운데 양념장을 올립니다."
      },
      {
        "text": "물을 붓고 센불로 끓인 뒤 중불에서 끓입니다.",
        "timer": 8
      },
      {
        "text": "라면사리·대파를 넣고 면이 익으면 치즈를 올립니다.",
        "timer": 3
      }
    ],
    "tip": "스팸은 끓는 물을 한 번 부어 기름을 빼면 국물이 깔끔해요.",
    "skills": [
      "broth",
      "sauce"
    ],
    "tags": [
      "night"
    ]
  },
  {
    "cuisine": "한식",
    "id": "airfryer-chicken",
    "title": "에어프라이어 양념치킨",
    "emoji": "🍗",
    "category": "메인",
    "time": 40,
    "level": "보통",
    "servings": 2,
    "desc": "튀기지 않고 에어프라이어로 굽는 순살 양념치킨.",
    "ingredients": [
      {
        "name": "닭다리살",
        "amount": 500,
        "unit": "g"
      },
      {
        "name": "우유",
        "amount": 1,
        "unit": "컵",
        "note": "잡내 제거"
      },
      {
        "name": "튀김가루",
        "amount": 5,
        "unit": "큰술"
      },
      {
        "name": "식용유",
        "amount": 2,
        "unit": "큰술"
      },
      {
        "name": "소금",
        "amount": null,
        "unit": "",
        "note": "약간"
      },
      {
        "name": "후추",
        "amount": null,
        "unit": "",
        "note": "약간"
      },
      {
        "name": "케첩",
        "amount": 3,
        "unit": "큰술",
        "note": "양념"
      },
      {
        "name": "고추장",
        "amount": 1,
        "unit": "큰술",
        "note": "양념"
      },
      {
        "name": "물엿",
        "amount": 3,
        "unit": "큰술",
        "note": "양념"
      },
      {
        "name": "진간장",
        "amount": 1,
        "unit": "큰술",
        "note": "양념"
      },
      {
        "name": "다진 마늘",
        "amount": 1,
        "unit": "큰술",
        "note": "양념"
      },
      {
        "name": "물",
        "amount": 2,
        "unit": "큰술",
        "note": "양념"
      }
    ],
    "steps": [
      {
        "text": "닭다리살을 한입 크기로 잘라 우유에 담가 둡니다.",
        "timer": 15
      },
      {
        "text": "헹궈 물기를 닦고 소금·후추를 뿌린 뒤 튀김가루를 고루 묻힙니다."
      },
      {
        "text": "겉에 식용유를 붓이나 손으로 골고루 발라 에어프라이어 180℃ 에서 굽습니다.",
        "timer": 12
      },
      {
        "text": "뒤집어서 더 굽습니다.",
        "timer": 8
      },
      {
        "text": "팬에 양념 재료를 모두 넣고 약불에서 보글보글 끓입니다.",
        "timer": 2
      },
      {
        "text": "구운 닭을 넣고 양념을 빠르게 버무립니다."
      }
    ],
    "tip": "기름을 겉에 발라야 튀긴 것처럼 바삭해져요. 양념은 먹기 직전에 버무리세요.",
    "skills": [
      "meat",
      "sauce"
    ],
    "tags": [
      "night"
    ]
  },
  {
    "cuisine": "한식",
    "id": "egg-ramyeon",
    "title": "실패 없는 계란 라면",
    "emoji": "🍜",
    "category": "밥·면",
    "time": 10,
    "level": "쉬움",
    "servings": 1,
    "desc": "물 양과 계란 넣는 타이밍만 지키면 늘 맛있는 야식 라면.",
    "ingredients": [
      {
        "name": "라면",
        "amount": 1,
        "unit": "봉지"
      },
      {
        "name": "물",
        "amount": 550,
        "unit": "ml",
        "note": "봉지 표기 확인"
      },
      {
        "name": "달걀",
        "amount": 1,
        "unit": "개"
      },
      {
        "name": "대파",
        "amount": 0.2,
        "unit": "대"
      },
      {
        "name": "슬라이스 치즈",
        "amount": null,
        "unit": "",
        "note": "선택"
      }
    ],
    "steps": [
      {
        "text": "냄비에 물을 계량해 붓고 센불로 끓입니다. 물 양이 맛의 절반이에요."
      },
      {
        "text": "물이 끓으면 스프·건더기를 먼저 넣고 면을 넣습니다."
      },
      {
        "text": "면을 젓가락으로 들었다 놨다 하며 끓입니다.",
        "timer": 3
      },
      {
        "text": "불을 끄기 1분 전 달걀을 깨 넣고 건드리지 않습니다. 풀어 먹으려면 이때 저어 주세요.",
        "timer": 1
      },
      {
        "text": "대파를 넣고 불을 끕니다. 치즈는 그릇에 담은 뒤 올립니다."
      }
    ],
    "tip": "면을 공기에 들었다 놨다 하면 더 꼬들꼬들해져요.",
    "skills": [
      "measure",
      "noodle"
    ],
    "tags": [
      "night"
    ]
  }
];
