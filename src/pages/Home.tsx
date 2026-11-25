import { Armchair, ArrowDown, Building2, Check, ClipboardCheck, Grid2X2, QrCode, Sparkles, Warehouse } from "lucide-react";
import { useEffect } from "react";

const steps = [
  ["기존 관리대장 확인", "품목, 관리번호, 수량, 등록 위치를 확인합니다."],
  ["현장 조사·QR 부착", "실제 가구를 하나씩 확인하고 고유 QR 라벨을 해당 가구의 기록과 연결합니다."],
  ["위치·상태 기록", "현재 위치, 오염·파손 상태, 세척이나 수리 검토가 필요한 부분을 기록합니다."],
  ["전체 현황 정리", "층·공간별 수량, 대장과 현장의 차이, 조치가 필요한 가구를 목록으로 정리합니다."],
];

const process = ["서비스·작업 범위 확인", "일정 협의 및 현장 작업", "작업·조사 결과 정리", "필요에 따라 정기관리"];

export default function Home() {
  useEffect(() => {
    const target = document.getElementById(window.location.hash.slice(1));
    target?.scrollIntoView({ behavior: "instant", block: "start" });
  }, []);

  return (
    <div className="site" id="top">
      <a className="skip-link" href="#main">본문으로 바로가기</a>
      <header className="header">
        <div className="header-inner">
          <a href="#top" className="brand" aria-label="우드팜케어 처음으로"><span className="brand-leaf"><img src="/brand/woodfarm-care-leaf.png" alt="" width="1254" height="1254" /></span><img className="brand-wordmark" src="/brand/woodfarm-care-logo.png" alt="우드팜케어" width="2161" height="717" /></a>
          <nav aria-label="주요 메뉴"><a href="#services">서비스 안내</a><a href="/estimate">간편 견적</a><a href="#qr">QR 관리 방식</a><a href="#scope">관리 범위</a><a href="#process">이용 과정</a></nav>
        </div>
      </header>

      <main id="main">
        <section className="hero">
          <div className="hero-copy">
            <div className="hero-copy-inner">
              <p className="eyebrow"><span /> 공간을 오래, 쾌적하게</p>
              <h1>가구와 공간을<br />관리하세요</h1>
              <p className="hero-description">사무실과 사무가구를 함께 청소하고, 가구 상태를 점검합니다. 가구별 QR을 기존 관리대장과 연결해 수량·위치·상태를 한눈에 확인할 수 있도록 정리합니다.</p>
              <div className="hero-actions"><a className="button button-dark" href="#services">서비스 살펴보기 <ArrowDown size={16} /></a><a className="button button-outline" href="#qr">QR 관리 방식 보기 <ArrowDown size={16} /></a></div>
              <p className="hero-note">사무 · 상업공간을 위한 가구와 공간 관리</p>
            </div>
          </div>
          <div className="hero-photo" role="img" aria-label="책상과 의자가 놓인 밝은 사무공간"><span className="photo-caption">더 나은 공간을 위한 세심한 관리</span></div>
        </section>

        <section className="section services" id="services">
          <div className="section-heading"><div><p className="section-kicker">우드팜케어 서비스</p><h2>사무공간 청소부터<br className="mobile-break" /> 가구 현황 관리까지</h2></div><p>공간을 쾌적하게, 가구는 더 체계적으로.<br />필요한 관리 범위를 함께 살펴봅니다.</p></div>
          <div className="service-grid">
            <article className="service-card"><figure className="service-photo"><img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=85" alt="공간의 창문을 닦고 있는 모습" width="800" height="500" loading="lazy" /><figcaption>서비스 소개용 이미지</figcaption></figure><div className="card-icon"><Sparkles size={25} strokeWidth={1.5} /></div><h3>세척·청소</h3><p className="card-intro">매일 사용하는 가구와 공간을 깨끗하게 관리합니다.</p><div className="service-card-body"><div className="card-rule" /><h4>사무용 의자·가구 세척</h4><p>의자 좌판·등받이·팔걸이 등을 소재와 오염 상태에 맞춰 세척합니다. 책상 등 다른 가구도 작업 범위에 따라 함께 청소할 수 있습니다.</p><h4>사무실 청소</h4><p>업무공간의 바닥, 회의실, 공용공간 등 필요한 구역을 청소합니다.</p></div><div aria-hidden="true" /></article>
            <article className="service-card"><figure className="service-photo chair-photo"><img src="https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=800&q=85" alt="패브릭 소재의 의자" width="800" height="500" loading="lazy" /><figcaption>서비스 소개용 이미지</figcaption></figure><div className="card-icon"><ClipboardCheck size={25} strokeWidth={1.5} /></div><h3>가구 점검</h3><p className="card-intro">사용 중인 가구의 상태를 꼼꼼하게 살펴봅니다.</p><div className="service-card-body"><div className="card-rule" /><p>의자 바퀴와 팔걸이, 책상과 수납장 연결부 등 사용 중 마모되거나 흔들리는 부분을 확인합니다.</p><p>점검 결과를 바탕으로 세척이 필요한 가구와 수리·부품 교체를 검토할 가구를 알려드립니다.</p></div><p className="card-footnote">간단수리와 부품 교체는 상태와 부품 확인 후 가능한 범위를 안내합니다.</p></article>
            <article className="service-card"><figure className="service-photo"><img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=85" alt="노트북 화면에서 정보를 확인하는 모습" width="800" height="500" loading="lazy" /><figcaption>서비스 소개용 이미지</figcaption></figure><div className="card-icon"><QrCode size={25} strokeWidth={1.5} /></div><h3>QR 가구 현황 관리</h3><p className="card-intro">흩어진 가구의 위치와 상태를 연결합니다.</p><div className="service-card-body"><div className="card-rule" /><p>기존 관리대장과 현장의 가구를 대조해 실제 수량·위치·상태를 조사합니다.</p><p>개별 가구에 고유 QR 라벨을 부착하고 관리번호와 연결해 이동하거나 대장에서 누락된 가구를 확인할 수 있게 합니다.</p><p>조사 결과는 고객이 기존 관리대장에 반영할 수 있도록 정리합니다.</p></div><p className="card-footnote">기존 가구·비품 관리대장을 보유한 사업장 대상</p></article>
          </div>
        </section>

        <section className="qr-section" id="qr">
          <div className="section qr-layout">
            <div className="qr-copy"><p className="section-kicker">QR 관리 방식</p><h2>관리대장과 실제 가구를<br />연결합니다</h2><p className="section-lead">가구마다 기록을 연결하고 현장의 변화를 확인해<br className="desktop-break" /> 관리대장과 실제 현황을 더 가깝게 맞춥니다.</p>
              <ol className="steps">{steps.map(([title, description], i) => <li key={title}><span className="step-number">{String(i + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{description}</p></div></li>)}</ol>
            </div>
            <div className="phone-stage"><div className="phone-label">가구별 정보를 한눈에 <span>화면 예시</span></div><div className="phone"><div className="phone-notch" /><div className="phone-top"><img src="/brand/woodfarm-care-logo.png" alt="우드팜케어" width="2161" height="717" /><Grid2X2 size={16} /></div><div className="phone-body"><div className="phone-icon"><Armchair size={29} strokeWidth={1.4} /></div><p className="phone-overline">가구 상세 정보</p><h3>회의실 의자</h3><p className="phone-caption">3층 회의실에서 QR 스캔</p><div className="phone-divider" /><dl><div><dt>관리번호</dt><dd>WF-023</dd></div><div><dt>등록 위치</dt><dd>2층 회의실</dd></div><div><dt>현재 위치</dt><dd>3층 회의실</dd></div><div><dt>상태</dt><dd><span className="status">세척 필요</span></dd></div></dl><div className="phone-message"><Check size={15} /> 가구별 위치와 상태를 확인합니다</div></div></div><p className="phone-disclaimer">이 화면은 QR 관리 방식에 대한 이해를 돕기 위한 예시입니다.</p></div>
          </div>
        </section>

        <section className="section scope" id="scope"><div className="section-heading"><div><p className="section-kicker">관리 범위</p><h2>의자 한 개부터 사무실 전체까지</h2></div><p>공간과 가구의 상태에 맞춰<br />필요한 작업 범위를 선택할 수 있습니다.</p></div>
          <div className="scope-grid"><article><Armchair size={30} strokeWidth={1.4} /><h3>의자·가구</h3><p>의자·책상·파티션 세척과 상태 점검</p></article><article><Building2 size={30} strokeWidth={1.4} /><h3>사무실</h3><p>업무공간·공용공간 청소와 사무가구 관리</p></article><article><Warehouse size={30} strokeWidth={1.4} /><h3>건물 <span>확대 가능한 범위</span></h3><p>건물 단위 청소·환경 관리로 확대 가능한 범위</p></article></div>
        </section>

        <section className="process-section" id="process"><div className="section"><div className="section-heading"><div><p className="section-kicker">이용 과정</p><h2>필요한 관리부터 차근차근</h2></div><p>작업 범위 확인부터 결과 정리까지<br />공간에 맞는 순서로 진행합니다.</p></div><ol className="process-grid">{process.map((item, i) => <li key={item}><span>0{i + 1}</span><h3>{item}</h3>{i < 3 && <span className="process-arrow" aria-hidden="true">→</span>}</li>)}</ol><div className="regular-note"><span>정기관리 안내</span><p>사용 빈도와 가구 상태에 맞춰 청소·점검을 반복합니다. QR 관리 고객은 방문 시 확인한 위치와 상태 변동을 기록합니다.</p></div></div></section>
      </main>
      <footer><div className="footer-inner"><div className="footer-brand"><img className="footer-leaf" src="/brand/woodfarm-care-leaf.png" alt="" width="1254" height="1254" /><span className="footer-logo"><img src="/brand/woodfarm-care-logo.png" alt="우드팜케어" width="2161" height="717" /></span></div><p>가구와 공간을 오래도록 쾌적하게.</p><a href="#top">맨 위로 ↑</a></div></footer>
    </div>
  );
}
