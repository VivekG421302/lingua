import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { useEffect } from 'react';
import { useRef } from 'react';


interface AudioRecorderProps {
  audio: string;
  resetSignal: number; 
  onAudioCaptured: (base64: string) => void;
  onReset: () => void;
}

export function AudioRecorder({ audio, resetSignal, onAudioCaptured, onReset }: AudioRecorderProps) {
  const { status, audioBase64, audioUrl, error, startRecording, stopRecording, resetRecording } =
  useAudioRecorder();
  
  const handleReset = () => {
    resetRecording();
    onReset();
  };
  const isFirstRender = useRef(true);

  // Propagate captured base64 upward
useEffect(() => {
  if (audioBase64 && status === 'stopped') {
    onAudioCaptured(audioBase64);
  }
}, [audioBase64, status]);


useEffect(() => {
  if (isFirstRender.current) {
    isFirstRender.current = false;
    return;
  }

  resetRecording();
}, [resetSignal]);

  return (
    <div className="recorder">
      <div className="recorder-label">Pronunciation Recording</div>
      <div className="recorder-controls">
        {status === 'idle' && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={startRecording}>
            ⏺ Record
          </button>
        )}
        {status === 'requesting' && (
          <span className="recorder-status">Requesting microphone…</span>
        )}
        {status === 'recording' && (
          <>
            <button type="button" className="btn btn-danger btn-sm" onClick={stopRecording}>
              ⏹ Stop
            </button>
            <span className="recorder-status">
              <span className="recorder-dot" /> Recording…
            </span>
          </>
        )}
        {status === 'stopped' && (
          <>
            <button type="button" className="btn btn-ghost btn-sm" onClick={handleReset}>
              ✕ Clear
            </button>
            <span className="recorder-status" style={{ color: 'var(--success)' }}>
              ✓ Captured
            </span>
          </>
        )}
        {status === 'error' && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={handleReset}>
            ↺ Retry
          </button>
        )}
      </div>

      {error && <p className="recorder-error">{error}</p>}

      {audioUrl && status === 'stopped' && (
        <audio src={audioUrl} controls className="recorder-audio" />
      )}
    </div>
  );
}
