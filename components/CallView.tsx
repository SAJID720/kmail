import React, { useState, useEffect, useRef } from 'react';
import type { Contact } from '../types';
import { PhoneIcon, VideoIcon, UserIcon, MicIcon, MicOffIcon, VideoOffIcon } from './icons';

interface CallViewProps {
  contact: Contact;
  type: 'audio' | 'video';
  onEndCall: () => void;
}

const CallView: React.FC<CallViewProps> = ({ contact, type, onEndCall }) => {
  const [callStatus, setCallStatus] = useState('connecting');
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(type === 'audio');
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let timeoutId: number;

    const startStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: type === 'video',
          audio: true,
        });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setCallStatus('connected');
      } catch (err) {
        console.error("Error accessing media devices.", err);
        alert("Could not access camera/microphone. Please check permissions.");
        onEndCall();
      }
    };
    
    startStream();
    
    // Simulate call connection
    timeoutId = window.setTimeout(() => {
        if (callStatus === 'connecting') {
            setCallStatus('connected');
        }
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [type, onEndCall, callStatus]);

  const toggleMute = () => {
    if (localStreamRef.current) {
        localStreamRef.current.getAudioTracks().forEach(track => {
            track.enabled = !track.enabled;
            setIsMuted(!track.enabled);
        });
    }
  };

  const toggleCamera = () => {
    if (type === 'video' && localStreamRef.current) {
        localStreamRef.current.getVideoTracks().forEach(track => {
            track.enabled = !track.enabled;
            setIsCameraOff(!track.enabled);
        });
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-95 z-50 flex flex-col text-white animate-fade-in">
        {/* Remote Video Area (background) */}
        <div className="relative flex-grow w-full h-full flex items-center justify-center bg-slate-800">
            {/* Placeholder content when remote video is off */}
            <div className="text-center">
                <div className="w-40 h-40 rounded-full bg-slate-700 mx-auto mb-4 flex items-center justify-center text-6xl font-bold text-sky-400">
                    {contact.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <h2 className="text-3xl font-bold">{contact.name}</h2>
                <p className="text-lg text-slate-300 capitalize">{callStatus}...</p>
            </div>

            {/* Local Video Preview (Picture-in-Picture) */}
            <div className="absolute bottom-24 sm:bottom-6 right-6 w-40 h-32 sm:w-48 sm:h-36 bg-black rounded-lg overflow-hidden shadow-lg border-2 border-slate-600 z-10">
                <video ref={localVideoRef} autoPlay muted playsInline className={`w-full h-full object-cover ${isCameraOff ? 'hidden' : 'block'}`} />
                {!isCameraOff && <div className="absolute bottom-1 right-1 text-xs bg-black/50 px-1 rounded">You</div>}
                {isCameraOff && (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-slate-400">
                        <UserIcon className="w-16 h-16 text-slate-500" />
                        <span className="mt-2 text-sm font-medium">Camera Off</span>
                    </div>
                )}
            </div>
        </div>
        
        {/* Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/70 to-transparent flex justify-center items-center gap-6 z-20">
            <button onClick={toggleMute} className={`p-4 rounded-full transition-colors ${isMuted ? 'bg-red-600 text-white' : 'bg-white/20 hover:bg-white/30'}`} aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}>
                {isMuted ? <MicOffIcon className="w-6 h-6" /> : <MicIcon className="w-6 h-6" />}
            </button>
            
            {type === 'video' && (
                <button onClick={toggleCamera} className={`p-4 rounded-full transition-colors ${isCameraOff ? 'bg-red-600 text-white' : 'bg-white/20 hover:bg-white/30'}`} aria-label={isCameraOff ? 'Turn camera on' : 'Turn camera off'}>
                    {isCameraOff ? <VideoOffIcon className="w-6 h-6"/> : <VideoIcon className="w-6 h-6"/>}
                </button>
            )}
            
            <button onClick={onEndCall} className="p-5 rounded-full bg-red-600 hover:bg-red-700 transition-transform hover:scale-105" aria-label="End call">
                <PhoneIcon className="w-7 h-7 transform rotate-[135deg]" />
            </button>
        </div>

         <style>{`
            @keyframes fade-in {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        `}</style>
    </div>
  );
};

export default CallView;