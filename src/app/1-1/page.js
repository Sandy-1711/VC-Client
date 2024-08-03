'use client';
import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

export default function OneToOne() {
    const socketRef = useRef(null);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const [localStream, setLocalStream] = useState(null);
    const [pc, setPc] = useState(null);
    const start = async () => {
        try {
            let stream;
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            }
            else {
                alert('getUserMedia not supported');
            }
            setLocalStream(stream);
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }
            const peerConnection = new RTCPeerConnection();
            peerConnection.addStream(stream);
            setPc(peerConnection);

        } catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        start();
    }, [])
    useEffect(() => {


        socketRef.current = io.connect('https://vc-server-re2d.onrender.com/', {
            transports: ['websocket'],
            origin: '*'
        });

        socketRef.current.on('offer', async (offer) => {
            console.log('offer receiver aaya');
            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    console.log('candidate receiver emit hua');
                    socketRef.current.emit('candidate', event.candidate);
                }
            }
            pc.ontrack = (event) => {
                if (remoteVideoRef.current) {
                    console.log('remote track reciever pe aya');
                    remoteVideoRef.current.srcObject = event.streams[0];
                }
            }
            await pc.setRemoteDescription(offer);
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socketRef.current.emit('answer', answer);
            console.log('answer reciever emit hua');

        })

        socketRef.current.on('candidate', (candidate) => {
            console.log(candidate);

            pc.addIceCandidate(candidate);
            console.log('candidate reciever add hua');
        })
        socketRef.current.on('answer', async (answer) => {
            await pc.setRemoteDescription(answer);
            console.log('answer caller add hua');
        })
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        }
    }, [localStream, pc]);

    const call = async () => {
        if (!localStream) return; // Ensure localStream is available
        // const peerConnection = new RTCPeerConnection();
        pc.addStream(localStream);
        console.log('peer connection mein localStream add hua');

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socketRef.current.emit('candidate', event.candidate);
                console.log('candidate emit hua');

            }
        }


        pc.ontrack = (event) => {
            if (remoteVideoRef.current) {
                console.log('remote trach aya');
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        }
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socketRef.current.emit('offer', offer);
        console.log('offer emit hua');

    }
    const onHangUp = () => {
        if (pc) {
            pc.close();
            setPc(null);
        }
    }
    return (
        <div className="h-[100dvh] w-screen bg-white text-[#2c2c2c]">
            <div className="h-full flex flex-col items-center justify-center">
                <h2 className="text-2xl md:block hidden w-2/3 mb-5 font-bold font-sans text-center">
                    One to One Video Communication powered by WebRTC, completely secure and encrypted
                </h2>
                <div className='absolute md:relative gap-3 flex justify-center items-center bottom-10 md:bottom-0'>
                    <button onClick={call} className="bg-blue-500 hover:bg-blue-700 transition-colors text-white px-3 py-1.5 rounded">
                        Call
                    </button>
                    <button onClick={onHangUp} className="bg-red-500 hover:bg-red-700 transition-colors text-white px-3 py-1.5 rounded">
                        Hang Up
                    </button>
                </div>
                <div className="w-full md:h-max h-full flex gap-3 p-5 flex-col md:flex-row">
                    <video ref={localVideoRef} className="w-full h-1/2 md:w-1/2 md:h-full rounded-lg bg-[#2c2c2c]" id="myStream" muted autoPlay playsInline></video>
                    <video ref={remoteVideoRef} className="w-full h-1/2 md:w-1/2 md:h-full rounded-lg bg-[#2c2c2c]" id="peerPlayer" muted autoPlay playsInline></video>
                </div>
            </div>

        </div>
    );
}
