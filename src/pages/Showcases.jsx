import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AddEditShowcases from '../components/Modals/AddEditShowcases'
import DeleteModal from '../components/Modals/DeleteModal'
import MyPicker from '../components/commanComponents/MyPicker'
import Pagination from '../components/commanComponents/Pagination'
import SearchBox from '../components/table/SearchBox'
import useTableSort from '../hooks/useTableSort'
import { deleteDate } from '../redux/admin/slices/libraryCategorySlice'
import { addNewShowcases, getAllShowcases, updateShowcases } from '../redux/admin/slices/showcases'
import { formatDateUSA } from '../utils/healper/dateHelper'
import CategoryShowcases from './CategoryShowcases'

const Showcases = () => {
    // table ref to apply sorting functionality
    const tableRef = useTableSort({ excludeColumns: [4] });
    const hasFetched = useRef(false);
    const dispatch = useDispatch()
    const { showcasesData } = useSelector((state) => state.showcase);
    const [openCategory, setOpenCategory] = useState(false)
    const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
    const [allShowcase, setAllShowcase] = useState([])
    const [editedData, setEditedData] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedId, setSelectedId] = useState('')
    const [filteredData, setFilteredData] = useState(null)
    const [search, setSearch] = useState('')
    const itemsPerPage = 10;

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        dispatch(getAllShowcases())
    }, [])

    useEffect(() => {
        if (showcasesData) {
            setAllShowcase(showcasesData);
        }
    }, [dispatch, showcasesData])

    const handleClose = () => {
        // setSelectedTemplate(null)
        setSelectedId('');
    }

    const handleDelete = async () => {
        try {
            await dispatch(deleteDate({ id: selectedId, type: 'showcase' }))
            dispatch(getAllShowcases())
            setSelectedId('');
        } catch (error) {
            console.log("error from library page", error)
        }
    }

    const handleOpenCloseCate = () => {
        setOpenCategory(!openCategory)
    }

    useEffect(() => {
        const showcases = Array.isArray(allShowcase) ? allShowcase : [];
        let filtered = [...showcases];
        if (search) {
            const term = search.toLowerCase();
            filtered = filtered.filter(item =>
                item?.title?.toLowerCase().includes(term)
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
    }, [allShowcase, search, dateRange]);

    const handleRange = (startDate, endDate) => {
        setDateRange({ startDate, endDate });
    };

    const totalItems = filteredData?.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredData?.slice(startIndex, startIndex + itemsPerPage);

    const handleSubmit = async (updatedData, isEdit) => {
        // let res;
        console.log("isEdit", isEdit)
        isEdit ?
            await dispatch(updateShowcases(updatedData)) :
            await dispatch(addNewShowcases(updatedData))
        await dispatch(getAllShowcases());

        document.querySelector('[data-bs-dismiss="modal"]').click();

    }
    return (
        <>
            {
                openCategory ? (
                    <CategoryShowcases onBack={handleOpenCloseCate} />
                ) : (
                    <div className="content">
                        <div className="main-content">
                            <h2 className="heading-content">Showcases</h2>
                            <p className="text-content">Manage your DreamDraper platform</p>

                            <div className="table-content">
                                <div className="content-header">
                                    {/* <div className="search-align">
                                        <img src="./images/search.svg" className="magnify" />
                                        <input type="text" placeholder="Search User Name" className="search-content" onChange={(e) => setSearch(e.target.value)} />
                                    </div> */}
                                    <SearchBox search={search} setSearch={setSearch} placeholder="Search Showcase" />
                                    <div className="content-right">
                                        {/* <img className="datepicker" src="./images/datepicker.svg" /> */}
                                        <MyPicker handleDateFilter={handleRange} />
                                        <a href="#"
                                            // style="text-decoration: none;"
                                            style={{
                                                textDecoration: 'none'
                                            }}
                                        > <button type="button" className="template-upload"
                                            style={{
                                                width: "auto",
                                                justifyContent: 'center',
                                                gap: "6px"
                                            }}
                                            // style="width: auto; justify-content: center; gap: 6px;"
                                            onClick={handleOpenCloseCate}
                                        >
                                                    <img src="./images/white-plus.svg" className="template" alt='plus icon' /> Category Manager
                                            </button></a>
                                        <button type="button" className="template-upload"
                                            style={{
                                                width: 'auto',
                                                justifyContent: 'center',
                                                gap: '6px'
                                            }}
                                            // style="width: auto; justify-content: center; gap: 6px;"
                                            data-bs-toggle="modal" data-bs-target="#uploadTemplateModal" onClick={() => setEditedData(null)}>
                                            <img src="./images/white-plus.svg" className="template" alt='plus icon' /> Add Showcase
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
                                                    // style="width: 40px;"
                                                    >S.No.</th>
                                                    <th className="table-expand">Title</th>
                                                    <th className="table-expand">Category</th>
                                                    <th className="table-expand">Date Added</th>
                                                    <th className="table-expand">Action</th>
                                                </tr>
                                            </thead>
                                            {
                                                <tbody>
                                                    {currentItems && currentItems.length > 0 ? (
                                                        currentItems.map((item, index) => (
                                                            <tr key={item.id}>
                                                                <td>{index + 1}</td>
                                                                <td className="tutorials-data">{item?.title}</td>
                                                                <td>{item?.category?.category_name}</td>
                                                                <td className="main-cat">{formatDateUSA(item.createdAt)}</td>
                                                                <td>
                                                                    {/* Edit Button */}
                                                                    <img
                                                                        src="./images/editsolid.svg"
                                                                        className="icon-table"
                                                                        style={{ display: 'inline-block', cursor: 'pointer' }}
                                                                        data-bs-toggle="modal"
                                                                        data-bs-target="#uploadTemplateModal"
                                                                        onClick={() => setEditedData(item)} // Fill modal with selected item
                                                                        alt="Edit Icon"
                                                                    />

                                                                    {/* Delete Button */}
                                                                    <img
                                                                        src="./images/del-solid.svg"
                                                                        className="icon-table"
                                                                        style={{ display: 'inline-block', cursor: 'pointer' }}
                                                                        data-bs-toggle="modal"
                                                                        data-bs-target="#deleteDesign"
                                                                        onClick={() => setSelectedId(item.id)} // Store id for deletion
                                                                        alt="Delete Icon"
                                                                    />
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan={5} style={{ textAlign: 'center' }}>
                                                                No showcases found
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            }
                                        </table>
                                    </div>

                                    {/* <!-- Pagination --> */}

                                    <Pagination
                                        currentPage={currentPage}
                                        totalItems={totalItems}
                                        itemsPerPage={itemsPerPage}
                                        onPageChange={setCurrentPage}
                                    />

                                    {/* <div className="pagination">
                                        <button>&laquo;</button>
                                        <button>&lt;</button>
                                        <button className="active">1</button>
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
                )
            }

            <AddEditShowcases initialData={editedData} onSubmit={handleSubmit} />
            <DeleteModal
                onClose={handleClose}
                onConfirm={handleDelete}
                type={'showcase'}
            />
        </>
    )
}

export default Showcases
