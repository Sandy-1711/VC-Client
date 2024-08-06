'use client'
import { useRef, useState } from "react"

export default function OneMany() {
    const localStreamRef = useRef(null);
    const remoteStreamRef = useRef(null);
    const [pc, setPc] = useState(null);
    async function call() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
            console.log(stream);
            document.getElementById('localVideo').srcObject = stream;
            const pc = new RTCPeerConnection({
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
            });
            setPc(pc);
            stream.getTracks().forEach((track) => {
                pc.addTrack(track, stream)
            });
            // pc.addStream(stream);
            pc.onnegotiationneeded = () => handleNegotiationNeededEvent(pc);
            console.log(pc);
        }
        else {
            alert('getUserMedia not supported');
        }
    }

    async function handleNegotiationNeededEvent(pc) {
        const offer = await pc.createOffer()
        pc.setLocalDescription(offer);
        const res = await fetch('https://vc-server-re2d.onrender.com/api/v1/broadcast', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(offer)
        })
        const data = await res.json();
        const answer = data.sdp;
        const desc = new RTCSessionDescription(answer);
        pc.setRemoteDescription(desc);
    }
    return <div className="w-full h-[100dvh] bg-white text-[#2c2c2c] justify-center items-center flex-col flex">
        <button className="bg-blue-500 hover:bg-blue-700 transition-colors text-white px-3 py-1.5 rounded" onClick={call}>Call</button>
        <video id="localVideo" className="h-[500px] aspect-video" autoPlay muted></video>
    </div>
}