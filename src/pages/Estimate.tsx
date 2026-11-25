import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Armchair, Check, ClipboardCheck, Layers3, Sofa, Table2 } from "lucide-react";
import "../estimate.css";

const peopleOptions = ["10인 이하", "11~30인", "31~50인", "51인 이상"];
const furnitureOptions = [
  { name: "사무용 의자", icon: Armchair },
  { name: "파티션", icon: Layers3 },
  { name: "소파", icon: Sofa },
  { name: "책상", icon: Table2 },
];
const serviceOptions = [
  { name: "세척", description: "소재와 오염 상태에 맞춘 가구 세척" },
  { name: "상태점검", description: "흔들림·마모·파손 상태 확인" },
  { name: "간단수리", description: "상태와 부품 확인 후 가능한 범위 안내" },
  { name: "정기관리", description: "사용 빈도와 상태에 맞춘 반복 관리" },
];
const stepLabels = ["공간 규모", "가구 선택", "서비스 선택", "신청하기"];

export default function Estimate() {
  const [step, setStep] = useState(0);
  const [people, setPeople] = useState("");
  const [furniture, setFurniture] = useState<Record<string, number>>({});
  const [services, setServices] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const lock = useRef(false);
  const requestId = useRef("");
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    document.title = "간편 견적 | 우드팜케어";
    return () => { document.title = "우드팜케어 | 가구와 공간을 관리하세요"; };
  }, []);

  function go(next: number) {
    setError("");
    setStep(next);
    window.scrollTo({ top: 0, behavior: "auto" });
    window.requestAnimationFrame(() => headingRef.current?.focus());
  }

  function next() {
    if (step === 0 && !people) return setError("공간의 상주 인원을 선택해 주세요.");
    if (step === 1 && Object.keys(furniture).length === 0) return setError("관리할 가구를 하나 이상 선택해 주세요.");
    if (step === 1 && Object.values(furniture).some(n => !Number.isInteger(n) || n < 1 || n > 999)) return setError("가구 수량은 1개부터 999개까지 입력해 주세요.");
    if (step === 2 && services.length === 0) return setError("원하는 서비스를 하나 이상 선택해 주세요.");
    go(step + 1);
  }

  function toggleFurniture(item: string) {
    setError("");
    setFurniture(current => {
      const updated = { ...current };
      if (item in updated) delete updated[item];
      else updated[item] = 1;
      return updated;
    });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lock.current) return;
    if (!name.trim()) return setError("이름을 입력해 주세요.");
    if (phone.replace(/\D/g, "").length < 8) return setError("연락 가능한 전화번호를 입력해 주세요.");
    if (!consent) return setError("개인정보 수집 및 이용에 동의해 주세요.");
    lock.current = true;
    setSubmitting(true);
    setError("");
    if (!requestId.current) requestId.current = crypto.randomUUID();
    try {
      const response = await fetch("/api/quote-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: requestId.current, name: name.trim(), phone: phone.trim(), people, furniture: Object.entries(furniture).map(([item, quantity]) => ({ name: item, quantity })), services, consent }),
      });
      const result = await response.json().catch(() => ({})) as { error?: string };
      if (!response.ok) throw new Error(result.error || "신청하지 못했어요. 잠시 뒤 다시 시도해 주세요.");
      setDone(true);
      window.scrollTo({ top: 0, behavior: "auto" });
    } catch (err) {
      setError(err instanceof Error && err.message !== "Failed to fetch" ? err.message : "신청하지 못했어요. 연결을 확인하고 다시 시도해 주세요.");
    } finally {
      lock.current = false;
      setSubmitting(false);
    }
  }

  return <div className="site estimate-site">
    <a className="skip-link" href="#estimate-main">본문으로 바로가기</a>
    <header className="header"><div className="header-inner">
      <a href="/" className="brand" aria-label="우드팜케어 처음으로"><span className="brand-leaf"><img src="/brand/woodfarm-care-leaf.png" alt="" width="1254" height="1254" /></span><img className="brand-wordmark" src="/brand/woodfarm-care-logo.png" alt="우드팜케어" width="2161" height="717" /></a>
      <nav aria-label="주요 메뉴"><a href="/#services">서비스 안내</a><a href="/estimate" aria-current="page">간편 견적</a><a href="/#qr">QR 관리 방식</a><a href="/#scope">관리 범위</a><a href="/#process">이용 과정</a></nav>
    </div></header>

    <main id="estimate-main" className="estimate-main">
      <div className="estimate-wrap">
        <a className="estimate-back" href="/"><ArrowLeft size={16} aria-hidden="true" /> 서비스 소개로 돌아가기</a>
        <div className="estimate-intro"><div><p className="estimate-kicker">우드팜케어 간편 견적</p><h1>우리 공간에 필요한<br />관리를 알아보세요</h1><p>가구와 원하는 서비스를 선택하면 방문견적을 신청할 수 있어요.<br />금액은 현장 상태를 확인한 후 안내해 드립니다.</p></div><div className="estimate-intro-icon" aria-hidden="true"><ClipboardCheck size={44} strokeWidth={1.1} /></div></div>

        {done ? <section className="estimate-panel estimate-success" aria-live="polite"><div className="success-icon"><Check size={28} aria-hidden="true" /></div><h2>방문견적 신청이 접수됐어요</h2><p>남겨주신 내용을 확인한 뒤 연락드릴게요.<br />견적 금액과 작업 범위는 현장 확인 후 안내합니다.</p><a className="estimate-primary" href="/">서비스 소개로 돌아가기 <ArrowRight size={16} aria-hidden="true" /></a></section> : <>
          <ol className="estimate-progress" aria-label="신청 진행 단계">{stepLabels.map((label, i) => <li key={label} className={i === step ? "current" : i < step ? "completed" : ""} aria-current={i === step ? "step" : undefined}><span>{i < step ? <Check size={14} aria-hidden="true" /> : i + 1}</span><strong>{label}</strong></li>)}</ol>
          <section className="estimate-panel">
            <div className="estimate-panel-heading"><div><p className="estimate-step">{step + 1} / 4</p><h2 ref={headingRef} tabIndex={-1}>{["공간의 상주 인원을 알려주세요", "관리할 가구를 선택해 주세요", "원하는 서비스를 선택해 주세요", "선택 내용을 확인해 주세요"][step]}</h2><p>{["공간 규모에 맞는 관리를 준비할게요.", "해당하는 가구를 모두 선택하고 수량을 입력해 주세요.", "필요한 관리를 모두 선택할 수 있어요.", "입력한 내용으로 방문견적을 신청합니다."][step]}</p></div></div>

            {step === 0 && <fieldset className="estimate-options"><legend className="sr-only">상주 인원</legend>{peopleOptions.map(option => <label className={`estimate-choice ${people === option ? "selected" : ""}`} key={option}><input type="radio" name="people" value={option} checked={people === option} onChange={() => { setPeople(option); setError(""); }} /><span className="choice-title">{option}</span><span className="choice-indicator" aria-hidden="true">{people === option && <Check size={15} />}</span></label>)}</fieldset>}

            {step === 1 && <div className="furniture-grid">{furnitureOptions.map(({ name: item, icon: Icon }) => <div className={`furniture-option ${item in furniture ? "selected" : ""}`} key={item}><label className="furniture-select"><input type="checkbox" checked={item in furniture} onChange={() => toggleFurniture(item)} /><span className="furniture-icon"><Icon size={23} strokeWidth={1.5} aria-hidden="true" /></span><span>{item}</span><span className="choice-indicator" aria-hidden="true">{item in furniture && <Check size={15} />}</span></label>{item in furniture && <div className="quantity-field"><label htmlFor={`quantity-${item}`}>수량</label><div><input id={`quantity-${item}`} type="number" min="1" max="999" inputMode="numeric" value={furniture[item] || ""} onChange={e => { setFurniture(current => ({ ...current, [item]: e.target.value === "" ? 0 : Number(e.target.value) })); setError(""); }} /><span>개</span></div></div>}</div>)}</div>}

            {step === 2 && <><fieldset className="service-options"><legend className="sr-only">서비스 선택</legend>{serviceOptions.map(({ name: service, description }) => <label className={`service-option ${services.includes(service) ? "selected" : ""}`} key={service}><input type="checkbox" checked={services.includes(service)} onChange={() => { setServices(current => current.includes(service) ? current.filter(value => value !== service) : [...current, service]); setError(""); }} /><span><strong>{service}</strong><small>{description}</small></span><span className="choice-indicator" aria-hidden="true">{services.includes(service) && <Check size={15} />}</span></label>)}</fieldset><p className="estimate-hint">간단수리와 부품 교체는 상태와 부품 확인 후 가능한 범위를 안내합니다.</p></>}

            {step === 3 && <form onSubmit={submit} noValidate>
              <div className="estimate-summary"><div><span>공간 규모</span><strong>{people}</strong></div><div><span>관리할 가구</span><strong>{Object.entries(furniture).map(([item, count]) => `${item} ${count}개`).join(", ")}</strong></div><div><span>희망 서비스</span><strong>{services.join(", ")}</strong></div></div>
              <p className="estimate-hint">예상 금액은 표시하지 않아요. 현장 상태와 작업 범위를 확인한 후 견적을 안내합니다.</p>
              <div className="contact-heading"><h3>방문견적 신청</h3><p>신청 내용을 안내받을 연락처를 남겨 주세요.</p></div>
              <div className="contact-fields"><div><label htmlFor="contact-name">이름 <span>*</span></label><input id="contact-name" autoComplete="name" maxLength={40} value={name} onChange={e => setName(e.target.value)} placeholder="이름을 입력해 주세요" required /></div><div><label htmlFor="contact-phone">연락처 <span>*</span></label><input id="contact-phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={30} value={phone} onChange={e => setPhone(e.target.value)} placeholder="연락 가능한 전화번호" required /></div></div>
              <div className="privacy-box"><p><strong>개인정보 수집 및 이용 안내</strong></p><p>수집 항목: 이름, 연락처, 선택한 관리 조건<br />이용 목적: 방문견적 신청 확인 및 연락<br />보관 기간: 신청 처리 및 삭제 요청 시까지</p><label className="consent-label"><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} /> 개인정보 수집 및 이용에 동의합니다. <span>*</span></label></div>
              {error && <p className="estimate-error" role="alert">{error}</p>}
              <div className="estimate-actions"><button className="estimate-secondary" type="button" onClick={() => go(2)} disabled={submitting}><ArrowLeft size={16} aria-hidden="true" /> 이전</button><button className="estimate-primary" type="submit" disabled={submitting}>{submitting ? "신청 중…" : "방문견적 신청"} <ArrowRight size={16} aria-hidden="true" /></button></div>
            </form>}
            {step < 3 && <>{error && <p className="estimate-error" role="alert">{error}</p>}<div className="estimate-actions">{step > 0 ? <button type="button" className="estimate-secondary" onClick={() => go(step - 1)}><ArrowLeft size={16} aria-hidden="true" /> 이전</button> : <a className="estimate-secondary" href="/">취소</a>}<button type="button" className="estimate-primary" onClick={next}>다음 <ArrowRight size={16} aria-hidden="true" /></button></div></>}
          </section>
          <p className="estimate-bottom-note">신청은 방문 일정을 확정하는 것이 아니에요. 내용을 확인한 뒤 연락드립니다.</p>
        </>}
      </div>
    </main>
    <footer><div className="footer-inner"><div className="footer-brand"><img className="footer-leaf" src="/brand/woodfarm-care-leaf.png" alt="" width="1254" height="1254" /><span className="footer-logo"><img src="/brand/woodfarm-care-logo.png" alt="우드팜케어" width="2161" height="717" /></span></div><p>가구와 공간을 오래도록 쾌적하게.</p><a href="/">서비스 소개</a></div></footer>
  </div>;
}
