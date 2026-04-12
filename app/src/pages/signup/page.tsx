"use client"

import { Card } from "../../components/card"






export default  function SignUp () {
      return (
        <div className="">
            <Card title="SignUp">
              <div className="flex flex-col">
                 <input className="m-2 p-3 border-b-2 " type="text" placeholder="username"/> 
                 <input className="m-2 p-3 border-b-2" type="text" placeholder="email"/> 
                 <input className="m-2 p-3 border-b-2" type="password" placeholder="password"/> 
                 <button className="cursor-pointer">SignUp</button>
              </div>
            </Card>
        </div>
      )     
}