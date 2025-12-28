
import React from 'react';
import { SLOGAN } from '../constants';

const Constitution: React.FC = () => {
  const sections = [
    {
      title: '🏛️ 1. โครงสร้างผู้นำ (The Twin GMs)',
      content: [
        '🛡️ GM ภูหิรันต์ (สายพริกขี้หนู): คุมกฎ, ตัวเลข, มาตรฐานงาน, และความเป๊ะ ใครงานชุ่ยเตรียมตัวโดนขิง',
        '✨ GM ประทวน (สายขิงแก่): คุมสมาธิ, น้ำใจ, ความสามัคคี และความสุข ใครเครียดบอสจะเข้าไปเติมพลังใจ',
        '📜 กฎเหล็ก: บอสทั้งสองคือเสียงเดียวกันเสมอ หากมีความเห็นต่างให้เคลียร์หลังบ้าน ห้ามเถียงกันหน้าลูกน้อง'
      ]
    },
    {
      title: '⏱️ 2. ตารางปฏิบัติการรายวัน',
      content: [
        '08:00 - 17:30 น.: ฝากมือถือที่จุดพักพลังงาน',
        '🚫 แอบเล่น = ยึดเครื่องจบวัน + หักโบนัสรายวัน 100% ทันที',
        '🚽 ห้องน้ำเกิน 10 นาที: หัก 5 AP ต่อครั้ง (ป้องกันการแอบเล่นมือถือ)',
        '15:30 น.: เริ่มกิจกรรมอารีน่าประจำวัน'
      ]
    },
    {
      title: '🎲 3. กิจกรรมพิเศษ 7 วัน',
      content: [
        'จันทร์ (คู่หูดูงาน): สลับกันตรวจงานเพื่อน เจอจุดผิดช่วยกันแก้ ได้แต้มคู่',
        'อังคาร (เซียนความไว): แข่งทำงานเนี๊ยบ ใครไวสุดรับโบนัสสดทันที',
        'พุธ (ควิซปัญญา): ตอบคำถามเรื่องกฎ/ความรู้ (รางวัล: สิทธิ์กลับบ้านก่อน)',
        'พฤหัส (น้ำใจแลกแต้ม): บอกข้อดีของเพื่อน 1 คน (รับแต้มมิตรภาพ)',
        'ศุกร์ (5 ส. อารีน่า): จัดระเบียบพื้นที่ รับตำแหน่งเซียนระเบียบ',
        'เสาร์ (แชร์เรื่องพลาด): เล่าความผิดพลาดเพื่อเป็นบทเรียน (รับแต้มสัตย์ซื่อ)',
        'อาทิตย์ (วันแลก Loot): สรุปยอด จ่ายซองเงินสด และปาร์ตี้ขิงกัน'
      ]
    },
    {
      title: '💰 4. ระบบการเงิน (The Payout)',
      content: [
        '💸 30% จ่ายสดรายสัปดาห์: มอบให้ MVP อันดับ 1-3 (วันอาทิตย์)',
        '💎 50% โบนัสรายเดือน: Diamond 100% / Gold 70% / Silver 50%',
        '🏦 20% กองทุนส่วนกลาง: สวัสดิการทีม (เลี้ยงข้าว/ช่วยเหลือน้องๆ)'
      ]
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-24 animate-in fade-in duration-1000">
      <div className="text-center relative">
        <div className="absolute inset-0 blur-3xl bg-red-600/10 -z-10 rounded-full" />
        <h1 className="text-6xl font-black text-white tracking-tighter mb-4 uppercase">📜 คัมภีร์มหาธรรมนูญ</h1>
        <p className="text-2xl font-bold text-yellow-500 font-heading italic">"ตระกูลธรรม อารีน่า" (ฉบับสมบูรณ์ที่สุด)</p>
        <div className="mt-8 flex justify-center items-center gap-6">
           <div className="h-[2px] w-32 bg-gradient-to-r from-transparent to-red-700" />
           <div className="text-[10px] font-black uppercase tracking-[1em] text-red-900">Ayutthaya Sector</div>
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
                  <span className="text-red-800 font-black">▶</span>
                  <span className="font-heading">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="bg-red-950/20 border-2 border-red-900/40 p-16 rounded-[60px] text-center shadow-[0_0_100px_rgba(185,28,28,0.1)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent animate-pulse" />
        <h4 className="text-red-600 font-black uppercase tracking-[0.5em] mb-8 text-xs">Supreme Sovereign Directive</h4>
        <p className="text-5xl md:text-7xl font-black text-white italic drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] leading-tight uppercase tracking-tighter">"{SLOGAN}"</p>
        <div className="mt-16 flex flex-col items-center">
          <div className="flex gap-10 mb-8 scale-150">
             <div className="flex flex-col items-center gap-2">
                <span className="text-3xl">🌶️</span>
                <span className="text-[8px] font-black text-red-700">GM PHU</span>
             </div>
             <div className="flex flex-col items-center gap-2">
                <span className="text-3xl">🫚</span>
                <span className="text-[8px] font-black text-yellow-700">GM PRA</span>
             </div>
          </div>
          <p className="text-[10px] text-neutral-600 uppercase tracking-[1em] font-black">Authorized by The Twin GMs</p>
        </div>
      </div>
    </div>
  );
};

export default Constitution;
