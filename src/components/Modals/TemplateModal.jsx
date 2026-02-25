import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { allCategory, allSubCategory, getAllNestedCategory, getSubNestedCate } from "../../redux/admin/slices/libraryCategorySlice";

const TemplateModal = ({ initialData = null, onSubmit, onReset, isEdit, isView }) => {
  const dispatch = useDispatch()
  const hasFetched = useRef(false);
  const modalRef = useRef();
  const [uploadedFile, setUploadedFile] = useState(initialData?.designe || null);
  const [mainCategories, setMainCategories] = useState([]);
  const [existingFileUrl, setExistingFileUrl] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [nestedCategories, setNestedCategories] = useState([]);
  const [subNestedCategories, setSubNestedCategories] = useState([]);
  const [selectedCate, setSelectedCate] = useState(null)
  const [selectedSubCate, setSelectedSubCate] = useState(null)

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchMainCategories();
  }, []);

  useEffect(() => {
    const fetchAllCateData = async () => {
      try {
        if (isEdit) {
          await fetchSubCategories(initialData.category_id);
          await fetchNestedCategories(initialData.subCategory_id, Number(initialData.category_id));
          await fetchSubNestedCategories(initialData.nestedCategory_id, initialData.subCategory_id, initialData.category_id)
        }
      } catch (error) {
        console.log("Error to featching the Edited Data:-", error)
      }
    }
    fetchAllCateData()
  }, [initialData]);

  useEffect(() => {
    if (isEdit && initialData?.uploaded_designe) {
      setExistingFileUrl(initialData.uploaded_designe);
    } else {
      setExistingFileUrl(null);
    }
  }, [initialData, isEdit]);


  const fetchMainCategories = async () => {
    try {
      const res = await dispatch(allCategory({ type: 'main_category' }))
      console.log("allCategory", res?.payload?.data)
      setMainCategories(res?.payload?.data);
    } catch (err) {
      console.error("Error fetching main categories:", err);
    }
  };

  const fetchSubCategories = async (mainCategoryId) => {
    try {
      if (mainCategoryId) {
        const res = await dispatch(allSubCategory({ category_id: mainCategoryId }));
        console.log("allSubCategory", res?.payload?.data)
        setSubCategories(res?.payload?.data);
        setNestedCategories([]);
        setSubNestedCategories([]);
      }
    } catch (err) {
      console.error("Error fetching sub categories:", err);
    }
  };

  const fetchNestedCategories = async (subCategoryId, cate_id) => {
    try {
      let category_id = selectedCate ? selectedCate : cate_id
      if (category_id && subCategoryId) {
        const res = await dispatch(getAllNestedCategory({ category_id: category_id, subCategory_id: subCategoryId }))
        console.log("getAllNestedCategory", res?.payload?.data)
        setNestedCategories(res?.payload?.data);
        setSubNestedCategories([]);
      }
    } catch (err) {
      console.error("Error fetching nested categories:", err);
    }
  };

  const fetchSubNestedCategories = async (nestedCategoryId, subCate_id, cate_id) => {
    try {
      let updatedCategory = selectedCate ? selectedCate : cate_id;
      let updatedSubCategory = selectedSubCate ? selectedSubCate : subCate_id;
      if (updatedCategory && updatedSubCategory && nestedCategoryId) {
        const res = await dispatch(getSubNestedCate({ category_id: updatedCategory, subCategory_id: updatedSubCategory, nestedCategory_id: nestedCategoryId }))
        console.log("getSubNestedCate", res?.payload?.data)
        setSubNestedCategories(res?.payload?.data);
      }
    } catch (err) {
      console.error("Error fetching sub-nested categories:", err);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: initialData?.id ?? '',
      designe_name: initialData?.designe_name ?? "",
      category_id: initialData?.category_id ?? "",
      subCategory_id: initialData?.subCategory_id ?? "",
      nestedCategory_id: initialData?.nestedCategory_id ?? "",
      subNestedCategory_id: initialData?.subNestedCategory_id ?? "",
      description: initialData?.description ?? "",
      price: initialData?.price ?? "",
      is_paid: initialData?.is_paid ?? false,
      file: initialData?.file ?? null,
    },
    validationSchema: Yup.object({
      designe_name: Yup.string().required("Design Name is required"),
      category_id: Yup.string().required("Main Category is required"),
      subCategory_id: Yup.string().required("Sub-Category is required"),
      // nestedCategory_id: Yup.string().required("Nested Category is required"),
      // subNestedCategory_id: Yup.string().required("Sub-Nested Category is required"),
      nestedCategory_id: Yup.string().nullable(),
      subNestedCategory_id: Yup.string().nullable(),
      // description: Yup.string().required("Description is required"),
      description: Yup.string().nullable(),
      is_paid: Yup.boolean(),
      price: Yup.number().when("is_paid", {
        is: true,
        then: (schema) =>
          schema.required("Price is required").min(0, "Price must be at least 0"),
        otherwise: (schema) => schema.notRequired(),
      }),

      designe: isEdit
        ? Yup.mixed().notRequired().test("fileSize", "File size must be less than 50 MB", (value) => !value || value.size <= 50 * 1024 * 1024
        ).test("fileType", "Only JPG Or PNG files are allowed", (value) => !value || ["image/jpeg", "image/jpg", "image/png"].includes(
          value.type
        )) :
        Yup.mixed().required("File is required").test("fileSize", "File size must be less than 50 MB", (value) => value && value.size <= 50 * 1024 * 1024
        ).test("fileType", "Only JPG or PNG files are allowed", (value) => value && ["image/jpeg", "image/jpg", "image/png"].includes(
          value.type
        )),
    }),
    onSubmit: (values, { resetForm }) => {
      onSubmit(values, isEdit);
      resetForm();
      setUploadedFile(null);
      setSelectedSubCate(null)
      setSelectedCate(null)
      if (onReset) onReset();
      // document.querySelector('[data-bs-dismiss="modal"]')?.click();
    },
  });

  // const handleFileChange = (e) => {
  //   const file = e.currentTarget.files[0];
  //   formik.setFieldValue("designe", file);
  //   setUploadedFile(file);
  // };

  const handleFileChange = (e) => {
    const file = e.currentTarget.files[0];
    formik.setFieldValue("designe", file);
    setUploadedFile(file);
    setExistingFileUrl(null); // remove old preview when new file selected
  };


  const removeFile = () => {
    formik.setFieldValue("designe", null);
    setUploadedFile(null);
  };

  const closeModal = () => {
    formik.resetForm();
    setUploadedFile(null);
    setSelectedSubCate(null)
    setSelectedCate(null)
    if (onReset) onReset();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
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
      id="uploadTemplateModal"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg" style={{ width: "462px" }}>
        <div className="modal-content upload-template-popup">
          <div className="modal-header upload-header">
            <label className="modal-heading">{isView ? "View Design" : isEdit ? "Edit Design" : "Upload Design"}</label>

            <img
              src="/images/cross-dropdown.svg"
              data-bs-dismiss="modal"
              aria-label="Close"
              className="cross-dropdown"
              style={{ cursor: "pointer" }}
              onClick={closeModal}
            />
          </div>

          <form className="upload-dropdowns" onSubmit={formik.handleSubmit}>
            {isView
              ? (
                <div className="upload-section">
                  <p className="upload-heading">Uploaded Design</p>
                  {/* <div className="upload-template-label">
                    <img src={initialData?.uploaded_designe} alt="Uploaded design" className="upload-template-label" />
                  </div> */}
                  <img src={initialData?.uploaded_designe} alt="Uploaded design" className="upload-template-label" />
                </div>
              )
              : (
                // <div className="upload-section">
                //   <p className="upload-heading">Upload Design</p>
                //   <input type="file" id="uploadDesignInput" hidden onChange={handleFileChange} disabled={isView} />
                //   <label htmlFor="uploadDesignInput" className="upload-template-label">
                //     <img src="/images/browse.svg" alt="upload" />
                //     <br />
                //     <p className="upload-txt">Click to browse or drag and drop your file</p>
                //   </label>
                //   {formik.touched.designe && formik.errors.designe && (
                //     <div className="invalid-feedback d-block">{formik.errors.designe}</div>
                //   )}
                // </div>
                <div className="upload-section">
                  <p className="upload-heading">Upload File</p>

                  <input type="file" id="uploadDesignInput" hidden onChange={handleFileChange} disabled={isView} />

                  <label htmlFor="uploadDesignInput" className="upload-template-label">
                    <img src="./images/browse.svg" alt="upload" />
                    <br />

                    <p className="upload-txt">
                      {uploadedFile
                        ? uploadedFile.name
                        : existingFileUrl
                          ? `Current file: ${existingFileUrl.split("/").pop()}`
                          : 'Click to browse or drag and drop your file'}
                    </p>

                  </label>

                  {/* View existing file (edit mode only, no replacement yet) */}
                  {existingFileUrl && !uploadedFile && (
                    <p style={{ fontSize: '12px', marginTop: '6px' }}>
                      <a
                        href={existingFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View current file
                      </a>
                    </p>
                  )}
                </div>
              )}


            {uploadedFile && (
              <div className="uploaded-content">
                <div className="upload-text-another">
                  <img src="/images/file.svg" className="fil-uploaded" alt="file" />
                  <p className="uploaded-txt">{uploadedFile.name}</p>
                </div>

                <div className="upload-text-another">
                  <button type="button" className="image-size" style={{ cursor: "default", width: '65px' }}>
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
                    src="/images/blue-cross.svg"
                    className="blue-cross"
                    alt="remove"
                    style={{ cursor: "pointer" }}
                    onClick={removeFile}
                  />
                </div>
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
                disabled={isView}
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
                  setSelectedCate(e.target.value)
                  fetchSubCategories(e.target.value);
                  formik.setFieldValue("subCategory_id", "");
                  formik.setFieldValue("nestedCategory_id", "");
                  formik.setFieldValue("subNestedCategory_id", "");
                }}
                onBlur={formik.handleBlur}
                className={`upload-content-input ${formik.touched.category_id && formik.errors.category_id ? "is-invalid" : ""}`}
                disabled={isView}
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
                  setSelectedSubCate(e.target.value)
                  fetchNestedCategories(e.target.value);
                  formik.setFieldValue("nestedCategory_id", "");
                  formik.setFieldValue("subNestedCategory_id", "");
                }}
                onBlur={formik.handleBlur}
                disabled={!formik.values.category_id || isView}
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
                disabled={!formik.values.subCategory_id || isView}
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
                disabled={!formik.values.nestedCategory_id || isView}
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

            <div>
              <p className="upload-content-heading">Description</p>
              <textarea
                name="description"
                placeholder="Enter design description..."
                className={`upload-content-textarea ${formik.touched.description && formik.errors.description ? "is-invalid" : ""}`}
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isView}
              />
              {formik.touched.description && formik.errors.description && (
                <div className="invalid-feedback">{formik.errors.description}</div>
              )}
            </div>

            <div className="upload-payment">
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <span className="upload-content-heading">Unpaid</span>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input custom-switch"
                    type="checkbox"
                    name="is_paid"
                    checked={formik.values.is_paid}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isView}
                  />
                </div>
                <span className="upload-content-heading">Paid</span>
              </div>
              {formik.values.is_paid && (
                <>
                  <p className="pricee">Price ($)</p>
                  <input
                    type="number"
                    name="price"
                    placeholder="20"
                    className={`number-input ${formik.touched.price && formik.errors.price ? "is-invalid" : ""}`}
                    value={formik.values.price}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isView}
                  />
                  {formik.touched.price && formik.errors.price && (
                    <div className="invalid-feedback">{formik.errors.price}</div>
                  )}
                </>
              )}
            </div>
            <div style={{ display: "flex", width: "100%", justifyContent: "end", gap: "10px", marginTop: "15px" }}>
              <button type="button" className="uploadCancel" onClick={closeModal} data-bs-dismiss="modal"
                aria-label="Close">
                Cancel
              </button>
              {!isView && (
                <button type="submit" className="uploadSubmit" >
                  {isEdit ? "Update" : "Submit"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div >
    </div >
  );
};

export default TemplateModal;