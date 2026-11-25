-- 배포 때 BAZE 가 이 파일을 D1 에 적용한다. 바꿀 때는 기존 표를 지우지 말고 더하기만 한다.
CREATE TABLE IF NOT EXISTS rate_limit (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL,
  window_start INTEGER NOT NULL
);

-- 소유자가 /admin 에서 바꾸는 값(src/content.ts 의 settings). value 는 JSON. 없으면 content.ts 의 기본값.
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT
);

-- _base 의 /admin 견본이 쓰는 문의 표. 새 템플릿은 자기 표로 바꾸거나 지운다(아직 배포 전일 때만).
CREATE TABLE IF NOT EXISTS inquiry (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  assignee TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

-- 방문견적 신청. 제출 식별자는 다시 보내기를 중복 저장하지 않기 위해 사용한다.
CREATE TABLE IF NOT EXISTS quote_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  request_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  people TEXT NOT NULL,
  furniture TEXT NOT NULL,
  services TEXT NOT NULL,
  consent INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);
