import { useFormik } from 'formik';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { getCategory } from '../../redux/admin/slices/libraryCategorySlice';

const AddEditShowcases = ({ initialData = null, onSubmit }) => {
    const dispatch = useDispatch();
    const hasFetched = useRef(false);
    const isEdit = Boolean(initialData);
    const MAX_SIZE = 50 * 1024 * 1024; // 50MB size limit
    // const [uploadedFile, setUploadedFile] = useState(initialData?.file || null);
    const [uploadedFile, setUploadedFile] = useState(null);

    useEffect(() => {
        setUploadedFile(null);
    }, [initialData]);

    const [tutorialCate, setTutorialCate] = useState([])
    const { mainCategoryData } = useSelector((state) => state.libCategory);

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        dispatch(getCategory({ type: 'showcase_category' }));
    }, [dispatch]);

    useEffect(() => {
        if (mainCategoryData) {
            setTutorialCate(mainCategoryData);
        }
    }, [mainCategoryData]);

    const formik = useFormik({
        initialValues: {
            id: initialData?.id || '',
            title: initialData?.title || '',
            category_id: initialData?.category_id || '',
            file: initialData?.file || null,
            description: initialData?.description || '',
        },
        validationSchema: Yup.object({
            title: Yup.string()
                .min(2, 'Title must be at least 2 characters')
                .required('Title is required'),
            category_id: Yup.string().required('Type is required'),
            file: Yup.lazy(() =>
                isEdit
                    ? Yup.mixed().nullable()
                    : Yup.mixed()
                        .required("File is required")
                        .test(
                            "fileSize",
                            "File size must be less than 250 MB",
                            value => !value || value.size <= MAX_SIZE
                        )
            ),
            description: Yup.string()
                .min(5, 'Description must be at least 5 characters')
                .required('Description is required'),
        }),
        enableReinitialize: true,
        onSubmit: (values, { resetForm }) => {
            console.log("values", values)
            const formData = new FormData()
            if (isEdit && values.id) {
                formData.append('id', values.id);
            }
            formData.append('title', values.title);
            formData.append('category_id', values.category_id || '');
            formData.append('description', values.description || '');
            // formData.append('file', values.file || '');
            if (values.file instanceof File) {
                formData.append('file', values.file);
            }
            onSubmit(formData, isEdit);
            resetForm();
            setUploadedFile(null);
            const modal = window.bootstrap.Modal.getInstance(document.getElementById('uploadTemplateModal'));
            modal.hide();
            // if (isEdit) onReset();

        },
    });


    const handleFileChange = (event) => {
        console.log("event", event.target.files[0])
        const file = event.target.files[0];
        setUploadedFile(file);
        formik.setFieldValue('file', file);
    };

    const handleFileDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        formik.setFieldValue("file", file);
        setUploadedFile(file);
    };

    const handleRemoveFile = () => {
        formik.setFieldValue('file', null);
        setUploadedFile(null);
    };

    const closeModal = () => {
        formik.resetForm();
        setUploadedFile(null);
        // onReset();
    };

    // ---------------- File Type Detection ----------------

    const getFileType = (fileSrc) => {
        if (uploadedFile) return uploadedFile.type;

        if (!fileSrc) return '';

        const ext = fileSrc.split('.').pop().toLowerCase();

        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image/*';
        if (['mp4', 'webm'].includes(ext)) return 'video/mp4';

        return '';
    };

    // ---------------- Preview ----------------
    console.log("checkintialvaluess", initialData?.imageURL)
    const renderFilePreview = () => {
        let fileSrc = null;

        // ✅ if new file uploaded
        if (uploadedFile instanceof File) {
            fileSrc = URL.createObjectURL(uploadedFile);
        }
        // ✅ if edit mode (existing file URL)
        else if (initialData?.imageURL) {
            fileSrc = initialData.imageURL;
        }

        if (!fileSrc) return null;

        const fileType = uploadedFile?.type || getFileType(fileSrc);

        if (fileType?.startsWith("image/")) {
            return (
                <img
                    src={fileSrc}
                    alt="preview"
                    style={{
                        width: "100%",
                        height: "140px",
                        objectFit: "cover",
                        borderRadius: "8px"
                    }}
                />
            );
        }

        if (fileType?.startsWith("video/")) {
            return (
                <video
                    src={fileSrc}
                    controls
                    style={{
                        width: "100%",
                        height: "140px",
                        objectFit: "cover",
                        borderRadius: "8px"
                    }}
                />
            );
        }

        return <p style={{ fontSize: "12px" }}>Preview not available</p>;
    };
    return (
        <div className="modal fade" id="uploadTemplateModal" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg" style={{ width: '462px' }}>
                <div className="modal-content upload-template-popup">

                    {/* Modal Header */}
                    <div className="modal-header upload-header">
                        <label className="modal-heading">
                            {isEdit ? 'Edit Showcase' : 'Upload Showcase'}
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

                        <div>
                            <p className="upload-content-heading">Category</p>
                            <select
                                className={`upload-content-input ${formik.touched.category_id && formik.errors.category_id ? 'is-invalid' : ''}`}
                                name="category_id"
                                value={formik.values.category_id}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <option value="">Select Showcase Category</option> {/* default placeholder */}
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

                            <div
                                className="upload-template-label"
                                style={{
                                    border: "1px dashed #ccc",
                                    padding: "10px",
                                    borderRadius: "10px",
                                    textAlign: "center"
                                }}
                            >
                                {uploadedFile || initialData?.imageURL ? (
                                    renderFilePreview()
                                ) : (
                                    <label htmlFor="uploadDesignInput" style={{ cursor: "pointer" }}>
                                        <img src="./images/browse.svg" alt="upload" /><br />
                                        <p>Click or drag file</p>
                                    </label>
                                )}
                            </div>
                        </div>

                        {(uploadedFile instanceof File || initialData?.imageURL) && (
                            <div className="uploaded-content">
                                <div className="upload-text-another">
                                    <img src="./images/file.svg" className="fil-uploaded" alt='file icon' />

                                    <p className="uploaded-txt">
                                        {uploadedFile instanceof File
                                            ? uploadedFile.name
                                            : initialData?.file || "Existing file"}
                                    </p>
                                </div>

                                <div className="upload-text-another">

                                    {/* ✅ Show size ONLY for new upload */}
                                    {uploadedFile instanceof File && (
                                        <button
                                            type="button"
                                            className="image-size"
                                            style={{ cursor: "default", width: '75px' }}
                                        >
                                            {(() => {
                                                const sizeInKB = uploadedFile.size / 1024;
                                                if (sizeInKB < 1024) {
                                                    return `${sizeInKB.toFixed(0)} KB`;
                                                } else {
                                                    const sizeInMB = sizeInKB / 1024;
                                                    return `${sizeInMB.toFixed(2)} MB`;
                                                }
                                            })()}
                                        </button>
                                    )}

                                    {/* ✅ Remove works for both */}
                                    <img
                                        src="./images/blue-cross.svg"
                                        className="blue-cross"
                                        onClick={handleRemoveFile}
                                        style={{ cursor: 'pointer' }}
                                        alt='cross'
                                    />
                                </div>
                            </div>
                        )}
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
                            >
                                {isEdit ? 'Update Showcase' : 'Add Showcase'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddEditShowcases;