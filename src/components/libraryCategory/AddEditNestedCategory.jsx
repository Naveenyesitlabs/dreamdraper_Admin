import { useFormik } from 'formik';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { allCategory, allSubCategory } from '../../redux/admin/slices/libraryCategorySlice';

const AddEditNestedCategory = ({ initialData = null, onSubmit, onReset, isEdit}) => {
    const hasFetched = useRef(false);
    const dispatch = useDispatch()
    // const isEdit = Boolean(initialData);
    const [subCategories, setSubCategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const formik = useFormik({
        initialValues: {
            id: initialData?.id || '',
            category_id: initialData?.category_id || '',
            subCategory_id: initialData?.subCategory_id || '',
            nested_category_name: initialData?.nested_category_name || '',
        },
        validationSchema: Yup.object({
            category_id: Yup.string().required('Main category is required'),
            subCategory_id: Yup.string().required('Sub-category is required'),
            nested_category_name: Yup.string()
                .min(2, 'Must be at least 2 characters')
                .required('Nested category name is required'),
        }),

        enableReinitialize: true,
        onSubmit: (values, { resetForm }) => {
            onSubmit(values, isEdit);
            resetForm();
            if (isEdit) onReset();
        },
    });

    const closeModal = () => {
        formik.resetForm();
        onReset();
    };

    useEffect(() => {
        const fatchData = async () => {
            if (hasFetched.current) return;
            hasFetched.current = true;
            const response = await dispatch(allCategory({ type: 'main_category' }))
            // console.log("response?.payload?.data", response?.payload?.data)
            setCategories(response?.payload?.data)
        }
        fatchData()
    }, [])


    useEffect(() => {
        const fetchAllCateData = async () => {
            try {
                if (isEdit) {
                    await fetchSubCategories(initialData.category_id);
                }
            } catch (error) {
                console.log("Error to featching the Edited Data:-", error)
            }
        }
        fetchAllCateData()
    }, [initialData])


    const fetchSubCategories = async (mainCategoryId) => {
        try {
            const res = await dispatch(allSubCategory({ category_id: mainCategoryId }));
            setSubCategories(res?.payload?.data);
        } catch (err) {
            console.error("Error fetching sub categories:", err);
        }
    };

    return (
        <div
            className="modal fade add-category-modal"
            id="addNestedCategoryModal"
            tabIndex="-1"
            aria-labelledby="addNestedCategoryModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content add-category-content">
                    <div className="modal-header add-category-header" style={{ justifyContent: 'space-between' }}>
                        <h5 className="modal-title add-category-title" id="addNestedCategoryModalLabel">
                            {isEdit ? 'Edit Nested Category' : 'Add Nested Category'}
                        </h5>
                        <img
                            src="./images/cross-dropdown.svg"
                            className="cross-dropdown"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            style={{ cursor: 'pointer' }}
                            onClick={closeModal}
                        />
                    </div>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="modal-body add-category-body" style={{ paddingBottom: 0 }}>
                            <div className="mb-3">
                                <label htmlFor="category" className="form-label category-name">
                                    Main Category
                                </label>
                                <select
                                    id="category"
                                    name="category_id"
                                    className={`category-input mt-2 ${formik.touched.category_id && formik.errors.category_id ? 'is-invalid' : ''
                                        }`}
                                    value={formik.values.category_id}
                                    onChange={(e) => {
                                        formik.handleChange(e);
                                        fetchSubCategories(e.target.value);
                                    }}
                                    onBlur={formik.handleBlur}
                                >
                                    <option value="">Select Main Category</option>
                                    {categories?.map((cat) => (
                                        <option key={cat?.id} value={cat?.id}>
                                            {cat?.category_name}
                                        </option>
                                    ))}
                                </select>
                                {formik.touched.category_id && formik.errors.category_id && (
                                    <div className="invalid-feedback">{formik.errors.category_id}</div>
                                )}
                            </div>
                        </div>
                        <div className="modal-body add-category-body" style={{ paddingTop: 0, paddingBottom: 0 }}>
                            <div className="mb-3">
                                <label htmlFor="subCategory" className="form-label category-name">
                                    Sub Category
                                </label>
                                <select
                                    id="subCategory"
                                    name="subCategory_id"
                                    className={`category-input mt-2 ${formik.touched.subCategory_id && formik.errors.subCategory_id ? 'is-invalid' : ''}`}
                                    value={formik.values.subCategory_id}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                >
                                    <option value="">Select Sub Category</option>
                                    {subCategories?.map(sub => (
                                        <option key={sub?.id} value={sub?.id}>
                                            {sub?.sub_category_name}
                                        </option>
                                    ))}
                                </select>
                                {formik.touched.subCategory_id && formik.errors.subCategory_id && (
                                    <div className="invalid-feedback">{formik.errors.subCategory_id}</div>
                                )}
                            </div>
                        </div>
                        <div className="modal-body add-category-body" style={{ paddingTop: 0, paddingBottom: 0 }}>
                            <div className="mb-3">
                                <label htmlFor="nestedCategoryName" className="form-label category-name">
                                    Nested Category Name
                                </label>
                                <input
                                    type="text"
                                    id="nestedCategoryName"
                                    name="nested_category_name"
                                    className={`category-input ${formik.touched.nested_category_name && formik.errors.nested_category_name ? 'is-invalid' : ''}`}
                                    placeholder="Enter Category Name"
                                    value={formik.values.nested_category_name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.nested_category_name && formik.errors.nested_category_name && (
                                    <div className="invalid-feedback">{formik.errors.nested_category_name}</div>
                                )}
                            </div>
                        </div>
                        <div className="add-category-footer">
                            <button
                                type="button"
                                className="add-category-cancel"
                                data-bs-dismiss="modal"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="add-category-save"
                                disabled={formik.isSubmitting}
                                //  data-bs-dismiss="modal"
                            >
                                {isEdit ? 'Update' : 'Submit'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddEditNestedCategory;