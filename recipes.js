// 레시피 데이터. 유명 셰프·방송 레시피(출처 source)를 분량 그대로 옮기고 조리 설명은 요약했다.
// amount 는 기본 인분(servings) 기준 수치, 숫자가 아닌 분량은 amount: null + note. img 는 Kling 생성 사진(COOKING/tools/gen_food_images.py).
const RECIPES = [
  {
    "id": "kimchi-jjigae",
    "title": "백종원 새마을식당 7분 김치찌개",
    "emoji": "🍲",
    "img": "img/kimchi-jjigae.jpg",
    "category": "국·찌개",
    "time": 30,
    "level": "쉬움",
    "servings": 4,
    "chef": "백종원",
    "desc": "육수 없이 쌀뜨물에 돼지고기를 먼저 끓여 기름 맛을 우린 뒤 김치를 넣는 새마을식당식 빠른 김치찌개입니다.",
    "source": {
      "title": "백종원 새마을식당 7분김치찌개 만드는 법 (만개의레시피, 작성자 뽕림이)",
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
    "tip": "김치와 고기 비율을 3:1로 맞추고, 쌀뜨물에 된장을 아주 조금 풀어 돼지고기 잡내를 잡는 것이 핵심입니다."
  },
  {
    "id": "doenjang-jjigae",
    "title": "백종원 된장찌개",
    "emoji": "🥘",
    "img": "img/doenjang-jjigae.jpg",
    "category": "국·찌개",
    "time": 45,
    "level": "쉬움",
    "servings": 3,
    "chef": "백종원",
    "desc": "쌀뜨물에 무를 먼저 끓여 단맛을 내고 된장을 넉넉히 풀어 오래 끓인 뒤 설탕을 살짝 넣는 구수한 된장찌개입니다.",
    "source": {
      "title": "백종원 된장찌개 레시피 (만개의레시피, 작성자 시크제이맘)",
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
    "tip": "된장을 푼 뒤 약불에서 15~20분 충분히 끓여 떫은맛을 날리고, 설탕을 아주 조금 넣어 된장의 짠맛을 둥글게 잡습니다."
  },
  {
    "id": "bulgogi",
    "title": "백종원 소불고기 (집밥백선생3)",
    "emoji": "🥩",
    "img": "img/bulgogi.jpg",
    "category": "메인",
    "time": 20,
    "level": "쉬움",
    "servings": 2,
    "chef": "백종원",
    "desc": "간장 대신 액젓으로 간을 하고 설탕을 가장 먼저 버무리는, 간단하지만 감칠맛이 깊은 집밥백선생식 소불고기입니다.",
    "source": {
      "title": "[사랑파워 블로그][집밥백선생3] 백종원 소불고기 만들기! (만개의레시피)",
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
    "tip": "설탕을 다른 양념보다 먼저 버무려야 단맛이 고기에 잘 배고, 간장 대신 액젓을 쓰면 감칠맛이 살아납니다."
  },
  {
    "id": "jeyuk",
    "title": "백종원 제육볶음",
    "emoji": "🌶️",
    "img": "img/jeyuk.jpg",
    "category": "메인",
    "time": 60,
    "level": "보통",
    "servings": 2,
    "chef": "백종원",
    "desc": "고기를 먼저 볶다가 설탕으로 단맛을 코팅한 뒤 양념장을 넣는 순서가 핵심인 백종원식 제육볶음입니다.",
    "source": {
      "title": "[백종원레시피]백종원 제육볶음 (만개의레시피, 작성자 꽃청춘이주부)",
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
    "tip": "양념장보다 설탕을 먼저 넣어 고기를 볶아 단맛을 입히는 것이 포인트이며, 원 레시피는 단맛이 강한 편이라 입맛에 맞게 줄여도 됩니다."
  },
  {
    "id": "gyeran-mari",
    "title": "백종원 계란말이",
    "emoji": "🥚",
    "img": "img/gyeran-mari.jpg",
    "category": "반찬",
    "time": 10,
    "level": "쉬움",
    "servings": 2,
    "chef": "백종원",
    "desc": "달걀물에 설탕을 소금과 같은 양으로 넣어 비린 맛을 잡고, 세 번에 나눠 부어 도톰하게 마는 계란말이입니다.",
    "source": {
      "title": "백종원 계란말이 만드는법, 황금레시피로 맛있는 반찬만들기 (만개의레시피, 작성자 먹순)",
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
    "tip": "설탕을 소금과 같은 양만큼 넣으면 달걀 비린내가 가려지고, 기름은 키친타월로 닦아 얇게만 남겨야 매끈하게 말립니다."
  },
  {
    "id": "sigeumchi-namul",
    "title": "백선생 시금치나물",
    "emoji": "🥬",
    "img": "img/sigeumchi-namul.jpg",
    "category": "반찬",
    "time": 15,
    "level": "쉬움",
    "servings": 2,
    "chef": "백종원",
    "desc": "소금물에 시금치를 아주 짧게 데쳐 국간장과 참기름으로만 담백하게 무치는 기본 나물입니다.",
    "source": {
      "title": "백선생 시금치무침 만드는법 초간단 (만개의레시피, 작성자 혀니ㅋ)",
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
    "tip": "국간장은 시금치 양에 따라 1큰술만 먼저 넣고 맛을 본 뒤 더하는 것이 실패하지 않는 방법입니다."
  },
  {
    "id": "bibimbap",
    "title": "백종원 볶음고추장 비빔밥",
    "emoji": "🍚",
    "img": "img/bibimbap.jpg",
    "category": "밥·면",
    "time": 30,
    "level": "쉬움",
    "servings": 1,
    "chef": "백종원",
    "desc": "다진 소고기와 양파·대파를 볶아 만든 볶음고추장 하나로 간단히 비벼 먹는 비빔밥입니다.",
    "source": {
      "title": "백종원 볶음고추장 | 맛있는 볶음고추장으로 비빔밥 만들기 (만개의레시피, 작성자 혼밥쟁이)",
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
    "tip": "고추장은 맨 마지막에 넣고 약불에서 볶아야 타지 않으며, 만들어 둔 볶음고추장은 냉장 2~3주 보관해 두고 쓸 수 있습니다."
  },
  {
    "id": "kimchi-bokkeumbap",
    "title": "류수영 김치볶음밥 (편스토랑)",
    "emoji": "🍳",
    "img": "img/kimchi-bokkeumbap.jpg",
    "category": "밥·면",
    "time": 20,
    "level": "쉬움",
    "servings": 2,
    "chef": "류수영",
    "desc": "파기름에 멸치액젓과 설탕을 먼저 눌려 감칠맛을 낸 뒤 김치를 볶는 '어남선생' 스타일 김치볶음밥입니다.",
    "source": {
      "title": "김치볶음밥 레시피 편스토랑 류수영 김치볶음밥 만드는 법 (만개의레시피, 작성자 심플민)",
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
    "tip": "김치보다 액젓과 설탕을 먼저 뜨거운 파기름에 넣어 살짝 눌리면 감칠맛과 불향이 살아납니다."
  },
  {
    "id": "janchi-guksu",
    "title": "백종원 잔치국수",
    "emoji": "🍜",
    "img": "img/janchi-guksu.jpg",
    "category": "밥·면",
    "time": 40,
    "level": "쉬움",
    "servings": 2,
    "chef": "백종원",
    "desc": "멸치·다시마 국물에 채소를 넣어 끓이고 달걀을 풀어 마무리한 뒤 진간장 양념장으로 간을 더하는 잔치국수입니다.",
    "source": {
      "title": "백종원 잔치국수 만들기 (만개의레시피, 작성자 혼밥쟁이)",
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
    "tip": "국물은 국간장으로 간을 하되 맑게 내고 싶으면 국간장을 줄이고 소금으로 간을 맞추며, 부족한 간은 양념장으로 각자 조절합니다."
  },
  {
    "id": "haemul-pajeon",
    "title": "백종원 해물파전",
    "emoji": "🥞",
    "img": "img/haemul-pajeon.jpg",
    "category": "간식·전",
    "time": 15,
    "level": "쉬움",
    "servings": 1,
    "chef": "백종원",
    "desc": "부침가루에 튀김가루를 섞어 바삭함을 살리고, 반죽을 얇게 깐 위에 파와 해물을 올린 뒤 다시 반죽을 덮는 해물파전입니다.",
    "source": {
      "title": "백종원표, '해물파전' 레시피 (만개의레시피, 작성자 요리가좋아in독일)",
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
    "tip": "부침가루에 튀김가루를 섞어 바삭함을 높이고, 도톰하게 원하면 달걀 하나를 풀어 전 가장자리에 둘러 줍니다."
  },
  {
    "id": "tteokbokki",
    "title": "백종원 분식점 떡볶이",
    "emoji": "🍢",
    "img": "img/tteokbokki.jpg",
    "category": "간식·전",
    "time": 15,
    "level": "쉬움",
    "servings": 2,
    "chef": "백종원",
    "desc": "육수 없이 물에 고추장·고춧가루·간장·설탕만 넣고 졸이는, 설탕 단맛이 앞서는 분식집 스타일 떡볶이입니다.",
    "source": {
      "title": "너무 간단한데 맛있어서 놀라는 백종원 분식점 떡볶이 황금 레시피 (만개의레시피, 작성자 뽀유TV)",
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
    "tip": "설탕을 고추장보다 많이 넣어 분식집 특유의 단맛을 내는 것이 포인트이며, 단 것이 싫으면 설탕만 줄이면 됩니다."
  },
  {
    "id": "honey-toast",
    "title": "백종원 길거리 토스트",
    "emoji": "🍞",
    "img": "img/honey-toast.jpg",
    "category": "간식·전",
    "time": 30,
    "level": "쉬움",
    "servings": 2,
    "chef": "백종원",
    "desc": "채소를 듬뿍 넣은 달걀부침에 설탕과 케첩을 뿌려 내는 추억의 길거리 토스트입니다.",
    "source": {
      "title": "집밥 백선생: 백종원 길거리토스트 (만개의레시피, 작성자 봉자바리)",
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
    "tip": "달걀물에 맛술을 꼭 넣어 비린내를 잡고, 설탕+케첩 조합이 길거리 맛의 핵심입니다."
  }
];
