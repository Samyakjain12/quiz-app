"use client"

import SignUp from "../sign-up/page"
import SignIn from "../sign-in/page"
import Quiz from "../quiz-page/page"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"


export default function Home() {

  // const router =  useRouter();

  useEffect(() => {
    console.log("HERE")
    // router.push('/sign-in')
  }, [])
  return (
    <>
      <div className="back-color">
        <SignIn />
        {/* <Quiz/> */}
      </div>
    </>
  )
}
