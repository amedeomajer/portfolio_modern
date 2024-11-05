import LoopingHeader from "@/components/LoopingHeader.tsx";
import Content from "@/components/Content";

export default function Home() {

  return (
    <main className="min-h-screen bg-dark-holographic bg-cover relative">
      <LoopingHeader />
      <Content />
    </main>
  )
}
