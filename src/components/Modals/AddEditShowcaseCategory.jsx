import { ErrorMessage, Field, Form, Formik } from 'formik';

const AddEditShowcaseCategory = ({ editedData, onSubmit }) => {
    console.log("editedData", editedData)
    const isEditMode = Boolean(editedData);

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
                    {/* Header */}
                    <div
                        className="modal-header add-category-header"
                        style={{ justifyContent: 'space-between' }}
                    >
                        <h5 className="modal-title add-category-title">
                            {isEditMode ? 'Edit Category' : 'Add New Category'}
                        </h5>

                        <img
                            src="./images/cross-dropdown.svg"
                            className="cross-dropdown"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            style={{ cursor: 'pointer' }}
                        />
                    </div>
                    {/* Body */}
                    <div
                        className="modal-body add-category-body"
                        style={{ paddingBottom: 0 }}
                    >
                        <Formik
                            enableReinitialize
                            initialValues={{
                                category_name: editedData?.category_name || '',
                                ...(isEditMode && { id: editedData?.id }),
                            }}
                            validate={(values) => {
                                const errors = {};
                                if (!values.category_name.trim()) {
                                    errors.category_name = 'Category name is required';
                                }
                                return errors;
                            }}
                            onSubmit={(values, { resetForm }) => {
                                onSubmit(values);
                                resetForm();
                            }}
                        >
                            {() => (
                                <Form id="addCategoryForm">
                                    <div className="mb-3">
                                        <label
                                            htmlFor="category_name"
                                            className="form-label category-name"
                                        >
                                            Category Name
                                        </label>

                                        <Field
                                            type="text"
                                            name="category_name"
                                            id="category_name"
                                            className="category-input"
                                            placeholder="Enter Category Name"
                                        />

                                        <ErrorMessage
                                            name="category_name"
                                            component="div"
                                            style={{ color: 'red', fontSize: '12px' }}
                                        />
                                    </div>
                                    {/* Footer */}
                                    <div className="add-category-footer">
                                        <button
                                            type="button"
                                            className="add-category-cancel"
                                            data-bs-dismiss="modal"
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="submit"
                                            className="add-category-save"
                                            // data-bs-dismiss="modal"
                                        >
                                            {isEditMode ? 'Update' : 'Submit'}
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddEditShowcaseCategory;