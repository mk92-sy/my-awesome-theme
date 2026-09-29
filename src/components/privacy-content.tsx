"use client";

import { useEffect, useState } from "react";

type Locale = "ko" | "en";

const copy = {
  ko: {
    title: "개인정보 처리방침",
    updated: "최종 업데이트: 2026년 9월 29일",
    intro: "이 문서는 MyAwesomeTheme 이용 시 정보가 어떻게 처리될 수 있는지 설명합니다. 실제 배포 환경의 운영자 정보와 호스팅·분석 설정을 반영해 게시 전에 검토해 주세요.",
    sections: [
      ["도구 사용 및 입력값", "색상 생성 및 대비 확인 기능은 입력한 색상 값을 브라우저에서 처리하도록 설계되어 있습니다. 서비스 운영 환경에 따라 웹 호스팅 제공업체가 접속 로그 등 기술 정보를 처리할 수 있습니다."],
      ["저장 및 브라우저 기능", "언어와 테마 설정은 브라우저의 localStorage에 저장됩니다. 복사 기능을 사용할 경우 브라우저 클립보드 기능이 호출됩니다. 브라우저 설정에서 저장 데이터와 클립보드 권한을 관리할 수 있습니다."],
      ["제3자 서비스 및 로그", "호스팅, 보안, 분석 또는 외부 서비스가 추가되는 경우 해당 제공업체가 관련 정보를 처리할 수 있습니다. 운영자는 실제 사용 중인 서비스와 로그 보관 기간을 여기에 구체적으로 기재해야 합니다."],
      ["문의 및 변경", "운영자 또는 개인정보 문의처: 배포 서비스에 실제 연락처를 기재해 주세요. 서비스 기능이나 운영 환경이 변경되면 이 방침도 업데이트될 수 있습니다."],
      ["중요 안내", "이 문서는 기본 안내문이며 법률 자문이 아닙니다. 실제 데이터 흐름, 관할 법률, 운영자 정보 및 사용 중인 제3자 서비스에 맞게 검토·수정해야 합니다."]
    ]
  },
  en: {
    title: "Privacy Policy",
    updated: "Last updated: September 29, 2026",
    intro: "This page describes how information may be handled when using MyAwesomeTheme. Before publication, review it against the actual operator details and hosting or analytics configuration of your deployment.",
    sections: [
      ["Tool inputs", "The color generation and contrast features are designed to process entered color values in your browser. Depending on the deployment, the web hosting provider may process technical information such as access logs."],
      ["Local storage and browser features", "Language and theme preferences are stored in your browser's localStorage. The copy feature invokes your browser's clipboard functionality. You can manage stored data and clipboard permissions in your browser settings."],
      ["Third-party services and logs", "If hosting, security, analytics, or other third-party services are enabled, those providers may process relevant information. The operator should specify the actual services used and applicable log-retention periods here."],
      ["Contact and changes", "Operator or privacy contact: provide a real contact address for your deployment. This policy may be updated when the service or its operating environment changes."],
      ["Important", "This is a starter notice, not legal advice. Review and adapt it to the actual data flows, operator details, applicable laws, and third-party services in use."]
    ]
  }
};

export default function PrivacyContent() {
  const [locale, setLocale] = useState<Locale>("ko");
  useEffect(() => {
    const sync = () => setLocale(window.localStorage.getItem("mat-locale") === "en" ? "en" : "ko");
    sync();
    window.addEventListener("mat-locale-change", sync);
    return () => window.removeEventListener("mat-locale-change", sync);
  }, []);
  const t = copy[locale];
  return <article className="info-content">
    <h1>{t.title}</h1><p className="info-updated">{t.updated}</p><p>{t.intro}</p>
    {t.sections.map(([heading, body]) => <section key={heading}><h2>{heading}</h2><p>{body}</p></section>)}
  </article>;
}
