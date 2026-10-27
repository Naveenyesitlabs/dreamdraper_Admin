import React, { useEffect, useRef, useState } from "react";

// Client software's physical-size conversion: 6 image pixels represent one inch.
const FABRIC_VALUE_DPI = 11.25;
const LEGACY_FABRIC_DPI = 6;
const normalizeNumber = (value) => {
    const numericValue = Number(value);
    return Number.isFinite(numericValue)
        ? Number(numericValue.toPrecision(15))
        : numericValue;
};
const formatAutomaticScale = (value) => {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) return numericValue;
    return Number.isInteger(numericValue)
        ? numericValue
        : numericValue.toFixed(2);
};
const formatAutomaticDimension = (value) => {
    const numericValue = Number(value);
    return Number.isFinite(numericValue)
        ? numericValue.toFixed(3)
        : numericValue;
};
const FabricSwatch = ({ onClose, onImport }) => {
    const fileInputRef = useRef(null);
    const canvasRef = useRef(null);
    const imageFrameRef = useRef(null);
    const [imageObj, setImageObj] = useState(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selection, setSelection] = useState(null);
    const selectionRef = useRef(null);
    const dragStartRef = useRef(null);
    const [baseRepeat, setBaseRepeat] = useState(null);
    const [imageDpi, setImageDpi] = useState(FABRIC_VALUE_DPI);
    const [repeatWidthIn, setRepeatWidthIn] = useState(10.75);
    const [repeatHeightIn, setRepeatHeightIn] = useState(12.5);
    const [scale, setScale] = useState(100);
    const [swatchName, setSwatchName] = useState("");
    const [preview, setPreview] = useState(null);

    const makePreview = (img, crop, scalePercent) => {
        if (!img) return;
        const source = crop || { x: 0, y: 0, width: img.width, height: img.height };
        const factor = Math.max(0.01, (Number(scalePercent) || 100) / 100);
        const tile = document.createElement("canvas");
        tile.width = Math.max(1, Math.round(source.width * factor));
        tile.height = Math.max(1, Math.round(source.height * factor));
        tile.getContext("2d").drawImage(img, source.x, source.y, source.width, source.height, 0, 0, tile.width, tile.height);
        const output = document.createElement("canvas");
        output.width = 440; output.height = 240;
        const ctx = output.getContext("2d");
        ctx.fillStyle = ctx.createPattern(tile, "repeat");
        ctx.fillRect(0, 0, output.width, output.height);
        setPreview(output.toDataURL("image/jpeg", 0.92));
    };

    const handleImageUpload = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => {
                setSelectedFile(file); setImageObj(img); setImageSrc(reader.result); setSelection(null);
                // High-resolution fabric images use the client's 266.667in canvas.
                // Smaller/other images retain the old software rule: six pixels per inch.
                const dpi = img.width >= 2000 ? img.width / 266.6666667 : LEGACY_FABRIC_DPI;
                setImageDpi(dpi);
                const fullSize = { width: img.width / dpi, height: img.height / dpi };
                setBaseRepeat(fullSize);
                setScale(100);
                setRepeatWidthIn(formatAutomaticDimension(fullSize.width));
                setRepeatHeightIn(formatAutomaticDimension(fullSize.height));
                makePreview(img, null, 100);
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
        setSwatchName(file.name.replace(/\.[^/.]+$/, ""));
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const frame = imageFrameRef.current;
        if (!canvas || !imageObj || !frame) return;
        const factor = Math.min(frame.clientWidth / imageObj.width, frame.clientHeight / imageObj.height);
        canvas.width = Math.round(imageObj.width * factor); canvas.height = Math.round(imageObj.height * factor);
        const ctx = canvas.getContext("2d"); ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.drawImage(imageObj, 0, 0, canvas.width, canvas.height);
        if (selection) { ctx.strokeStyle = "#111"; ctx.lineWidth = 1; ctx.strokeRect(selection.x * factor, selection.y * factor, selection.width * factor, selection.height * factor); }
    }, [imageObj, selection]);

    const pointFromEvent = (event) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const scaleX = rect.width > 0 ? imageObj.width / rect.width : 1;
        const scaleY = rect.height > 0 ? imageObj.height / rect.height : 1;
        return {
            x: Math.max(0, Math.min(imageObj.width, (event.clientX - rect.left) * scaleX)),
            y: Math.max(0, Math.min(imageObj.height, (event.clientY - rect.top) * scaleY))
        };
    };
    const handleMouseDown = (event) => {
        if (!imageObj) return;
        event.preventDefault();
        dragStartRef.current = pointFromEvent(event);
        selectionRef.current = null;
        setSelection(null);
        event.currentTarget.setPointerCapture?.(event.pointerId);
    };
    const handleMouseMove = (event) => {
        const dragStart = dragStartRef.current;
        if (!dragStart || !imageObj) return;
        const point = pointFromEvent(event);
        const nextSelection = {
            x: Math.min(dragStart.x, point.x),
            y: Math.min(dragStart.y, point.y),
            width: Math.abs(point.x - dragStart.x),
            height: Math.abs(point.y - dragStart.y)
        };
        selectionRef.current = nextSelection;
        setSelection(nextSelection);
    };
    const handleMouseUp = () => {
        const currentSelection = selectionRef.current;
        if (!dragStartRef.current || !currentSelection || currentSelection.width < 1 || currentSelection.height < 1) {
            dragStartRef.current = null;
            selectionRef.current = null;
            return;
        }
        const nextBase = {
            width: currentSelection.width / imageDpi,
            height: currentSelection.height / imageDpi
        };
        setBaseRepeat(nextBase);
        setScale(100);
        setRepeatWidthIn(formatAutomaticDimension(nextBase.width));
        setRepeatHeightIn(formatAutomaticDimension(nextBase.height));
        setSelection(currentSelection);
        makePreview(imageObj, currentSelection, 100);
        dragStartRef.current = null;
        selectionRef.current = null;
    };
    const handlePointerUp = (event) => {
        handleMouseUp();
        event.currentTarget.releasePointerCapture?.(event.pointerId);
    };
    const handleDimensionChange = (type, value) => {
        const nextValue = Number(value);
        if (!Number.isFinite(nextValue) || !baseRepeat) return;

        const safeValue = normalizeNumber(nextValue);
        const nextScale = Math.max(
            0.01,
            (nextValue / (type === "width" ? baseRepeat.width : baseRepeat.height)) * 100
        );
        setScale(formatAutomaticScale(nextScale));
        if (type === "width") {
            setRepeatWidthIn(safeValue);
        } else {
            setRepeatHeightIn(safeValue);
        }
        makePreview(imageObj, selection, nextScale);
    };
    const handleScaleChange = (event) => {
        const nextScale = Number(event.target.value);
        if (!Number.isFinite(nextScale) || !baseRepeat) return;

        const safeScale = Math.max(0.01, nextScale);
        setScale(normalizeNumber(safeScale));
        setRepeatWidthIn(formatAutomaticDimension(baseRepeat.width * safeScale / 100));
        setRepeatHeightIn(formatAutomaticDimension(baseRepeat.height * safeScale / 100));
        makePreview(imageObj, selection, safeScale);
    };
    const reset = () => {
        dragStartRef.current = null;
        selectionRef.current = null;
        setImageObj(null); setImageSrc(null); setSelectedFile(null); setSelection(null); setBaseRepeat(null); setPreview(null); setScale(100); setSwatchName(""); setImageDpi(FABRIC_VALUE_DPI); setRepeatWidthIn(10.75); setRepeatHeightIn(12.5);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };
    const createImportFile = async () => {
        if (!imageObj || !selection || selection.width < 1 || selection.height < 1) {
            return selectedFile;
        }

        const cropCanvas = document.createElement("canvas");
        cropCanvas.width = Math.max(1, Math.round(selection.width));
        cropCanvas.height = Math.max(1, Math.round(selection.height));
        const cropContext = cropCanvas.getContext("2d");
        if (!cropContext) return selectedFile;

        cropContext.imageSmoothingEnabled = true;
        if ("imageSmoothingQuality" in cropContext) {
            cropContext.imageSmoothingQuality = "high";
        }
        cropContext.drawImage(
            imageObj,
            selection.x,
            selection.y,
            selection.width,
            selection.height,
            0,
            0,
            cropCanvas.width,
            cropCanvas.height
        );

        const blob = await new Promise((resolve) => {
            cropCanvas.toBlob(resolve, "image/png");
        });
        if (!blob) return selectedFile;

        const safeName = (swatchName.trim() || "swatch").replace(/[^a-z0-9-_]+/gi, "_");
        return new File([blob], `${safeName}.png`, { type: "image/png" });
    };
    const handleImport = async () => {
        if (!selectedFile || !swatchName.trim()) return alert("Load image and enter name");
        const crop = selection || { x: 0, y: 0, width: imageObj?.width || 0, height: imageObj?.height || 0 };
        const importFile = await createImportFile();
        onImport?.(importFile || selectedFile, swatchName.trim(), {
            scale,
            scalePercentage: scale,
            repeatWidth: repeatWidthIn,
            actualWidth: repeatWidthIn,
            repeatHeight: repeatHeightIn,
            actualHeight: repeatHeightIn,
            offset: { x: crop.x, y: crop.y },
            x: crop.x,
            y: crop.y,
            width: crop.width,
            height: crop.height,
            preview
        });
        onClose();
    };

    return <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,.35)", zIndex: 9999 }}>
        <div className="modal-dialog modal-dialog-centered" style={{ width: 700, maxWidth: 700, flex: "0 0 700px", margin: "auto" }}>
            <div className="modal-content" style={{ boxSizing: "border-box", borderRadius: 0, background: "#e9edf1", border: "1px solid #444", padding: 9, height: 469, fontFamily: "Arial, sans-serif", color: "#111" }}>
                <div style={{ display: "flex", gap: 5, height: 29 }}><button onClick={() => fileInputRef.current?.click()} className="fabric-button">Load Image...</button><input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} /><div className="fabric-file-name">{imageSrc ? selectedFile?.name : ""}</div></div>
                <div style={{ display: "flex", gap: 16, flex: 1, minHeight: 0, marginTop: 10 }}>
                    <div ref={imageFrameRef} style={{ flex: "0 0 420px", width: 420, height: 379, border: "1px solid #666", background: "#fff", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>{imageObj && <canvas ref={canvasRef} onPointerDown={handleMouseDown} onPointerMove={handleMouseMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp} style={{ cursor: "crosshair", display: "block", touchAction: "none" }} />}</div>
                    <div style={{ flex: "0 0 219px", width: 219, height: 379, border: "1px solid #666", padding: "8px 10px 8px", background: "#efefef", boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
                        <div style={{ display: "grid", gap: 3, fontSize: 13 }}>
                            <label className="fabric-field"><span>Actual Width in Inches:</span><input type="number" step="any" value={repeatWidthIn} onChange={(e) => handleDimensionChange("width", e.target.value)} /></label>
                            <label className="fabric-field"><span>Actual Height in Inches:</span><input type="number" step="any" value={repeatHeightIn} onChange={(e) => handleDimensionChange("height", e.target.value)} /></label>
                            <label className="fabric-field"><span>Scale Percentage:</span><input type="number" step="any" value={scale} onChange={handleScaleChange} /></label>
                        </div>
                        <hr style={{ width: "100%", border: 0, borderTop: "1px solid #ccc", margin: "6px 0 5px" }} /><label style={{ fontWeight: 700, fontSize: 11, marginBottom: 3 }}>Swatch Name:</label><input type="text" value={swatchName} onChange={(e) => setSwatchName(e.target.value)} style={{ width: "100%", height: 22, border: "1px solid #aaa", padding: "2px 4px", boxSizing: "border-box", fontSize: 11 }} />
                        <div style={{ width: "100%", height: 242, border: "1px solid #777", background: "#fff", marginTop: 8, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>{preview ? <img src={preview} alt="Fabric repeat preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 13 }}>Drag to define repeat tile</span>}</div>
                    </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}><button onClick={onClose} className="fabric-button bottom-button">Close</button><div style={{ display: "flex", gap: 10 }}><button onClick={reset} className="fabric-button bottom-button">Reset</button><button onClick={handleImport} className="fabric-button bottom-button">Import</button></div></div>
            </div>
        </div>
        <style>{`.fabric-button{border:1px solid #999;background:#e5e5e5;color:#111;font:600 12px Arial;padding:3px 12px;box-shadow:inset 0 1px #fff;cursor:pointer}.fabric-button:hover{background:#d7d7d7}.bottom-button{min-width:91px;height:21px;padding:1px 12px}.fabric-file-name{flex:1;border:1px solid #aaa;background:#fff;padding:5px 7px;font-size:12px;overflow:hidden;white-space:nowrap}.fabric-field{display:flex;align-items:center;justify-content:space-between;gap:5px;white-space:nowrap}.fabric-field input{width:62px;height:20px;border:1px solid #aaa;background:#fff;padding:1px 4px;font-size:12px;box-sizing:border-box}`}</style>
    </div>;
};

export default FabricSwatch;
