
import React from 'react';
import { SLOGAN } from '../constants';

const Constitution: React.FC = () => {
  const sections = [
    {
      title: '🏛️ 1. ผู้คุมกฎแห่งท้องถนน (The Overlords)',
      content: [
        '🛡️ GM ภูหิรันต์: คุม Tracking และ GPS ใครขับอ้อมเส้นทาง หรือจอดแช่นานเกินเหตุ เตรียมโดนหัก SP',
        '✨ GM ประทวน: คุมภาพลักษณ์และความสุภาพ กล่องอาหารต้องสะอาด ชุดต้องเป๊ะ ยิ้มแย้มรับทิพย์มหาลาภ',
        '📜 กฎหลัก: คำสั่งจาก AI คือที่สุด ห้ามโต้แย้ง ห้ามบ่น ผลคือรวย!'
      ]
    },
    {
      title: '⏱️ 2. มาตรฐานการส่ง (Delivery Protocols)',
      content: [
        '🛵 Grab / Lineman / Foodpanda / ShopeeFood: ต้องสแกนสถานะทุกขั้นตอน (รับงาน/ถึงร้าน/รับอาหาร/ส่งสำเร็จ)',
        '🚫 ห้ามปฏิเสธงานงาน: ปฏิเสธ 1 ครั้ง หัก 50 SP ทันที',
        '🍟 สภาพอาหาร: ต้องถึงมือลูกค้าในสภาพ 100% ห้ามมีรอยแกะ หรืออาหารหก',
        '📱 การใช้มือถือ: ใช้เพื่อนำทางและติดต่อลูกค้าเท่านั้น ห้ามดู YouTube/TikTok ขณะปฏิบัติงาน'
      ]
    },
    {
      title: '📦 3. ประเภทงานและโบนัส',
      content: [
        '🍔 ส่งอาหาร (Food): เน้นความร้อนและความไว (Bonus: +10 SP ถ้าส่งไวเกินเกณฑ์)',
        '📦 ส่งพัสดุ (Parcel): เน้นความปลอดภัยและไม่บุบสลาย (Bonus: +20 SP สำหรับสินค้าเปราะบาง)',
        '🧧 วันอาทิตย์มหาลาภ: จ่ายสด 30% จากยอดสะสมสัปดาห์ให้ Top 3 Rider'
      ]
    },
    {
      title: '💎 4. ระบบเลเวล (Rider Ranks)',
      content: [
        '💎 Diamond: ส่งครบ 200 งาน/เดือน (โบนัส 100% + สิทธิ์ลุ้นของรางวัลใหญ่)',
        '🥇 Gold: ส่งครบ 150 งาน/เดือน (โบนัส 70%)',
        '🥈 Silver: ส่งครบ 80 งาน/เดือน (โบนัส 50%)'
      ]
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-24 animate-in fade-in duration-1000">
      <div className="text-center relative">
        <div className="absolute inset-0 blur-3xl bg-red-600/10 -z-10 rounded-full" />
        <h1 className="text-6xl font-black text-white tracking-tighter mb-4 uppercase">📜 คัมภีร์มหาธรรมนูญไรเดอร์</h1>
        <p className="text-2xl font-bold text-yellow-500 font-heading italic">"Ayutthaya Delivery Overlord" (ฉบับสมบูรณ์)</p>
        <div className="mt-8 flex justify-center items-center gap-6">
           <div className="h-[2px] w-32 bg-gradient-to-r from-transparent to-red-700" />
           <div className="text-[10px] font-black uppercase tracking-[1em] text-red-900">Rider Grid Sector</div>
           <div className="h-[2px] w-32 bg-gradient-to-l from-transparent to-red-700" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {sections.map((section, idx) => (
          <div key={idx} className="bg-neutral-900/30 p-10 rounded-[40px] border border-neutral-800 hover:border-red-900/50 transition-all shadow-2xl backdrop-blur-md group">
            <h3 className="text-2xl font-black text-white mb-8 border-b border-neutral-800 pb-4 group-hover:text-red-500 transition-colors">{section.title}</h3>
            <ul className="space-y-6">
              {section.content.map((item, i) => (
                <li key={i} className="text-neutral-400 text-sm leading-relaxed flex gap-4">
                  <span className="text-red-800 font-black">🛵</span>
                  <span className="font-heading">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="bg-red-950/20 border-2 border-red-900/40 p-16 rounded-[60px] text-center shadow-[0_0_100px_rgba(185,28,28,0.1)] relative overflow-hidden">
        <h4 className="text-red-600 font-black uppercase tracking-[0.5em] mb-8 text-xs">Supreme Rider Directive</h4>
        <p className="text-5xl md:text-7xl font-black text-white italic leading-tight uppercase tracking-tighter">"{SLOGAN}"</p>
      </div>
    </div>
  );
};

export default Constitution;
