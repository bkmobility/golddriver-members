/* ==========================================================================
 * 골드대리운전 앱 설정 파일 - 이 파일만 고치면 됩니다.
 * ========================================================================== */
window.GD_CONFIG = {
  /* [필수] Supabase (Free Number 프로젝트) - 대시보드 > Project Settings > API
     anon public 키는 앱에 들어가도 되는 공개용 키입니다. service_role 키는 절대 넣지 마세요. */
  SUPABASE_URL: 'https://whixzerzpjuhgyhdiojr.supabase.co',
  SUPABASE_ANON_KEY: 'sb_publishable_sae2QWI1Woqk10V_odyi1Q_fmf9VKPF',

  /* 회사 정보 / 연락처 */
  COMPANY: '골드대리운전',
  PHONE: '1599-5779',
  KAKAO_URL: 'https://pf.kakao.com/_HnYrb/chat',          /* 카카오톡 채널 1:1 채팅 */
  BLOG_URL: 'https://m.blog.naver.com/driveu',            /* 네이버 블로그 */
  YOUTUBE_URL: 'https://youtube.com/@golddriving79',      /* 유튜브 채널 */

  /* 홈 화면 이미지 (www/img/home.jpg 를 같은 이름으로 바꿔 끼우면 됩니다) */
  HOME_IMAGE: 'img/home.jpg',

  /* 홈 화면 문구 */
  HOME_KICKER: '길 위의 파트너',
  HOME_TITLE: '골드\n대리운전',
  HOME_SUB: '여러분을 응원합니다',

  /* 추천하기(공유) - 스토어 등록 후에도 같은 주소(패키지명 기준)라 그대로 동작합니다 */
  STORE_URL: 'https://bkmobility.github.io/golddriver-members/',
  SHARE_TEXT: '[골드대리운전] 대리·탁송 기사 가입 신청\n보증금 0원 · 위약금 없음\n가입 신청: ',

  /* 앱 사용료 (1개당 월) 와 앱별 최대 선택 개수 - 서버 규칙(SQL)과 같아야 합니다 */
  APP_PRICE: 15000,
  APP_MAX: { logi: 3, callmaner: 2, aicon: 3 },

  /* 가입 가능 나이 (만) */
  AGE_MIN: 26,
  AGE_MAX: 71
};
