import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearConversion, convertSvg } from "../redux/admin/slices/svgConvertSlice";

export default function SvgConverter() {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const { loading, error, convertedUrl } = useSelector((state) => state.svgConvert);
  const [file, setFile] = useState(null);
  const [sourcePreview, setSourcePreview] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("curtain");

  useEffect(() => () => {
    if (sourcePreview) URL.revokeObjectURL(sourcePreview);
    dispatch(clearConversion());
  }, [dispatch, sourcePreview]);

  const handleFile = (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    if (sourcePreview) URL.revokeObjectURL(sourcePreview);
    setFile(selectedFile);
    setSourcePreview(URL.createObjectURL(selectedFile));
    dispatch(clearConversion());
  };

  const handleConvert = () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    formData.append("type", selectedType);
    dispatch(convertSvg(formData));
    setIsUploadOpen(false);
    if (sourcePreview) URL.revokeObjectURL(sourcePreview);
    setFile(null);
    setSourcePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const clearFile = () => {
    if (sourcePreview) URL.revokeObjectURL(sourcePreview);
    setFile(null); setSourcePreview(""); dispatch(clearConversion());
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return <div className="content"><div className="main-content svg-converter-page">
    <div className="svg-converter-header">
      <div><h1 className="heading-content">SVG Converter</h1><p className="text-content">Upload a PNG, JPG or JPEG and convert it to SVG.</p><div className="svg-format-pill"><span>PNG / JPG / JPEG</span><b>→</b><strong>SVG</strong></div></div>
      <button className="svg-upload-button" onClick={() => setIsUploadOpen(true)}>Upload</button>
      <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/jpg" onChange={handleFile} hidden />
    </div>
    <div className="svg-converter-grid">
      <section className="svg-converter-card"><label>Source image</label>
        <div className="svg-preview-area">{sourcePreview ? <img src={sourcePreview} alt="Selected source" /> : <span>Select a PNG, JPG or JPEG file</span>}</div>
        {file && <p className="svg-preview-help">Selected: {file.name}</p>}
        <div className="svg-converter-actions"><button className="svg-secondary-button" onClick={clearFile} disabled={!file}>Clear</button><button className="svg-primary-button svg-convert-action" onClick={handleConvert} disabled={!file || loading}>{loading ? "Converting..." : "Convert to SVG"}</button></div>
      </section>
      <section className="svg-converter-card svg-preview-card"><label>Converted SVG preview</label>
        <div className="svg-preview-area">{convertedUrl ? <img src={convertedUrl} alt="Converted SVG" /> : <span>Your converted preview will appear here</span>}</div>
        {convertedUrl && <a className="svg-primary-button svg-download-link" href={convertedUrl} download={`${file?.name?.replace(/\.(png|jpe?g)$/i, "") || "converted-image"}.svg`}>Download SVG</a>}
        {error && <p className="svg-error">{error}</p>}
      </section>
    </div>
    {isUploadOpen && <div className="svg-upload-modal-backdrop" onClick={() => setIsUploadOpen(false)}>
      <div className="svg-upload-modal" onClick={(event) => event.stopPropagation()}>
        <div className="svg-upload-modal-header"><h2>Upload image</h2><button onClick={() => setIsUploadOpen(false)} aria-label="Close">×</button></div>
        <label className="svg-modal-label">Choose image</label>
        <button className="svg-modal-file-button" onClick={() => fileInputRef.current?.click()}>{file ? file.name : "Choose PNG, JPG or JPEG"}</button>
        <label className="svg-modal-label" htmlFor="converter-type">Type</label>
        <select id="converter-type" className="svg-type-select" value={selectedType} onChange={(event) => setSelectedType(event.target.value)}>
          <option value="curtain">Curtain</option><option value="tablux">Tablelux</option>
        </select>
        <button className="svg-modal-submit" onClick={handleConvert} disabled={!file || loading}>{loading ? "Converting..." : "Submit"}</button>
      </div>
    </div>}
  </div></div>;
}
