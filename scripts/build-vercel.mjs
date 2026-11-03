// Vercel 빌드: 앱 HTML에 Supabase 주소·공개 키를 넣어 public/index.html로 만든다.
// 환경 변수가 없으면 자리표시자를 그대로 두고, 앱은 클라우드 저장 기능을 숨긴다.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const url = (process.env.SUPABASE_URL || '').trim();
const key = (process.env.SUPABASE_PUBLISHABLE_KEY || '').trim();
const urlOk = /^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(url);
const keyOk = /^sb_publishable_[A-Za-z0-9_-]+$/.test(key);

let html = readFileSync('car-decision-helper.html', 'utf8');
if (urlOk && keyOk) {
  html = html.replaceAll('__SUPABASE_URL__', url).replaceAll('__SUPABASE_PUBLISHABLE_KEY__', key);
  console.log('Supabase 설정을 넣었어요:', url);
} else {
  console.log('Supabase 환경 변수가 없거나 형식이 달라 클라우드 저장 없이 빌드해요.');
}

mkdirSync('public', { recursive: true });
writeFileSync('public/index.html', html);
console.log('public/index.html 생성');
