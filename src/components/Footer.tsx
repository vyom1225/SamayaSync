import Link from "next/link"

function Footer() {
  return (
    <div className="w-full flex justify-between p-6 border-t-1 border-muted-foreground/30">
        <div>Made with Love by Vyom</div>
        <div className="flex gap-6">
            <Link href = "https://github.com/vyom1225">Github</Link>
            <Link href = "https://codeforces.com/profile/vyom_1225">CodeForces</Link>
        </div>
    </div>
  )
}
export default Footer