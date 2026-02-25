import { useFormik } from "formik";
import * as Yup from "yup";

const AddEditCategory = ({ initialData = null, onSubmit, onReset }) => {
    const isEdit = Boolean(initialData);
    const formik = useFormik({
        initialValues: {
            id: initialData?.id || "",
            categoryName: initialData?.category_name || "",
        },
        validationSchema: Yup.object({
            categoryName: Yup.string()
                .trim()
                .required("Category name is required")
                .max(50, "Category name must be under 50 characters"),
        }),
        onSubmit: (values, { resetForm }) => {
            onSubmit(values, isEdit);
            if (isEdit) {
                onReset()
            }
            resetForm();
            const modalElement = document.getElementById("addCategoryModal");
            const modal = window.bootstrap.Modal.getInstance(modalElement);
            modal.style.display = 'none'
            modal.hide();
        },
        enableReinitialize: true,
    });

    const handleClose = () => {
        if (isEdit) {
            onReset()
        }
    }

    return (
        <div
            className="modal fade add-category-modal"
            id="addCategoryModal"
            tabIndex="-1"
            aria-labelledby="addCategoryModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content add-category-content">
                    {/* HEADER */}
                    <div className="modal-header add-category-header" style={{ justifyContent: 'space-between' }}>
                        <h5 className="modal-title add-category-title" id="addCategoryModalLabel">
                            {isEdit ? "Edit Category" : "Add Category"}
                        </h5>
                        <img
                            src="./images/cross-dropdown.svg"
                            className="cross-dropdown"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            style={{ cursor: "pointer" }}
                            onClick={handleClose}
                        />
                    </div>
                    <div className="modal-body add-category-body">
                        <form onSubmit={formik.handleSubmit} id="addCategoryForm">
                            <div className="mb-3">
                                <label htmlFor="addCategoryName" className="form-label category-name">
                                    Category Name
                                </label>
                                <input
                                    type="text"
                                    className={`category-input ${formik.touched.categoryName && formik.errors.categoryName ? "is-invalid" : ""}`}
                                    id="addCategoryName"
                                    name="categoryName"
                                    placeholder="Enter Category Name"
                                    value={formik.values.categoryName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.categoryName && formik.errors.categoryName && (
                                    <div className="invalid-feedback d-block">
                                        {formik.errors.categoryName}
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                    <div className="add-category-footer">
                        <button
                            type="button"
                            className="add-category-cancel"
                            data-bs-dismiss="modal"
                            onClick={handleClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="add-category-save"
                            // data-bs-dismiss="modal"
                            onClick={formik.handleSubmit}
                        >
                            {isEdit ? "Update" : "Submit"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddEditCategory;
