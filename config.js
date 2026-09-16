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
  INVITE_CODE: 'MASARU-BL',

  // อีเมลที่ให้สิทธิ์ผู้ดูแล (แก้เกณฑ์ / ลบ batch / บล็อกเอง)
  ADMIN_EMAILS: ['hr.likeshop@gmail.com'],

  BRAND: 'MASARU'
};
