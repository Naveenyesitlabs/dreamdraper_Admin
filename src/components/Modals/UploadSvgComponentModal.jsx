import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { allCategory, allSubCategory, getAllNestedCategory, getSubNestedCate } from "../../redux/admin/slices/libraryCategorySlice";
import { is3DComponentType, MATERIALS_TEXTURES_2D, MATERIALS_TEXTURES_3D } from "../../utils/healper/componentTypeHelper";

const FadeLoader = ({ loading, color = "#094271" }) => {
  if (!loading) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "4px",
        height: "40px",
      }}
    >
      {[0, 1, 2, 3, 4].map((index) => (
        <span
          key={index}
          style={{
            width: "5px",
            height: "24px",
            borderRadius: "999px",
            backgroundColor: color,
            opacity: 0.25 + index * 0.12,
            animation: `fadeLoader 1s ${index * 0.12}s infinite ease-in-out`,
          }}
        />
      ))}
    </div>
  );
};

const UploadSvgComponentModal = ({
  onSubmit,
  onReset,
  modalId = "uploadSvgComponentModal",
}) => {
  const dispatch = useDispatch();
  const hasFetched = useRef(false);
  const modalRootRef = useRef();
  const modalRef = useRef();
  const [uploadedThumbnail, setUploadedThumbnail] = useState(null);
  const [uploadedSvgComponent, setUploadedSvgComponent] = useState(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState(null);
  const [svgPreviewUrl, setSvgPreviewUrl] = useState(null);
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [nestedCategories, setNestedCategories] = useState([]);
  const [subNestedCategories, setSubNestedCategories] = useState([]);
  const [selectedCate, setSelectedCate] = useState(null);
  const [selectedSubCate, setSelectedSubCate] = useState(null);
  const [componentType, setComponentType] = useState(MATERIALS_TEXTURES_2D);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchMainCategories();
  }, []);

  useEffect(() => {
    if (!uploadedThumbnail || is3DComponentType(componentType) || !uploadedThumbnail.type?.startsWith("image/")) {
      setThumbnailPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(uploadedThumbnail);
    setThumbnailPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [uploadedThumbnail]);

  useEffect(() => {
    if (!uploadedSvgComponent) {
      setSvgPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(uploadedSvgComponent);
    setSvgPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [uploadedSvgComponent]);

  const fetchMainCategories = async () => {
    try {
      const res = await dispatch(allCategory({ type: "main_category" }));
      setMainCategories(res?.payload?.data);
    } catch (err) {
      console.error("Error fetching main categories:", err);
    }
  };

  const fetchSubCategories = async (mainCategoryId) => {
    try {
      if (mainCategoryId) {
        const res = await dispatch(allSubCategory({ category_id: mainCategoryId }));
        setSubCategories(res?.payload?.data);
        setNestedCategories([]);
        setSubNestedCategories([]);
      }
    } catch (err) {
      console.error("Error fetching sub categories:", err);
    }
  };

  const fetchNestedCategories = async (subCategoryId, cateId) => {
    try {
      const categoryId = selectedCate || cateId;
      if (categoryId && subCategoryId) {
        const res = await dispatch(getAllNestedCategory({ category_id: categoryId, subCategory_id: subCategoryId }));
        setNestedCategories(res?.payload?.data);
        setSubNestedCategories([]);
      }
    } catch (err) {
      console.error("Error fetching nested categories:", err);
    }
  };

  const fetchSubNestedCategories = async (nestedCategoryId, subCateId, cateId) => {
    try {
      const categoryId = selectedCate || cateId;
      const subCategoryId = selectedSubCate || subCateId;
      if (categoryId && subCategoryId && nestedCategoryId) {
        const res = await dispatch(getSubNestedCate({
          category_id: categoryId,
          subCategory_id: subCategoryId,
          nestedCategory_id: nestedCategoryId,
        }));
        setSubNestedCategories(res?.payload?.data);
      }
    } catch (err) {
      console.error("Error fetching sub-nested categories:", err);
    }
  };

  const formik = useFormik({
    initialValues: {
      component_type: MATERIALS_TEXTURES_2D,
      designe_name: "",
      category_id: "",
      subCategory_id: "",
      nestedCategory_id: "",
      subNestedCategory_id: "",
      description: "",
      price: "",
      is_paid: false,
      designe: null,
      svg_component: null,
    },
    validationSchema: Yup.object({
      component_type: Yup.string().required("Component Type is required"),
      designe_name: Yup.string().required("Design Name is required"),
      category_id: Yup.string().required("Main Category is required"),
      nestedCategory_id: Yup.string().nullable(),
      subNestedCategory_id: Yup.string().nullable(),
      designe: Yup.mixed().when("component_type", {
        is: (value) => is3DComponentType(value),
        then: () =>
          Yup.mixed().required("GLB file is required")
            .test("fileSize", "File size must be less than 50 MB", (value) => value && value.size <= 50 * 1024 * 1024)
            .test("fileType", "Only GLB files are allowed", (value) => !value || value.type === "model/gltf-binary" || value.name?.toLowerCase().endsWith(".glb")),
        otherwise: () =>
          Yup.mixed().required("Thumbnail is required")
            .test("fileSize", "File size must be less than 50 MB", (value) => value && value.size <= 50 * 1024 * 1024)
            .test("fileType", "Only JPG or PNG files are allowed", (value) => value && ["image/jpeg", "image/jpg", "image/png"].includes(value.type)),
      }),
      svg_component: Yup.mixed().when("component_type", {
        is: (value) => is3DComponentType(value),
        then: () => Yup.mixed().nullable(),
        otherwise: () =>
          Yup.mixed().required("SVG Component is required")
            .test("svgType", "Only SVG files are allowed", (value) => !value || value.type === "image/svg+xml" || value.name?.toLowerCase().endsWith(".svg")),
      }),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const isSuccess = await onSubmit(values, false, modalId);
        if (!isSuccess) return;

        resetForm();
        setUploadedThumbnail(null);
        setUploadedSvgComponent(null);
        setComponentType(MATERIALS_TEXTURES_2D);
        setSelectedSubCate(null);
        setSelectedCate(null);
        if (onReset) onReset();
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleThumbnailChange = (e) => {
    const file = e.currentTarget.files[0];
    if (!file) return;

    formik.setFieldTouched("designe", true, false);
    formik.setFieldValue("designe", file);
    setUploadedThumbnail(file);

    const fileName = file.name.replace(/\.[^/.]+$/, "");
    formik.setFieldValue("designe_name", fileName);
  };

  const handleSvgComponentChange = (e) => {
    const file = e.currentTarget.files[0];
    if (!file) return;

    formik.setFieldTouched("svg_component", true, false);
    formik.setFieldValue("svg_component", file);
    setUploadedSvgComponent(file);
  };

  const removeThumbnail = () => {
    formik.setFieldValue("designe", null);
    setUploadedThumbnail(null);
  };

  const removeSvgComponent = () => {
    formik.setFieldValue("svg_component", null);
    setUploadedSvgComponent(null);
  };

  const closeModal = () => {
    formik.resetForm();
    setUploadedThumbnail(null);
    setUploadedSvgComponent(null);
    setComponentType(MATERIALS_TEXTURES_2D);
    setSelectedSubCate(null);
    setSelectedCate(null);
    if (onReset) onReset();
  };

  const handleComponentTypeChange = (e) => {
    const nextType = e.target.value;
    setComponentType(nextType);
    formik.handleChange(e);

    formik.setFieldValue("designe", null);
    setUploadedThumbnail(null);

    if (is3DComponentType(nextType)) {
      formik.setFieldValue("svg_component", null);
      setUploadedSvgComponent(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      const isModalOpen = modalRootRef.current?.classList.contains("show");

      if (!isModalOpen) return;

      if (modalRef.current && !modalRef.current.contains(e.target)) {
        closeModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="modal fade"
      id={modalId}
      tabIndex="-1"
      aria-hidden="true"
      ref={modalRootRef}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg" style={{ width: "462px" }}>
        <div className="modal-content upload-template-popup" ref={modalRef} style={{ position: "relative" }}>
          {formik.isSubmitting && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 10,
                background: "rgba(255, 255, 255, 0.78)",
                backdropFilter: "blur(1px)",
                borderRadius: "inherit",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <style>
                {`
                  @keyframes fadeLoader {
                    0%, 100% { opacity: 0.2; transform: scaleY(0.55); }
                    50% { opacity: 1; transform: scaleY(1); }
                  }
                `}
              </style>
              <FadeLoader loading={formik.isSubmitting} />
              <p style={{ margin: 0, color: "#094271", fontWeight: 600, fontSize: "14px" }}>
                Uploading...
              </p>
            </div>
          )}
          <div className="modal-header upload-header">
            <label className="modal-heading">Upload SVG Component</label>

            <img
              src="/images/cross-dropdown.svg"
              data-bs-dismiss="modal"
              aria-label="Close"
              className="cross-dropdown"
              style={{ cursor: formik.isSubmitting ? "not-allowed" : "pointer", opacity: formik.isSubmitting ? 0.5 : 1 }}
              onClick={formik.isSubmitting ? undefined : closeModal}
            />
          </div>

          <form className="upload-dropdowns" onSubmit={formik.handleSubmit}>
            <div>
              <p className="upload-content-heading">Component Type</p>
              <select
                name="component_type"
                value={formik.values.component_type}
                onChange={handleComponentTypeChange}
                onBlur={formik.handleBlur}
                className={`upload-content-input ${formik.touched.component_type && formik.errors.component_type ? "is-invalid" : ""}`}
              >
                <option value={MATERIALS_TEXTURES_2D}>{MATERIALS_TEXTURES_2D}</option>
                <option value={MATERIALS_TEXTURES_3D}>{MATERIALS_TEXTURES_3D}</option>
              </select>
              {formik.touched.component_type && formik.errors.component_type && (
                <div className="invalid-feedback">{formik.errors.component_type}</div>
              )}
            </div>

            <div className="upload-section">
              <p className="upload-content-heading mb-2">{is3DComponentType(componentType) ? "Upload GLB" : "Upload Thumbnail"}</p>

              <input
                type="file"
                id={`${modalId}ThumbnailInput`}
                hidden
                accept={is3DComponentType(componentType) ? ".glb,model/gltf-binary" : ".jpg,.jpeg,.png,image/jpeg,image/png"}
                onChange={handleThumbnailChange}
              />

              <label
                htmlFor={`${modalId}ThumbnailInput`}
                className={`upload-template-label ${thumbnailPreviewUrl ? "upload-preview-filled" : ""}`}
                style={thumbnailPreviewUrl ? {
                  position: "relative",
                  display: "block",
                  padding: 0,
                  overflow: "hidden",
                  background: "#eef2f7",
                } : undefined}
              >
                {thumbnailPreviewUrl ? (
                  <>
                    <img
                      src={thumbnailPreviewUrl}
                      alt="Thumbnail preview"
                      className="upload-preview-full-image upload-preview-full-image-thumbnail"
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        maxWidth: "none",
                        maxHeight: "none",
                        display: "block",
                        objectFit: "cover",
                      }}
                    />
                    <button
                      type="button"
                      className="upload-preview-remove upload-preview-remove-side"
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        zIndex: 2,
                        width: "28px",
                        height: "28px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid rgba(255, 255, 255, 0.65)",
                        borderRadius: "999px",
                        background: "rgba(255, 255, 255, 0.18)",
                        padding: 0,
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeThumbnail();
                      }}
                    >
                      <img src="/images/blue-cross.svg" className="blue-cross" alt="remove" />
                    </button>
                    <div
                      className="upload-preview-overlay"
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 1,
                        display: "flex",
                        alignItems: "center",
                        padding: "10px 12px",
                        background: "linear-gradient(180deg, rgba(9, 66, 113, 0) 0%, rgba(9, 66, 113, 0.82) 100%)",
                      }}
                    >
                      <p
                        className="upload-preview-file-name"
                        style={{
                          margin: 0,
                          color: "#fff",
                          fontFamily: "Segoe UI",
                          fontSize: "12px",
                          fontWeight: 500,
                          lineHeight: "16px",
                          textAlign: "left",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          flex: 1,
                        }}
                      >
                        {uploadedThumbnail?.name}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <img src="./images/browse.svg" alt="upload" />
                    <br />
                    <p className="upload-txt">
                      {is3DComponentType(componentType) && uploadedThumbnail
                        ? uploadedThumbnail.name
                        : is3DComponentType(componentType)
                          ? "Click to browse or drag and drop your GLB file"
                          : "Click to browse or drag and drop your thumbnail"}
                    </p>
                  </>
                )}
              </label>

              {formik.touched.designe && formik.errors.designe && (
                <div className="invalid-feedback d-block">{formik.errors.designe}</div>
              )}
            </div>

            {!is3DComponentType(componentType) && (
              <div>
                <p className="upload-content-heading">SVG Component</p>

                <input
                  type="file"
                  id={`${modalId}SvgInput`}
                  hidden
                  accept=".svg,image/svg+xml"
                  onChange={handleSvgComponentChange}
                />

                <label
                  htmlFor={`${modalId}SvgInput`}
                  className={`upload-template-label ${svgPreviewUrl ? "upload-preview-filled" : ""}`}
                  style={svgPreviewUrl ? {
                    position: "relative",
                    display: "block",
                    padding: 0,
                    overflow: "hidden",
                    background: "#eef2f7",
                  } : undefined}
                >
                  {svgPreviewUrl ? (
                    <>
                      <img
                        src={svgPreviewUrl}
                        alt="SVG preview"
                        className="upload-preview-full-image upload-preview-full-image-svg"
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          maxWidth: "none",
                          maxHeight: "none",
                          display: "block",
                          objectFit: "fill",
                        }}
                      />
                      <button
                        type="button"
                        className="upload-preview-remove upload-preview-remove-side"
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          zIndex: 2,
                          width: "28px",
                          height: "28px",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1px solid rgba(255, 255, 255, 0.65)",
                          borderRadius: "999px",
                          background: "rgba(255, 255, 255, 0.18)",
                          padding: 0,
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeSvgComponent();
                        }}
                      >
                        <img src="/images/blue-cross.svg" className="blue-cross" alt="remove" />
                      </button>
                      <div
                        className="upload-preview-overlay"
                        style={{
                          position: "absolute",
                          left: 0,
                          right: 0,
                          bottom: 0,
                          zIndex: 1,
                          display: "flex",
                          alignItems: "center",
                          padding: "10px 12px",
                          background: "linear-gradient(180deg, rgba(9, 66, 113, 0) 0%, rgba(9, 66, 113, 0.82) 100%)",
                        }}
                      >
                        <p
                          className="upload-preview-file-name"
                          style={{
                            margin: 0,
                            color: "#fff",
                            fontFamily: "Segoe UI",
                            fontSize: "12px",
                            fontWeight: 500,
                            lineHeight: "16px",
                            textAlign: "left",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            flex: 1,
                          }}
                        >
                          {uploadedSvgComponent?.name}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <img src="./images/browse.svg" alt="upload" />
                      <br />
                      <p className="upload-txt">Click to browse or drag and drop your SVG component</p>
                    </>
                  )}
                </label>

                {formik.touched.svg_component && formik.errors.svg_component && (
                  <div className="invalid-feedback d-block">{formik.errors.svg_component}</div>
                )}
              </div>
            )}

            <div>
              <p className="upload-content-heading">Design Name</p>
              <input
                type="text"
                name="designe_name"
                placeholder="Enter Design Name"
                className={`upload-content-input ${formik.touched.designe_name && formik.errors.designe_name ? "is-invalid" : ""}`}
                value={formik.values.designe_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.designe_name && formik.errors.designe_name && (
                <div className="invalid-feedback">{formik.errors.designe_name}</div>
              )}
            </div>

            <div>
              <p className="upload-content-heading">Main Category</p>
              <select
                name="category_id"
                value={formik.values.category_id}
                onChange={(e) => {
                  formik.handleChange(e);
                  setSelectedCate(e.target.value);
                  fetchSubCategories(e.target.value);
                  formik.setFieldValue("subCategory_id", "");
                  formik.setFieldValue("nestedCategory_id", "");
                  formik.setFieldValue("subNestedCategory_id", "");
                }}
                onBlur={formik.handleBlur}
                className={`upload-content-input ${formik.touched.category_id && formik.errors.category_id ? "is-invalid" : ""}`}
              >
                <option value="" disabled>Select Main Category</option>
                {mainCategories?.map((cat) => (
                  <option key={cat?.id} value={cat?.id}>{cat?.category_name}</option>
                ))}
              </select>
              {formik.touched.category_id && formik.errors.category_id && (
                <div className="invalid-feedback">{formik.errors.category_id}</div>
              )}
            </div>

            <div>
              <p className="upload-content-heading">Sub Category</p>
              <select
                name="subCategory_id"
                value={formik.values.subCategory_id}
                onChange={(e) => {
                  formik.handleChange(e);
                  setSelectedSubCate(e.target.value);
                  fetchNestedCategories(e.target.value);
                  formik.setFieldValue("nestedCategory_id", "");
                  formik.setFieldValue("subNestedCategory_id", "");
                }}
                onBlur={formik.handleBlur}
                disabled={!formik.values.category_id}
                className={`upload-content-input ${formik.touched.subCategory_id && formik.errors.subCategory_id ? "is-invalid" : ""}`}
              >
                <option value="" disabled>Select Sub Category</option>
                {subCategories?.map((cat) => (
                  <option key={cat?.id} value={cat?.id}>{cat?.sub_category_name}</option>
                ))}
              </select>
              {formik.touched.subCategory_id && formik.errors.subCategory_id && (
                <div className="invalid-feedback">{formik.errors.subCategory_id}</div>
              )}
            </div>

            <div>
              <p className="upload-content-heading">Nested Category</p>
              <select
                name="nestedCategory_id"
                value={formik.values.nestedCategory_id}
                onChange={(e) => {
                  formik.handleChange(e);
                  fetchSubNestedCategories(e.target.value);
                  formik.setFieldValue("subNestedCategory_id", "");
                }}
                onBlur={formik.handleBlur}
                disabled={!formik.values.subCategory_id}
                className={`upload-content-input ${formik.touched.nestedCategory_id && formik.errors.nestedCategory_id ? "is-invalid" : ""}`}
              >
                <option value="" disabled>Select Nested Category</option>
                {nestedCategories?.map((cat) => (
                  <option key={cat?.id} value={cat?.id}>{cat?.nested_category_name}</option>
                ))}
              </select>
              {formik.touched.nestedCategory_id && formik.errors.nestedCategory_id && (
                <div className="invalid-feedback">{formik.errors.nestedCategory_id}</div>
              )}
            </div>

            <div>
              <p className="upload-content-heading">Sub-Nested Category</p>
              <select
                name="subNestedCategory_id"
                value={formik.values.subNestedCategory_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!formik.values.nestedCategory_id}
                className={`upload-content-input ${formik.touched.subNestedCategory_id && formik.errors.subNestedCategory_id ? "is-invalid" : ""}`}
              >
                <option value="" disabled>Select Sub-Nested Category</option>
                {subNestedCategories?.map((cat) => (
                  <option key={cat?.id} value={cat?.id}>{cat?.sub_nested_category_name}</option>
                ))}
              </select>
              {formik.touched.subNestedCategory_id && formik.errors.subNestedCategory_id && (
                <div className="invalid-feedback">{formik.errors.subNestedCategory_id}</div>
              )}
            </div>

            <div style={{ display: "flex", width: "100%", justifyContent: "end", gap: "10px", marginTop: "15px" }}>
              <button type="button" className="uploadCancel" onClick={closeModal} data-bs-dismiss="modal" aria-label="Close" disabled={formik.isSubmitting}>
                Cancel
              </button>
              <button type="submit" className="uploadSubmit" disabled={formik.isSubmitting}>
                {formik.isSubmitting ? "Uploading..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadSvgComponentModal;
