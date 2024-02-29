import LoopingHeader from "@/components/LoopingHeader";
import Content from "@/components/Content";

export default function Home() {

  return (
    <main className="h-screen bg-dark-holographic bg-cover overflow-hidden">
      <LoopingHeader />
      <Content />
    </main>
  )
}
