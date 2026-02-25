import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useTableSort from '../hooks/useTableSort';
import { activeInActiveCategories, deleteDate } from '../redux/admin/slices/libraryCategorySlice';
import { addNewCategory, fetchAllCategory, updateCategory } from '../redux/admin/slices/TutorialAndMediaSlices';
import AddEditCategory from './AddEditCategory';
import MyPicker from './commanComponents/MyPicker';
import Pagination from './commanComponents/Pagination';
import ActiveAndInActiveModal from './Modals/ActiveAndInActiveModal';
import DeleteModal from './Modals/DeleteModal';
import SearchBox from './table/SearchBox';

const TutorialCategory = ({ handleBack }) => {
    // table ref to apply sorting functionality
    const tableRef = useTableSort({ excludeColumns: [2, 5] });
    const dispatch = useDispatch()
    const { allCategory } = useSelector((state) => state.TutorialAndMedia)
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [tutorialCate, setTutorialCate] = useState([])
    const [isEditData, setIsEditData] = useState(false)
    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // useEffect(() => {
    //     if (hasFetched.current) return;
    //     hasFetched.current = true;
    //     setLoading(true);
    //     dispatch(fetchAllCategory())
    // }, []);

    useEffect(() => {
        setLoading(true);
        if (allCategory) {
            setTutorialCate(allCategory);
            setLoading(false);
        }
    }, [allCategory]);

    useEffect(() => {
        let filtered = Array.isArray(tutorialCate) ? [...tutorialCate] : [];
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
    }, [tutorialCate, search, dateRange]);

    const totalItems = filteredData?.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const handleCategoryClose = () => {
        setSelectedCategory(null);
        setIsEditData(false)
    }
    const handleCategorySubmit = async (values, isEdit) => {
        isEdit ? await dispatch(updateCategory(values)) : await dispatch(addNewCategory(values))
        await dispatch(fetchAllCategory());

            // Add this line to close the modal
    document.querySelector('[data-bs-dismiss="modal"]')?.click();
    }
    const handleRange = (startDate, endDate) => {
        setDateRange({ startDate, endDate });
    };
    const handleIsEdit = () => {
        setIsEditData(true)
    }
    const handleResetForm = () => {
        setIsEditData(false)
        setSelectedCategory(null)
    }
    const handleActiveConfirm = async () => {
        await dispatch(activeInActiveCategories({ id: selectedCategory.id, type: 'tutorial_category' }));
        await dispatch(fetchAllCategory());
        setSelectedCategory(null)
    }
    const handleDelete = async () => {
        await dispatch(deleteDate({ id: selectedCategory.id, type: 'tutorial_category' }))
        await dispatch(fetchAllCategory());
        setSelectedCategory(null);
    }

    return (
        <>
            <div className="content">
                <div className="main-content">
                    <div className="header-button">
                        <div>
                            <h2 className="heading-content">Category Manager</h2>
                            <p className="text-content">Manage your DreamDraper platform</p>
                        </div>
                        <button className="back-btn" onClick={() => handleBack()} ><img src="./images/btn-back.svg" className="arrow-back" alt='back icon' /> Back</button>

                    </div>
                    <div className="table-content">
                        <div className="content-header">
                            <div className="search-align">
                                <img src="./images/search.svg" className="magnify" alt='search icon' />
                                {/* <input type="text" placeholder="Search User Name" className="search-content" onChange={(e) => setSearch(e.target.value)} /> */}
                                <SearchBox search={search} setSearch={setSearch} placeholder="Search Category" />
                            </div>
                            <div className="content-right">
                                {/* <img className="datepicker" src="./images/datepicker.svg" /> */}
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
                                            <th
                                                style={{
                                                    width: '40px'
                                                }}
                                            >S.No.</th>
                                            <th className="profile-pic">Name</th>
                                            <th className="table-expand">Description</th>
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
                                                <tr key={item.id || item._id || index}>

                                                    <td>{startIndex + index + 1}</td>
                                                    <td className="tempName">{item.category_name || "—"}</td>
                                                    <td>
                                                        {item.description}
                                                    </td>
                                                    <td>
                                                        {item.createdAt
                                                            ? new Date(item.createdAt).toLocaleDateString()
                                                            : "—"}
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="status-btn-library"
                                                            data-bs-toggle="modal"
                                                            data-bs-target='#activateTemplateModal'
                                                            onClick={() => setSelectedCategory(item)}
                                                            style={
                                                                item.is_active === 1
                                                                    ? {}
                                                                    : { background: "#4B5563", width: "75px" }
                                                            }
                                                        >
                                                            {item.is_active === 1 ? "Active" : "Inactive"}
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <img
                                                            src="./images/editsolid.svg"
                                                            className="icon-table"
                                                            alt="edit"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#addCategoryModal"
                                                            onClick={() => {
                                                                setSelectedCategory(item);
                                                                handleIsEdit();
                                                            }}
                                                            style={{
                                                                display: "inline-block",
                                                                width: "20px",
                                                                height: "20px",
                                                                marginRight: "8px",
                                                                cursor: "pointer",
                                                            }}
                                                        />
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
                                                                cursor: "pointer",
                                                            }}
                                                        />
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="12" style={{ textAlign: "center", padding: "10px" }}>
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
            <AddEditCategory initialData={selectedCategory} onSubmit={handleCategorySubmit} onReset={handleCategoryClose} isEdit={isEditData} />
            <DeleteModal onClose={handleResetForm}
                onConfirm={handleDelete} type={'category'} />
            <ActiveAndInActiveModal onClose={handleResetForm}
                onConfirm={handleActiveConfirm} item={selectedCategory}
                type={'category'} />
        </>

    )
}

export default TutorialCategory
