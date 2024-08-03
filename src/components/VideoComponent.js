export default function VideoComponent({ myStream }) {
    return <div className="w-full h-full">
        <video className="w-full h-full" playsInline muted src={myStream} autoPlay />
    </div>
}