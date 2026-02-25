import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ActiveAndInActiveModal from '../../components/Modals/ActiveAndInActiveModal'
import DeleteModal from '../../components/Modals/DeleteModal'
import MyPicker from '../../components/commanComponents/MyPicker'
import Pagination from '../../components/commanComponents/Pagination'
import AddEditCategory from '../../components/libraryCategory/AddEditCategory'
import SearchBox from '../../components/table/SearchBox'
import useTableSort from '../../hooks/useTableSort'
import { activeInActiveCategories, addCategory, deleteDate, getCategory, UpdateCategory } from '../../redux/admin/slices/libraryCategorySlice'
import { formatDateUSA } from '../../utils/healper/dateHelper'

const MainCategory = () => {
    // table ref to apply sorting functionality
    const tableRef = useTableSort({ excludeColumns: [4] });
    const hasFetched = useRef(false);
    const dispatch = useDispatch();
    const [categoryData, setCategoryData] = useState([]);
    const [isEditData, setIsEditData] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { mainCategoryData } = useSelector((state) => state.libCategory);
    const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        setLoading(true);
        dispatch(getCategory({ type: 'main_category' }))
    }, [dispatch])

    useEffect(() => {
        if (mainCategoryData) {
            setCategoryData(mainCategoryData);
            setLoading(false);
        }
    }, [mainCategoryData])

    const handleSubmit = async (data, isEdit) => {
        try {
            isEdit ?
                await dispatch(UpdateCategory(data)) :
                await dispatch(addCategory(data));
            await dispatch(getCategory({ type: 'main_category' }))

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
            console.log("error from Category page", error)
        }

    };

    useEffect(() => {
        let filtered = Array.isArray(categoryData) ? [...categoryData] : [];
        if (search) {
            const term = search.toLowerCase();
            filtered = filtered.filter(item =>
                item?.category_name?.toLowerCase().includes(term)
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
    }, [categoryData, search, dateRange]);

    const totalItems = filteredData?.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const handleResetForm = () => {
        setIsEditData(false)
        setSelectedCategory(null)
    }

    const handleDelete = async () => {
        try {
            await dispatch(deleteDate({ id: selectedCategory.id, type: 'main_category' }))
            await dispatch(getCategory({ type: 'main_category' }))
            setSelectedCategory(null);
        } catch (error) {
            console.log("error from Category page", error)
        }
    }
    const handleActiveConfirm = async () => {
        try {
            await dispatch(activeInActiveCategories({ id: selectedCategory.id, type: 'main_category' }));
            await dispatch(getCategory({ type: 'main_category' }))
            setSelectedCategory(null)
        } catch (error) {
            console.log("error from Category page", error)
        }
    }
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
                    <h2 className="heading-content">Main Category</h2>
                    <p className="text-content">Manage your DreamDraper platform</p>
                    <div className="table-content">
                        <div className="content-header">
                            {/* <div className="search-align">
                                <img src="./images/search.svg" className="magnify" />
                                <input type="text" placeholder="Search Main Category" className="search-content" onChange={(e) => setSearch(e.target.value)} />
                            </div> */}
                            <SearchBox search={search} setSearch={setSearch} placeholder="Search Main Category" />
                            <div className="content-right">
                                <MyPicker handleDateFilter={handleRange} />
                                <button type="button" className="template-upload"
                                    style={{
                                        width: 'auto',
                                        justifyContent: 'center',
                                        gap: '6px'
                                    }}
                                    data-bs-toggle="modal"
                                    data-bs-target="#addCategoryModal">
                                    <img src="./images/white-plus.svg" className="template" alt='plus icon' /> Add Category
                                </button>
                            </div>
                        </div>
                        <div className="table-container">
                            <div className="scroll-table">
                                <table ref={tableRef} className="custom-table">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '40px' }}>S.No.</th>
                                            <th className="profile-pic">Name</th>
                                            <th className="table-expand">Created</th>
                                            <th className="table-expand">Status</th>
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
                                        ) : currentItems?.length > 0 ? (
                                            currentItems.map((item, index) => (
                                                <tr key={item.id || index}>
                                                    <td>{startIndex + index + 1}</td>
                                                    <td className="tempName">{item.category_name}</td>
                                                    <td>
                                                        {item.createdAt
                                                            ? formatDateUSA(item.createdAt)
                                                            : "—"}
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="status-btn-library"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#activateTemplateModal"
                                                            style={
                                                                item.is_active === 1
                                                                    ? {}
                                                                    : { background: "#4B5563", width: "69px" }
                                                            }
                                                            onClick={() => setSelectedCategory(item)}
                                                        >
                                                            {item.is_active === 1 ? "Active" : "Inactive"}
                                                        </button>
                                                    </td>
                                                    <td>
                                                        {/* 🔹 Edit */}
                                                        <img
                                                            src="./images/editsolid.svg"
                                                            className="icon-table"
                                                            alt="edit"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#addCategoryModal"
                                                            onClick={() => { setSelectedCategory(item), handleIsEdit() }}
                                                            style={{
                                                                display: "inline-block",
                                                                width: "20px",
                                                                height: "20px",
                                                                marginRight: "8px",
                                                                cursor: "pointer",
                                                            }}
                                                        />
                                                        {/* 🔹 Delete */}
                                                        <img
                                                            src="./images/del-solid.svg"
                                                            className="icon-table"
                                                            alt="delete"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#deleteDesign"
                                                            onClick={() => setSelectedCategory(item)}
                                                            style={{
                                                                display: "inline-block",
                                                                width: "20px",
                                                                height: "20px",
                                                                marginRight: "8px",
                                                                cursor: "pointer",
                                                            }}
                                                        />
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            // 🔹 Show “Not Found” message
                                            <tr>
                                                <td colSpan="5" style={{ textAlign: "center", padding: "10px" }}>
                                                    No Categories Found
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
            <AddEditCategory initialData={selectedCategory}
                onSubmit={handleSubmit} onReset={handleResetForm} isEdit={isEditData} />
            <DeleteModal onClose={handleResetForm}
                onConfirm={handleDelete} type={'category'} />
            <ActiveAndInActiveModal onClose={handleResetForm}
                onConfirm={handleActiveConfirm} item={selectedCategory}
                type={'category'}
            />
        </>

    )
}

export default MainCategory
