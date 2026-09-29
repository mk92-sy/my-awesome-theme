"use client";

import { useEffect, useState } from "react";

type Locale = "ko" | "en";

const copy = {
  ko: {
    title: "MyAwesomeTheme 소개",
    intro: "MyAwesomeTheme은 디자이너와 개발자가 일관된 색상 시스템을 만들고 확인할 수 있도록 돕는 브라우저 기반 도구입니다.",
    sections: [
      ["주요 기능", "기준 색상에서 50–950 색상 스케일을 만들고, UI 색상 미리보기와 텍스트 대비 확인을 통해 색상 조합을 검토할 수 있습니다. Tailwind CSS 및 CSS 변수 형식으로 디자인 토큰을 내보낼 수 있습니다."],
      ["접근성 안내", "대비 검사 결과는 선택한 색상 쌍의 대비를 참고하는 데 도움을 줍니다. 실제 제품의 접근성은 글자 크기, 굵기, 상태, 주변 맥락 및 전체 인터페이스를 함께 검토해야 하며, 이 도구만으로 접근성 준수를 보장하지 않습니다."],
      ["문의 및 피드백", "도구 사용 중 문제가 있거나 개선 의견이 있다면 프로젝트 운영 채널을 통해 알려주세요."]
    ],
    privacy: "개인정보 처리방침"
  },
  en: {
    title: "About MyAwesomeTheme",
    intro: "MyAwesomeTheme is a browser-based tool that helps designers and developers create and inspect consistent color systems.",
    sections: [
      ["What you can do", "Generate a 50–950 color scale from a base color, preview colors in UI examples, inspect text contrast, and export design tokens in Tailwind CSS or CSS variable formats."],
      ["Accessibility note", "Contrast results help you review the selected color pair. Accessibility in a real product also depends on text size, weight, states, context, and the full interface. This tool alone does not guarantee accessibility compliance."],
      ["Feedback", "For issues or suggestions, please use the project's available maintainer or support channel."]
    ],
    privacy: "Privacy Policy"
  }
};

export default function AboutContent() {
  const [locale, setLocale] = useState<Locale>("ko");
  useEffect(() => {
    const sync = () => setLocale(window.localStorage.getItem("mat-locale") === "en" ? "en" : "ko");
    sync();
    window.addEventListener("mat-locale-change", sync);
    return () => window.removeEventListener("mat-locale-change", sync);
  }, []);
  const t = copy[locale];
  return <article className="info-content">
    <h1>{t.title}</h1><p>{t.intro}</p>
    {t.sections.map(([heading, body]) => <section key={heading}><h2>{heading}</h2><p>{body}</p></section>)}
    <p><a href="/privacy">{t.privacy}</a></p>
  </article>;
}
