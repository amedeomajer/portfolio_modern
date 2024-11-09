import LoopingHeader from "@/components/LoopingHeader.tsx";
import Content from "@/components/Content.tsx";

export default function Home() {

  return (
    <main className="min-h-screen bg-dark-holographic bg-cover bg-fixed bg-center relative">
      <LoopingHeader />
      <Content />
    </main>
  )
}
