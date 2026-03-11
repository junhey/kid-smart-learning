"use client";

import { useReward } from "@/hooks/useReward";
import { GameCard } from "@/components/ui/GameCard";
import { XPBar } from "@/components/XPBar";
import { motion } from "framer-motion";

export default function AchievementsPage() {
  const { stars, level } = useReward();
  
  // Calculate XP (假设每个星星 = 10 XP)
  const currentXP = (stars % 10) * 10;
  const nextLevelXP = 100;

  const achievements = [
    { id: 1, icon: "🌟", title: "第一步", desc: "完成第一个游戏", unlocked: stars >= 1 },
    { id: 2, icon: "🔥", title: "连胜", desc: "连续答对5题", unlocked: stars >= 5 },
    { id: 3, icon: "💯", title: "满分", desc: "游戏得满分", unlocked: stars >= 10 },
    { id: 4, icon: "🏆", title: "学霸", desc: "达到5级", unlocked: level >= 5 },
    { id: 5, icon: "🎯", title: "专注", desc: "完成10个游戏", unlocked: stars >= 30 },
    { id: 6, icon: "⚡", title: "闪电", desc: "快速完成游戏", unlocked: stars >= 20 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-6">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#CE82FF] to-[#FF66C4] mb-2">
            我的成就 🏆
          </h1>
          <p className="text-gray-600">你真棒！继续加油！</p>
        </motion.div>

        {/* XP Bar */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <XPBar level={level} currentXP={currentXP} nextLevelXP={nextLevelXP} />
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <GameCard title={stars.toString()} icon="⭐" description="收集的星星" />
          </motion.div>
          
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <GameCard 
              title={achievements.filter(a => a.unlocked).length.toString()} 
              icon="🏅" 
              description="解锁成就" 
            />
          </motion.div>
        </div>

        {/* Achievements Grid */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">成就列表</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <div className={`
                bg-white rounded-2xl p-6 shadow-md
                border-2 transition-all duration-300
                ${achievement.unlocked 
                  ? 'border-[#58CC02] shadow-[0_0_20px_rgba(88,204,2,0.3)]' 
                  : 'border-gray-200 opacity-60'
                }
              `}>
                <div className="flex items-center gap-4">
                  <div className={`
                    text-5xl
                    ${achievement.unlocked ? 'animate-bounce-slow' : 'grayscale'}
                  `}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      {achievement.title}
                    </h3>
                    <p className="text-sm text-gray-600">{achievement.desc}</p>
                  </div>
                  {achievement.unlocked && (
                    <div className="text-[#58CC02] text-2xl">✓</div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Encouragement */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center"
        >
          <div className="bg-gradient-to-r from-[#58CC02] to-[#89E219] text-white rounded-3xl p-6 shadow-lg">
            <p className="text-2xl font-bold mb-2">
              继续努力！ 💪
            </p>
            <p className="text-lg opacity-90">
              还有 {achievements.filter(a => !a.unlocked).length} 个成就等你解锁！
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
