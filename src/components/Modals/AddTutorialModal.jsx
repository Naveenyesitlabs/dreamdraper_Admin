import { useFormik } from 'formik';
import { PDFDocument } from 'pdf-lib';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';

const AddTutorialModal = ({ initialData = null, onSubmit, onReset }) => {
    const isEdit = Boolean(initialData);
    const MAX_SIZE = 50 * 1024 * 1024; // 50MB size limit
    const [uploadedFile, setUploadedFile] = useState(initialData?.file || null);
    const [tutorialCate, setTutorialCate] = useState([])
    const { allCategory } = useSelector((state) => state.TutorialAndMedia)

    useEffect(() => {
        if (allCategory) {
            setTutorialCate(allCategory);
        }
    }, [allCategory]);

    const formik = useFormik({
        initialValues: {
            id: initialData?.id || '',
            title: initialData?.title || '',
            category_id: initialData?.category_id || '',
            tutorial: initialData?.tutorial || null,
            duration: initialData?.duration || '',
            description: initialData?.description || '',
        },
        validationSchema: Yup.object({
            title: Yup.string()
                .min(2, 'Title must be at least 2 characters')
                .required('Title is required'),
            category_id: Yup.string().required('Type is required'),
            tutorial: Yup.lazy(() =>
                isEdit
                    ? Yup.mixed().nullable()
                    : Yup.mixed()
                        .required("File is required")
                        .test(
                            "fileSize",
                            "File size must be less than 50 MB",
                            value => !value || value.size <= MAX_SIZE
                        )
            ),
            duration: Yup.string().required('Duration/Length is required'),
            description: Yup.string()
                .min(5, 'Description must be at least 5 characters')
                .required('Description is required'),
        }),
        enableReinitialize: true,
        onSubmit: (values, { resetForm }) => {
            onSubmit(values, isEdit);
            resetForm();
            setUploadedFile(null);
            const modal = window.bootstrap.Modal.getInstance(document.getElementById('uploadTutorialModal'));
            modal.hide();
            if (isEdit) onReset();
        },
    });

    const getPdfPages = async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        console.log("getPageCount", pdfDoc.getPageCount())
        formik.setFieldValue('duration', `${pdfDoc.getPageCount()} pages`);
        return pdfDoc.getPageCount();
    };

    const trackOtherFileLength = async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const sizeInKB = (arrayBuffer.byteLength / 1024).toFixed(2);
        console.log('File size KB:', sizeInKB);
        formik.setFieldValue('duration', `${sizeInKB} KB`);
    };

    const trackVideoDuration = (file) => {
        const url = URL.createObjectURL(file);
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.src = url;

        video.onloadedmetadata = () => {
            URL.revokeObjectURL(url);
            const duration = video.duration; // in seconds
            console.log('Video duration (seconds):', duration);
            formik.setFieldValue('duration', formatDuration(duration));
        };
    };

    // const formatDuration = (seconds) => {
    //     const hrs = Math.floor(seconds / 3600);
    //     const mins = Math.floor((seconds % 3600) / 60);
    //     const secs = Math.floor(seconds % 60);
    //     const hh = String(hrs).padStart(2, '0');
    //     const mm = String(mins).padStart(2, '0');
    //     const ss = String(secs).padStart(2, '0');
    //     return `${hh}:${mm}:${ss}`;
    // };

    const formatDuration = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        const mm = String(mins).padStart(2, "0");
        const ss = String(secs).padStart(2, "0");
        if (hrs > 0) {
            const hh = String(hrs).padStart(2, "0");
            return `${hh}:${mm}:${ss}`;
        }
        return `${mm}:${ss}`;
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setUploadedFile(file);
        formik.setFieldValue('tutorial', file);
        const fileType = file.type;
        if (fileType.startsWith('video/')) {
            trackVideoDuration(file);
        } else if (fileType === 'application/pdf') {
            getPdfPages(file);
        } else {
            trackOtherFileLength(file);
        }
    };

    const handleFileDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        formik.setFieldValue("file", file);
        setUploadedFile(file);
    };

    const handleRemoveFile = () => {
        formik.setFieldValue('file', null);
        formik.setFieldValue('duration', '');
        setUploadedFile(null);
    };

    const closeModal = () => {
        formik.resetForm();
        setUploadedFile(null);
        onReset();
    };

    return (
        <div className="modal fade" id="uploadTutorialModal" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg" style={{ width: '462px' }}>
                <div className="modal-content upload-template-popup">

                    {/* Modal Header */}
                    <div className="modal-header upload-header">
                        <label className="modal-heading">
                            {isEdit ? 'Edit Tutorial' : 'Upload Tutorial'}
                        </label>
                        <img
                            src="./images/cross-dropdown.svg"
                            className="cross-dropdown"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            style={{ cursor: 'pointer' }}
                            onClick={closeModal}
                        />
                    </div>

                    {/* Form */}
                    <form onSubmit={formik.handleSubmit} className="upload-dropdowns">

                        {/* Title */}
                        <div>
                            <p className="upload-content-heading">Title</p>
                            <input
                                type="text"
                                placeholder="Enter Design Name"
                                className={`upload-content-input ${formik.touched.title && formik.errors.title ? 'is-invalid' : ''}`}
                                name="title"
                                value={formik.values.title}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.title && formik.errors.title && (
                                <div className="invalid-feedback">{formik.errors.title}</div>
                            )}
                        </div>

                        {/* Type */}
                        <div>
                            <p className="upload-content-heading">Type</p>
                            <select
                                className={`upload-content-input ${formik.touched.category_id && formik.errors.category_id ? 'is-invalid' : ''}`}
                                name="category_id"
                                value={formik.values.category_id}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <option value="">Select tutorial type</option> {/* default placeholder */}
                                {tutorialCate.map(t => (
                                    <option key={t.id} value={t.id}>
                                        {t.category_name}
                                    </option>
                                ))}
                            </select>

                            {formik.touched.category_id && formik.errors.category_id && (
                                <div className="invalid-feedback">{formik.errors.category_id}</div>
                            )}
                        </div>

                        {/* File Upload */}
                        <div
                            className="upload-section"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleFileDrop}

                        >
                            <p className="upload-heading">Upload File</p>

                            <input
                                type="file"
                                id="uploadDesignInput"
                                hidden
                                onChange={handleFileChange}
                            />

                            <label htmlFor="uploadDesignInput" className="upload-template-label">
                                <img src="./images/browse.svg" alt="upload" /><br />
                                <p className="upload-txt">Click to browse or drag and drop your file</p>
                            </label>

                            {formik.touched.tutorial && formik.errors.tutorial && (
                                <div className="invalid-feedback d-block">{formik.errors.tutorial}</div>
                            )}
                        </div>

                        {/* Uploaded File Preview */}
                        {uploadedFile && (
                            <div className="uploaded-content">
                                <div className="upload-text-another">
                                    <img src="./images/file.svg" className="fil-uploaded" />
                                    <p className="uploaded-txt">{uploadedFile.name}</p>
                                </div>
                                <div className="upload-text-another">
                                    <button type="button" className="image-size" style={{ cursor: "default", width: '75px' }}>
                                        {uploadedFile && (() => {
                                            const sizeInKB = uploadedFile.size / 1024;
                                            if (sizeInKB < 1024) {
                                                return `${sizeInKB.toFixed(0)} KB`;
                                            } else {
                                                const sizeInMB = sizeInKB / 1024;
                                                return `${sizeInMB.toFixed(2)} MB`;
                                            }
                                        })()}
                                    </button>
                                    <img
                                        src="./images/blue-cross.svg"
                                        className="blue-cross"
                                        onClick={handleRemoveFile}
                                        style={{ cursor: 'pointer' }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Duration */}
                        <div>
                            <p className="upload-content-heading">Duration/Length</p>
                            <input
                                type="text"
                                placeholder="e.g. 15:30, 8 pages"
                                className={`upload-content-input ${formik.touched.duration && formik.errors.duration ? 'is-invalid' : ''}`}
                                name="duration"
                                value={formik.values.duration}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.duration && formik.errors.duration && (
                                <div className="invalid-feedback">{formik.errors.duration}</div>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <p className="upload-content-heading">Description</p>
                            <textarea
                                placeholder="Enter design description..."
                                className={`upload-content-textarea ${formik.touched.description && formik.errors.description ? 'is-invalid' : ''}`}
                                name="description"
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.description && formik.errors.description && (
                                <div className="invalid-feedback">{formik.errors.description}</div>
                            )}
                        </div>

                        {/* Footer Buttons */}
                        <div style={{ display: 'flex', width: '100%', justifyContent: 'end', gap: '10px', marginTop: '15px' }}>
                            <button
                                type="button"
                                className="uploadCancel"
                                data-bs-dismiss="modal"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="uploadSubmit"
                               data-bs-dismiss={!Object.values(formik.errors).some(err => err) ? "modal" : undefined}
                            >
                                {isEdit ? 'Update Tutorial' : 'Add Tutorial'}
                            </button>
                        </div>
                        
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddTutorialModal;