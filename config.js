/* ==========================================================================
   MASARU BLACKLIST — ไฟล์ตั้งค่ากลาง
   แก้ไฟล์นี้ "ไฟล์เดียว" ทุกหน้าจะใช้ค่าเดียวกัน
   ค่าจาก Supabase: Project Settings → API
   ========================================================================== */
window.BL_CONFIG = {
  SUPABASE_URL:      'https://XXXXXXXXXXXX.supabase.co',
  SUPABASE_ANON_KEY: 'PASTE_YOUR_ANON_PUBLIC_KEY_HERE',

  // รหัสเชิญสำหรับสมัครสมาชิก (บอกเฉพาะคนในทีม)
  INVITE_CODE: 'MASARU-BL',

  // อีเมลที่ให้สิทธิ์ผู้ดูแล (แก้เกณฑ์ / ลบ batch / บล็อกเอง)
  ADMIN_EMAILS: ['hr.likeshop@gmail.com'],

  BRAND: 'MASARU'
};
