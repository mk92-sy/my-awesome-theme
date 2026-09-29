"use client";

import { useEffect, useState } from "react";

type Locale = "ko" | "en";
const content = {
  ko: {
    eyebrow: "PRIVACY & DATA",
    title: "개인정보 처리방침",
    updated: "최종 업데이트 · 2026년 9월 29일",
    lead: "MyAwesomeTheme은 색상 작업을 간편하게 할 수 있도록 설계되었습니다. 아래 내용은 서비스 이용 중 정보가 처리될 수 있는 방식을 설명하며, 실제 배포 환경에 맞게 운영자가 확인해야 합니다.",
    sections: [
      { title: "01", heading: "색상 입력 및 도구 이용", body: "색상 생성 및 대비 확인 기능은 입력한 색상 값을 브라우저에서 처리하도록 설계되어 있습니다. 다만 웹사이트를 제공하는 호스팅 환경에서는 접속 로그 등 기술 정보가 처리될 수 있습니다." },
      { title: "02", heading: "브라우저 저장 및 기능", body: "언어와 테마 설정은 브라우저의 localStorage에 저장됩니다. 복사 기능은 브라우저 클립보드 기능을 사용합니다. 브라우저 설정에서 저장 데이터와 클립보드 권한을 관리할 수 있습니다." },
      { title: "03", heading: "호스팅 및 제3자 서비스", body: "호스팅, 보안, 분석 또는 기타 외부 서비스가 배포 환경에 포함된 경우 해당 제공업체가 관련 정보를 처리할 수 있습니다. 운영자는 실제 사용 중인 서비스와 로그 보관 기간을 확인해 이 방침에 구체적으로 기재해야 합니다." },
      { title: "04", heading: "문의 및 정책 변경", body: "운영자 및 개인정보 문의처는 실제 배포 서비스의 연락처로 기재해야 합니다. 서비스 기능이나 운영 환경이 변경되면 이 방침도 업데이트될 수 있습니다." }
    ],
    noteTitle: "운영자 확인이 필요한 사항",
    note: "이 문서는 기본 안내문이며 법률 자문이 아닙니다. 게시 전 실제 데이터 흐름, 운영자 정보, 적용 법률 및 사용 중인 제3자 서비스에 맞게 검토하고 수정해 주세요."
  },
  en: {
    eyebrow: "PRIVACY & DATA",
    title: "Privacy Policy",
    updated: "Last updated · September 29, 2026",
    lead: "MyAwesomeTheme is designed to make color work simple. This page describes how information may be handled when using the service and should be verified by the operator against the actual deployment.",
    sections: [
      { title: "01", heading: "Color inputs and tool use", body: "The color generation and contrast features are designed to process entered color values in your browser. The hosting environment serving the website may also process technical information such as access logs." },
      { title: "02", heading: "Browser storage and features", body: "Language and theme preferences are stored in your browser's localStorage. The copy feature uses your browser's clipboard functionality. You can manage stored data and clipboard permissions in your browser settings." },
      { title: "03", heading: "Hosting and third parties", body: "If hosting, security, analytics, or other external services are part of the deployment, those providers may process relevant information. The operator should verify the actual services and log-retention periods and specify them here." },
      { title: "04", heading: "Contact and policy changes", body: "The operator and privacy contact should be replaced with a real contact for the deployed service. This policy may be updated when the service or its operating environment changes." }
    ],
    noteTitle: "Operator review required",
    note: "This is a starter notice, not legal advice. Before publication, review and adapt it to the actual data flows, operator details, applicable laws, and third-party services in use."
  }
};
export default function PrivacyContent() {
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
    <p className="info-muted">{t.updated}</p>
    <p className="info-lead">{t.lead}</p>
    <div className="info-policy-list">
      {t.sections.map(item => <section className="info-policy-row" key={item.title}>
        <span className="info-feature-number">{item.title}</span>
        <div><h2>{item.heading}</h2><p>{item.body}</p></div>
      </section>)}
    </div>
    <aside className="info-callout"><strong>{t.noteTitle}</strong><p>{t.note}</p></aside>
  </article>;
}