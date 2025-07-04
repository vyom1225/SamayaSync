import AuthModal from "./AuthModal"

function Hero() {
  return (
    <div className="flex flex-1 h-full w-full p-6 ">
        <div className="flex flex-1 flex-col justify-center items-center gap-6">
            <div className="bg-primary/10 rounded-full py-1 px-4 w-fit">
                    <p className="text-primary font-semibold">Introducing Samaya Sync 1.0</p>
            </div>
            <div className="text-8xl text-center">   
                <div>Scheduling made</div>
                <div className="-mt-2 text-primary">super easy !</div>
            </div>
            <div className="text-center text-muted-foreground ">
                <div>Make it easy for your clients to connect with you.</div>
                <div>Samaya Sync turns scheduling into a seamless experience.</div>
            </div>
            <AuthModal/>
        </div>  
    </div>
  )
}
export default Hero