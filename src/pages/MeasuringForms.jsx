import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AddEditForm from '../components/Modals/AddEditForm'
import DeleteModal from '../components/Modals/DeleteModal'
import MyPicker from '../components/commanComponents/MyPicker'
import Pagination from '../components/commanComponents/Pagination'
import SearchBox from '../components/table/SearchBox'
import useTableSort from '../hooks/useTableSort'
import { deleteDate } from '../redux/admin/slices/libraryCategorySlice'
import { addMeasuring, getAllMeasuring, updateMeasuring } from '../redux/admin/slices/measuringFormsSlices'
import { formatDateUSA } from '../utils/healper/dateHelper'

const MeasuringForms = () => {
    // table ref to apply sorting functionality
    const tableRef = useTableSort({ excludeColumns: [3, 5] });
    const hasFetched = useRef(false);
    const dispatch = useDispatch();
    const { allMeasuring } = useSelector((state) => state.MeasuringForms)
    const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
    const [data, setData] = useState([])
    const [search, setSearch] = useState('');
    const [selectedItem, setSelectedItem] = useState(null)
    const [filteredData, setFilteredData] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;


    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        dispatch(getAllMeasuring())
    }, []);

    useEffect(() => {
        if (allMeasuring) {
            setData(allMeasuring)
        }
    }, [allMeasuring])

    const handleSubmit = async (values) => {
        try {
            selectedItem !== null ? await dispatch(updateMeasuring(values)) :
                await dispatch(addMeasuring(values))

            await dispatch(getAllMeasuring())
        } catch (error) {
            console.log("error from measuring page", error)
        }
    }

    const handleClose = () => {
        setSelectedItem(null);
    };

    const handleDelete = async () => {
        try {
            await dispatch(deleteDate({ id: selectedItem.id, type: 'measuring_form' }))
            await dispatch(getAllMeasuring())
            setSelectedItem(null);
        } catch (error) {
            console.log("error from library page", error)
        }
    }

    useEffect(() => {
        const measuringForms = Array.isArray(data) ? data : [];
        let filtered = [...measuringForms];
        if (search) {
            const term = search.toLowerCase();
            filtered = filtered.filter(item =>
                item?.title?.toLowerCase().includes(term)
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
    }, [data, search, dateRange]);

    const totalItems = filteredData?.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const handleRange = (startDate, endDate) => {
        setDateRange({ startDate, endDate });
    };

    return (
        <>
            <div className="content">
                <div className="main-content">
                    <h2 className="heading-content">Measuring Forms</h2>
                    <p className="text-content">Manage your DreamDraper platform</p>

                    <div className="table-content">
                        <div className="content-header">
                            {/* <div className="search-align">
                                <img src="./images/search.svg" className="magnify" />
                                <input type="text" placeholder="Search designe title" className="search-content" onChange={(e) => setSearch(e.target.value)} />
                            </div> */}
                            <SearchBox search={search} setSearch={setSearch} placeholder="Search Measuring Forms" />
                            <div className="content-right">
                                {/* <img className="datepicker" src="./images/datepicker.svg" /> */}
                                <MyPicker handleDateFilter={handleRange} />
                                <button type="button" className="template-upload"
                                    style={{
                                        width: 'auto',
                                        justifyContent: 'center',
                                        gap: '6px'
                                    }}
                                    data-bs-toggle="modal" data-bs-target="#addmeasuringform" onClick={() => setSelectedItem(null)}>
                                    <img src="./images/white-plus.svg" className="template" alt='' /> Add Form
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
                                            <th className="table-expand"
                                                style={{
                                                    width: '324px'
                                                }}
                                            >Title</th>
                                            <th className="table-expand">Price</th>
                                            <th className="table-expand"
                                                style={{
                                                    width: '247px'
                                                }}
                                            >Description</th>
                                            <th className="table-expand">Date Added</th>
                                            <th className="table-expand"
                                                style={{
                                                    width: '115px'
                                                }}
                                            >Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentItems && currentItems.length > 0 ? (
                                            currentItems.map((item, index) => (
                                                <tr key={item.id || index}>
                                                    <td>{index + 1}</td>
                                                    <td className="tutorials-data">{item.title}</td>
                                                    <td className="main-cat">{item.price}</td>
                                                    <td className="main-cat">{item.description}</td>
                                                    <td className="nested-cat">{formatDateUSA(item.createdAt) || "-"}</td>
                                                    <td>
                                                        <img
                                                            src="./images/editsolid.svg"
                                                            className="icon-table"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#addmeasuringform"
                                                            style={{ display: 'inline-block' }}
                                                            onClick={() => setSelectedItem(item)}
                                                            alt=""
                                                        />
                                                        <img
                                                            src="./images/del-solid.svg"
                                                            className="icon-table"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#deleteDesign"
                                                            style={{ display: 'inline-block' }}
                                                            onClick={() => setSelectedItem(item)}
                                                            alt=""
                                                        />
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" style={{ textAlign: 'center' }}>
                                                    No data available
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* <!-- Pagination --> */}
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
            <AddEditForm initialValues={selectedItem} onSubmit={handleSubmit} />
            <DeleteModal
                onClose={handleClose}
                onConfirm={handleDelete}
                type={'forms'}
            />
        </>
    )
}

export default MeasuringForms
