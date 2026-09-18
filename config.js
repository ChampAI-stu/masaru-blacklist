/* ==========================================================================
   MASARU BLACKLIST — ไฟล์ตั้งค่ากลาง
   แก้ไฟล์นี้ "ไฟล์เดียว" ทุกหน้าจะใช้ค่าเดียวกัน
   ค่าจาก Supabase: Project Settings → API
   ========================================================================== */
window.BL_CONFIG = {
  // โปรเจกต์ masaru-champ (ใช้ร่วมกับระบบอื่น — ตารางทั้งหมดขึ้นต้นด้วย bl_ จึงไม่ชนกัน)
  SUPABASE_URL:      'https://rmunaewdmlnsiwogmozq.supabase.co',

  // Publishable key (Project Settings → API Keys) — ใช้แทน anon key แบบเดิมได้
  SUPABASE_ANON_KEY: 'sb_publishable_m10p5I53UNKTZbUAEiUaCw_OCSR63mq',

  // รหัสเชิญสำหรับสมัครสมาชิก (บอกเฉพาะคนในทีม)
  // คนที่สมัครใหม่จะได้สิทธิ์ "staff" อัตโนมัติ — ผู้ดูแลเลื่อนเป็น admin ได้ที่หน้า "ผู้ใช้งาน"
  INVITE_CODE: 'MASARU-BL',

  BRAND: 'MASARU'
  // หมายเหตุ: สิทธิ์ admin เก็บในฐานข้อมูล (ตาราง bl_users) ไม่ได้อยู่ในไฟล์นี้แล้ว
  //          ตั้ง admin คนแรกด้วย 02_roles.sql
};
