'use client';

import { useEffect } from "react";

export default function Consumer() {
    const call = async () => {
        const pc = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });

        pc.addTransceiver('video', { direction: 'recvonly' });

        pc.onnegotiationneeded = async () => {
            try {
                await handleNegotiationNeededEvent(pc);
            } catch (error) {
                console.error('Error during negotiation:', error);
            }
        };

        pc.ontrack = (event) => {
            console.log('Track event:', event);
            document.getElementById('remoteStream').srcObject = event.streams[0];
        };

        console.log('PeerConnection initialized:', pc);
    };

    async function handleNegotiationNeededEvent(pc) {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        const res = await fetch('https://vc-server-re2d.onrender.com/api/v1/consume', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(offer)
        });

        if (!res.ok) {
            throw new Error('Failed to fetch the SDP from the server');
        }

        const data = await res.json();
        console.log(data.senderStream);
        
        const answer = new RTCSessionDescription(data.payload.sdp);
        await pc.setRemoteDescription(answer);
    }

    useEffect(() => {
        call().catch(console.error);
    }, []);

    return (
        <div className="w-screen h-[100dvh] bg-white">
            <video id="remoteStream" className="w-[500px] h-[500px]" playsInline muted autoPlay></video>
        </div>
    );
}
