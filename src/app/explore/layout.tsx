import { Navbar } from "@/components/layout/Navbar"

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}
