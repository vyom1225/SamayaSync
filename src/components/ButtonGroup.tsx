"use client"
import { Button } from "./ui/button"

function ButtonGroup({selected, setSelected}: {selected: string, setSelected: (selected: string) => void}) {
  return (
    <div className="flex w-full">
        <Button className="rounded-r-none flex-1" 
        variant={selected === "Zoom" ? "secondary" : "outline"}
         onClick={() => setSelected("Zoom")}
         type = "button">
            Zoom
        </Button>

        <Button className="rounded-none flex-1"
        variant={selected === "Google Meet" ? "secondary" : "outline"} 
        onClick={() => setSelected("Google Meet")}
        type = "button">
            Google Meet
        </Button>

        <Button className="rounded-l-none flex-1" 
        variant={selected === "Microsoft Teams" ? "secondary" : "outline"} 
        onClick={() => setSelected("Microsoft Teams")}
        type = "button">
            Microsoft Teams
        </Button>
    </div>
  )
}
export default ButtonGroup