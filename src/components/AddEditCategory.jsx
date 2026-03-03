import { useFormik } from 'formik';
import * as Yup from 'yup';

const AddEditCategory = ({ initialData = null, onSubmit, onReset, isEdit }) => {

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            id: initialData?.id || '',
            category_name: initialData?.category_name || '',
            description: initialData?.description || ''
        },
        validationSchema: Yup.object({
            category_name: Yup.string().required('Category name is required'),
            description: Yup.string().required('Description is required')
        }),
        onSubmit: (values, { resetForm }) => {
            onSubmit(values, isEdit);
            onReset();
            resetForm();
        }
    });

    const closePopup = () => {
        onReset()
    }

    return (
        <div className="modal fade add-category-modal" id="addCategoryModal" tabIndex="-1" aria-labelledby="addCategoryModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content add-category-content">
                    <div className="modal-header add-category-header" style={{ justifyContent: 'space-between' }}>
                        <h5 className="modal-title add-category-title" id="addCategoryModalLabel">
                            {!isEdit ? 'Add Category' : 'Edit Category'}
                        </h5>
                        <img
                            src="./images/cross-dropdown.svg"
                            className="cross-dropdown"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            style={{ cursor: "pointer" }}
                            onClick={() => closePopup()}
                        />
                    </div>
                    <div className="modal-body add-category-body" style={{ paddingBottom: 0 }}>
                        <form onSubmit={formik.handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label category-name">Category Name</label>
                                <input
                                    type="text"
                                    className={`category-input ${formik.touched.category_name && formik.errors.category_name ? 'is-invalid' : ''}`}
                                    id="name"
                                    name="category_name"
                                    placeholder="Enter Category Name"
                                    value={formik.values.category_name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.category_name && formik.errors.category_name ? (
                                    <div className="invalid-feedback">{formik.errors.category_name}</div>
                                ) : null}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="description" className="form-label category-name">Description</label>
                                <textarea
                                    className={`category-desc ${formik.touched.description && formik.errors.description ? 'is-invalid' : ''}`}
                                    id="description"
                                    name="description"
                                    placeholder="Enter description..."
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                ></textarea>
                                {formik.touched.description && formik.errors.description ? (
                                    <div className="invalid-feedback">{formik.errors.description}</div>
                                ) : null}
                            </div>
                            <div className="add-category-footer">
                                <button type="button" className="add-category-cancel" data-bs-dismiss="modal" onClick={closePopup}>Cancel</button>
                                <button type="submit" className="add-category-save">{!isEdit ? 'Submit' : 'Save Changes'}</button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AddEditCategory;