/* ==========================================================================
   MASARU BLACKLIST — โค้ดกลางของหน้าแพลตฟอร์ม
   หน้าแต่ละแพลตฟอร์ม (tiktok/lazada/shopee/facebook) โหลดไฟล์นี้
   โดยตั้ง window.BL_PLATFORM = 'TikTok' ไว้ก่อน
   ========================================================================== */
(function () {
  const sb = BL.sb, $ = function (id) { return document.getElementById(id); };
  const KEY = window.BL_PLATFORM;
  const P = BL.platformOf(KEY) || { key: KEY, name: KEY, c1: '#1A2942', c2: '#2E3F63', ic: '📦', file: '' };
  let ROWS = [];

  document.documentElement.style.setProperty('--p1', P.c1);
  document.documentElement.style.setProperty('--p2', P.c2);
  document.documentElement.setAttribute('data-platform', P.key);

  /* ---------------- โครงหน้า ---------------- */
  function shell() {
    $('page').innerHTML =
      '<div class="p-hero">' +
        '<div><div class="ttl"><span class="ic">' + P.ic + '</span>' + BL.esc(P.name) + '</div>' +
        '<div class="sub2">ข้อมูลลูกค้าสั่งแล้วไม่รับ เฉพาะช่องทาง ' + BL.esc(P.name) + '</div></div>' +
        '<div class="acts">' +
          '<a href="import.html?p=' + encodeURIComponent(P.key) + '">⬆️ นำเข้าไฟล์</a>' +
          '<a href="add.html?p=' + encodeURIComponent(P.key) + '">✍️ คีย์รายการ</a>' +
          '<a href="check.html">🔎 เช็คเบอร์</a>' +
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
        '<div class="sub" id="cnt"></div>' +
        '<div class="tw"><table><thead><tr>' +
        '<th>วันที่ตีกลับ</th><th>เบอร์</th><th>ชื่อ</th><th>ร้าน</th><th>เลขออเดอร์</th>' +
        '<th>เลขพัสดุ</th><th>จังหวัด</th><th class="num">COD</th><th>เหตุผล</th><th>ที่มา</th>' +
        '</tr></thead><tbody id="tb"><tr><td colspan="10" class="empty">กำลังโหลด…</td></tr></tbody></table></div>' +
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
    $('tb').innerHTML = '<tr><td colspan="10" class="empty">กำลังโหลด…</td></tr>';
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
      drawRows();
    } catch (e) {
      $('tb').innerHTML = '<tr><td colspan="10" class="empty">' + BL.esc(e.message) + '</td></tr>';
    }
  }

  function drawRows() {
    $('cnt').textContent = 'พบ ' + ROWS.length.toLocaleString('th-TH') + ' รายการ' +
      (ROWS.length > 1500 ? ' (แสดง 1,500 รายการแรก — โหลด Excel เพื่อดูทั้งหมด)' : '');
    if (!ROWS.length) { $('tb').innerHTML = '<tr><td colspan="10" class="empty">ไม่พบรายการ</td></tr>'; return; }
    $('tb').innerHTML = ROWS.slice(0, 1500).map(function (r) {
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
          ? '<span class="tag">คีย์มือ</span>' : '<span class="tag">ไฟล์</span>') + '</td></tr>';
    }).join('');
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

    loadStats();
    loadRows();
  })();
})();
