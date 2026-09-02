# vue-boilerplate

`.claude/rules/vue-spa/`를 문서 그대로 구현한 Vue 3 + Vite SPA 보일러플레이트 —
자체 서버 없이 브라우저가 백엔드를 직접 호출한다.

```bash
npm install
npm run msw:init    # 최초 1회 — public/mockServiceWorker.js 생성
npm run dev         # MSW가 샘플 API를 제공, 백엔드 불필요
```

| 명령 | 하는 일 |
|---|---|
| `npm run dev` | MSW 브라우저 워커를 켠 Vite 개발 서버 |
| `npm run build` | `vue-tsc --noEmit` 실행 후 프로덕션 빌드 |
| `npm run typecheck` | `vue-tsc` — `tsc`가 **아니다**. `tsc`는 `.vue` 파일을 건너뛰고도 0으로 종료한다 |
| `npm run lint` | `eslint-plugin-vue`를 적용한 ESLint |
| `npm test` | Vitest + `@vue/test-utils` + MSW (`msw/node`) |

실제 백엔드와 통신하려면 `.env.development`에 `VITE_ENABLE_MSW=0`을 설정한다.

## 스택

Vue 3 `<script setup>` · Vite · TypeScript strict · vue-router 4 · Pinia ·
TanStack Query (`@tanstack/vue-query`) · Tailwind CSS v4 · vue-i18n · Vitest · MSW.

네이티브 `fetch`만 사용 — axios, ky, got은 쓰지 않는다.

## 디렉터리 구조

```text
src/
├── views/                     라우트 진입점 — 레이아웃과 조합만 담당
├── router/                    라우트 테이블, 가드 (모든 라우트는 동적 import)
├── features/sample/           레퍼런스 도메인, UI 포함
│   ├── api/sampleApi.ts       도메인당 API 파일 하나
│   ├── queries/keys/          키 팩토리 — queryKey 배열을 직접 쓰지 않는다
│   ├── queries/composables/   useQuery / useMutation 래퍼
│   ├── composables/           쿼리가 아닌 도메인 로직 (URL 필터 상태)
│   ├── components/            이 도메인의 UI
│   ├── locales/               번역 키, 기능 바로 옆에
│   └── types/
├── stores/                    Pinia — 클라이언트 전용 상태, 서버 엔티티 금지
├── components/{ui,custom,icons/shell}/
├── lib/                       http, logger, queryClient, i18n, session
├── common/                    constants, error, types, utils
└── styles/main.css            디자인 토큰 (Tailwind v4에는 설정 파일이 없다)

__mocks__/  __tests__/         src/ 바깥, 프로젝트 루트에 위치
```

## 이 프로젝트가 보여주려는 규칙

각 규칙은 파일 하나만 열면 되고, 그 이유는 사용 지점의 주석에 적혀 있다:

- **서버 상태는 절대 Pinia에 두지 않는다** — `src/stores/useUiStore.ts`는 샘플이
  아니라 `selectedSampleId`를 담는다. `stores/` 아래에서 HTTP 클라이언트를
  import하는 것은 리뷰 지적이 아니라 lint 에러다.
- **쿼리 컴포저블은 `MaybeRefOrGetter`를 받는다** — 일반 값은 절대 refetch되지
  않으며, 조용히 실패한다. 이를 잡아내는 것은
  `__tests__/features/sample/useSampleDetail.spec.ts`뿐이다.
- **필터는 URL에 살고, 그 자체가 쿼리 키의 일부다** —
  `src/features/sample/composables/useSampleFilters.ts`.
- **QueryClient 하나가 세션보다 오래 산다** — 그래서 `src/lib/session.ts`가
  로그아웃과 계정 전환 시 캐시를 비운다. 요청 단위 서버 경계가 있었다면 공짜로
  얻었을 동작이다.
- **MSW는 브라우저에서 가로챈다** — 서버 홉이 없으므로 그것이 유일하게 올바른
  위치다. `__mocks__/browser.ts`.
- **컴포넌트는 `views/`가 아니라 도메인 안에 산다** — `views/`는 조합만 한다.

프로젝트 차원의 결정(번들 예산, 브레이크포인트, SEO, 백엔드가 책임지는 범위)은
[AGENTS.md](./AGENTS.md)에 있다.
