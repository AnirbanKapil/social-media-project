
import { type JSX } from "react";

export function Card ({title,children} : {title : string , children : React.ReactNode}) : JSX.Element {
          return (
            <div className="flex flex-col justify-center h-screen w-auto items-center">
                <div className="border p-6 bg-black rounded-xl">
                      <h1 className="text-xl border-b pb-2">{title}</h1>
                       {children}
                </div>
            </div>
          )
}