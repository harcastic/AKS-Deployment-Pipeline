"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { Cloud, Lock, Zap, Shield, Image as ImageIcon } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: <Lock className="h-6 w-6 text-primary" />,
      title: "Secure Storage",
      description: "Your images are encrypted and stored securely in the cloud, accessible only by you.",
    },
    {
      icon: <Zap className="h-6 w-6 text-primary" />,
      title: "Lightning Fast",
      description: "Optimized delivery ensures your images load instantly, wherever you are.",
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: "Private by Design",
      description: "Strict isolation means your gallery remains completely private and confidential.",
    },
    {
      icon: <Cloud className="h-6 w-6 text-primary" />,
      title: "Cloud Native",
      description: "Built for scale with enterprise-grade Kubernetes and Azure infrastructure.",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      {/* Navbar */}
      <nav className="w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between mx-auto px-4">
          <div className="flex items-center gap-2">
            <Cloud className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl tracking-tight">CloudGallery</span>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 w-full flex flex-col items-center relative">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[40vw] bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10" />
        
        <section className="w-full pt-28 pb-20 lg:pt-36 lg:pb-32 xl:pt-48 xl:pb-40 flex justify-center text-center relative overflow-hidden">
          <div className="absolute inset-0 -z-20 h-full w-full bg-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]"></div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="container px-4 md:px-6 flex flex-col items-center relative z-10"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium mb-8 text-primary shadow-[0_0_15px_rgba(var(--primary),0.2)] backdrop-blur-sm"
            >
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              Cloud Gallery 2.0 is now live
            </motion.div>
            
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl max-w-5xl mb-6">
              <span className="block text-foreground">Secure storage for</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-primary via-indigo-400 to-purple-400 pb-2">
                your digital life.
              </span>
            </h1>
            
            <p className="max-w-[750px] text-muted-foreground text-lg md:text-xl lg:text-2xl mb-12 leading-relaxed">
              Upload, organize, and access your high-resolution images from anywhere. Enterprise-grade security seamlessly built for individuals and creators.
            </p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center"
            >
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full h-14 px-8 text-base font-semibold shadow-[0_0_30px_-5px_rgba(var(--primary),0.4)] hover:shadow-[0_0_40px_-5px_rgba(var(--primary),0.6)] transition-all">
                  Start storing for free
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full h-14 px-8 text-base font-semibold border-border/60 hover:bg-muted/50 backdrop-blur-sm">
                  View Demo Gallery
                </Button>
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-16 pt-8 border-t border-border/40 w-full max-w-2xl flex flex-col items-center gap-4"
            >
              <p className="text-sm font-medium text-muted-foreground">TRUSTED BY 10,000+ CREATORS</p>
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className={`h-10 w-10 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden z-[${10-i}]`}>
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}&backgroundColor=transparent`} alt="User avatar" />
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Why Creators Choose Section */}
        <section className="w-full py-24 bg-background flex justify-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center mb-20">
              <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">Why Creators Choose Cloud Gallery</h2>
              <p className="text-muted-foreground max-w-[600px] text-lg">
                Store, organize, and access your memories with confidence
              </p>
            </div>
            
            <div className="flex flex-col gap-16 md:gap-24">
              {/* Feature 1 */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, margin: "-100px" }}
                className="grid md:grid-cols-2 gap-12 items-center bg-muted/30 rounded-3xl overflow-hidden border border-border/50 shadow-sm"
              >
                <div className="w-full h-64 md:h-[400px] bg-muted relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src="/cloud-security.png" 
                    alt="Safe & Secure" 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col p-8 md:p-12 lg:p-16">
                  <h3 className="text-3xl font-bold mb-4">Safe & Secure</h3>
                  <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                    We keep your memories secure and always available whenever you need them.
                  </p>
                  
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3 text-base font-medium">
                      <Lock className="h-5 w-5 text-amber-500" />
                      Secure encryption
                    </li>
                    <li className="flex items-center gap-3 text-base font-medium">
                      <Shield className="h-5 w-5 text-blue-500" />
                      99.99% uptime guarantee
                    </li>
                    <li className="flex items-center gap-3 text-base font-medium">
                      <Lock className="h-5 w-5 text-amber-500" />
                      Privacy-focused
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* Feature 2 */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, margin: "-100px" }}
                className="grid md:grid-cols-2 gap-12 items-center bg-muted/30 rounded-3xl overflow-hidden border border-border/50 shadow-sm"
              >
                <div className="flex flex-col p-8 md:p-12 lg:p-16 order-2 md:order-1">
                  <h3 className="text-3xl font-bold mb-4">Intuitive & Beautiful Interface</h3>
                  <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                    Designed for simplicity. Upload, organize, and share your photos in seconds. No learning curve, just pure ease of use.
                  </p>
                  
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3 text-base font-medium">
                      <ImageIcon className="h-5 w-5 text-indigo-500" />
                      Works on all devices
                    </li>
                    <li className="flex items-center gap-3 text-base font-medium">
                      <Zap className="h-5 w-5 text-amber-500" />
                      Lightning fast uploads
                    </li>
                  </ul>
                </div>
                <div className="w-full h-64 md:h-[400px] bg-muted relative order-1 md:order-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src="/user-interface.png" 
                    alt="Intuitive Interface" 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-20 bg-muted/50 border-t border-border flex justify-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Everything you need</h2>
              <p className="text-muted-foreground max-w-[600px] text-lg">
                Built with modern technologies to provide the best experience possible.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center text-center p-6 bg-background rounded-2xl border border-border/50 shadow-sm"
                >
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 border-t border-border mt-auto">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 px-4 mx-auto text-center md:text-left">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            <span className="font-semibold text-sm">CloudGallery © 2026</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Security</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
