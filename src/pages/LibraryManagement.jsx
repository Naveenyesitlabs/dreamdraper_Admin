import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ActiveAndInActiveModal from '../components/Modals/ActiveAndInActiveModal'
import DeleteModal from '../components/Modals/DeleteModal'
import TemplateModal from '../components/Modals/TemplateModal'
import MyPicker from '../components/commanComponents/MyPicker'
import Pagination from '../components/commanComponents/Pagination'
import SearchBox from '../components/table/SearchBox'
import useTableSort from '../hooks/useTableSort'
import { activeInActiveCategories, addNewTemplate, deleteDate, getAllTemplate, updateTemplateDesigne } from '../redux/admin/slices/libraryCategorySlice'
import { formatDateUSA } from '../utils/healper/dateHelper'


const LibraryManagement = () => {
    // table ref to apply sorting functionality
    const tableRef = useTableSort({ excludeColumns: [10, 11] });
    const hasFetched = useRef(false);
    const dispatch = useDispatch()
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [isEditData, setIsEditData] = useState(false)
    const [isView, setIsView] = useState(false)
    const [search, setSearch] = useState('')
    const [filteredData, setFilteredData] = useState([]);
    const [allTemplateData, setAllTemplateData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { allTemplate } = useSelector((state) => state.libCategory)
    const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        let filtered = Array.isArray(allTemplateData) ? [...allTemplateData] : [];
        if (search) {
            const term = search.toLowerCase();
            filtered = filtered.filter(item =>
                item?.designe_name?.toLowerCase().includes(term)
                || item?.category?.category_name?.toLowerCase().includes(term)
                || item?.subCategory?.sub_category_name?.toLowerCase().includes(term)
                || item?.nestedCategory?.nested_category_name?.toLowerCase().includes(term)
                || item?.subNestedCategory?.sub_nested_category_name?.toLowerCase().includes(term)
            );
        }
        if (dateRange.startDate && dateRange.endDate) {
            const start = new Date(dateRange.startDate).setHours(0, 0, 0, 0);
            const end = new Date(dateRange.endDate).setHours(23, 59, 59, 999);
            filtered = filtered.filter(item => {
                const itemDate = new Date(item.createdAt).getTime();
                return itemDate >= start && itemDate <= end;
            });
        }
        setFilteredData(filtered);
        setCurrentPage(1)
    }, [allTemplateData, search, dateRange]);

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        setLoading(true)
        dispatch(getAllTemplate())
    }, [])

    useEffect(() => {
        if (allTemplate) {
            setAllTemplateData(allTemplate)
            setLoading(false)
        }
    }, [allTemplate])

    const handleSubmit = async (values, isEdit) => {
        try {
            const formData = new FormData();
            formData.append("designe_name", values.designe_name);
            formData.append("category_id", values.category_id);
            formData.append("subCategory_id", values.subCategory_id);
            formData.append("nestedCategory_id", values.nestedCategory_id);
            formData.append("subNestedCategory_id", values.subNestedCategory_id);
            formData.append("description", values.description);
            formData.append("is_paid", Boolean(values.is_paid));
            formData.append("price", values.price);

            if (values.designe) formData.append("designe", values.designe);
            if (values.id) formData.append('id', values.id)

            isEdit ? await dispatch(updateTemplateDesigne(formData)) : await dispatch(addNewTemplate(formData))
            await dispatch(getAllTemplate())

            // document.querySelector('[data-bs-dismiss="modal"]')?.click();
            // Find and click the Cancel button which has data-bs-dismiss="modal"
            const cancelButton = document.querySelector('.uploadCancel[data-bs-dismiss="modal"]');
            if (cancelButton) {
                cancelButton.click();
            }

            // Call handleClose to reset states
            handleClose();
        } catch (error) {
            console.log("error from library page", error)
        }
    }

    const handleDelete = async () => {
        try {
            await dispatch(deleteDate({ id: selectedTemplate.id, type: 'template_designe' }))
            await dispatch(getAllTemplate())
            setSelectedTemplate(null);
        } catch (error) {
            console.log("error from library page", error)
        }
    }

    const handleActiveConfirm = async () => {
        try {
            await dispatch(activeInActiveCategories({ id: selectedTemplate.id, type: 'template_designe' }));
            await dispatch(getAllTemplate())
            setSelectedTemplate(null)
        } catch (error) {
            console.log("error from library page", error)
        }
    }

    const handleClose = () => {
        setSelectedTemplate(null)
        setIsEditData(false)
    }

    const totalItems = filteredData?.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const handleRange = (startDate, endDate) => {
        setDateRange({ startDate, endDate });
    };

    const handleIsEdit = (isView = false) => {
        if (isView) {
            setIsView(true);
            setIsEditData(false);
        } else {
            setIsView(false);
            setIsEditData(true);
        }
    }

    return (
        <>
            <div className="content">
                <div className="main-content">
                    <h2 className="heading-content">Library Management</h2>
                    <p className="text-content">Manage your DreamDraper platform</p>
                    <div className="table-content">
                        <div className="content-header">
                            {/* <div className="search-align">
                                <img src="./images/search.svg" className="magnify" />
                                <input type="text" placeholder="Search Template name" className="search-content"
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div> */}
                            <SearchBox search={search} setSearch={setSearch} placeholder="Search Template Name" />
                            <div className="content-right">
                                <MyPicker handleDateFilter={handleRange} />
                                <button
                                    type="button"
                                    className="template-upload"
                                    data-bs-toggle="modal"
                                    data-bs-target="#uploadTemplateModal"
                                    onClick={() => { setIsView(false); setIsEditData(false); setSelectedTemplate(null) }}
                                >
                                    <img src="./images/templateUpload.svg" className="template" alt="upload icon" /> Upload Template
                                </button>
                            </div>
                        </div>
                        <div className="table-container">
                            <div className="scroll-table">
                                <table ref={tableRef} className="custom-table">
                                    <thead>
                                        <tr>
                                            <th>S.No.</th>
                                            <th className="profile-pic">Name</th>
                                            <th className="table-expand">Description</th>
                                            <th className="table-expand">Main Category</th>
                                            <th className="table-expand">Sub-Category</th>
                                            <th className="table-expand">Nested Category</th>
                                            <th className="table-expand">Sub-Nested Category</th>
                                            <th className="table-expand">Upload Date</th>
                                            <th className="table-expand">Status</th>
                                            <th className="table-expand">Price</th>
                                            <th className="table-expand">View Template</th>
                                            <th className="table-expand">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan="12" style={{ textAlign: "center", padding: "20px" }}>
                                                    <div className="spinner-border text-primary" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : currentItems && currentItems.length > 0 ? (
                                            currentItems.map((item, index) => (
                                                <tr key={item.id}>
                                                    <td>{startIndex + index + 1}</td>
                                                    <td className="tempName">{item.designe_name}</td>
                                                    <td className="desc-text">{item.description}</td>
                                                    <td className="main-cat">{item.category.category_name || "N/A"}</td>
                                                    <td className="main-cat">{item.subCategory.sub_category_name || "N/A"}</td>
                                                    <td className="nested-cat">{item?.nestedCategory?.nested_category_name || "N/A"}</td>
                                                    <td className="nested-cat">{item?.subNestedCategory?.sub_nested_category_name || "N/A"}</td>
                                                    <td>{formatDateUSA(item.createdAt)}</td>
                                                    <td>
                                                        <button
                                                            style={
                                                                item.is_active == 1
                                                                    ? {}
                                                                    : { background: '#4B5563', width: '69px' }
                                                            }
                                                            className={`status-btn-library ${item.is_active == 1 ? "active" : "inactive"}`}
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#activateTemplateModal"
                                                            onClick={() => setSelectedTemplate(item)}
                                                        >
                                                            {item.is_active == 1 ? "Active" : "Inactive"}
                                                        </button>
                                                    </td>
                                                    <td>${item.price || 0}</td>
                                                    <td className="eye-td">
                                                        <button
                                                            className="view-link bg-transparent border-0"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#uploadTemplateModal"
                                                            onClick={() => { setSelectedTemplate(item), handleIsEdit(true) }}
                                                        >
                                                            View <img src="./images/solid-eye.svg" className="eye-img" alt="View" />
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <img
                                                            src="./images/editsolid.svg"
                                                            className="icon-table"
                                                            alt="Edit"
                                                            style={{ display: "inline-block", cursor: "pointer" }}
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#uploadTemplateModal"
                                                            onClick={() => { setSelectedTemplate(item), handleIsEdit() }}
                                                        />
                                                        <img
                                                            src="./images/del-solid.svg"
                                                            className="icon-table"
                                                            alt="Delete"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#deleteDesign"
                                                            style={{ display: "inline-block", cursor: "pointer" }}
                                                            onClick={() => setSelectedTemplate(item)}
                                                        />
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="12" style={{ textAlign: "center", padding: "20px" }}>
                                                    No data found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination
                                currentPage={currentPage}
                                totalItems={totalItems}
                                itemsPerPage={itemsPerPage}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <DeleteModal
                onClose={handleClose}
                onConfirm={handleDelete}
                type={'templete'}
            />
            <TemplateModal
                initialData={selectedTemplate}
                onSubmit={handleSubmit}
                onReset={handleClose}
                isEdit={isEditData}
                isView={isView}
            />
            <ActiveAndInActiveModal
                onClose={handleClose}
                onConfirm={handleActiveConfirm}
                item={selectedTemplate}
                type={'template'}
            />
        </>
    )
}

export default LibraryManagement
