"use client"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"


export function NavBar () {
    const router = useRouter();
      return(
        <div className="flex justify-between">
            <div>Icon</div>
            <div>
                <button className="bg-blue-600 rounded-lg p-2" 
                onClick={async()=> {await signOut({redirect : false});
                          router.push("/")        
                         }}>Logout</button>
            </div>
        </div>
      ) 
}