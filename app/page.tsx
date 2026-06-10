
'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  PenLine, 
  Image as ImageIcon, 
  Heart, 
  MessageCircle, 
  Share2, 
  TrendingUp, 
  Users, 
  Zap,
  ArrowRight,
  Feather,
  Globe,
  Shield
} from 'lucide-react';
import { useGetCurrentUserQuery } from "@/lib/generated";
import { useRef } from 'react';
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

// Custom Inkwell Logo Component
const InkwellLogo = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <motion.path
      d="M50 10 C30 10, 15 25, 15 45 C15 65, 30 80, 50 80 C70 80, 85 65, 85 45 C85 25, 70 10, 50 10Z"
      stroke="currentColor"
      strokeWidth="3"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, ease: "easeInOut" }}
    />
    <motion.path
      d="M50 80 L50 95"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, delay: 1.5 }}
    />
    <motion.path
      d="M35 95 L65 95"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, delay: 2 }}
    />
    <motion.path
      d="M50 35 L50 55 M40 45 L60 45"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 2.5 }}
    />
  </svg>
);

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const floatingAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

export default function LandingPage() {
  const router = useRouter();
  const { data } = useGetCurrentUserQuery({});
  const user = data?.currUser
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const features = [
    {
      icon: <PenLine className="w-6 h-6" />,
      title: "Expressive Writing",
      description: "Craft beautiful posts with our intuitive editor. Support for threads, markdown, and rich formatting."
    },
    {
      icon: <ImageIcon className="w-6 h-6" />,
      title: "Visual Stories",
      description: "Share up to 4 images per post. Built-in editing tools, filters, and alt-text support for accessibility."
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Meaningful Engagement",
      description: "Like, reply, repost, and quote. Quality interactions that foster genuine community connections."
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Discover Trends",
      description: "Explore trending topics, hashtags, and curated feeds tailored to your interests."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Communities",
      description: "Join or create communities around shared passions. From poetry to photography, find your people."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Optimized for speed. Instant loading, real-time updates, and smooth scrolling on any device."
    }
  ];

  const stats = [
    { value: "2M+", label: "Active Writers" },
    { value: "50M+", label: "Posts Shared" },
    { value: "100K+", label: "Communities" },
    { value: "190", label: "Countries" }
  ];

  const handleAuthAction =async () => {
    if(user){
       try {
         await signOut()
       } catch (error : any) {
        throw new Error("Failed logout option",error)
       } 
    }else{
        router.push("/signin") 
    }
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-950 text-slate-50 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <InkwellLogo className="w-8 h-8 text-indigo-400" />
            <span className="text-xl font-bold tracking-tight">Inkwell</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#community" className="hover:text-white transition-colors">Community</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={handleAuthAction} 
            className="hidden sm:block text-sm font-medium text-slate-400 hover:text-white transition-colors cursor-pointer">
              {!user ? "Log in" : "Log out"}
            </button>
            <button className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-400 cursor-pointer text-white text-sm font-semibold rounded-full transition-all hover:scale-105 active:scale-95">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent" />
        
        {/* Animated Background Elements */}
        <motion.div 
          animate={floatingAnimation}
          className="absolute top-20 right-[20%] w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{
            y: [0, 15, 0],
            transition: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }
          }}
          className="absolute bottom-20 left-[10%] w-96 h-96 bg-violet-500/10 rounded-full blur-3xl"
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            style={{ y, opacity }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Now open to everyone
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent"
            >
              Where Words
              <br />
              Take Flight
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Inkwell is the creative space for writers, thinkers, and visual storytellers. 
              Share your thoughts, discover new perspectives, and build your audience.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button className="group px-8 py-4 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-full transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
                Start Writing
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 bg-slate-800/50 hover:bg-slate-800 text-slate-300 font-semibold rounded-full border border-slate-700 transition-all hover:border-slate-600">
                Explore Feed
              </button>
            </motion.div>
          </motion.div>

          {/* Mock Feed Preview */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-20 max-w-2xl mx-auto"
          >
            <div className="relative bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6 shadow-2xl shadow-indigo-500/10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white font-bold">
                  S
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-white">Sarah Chen</span>
                    <span className="text-slate-500 text-sm">@sarahchen</span>
                    <span className="text-slate-600 text-sm">· 2h</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    Just published my first short story on Inkwell! The writing experience here is absolutely magical. The community feedback has been incredible 🖋️✨
                  </p>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="aspect-square bg-slate-800 rounded-lg overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=400&fit=crop" alt="Writing desk" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="aspect-square bg-slate-800 rounded-lg overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1517842645767-c639042777db?w=400&h=400&fit=crop" alt="Coffee and notebook" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-slate-500">
                    <button className="flex items-center gap-2 hover:text-indigo-400 transition-colors group">
                      <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span className="text-sm">24</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-pink-400 transition-colors group">
                      <Heart className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span className="text-sm">142</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-green-400 transition-colors group">
                      <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span className="text-sm">12</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-slate-800/50 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center"
              >
                <div className="text-4xl sm:text-5xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-slate-400 text-sm font-medium uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl sm:text-5xl font-bold mb-6">Everything you need to create</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Powerful tools designed for modern storytellers. From quick thoughts to long-form essays.
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="group p-8 rounded-2xl bg-slate-900/50 border border-slate-800/50 hover:border-indigo-500/30 hover:bg-slate-800/50 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section id="community" className="py-32 px-6 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl sm:text-5xl font-bold mb-6">Loved by creators worldwide</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "Inkwell transformed how I share my poetry. The community here actually reads and engages deeply.",
                author: "Elena Rodriguez",
                handle: "@elenawrites",
                role: "Poet & Author"
              },
              {
                quote: "The image sharing is seamless. I post my photography alongside stories and the quality retention is perfect.",
                author: "Marcus Johnson",
                handle: "@marcuslens",
                role: "Photographer"
              },
              {
                quote: "Finally, a platform that respects writers. No algorithmic nonsense, just pure creative connection.",
                author: "Aisha Patel",
                handle: "@aishathinks",
                role: "Essayist"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -5 }}
                className="p-8 rounded-2xl bg-slate-950 border border-slate-800/50 hover:border-indigo-500/20 transition-all"
              >
                <Feather className="w-8 h-8 text-indigo-500/50 mb-6" />
                <p className="text-slate-300 text-lg leading-relaxed mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center text-white font-semibold">
                    {testimonial.author[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.author}</div>
                    <div className="text-sm text-slate-500">{testimonial.handle}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/10 to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <h2 className="text-4xl sm:text-6xl font-bold mb-8">Ready to start your story?</h2>
          <p className="text-slate-400 text-xl mb-10 max-w-2xl mx-auto">
            Join millions of writers, thinkers, and creators. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="group px-8 py-4 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-full transition-all hover:scale-105 active:scale-95 flex items-center gap-2 text-lg">
              Create Account
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <Globe className="w-4 h-4" /> Free forever
            </span>
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4" /> No tracking
            </span>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-12 px-6 bg-slate-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <InkwellLogo className="w-6 h-6 text-indigo-400" />
            <span className="font-bold text-lg">Inkwell</span>
          </div>
          <div className="flex items-center gap-8 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Guidelines</a>
            <a href="#" className="hover:text-white transition-colors">API</a>
          </div>
          <div className="text-sm text-slate-600">
            © 2026 Inkwell. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
