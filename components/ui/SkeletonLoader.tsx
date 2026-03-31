"use client";

import { motion } from "framer-motion";

interface SkeletonLoaderProps {
  className?: string;
}

/**
 * Skeleton Loader Component
 * 优雅的加载骨架屏，用于首页初始化加载
 * 使用渐变动画模拟加载效果
 */
export function SkeletonLoader({ className = "" }: SkeletonLoaderProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gray-200 rounded-inherit" />
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

/**
 * 数学页面加载骨架屏组件
 */
export function MathPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 p-6">
      {/* Navigation Skeleton */}
      <div className="mb-6">
        <SkeletonLoader className="w-32 h-10 rounded-2xl" />
      </div>

      {/* Title Section Skeleton */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <SkeletonLoader className="h-14 w-3/5 mx-auto rounded-2xl mb-4" />
        <SkeletonLoader className="h-7 w-2/5 mx-auto rounded-xl" />
      </motion.div>

      {/* Game Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-3xl border border-gray-200/50 shadow-lg overflow-hidden"
          >
            {/* Card Header */}
            <div className="bg-gradient-to-r from-gray-200 to-gray-300 p-6">
              <SkeletonLoader className="w-16 h-16 rounded-2xl mx-auto mb-3" />
              <SkeletonLoader className="h-6 w-3/4 mx-auto rounded-lg mb-2" />
              <SkeletonLoader className="h-4 w-full rounded-lg" />
            </div>
            
            {/* Card Body */}
            <div className="p-4">
              <SkeletonLoader className="h-10 w-full rounded-xl" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Decoration Skeleton */}
      <div className="text-center mt-10 flex justify-center gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <SkeletonLoader key={i} className="w-10 h-10 rounded-full" />
        ))}
      </div>
    </div>
  );
}

/**
 * 首页加载骨架屏组件
 */
export function HomePageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Top Navigation Bar Skeleton */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100/50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo Skeleton */}
            <div className="flex items-center gap-3">
              <SkeletonLoader className="w-10 h-10 rounded-2xl" />
              <div className="space-y-2">
                <SkeletonLoader className="w-24 h-4 rounded-lg" />
                <SkeletonLoader className="w-32 h-3 rounded-lg" />
              </div>
            </div>

            {/* Stats Skeleton */}
            <div className="flex items-center gap-4">
              <SkeletonLoader className="w-24 h-10 rounded-full" />
              <SkeletonLoader className="w-24 h-10 rounded-full" />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section Skeleton */}
      <section className="relative pt-12 pb-8 px-4">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Hero Icon Skeleton */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center mb-6"
          >
            <SkeletonLoader className="w-24 h-24 rounded-full" />
          </motion.div>

          {/* Title Skeleton */}
          <div className="space-y-4">
            <SkeletonLoader className="h-12 w-3/4 mx-auto rounded-2xl" />
            <SkeletonLoader className="h-6 w-1/2 mx-auto rounded-xl" />
          </div>
        </div>
      </section>

      {/* Main Content Skeleton */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Daily Tasks Card Skeleton */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100/50 shadow-xl overflow-hidden">
            {/* Card Header Skeleton */}
            <div className="bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 px-6 py-4 border-b border-gray-100/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <SkeletonLoader className="w-12 h-12 rounded-2xl" />
                  <div className="space-y-2">
                    <SkeletonLoader className="w-32 h-5 rounded-lg" />
                    <SkeletonLoader className="w-40 h-3 rounded-lg" />
                  </div>
                </div>
                <SkeletonLoader className="w-24 h-8 rounded-full" />
              </div>
            </div>

            {/* Task List Skeleton */}
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-100/50 p-5"
                >
                  <div className="flex items-center gap-4">
                    <SkeletonLoader className="w-14 h-14 rounded-2xl flex-shrink-0" />
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <SkeletonLoader className="w-40 h-5 rounded-lg" />
                        <SkeletonLoader className="w-16 h-6 rounded-full" />
                      </div>
                      <SkeletonLoader className="w-full h-2.5 rounded-full" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Game Worlds Grid Skeleton */}
        <section className="grid md:grid-cols-2 gap-6 mb-8">
          {[1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
            >
              <div className="bg-white rounded-3xl border border-gray-200/50 shadow-xl overflow-hidden h-full">
                {/* Card Header Skeleton */}
                <div className="bg-gradient-to-r from-gray-200 to-gray-300 px-6 py-8">
                  <div className="flex items-center gap-4">
                    <SkeletonLoader className="w-20 h-20 rounded-3xl" />
                    <div className="space-y-2">
                      <SkeletonLoader className="w-32 h-7 rounded-xl" />
                      <SkeletonLoader className="w-40 h-4 rounded-lg" />
                    </div>
                  </div>
                </div>

                {/* Card Body Skeleton */}
                <div className="p-6 space-y-4">
                  <SkeletonLoader className="w-full h-4 rounded-lg" />
                  <SkeletonLoader className="w-4/5 h-4 rounded-lg" />
                  
                  {/* Tags Skeleton */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {[1, 2, 3, 4].map((j) => (
                      <SkeletonLoader key={j} className="w-16 h-8 rounded-full" />
                    ))}
                  </div>

                  {/* CTA Button Skeleton */}
                  <div className="pt-2">
                    <SkeletonLoader className="w-32 h-12 rounded-2xl" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </section>
      </main>
    </div>
  );
}
