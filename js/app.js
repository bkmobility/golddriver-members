(function () {
  'use strict';
  var C = window.GD_CONFIG, LG = window.GD_LEGAL;
  var VERSION = '1.2.0';
  var DRAFT_KEY = 'gd_draft_v2';
  var $app = document.getElementById('app');
  var $toast = document.getElementById('toast');
  var $modal = document.getElementById('modal');
  var licBlob = null, licUrl = '';
  var busy = false;

  /* ---------- 아이콘 ---------- */
  var P = {
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>',
    bolt: '<path d="M13 2L3 14h9l-1 8 10-12h-9z"/>',
    gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v9h14v-9M12 8v13M12 8c-1.5-3.5-5-3.5-5-1.2 0 1.2 2 1.2 5 1.2zM12 8c1.5-3.5 5-3.5 5-1.2 0 1.2-2 1.2-5 1.2z"/>',
    chat: '<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.2A8.4 8.4 0 1 1 21 11.5z"/>',
    clip: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M9 14l2 2 4-4"/>',
    id: '<rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="11" r="2"/><path d="M5 16c.6-1.7 5.4-1.7 6 0M14 10h5M14 14h4"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    cam: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    route: '<circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="5" r="2.5"/><path d="M8.5 19H16a3.5 3.5 0 0 0 0-7H8a3.5 3.5 0 0 1 0-7h7.5"/>',
    headset: '<path d="M3 14v-2a9 9 0 0 1 18 0v2"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/>',
    img: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5L5 21"/>'
  };
  function ico(n, s, sw) {
    s = s || 18;
    return '<svg class="si" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (sw || 1.8) + '" stroke-linecap="round" stroke-linejoin="round">' + P[n] + '</svg>';
  }
  var APPDOT = { logi: '#2e7d4f', callmaner: '#F5B800', aicon: '#5b6178', tmap: '#16b6a8', kakao: '#FFD400', handle: '#2f6fe4', none: '#222222' };
  var APPNAME = { logi: '로지', callmaner: '콜마너', aicon: '아이콘', tmap: '티맵대리', kakao: '카카오T대리', handle: '핸들포유', none: '처음입니다' };

  /* ---------- 상태 ---------- */
  function fresh() {
    return {
      screen: 'home', hist: [],
      d: {
        work_type: '', work_mode: '', used_apps: [], name: '', birth: '', phone: '', region: '', device: '', carrier: '', phone_owner: '',
        insurance: '', signup_type: '', apps: { logi: 0, callmaner: 0, aicon: 0 }, question: '', call_time: '',
        referrer: '', refOpen: false, c: { privacy: false, terms: false, third: false, marketing: false },
        sub: null, licOk: false, kind: ''
      }
    };
  }
  var S = fresh();
  var FUNNEL = ['s1', 's2', 's3', 's4', 's5', 's6', 'A7', 'A8', 'A9', 'B7', 'B8', 'C7'];
  function save() {
    try {
      if (FUNNEL.indexOf(S.screen) >= 0) localStorage.setItem(DRAFT_KEY, JSON.stringify(S));
      else if (S.screen === 'home' || /done$/.test(S.screen)) localStorage.removeItem(DRAFT_KEY);
    } catch (e) {}
  }
  function loadDraft() {
    try { var t = localStorage.getItem(DRAFT_KEY); return t ? JSON.parse(t) : null; } catch (e) { return null; }
  }
  function clearDraft() { try { localStorage.removeItem(DRAFT_KEY); } catch (e) {} }

  /* ---------- 유틸 ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function nl(t) { return esc(t); }
  function toast(msg, ms) {
    $toast.textContent = msg; $toast.hidden = false;
    clearTimeout(toast.t); toast.t = setTimeout(function () { $toast.hidden = true; }, ms || 2400);
  }
  function openExternal(url) { window.location.href = url; }
  function versionLabel() { var p = VERSION.split('.'); return 'v ' + (p[2] === '0' ? p[0] + '.' + p[1] : VERSION); }
  function digits(s) { return String(s || '').replace(/[^0-9]/g, ''); }
  function fmtPhone(s) {
    var d = digits(s).slice(0, 11);
    if (d.length < 4) return d;
    if (d.length < 8) return d.slice(0, 3) + '-' + d.slice(3);
    return d.slice(0, 3) + '-' + d.slice(3, d.length - 4) + '-' + d.slice(d.length - 4);
  }
  function parseBirth(v) {
    var d = digits(v);
    if (d.length !== 6) return null;
    var yy = +d.slice(0, 2), mm = +d.slice(2, 4), dd = +d.slice(4, 6);
    var nowYY = new Date().getFullYear() % 100;
    var yyyy = yy <= nowYY ? 2000 + yy : 1900 + yy;
    var dt = new Date(yyyy, mm - 1, dd);
    if (dt.getFullYear() !== yyyy || dt.getMonth() !== mm - 1 || dt.getDate() !== dd) return null;
    var now = new Date(), age = now.getFullYear() - yyyy;
    if (now.getMonth() < mm - 1 || (now.getMonth() === mm - 1 && now.getDate() < dd)) age--;
    var iso = yyyy + '-' + ('0' + mm).slice(-2) + '-' + ('0' + dd).slice(-2);
    return { y: yyyy, m: mm, d: dd, age: age, iso: iso };
  }
  function deviceModel() {
    var m = /Android[^;]*;\s*([^;)]+?)(?:\sBuild|\)|;)/.exec(navigator.userAgent || '');
    return m ? m[1].trim() : '';
  }
  function won(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '원'; }
  function totalApps() { var a = S.d.apps; return a.logi + a.callmaner + a.aicon; }

  /* ---------- 서버 통신 ---------- */
  function configured() { return C.SUPABASE_URL.indexOf('YOUR_') < 0 && C.SUPABASE_ANON_KEY.indexOf('YOUR_') < 0; }
  function headers(extra) {
    var h = { apikey: C.SUPABASE_ANON_KEY };
    if (C.SUPABASE_ANON_KEY.indexOf('eyJ') === 0) h.Authorization = 'Bearer ' + C.SUPABASE_ANON_KEY;
    for (var k in extra) h[k] = extra[k];
    return h;
  }
  function timeoutFetch(url, opts, ms) {
    return new Promise(function (resolve, reject) {
      var ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
      var t = setTimeout(function () { if (ctl) ctl.abort(); reject(new Error('timeout')); }, ms || 25000);
      if (ctl) opts.signal = ctl.signal;
      fetch(url, opts).then(function (r) { clearTimeout(t); resolve(r); }, function (e) { clearTimeout(t); reject(e); });
    });
  }
  var ERR = {
    invalid_phone: '휴대폰 번호를 다시 확인해 주세요.', invalid_name: '이름을 다시 확인해 주세요.',
    invalid_birth: '생년월일을 다시 확인해 주세요.', age_not_allowed: '가입 가능한 나이가 아니에요. (만 ' + C.AGE_MIN + '~' + C.AGE_MAX + '세)',
    consent_required: '필수 약관에 동의해 주세요.', too_many: '짧은 시간에 너무 많이 신청했어요. 잠시 후 다시 시도해 주세요.',
    invalid_apps: '선택한 앱을 다시 확인해 주세요.', not_found: '이미 처리된 신청이에요. 상담원에게 문의해 주세요.', invalid_path: '파일 정보가 올바르지 않아요.'
  };
  function rpc(name, body) {
    if (!configured()) return Promise.reject(new Error('not_configured'));
    return timeoutFetch(C.SUPABASE_URL + '/rest/v1/rpc/' + name, {
      method: 'POST', headers: headers({ 'Content-Type': 'application/json' }), body: JSON.stringify(body)
    }).then(function (r) {
      return r.text().then(function (t) {
        var j = null; try { j = t ? JSON.parse(t) : null; } catch (e) {}
        if (!r.ok) { var msg = j && (j.message || j.error) || ('http_' + r.status); throw new Error(msg); }
        return j;
      });
    });
  }
  function uploadLicense(id, blob) {
    var path = id + '/' + Date.now() + '.jpg';
    return timeoutFetch(C.SUPABASE_URL + '/storage/v1/object/golddriver-licenses/' + path, {
      method: 'POST', headers: headers({ 'Content-Type': 'image/jpeg', 'x-upsert': 'false' }), body: blob
    }, 60000).then(function (r) {
      if (!r.ok) throw new Error('upload_' + r.status);
      return path;
    });
  }
  function errText(e) {
    var m = e && e.message || '';
    if (m === 'not_configured') return '서버 설정이 아직 되어 있지 않아요. (config.js)';
    if (ERR[m]) return ERR[m];
    if (m === 'timeout' || /Failed to fetch|NetworkError|Load failed/i.test(m)) return '인터넷 연결을 확인하고 다시 시도해 주세요.';
    return '잠시 후 다시 시도해 주세요. (' + m + ')';
  }

  /* ---------- 모달 ---------- */
  function modal(html, buttons) {
    $modal.innerHTML = '<div class="mbox">' + html + '<div class="mbtns">' + buttons.map(function (b, i) {
      return '<button class="' + (b.cls || 'cta') + '" data-mi="' + i + '" style="' + (i ? 'margin-top:.45rem' : '') + '">' + b.label + '</button>';
    }).join('') + '</div></div>';
    $modal.hidden = false;
    $$('[data-mi]', $modal).forEach(function (el) {
      el.addEventListener('click', function () { var b = buttons[+el.getAttribute('data-mi')]; closeModal(); if (b.fn) b.fn(); });
    });
  }
  function closeModal() { $modal.hidden = true; $modal.innerHTML = ''; }
  function legalModal(key) {
    var L = LG[key];
    modal('<h3>' + esc(L.title) + '</h3><div class="mb left">' + L.body.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') + '</div>', [{ label: '확인' }]);
  }

  /* ---------- 화면 공통 조각 ---------- */
  function wheel(c, s, w) {
    return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="' + c + '" stroke-width="' + (w || 2.3) + '" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.2"/><circle cx="12" cy="12" r="2.3" fill="' + c + '"/><path d="M3 10.6h6.8M14.2 10.6H21M12 14.4v6.6"/></svg>';
  }
  function brand() { return '<div class="br"><i>' + wheel('#fff', 14, 2.6) + '</i>' + esc(C.COMPANY) + '</div>'; }
  function head(back) { return '<div class="hd">' + (back === false ? '<div class="bk"></div>' : '<button class="bk" id="back" aria-label="뒤로">‹</button>') + brand() + '</div>'; }
  function wrap(inner, cls) { return '<div class="scr' + (cls ? ' ' + cls : '') + '">' + inner + '</div>'; }
  function totalSteps() { return S.d.signup_type === 'consult' ? 8 : 9; }
  function stepScr(n, t, inner, foot) {
    var p = Math.round(n / t * 100);
    return wrap(head() + '<div class="pg"><i style="width:' + p + '%"></i></div><div class="bd"><div class="st"><b>' + n + '</b> / ' + t + '</div>' + inner + '</div><div class="foot">' + foot + '</div>');
  }
  function hh(t, s) { return '<h2>' + esc(t) + '</h2>' + (s ? '<div class="sub">' + esc(s) + '</div>' : '<div class="gap"></div>'); }
  function cta(label, id, disabled, cls) { return '<button class="cta' + (cls ? ' ' + cls : '') + '" id="' + id + '"' + (disabled ? ' disabled' : '') + '>' + label + '</button>'; }
  function opt(t, d, on, attr, tag, tagN) {
    return '<button class="opt' + (on ? ' on' : '') + '" ' + attr + '><b>' + esc(t) + (tag ? '<i class="tag' + (tagN ? ' n' : '') + '">' + esc(tag) + '</i>' : '') + '</b>' + (d ? '<span class="d">' + d + '</span>' : '') + '</button>';
  }
  function note(t) { return '<div class="note">' + t + '</div>'; }

  /* ---------- 화면 ---------- */
  var SCREENS = {};

  function navBtn(id, icon, label) { return '<button id="' + id + '">' + ico(icon, 22, 1.9) + label + '</button>'; }
  SCREENS.home = function () {
    var NAVER = '<span class="ic" style="background:#03C75A"><svg width="20" height="20" viewBox="0 0 24 24"><path d="M5 4h4.6l4.8 7.4V4H19v16h-4.6L9.6 12.6V20H5z" fill="#fff"/></svg></span>';
    var YT = '<span class="ic" style="background:#FF0000"><svg width="20" height="20" viewBox="0 0 24 24"><path d="M9 6.5v11l9-5.5z" fill="#fff"/></svg></span>';
    var html = wrap(
      '<div class="hero"><img id="homeimg" alt="" src="' + esc(C.HOME_IMAGE) + '"><div class="top"><i>' + wheel('#fff', 18, 2.5) + '</i>' + esc(C.COMPANY) + '</div>' +
      '<div class="tx"><div class="kk">' + esc(C.HOME_KICKER) + '</div><h1>' + esc(C.HOME_TITLE) + '</h1><div class="cm">' + esc(C.HOME_SUB) + '</div></div></div>' +
      '<div class="dkf"><div class="lk"><button id="h-blog">' + NAVER + '블로그</button><button id="h-yt">' + YT + '유튜브</button></div>' +
      '<button class="cta grad" id="h-signup">기사 가입 신청</button></div>' +
      '<div class="nav">' + navBtn('n-kakao', 'chat', '카톡 상담') + navBtn('n-tel', 'phone', '전화 상담') + navBtn('n-share', 'share', '추천하기') + '</div>', 'dk');
    return { html: html, bind: function () {
      var im = $('#homeimg'); if (im) im.addEventListener('error', function () { im.style.display = 'none'; });
      on('#h-blog', function () { openExternal(C.BLOG_URL); });
      on('#h-yt', function () { openExternal(C.YOUTUBE_URL); });
      on('#h-signup', function () { go('landing'); });
      on('#n-kakao', function () { openExternal(C.KAKAO_URL); });
      on('#n-tel', function () { openExternal('tel:' + digits(C.PHONE)); });
      on('#n-share', shareApp);
    } };
  };
  function shareApp() {
    var text = C.SHARE_TEXT + C.STORE_URL;
    try {
      if (window.plugins && window.plugins.socialsharing) {
        window.plugins.socialsharing.shareWithOptions({ message: text, subject: C.COMPANY }, function () {}, function () { shareFallback(text); });
        return;
      }
    } catch (e) {}
    shareFallback(text);
  }
  function shareFallback(text) {
    if (navigator.share) { navigator.share({ text: text }).catch(function () {}); return; }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).then(function () { toast('추천 문구와 주소가 복사되었어요'); }, function () { openExternal('sms:?body=' + encodeURIComponent(text)); }); return; }
    } catch (e) {}
    openExternal('sms:?body=' + encodeURIComponent(text));
  }

  SCREENS.landing = function () {
    var rows = [['정보 입력', '업무 · 근무방식 · 기본정보'], ['보험 · 가입 방법 선택', '바로 가입 / 상담부터'], ['가입 완료', '기사 등록 · 보험 접수']].map(function (x) {
      return '<div class="opt plain"><b>' + x[0] + '</b><span class="d">' + x[1] + '</span></div>';
    }).join('');
    var html = wrap(head() + '<div class="bd" style="padding-top:30px"><div class="intro-ic">' + wheel('#fff', 38, 2.2) + '</div><h2 style="font-size:1.99rem">1분이면\n가입 신청 끝</h2><div class="sub">보증금 0원 · 위약금 없음</div><div style="margin-top:8px">' + rows + '</div></div><div class="foot">' + cta('가입 시작하기', 'next') + '</div>');
    return { html: html, bind: function () { on('#next', function () { go('s1'); }); on('#back', goBack); } };
  };

  function optionScreen(n, title, sub, key, opts, noteHtml, nextScreen) {
    var list = opts.map(function (o) { return opt(o.t, o.d, S.d[key] === o.v, 'data-v="' + o.v + '"'); }).join('');
    var html = stepScr(n, totalSteps(), hh(title, sub) + list + (noteHtml ? note(noteHtml) : ''), cta('다음', 'next', !S.d[key]));
    return { html: html, bind: function () {
      $$('[data-v]').forEach(function (b) { b.addEventListener('click', function () { S.d[key] = b.getAttribute('data-v'); if (key === 'work_mode') S.d.insurance = S.d.work_mode === 'part' ? 'geon' : 'month'; save(); render(); }); });
      on('#next', function () { go(nextScreen); }); on('#back', goBack);
    } };
  }
  SCREENS.s1 = function () {
    return optionScreen(1, '어떤 일을 하고 싶으세요?', '나중에 언제든 바꿀 수 있어요', 'work_type', [
      { v: 'daeri', t: '대리운전', d: '야간 중심' },
      { v: 'takso', t: '탁송', d: '주간 중심' },
      { v: 'both', t: '대리운전 + 탁송', d: '주간 · 야간 함께' }
    ], '', 's2');
  };
  SCREENS.s2 = function () {
    return optionScreen(2, '어떻게 일하실 계획인가요?', '알맞은 보험을 추천해 드려요', 'work_mode', [
      { v: 'part', t: '부업으로 가볍게', d: '대리 탁송 운행 30건 미만' },
      { v: 'full', t: '전업으로 본격적으로', d: '대리 탁송 운행 30건 이상' }
    ], '선택에 따라 보험을 추천해 드려요', 's3');
  };
  SCREENS.s3 = function () {
    var ids = ['logi', 'callmaner', 'aicon', 'tmap', 'kakao', 'handle', 'none'];
    var TX = { kakao: '#111' , callmaner: '#111' };
    var chips = ids.map(function (i) {
      return '<button class="pill' + (i === 'none' ? ' w' : '') + (S.d.used_apps.indexOf(i) >= 0 ? ' on' : '') + '" data-a="' + i + '" style="--c:' + APPDOT[i] + ';--t:' + (TX[i] || '#fff') + '">' + APPNAME[i] + (i === 'aicon' ? '<small>아이드라이버</small>' : '') + '</button>';
    }).join('');
    var html = stepScr(3, totalSteps(), hh('이용해 본 프로그램을 선택해 주세요', '여러 개 선택할 수 있어요') + '<div class="pills">' + chips + '</div><div class="infob">지금 선택하는 부분은 프로그램 이용해 본 경험이 있는지 확인 하는 부분입니다</div>' + note('써보신 앱을 알면 상담이 더 정확해져요'), cta('다음', 'next'));
    return { html: html, bind: function () {
      $$('[data-a]').forEach(function (b) { b.addEventListener('click', function () {
        var a = b.getAttribute('data-a'), u = S.d.used_apps, i = u.indexOf(a);
        if (a === 'none') { S.d.used_apps = i >= 0 ? [] : ['none']; }
        else { if (i >= 0) u.splice(i, 1); else u.push(a); var k = u.indexOf('none'); if (k >= 0) u.splice(k, 1); }
        save(); render();
      }); });
      on('#next', function () { go('s4'); }); on('#back', goBack);
    } };
  };

  SCREENS.s4 = function () {
    if (!S.d.device) S.d.device = deviceModel();
    var regs = ['수도권', '충청권', '호남권', '경상권', '강원권', '제주권'];
    var d = S.d;
    var html = stepScr(4, totalSteps(), hh('기본 정보를 알려주세요') +
      '<div class="fl"><label>이름</label><input class="fi" id="name" type="text" maxlength="30" placeholder="이름을 입력해주세요" value="' + esc(d.name) + '" autocomplete="name"></div>' +
      '<div class="fl"><label>생년월일 (6자리) · 만 ' + C.AGE_MIN + '~' + C.AGE_MAX + '세 가입 가능</label><input class="fi" id="birth" type="tel" inputmode="numeric" maxlength="6" placeholder="예: 900315" value="' + esc(d.birth) + '"><div id="birthmsg"></div></div>' +
      '<div class="fl"><label>휴대폰 번호</label><input class="fi" id="phone" type="tel" inputmode="numeric" maxlength="13" placeholder="010-0000-0000" value="' + esc(d.phone) + '"><div id="phonemsg"></div></div>' +
      '<div class="fl"><label>사용하는 통신사 선택</label><div class="cbs g3">' + [['SKT', 'SK'], ['KT', 'KT'], ['LGU', 'U+'], ['SKT_MVNO', 'SK알뜰폰'], ['KT_MVNO', 'KT알뜰폰'], ['LGU_MVNO', 'U+알뜰폰']].map(function (c) { return '<button class="cb' + (d.carrier === c[0] ? ' on' : '') + '" data-cr="' + c[0] + '"><i>✓</i>' + c[1] + '</button>'; }).join('') + '</div></div>' +
      '<div class="fl"><label>휴대폰 명의 선택</label><div class="cbs">' + [['self', '본인 명의'], ['other', '타인 명의']].map(function (c) { return '<button class="cb' + (d.phone_owner === c[0] ? ' on' : '') + '" data-ow="' + c[0] + '"><i>✓</i>' + c[1] + '</button>'; }).join('') + '</div></div>' +
      '<div class="fl"><label>거주 지역</label><div class="chips g3" style="margin-top:6px">' + regs.map(function (r) { return '<button class="chip' + (d.region === r ? ' on' : '') + '" data-r="' + r + '">' + r + '</button>'; }).join('') + '</div></div>',
      cta('다음', 'next', true));
    return { html: html, bind: function () {
      function check() {
        var b = parseBirth($('#birth').value), okName = $('#name').value.trim().length > 0, ph = digits($('#phone').value);
        var bm = $('#birthmsg'), pm = $('#phonemsg'), okB = false, okP = /^01[016789]\d{7,8}$/.test(ph);
        if ($('#birth').value.length === 0) bm.innerHTML = '';
        else if (!b) bm.innerHTML = '<div class="ms bad">생년월일 6자리를 확인해 주세요</div>';
        else if (b.age < C.AGE_MIN || b.age > C.AGE_MAX) bm.innerHTML = '<div class="ms bad">' + b.y + '년 ' + b.m + '월 ' + b.d + '일 (만 ' + b.age + '세) · 가입이 어려워요</div>';
        else { okB = true; bm.innerHTML = '<div class="ms">' + b.y + '년 ' + b.m + '월 ' + b.d + '일 · 만 ' + b.age + '세 가입 가능</div>'; }
        if (!ph) pm.innerHTML = ''; else if (okP) pm.innerHTML = '<div class="ms">확인되었어요</div>'; else pm.innerHTML = '<div class="ms bad">휴대폰 번호를 확인해 주세요</div>';
        $('#birth').classList.toggle('ok', okB); $('#phone').classList.toggle('ok', okP); $('#name').classList.toggle('ok', okName);
        $('#next').disabled = !(okName && okB && okP && S.d.region && S.d.carrier && S.d.phone_owner);
      }
      $('#name').addEventListener('input', function () { S.d.name = this.value; save(); check(); });
      $('#birth').addEventListener('input', function () { this.value = digits(this.value).slice(0, 6); S.d.birth = this.value; save(); check(); });
      $('#phone').addEventListener('input', function () { this.value = fmtPhone(this.value); S.d.phone = this.value; save(); check(); });
      $$('[data-r]').forEach(function (b) { b.addEventListener('click', function () { S.d.region = b.getAttribute('data-r'); $$('[data-r]').forEach(function (x) { x.classList.toggle('on', x === b); }); save(); check(); }); });
      $$('[data-cr]').forEach(function (b) { b.addEventListener('click', function () { S.d.carrier = b.getAttribute('data-cr'); $$('[data-cr]').forEach(function (x) { x.classList.toggle('on', x === b); }); save(); check(); }); });
      $$('[data-ow]').forEach(function (b) { b.addEventListener('click', function () { S.d.phone_owner = b.getAttribute('data-ow'); $$('[data-ow]').forEach(function (x) { x.classList.toggle('on', x === b); }); save(); check(); }); });
      on('#next', function () { go('s5'); }); on('#back', goBack);
      check();
    } };
  };

  SCREENS.s5 = function () {
    var d = S.d, part = d.work_mode === 'part';
    var rec = part ? 'geon' : 'month';
    if (!d.insurance) d.insurance = rec;
    var sub = '월보험 가입시 특약 보장이 포함된 보험 가입을 권장 드립니다';
    var geon = d.insurance === 'geon';
    var tl = geon ? '부업이시라면 건당보험이 딱 맞아요' : '전업이시라면 월보험이 딱 맞아요';
    var rd = geon ? '건당 보험 가입시 하루 관리비가 1,000원이 부과됩니다' : '월보험 가입시 나이에 따라 보험료가 다르며, 가입 진행 과정에서 안내해 드립니다';
    function card(k, t, lis) {
      return '<div class="opt' + (d.insurance === k ? ' on' : '') + '" data-i="' + k + '">' + (rec === k ? '<span class="rec">AI 추천</span>' : '') + '<b>' + t + '</b><ul>' + lis.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul></div>';
    }
    var html = stepScr(5, totalSteps(), hh('보험을 선택해 주세요', sub) + '<div class="ins">' +
      card('geon', '건당보험', ['운행한 날만', '부업 · 가끔 운행', '부담 없이 시작']) + card('month', '월보험', ['월 정액', '전업 · 매일 운행', '많이 탈수록 유리']) + '</div>' +
      '<div class="sum"><span>선택한 보험</span><b>' + (d.insurance === 'geon' ? '건당보험' : '월보험') + '</b></div><div class="tagl">' + tl + '</div><div class="red">' + rd + '</div>' + note('보험은 가입 후에도 변경할 수 있어요'), cta('다음', 'next'));
    return { html: html, bind: function () {
      $$('[data-i]').forEach(function (b) { b.addEventListener('click', function () { S.d.insurance = b.getAttribute('data-i'); save(); render(); }); });
      on('#next', function () { go('s6'); }); on('#back', goBack);
    } };
  };

  SCREENS.s6 = function () {
    var d = S.d;
    var html = stepScr(6, totalSteps(), hh('가입 방법을 선택해주세요') +
      opt('상담 없이 바로 가입', '운전면허증만 올리면 바로 진행', d.signup_type === 'direct', 'data-s="direct"', '경력자') +
      opt('상담부터 받을래요', '전화로 안내받고 결정해요', d.signup_type === 'consult', 'data-s="consult"', '처음이라면', true) +
      note('신청만으로 가입이 확정되지 않아요'), cta('다음', 'next', !d.signup_type));
    return { html: html, bind: function () {
      $$('[data-s]').forEach(function (b) { b.addEventListener('click', function () { S.d.signup_type = b.getAttribute('data-s'); save(); render(); }); });
      on('#next', function () { go(S.d.signup_type === 'consult' ? 'B7' : 'A7'); }); on('#back', goBack);
    } };
  };

  SCREENS.A7 = function () {
    var d = S.d, names = [['logi', '로지'], ['callmaner', '콜마너'], ['aicon', '아이콘']];
    var rows = names.map(function (n) {
      var c = d.apps[n[0]], mx = C.APP_MAX[n[0]];
      return '<div class="stp' + (c ? ' on' : '') + '"><div><b>' + n[1] + '</b><span>최대 ' + mx + '개</span></div><div class="ct"><button data-m="' + n[0] + '"' + (c ? '' : ' disabled') + '>−</button><em>' + c + '</em><button class="p" data-p="' + n[0] + '"' + (c >= mx ? ' disabled' : '') + '>+</button></div></div>';
    }).join('');
    var tot = totalApps();
    var html = stepScr(7, 9, hh('이용할 앱을 선택해주세요', '앱 1개당 월 ' + won(C.APP_PRICE) + ' (앱사 납부)') + rows +
      '<div class="sum"><span>앱 사용료 합계</span><b>월 ' + won(tot * C.APP_PRICE) + '</b></div>' +
      '<div class="fl" style="margin-top:16px"><label>궁금한 점 (선택)</label><textarea class="fi" id="q" maxlength="500" placeholder="예: 건당보험 보험료가 궁금해요">' + esc(d.question) + '</textarea></div>', cta('다음', 'next', tot < 1));
    return { html: html, bind: function () {
      $$('[data-p]').forEach(function (b) { b.addEventListener('click', function () { var k = b.getAttribute('data-p'); if (S.d.apps[k] < C.APP_MAX[k]) S.d.apps[k]++; save(); render(); }); });
      $$('[data-m]').forEach(function (b) { b.addEventListener('click', function () { var k = b.getAttribute('data-m'); if (S.d.apps[k] > 0) S.d.apps[k]--; save(); render(); }); });
      $('#q').addEventListener('input', function () { S.d.question = this.value; save(); });
      on('#next', function () { go('A8'); }); on('#back', goBack);
    } };
  };

  function consentScreen(n, t, label) {
    var c = S.d.c, all = c.privacy && c.terms && c.third && c.marketing;
    function row(k, txt) { return '<button class="ck' + (c[k] ? ' on' : '') + '" data-c="' + k + '"><i>✓</i>' + txt + '<u data-l="' + k + '">보기</u></button>'; }
    var inner = hh('약관을 확인해 주세요') +
      '<button class="ck all' + (all ? ' on' : '') + '" data-c="all"><i>✓</i>전체 동의</button>' +
      row('privacy', '[필수] 개인정보 수집·이용') + row('terms', '[필수] 서비스 이용약관') + row('third', '[선택] 제3자 정보 제공') + row('marketing', '[선택] 마케팅 정보 수신') +
      '<button class="lnk" id="refbtn">' + (S.d.refOpen ? '지인 추천 입력 닫기' : '지인 추천이 있으신가요?') + '</button>' +
      (S.d.refOpen ? '<div class="fl"><input class="fi" id="ref" type="text" maxlength="60" placeholder="추천해 주신 분 이름 또는 연락처" value="' + esc(S.d.referrer) + '"></div>' : '');
    return stepScr(n, t, inner, cta(label, 'next', !(c.privacy && c.terms)));
  }
  function bindConsent(onNext) {
    $$('[data-c]').forEach(function (b) { b.addEventListener('click', function (ev) {
      if (ev.target.getAttribute && ev.target.getAttribute('data-l')) { legalModal(ev.target.getAttribute('data-l')); return; }
      var k = b.getAttribute('data-c'), c = S.d.c;
      if (k === 'all') { var v = !(c.privacy && c.terms && c.third && c.marketing); c.privacy = c.terms = c.third = c.marketing = v; } else c[k] = !c[k];
      save(); render();
    }); });
    on('#refbtn', function () { S.d.refOpen = !S.d.refOpen; save(); render(); });
    var r = $('#ref'); if (r) r.addEventListener('input', function () { S.d.referrer = this.value; });
    on('#next', onNext); on('#back', goBack);
  }
  SCREENS.A8 = function () {
    return { html: consentScreen(8, 9, '동의하고 계속'), bind: function () { bindConsent(function () { doSubmit('direct'); }); } };
  };

  var SLOTS = [['오전 11시 ~ 12시', '11:00~12:00'], ['낮 12시 ~ 1시', '12:00~13:00'], ['오후 2시 ~ 3시', '14:00~15:00'], ['오후 3시 ~ 4시', '15:00~16:00'], ['오후 4시 ~ 5시', '16:00~17:00'], ['오후 5시 ~ 6시', '17:00~18:00']];
  function slotsScreen(n, t, label, onNext) {
    var d = S.d;
    var inner = hh('언제 전화드릴까요?', '선택하신 시간에 전화드려요') +
      '<div class="slots">' + SLOTS.map(function (s) { return '<button class="opt nochk' + (d.call_time === s[1] ? ' on' : '') + '" data-t="' + s[1] + '"><b>' + s[0] + '</b></button>'; }).join('') + '</div>' +
      '<div class="fl" style="margin-top:14px"><label>궁금한 점 (선택)</label><textarea class="fi" id="q" maxlength="500" placeholder="예: 건당보험 보험료는 얼마인가요?">' + esc(d.question) + '</textarea></div>';
    var html = n ? stepScr(n, t, inner, cta(label, 'next', !d.call_time)) :
      wrap(head() + '<div class="bd">' + inner + '</div><div class="foot">' + cta(label, 'next', !d.call_time) + '</div>');
    return { html: html, bind: function () {
      $$('[data-t]').forEach(function (b) { b.addEventListener('click', function () { S.d.call_time = b.getAttribute('data-t'); save(); render(); }); });
      $('#q').addEventListener('input', function () { S.d.question = this.value; save(); });
      on('#next', onNext); on('#back', goBack);
    } };
  }
  SCREENS.B7 = function () { return slotsScreen(7, 8, '다음', function () { go('B8'); }); };
  SCREENS.B8 = function () {
    return { html: consentScreen(8, 8, '상담 신청 완료하기'), bind: function () { bindConsent(function () { doSubmit('consult'); }); } };
  };
  /* A9 에서 상담으로 바꾸기 */
  SCREENS.C7 = function () { return slotsScreen(0, 0, '상담 신청하기', doSwitch); };

  SCREENS.A9 = function () {
    var d = S.d, tot = totalApps();
    var licOn = !!licBlob || d.licOk;
    var box = licUrl ? '<img id="licimg" alt="" src="' + licUrl + '">' : (d.licOk ? ico('check', 34, 1.8) + '운전면허증이 제출되었어요' : ico('cam', 34, 1.5) + '운전면허증 사진을 올려주세요');
    var html = stepScr(9, 9, hh('운전면허증을 올려주세요', '전체가 보이게 · 글자가 또렷하게 · 빛 반사 없이') +
      '<div class="up' + (licUrl ? ' has' : '') + '">' + box + '</div>' +
      '<div class="two"><button class="pri" id="cam">' + (licOn ? '다시 촬영' : '촬영하기') + '</button><button class="sec" id="gal">앨범에서 선택</button></div>' +
      '<input type="file" id="f-cam" accept="image/*" capture="environment" hidden><input type="file" id="f-gal" accept="image/*" hidden>' +
      '<div class="sum" style="margin-top:16px"><span>첫 달 예상 금액</span><b>' + won(tot * C.APP_PRICE) + '</b></div><div class="red">건당 보험 및 월보험 가입 여부에 따라 금액은 변경됩니다</div>' +
      '<div class="ms hint" style="margin-top:8px">이용 앱 ' + esc(appSummary()) + ' · 결제 및 최종 금액은 문자 또는 전화로 안내해 드려요</div>' +
      '<button class="lnk" id="tochat">상담부터 받고 싶어요</button>',
      cta('첫 달 결제 안내 받기', 'pay', !licOn) + '<button class="ghost" id="later">운전면허증은 나중에 넣을게요</button>');
    return { html: html, bind: function () {
      function pick(f) {
        var file = f.files && f.files[0]; if (!file) return;
        compress(file).then(function (b) {
          licBlob = b; if (licUrl) URL.revokeObjectURL(licUrl); licUrl = URL.createObjectURL(b); render();
        }, function () { toast('사진을 불러오지 못했어요. 다시 시도해 주세요.'); });
        f.value = '';
      }
      on('#cam', function () { $('#f-cam').click(); }); on('#gal', function () { $('#f-gal').click(); });
      $('#f-cam').addEventListener('change', function () { pick(this); }); $('#f-gal').addEventListener('change', function () { pick(this); });
      on('#tochat', function () { go('C7'); });
      on('#pay', function () { finishA9(true); });
      on('#later', function () { finishA9(false); });
      on('#back', goBack);
    } };
  };
  function appSummary() {
    var a = S.d.apps, o = [];
    if (a.logi) o.push('로지 ' + a.logi); if (a.callmaner) o.push('콜마너 ' + a.callmaner); if (a.aicon) o.push('아이콘 ' + a.aicon);
    return o.join(' · ') || '-';
  }

  function doneScreen(kind) {
    var d = S.d, sub = d.sub || {};
    var cfg = {
      pay: ['신청이 완료됐어요', '운전면허증 확인 후 결제 안내 문자를 보내드려요', [['상담원 연락', '입력하신 내용을 확인해요'], ['운전면허증 확인 · 결제 안내', '문자 또는 전화로 안내해 드려요'], ['기사 등록 · 보험 접수', '가입 완료']]],
      later: ['신청이 접수됐어요', '운전면허증 제출 방법은 문자 또는 전화로 안내해 드려요', [['상담원 연락', '입력하신 내용을 확인해요'], ['운전면허증 제출 · 결제 안내', '문자 또는 전화로 안내해 드려요'], ['기사 등록 · 보험 접수', '가입 완료']]],
      consult: ['상담 신청이 완료됐어요', (d.call_time ? slotLabel(d.call_time) + '에<br>' : '') + '상담원이 전화드립니다', [['상담원 전화', '맞춤 보험료를 안내해요'], ['가입 결정 · 운전면허증 제출', '충분히 들어보고 결정하세요'], ['가입 완료', '기사 등록 · 보험 접수']]]
    }[kind] || ['', '', []];
    var rows = [['접수번호', sub.receipt_no || '-'], ['가입 방법', kind === 'consult' ? '상담부터 받기' : '바로 가입'], ['보험', d.insurance === 'geon' ? '건당보험' : '월보험']];
    if (kind === 'consult') rows[1] = ['통화 희망', slotLabel(d.call_time)];
    var CHECK = '<svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#181818" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
    var html = wrap(head(false) + '<div class="bd" style="padding-top:14px"><div class="ring">' + CHECK + '</div><h2>' + cfg[0] + '</h2><div class="sub" style="margin-bottom:0">' + cfg[1] + '</div>' +
      '<div class="rcp">' + rows.map(function (r) { return '<div><span>' + r[0] + '</span><b>' + esc(r[1]) + '</b></div>'; }).join('') + '</div>' +
      '<div class="tl">' + cfg[2].map(function (t) { return '<div>' + t[0] + '<small>' + t[1] + '</small></div>'; }).join('') + '</div></div>' +
      '<div class="foot">' + cta('카카오톡으로 접수 확인받기', 'kk', false, 'gold') + cta('홈으로', 'home') + '</div>');
    return { html: html, bind: function () { on('#kk', function () { openExternal(C.KAKAO_URL); }); on('#home', toHome); } };
  }
  function slotLabel(v) { for (var i = 0; i < SLOTS.length; i++) if (SLOTS[i][1] === v) return SLOTS[i][0]; return v || ''; }
  SCREENS.Pdone = function () { return doneScreen('pay'); };
  SCREENS.Ldone = function () { return doneScreen('later'); };
  SCREENS.Cdone = function () { return doneScreen('consult'); };

  /* ---------- 동작 ---------- */
  function on(sel, fn) { var el = $(sel); if (el) el.addEventListener('click', fn); }
  function go(name, replace) {
    if (!replace) S.hist.push(S.screen);
    S.screen = name; save(); render();
  }
  function goBack() {
    if (S.screen === 'A9') { exitConfirm('신청은 접수되었어요. 홈으로 돌아갈까요?', toHome); return; }
    var p = S.hist.pop();
    if (p) { S.screen = p; save(); render(); } else { /* 웹: 홈에서는 브라우저 이동에 맡김 */ }
  }
  function exitApp() { if (navigator.app && navigator.app.exitApp) navigator.app.exitApp(); }
  function exitConfirm(msg, fn) { modal('<h3>' + esc(msg) + '</h3>', [{ label: '취소', cls: 'cta sec', fn: null }, { label: '확인', fn: fn }]); }
  function toHome() { S = fresh(); licBlob = null; licUrl = ''; clearDraft(); render(); }

  function render() {
    var sc = SCREENS[S.screen] ? S.screen : 'home';
    var v = SCREENS[sc]();
    $app.innerHTML = v.html;
    v.bind();
    var dk = sc === 'home'; document.documentElement.className = dk ? 'dk' : ''; document.body.className = dk ? 'dk' : '';
    var b = $('.bd'); if (b) b.scrollTop = 0;
  }

  function setBusy(btn, label) { busy = true; if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spin"></span>' + label; } }
  function payload(type) {
    var d = S.d, b = parseBirth(d.birth), sel = {};
    ['logi', 'callmaner', 'aicon'].forEach(function (k) { if (d.apps[k] > 0) sel[k] = d.apps[k]; });
    return {
      name: d.name.trim(), birth_date: b.iso, phone: digits(d.phone), device_model: d.device, carrier: d.carrier, phone_owner: d.phone_owner, region: d.region,
      work_type: d.work_type, work_mode: d.work_mode, used_apps: d.used_apps.filter(function (x) { return x !== 'none'; }),
      insurance: d.insurance, signup_type: type, selected_apps: type === 'direct' ? sel : {},
      question: d.question.trim(), call_time: type === 'consult' ? d.call_time : '', referrer: d.referrer.trim(),
      consent_privacy: d.c.privacy, consent_terms: d.c.terms, consent_third: d.c.third, consent_marketing: d.c.marketing
    };
  }
  function doSubmit(type) {
    if (busy) return;
    var btn = $('#next'); var label = btn.textContent;
    setBusy(btn, '접수 중...');
    rpc('golddriver_submit_application', { p: payload(type) }).then(function (res) {
      busy = false; S.d.sub = res; S.hist = ['home'];
      if (type === 'direct') { go('A9', true); } else { S.d.kind = 'consult'; go('Cdone', true); }
    }, function (e) { busy = false; btn.disabled = false; btn.textContent = label; modal('<h3>신청하지 못했어요</h3><div class="mb">' + esc(errText(e)) + '</div>', [{ label: '확인' }]); });
  }
  function doSwitch() {
    if (busy) return;
    var btn = $('#next'); var label = btn.textContent;
    setBusy(btn, '접수 중...');
    var s = S.d.sub;
    rpc('golddriver_switch_to_consult', { p_id: s.id, p_token: s.token, p_call_time: S.d.call_time, p_question: S.d.question.trim() || null }).then(function () {
      busy = false; S.hist = ['home']; go('Cdone', true);
    }, function (e) { busy = false; btn.disabled = false; btn.textContent = label; modal('<h3>신청하지 못했어요</h3><div class="mb">' + esc(errText(e)) + '</div>', [{ label: '확인' }]); });
  }
  function finishA9(withPay) {
    if (busy) return;
    var s = S.d.sub, btn = withPay ? $('#pay') : $('#later'), label = btn.textContent;
    if (withPay && !licBlob && !S.d.licOk) return;
    setBusy(btn, '처리 중...');
    var chain = Promise.resolve();
    if (licBlob) chain = chain.then(function () { return uploadLicense(s.id, licBlob); }).then(function (path) { return rpc('golddriver_attach_license', { p_id: s.id, p_token: s.token, p_path: path }); }).then(function () { S.d.licOk = true; licBlob = null; });
    if (withPay) chain = chain.then(function () { return rpc('golddriver_request_payment', { p_id: s.id, p_token: s.token }).catch(function (e) { if (String(e.message) !== 'not_found') throw e; }); });
    chain.then(function () { busy = false; S.hist = ['home']; go(withPay ? 'Pdone' : 'Ldone', true); },
      function (e) { busy = false; btn.disabled = false; btn.textContent = label; modal('<h3>처리하지 못했어요</h3><div class="mb">' + esc(errText(e)) + '</div>', [{ label: '확인' }]); });
  }
  function compress(file) {
    return new Promise(function (res, rej) {
      var img = new Image(), url = URL.createObjectURL(file);
      img.onload = function () {
        var max = 1800, w = img.naturalWidth, h = img.naturalHeight, k = Math.min(1, max / Math.max(w, h));
        var cv = document.createElement('canvas'); cv.width = Math.round(w * k); cv.height = Math.round(h * k);
        cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
        cv.toBlob(function (b) { URL.revokeObjectURL(url); b ? res(b) : rej(new Error('compress')); }, 'image/jpeg', 0.82);
      };
      img.onerror = function () { URL.revokeObjectURL(url); rej(new Error('img')); };
      img.src = url;
    });
  }

  /* ---------- 시작 ---------- */
  function onBack(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (!$modal.hidden) { closeModal(); return; }
    goBack();
  }
  function start() {
    try {
      history.replaceState({ gd: 0 }, '');
      history.pushState({ gd: 1 }, '');
      window.addEventListener('popstate', function () {
        var atHome = S.screen === 'home' && !S.hist.length && $modal.hidden;
        if (atHome) { history.back(); return; }
        history.pushState({ gd: 1 }, '');
        onBack();
      });
    } catch (e) {}
    var d = loadDraft();
    render();
    if (d && d.screen && FUNNEL.indexOf(d.screen) >= 0 && d.d) {
      var stepTxt = { s1: '1단계', s2: '2단계', s3: '3단계', s4: '4단계', s5: '5단계', s6: '6단계', A7: '7단계', A8: '8단계', A9: '마지막 단계', B7: '7단계', B8: '8단계', C7: '상담 신청' }[d.screen] || '';
      modal('<h3>작성하던 신청이 있어요</h3><div class="mb">' + stepTxt + '까지 입력하셨어요.<br>이어서 작성하시겠어요?</div>', [
        { label: '이어서 작성하기', fn: function () { S = d; render(); } },
        { label: '처음부터 다시 하기', cls: 'cta sec', fn: function () { clearDraft(); } }
      ]);
    }
  }
  if (window.cordova) document.addEventListener('deviceready', start, false); else window.addEventListener('DOMContentLoaded', start);
})();
