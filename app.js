/* ==========================================================================
   MASARU BLACKLIST — โค้ดกลางที่ทุกหน้าใช้ร่วมกัน
   ต้องโหลดหลัง supabase-js และหลัง config.js
   ========================================================================== */
(function () {
  const C = window.BL_CONFIG || {};

  var badUrl = !C.SUPABASE_URL || C.SUPABASE_URL.indexOf('XXXXXX') >= 0;
  var badKey = !C.SUPABASE_ANON_KEY || C.SUPABASE_ANON_KEY.indexOf('PASTE_') >= 0 ||
               C.SUPABASE_ANON_KEY.length < 20;

  if (badUrl || badKey) {
    document.addEventListener('DOMContentLoaded', function () {
      var seenUrl = C.SUPABASE_URL || '(ไม่พบ — config.js ไม่ได้ถูกโหลด)';
      var seenKey = C.SUPABASE_ANON_KEY
        ? C.SUPABASE_ANON_KEY.slice(0, 22) + '…'
        : '(ไม่พบ — config.js ไม่ได้ถูกโหลด)';
      document.body.innerHTML =
        '<div style="max-width:660px;margin:70px auto;font-family:Sarabun,sans-serif;' +
        'background:#fff;border:2px solid #D0212B;border-radius:14px;padding:26px 28px">' +
        '<h2 style="color:#D0212B;margin:0 0 10px">ยังไม่ได้ตั้งค่า</h2>' +
        '<p style="color:#334;margin:0 0 14px">เบราว์เซอร์กำลังอ่านค่าจาก <b>config.js</b> ได้แบบนี้:</p>' +
        '<div style="background:#F4F6FA;border-radius:9px;padding:12px 14px;font-size:13px;' +
        'font-family:monospace;word-break:break-all;line-height:1.8">' +
        'SUPABASE_URL = ' + seenUrl + '<br>SUPABASE_ANON_KEY = ' + seenKey + '</div>' +
        '<p style="color:#334;margin:16px 0 6px"><b>ถ้าค่าข้างบนยังเป็นของเก่า</b> = เบราว์เซอร์ใช้ไฟล์ที่แคชไว้</p>' +
        '<ol style="color:#334;line-height:1.85;margin:0;padding-left:20px">' +
        '<li>กด <b>Ctrl+Shift+R</b> (Mac: <b>Cmd+Shift+R</b>) เพื่อล้างแคช</li>' +
        '<li>ถ้ายังไม่หาย เปิด <code>config.js</code> บน GitHub ดูว่าไฟล์ที่อัปขึ้นไปมี key จริงหรือยัง</li>' +
        '<li>GitHub Pages ใช้เวลา deploy ~1–2 นาทีหลังอัปไฟล์</li></ol></div>';
    });
    return;
  }

  const sb = window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_ANON_KEY);

  /* ---------- เบอร์โทร ---------- */
  // คืนค่าเบอร์มาตรฐาน 0XXXXXXXXX  หรือ '' ถ้าใช้ไม่ได้
  function normPhone(v) {
    if (v === null || v === undefined) return '';
    let s = String(v).trim();
    // Excel อ่านเบอร์เป็นตัวเลข/exponential
    if (/^\d+(\.\d+)?e\+?\d+$/i.test(s)) s = Number(s).toFixed(0);
    s = s.replace(/[^\d]/g, '');
    if (!s) return '';
    if (s.startsWith('0066')) s = s.slice(4);          // 0066 81... → 81...
    else if (s.startsWith('66') && s.length >= 11) s = s.slice(2); // +66 81... → 81...
    s = s.replace(/^0+/, '');                          // ตัดศูนย์นำหน้าทั้งหมด
    // เบอร์ไทยเมื่อตัด 0 ออก = 9 หลัก (มือถือ) หรือ 8 หลัก (เบอร์บ้าน)
    if (s.length !== 9 && s.length !== 8) return '';
    return '0' + s;
  }
  function isAnonPhone(p) { return /^ANON-[A-Z]+-[^-]+-[0-9a-f]+$/i.test(String(p || '')); }
  function fmtPhone(p) {
    if (!p) return '-';
    if (isAnonPhone(p)) {
      const m = String(p).match(/^ANON-[^-]+-([^-]+)-/i);
      return 'ปิดบัง ••' + (m ? m[1] : '');
    }
    p = String(p);
    if (p.length === 10) return p.slice(0, 3) + '-' + p.slice(3, 6) + '-' + p.slice(6);
    if (p.length === 9) return p.slice(0, 2) + '-' + p.slice(2, 5) + '-' + p.slice(5);
    return p;
  }

  /* ---------- วันที่ ---------- */
  // รับได้ทั้ง Date, serial number ของ Excel, '2026-09-16', '16/09/2026', '16/09/2569'
  function toDate(v) {
    if (v === null || v === undefined || v === '') return null;
    if (v instanceof Date && !isNaN(v)) return ymd(v);
    if (typeof v === 'number' && v > 20000 && v < 60000) {
      const d = new Date(Math.round((v - 25569) * 86400 * 1000));
      return ymd(d);
    }
    let s = String(v).trim();
    let m = s.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
    if (m) return fixBE(+m[1], +m[2], +m[3]);
    m = s.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
    if (m) return fixBE(+m[3], +m[2], +m[1]);
    const d = new Date(s);
    return isNaN(d) ? null : ymd(d);
  }
  function fixBE(y, mo, d) {
    if (y > 2400) y -= 543;
    return [y, String(mo).padStart(2, '0'), String(d).padStart(2, '0')].join('-');
  }
  function ymd(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') +
           '-' + String(d.getDate()).padStart(2, '0');
  }
  function thDate(s) {
    if (!s) return '-';
    const p = String(s).slice(0, 10).split('-');
    if (p.length !== 3) return s;
    return p[2] + '/' + p[1] + '/' + (+p[0] + 543);
  }
  function num(v) {
    if (v === null || v === undefined || v === '') return null;
    const n = parseFloat(String(v).replace(/[^\d.\-]/g, ''));
    return isNaN(n) ? null : n;
  }

  /* ---------- อ่านข้อมูลเกิน 1000 แถว ---------- */
  async function pageAll(build, size) {
    size = size || 1000;
    let from = 0, out = [];
    for (;;) {
      const { data, error } = await build().range(from, from + size - 1);
      if (error) throw error;
      out = out.concat(data || []);
      if (!data || data.length < size) break;
      from += size;
    }
    return out;
  }

  /* ---------- ระดับความเสี่ยง ---------- */
  const RISK = {
    allow: { t: 'ยกเว้นให้ผ่าน', c: '#2563eb', bg: '#dbeafe', i: '✓' },
    ok:    { t: 'ปกติ',          c: '#16a34a', bg: '#dcfce7', i: '✓' },
    watch: { t: 'เฝ้าระวัง',      c: '#b45309', bg: '#fef3c7', i: '!' },
    high:  { t: 'เสี่ยงสูง',       c: '#c2410c', bg: '#ffedd5', i: '!!' },
    block: { t: 'บล็อก',          c: '#b91c1c', bg: '#fee2e2', i: '✕' }
  };
  function riskBadge(lv) {
    const r = RISK[lv] || RISK.ok;
    return '<span class="badge" style="color:' + r.c + ';background:' + r.bg + '">' +
           r.i + ' ' + r.t + '</span>';
  }

  /* ---------- UI helpers ---------- */
  let toastEl = null;
  function toast(msg, type) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.id = 'bl-toast';
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.className = 'show ' + (type || 'ok');
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(function () { toastEl.className = ''; }, 3200);
  }
  function esc(s) {
    return String(s === null || s === undefined ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ---------- Auth + Role ---------- */
  let ME = null, ROLE = 'staff', STATUS = 'active', PROFILE = null;

  const ROLE_TH = { admin: 'ผู้ดูแลระบบ', staff: 'พนักงาน' };

  function blockScreen(title, msg) {
    document.body.innerHTML =
      '<div style="max-width:520px;margin:90px auto;font-family:Sarabun,sans-serif;text-align:center;' +
      'background:#fff;border:1px solid #E3E8F0;border-radius:16px;padding:34px 28px;' +
      'box-shadow:0 8px 24px rgba(26,41,66,.1)">' +
      '<div style="font-size:42px">🔒</div>' +
      '<h2 style="color:#1A2942;margin:10px 0 8px">' + title + '</h2>' +
      '<p style="color:#6B7280;line-height:1.7;margin:0 0 18px">' + msg + '</p>' +
      '<button id="bl-out2" style="background:#1A2942;color:#fff;border:0;border-radius:9px;' +
      'padding:10px 20px;font-family:inherit;font-size:14.5px;cursor:pointer">ออกจากระบบ</button></div>';
    var b = document.getElementById('bl-out2');
    if (b) b.onclick = signOut;
  }

  async function requireAuth(opts) {
    opts = opts || {};
    const { data } = await sb.auth.getSession();
    if (!data || !data.session) {
      location.href = 'index.html?next=' + encodeURIComponent(location.pathname.split('/').pop());
      return null;
    }
    ME = data.session.user;

    // สร้างโปรไฟล์ครั้งแรก (role = staff เสมอ — RLS บังคับไว้)
    await sb.from('bl_users').upsert({
      id: ME.id, email: ME.email,
      full_name: (ME.user_metadata && ME.user_metadata.full_name) || ME.email
    }, { onConflict: 'id', ignoreDuplicates: true });

    const r = await sb.rpc('bl_me');
    if (r && r.data) {
      PROFILE = r.data;
      ROLE = r.data.role || 'staff';
      STATUS = r.data.status || 'active';
    }

    if (STATUS === 'disabled') {
      blockScreen('บัญชีถูกระงับ',
        'บัญชี ' + esc(ME.email) + ' ถูกระงับการใช้งาน กรุณาติดต่อผู้ดูแลระบบ');
      return null;
    }
    if (opts.admin && ROLE !== 'admin') {
      blockScreen('ต้องเป็นผู้ดูแลระบบ',
        'หน้านี้เปิดให้เฉพาะผู้ดูแลระบบ<br>สิทธิ์ปัจจุบันของคุณคือ “' + (ROLE_TH[ROLE] || ROLE) + '”');
      return null;
    }
    return ME;
  }

  function isAdmin() { return ROLE === 'admin'; }
  async function signOut() { await sb.auth.signOut(); location.href = 'index.html'; }

  /* ---------- แพลตฟอร์ม ---------- */
  // key = ค่าที่เก็บในคอลัมน์ platform ของตาราง bl_rejects
  const PLATFORMS = [
    { key: 'TikTok',   file: 'tiktok.html',   name: 'TikTok Shop', c1: '#0B0B0F', c2: '#FE2C55', ic: '♪', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Tiktok_logo_text.svg', icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Tiktok_icon.svg', hero: 'assets/hero/tiktok-hero.svg', vibe: 'Neo Commerce' },
    { key: 'Lazada',   file: 'lazada.html',   name: 'Lazada',      c1: '#25106A', c2: '#F57224', ic: 'L', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Lazada_%282019%29.svg', icon: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Lazada_%282019%29.svg', hero: 'assets/hero/lazada-hero.svg', vibe: 'Royal Commerce' },
    { key: 'Shopee',   file: 'shopee.html',   name: 'Shopee',      c1: '#B63B1E', c2: '#EE4D2D', ic: 'S', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Shopee.svg', icon: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Shopee.svg', hero: 'assets/hero/shopee-hero.svg', vibe: 'Retail Energy' },
    { key: 'Facebook', file: 'facebook.html', name: 'Facebook',    c1: '#0B3C8D', c2: '#0866FF', ic: 'f', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/2023_Facebook_icon.svg', icon: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/2023_Facebook_icon.svg', hero: 'assets/hero/facebook-hero.svg', vibe: 'Network Data', logoType: 'icon' }
  ];

  function platformOf(key) {
    for (var i = 0; i < PLATFORMS.length; i++) if (PLATFORMS[i].key === key) return PLATFORMS[i];
    return null;
  }

  function platformLogoHTML(p, cls, alt) {
    if (!p || !p.logo) return '<span class="logo-mark ' + (cls || '') + '">' + (p && p.ic ? p.ic : '•') + '</span>';
    const type = p.logoType === 'icon' ? ' is-icon' : ' is-wordmark';
    const label = p.logoType === 'icon' && (cls === 'hero' || cls === 'card')
      ? '<span class="logo-label">' + esc(p.name || p.key || '') + '</span>' : '';
    return '<span class="logo-mark ' + (cls || '') + type + '"><img src="' + esc(p.logo) + '" alt="' + esc((alt || p.name || p.key || 'platform') + ' logo') + '">' + label + '</span>';
  }

  function platformIconHTML(p, cls, alt) {
    const src = p && (p.icon || p.logo);
    if (!src) return '<span class="platform-mini-logo ' + (cls || '') + '">' + (p && p.ic ? p.ic : '•') + '</span>';
    return '<span class="platform-mini-logo ' + (cls || '') + '"><img src="' + esc(src) + '" alt="' + esc((alt || p.name || p.key || 'platform') + ' icon') + '"></span>';
  }


  /* ---------- แถบเมนูบน ---------- */
  const NAV = [
    { f: 'index.html',  t: 'หน้าแรก' },
    { f: 'check.html',  t: 'เช็คเบอร์ก่อนส่ง' },
    { f: 'screen.html', t: 'ตรวจไฟล์ออเดอร์' },
    { menu: 'แพลตฟอร์ม', items: PLATFORMS.map(function (p) {
        return { f: p.file, t: platformLogoHTML(p, 'nav') + p.name };
      }) },
    { menu: 'เพิ่มข้อมูล', items: [
        { f: 'import.html', t: '⬆️  นำเข้าจากไฟล์' },
        { f: 'add.html',    t: '✍️  คีย์รายการเอง' } ] },
    { f: 'blacklist.html', t: 'จัดการ Blacklist' },
    { f: 'users.html',     t: 'ผู้ใช้งาน', admin: true }
  ];

  function renderNav(active) {
    const el = document.getElementById('nav');
    if (!el) return;
    const items = NAV.filter(function (n) { return !n.admin || isAdmin(); });
    el.innerHTML =
      '<div class="nav-in">' +
      '<a class="brand" href="index.html"><span class="dot"></span>' +
      (C.BRAND || 'MASARU') + ' <b>BLACKLIST</b></a>' +
      '<nav>' + items.map(function (n) {
        if (!n.menu) {
          return '<a href="' + n.f + '"' + (n.f === active ? ' class="on"' : '') + '>' + n.t + '</a>';
        }
        const on = n.items.some(function (i) { return i.f === active; });
        return '<div class="dd"><button class="dd-btn' + (on ? ' on' : '') + '">' + n.menu +
          ' <span class="ar">▾</span></button><div class="dd-menu">' +
          n.items.map(function (i) {
            return '<a href="' + i.f + '"' + (i.f === active ? ' class="on"' : '') + '>' + i.t + '</a>';
          }).join('') + '</div></div>';
      }).join('') + '</nav>' +
      '<div class="me">' +
      '<span class="role-chip' + (isAdmin() ? ' adm' : '') + '">' + (ROLE_TH[ROLE] || ROLE) + '</span>' +
      (ME ? esc(ME.email) : '') +
      ' <button id="btn-out" class="lnk">ออกจากระบบ</button></div></div>';

    Array.prototype.forEach.call(el.querySelectorAll('.dd-btn'), function (b) {
      b.onclick = function (e) {
        e.stopPropagation();
        const open = b.parentNode.classList.contains('open');
        Array.prototype.forEach.call(el.querySelectorAll('.dd'), function (d) { d.classList.remove('open'); });
        if (!open) b.parentNode.classList.add('open');
      };
    });
    document.addEventListener('click', function () {
      Array.prototype.forEach.call(el.querySelectorAll('.dd'), function (d) { d.classList.remove('open'); });
    });
    const b = document.getElementById('btn-out');
    if (b) b.onclick = signOut;
  }

  window.BL = {
    sb: sb, cfg: C, normPhone: normPhone, fmtPhone: fmtPhone, isAnonPhone: isAnonPhone, toDate: toDate,
    thDate: thDate, num: num, pageAll: pageAll, RISK: RISK, riskBadge: riskBadge,
    toast: toast, esc: esc, requireAuth: requireAuth, isAdmin: isAdmin,
    signOut: signOut, renderNav: renderNav, me: function () { return ME; },
    role: function () { return ROLE; }, profile: function () { return PROFILE; },
    ROLE_TH: ROLE_TH, blockScreen: blockScreen,
    PLATFORMS: PLATFORMS, platformOf: platformOf, platformLogoHTML: platformLogoHTML, platformIconHTML: platformIconHTML
  };
})();
