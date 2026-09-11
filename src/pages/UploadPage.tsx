import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { analysisService } from '../services/analysisService';
import { ANALYSIS_STEPS } from '../services/demoAnalysisService';

import { useApp } from '../context/AppContext';
import {
  UploadCloud,
  FileImage,
  Trash2,
  Cpu,
  CheckCircle,
  AlertCircle,
  Radio,
  ArrowRight,

  Server,
} from 'lucide-react';

export const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { refreshAnalyses } = useApp();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Backend state
  const [isBackendOnline, setIsBackendOnline] = useState<boolean>(false);

  useEffect(() => {
    analysisService.checkBackendHealth().then((online) => setIsBackendOnline(online));
  }, []);

  // Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');
  const [fileSizeBytes, setFileSizeBytes] = useState<number>(0);
  const [resolution, setResolution] = useState<{ width: number; height: number }>({
    width: 1920,
    height: 1080,
  });
  const [uploadTime, setUploadTime] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  // Analysis Progress Modal state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [currentStepTitle, setCurrentStepTitle] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);

  // Handle incoming file
  const handleFileProcess = (file: File) => {
    setErrorMessage(null);

    // Validation: Supported types
    const validExtensions = ['.png', '.jpg', '.jpeg', '.tiff', '.tif'];
    const lowerName = file.name.toLowerCase();
    const hasValidExt = validExtensions.some((ext) => lowerName.endsWith(ext));
    const isImageMime = file.type.startsWith('image/') || lowerName.endsWith('.tiff') || lowerName.endsWith('.tif');

    if (!hasValidExt && !isImageMime) {
      setErrorMessage(
        'Unsupported file format. Please upload a Side-Scan Sonar raster in PNG, JPG, JPEG, or TIFF format.'
      );
      return;
    }

    // Validation: File size limit (e.g. 50 MB)
    if (file.size > 50 * 1024 * 1024) {
      setErrorMessage('File size exceeds 50 MB threshold. Please upload an optimized sonar swath.');
      return;
    }

    // Read and preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setPreviewUrl(url);
      setSelectedFile(file);
      setFileName(file.name);
      setFileSizeBytes(file.size);
      setFileSize((file.size / (1024 * 1024)).toFixed(2) + ' MB');
      setUploadTime(new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC');

      // Determine dimensions
      const img = new Image();
      img.onload = () => {
        setResolution({ width: img.naturalWidth || 1920, height: img.naturalHeight || 1080 });
      };
      img.src = url;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };



  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setFileName('');
    setFileSize('');
    setFileSizeBytes(0);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleStartAnalysis = async () => {
    if (!previewUrl) {
      setErrorMessage('Please upload or select a Side-Scan Sonar image before starting analysis.');
      return;
    }

    setIsAnalyzing(true);
    setCurrentStep(1);
    setCurrentStepTitle(ANALYSIS_STEPS[0]);
    setProgressPercent(10);

    try {
      const result = await analysisService.analyze(
        {
          imageFile: selectedFile || undefined,
          imageDataUrl: previewUrl,
          fileName: fileName || 'SONAR_IMAGE.png',
          fileSize: fileSize || '3.2 MB',
          fileSizeBytes: fileSizeBytes || 3355443,
          dimensions: resolution,
        },
        (step, title, percent) => {
          setCurrentStep(step);
          setCurrentStepTitle(title);
          setProgressPercent(percent);
        }
      );

      refreshAnalyses();
      // Brief delay so user sees 100% completed
      setTimeout(() => {
        setIsAnalyzing(false);
        navigate(`/results/${result.id}`);
      }, 500);
    } catch (err) {
      console.error(err);
      setIsAnalyzing(false);
      setErrorMessage('Analysis pipeline encountered an error. Please try again.');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Page Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-500/20 pb-4">
        <div>
          <h2 className="text-2xl font-black text-white font-['Outfit'] tracking-tight">
            Analyze Side-Scan Sonar Imagery
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Upload sonar imagery to detect underwater debris, ghost nets, shipwrecks, and marine hazards.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isBackendOnline ? (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
              <Server className="w-3.5 h-3.5" />
              FastAPI AI: Online ({(import.meta as any).env?.VITE_API_URL ? 'Render Cloud' : 'localhost:8000'})
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold" title="Python FastAPI backend status for neural model inference">
              <Server className="w-3.5 h-3.5" />
              AI Model: Local Processor
            </span>
          )}
        </div>
      </div>



      {/* Error Alert if any */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Main Drag and Drop Component */}
      {!previewUrl ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`glass-panel rounded-2xl p-10 sm:p-14 text-center border-2 border-dashed transition-all cursor-pointer ${
            isDragOver
              ? 'border-cyan-400 bg-cyan-950/30 shadow-[0_0_30px_rgba(6,182,212,0.3)]'
              : 'border-cyan-500/30 hover:border-cyan-400/60 hover:bg-slate-900/40'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".png,.jpg,.jpeg,.tiff,.tif"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFileProcess(e.target.files[0]);
              }
            }}
          />

          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto mb-4 border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-bold text-white font-['Outfit'] mb-1">
            Upload Side-Scan Sonar Image
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
            Drag and drop your sonar file here or browse from your device.
          </p>

          <button
            type="button"
            className="px-6 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold uppercase tracking-wider transition-all"
          >
            Browse Files
          </button>

          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-center gap-4 text-[11px] font-mono text-slate-400">
            <span>Supported Formats: PNG, JPG, JPEG, TIFF</span>
            <span>•</span>
            <span>Max Swath Size: 50 MB</span>
          </div>
        </div>
      ) : (
        /* Image Preview & Metadata Panel */
        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-2xl border-cyan-500/30 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <FileImage className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  Acoustic Swath Preview
                </span>
              </div>
              <button
                onClick={handleRemoveImage}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>

            {/* Sonar Image Preview Frame */}
            <div className="relative rounded-xl overflow-hidden bg-black max-h-[460px] flex items-center justify-center border border-cyan-500/20">
              <img
                src={previewUrl}
                alt="Uploaded Sonar Scan"
                className="w-full h-full object-contain max-h-[460px]"
              />
              <div className="absolute top-2 right-2 px-2 py-1 rounded bg-black/75 border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
                Acoustic Raster Loaded
              </div>
            </div>

            {/* Extracted File Metadata */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono text-xs">
              <div className="p-3 rounded-lg bg-slate-900/80 border border-white/5">
                <span className="text-[10px] text-slate-400 block">File Name</span>
                <span className="font-bold text-slate-200 truncate block" title={fileName}>
                  {fileName}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/80 border border-white/5">
                <span className="text-[10px] text-slate-400 block">File Size</span>
                <span className="font-bold text-slate-200">{fileSize}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/80 border border-white/5">
                <span className="text-[10px] text-slate-400 block">Resolution</span>
                <span className="font-bold text-cyan-400">
                  {resolution.width} × {resolution.height} px
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/80 border border-white/5">
                <span className="text-[10px] text-slate-400 block">Upload Time</span>
                <span className="font-bold text-slate-200 text-[11px] truncate">{uploadTime}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={handleRemoveImage}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 text-xs font-semibold tracking-wider transition-colors border border-white/10 hover:border-rose-500/30 flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>

              <button
                onClick={handleStartAnalysis}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
              >
                <Cpu className="w-4 h-4 text-slate-950" />
                <span>Analyze Image</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 10-Step AI Analysis Pipeline Modal */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
          <div className="w-full max-w-lg rounded-2xl glass-panel-glow border-cyan-400/40 p-6 sm:p-8 space-y-6 shadow-2xl">
            {/* Modal Header */}
            <div className="text-center space-y-1">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center mx-auto text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                <Radio className="w-7 h-7 animate-pulse" />
              </div>
              <h3 className="text-xl font-extrabold text-white font-['Outfit'] mt-2">
                Running Sonar Analysis
              </h3>
              <p className="text-xs text-slate-300">
                Acoustic Feature Extraction & Object Detection Pipeline
              </p>
            </div>

            {/* Main Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-300 font-bold truncate max-w-[280px]">Pipeline: {currentStepTitle || 'Initializing...'}</span>
                <span className="text-white font-extrabold">{progressPercent}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-900 border border-cyan-500/30 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 transition-all duration-300 ease-out shadow-[0_0_12px_rgba(6,182,212,0.8)]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* 10 Realistic Progress Steps Checklist */}
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 text-xs font-mono">
              {ANALYSIS_STEPS.map((stepTitle, idx) => {
                const stepNum = idx + 1;
                const isFinished = stepNum < currentStep;
                const isCurrent = stepNum === currentStep;

                return (
                  <div
                    key={stepTitle}
                    className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                      isCurrent
                        ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/40'
                        : isFinished
                        ? 'text-slate-300 bg-slate-900/40'
                        : 'text-slate-500 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] w-4 text-slate-400">{stepNum}.</span>
                      <span className={isCurrent ? 'font-bold text-white' : ''}>{stepTitle}</span>
                    </div>

                    {isFinished && (
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    {isCurrent && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-400 text-slate-950 font-bold animate-pulse">
                        RUNNING
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Telemetry Info */}
            <div className="p-3 rounded-lg bg-slate-900/80 border border-white/5 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>Status: Processing Image</span>
              <span className="text-cyan-400 font-bold">Neural Inference</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
