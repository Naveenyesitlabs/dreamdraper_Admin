import React, { useEffect, useRef, useState } from "react";

// Client software's physical-size conversion: 7.5 image pixels represent one inch.
const FABRIC_VALUE_DPI = 7.5;
const round = (value) => Number(value.toFixed(2));

const FabricSwatch = ({ onClose, onImport }) => {
    const fileInputRef = useRef(null);
    const canvasRef = useRef(null);
    const imageFrameRef = useRef(null);
    const [imageObj, setImageObj] = useState(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selection, setSelection] = useState(null);
    const [dragStart, setDragStart] = useState(null);
    const [displayScale, setDisplayScale] = useState(1);
    const [baseRepeat, setBaseRepeat] = useState(null);
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

    const setDimensionsFromScale = (nextScale, img = imageObj, crop = selection, base = baseRepeat) => {
        if (!base) return;
        const safeScale = Math.max(0.01, Number(nextScale) || 100);
        setScale(round(safeScale));
        setRepeatWidthIn(round(base.width * safeScale / 100));
        setRepeatHeightIn(round(base.height * safeScale / 100));
        makePreview(img, crop, safeScale);
    };

    const handleImageUpload = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => {
                setSelectedFile(file); setImageObj(img); setImageSrc(reader.result); setSelection(null);
                const fullSize = { width: img.width / FABRIC_VALUE_DPI, height: img.height / FABRIC_VALUE_DPI };
                setBaseRepeat(fullSize); setScale(100); setRepeatWidthIn(round(fullSize.width)); setRepeatHeightIn(round(fullSize.height));
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
        setDisplayScale(factor); canvas.width = Math.round(imageObj.width * factor); canvas.height = Math.round(imageObj.height * factor);
        const ctx = canvas.getContext("2d"); ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.drawImage(imageObj, 0, 0, canvas.width, canvas.height);
        if (selection) { ctx.strokeStyle = "#111"; ctx.lineWidth = 1; ctx.strokeRect(selection.x * factor, selection.y * factor, selection.width * factor, selection.height * factor); }
    }, [imageObj, selection]);

    const pointFromEvent = (event) => {
        const rect = canvasRef.current.getBoundingClientRect();
        return { x: Math.max(0, Math.min(imageObj.width, (event.clientX - rect.left) / displayScale)), y: Math.max(0, Math.min(imageObj.height, (event.clientY - rect.top) / displayScale)) };
    };
    const handleMouseDown = (event) => { if (imageObj) { setDragStart(pointFromEvent(event)); setSelection(null); } };
    const handleMouseMove = (event) => {
        if (!dragStart || !imageObj) return;
        const point = pointFromEvent(event);
        setSelection({ x: Math.min(dragStart.x, point.x), y: Math.min(dragStart.y, point.y), width: Math.abs(point.x - dragStart.x), height: Math.abs(point.y - dragStart.y) });
    };
    const handleMouseUp = () => {
        if (!dragStart || !selection || selection.width < 1 || selection.height < 1) { setDragStart(null); return; }
        const nextBase = { width: selection.width / FABRIC_VALUE_DPI, height: selection.height / FABRIC_VALUE_DPI };
        setBaseRepeat(nextBase); setScale(100); setRepeatWidthIn(round(nextBase.width)); setRepeatHeightIn(round(nextBase.height)); makePreview(imageObj, selection, 100); setDragStart(null);
    };
    const handleDimensionChange = (type, value) => {
        const nextValue = Number(value);
        if (!Number.isFinite(nextValue) || !baseRepeat) return;
        setDimensionsFromScale(nextValue / (type === "width" ? baseRepeat.width : baseRepeat.height) * 100);
    };
    const reset = () => {
        setImageObj(null); setImageSrc(null); setSelectedFile(null); setSelection(null); setBaseRepeat(null); setPreview(null); setScale(100); setSwatchName(""); setRepeatWidthIn(10.75); setRepeatHeightIn(12.5);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };
    const handleImport = () => {
        if (!selectedFile || !swatchName.trim()) return alert("Load image and enter name");
        const crop = selection || { x: 0, y: 0, width: imageObj?.width || 0, height: imageObj?.height || 0 };
        onImport?.(selectedFile, swatchName.trim(), { scale, repeatWidth: repeatWidthIn, repeatHeight: repeatHeightIn, offset: { x: crop.x, y: crop.y }, x: crop.x, y: crop.y, width: crop.width, height: crop.height, preview });
        onClose();
    };

    return <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,.35)", zIndex: 9999 }}>
        <div className="modal-dialog modal-dialog-centered" style={{ width: 700, maxWidth: 700, flex: "0 0 700px", margin: "auto" }}>
            <div className="modal-content" style={{ boxSizing: "border-box", borderRadius: 0, background: "#e9edf1", border: "1px solid #444", padding: 9, height: 469, fontFamily: "Arial, sans-serif", color: "#111" }}>
                <div style={{ display: "flex", gap: 5, height: 29 }}><button onClick={() => fileInputRef.current?.click()} className="fabric-button">Load Image...</button><input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} /><div className="fabric-file-name">{imageSrc ? selectedFile?.name : ""}</div></div>
                <div style={{ display: "flex", gap: 16, flex: 1, minHeight: 0, marginTop: 10 }}>
                    <div ref={imageFrameRef} style={{ flex: "0 0 420px", width: 420, height: 379, border: "1px solid #666", background: "#fff", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>{imageObj && <canvas ref={canvasRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} style={{ cursor: "crosshair", display: "block" }} />}</div>
                    <div style={{ flex: "0 0 219px", width: 219, height: 379, border: "1px solid #666", padding: "8px 10px 8px", background: "#efefef", boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
                        <div style={{ display: "grid", gap: 3, fontSize: 13 }}>
                            <label className="fabric-field"><span>Actual Width in Inches:</span><input type="number" step="0.01" value={repeatWidthIn} onChange={(e) => handleDimensionChange("width", e.target.value)} /></label>
                            <label className="fabric-field"><span>Actual Height in Inches:</span><input type="number" step="0.01" value={repeatHeightIn} onChange={(e) => handleDimensionChange("height", e.target.value)} /></label>
                            <label className="fabric-field"><span>Scale Percentage:</span><input type="number" step="0.01" value={scale} onChange={(e) => setDimensionsFromScale(e.target.value)} /></label>
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
