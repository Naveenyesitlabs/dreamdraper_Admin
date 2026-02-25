import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AddEditShowcaseCategory from '../components/Modals/AddEditShowcaseCategory'
import DeleteModal from '../components/Modals/DeleteModal'
import MyPicker from '../components/commanComponents/MyPicker'
import Pagination from '../components/commanComponents/Pagination'
import SearchBox from '../components/table/SearchBox'
import useTableSort from '../hooks/useTableSort'
import { deleteDate, getCategory } from '../redux/admin/slices/libraryCategorySlice'
import { addShowcasesCategory, updateShowcasesCategory } from '../redux/admin/slices/showcases'

const CategoryShowcases = ({ onBack }) => {
    // table ref to apply sorting functionality
    const tableRef = useTableSort({ excludeColumns: [3] });
    const dispatch = useDispatch()
    const hasFetched = useRef(false);
    const { mainCategoryData } = useSelector((state) => state.libCategory);
    const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
    const [editData, setEditData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [category, setCategory] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedId, setSelectedId] = useState('')
    const [filteredData, setFilteredData] = useState(null)
    const [search, setSearch] = useState('')

    const itemsPerPage = 10;

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        setLoading(true)
        dispatch(getCategory({ type: 'showcase_category' }))
    }, [])

    useEffect(() => {
        if (mainCategoryData) {
            setCategory(mainCategoryData);
            setLoading(false);
        }
    }, [mainCategoryData])

    const handleSubmit = async (updatedData) => {
        console.log("updatedData", updatedData);

        editData ?
            await dispatch(updateShowcasesCategory(updatedData)) :
            await dispatch(addShowcasesCategory(updatedData))
        dispatch(getCategory({ type: 'showcase_category' }))

        document.querySelector('[data-bs-dismiss="modal"]').click();
    }

    const handleClose = () => {
        setSelectedId('');
    }

    const handleDelete = async () => {
        try {
            await dispatch(deleteDate({ id: selectedId, type: 'showcase_category' }))
            dispatch(getCategory({ type: 'showcase_category' }))
            setSelectedId('');
        } catch (error) {
            console.log("error from library page", error)
        }
    }

    useEffect(() => {
        const categoryes = Array.isArray(category) ? category : [];
        let filtered = [...categoryes];
        if (search) {
            const term = search.toLowerCase();
            filtered = filtered.filter(item =>
                item?.category_name?.toLowerCase().includes(term)
            );
        }
        // if (searchTearm == 'Active') {
        //     filtered = filtered.filter(item => item.is_active == 1);

        // } else if (searchTearm == 'In Active') {
        //     filtered = filtered.filter(item => item.is_active == 0);
        // }
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
    }, [category, search, dateRange]);



    const handleRange = (startDate, endDate) => {
        setDateRange({ startDate, endDate });
    };

    const totalItems = filteredData?.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredData?.slice(startIndex, startIndex + itemsPerPage);


    return (

        <>
            <div class="content">
                <div class="main-content">
                    <div class="header-button">
                        <div>
                            <h2 class="heading-content">Category Manager</h2>
                            <p class="text-content">Manage your DreamDraper platform</p>
                        </div>
                        <button class="back-btn" onClick={onBack}><img src="./images/btn-back.svg" class="arrow-back" alt='back arrow' /> Back</button>
                    </div>

                    <div class="table-content">
                        <div class="content-header">
                            {/* <div class="search-align">
                                <img src="./images/search.svg" class="magnify" />
                                <input type="text" placeholder="Search category name" class="search-content" onChange={(e) => setSearch(e.target.value)} />
                            </div> */}
                            <SearchBox search={search} setSearch={setSearch} placeholder="Search Category" />
                            <div class="content-right">
                                {/* <img class="datepicker" src="./images/datepicker.svg" /> */}
                                <MyPicker handleDateFilter={handleRange} />
                                <button type="button" class="template-upload"
                                    style={{
                                        widthL: 'auto',
                                        justifyContent: 'center',
                                        gap: '6px'
                                    }}
                                    onClick={() => setEditData(null)}
                                    // style="width: auto; justify-content: center; gap: 6px;"
                                    data-bs-toggle="modal" data-bs-target="#addCategoryModal">
                                    <img src="./images/white-plus.svg" class="template" alt='add icon' /> Add Category
                                </button>
                            </div>
                        </div>
                        <div class="table-container">
                            <div class="scroll-table">
                                <table ref={tableRef} class="custom-table">
                                    <thead>
                                        <tr>
                                            <th
                                                style={{
                                                    width: '40px'
                                                }}
                                            // style="width: 40px;"
                                            >S.No.</th>
                                            <th class="profile-pic">Name</th>
                                            <th class="table-expand">Created</th>
                                            <th class="table-expand">Action</th>

                                        </tr>
                                    </thead>

                                    <tbody>
                                        {currentItems && currentItems.length > 0 ? (
                                            currentItems.map((item, index) => (
                                                <tr key={item.id}>
                                                    <td>{String(index + 1).padStart(2, '0')}</td>
                                                    <td className="tempName">
                                                        {item.category_name}
                                                    </td>

                                                    <td>
                                                        {new Date(item.createdAt).toLocaleDateString()}
                                                    </td>

                                                    <td>
                                                        <img
                                                            src="./images/editsolid.svg"
                                                            className="icon-table"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#addCategoryModal"
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={() => setEditData(item)}
                                                            alt='edit icon'
                                                        />

                                                        <img
                                                            src="./images/del-solid.svg"
                                                            className="icon-table"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#deleteDesign"
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={() => setSelectedId(item.id)}
                                                            alt='delete icon'
                                                        />
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" style={{ textAlign: 'center' }}>
                                                    No categories found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>


                                    {/* <tbody>
                                        <tr>
                                            <td>01</td>
                                            <td class="tempName">Video</td>
                                            <td>12/02/2025</td>
                                            <td>
                                                <img src="./images/editsolid.svg" class="icon-table" data-bs-toggle="modal"
                                                    data-bs-target="#addCategoryModal" />
                                                <img src="./images/del-solid.svg" class="icon-table" data-bs-toggle="modal"
                                                    data-bs-target="#deleteDesign" />
                                            </td>

                                        </tr>
                                        <tr>
                                            <td>02</td>
                                            <td class="tempName">PDF</td>
                                            <td>10/02/2025</td>
                                            <td onClick={() => setEditData('PDF')}>
                                                <img src="./images/editsolid.svg" class="icon-table" data-bs-toggle="modal"
                                                    data-bs-target="#editCategoryModal" />
                                                <img src="./images/del-solid.svg" class="icon-table" data-bs-toggle="modal"
                                                    data-bs-target="#deleteDesign" />
                                            </td>

                                        </tr>
                                        <tr>
                                            <td>03</td>
                                            <td class="tempName">FAQ</td>
                                            <td>09/02/2025</td>
                                            <td>
                                                <img src="./images/editsolid.svg" class="icon-table" data-bs-toggle="modal"
                                                    data-bs-target="#editCategoryModal" />
                                                <img src="./images/del-solid.svg" class="icon-table" data-bs-toggle="modal"
                                                    data-bs-target="#deleteDesign" />
                                            </td>

                                        </tr>
                                    </tbody> */}
                                </table>
                            </div>
                            <Pagination
                                currentPage={currentPage}
                                totalItems={totalItems}
                                itemsPerPage={itemsPerPage}
                                onPageChange={setCurrentPage}
                            />
                            {/* <div class="pagination">
                                <button>&laquo;</button>
                                <button>&lt;</button>
                                <button class="active">1</button>
                                <button>2</button>
                                <button>3</button>
                                <button>...</button>
                                <button>10</button>
                                <button>&gt;</button>
                                <button>&raquo;</button>
                            </div> */}
                        </div>
                    </div>

                </div>
            </div>
            <AddEditShowcaseCategory editedData={editData} onSubmit={handleSubmit} />
            <DeleteModal
                onClose={handleClose}
                onConfirm={handleDelete}
                type={'templete'}
            />
        </>
    )
}

export default CategoryShowcases
