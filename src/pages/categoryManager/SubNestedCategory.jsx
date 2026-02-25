import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ActiveAndInActiveModal from '../../components/Modals/ActiveAndInActiveModal'
import DeleteModal from '../../components/Modals/DeleteModal'
import MyPicker from '../../components/commanComponents/MyPicker'
import Pagination from '../../components/commanComponents/Pagination'
import AddEditSubNestedCategory from '../../components/libraryCategory/AddEditSubNestedCategory'
import SearchBox from '../../components/table/SearchBox'
import useTableSort from '../../hooks/useTableSort'
import { activeInActiveCategories, addSubNestedCategory, deleteDate, getCategory, updateSubNestedCategory } from '../../redux/admin/slices/libraryCategorySlice'
import { formatDateUSA } from '../../utils/healper/dateHelper'

const SubNestedCategory = () => {
    // table ref to apply sorting functionality
    const tableRef = useTableSort({ excludeColumns: [4] });
    const hasFetched = useRef(false);
    const dispatch = useDispatch();
    const { mainCategoryData } = useSelector((state) => state.libCategory)
    const [isEditData, setIsEditData] = useState(false)
    const [subNestedCate, setSubNestedCat] = useState([]);
    const [filtered, setFiltered] = useState([])
    const [selectSubNestedCat, setSelectSubNestedCat] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        setLoading(true)
        dispatch(getCategory({ type: 'sub_nested_category' }))
    }, [])

    useEffect(() => {
        let filtered = Array.isArray(subNestedCate) ? [...subNestedCate] : [];
        if (search) {
            const term = search.toLowerCase();
            filtered = filtered.filter(item =>
                item?.sub_nested_category_name?.toLowerCase().includes(term)
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
        setFiltered(filtered);
        setCurrentPage(1)
    }, [subNestedCate, search, dateRange]);

    useEffect(() => {
        if (mainCategoryData) {
            setSubNestedCat(mainCategoryData)
            setLoading(false)
        }
    }, [mainCategoryData])

    const handleSubNestedCate = async (values, isEdit) => {
        try {
            isEdit ? await dispatch(updateSubNestedCategory(values)) : await dispatch(addSubNestedCategory(values))
            await dispatch(getCategory({ type: 'sub_nested_category' }))

                        // Close the modal
                        const modalElement = document.getElementById('addCategoryModal');
                        if (modalElement) {
                            const closeButton = modalElement.querySelector('[data-bs-dismiss="modal"]');
                            if (closeButton) {
                                closeButton.click();
                            }
                        }
            
                        handleResetForm();
                        
        } catch (error) {
            console.log("error from Sub nested category page", error)
        }
    }

    const handleDelete = async () => {
        try {
            await dispatch(deleteDate({ id: selectSubNestedCat.id, type: 'sub_nested_category' }))
            await dispatch(getCategory({ type: 'sub_nested_category' }))
            setSelectSubNestedCat(null);
        } catch (error) {
            console.log("error from Sub nested category page", error)
        }
    }

    const handleActiveConfirm = async () => {
        try {
            await dispatch(activeInActiveCategories({ id: selectSubNestedCat.id, type: 'sub_nested_category' }));
            await dispatch(getCategory({ type: 'sub_nested_category' }))
            setSelectSubNestedCat(null)
        } catch (error) {
            console.log("error from Sub nested category page", error)
        }
    }
    const handleClose = () => {
        setSelectSubNestedCat(null)
        setIsEditData(false)
    }

    const totalItems = filtered?.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

    const handleRange = (startDate, endDate) => {
        setDateRange({ startDate, endDate });
    };

    const handleIsEdit = () => {
        setIsEditData(true)
    }

    return (
        <>
            <div className="content">
                <div className="main-content">
                    <h2 className="heading-content">Sub-Nested Category</h2>
                    <p className="text-content">Manage your DreamDraper platform</p>
                    <div className="table-content">
                        <div className="content-header">
                            {/* <div className="search-align">
                                <img src="./images/search.svg" className="magnify" />
                                <input type="text" placeholder="Search Sub nested category" className="search-content"
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div> */}
                            <SearchBox search={search} setSearch={setSearch} placeholder="Search Sub Nested Category" />
                            <div className="content-right">
                                <MyPicker handleDateFilter={handleRange} />
                                <button type="button" className="template-upload"
                                    style={{
                                        width: 'auto',
                                        justifyContent: 'center',
                                        gap: '6px'
                                    }}
                                    data-bs-toggle="modal"
                                    data-bs-target="#addSubNestedCategoryModal">
                                    <img src="./images/white-plus.svg" className="template" alt="add icon" /> Add Sub Nested Category
                                </button>
                            </div>
                        </div>
                        <div className="table-container">
                            <div className="scroll-table">
                                <table ref={tableRef} className="custom-table">
                                    <thead>
                                        <tr>
                                            <th
                                                style={{
                                                    width: '40px'
                                                }}
                                            >S.No.</th>
                                            <th className="profile-pic">Name</th>
                                            <th className="table-expand">Created</th>
                                            <th className="table-expand">Status</th>
                                            <th className="table-expand">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan="5" style={{ textAlign: "center", padding: "10px" }}>
                                                    Loading...
                                                </td>
                                            </tr>
                                        ) : currentItems?.length > 0 ? (
                                            currentItems.map((subItem, index) => (
                                                <tr key={index}>
                                                    <td>{startIndex + index + 1}</td>
                                                    <td className="tempName">{subItem.sub_nested_category_name || "Nested Category 01"}</td>
                                                    <td>{formatDateUSA(subItem.createdAt) || "-"}</td>
                                                    <td>
                                                        <button
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#activateTemplateModal"
                                                            style={
                                                                subItem.is_active == 1
                                                                    ? {}
                                                                    : { background: '#4B5563', width: '69px' }
                                                            }
                                                            className="status-btn-library"
                                                            onClick={() => setSelectSubNestedCat(subItem)}
                                                        >
                                                            {subItem.is_active == 1 ? "Active" : "Inactive"}
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <img
                                                            src="./images/editsolid.svg"
                                                            className="icon-table"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#addSubNestedCategoryModal"
                                                            alt="Edit"
                                                            onClick={() => { setSelectSubNestedCat(subItem), handleIsEdit() }}
                                                        />
                                                        <img
                                                            src="./images/del-solid.svg"
                                                            className="icon-table"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#deleteDesign"
                                                            alt="Delete"
                                                            onClick={() => setSelectSubNestedCat(subItem)}
                                                        />
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" style={{ textAlign: "center", padding: "10px" }}>
                                                    No Sub Nested Categories Found!
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
            <AddEditSubNestedCategory initialData={selectSubNestedCat} onSubmit={handleSubNestedCate} onReset={handleClose} isEdit={isEditData} />
            <DeleteModal onConfirm={handleDelete} onClose={handleClose} type={'Sub-Nested-category'} />
            <ActiveAndInActiveModal onClose={handleClose}
                onConfirm={handleActiveConfirm} item={selectSubNestedCat}
                type={'Sub-Nested-category'} />
        </>
    )
}

export default SubNestedCategory
