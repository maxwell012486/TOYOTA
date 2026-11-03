// Vercel 빌드: 앱 HTML에 Supabase 주소·공개 키를 넣어 public/index.html로 만든다.
// 값은 Vercel 환경 변수(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)를 먼저 쓰고, 없으면 supabase.public.json을 쓴다.
// 둘 다 없거나 형식이 다르면 자리표시자를 그대로 두고, 앱은 클라우드 저장 기능을 숨긴다.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

let pub = {};
if (existsSync('supabase.public.json')) {
  try { pub = JSON.parse(readFileSync('supabase.public.json', 'utf8')); } catch { pub = {}; }
}
const url = (process.env.SUPABASE_URL || pub.url || '').trim();
const key = (process.env.SUPABASE_PUBLISHABLE_KEY || pub.publishableKey || '').trim();
const urlOk = /^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(url);
const keyOk = /^sb_publishable_[A-Za-z0-9_-]+$/.test(key);

let html = readFileSync('car-decision-helper.html', 'utf8');
if (urlOk && keyOk) {
  html = html.replaceAll('__SUPABASE_URL__', url).replaceAll('__SUPABASE_PUBLISHABLE_KEY__', key);
  console.log('Supabase 설정을 넣었어요:', url, process.env.SUPABASE_URL ? '(환경 변수)' : '(supabase.public.json)');
} else {
  console.log('Supabase 설정이 없거나 형식이 달라 클라우드 저장 없이 빌드해요.');
}

mkdirSync('public', { recursive: true });
writeFileSync('public/index.html', html);
console.log('public/index.html 생성');

// 부대 차량 구매 도우미(오프라인 단일 HTML)는 그대로 /unit-vehicle-advisor 주소에 둔다
mkdirSync('public/unit-vehicle-advisor', { recursive: true });
writeFileSync('public/unit-vehicle-advisor/index.html', readFileSync('unit-vehicle-advisor/부대차량구매도우미.html'));
console.log('public/unit-vehicle-advisor/index.html 생성');
