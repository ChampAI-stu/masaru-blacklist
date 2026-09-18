/* ==========================================================================
   MASARU BLACKLIST — โค้ดกลางของหน้าแพลตฟอร์ม
   หน้าแต่ละแพลตฟอร์ม (tiktok/lazada/shopee/facebook) โหลดไฟล์นี้
   โดยตั้ง window.BL_PLATFORM = 'TikTok' ไว้ก่อน
   ========================================================================== */
(function () {
  const sb = BL.sb, $ = function (id) { return document.getElementById(id); };
  const KEY = window.BL_PLATFORM;
  const P = BL.platformOf(KEY) || { key: KEY, name: KEY, c1: '#1A2942', c2: '#2E3F63', ic: '•', file: '', logo: '', icon: '', hero: '', vibe: '' };
  let ROWS = [], PAGE = 1, PER = 100;

  document.documentElement.style.setProperty('--p1', P.c1);
  document.documentElement.style.setProperty('--p2', P.c2);
  document.documentElement.setAttribute('data-platform', P.key);

  /* ---------------- โครงหน้า ---------------- */
  function shell() {
    $('page').innerHTML =
      '<div class="p-hero">' +
        '<div class="hero-copy">' +
          '<div class="ttl">' + BL.platformLogoHTML(P, 'hero', P.name) + '</div>' +
          '<div class="hero-meta"><span class="hero-chip">' + BL.esc(P.vibe || 'Platform') + '</span><span class="hero-kicker">ข้อมูลเฉพาะช่องทาง</span></div>' +
          '<div class="sub2">ข้อมูลลูกค้าสั่งแล้วไม่รับสินค้า • ' + BL.esc(P.name) + '</div>' +
        '</div>' +
        '<div class="hero-side">' +
          '<div class="hero-illustration">' + (P.hero ? '<img src="' + BL.esc(P.hero) + '" alt="ภาพประกอบ ' + BL.esc(P.name) + '">' : '') + '</div>' +
          '<div class="acts">' +
            '<a href="import.html?p=' + encodeURIComponent(P.key) + '">' + BL.platformIconHTML(P, 'btn', P.name) + '<span>นำเข้าไฟล์</span></a>' +
            '<a href="add.html?p=' + encodeURIComponent(P.key) + '">' + BL.platformIconHTML(P, 'btn', P.name) + '<span>คีย์รายการ</span></a>' +
            '<a href="check.html">' + BL.platformIconHTML(P, 'btn', P.name) + '<span>เช็คเบอร์</span></a>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<div class="grid g4" style="margin-bottom:14px">' +
        kpi('k-today', 'ตีกลับวันนี้', 'รายการ') +
        kpi('k-7',     'ตีกลับ 7 วันล่าสุด', 'รายการ') +
        kpi('k-30',    'ตีกลับ 30 วันล่าสุด', '', 'k-cod') +
        kpi('k-total', 'สะสมทั้งหมด', '', 'k-codt') +
      '</div>' +
      '<div class="grid g4" style="margin-bottom:16px">' +
        kpi('k-cus',  'ลูกค้าที่เคยตีกลับ', 'เบอร์') +
        kpi('k-rep',  'สั่งเล่นซ้ำ (≥2 ครั้ง)', 'คน') +
        kpi('k-avg',  'เฉลี่ยต่อวัน (30 วัน)', 'รายการ/วัน') +
        kpi('k-share','สัดส่วนของทั้งระบบ', 'ของรายการตีกลับทั้งหมด') +
      '</div>' +

      '<div class="grid g2">' +
        '<div class="card"><h2>ยอดตีกลับ 14 วันล่าสุด</h2><div class="bars p" id="c-daily"></div></div>' +
        '<div class="card"><h2>แนวโน้มรายเดือน (12 เดือน)</h2><div class="bars p" id="c-month"></div></div>' +
      '</div>' +

      '<div class="grid g3">' +
        '<div class="card"><h2>แยกตามร้าน</h2><div class="plist p" id="c-shop"></div></div>' +
        '<div class="card"><h2>เหตุผลที่ไม่รับของ</h2><div class="plist p" id="c-reason"></div></div>' +
        '<div class="card"><h2>จังหวัดที่ตีกลับบ่อย</h2><div class="plist p" id="c-prov"></div></div>' +
      '</div>' +

      '<div class="card">' +
        '<h2>ลูกค้าที่ตีกลับบ่อยที่สุดในช่องทางนี้</h2>' +
        '<div class="sub">กดที่เบอร์เพื่อดูประวัติเต็มทุกแพลตฟอร์ม</div>' +
        '<div class="tw" style="max-height:430px"><table><thead><tr>' +
        '<th style="width:44px">#</th><th>เบอร์โทร</th><th>ชื่อ</th>' +
        '<th class="num">ตีกลับในช่องทางนี้</th><th class="num">COD รวม</th><th>ล่าสุด</th>' +
        '</tr></thead><tbody id="tb-top"></tbody></table></div>' +
      '</div>' +

      '<div class="card">' +
        '<h2>รายการตีกลับทั้งหมด</h2>' +
        '<div class="row" style="margin-bottom:12px">' +
          '<div><label>ตั้งแต่วันที่</label><input id="d1" type="date"></div>' +
          '<div><label>ถึงวันที่</label><input id="d2" type="date"></div>' +
          '<div style="flex:2"><label>ค้นหา (เบอร์ / ชื่อ / ออเดอร์ / ร้าน)</label><input id="q"></div>' +
          '<div style="flex:0"><button class="btn" id="btn-find">ค้นหา</button></div>' +
          '<div style="flex:0"><button class="btn gold" id="btn-xls">⬇️ Excel</button></div>' +
        '</div>' +
        '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:8px">' +
          '<div class="sub" id="cnt" style="margin:0"></div>' +
          '<div style="display:flex;align-items:center;gap:7px;font-size:13px;color:#6B7280">' +
            '<span>แสดงหน้าละ</span>' +
            '<select id="per" style="width:auto;padding:5px 8px;font-size:13px">' +
              '<option value="100" selected>100</option><option value="200">200</option>' +
              '<option value="500">500</option><option value="1000">1000</option>' +
            '</select>' +
            '<span>รายการ</span>' +
          '</div>' +
        '</div>' +
        '<div class="tw"><table><thead><tr>' +
        '<th>วันที่ตีกลับ</th><th>เบอร์</th><th>ชื่อ</th><th>ร้าน</th><th>เลขออเดอร์</th>' +
        '<th>เลขพัสดุ</th><th>จังหวัด</th><th class="num">COD</th><th>เหตุผล</th><th>ที่มา</th>' +
        '<th style="width:56px"></th>' +
        '</tr></thead><tbody id="tb"><tr><td colspan="11" class="empty">กำลังโหลด…</td></tr></tbody></table></div>' +
        '<div id="pager" style="display:flex;align-items:center;justify-content:center;' +
          'gap:6px;flex-wrap:wrap;margin-top:14px"></div>' +
      '</div>';
  }

  function kpi(id, label, unit, subId) {
    return '<div class="kpi p"><div class="l">' + label + '</div><div class="v" id="' + id + '">–</div>' +
           '<div class="s"' + (subId ? ' id="' + subId + '"' : '') + '>' + (unit || '') + '</div></div>';
  }

  /* ---------------- สถิติ ---------------- */
  async function loadStats() {
    const [sRes, gRes] = await Promise.all([
      sb.rpc('bl_platform_stats', { p_platform: P.key }),
      sb.rpc('bl_stats')
    ]);
    if (sRes.error) { BL.toast('โหลดสถิติไม่สำเร็จ: ' + sRes.error.message, 'err'); return; }
    const s = sRes.data, all = gRes.data || {};
    const n = function (v) { return (v || 0).toLocaleString('th-TH'); };
    const money = function (v) { return Math.round(v || 0).toLocaleString('th-TH') + ' ฿'; };

    $('k-today').textContent = n(s.today);
    $('k-7').textContent     = n(s.last7);
    $('k-30').textContent    = n(s.last30);
    $('k-cod').textContent   = 'มูลค่า COD ' + money(s.cod30);
    $('k-total').textContent = n(s.total);
    $('k-codt').textContent  = 'มูลค่า COD ' + money(s.cod_total);
    $('k-cus').textContent   = n(s.customers);
    $('k-rep').textContent   = n(s.repeat);
    $('k-avg').textContent   = ((s.last30 || 0) / 30).toFixed(1);
    $('k-share').textContent = all.total ? ((s.total || 0) / all.total * 100).toFixed(1) + '%' : '–';

    drawDaily(s.daily || []);
    drawMonths(s.months || []);
    drawList('c-shop', s.by_shop);
    drawList('c-reason', s.by_reason);
    drawList('c-prov', s.by_province);
    drawTop(s.top || []);
  }

  function drawDaily(daily) {
    const map = {};
    daily.forEach(function (d) { map[d.d] = d.n; });
    const days = [];
    for (let i = 13; i >= 0; i--) {
      const dt = new Date(); dt.setDate(dt.getDate() - i);
      const k = dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0') +
                '-' + String(dt.getDate()).padStart(2, '0');
      days.push({ k: k, lab: dt.getDate() + '/' + (dt.getMonth() + 1), n: map[k] || 0 });
    }
    bars('c-daily', days.map(function (d) { return { lab: d.lab, n: d.n, tip: d.k }; }));
  }

  function drawMonths(months) {
    const MN = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
    const map = {};
    months.forEach(function (m) { map[m.m] = m.n; });
    const out = [];
    for (let i = 11; i >= 0; i--) {
      const dt = new Date(); dt.setDate(1); dt.setMonth(dt.getMonth() - i);
      const k = dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0');
      out.push({ lab: MN[dt.getMonth()], n: map[k] || 0, tip: k });
    }
    bars('c-month', out);
  }

  function bars(id, arr) {
    const mx = Math.max(1, Math.max.apply(null, arr.map(function (d) { return d.n; })));
    $(id).innerHTML = arr.map(function (d) {
      return '<div class="b" title="' + BL.esc(d.tip) + ': ' + d.n + ' รายการ">' +
             '<em>' + (d.n || '') + '</em>' +
             '<i style="height:' + Math.round(d.n / mx * 88) + '%"></i>' +
             '<span>' + d.lab + '</span></div>';
    }).join('');
  }

  function drawList(id, arr) {
    arr = arr || [];
    const tot = arr.reduce(function (a, b) { return a + b.n; }, 0) || 1;
    $(id).innerHTML = arr.length ? arr.map(function (x) {
      return '<div class="p"><span class="n" title="' + BL.esc(x.k) + '">' + BL.esc(trunc(x.k, 16)) + '</span>' +
             '<span class="t"><i style="width:' + (x.n / tot * 100).toFixed(1) + '%"></i></span>' +
             '<span class="v">' + x.n.toLocaleString('th-TH') + '</span></div>';
    }).join('') : '<div class="empty">ยังไม่มีข้อมูล</div>';
  }
  function trunc(s, n) { s = String(s || ''); return s.length > n ? s.slice(0, n - 1) + '…' : s; }

  function drawTop(top) {
    $('tb-top').innerHTML = top.length ? top.map(function (r, i) {
      return '<tr><td>' + (i + 1) + '</td>' +
        '<td class="mono"><a href="check.html?q=' + r.phone + '" target="_blank" ' +
          'style="color:#2E75B6;font-weight:600">' + BL.fmtPhone(r.phone) + '</a></td>' +
        '<td>' + BL.esc(r.name || '-') + '</td>' +
        '<td class="num"><b>' + r.n + '</b></td>' +
        '<td class="num">' + Math.round(r.cod || 0).toLocaleString('th-TH') + '</td>' +
        '<td>' + BL.thDate(r.last) + '</td></tr>';
    }).join('') : '<tr><td colspan="6" class="empty">ยังไม่มีข้อมูลของ ' + BL.esc(P.name) + '</td></tr>';
  }

  /* ---------------- ตารางรายการ ---------------- */
  async function loadRows() {
    $('tb').innerHTML = '<tr><td colspan="11" class="empty">กำลังโหลด…</td></tr>';
    const d1 = $('d1').value, d2 = $('d2').value, q = $('q').value.trim();
    try {
      ROWS = await BL.pageAll(function () {
        let b = sb.from('bl_rejects').select('*').eq('platform', P.key)
          .order('reject_date', { ascending: false, nullsFirst: false })
          .order('id', { ascending: false });
        if (d1) b = b.gte('reject_date', d1);
        if (d2) b = b.lte('reject_date', d2);
        if (q) {
          const p = BL.normPhone(q);
          if (p) b = b.eq('phone', p);
          else b = b.or('name.ilike.%' + q + '%,order_no.ilike.%' + q +
                        '%,tracking_no.ilike.%' + q + '%,shop.ilike.%' + q + '%');
        }
        return b;
      });
      PAGE = 1;
      drawRows();
    } catch (e) {
      $('tb').innerHTML = '<tr><td colspan="11" class="empty">' + BL.esc(e.message) + '</td></tr>';
    }
  }

  function drawRows() {
    const total = ROWS.length;
    const pages = Math.max(1, Math.ceil(total / PER));
    if (PAGE > pages) PAGE = pages;
    if (PAGE < 1) PAGE = 1;
    const start = (PAGE - 1) * PER;
    const slice = ROWS.slice(start, start + PER);

    if (!total) {
      $('cnt').textContent = '';
      $('tb').innerHTML = '<tr><td colspan="11" class="empty">ไม่พบรายการ</td></tr>';
      $('pager').innerHTML = '';
      return;
    }
    $('cnt').innerHTML = 'พบ <b>' + total.toLocaleString('th-TH') + '</b> รายการ · ' +
      'แสดงรายการที่ ' + (start + 1).toLocaleString('th-TH') + '–' +
      (start + slice.length).toLocaleString('th-TH') +
      ' (หน้า ' + PAGE + ' จาก ' + pages + ')';

    $('tb').innerHTML = slice.map(function (r) {
      return '<tr>' +
        '<td>' + BL.thDate(r.reject_date) + '</td>' +
        '<td class="mono"><a href="check.html?q=' + r.phone + '" target="_blank" ' +
          'style="color:#2E75B6;font-weight:600">' + BL.fmtPhone(r.phone) + '</a></td>' +
        '<td>' + BL.esc(r.name || '-') + '</td>' +
        '<td>' + BL.esc(r.shop || '-') + '</td>' +
        '<td class="mono" style="font-size:12.5px">' + BL.esc(r.order_no || '-') + '</td>' +
        '<td class="mono" style="font-size:12.5px">' + BL.esc(r.tracking_no || '-') + '</td>' +
        '<td>' + BL.esc(r.province || '-') + '</td>' +
        '<td class="num">' + (r.cod_amount ? Math.round(r.cod_amount).toLocaleString('th-TH') : '-') + '</td>' +
        '<td>' + BL.esc(r.reason || '-') + '</td>' +
        '<td>' + (r.source === 'manual'
          ? '<span class="tag">คีย์มือ</span>' : '<span class="tag">ไฟล์</span>') + '</td>' +
        '<td><button class="btn sm ghost" data-del="' + r.id + '" title="ลบรายการนี้">ลบ</button></td></tr>';
    }).join('');

    Array.prototype.forEach.call($('tb').querySelectorAll('[data-del]'), function (b) {
      b.onclick = function () { delRow(Number(b.dataset.del)); };
    });

    drawPager(pages);
  }

  /* ---------------- แบ่งหน้า ---------------- */
  function drawPager(pages) {
    if (pages <= 1) { $('pager').innerHTML = ''; return; }

    // แสดงเลขหน้าแบบหน้าต่างเลื่อน: 1 … 4 5 [6] 7 8 … 20
    const win = [];
    const push = function (n) { if (win.indexOf(n) < 0 && n >= 1 && n <= pages) win.push(n); };
    push(1); push(2);
    for (let i = PAGE - 2; i <= PAGE + 2; i++) push(i);
    push(pages - 1); push(pages);
    win.sort(function (a, b) { return a - b; });

    let html = btn('« แรก', 1, PAGE === 1) + btn('‹ ก่อนหน้า', PAGE - 1, PAGE === 1);
    let prev = 0;
    win.forEach(function (n) {
      if (prev && n - prev > 1) html += '<span style="color:#9aa5b5;padding:0 3px">…</span>';
      html += '<button class="btn sm' + (n === PAGE ? ' red' : ' ghost') +
              '" data-go="' + n + '" style="min-width:38px">' + n + '</button>';
      prev = n;
    });
    html += btn('ถัดไป ›', PAGE + 1, PAGE === pages) + btn('ท้ายสุด »', pages, PAGE === pages);
    $('pager').innerHTML = html;

    Array.prototype.forEach.call($('pager').querySelectorAll('[data-go]'), function (b) {
      b.onclick = function () {
        PAGE = Number(b.dataset.go);
        drawRows();
        const tw = $('tb').closest('.tw');
        if (tw) { tw.scrollTop = 0; tw.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      };
    });
  }
  function btn(label, go, disabled) {
    return '<button class="btn sm ghost" data-go="' + go + '"' + (disabled ? ' disabled' : '') +
           '>' + label + '</button>';
  }

  // ลบรายการเดียวจากตาราง (เฉพาะผู้ดูแลระบบ) แล้วคำนวณความเสี่ยงของเบอร์นั้นใหม่
  async function delRow(id) {
    const row = ROWS.filter(function (x) { return x.id === id; })[0];
    if (!row) return;
    if (!window.confirm('ลบรายการนี้?\n' + BL.fmtPhone(row.phone) +
        (row.order_no ? ' · ' + row.order_no : '') + '\n\nย้อนกลับไม่ได้')) return;
    const r = await sb.from('bl_rejects').delete().eq('id', id);
    if (r.error) return BL.toast('ลบไม่สำเร็จ: ' + r.error.message, 'err');
    await sb.rpc('bl_recompute', { p_phone: row.phone });
    BL.toast('ลบรายการแล้ว');
    ROWS = ROWS.filter(function (x) { return x.id !== id; });
    drawRows();
    loadStats();
  }

  function exportXls() {
    if (!ROWS.length) return BL.toast('ไม่มีข้อมูลให้ส่งออก');
    const rows = ROWS.map(function (r) {
      return {
        'วันที่ตีกลับ': r.reject_date || '', 'วันที่สั่งซื้อ': r.order_date || '',
        'เบอร์โทร': r.phone, 'ชื่อผู้รับ': r.name || '',
        'แพลตฟอร์ม': r.platform, 'ร้าน': r.shop || '',
        'เลขออเดอร์': r.order_no || '', 'เลขพัสดุ': r.tracking_no || '',
        'จังหวัด': r.province || '', 'ที่อยู่': r.address || '',
        'COD': r.cod_amount || 0, 'เหตุผล': r.reason || '',
        'ที่มา': r.source === 'manual' ? 'คีย์มือ' : 'ไฟล์', 'ผู้คีย์': r.created_by || ''
      };
    });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), P.key);
    XLSX.writeFile(wb, 'ตีกลับ ' + P.key + ' ' + new Date().toISOString().slice(0, 10) + '.xlsx');
  }

  /* ---------------- boot ---------------- */
  (async function () {
    if (!(await BL.requireAuth())) return;
    BL.renderNav(P.file);
    document.title = P.name + ' — MASARU BLACKLIST';
    shell();

    const d = new Date(); d.setDate(d.getDate() - 29);
    $('d1').value = d.toISOString().slice(0, 10);
    $('d2').value = new Date().toISOString().slice(0, 10);

    $('btn-find').onclick = loadRows;
    $('btn-xls').onclick = exportXls;
    $('q').addEventListener('keydown', function (e) { if (e.key === 'Enter') loadRows(); });
    $('per').onchange = function () { PER = Number(this.value) || 100; PAGE = 1; drawRows(); };

    loadStats();
    loadRows();
  })();
})();
