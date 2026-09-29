"use client";

import { useEffect, useState } from "react";

type Locale = "ko" | "en";
const content = {
  ko: {
    eyebrow: "ABOUT THE PROJECT",
    title: <>색상 시스템을 더 쉽고<br/><span>일관되게.</span></>,
    lead: "MyAwesomeTheme은 디자이너와 개발자가 일관된 색상 시스템을 만들고, 실제 UI에서 확인하고, 디자인 토큰으로 내보낼 수 있도록 돕는 브라우저 기반 도구입니다.",
    sections: [
      { title: "하나의 색상에서 완성되는 팔레트", body: "기준 색상을 선택하면 50–950 단계의 색상 스케일을 만들고, 각 색상을 UI 미리보기에서 확인할 수 있습니다." },
      { title: "디자인과 접근성을 함께 확인", body: "텍스트와 배경 색상의 대비를 확인하고, 선택한 조합이 일반 텍스트와 큰 텍스트 기준에서 어떤 결과를 보이는지 살펴볼 수 있습니다." },
      { title: "개발 환경에 맞게 내보내기", body: "생성한 색상은 Tailwind CSS 및 CSS 변수 형식으로 내보내 프로젝트의 디자인 토큰으로 활용할 수 있습니다." }
    ],
    noteTitle: "접근성 안내",
    note: "대비 검사 결과는 선택한 색상 쌍을 검토하기 위한 참고 정보입니다. 실제 접근성은 글자 크기, 굵기, 상태, 주변 맥락 및 전체 인터페이스를 함께 검토해야 하며, 이 도구만으로 접근성 준수를 보장하지 않습니다.",
    link: "개인정보 처리방침 보기"
  },
  en: {
    eyebrow: "ABOUT THE PROJECT",
    title: <>A more consistent<br/><span>way to work with color.</span></>,
    lead: "MyAwesomeTheme is a browser-based tool for designers and developers to build consistent color systems, preview them in UI, and export design tokens.",
    sections: [
      { title: "A complete palette from one color", body: "Choose a base color to generate a 50–950 scale and inspect each shade in a live UI preview." },
      { title: "Review design and contrast together", body: "Check text and background contrast and review how a selected pair performs against normal- and large-text thresholds." },
      { title: "Export for your workflow", body: "Export generated colors as Tailwind CSS or CSS variables and use them as design tokens in your project." }
    ],
    noteTitle: "Accessibility note",
    note: "Contrast results are a reference for reviewing the selected color pair. Real-world accessibility also depends on text size, weight, states, context, and the full interface. This tool alone does not guarantee accessibility compliance.",
    link: "Read the privacy policy"
  }
};
export default function AboutContent() {
  const [locale, setLocale] = useState<Locale>("ko");
  useEffect(() => {
    const sync = () => setLocale(window.localStorage.getItem("mat-locale") === "en" ? "en" : "ko");
    sync(); window.addEventListener("mat-locale-change", sync);
    return () => window.removeEventListener("mat-locale-change", sync);
  }, []);
  const t = content[locale];
  return <article className="info-article">
    <div className="info-eyebrow">{t.eyebrow}</div>
    <h1>{t.title}</h1>
    <p className="info-lead">{t.lead}</p>
    <div className="info-feature-grid">
      {t.sections.map((item, i) => <section className="info-feature-card" key={item.title}>
        <span className="info-feature-number">0{i+1}</span>
        <h2>{item.title}</h2><p>{item.body}</p>
      </section>)}
    </div>
    <aside className="info-callout"><strong>{t.noteTitle}</strong><p>{t.note}</p></aside>
    <p className="info-related"><a href="/privacy">{t.link} <span aria-hidden="true">↗</span></a></p>
  </article>;
}