# 내 차 결정 도우미

RAV4 XLE HEV와 Camry XLE HEV를 "우리 집 기준"으로 비교해서 하나의 점수와 이유로 정리해 주는 1인용 모바일 웹 도구입니다.
단일 HTML 파일이고 서버가 필요 없습니다.

## 두 가지 용도

처음 화면에서 용도를 고르면 같은 4단계로 진행합니다. 두 용도의 입력은 따로 저장됩니다.

| 용도 | 평가 기준 | 결과물 | 예제 |
|---|---|---|---|
| 우리 집 차 고르기 | 가격(5년 총비용)·연비·디자인·내구성·선호도 | 결론 카드 이미지 (가족 공유) | CAMRY vs RAV4, 실제 작성한 결정 |
| 부대·기관 업무차량 선정 | 총소유비용(보유 기간)·연비·성능·적재·정비 편의성·안전·내구성 | 결론 카드 + 구매 검토 보고 문안(기안문 형식) | OO대대 행정보급실 업무차량 교체 (가상 데이터) |

기관용은 사용 부서·용도·예산 한도·보유 기간을 입력하고, 취득세 면제(국가·지자체)/일반 과세를 고를 수 있습니다.

## 4단계 흐름

1. **차량 비교**: 사진, 분당지점 견적(할인 후 가격), 제원, 장단점. 차종 추가·삭제 가능 (최대 4대)
2. **내 기준·점수**: 가중치 5개(기본 가격 35 · 연비 20 · 디자인 15 · 내구성 15 · 선호도 15), 디자인·내구성·선호도 직접 채점, 가족 한마디
3. **실구매·유지비**: 할인 후 가격 + 취득세 7% + 공채 할인 손실 = 실구매 총액, 1·5·10·20년 누적 총비용 그래프
4. **최종 결론**: 추천 차량, 레이더 차트, 핵심 숫자 3개, 규칙형 "이유 3줄", 이미지 저장·공유

입력값은 브라우저(localStorage)에 자동 저장되고, 백업·설정에서 JSON으로 내보내고 불러올 수 있습니다.

## 계산 규칙

```
할인 후 가격 = 출고가 − 분당 할인
과세표준     = 할인 후 가격 ÷ 1.1
취득세       = 과세표준 × 7%
공채 손실    = 과세표준 × 공채 매입률 × 즉시매도 할인율   (기본 12% × 6%, 임시값)
실구매 총액  = 할인 후 가격 + 취득세 + 공채 손실 (+ 2027년 이후 출고 시 106만 원)
연간 연료비  = 연간 주행거리 ÷ 복합연비 × 휘발유 가격
가격 점수    = 5년 누적 총비용 최저 차 10점, 1% 비쌀 때마다 −0.5점 (최저 1점)
연비 점수    = 10 × (연비 ÷ 최고 연비)
최종 점수    = Σ(항목 점수 × 가중치) × 10
```

## 차량 사진

이 저장소에는 토요타 공식 사진이 들어 있지 않습니다. 사진이 없으면 앱이 기본 차량 그림을 보여 주고, 앱 안에서 "수정 → 휴대폰 사진 올리기"로 사진을 넣을 수 있습니다.

개인용 게시본에 공식 사진을 넣으려면 `official-photos/camry_card.jpg`, `official-photos/rav4_card.jpg`(800×450)를 두고 아래를 실행합니다. 결과는 `dist/car-decision-helper.html`에 만들어집니다.

```powershell
powershell -ExecutionPolicy Bypass -File build.ps1
```

## 배포 (Vercel)

GitHub `main`에 push하면 Vercel이 자동으로 배포합니다: https://car-decision-helper-eight.vercel.app

빌드는 `scripts/build-vercel.mjs`가 `car-decision-helper.html`에 Supabase 설정을 넣어 `public/index.html`을 만듭니다.
값은 `supabase.public.json`(공개 키라 저장소에 둠)에서 읽고, Vercel Environment Variables에 같은 값을 등록하면 그쪽이 우선합니다 (`.env.example` 참고).

| 이름 | 값 |
|---|---|
| `SUPABASE_URL` | Supabase 프로젝트 주소 (`https://<ref>.supabase.co`) |
| `SUPABASE_PUBLISHABLE_KEY` | Supabase 공개 키 (`sb_publishable_...`) |

## 클라우드 저장 (Supabase)

설정 화면에서 이메일 링크로 로그인하면 입력값이 `car_decisions` 테이블에 사용자별로 저장되고, 다른 기기에서 로그인하면 같은 내용을 불러옵니다.
테이블과 RLS 정책은 `supabase/migrations/`에 있고, 본인 행만 읽고 쓸 수 있습니다. 로그인하지 않으면 지금처럼 브라우저에만 저장됩니다.

Supabase Authentication → URL Configuration에 Site URL과 Redirect URL로 배포 주소를 등록해 두어야 로그인 링크가 앱으로 돌아옵니다.

## 기술

Vanilla JS, [Chart.js](https://www.chartjs.org/) 4.4.1, [html2canvas](https://html2canvas.hertzen.com/) 1.4.1 (cdnjs), [supabase-js](https://supabase.com/docs/reference/javascript) 2.49.4 (jsDelivr)
