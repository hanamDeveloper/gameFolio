import { sideProjects, workExperience } from "./folio-data";
import type { ZoneContent } from "./types";

const dotak = workExperience[1];
const jstock = workExperience[2];
const keepup = sideProjects[0];
const jobro = sideProjects[1];

export const failureMuseumContent: ZoneContent = {
  id: "failure-museum",
  zone: "storyHouse",
  title: "Failure Museum",
  subtitle: "망했던 것들",
  accent: "#f87171",
  pages: [
    {
      id: "jobro",
      title: "Jobro 피벗",
      subtitle: "시장 검증의 한계",
      sections: [
        {
          body: "베트남 현지까지 가서 인터뷰했는데, 규제랑 양면시장 문제로 피벗했습니다.",
        },
        {
          heading: "확인한 것",
          items: jobro.details?.filter((d) =>
            d.includes("피벗") || d.includes("규제") || d.includes("양면시장"),
          ),
        },
        {
          heading: "남은 것",
          items: [
            "기술만으로는 안 풀리는 문제가 있다",
            "현장에 가서 확인하지 않으면 가정이 틀릴 수 있다",
            "빨리 포기하고 방향을 바꾸는 것도 일의 일부다",
          ],
        },
      ],
    },
    {
      id: "keepup",
      title: "KeepUp 저참여",
      subtitle: "출시 초기 5% 참여율",
      sections: [
        {
          body: "출시 직후 참여율 5%였습니다. 기능 추가 전에 막히는 지점부터 고쳤습니다.",
        },
        {
          heading: "그때 한 일",
          items: keepup.details?.filter(
            (d) =>
              d.includes("참여율") ||
              d.includes("인증") ||
              d.includes("유지율") ||
              d.includes("UX"),
          ),
        },
        {
          heading: "남은 것",
          body: "숫자가 낮을 때 기능부터 늘리기보다, 사용자가 어디서 막히는지 먼저 보는 게 낫더라고요.",
        },
      ],
    },
    {
      id: "dotak",
      title: "더탁 팀 갈등",
      subtitle: "수평 → 수직 개편",
      sections: [
        {
          body: "6개월 넘게 쌓인 오해로 협업이 거의 멈춘 팀이었습니다.",
        },
        {
          heading: "한 일",
          items: [
            "구성원과 1:1로 대화하며 관점 정리",
            "커피챗으로 자연스럽게 논의할 분위기 만들기",
            "갈등 원인이 방식 차이지, 개인 감정이 아님을 맞추기",
          ],
        },
        {
          heading: "정리한 것",
          items: dotak.details?.filter((d) =>
            ["칸반", "컨벤션", "문서화", "협업", "컴포넌트 정책"].some((k) =>
              d.includes(k),
            ),
          ),
        },
        {
          heading: "남은 것",
          body: "팀이 멈출 때는 코드보다, 같은 기준으로 말하게 만드는 게 먼저인 경우가 많았습니다.",
        },
      ],
    },
    {
      id: "jstock",
      title: "제이스톡 협업",
      subtitle: "9개 프로젝트 동시 진행",
      sections: [
        {
          body: "프론트 9개 넘게 동시에. 출시 4개월 남았을 때 네이티브 병목을 보고 웹뷰 전환을 제안했습니다.",
        },
        {
          heading: "왜 꼬였나",
          items: [
            "Figma 위주 협업 — 버전이 계속 안 맞음",
            "기획·개발·디자인이 각자 다른 기준",
            "JIRA 도입은 리소스가 없어서 무리",
          ],
        },
        {
          heading: "그때 한 일",
          items: [
            "Excel로 화면 정책·데이터 흐름·라우팅 기준 정리",
            "웹뷰 전환 제안 → 기능 ~70% 전환, 출시 일정 맞춤",
            "네이티브·웹뷰 bridge, 로그인·라우팅 하이브리드 구조 정리",
            "우선순위 맞추고 작은 단위로 출시",
          ],
        },
        {
          heading: "남은 것",
          body: "프로젝트가 많을수록 문서 한 장이 회의를 줄여줍니다. 도구는 화려할 필요 없고, 다 같이 같은 걸 보면 됩니다.",
        },
      ],
    },
  ],
};
