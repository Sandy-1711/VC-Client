'use client'
import { useRouter } from "next/navigation"
export default function App() {
  const router = useRouter();
  return <div className="h-screen w-screen bg-white ">
    <div className="h-full text-[#2c2c2c] flex flex-col items-center justify-center">
      <h2 className="text-6xl font-bold font-sans text-center">Welcome to Video Call application</h2>
      <p className="text-xl mt-4 font-sans font-medium">This is a video call application made by Sandeep Singh</p>
      <div className="flex gap-4 mt-4">
        <a className="text-green-500" href="https://github.com/Sandy-1711">Github</a>
        <a className="text-blue-500" href="https://www.linkedin.com/in/sandeep-singh-9b9a8b1b0">Linkedin</a>
      </div>
      <div className="flex gap-3 mt-4">
        <button onClick={() => { router.push("/1-1") }} className="bg-blue-500 hover:bg-blue-700 transition-colors text-white px-3 py-1.5 rounded">1 - 1</button>
        <button onClick={() => { router.push("/1-many") }} className="bg-blue-500 hover:bg-blue-700 transition-colors text-white px-3 py-1.5 rounded">1 - many</button>
        <button onClick={() => { router.push("/many-many") }} className="bg-blue-500 hover:bg-blue-700 transition-colors text-white px-3 py-1.5 rounded">many - many</button>
      </div>
    </div>
  </div>
}