# 🍳 오늘 뭐 먹지 · 🗣 English Coach

빌드 없이 바로 열리는 정적 사이트입니다. GitHub Pages 로 그대로 배포됩니다.
상단의 **🍳 요리 / 🗣 영어** 전환 버튼으로 두 섹션을 오갑니다.

## 🍳 요리 (`/`)
- 요리 이름·재료로 검색 (여러 단어는 AND 검색)
- 카테고리 필터: 국·찌개 / 메인 / 반찬 / 밥·면 / 간식·전 / 즐겨찾기
- 레시피 상세: 인분 조절 시 재료량 자동 환산, 단계별 체크, 단계별 조리 타이머
- 즐겨찾기(브라우저 저장), 랜덤 추천, 다크 모드

## 🗣 Business English Coach (`/english/`)
금융·은행·ALM 실무자를 위한 업무영어 회화 학습관리 (요건정의서 v1.0 의 MVP1·MVP2 범위).
- **홈**: 오늘의 Mission(복습·Lesson·Role Play), 학습일·연속일·문장·진행률, 영역별 진행률, 12개월 Roadmap, 최근 학습
- **학습**: 25개 Lesson(75문장, 기초·일상 7 / 업무 7 / 회의 5 / 금융·ALM 6) — 상황 → 핵심 문장·번역·표현 → Shadowing(4모드·녹음) → 업무 변형 → 완료, 표현 사전 검색
- **복습**: 간격 반복 1→3→7→14→30일, NEW / LEARNING / WEAK / MASTERED, 취약·즐겨찾기 목록
- **Role Play**: 6개 업무 시나리오. 상대 대사 음성 → 영어 답변(입력 또는 🎤) → 핵심 표현 피드백·모범답안 → 약한 턴은 복습 자동 등록
  - AI 연동 전 단계로, 모범답안의 핵심 키워드와 비교하는 방식입니다. (정적 호스팅이라 API 키를 브라우저에 둘 수 없음)
- **통계**: 14일 학습시간, 문장 상태 분포, 영역별 진행률, Role Play 기록
- **설정**: 이름·시작일·하루 목표·음성 속도/음성 선택, 백업 내보내기/가져오기(JSON)
- 음성: 문장·Role Play 대사 123개는 ElevenLabs 로 생성한 mp3(`english/audio/`, 목록 `audio/manifest.js`)를 재생하고, 문장이 바뀌었거나 파일이 없으면 브라우저 TTS 로 대체

## 구조
| 파일 | 역할 |
| --- | --- |
| `index.html` | 요리 페이지 뼈대 |
| `style.css` | 공통 스타일(라이트/다크, 헤더, 섹션 전환) |
| `recipes.js` | 레시피 데이터 — 새 레시피는 여기에 객체를 추가 |
| `app.js` | 요리: 검색·필터·상세·타이머 로직 |
| `english/index.html` | 영어 페이지 뼈대 |
| `english/english.css` | 영어 스타일(Sky Blue 팔레트, `style.css` 위에 덮어씀) |
| `english/lessons.js` | 영어 콘텐츠 — Phase·Lesson·Role Play 데이터 (문장 순서 변경 금지: 진도 키) |
| `english/app.js` | 영어: 대시보드·Lesson·복습(SRS)·Role Play·통계 로직 |
| `english/audio/` | 생성 음성 mp3 + `manifest.js`(자동 생성) |

학습 기록은 브라우저 `localStorage`(`english.state`)에만 저장됩니다. 다른 기기로 옮길 때는 설정 → 백업을 쓰세요.

## 로컬 실행
`python -m http.server 8765` 후 `http://localhost:8765` (녹음·음성인식은 localhost/https 에서만 동작)

## 배포 (GitHub Pages)
저장소 Settings → Pages → Branch: `main` / `/ (root)` 선택 후 저장.
CSS/JS 를 고치면 HTML 의 `?v=` 값을 올려 캐시를 무효화합니다.
