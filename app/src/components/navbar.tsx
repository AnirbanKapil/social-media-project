"use client"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion, useScroll, useTransform } from 'framer-motion'


export function NavBar () {
    const router = useRouter();
      return(
        <div className="flex justify-between">
            <div>
              
                <svg viewBox="0 0 100 100" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            </div>
            <div>
                <button className="bg-blue-600 rounded-lg p-2" 
                onClick={async()=> {await signOut({redirect : false});
                          router.push("/")        
                         }}>Logout</button>
            </div>
        </div>
      ) 
}