import LoopingHeader from "@/components/LoopingHeader";
import SideNav from "@/components/SideNav";

export default function Home() {
  return (
    <main className="min-h-screen h-screen bg-dark-holographic bg-cover bg-center overflow-y-hidden">
      <LoopingHeader />
      <SideNav />
    </main>
  )
}
