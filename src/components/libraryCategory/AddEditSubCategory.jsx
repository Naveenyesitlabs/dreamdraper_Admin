import { useFormik } from 'formik';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { allCategory } from '../../redux/admin/slices/libraryCategorySlice';

const AddEditSubCategory = ({ initialData = null, onSubmit, onReset, isEdit }) => {
    const hasFetched = useRef(false);
    // const isEdit = Boolean(initialData);
    const dispatch = useDispatch();
    const [category, setCategory] = useState([])
    const formik = useFormik({
        initialValues: {
            id: initialData?.id || "",
            category_id: initialData?.category_id || '',
            sub_category_name: initialData?.sub_category_name || '',
        },
        validationSchema: Yup.object({
            category_id: Yup.string().required('Main category is required'),
            sub_category_name: Yup.string()
                .min(2, 'Must be at least 2 characters')
                .required('Sub-category name is required'),
        }),
        enableReinitialize: true,
        onSubmit: (values, { resetForm }) => {
            onSubmit(values, isEdit);
            onReset();
            resetForm();
            const modalElement = document.getElementById("addCategoryModal");
            if (modalElement) {
                let modal = window.bootstrap.Modal.getInstance(modalElement);

                if (!modal) {
                    modal = new window.bootstrap.Modal(modalElement);
                }

                modal.hide();
            }
        },
    });
    const closeModal = () => {
        onReset()
    }

    useEffect(() => {
        const fatchData = async () => {
            if (hasFetched.current) return;
            hasFetched.current = true;
            const response = await dispatch(allCategory({ type: 'main_category' }))
            setCategory(response?.payload?.data)
        }
        fatchData()
    }, [])

    return (
        <>
            <div
                className="modal fade add-category-modal"
                id="addCategoryModal"
                tabIndex="-1"
                aria-labelledby="addCategoryModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content add-category-content">

                        {/* Modal Header */}
                        <div className="modal-header add-category-header" style={{ justifyContent: 'space-between' }}>
                            <h5 className="modal-title add-category-title" id="addCategoryModalLabel">
                                {isEdit ? 'Edit Sub-Category' : 'Add Sub-Category'}
                            </h5>
                            <img
                                src="./images/cross-dropdown.svg"
                                className="cross-dropdown"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                style={{ cursor: 'pointer' }}
                                onClick={() => closeModal()}
                            />
                        </div>

                        {/* Form Start */}
                        <form onSubmit={formik.handleSubmit}>
                            {/* Main Category */}
                            <div className="modal-body add-category-body" style={{ paddingBottom: 0 }}>
                                <div className="mb-3">
                                    <label htmlFor="mainCategory" className="form-label category-name">
                                        Main Category
                                    </label>

                                    <select
                                        id="mainCategory"
                                        name="category_id"
                                        className={`category-input mt-2 ${formik.touched.category_id && formik.errors.category_id ? 'is-invalid' : ''
                                            }`}
                                        value={formik.values.category_id}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    >
                                        {/* Default placeholder option */}
                                        <option value="">Select Main Category</option>

                                        {/* Map over categories */}
                                        {category?.length > 0 &&
                                            category.map((item, index) => (
                                                <option key={index} value={item?.id}>
                                                    {item?.category_name} {/* Replace 'name' with your category field */}
                                                </option>
                                            ))}
                                    </select>

                                    {formik.touched.category_id && formik.errors.category_id && (
                                        <div className="invalid-feedback">{formik.errors.category_id}</div>
                                    )}
                                </div>
                            </div>


                            {/* Sub Category Name */}
                            <div className="modal-body add-category-body" style={{ paddingTop: 0, paddingBottom: 0 }}>
                                <div className="mb-3">
                                    <label htmlFor="subCategoryName" className="form-label category-name">
                                        Sub-Category Name
                                    </label>
                                    <input
                                        type="text"
                                        id="subCategoryName"
                                        name="sub_category_name"
                                        className={`category-input ${formik.touched.sub_category_name && formik.errors.sub_category_name
                                            ? 'is-invalid'
                                            : ''
                                            }`}
                                        placeholder="Enter Category Name"
                                        value={formik.values.sub_category_name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.sub_category_name && formik.errors.sub_category_name && (
                                        <div className="invalid-feedback">{formik.errors.sub_category_name}</div>
                                    )}
                                </div>
                            </div>

                            {/* Footer Buttons */}
                            <div className="add-category-footer">
                                <button
                                    type="button"
                                    className="add-category-cancel"
                                    data-bs-dismiss="modal"
                                    onClick={() => formik.resetForm()}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="add-category-save"
                                    //  data-bs-dismiss="modal"
                                    disabled={formik.isSubmitting}
                                >
                                    {isEdit ? 'Update' : 'Submit'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddEditSubCategory;
