import React, { useEffect, useRef, useState } from "react";

const FABRIC_VALUE_DPI = 6;

const FabricSwatch = ({ onClose, onImport }) => {
    // no redux dispatch needed here; parent may provide onImport

    const fileInputRef = useRef(null);
    const canvasRef = useRef(null);
    const containerRef = useRef(null);

    const [imageObj, setImageObj] = useState(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const [originalRepeatWidth, setOriginalRepeatWidth] = useState(null);
    const [originalRepeatHeight, setOriginalRepeatHeight] = useState(null);

    const [selection, setSelection] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startPoint, setStartPoint] = useState(null);

    const [displayScale, setDisplayScale] = useState(1);

    const [repeatWidthIn, setRepeatWidthIn] = useState(10.75);
    const [repeatHeightIn, setRepeatHeightIn] = useState(12.5);

    const [scale, setScale] = useState(100);
    const [swatchName, setSwatchName] = useState("");
    const [preview, setPreview] = useState(null);

    // ---------------- IMAGE UPLOAD ----------------

    const updateFromScale = (newScale, img) => {
        if (!originalRepeatWidth || !originalRepeatHeight) return;

        const newWidth = (originalRepeatWidth * newScale) / 100;
        const newHeight = (originalRepeatHeight * newScale) / 100;

        setScale(parseFloat(newScale.toFixed(2)));
        setRepeatWidthIn(parseFloat(newWidth.toFixed(2)));
        setRepeatHeightIn(parseFloat(newHeight.toFixed(2)));

        generateRepeatPreview(img, newScale, newWidth, newHeight);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setSelectedFile(file);

        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => {
                const fullWidthIn = img.width / FABRIC_VALUE_DPI;
                const fullHeightIn = img.height / FABRIC_VALUE_DPI;

                setImageObj(img);
                setImageSrc(reader.result);
                setSelection(null);
                setOriginalRepeatWidth(fullWidthIn);
                setOriginalRepeatHeight(fullHeightIn);
                setScale(100);
                setRepeatWidthIn(parseFloat(fullWidthIn.toFixed(3)));
                setRepeatHeightIn(parseFloat(fullHeightIn.toFixed(3)));
                generateRepeatPreview(img, 100, fullWidthIn, fullHeightIn);
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
        setSwatchName(file.name.replace(/\.[^/.]+$/, ""));
    };

    // ---------------- DRAW CANVAS ----------------
    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !imageObj || !container) return;

        const ctx = canvas.getContext("2d");

        const scaleFactor = Math.min(
            container.clientWidth / imageObj.width,
            container.clientHeight / imageObj.height
        );

        setDisplayScale(scaleFactor);

        const w = imageObj.width * scaleFactor;
        const h = imageObj.height * scaleFactor;

        canvas.width = w;
        canvas.height = h;

        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(imageObj, 0, 0, w, h);

        if (selection) {
            ctx.strokeStyle = "black";
            ctx.lineWidth = 1;
            ctx.strokeRect(
                selection.x * scaleFactor,
                selection.y * scaleFactor,
                selection.width * scaleFactor,
                selection.height * scaleFactor
            );
        }
    }, [imageObj, selection]);

    // ---------------- DRAG SELECTION ----------------
    const handleMouseDown = (e) => {
        if (!imageObj) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / displayScale;
        const y = (e.clientY - rect.top) / displayScale;
        setStartPoint({ x, y });
        setIsDragging(true);
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !startPoint) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / displayScale;
        const y = (e.clientY - rect.top) / displayScale;

        const newSel = {
            x: Math.min(startPoint.x, x),
            y: Math.min(startPoint.y, y),
            width: Math.abs(x - startPoint.x),
            height: Math.abs(y - startPoint.y)
        };

        setSelection(newSel);

        // 🔥 Update repeat dynamically from drag
        const newWidthIn = newSel.width / FABRIC_VALUE_DPI;
        const newHeightIn = newSel.height / FABRIC_VALUE_DPI;

        setRepeatWidthIn(newWidthIn.toFixed(2));
        setRepeatHeightIn(newHeightIn.toFixed(2));
    };

    const handleMouseUp = () => {
        setIsDragging(false);

        if (imageObj && selection) {
            const widthIn = selection.width / FABRIC_VALUE_DPI;
            const heightIn = selection.height / FABRIC_VALUE_DPI;

            setOriginalRepeatWidth(widthIn);
            setOriginalRepeatHeight(heightIn);

            setScale(100);
            setRepeatWidthIn(parseFloat(widthIn.toFixed(2)));
            setRepeatHeightIn(parseFloat(heightIn.toFixed(2)));

            generateRepeatPreview(imageObj, 100, widthIn, heightIn);
        }
    };

    const generateRepeatPreview = (img, scalePercent, rWidthIn, rHeightIn) => {
        if (!img) return;

        // 🔥 True repeat size in pixels (DO NOT SCALE THIS)
        const repeatWidthPx = rWidthIn * FABRIC_VALUE_DPI;
        const repeatHeightPx = rHeightIn * FABRIC_VALUE_DPI;

        // Preview canvas (fixed UI size like client)
        const previewCanvas = document.createElement("canvas");
        const ctx = previewCanvas.getContext("2d");

        previewCanvas.width = 600;
        previewCanvas.height = 400;

        // Tile canvas (real repeat size)
        const tileCanvas = document.createElement("canvas");
        tileCanvas.width = repeatWidthPx;
        tileCanvas.height = repeatHeightPx;

        const tctx = tileCanvas.getContext("2d");

        // Draw selected repeat area
        if (selection) {
            tctx.drawImage(
                img,
                selection.x,
                selection.y,
                selection.width,
                selection.height,
                0,
                0,
                repeatWidthPx,
                repeatHeightPx
            );
        } else {
            tctx.drawImage(
                img,
                0,
                0,
                repeatWidthPx,
                repeatHeightPx
            );
        }

        // Create repeat pattern
        const pattern = ctx.createPattern(tileCanvas, "repeat");

        // 🔥 Apply scale ONLY to preview
        ctx.save();
        ctx.scale(scalePercent / 100, scalePercent / 100);
        ctx.fillStyle = pattern;

        ctx.fillRect(
            0,
            0,
            previewCanvas.width / (scalePercent / 100),
            previewCanvas.height / (scalePercent / 100)
        );

        ctx.restore();

        setPreview(previewCanvas.toDataURL("image/jpeg"));
    };

    // ---------------- CUSTOM INPUT ----------------
    const handleRepeatInputChange = (type, value) => {
        const num = parseFloat(value);
        if (isNaN(num) || !imageObj) return;

        if (!originalRepeatHeight || !originalRepeatWidth) return;

        let newScale;

        if (type === "height") {
            newScale = (num / originalRepeatHeight) * 100;
        } else {
            newScale = (num / originalRepeatWidth) * 100;
        }

        updateFromScale(newScale, imageObj);
    };

    const handleScaleChange = (e) => {
        const newScale = parseFloat(e.target.value);
        if (isNaN(newScale) || !imageObj) return;

        updateFromScale(newScale, imageObj);
    };
    // ---------------- IMPORT ----------------
    const handleImport = () => {
        if (!selectedFile || !swatchName.trim()) {
            alert("Load image and enter name");
            return;
        }

        const sel = selection || { x: 0, y: 0, width: 0, height: 0 };
        const payload = {
            scale: scale || 100,
            repeatWidth: repeatWidthIn || 0,
            repeatHeight: repeatHeightIn || 0,
            offset: { x: sel.x || 0, y: sel.y || 0 },
            height: sel.height || 0,
            width: sel.width || 0,
            x: sel.x || 0,
            y: sel.y || 0,
            preview,
        };

        if (typeof onImport === "function") {
            try {
                onImport(selectedFile, swatchName.trim(), payload);
                onClose();
            } catch (err) {
                console.error("onImport handler failed:", err);
                alert("Import failed");
            }
        } else {
            alert("No import handler provided");
        }
    };

    // ---------------- UI (UNCHANGED STRUCTURE) ----------------
    return (
        <div
            className="modal fade show"
            style={{
                display: "block",
                background: "rgba(0,0,0,.35)",
                zIndex: 9999
            }}
        >
            <div
                className="modal-dialog modal-dialog-centered"
                style={{
                    maxWidth: "1000px",
                    width: "1000px"
                }}
            >
                <div
                    className="modal-content flex flex-col"
                    style={{
                        borderRadius: 0,
                        background: "#e9ecef",
                        border: "1px solid #666",
                        padding: "15px",
                        height: "560px"
                    }}
                >

                    <div className="flex gap-3 mb-3">
                        <button
                            onClick={() => fileInputRef.current.click()}
                            className="px-3 py-1 border border-black bg-gray-300 hover:bg-gray-400"
                        >
                            Load Image...
                        </button>

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            className="hidden"
                        />

                        <div className="flex-1 border border-black bg-white px-2 py-1 text-sm">
                            {imageSrc ? "Image Loaded" : "No file selected"}
                        </div>
                    </div>

                    <div className="flex flex-1 gap-4" style={{ display: "flex" }}>

                        {/* Left Image */}
                        <div
                            ref={containerRef}
                            style={{
                                width: "435px",
                                height: "360px",
                                border: "1px solid #666",
                                background: "#fff",
                                overflow: "hidden"
                            }}
                        >
                            {imageObj && (
                                <canvas
                                    ref={canvasRef}
                                    onMouseDown={handleMouseDown}
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={handleMouseUp}
                                    className="cursor-crosshair"
                                />
                            )}
                        </div>

                        {/* Right Panel */}
                        <div
                            style={{
                                width: "400px",
                                height: "360px",
                                border: "1px solid #666",
                                padding: "12px",
                                background: "#efefef",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between"
                            }}
                        >
                            {/* Top Content */}
                            <div>
                                <div className="space-y-3 text-sm" style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "8px",
                                }}>
                                    <div className="flex justify-between">
                                        <label>Repeat Width (in):</label>
                                        <input
                                            type="number"
                                            value={repeatWidthIn}
                                            onChange={(e) =>
                                                handleRepeatInputChange("width", e.target.value)
                                            }
                                            className="w-20 border border-black px-1"
                                        />
                                    </div>

                                    <div className="flex justify-between">
                                        <label>Repeat Height (in):</label>
                                        <input
                                            type="number"
                                            value={repeatHeightIn}
                                            onChange={(e) =>
                                                handleRepeatInputChange("height", e.target.value)
                                            }
                                            className="w-20 border border-black px-1"
                                        />
                                    </div>

                                    <div className="flex justify-between">
                                        <label>Scale Percentage:</label>
                                        <input
                                            type="number"
                                            value={scale}
                                            onChange={handleScaleChange}
                                            className="w-20 border border-black px-1"
                                        />
                                    </div>
                                </div>

                                <div className="mt-3">
                                    <label className="block mb-1 text-sm">
                                        Swatch Name:
                                    </label>
                                    <input
                                        type="text"
                                        value={swatchName}
                                        onChange={(e) => setSwatchName(e.target.value)}
                                        className="w-full border border-black px-2 py-1"
                                    />
                                </div>

                                {/* <div
                                    style={{
                                        width: "100%",
                                        height: "175px",
                                        border: "1px solid #777",
                                        background: "#fff",
                                        marginTop: "15px"
                                    }}
                                >
                                    {preview ? (
                                        <img
                                            src={preview}
                                            alt="preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-gray-400 text-sm">
                                            Drag to define repeat tile
                                        </span>
                                    )}
                                </div> */}
                                <div
                                    style={{
                                        width: "100%",
                                        height: "175px",
                                        border: "1px solid #777",
                                        background: "#fff",
                                        marginTop: "15px",
                                        overflow: "hidden", // 👈 Image ko frame ke andar rakhega
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}
                                >
                                    {preview ? (
                                        <img
                                            src={preview}
                                            alt="preview"
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "contain", // ya "cover" agar crop acceptable ho
                                            }}
                                        />
                                    ) : (
                                        <span className="text-gray-400 text-sm">
                                            Drag to define repeat tile
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Bottom Buttons */}
                            <div style={{ marginTop: "30px", display: "flex", justifyContent: "space-between" }} className="flex flex-col gap-2">
                                <button
                                    onClick={onClose}
                                    className="w-full px-4 py-1 border border-black bg-gray-300 hover:bg-gray-400"
                                >
                                    Close
                                </button>

                                <div className="flex gap-2 mt-2 space-between">
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="flex-1 px-4 py-1 border border-black bg-gray-300 hover:bg-gray-400"
                                    >
                                        Reset
                                    </button>

                                    <button
                                        onClick={handleImport}
                                        className="flex-1 px-4 py-1 border border-black bg-gray-300 hover:bg-gray-400"
                                    >
                                        Import
                                    </button>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default FabricSwatch;