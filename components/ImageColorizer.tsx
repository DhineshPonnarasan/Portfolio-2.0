'use client';

import React, { useState } from 'react';
import { Upload, Download, RefreshCw, AlertCircle, ImageIcon, Sliders } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ColorizerOptions {
    intensity: number;
    saturation: number;
}

interface ProcessingError {
    message: string;
    code: 'INVALID_FORMAT' | 'PROCESSING_FAILED' | 'FILE_TOO_LARGE';
}

const ImageColorizer: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [processedUrl, setProcessedUrl] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<ProcessingError | null>(null);
    const [options, setOptions] = useState<ColorizerOptions>({
        intensity: 50,
        saturation: 50,
    });

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            validateAndSetFile(file);
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files?.[0];
        if (file) {
            validateAndSetFile(file);
        }
    };

    const validateAndSetFile = (file: File) => {
        setError(null);
        setProcessedUrl(null);
        setProgress(0);

        // Check file type
        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            setError({
                message: 'Please upload a valid JPG or PNG image.',
                code: 'INVALID_FORMAT',
            });
            return;
        }

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError({
                message: 'File size exceeds 5MB limit.',
                code: 'FILE_TOO_LARGE',
            });
            return;
        }

        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
    };

    const processImage = async () => {
        if (!selectedFile || !previewUrl) return;

        setIsProcessing(true);
        setError(null);
        setProgress(0);

        try {
            // Simulate loading progress
            const progressInterval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 90) return prev;
                    return prev + 10;
                });
            }, 200);

            const img = new window.Image();
            img.src = previewUrl;
            
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
            });

            // Simulate processing time
            await new Promise((resolve) => setTimeout(resolve, 1500));

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
                throw new Error('Could not get canvas context');
            }

            canvas.width = img.width;
            canvas.height = img.height;

            // Draw original image
            ctx.drawImage(img, 0, 0);

            // Get image data
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // Apply "Colorization" Algorithm (Simulation)
            // We'll apply a color tint based on luminance to simulate coloring a B&W image
            // This is a simple heuristic: Darker pixels get cooler tones, lighter pixels get warmer tones
            // adjusted by intensity and saturation.
            
            const intensityFactor = options.intensity / 100;
            const saturationFactor = options.saturation / 100;

            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                
                // Calculate luminance (grayscale value)
                const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

                // Apply color tint simulation
                // Sepia/Warm tone target
                const tr = luminance + 40 * intensityFactor;
                const tg = luminance + 20 * intensityFactor;
                const tb = luminance - 20 * intensityFactor;

                // Blend original grayscale with tinted version based on saturation
                data[i] = r * (1 - saturationFactor) + tr * saturationFactor;     // Red
                data[i + 1] = g * (1 - saturationFactor) + tg * saturationFactor; // Green
                data[i + 2] = b * (1 - saturationFactor) + tb * saturationFactor; // Blue
                // Alpha (data[i+3]) remains unchanged
            }

            ctx.putImageData(imageData, 0, 0);

            clearInterval(progressInterval);
            setProgress(100);
            
            setProcessedUrl(canvas.toDataURL('image/png'));
        } catch (err) {
            setError({
                message: 'Failed to process image. Please try again.',
                code: 'PROCESSING_FAILED',
            });
            console.error(err);
        } finally {
            setIsProcessing(false);
        }
    };

    const downloadImage = () => {
        if (!processedUrl) return;
        const link = document.createElement('a');
        link.href = processedUrl;
        link.download = 'colorized-image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-6 bg-zinc-900/50 rounded-3xl border border-white/10 backdrop-blur-sm">
            <div className="flex flex-col gap-8">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-anton text-primary">AI Image Colorizer</h2>
                    <p className="text-muted-foreground">Transform black and white photos into vibrant color images</p>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Input Section */}
                    <div className="space-y-6">
                        {/* Drop Zone */}
                        <div
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                            className={cn(
                                "relative aspect-video rounded-2xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-4 transition-all duration-300 bg-black/20 overflow-hidden",
                                !previewUrl && "hover:border-primary/50 hover:bg-primary/5 cursor-pointer"
                            )}
                        >
                            {previewUrl ? (
                                <Image
                                    src={previewUrl}
                                    alt="Preview"
                                    fill
                                    className="object-contain"
                                    unoptimized
                                />
                            ) : (
                                <>
                                    <div className="p-4 rounded-full bg-white/5">
                                        <Upload className="size-8 text-muted-foreground" />
                                    </div>
                                    <div className="text-center p-4">
                                        <p className="font-medium">Click or drag image here</p>
                                        <p className="text-sm text-muted-foreground mt-1">JPG or PNG, max 5MB</p>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/png, image/jpeg"
                                        onChange={handleFileSelect}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                </>
                            )}
                        </div>

                        {/* Controls */}
                        <div className="space-y-4 p-6 rounded-2xl bg-white/5 border border-white/10">
                            <div className="flex items-center gap-2 mb-4">
                                <Sliders className="size-5 text-primary" />
                                <h3 className="font-anton text-lg">Adjustments</h3>
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <label>Color Intensity</label>
                                    <span>{options.intensity}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={options.intensity}
                                    onChange={(e) => setOptions({ ...options, intensity: parseInt(e.target.value) })}
                                    className="w-full accent-primary h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                                    aria-label="Intensity"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <label>Saturation</label>
                                    <span>{options.saturation}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={options.saturation}
                                    onChange={(e) => setOptions({ ...options, saturation: parseInt(e.target.value) })}
                                    className="w-full accent-primary h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                                    aria-label="Saturation"
                                />
                            </div>

                            <button
                                onClick={processImage}
                                disabled={!selectedFile || isProcessing}
                                className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                            >
                                {isProcessing ? (
                                    <>
                                        <RefreshCw className="animate-spin size-5" />
                                        Processing... {progress}%
                                    </>
                                ) : (
                                    <>
                                        <ImageIcon className="size-5" />
                                        Colorize Image
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Output Section */}
                    <div className="space-y-6">
                        <div className="relative aspect-video rounded-2xl border border-white/10 bg-black/40 flex items-center justify-center overflow-hidden">
                            {processedUrl ? (
                                <Image
                                    src={processedUrl}
                                    alt="Processed"
                                    fill
                                    className="object-contain"
                                    unoptimized
                                />
                            ) : (
                                <div className="text-center p-8 text-muted-foreground">
                                    <ImageIcon className="size-12 mx-auto mb-4 opacity-50" />
                                    <p>Processed image will appear here</p>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                            <button
                                onClick={downloadImage}
                                disabled={!processedUrl}
                                className="flex-1 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <Download className="size-5" />
                                Download Result
                            </button>
                        </div>

                        {/* Error Display */}
                        {error && (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-start gap-3">
                                <AlertCircle className="size-5 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold">Error</p>
                                    <p className="text-sm opacity-90">{error.message}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageColorizer;
