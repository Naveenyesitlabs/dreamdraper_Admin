import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ActiveAndInActiveModal from '../../components/Modals/ActiveAndInActiveModal';
import DeleteModal from '../../components/Modals/DeleteModal';
import MyPicker from '../../components/commanComponents/MyPicker';
import Pagination from '../../components/commanComponents/Pagination';
import AddEditSubCategory from '../../components/libraryCategory/AddEditSubCategory';
import SearchBox from '../../components/table/SearchBox';
import useTableSort from '../../hooks/useTableSort';
import { activeInActiveCategories, addSubCategory, deleteDate, getCategory, updateSubCategory } from '../../redux/admin/slices/libraryCategorySlice';
import { formatDateUSA } from '../../utils/healper/dateHelper';

const SubCategory = () => {
    // table ref to apply sorting functionality
    const tableRef = useTableSort({ excludeColumns: [4] });
    const hasFetched = useRef(false);
    const dispatch = useDispatch();
    const { mainCategoryData } = useSelector((state) => state.libCategory)
    const [isEditData, setIsEditData] = useState(false)
    const [loading, setLoading] = useState(true);
    const [subCategoryData, setSubCategoryData] = useState([]);
    const [selectedSubCat, setSelectedSubCat] = useState(null);
    const [search, setSearch] = useState('')
    const [filterData, setFilterData] = useState([]);
    const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        setLoading(true);
        dispatch(getCategory({ type: 'sub_category' }))
    }, [dispatch]);

    useEffect(() => {
        if (mainCategoryData) {
            setSubCategoryData(mainCategoryData)
            setLoading(false);
        }
    }, [mainCategoryData])

    const handleSubmit = async (values, isEdit) => {
        try {
            isEdit ? await dispatch(updateSubCategory(values)) : await dispatch(addSubCategory(values))
            await dispatch(getCategory({ type: 'sub_category' }))

            // Close the modal
            const modalElement = document.getElementById('addCategoryModal');
            if (modalElement) {
                const closeButton = modalElement.querySelector('[data-bs-dismiss="modal"]');
                if (closeButton) {
                    closeButton.click();
                }
            }

            handleClose();
        } catch (error) {
            console.log("error from Sub category page", error)
        }

    };

    useEffect(() => {
        let filtered = Array.isArray(subCategoryData) ? [...subCategoryData] : [];
        if (search) {
            const term = search.toLowerCase();
            filtered = filtered.filter(item =>
                item?.sub_category_name?.toLowerCase().includes(term)
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
        setFilterData(filtered);
        setCurrentPage(1)
    }, [subCategoryData, search, dateRange]);

    const handleDelete = async () => {
        try {
            await dispatch(deleteDate({ id: selectedSubCat.id, type: 'sub_category' }))
            await dispatch(getCategory({ type: 'sub_category' }))
            setSelectedSubCat(null);
        } catch (error) {
            console.log("error from Sub category page", error)
        }
    }

    const handleClose = () => {
        setSelectedSubCat(null)
        setIsEditData(false)
    }

    const handleActiveConfirm = async () => {
        try {
            await dispatch(activeInActiveCategories({ id: selectedSubCat.id, type: 'sub_category' }));
            await dispatch(getCategory({ type: 'sub_category' }))
            setSelectedSubCat(null)
        } catch (error) {
            console.log("error from Sub category page", error)
        }
    }

    const totalItems = filterData?.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filterData.slice(startIndex, startIndex + itemsPerPage);

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
                    <h2 className="heading-content">Sub-Category</h2>
                    <p className="text-content">Manage your DreamDraper platform</p>

                    <div className="table-content">
                        <div className="content-header">
                            <SearchBox search={search} setSearch={setSearch} placeholder="Search Sub-Category" />
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
                                    <img src="./images/white-plus.svg" className="template" alt="add icon" /> Add Sub-Category
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
                                            currentItems?.map((item, index) => (
                                                <tr key={item.id || index}>
                                                    <td>{startIndex + index + 1}</td>
                                                    <td className="tempName">{item.sub_category_name || "Sub-Category Name"}</td>
                                                    <td>{item.createdAt ? formatDateUSA(item.createdAt) : "—"}</td>
                                                    <td>
                                                        <button
                                                            style={
                                                                item.is_active == 1
                                                                    ? {}
                                                                    : { background: '#4B5563', width: '69px' }
                                                            }
                                                            className="status-btn-library"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#activateTemplateModal"
                                                            onClick={() => setSelectedSubCat(item)}
                                                        >
                                                            {item.is_active == 1 ? "Active" : "Inactive"}
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <img
                                                            src="./images/editsolid.svg"
                                                            className="icon-table"
                                                            alt="edit"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#addCategoryModal"
                                                            onClick={() => { setSelectedSubCat(item), handleIsEdit() }}
                                                        />
                                                        <img
                                                            src="./images/del-solid.svg"
                                                            className="icon-table"
                                                            alt="delete"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#deleteDesign"
                                                            onClick={() => setSelectedSubCat(item)}
                                                        />
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" style={{ textAlign: "center", padding: "10px" }}>
                                                    No Sub Categories Found!
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

            <AddEditSubCategory initialData={selectedSubCat}
                onSubmit={handleSubmit} onReset={handleClose} isEdit={isEditData} />
            <DeleteModal onConfirm={handleDelete} onClose={handleClose} type={'sub-category'} />
            <ActiveAndInActiveModal onClose={handleClose}
                onConfirm={handleActiveConfirm} item={selectedSubCat}
                type={'sub-category'} />

        </>

    )
}

export default SubCategory
