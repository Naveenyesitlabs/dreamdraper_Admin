// import { useEffect, useRef, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import MyPicker from '../components/commanComponents/MyPicker';
// import Pagination from '../components/commanComponents/Pagination';
// import AddTutorialModal from '../components/Modals/AddTutorialModal';
// import DeleteModal from '../components/Modals/DeleteModal';
// import SearchBox from '../components/table/SearchBox';
// import TutorialCategory from '../components/TutorialCategory';
// import useTableSort from '../hooks/useTableSort';
// import { deleteDate } from '../redux/admin/slices/libraryCategorySlice';
// import { addNewTutorails, fetchAllCategory, fetchAllTutorails, updateTutorails } from '../redux/admin/slices/TutorialAndMediaSlices';
// import { formatDateUSA } from '../utils/healper/dateHelper';
// import TemplateModal from '../components/Modals/TemplateModal'

// const TutorialsAndMedia = () => {
//     // table ref to apply sorting functionality
//     const tableRef = useTableSort({ excludeColumns: [6] });
//     const hasFetched = useRef(false);
//     const dispatch = useDispatch();
//     const { allTutorails } = useSelector((state) => state.TutorialAndMedia)
//     const [isCateManagerOpen, setIsCateManagerOpen] = useState(false);
//     const [loading, setLoading] = useState(true);
//     const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
//     const [search, setSearch] = useState('');
//     const [selectedTutorial, setSelectedTutorial] = useState(null);
//     const [tutorails, setTutorails] = useState([]);
//     const [filteredData, setFilteredData] = useState([])
//     const [currentPage, setCurrentPage] = useState(1);
//     const itemsPerPage = 10;

//     useEffect(() => {
//         if (hasFetched.current) return;
//         hasFetched.current = true;
//         setLoading(true)
//         dispatch(fetchAllCategory());
//         dispatch(fetchAllTutorails());
//     }, []);

//     useEffect(() => {
//         if (allTutorails) {
//             setTutorails(allTutorails)
//             setLoading(false)
//         }
//     }, [allTutorails])

//     useEffect(() => {
//         const tutorail = Array.isArray(tutorails) ? tutorails : [];
//         let filtered = [...tutorail];
//         if (search) {
//             const term = search.toLowerCase();
//             filtered = filtered.filter(item =>
//                 item?.title?.toLowerCase().includes(term)
//             );
//         }
//         if (dateRange.startDate && dateRange.endDate) {
//             const start = new Date(dateRange.startDate).setHours(0, 0, 0, 0);
//             const end = new Date(dateRange.endDate).setHours(23, 59, 59, 999);
//             filtered = filtered.filter(item => {
//                 const itemDate = new Date(item.createdAt).getTime();
//                 return itemDate >= start && itemDate <= end;
//             });
//         }
//         setFilteredData(filtered);
//         setCurrentPage(1)
//     }, [tutorails, search, dateRange]);


//     const handleSubmitNew = async (values, isEdit) => {
//         const appendIfExists = (formData, key, value) => {
//             if (value !== undefined && value !== null) {
//                 formData.append(key, value);
//             }
//         };
//         try {
//             const formData = new FormData();
//             ["title", "category_id", "duration", "description"].forEach(field =>
//                 formData.append(field, values[field] ?? "")
//             );
//             appendIfExists(formData, "id", values.id);
//             appendIfExists(formData, "tutorial", values.tutorial);
//             await dispatch(isEdit ? updateTutorails(formData) : addNewTutorails(formData));
//             await dispatch(fetchAllTutorails());
//             handleClose()
//         } catch (error) {
//             console.log("error from Tutorial page", error)
//         }
//     };

//     const handleClose = () => {
//         setSelectedTutorial(null)
//     };

//     const handleBack = () => {
//         setIsCateManagerOpen(!isCateManagerOpen)
//     };

//     const handleDelete = async () => {
//         try {
//             await dispatch(deleteDate({ id: selectedTutorial.id, type: 'tutorials_media' }))
//             await dispatch(fetchAllTutorails());
//         } catch (error) {
//             console.log("error from Tutorial page", error)
//         }
//     };

//     const totalItems = filteredData?.length;
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const currentItems = filteredData.slice(startIndex, startIndex + itemsPerPage);

//     const handleRange = (startDate, endDate) => {
//         setDateRange({ startDate, endDate });
//     };

//     return (
//         <>
//             {
//                 isCateManagerOpen ? (
//                     <TutorialCategory handleBack={handleBack} />
//                 ) : (
//                     <div className="content">
//                         <div className="main-content">
//                             <h2 className="heading-content">Tutorials & Media</h2 >
//                             <p className="text-content">Manage your DreamDraper platform</p>
//                             <div className="table-content">
//                                 <div className="content-header">
//                                     {/* <div className="search-align">
//                                         <img src="./images/search.svg" className="magnify" />
//                                         <input type="text" placeholder="Search tutorial" className="search-content" onChange={(e) => setSearch(e.target.value)} />
//                                     </div> */}
//                                     <SearchBox search={search} setSearch={setSearch} placeholder="Search Tutorial" />
//                                     <div className="content-right">
//                                         {/* <img className="datepicker" src="./images/datepicker.svg" /> */}
//                                         <MyPicker handleDateFilter={handleRange} />
//                                         <a href="#"
//                                             style={{
//                                                 textDecoration: 'none'
//                                             }}
//                                             onClick={() => handleBack()}
//                                         ><button type="button" className="template-upload"
//                                             style={{
//                                                 width: 'auto',
//                                                 justifyContent: 'center',
//                                                 gap: '6px'
//                                             }}
//                                         >
//                                                 <img src="./images/white-plus.svg" className="template" alt='add icon' /> Category Manager
//                                             </button></a>
//                                         <button type="button" className="template-upload"
//                                             style={{
//                                                 width: 'auto',
//                                                 justifyContent: 'center',
//                                                 gap: '6px'
//                                             }}
//                                             data-bs-toggle="modal" data-bs-target="#uploadTutorialModal">
//                                             <img src="./images/white-plus.svg" className="template" alt='add icon' /> Add Tutorial
//                                         </button>
//                                     </div>
//                                 </div>
//                                 <div className="table-container">
//                                     <div className="scroll-table">
//                                         <table ref={tableRef} className="custom-table">
//                                             <thead>
//                                                 <tr>
//                                                     <th>S.No.</th>
//                                                     <th className="table-expand"
//                                                         style={{
//                                                             width: '32px'
//                                                         }}
//                                                     >Title</th>
//                                                     <th className="table-expand">Type</th>
//                                                     <th className="table-expand">Views</th>
//                                                     <th className="table-expand">Duration</th>
//                                                     <th className="table-expand">Date Added</th>
//                                                     <th className="table-expand">View Tutorials</th>
//                                                     <th className="table-expand"
//                                                         style={{
//                                                             width: '115px'
//                                                         }}
//                                                     >Action</th>
//                                                 </tr>
//                                             </thead>
//                                             <tbody>
//                                                 {loading ? (
//                                                     <tr>
//                                                         <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
//                                                             <div className="spinner-border text-primary"></div>
//                                                             <p>Loading tutorials...</p>
//                                                         </td>
//                                                     </tr>
//                                                 ) : currentItems.length === 0 ? (
//                                                     <tr>
//                                                         <td colSpan="7" style={{ textAlign: "center", padding: "20px", color: "#777" }}>
//                                                             No tutorials found to display.
//                                                         </td>
//                                                     </tr>
//                                                 ) : (
//                                                     currentItems.map((tutorial, index) => (
//                                                         <tr key={tutorial.id}>
//                                                             <td>{index + 1}</td>

//                                                             <td className="tutorials-data">{tutorial.title}</td>

//                                                             <td className="desc-tutorial">
//                                                                 <button className="vedio-type">
//                                                                     {tutorial.type?.category_name || "N/A"}
//                                                                 </button>
//                                                             </td>
//                                                             <td className="main-cat">{tutorial.views}</td>
//                                                             <td className="main-cat">{tutorial.duration}</td>
//                                                             <td className="nested-cat">
//                                                                 {formatDateUSA(tutorial.createdAt) || "-"}
//                                                             </td>
//                                                             <td className="eye-td">
//                                                                 <button
//                                                                     className="view-link bg-transparent border-0"
//                                                                     data-bs-toggle="modal"
//                                                                     data-bs-target="#uploadTemplateModal"
//                                                                 // onClick={() => { setSelectedTemplate(item), handleIsEdit(true) }}
//                                                                 >
//                                                                     View <img src="./images/solid-eye.svg" className="eye-img" alt="View" />
//                                                                 </button>
//                                                             </td>
//                                                             <td>
//                                                                 <img
//                                                                     src="./images/editsolid.svg"
//                                                                     className="icon-table"
//                                                                     style={{ cursor: "pointer" }}
//                                                                     data-bs-toggle="modal"
//                                                                     data-bs-target="#uploadTutorialModal"
//                                                                     onClick={() => setSelectedTutorial(tutorial)}
//                                                                     alt='edit icon'
//                                                                 />
//                                                                 <img
//                                                                     src="./images/del-solid.svg"
//                                                                     className="icon-table"
//                                                                     style={{ cursor: "pointer" }}
//                                                                     data-bs-toggle="modal"
//                                                                     data-bs-target="#deleteDesign"
//                                                                     onClick={() => setSelectedTutorial(tutorial)}
//                                                                     alt='delete icon'
//                                                                 />
//                                                             </td>
//                                                         </tr>
//                                                     ))
//                                                 )}
//                                             </tbody>
//                                         </table>
//                                     </div>
//                                     <Pagination
//                                         currentPage={currentPage}
//                                         totalItems={totalItems}
//                                         itemsPerPage={itemsPerPage}
//                                         onPageChange={setCurrentPage}
//                                     />
//                                 </div>
//                             </div>
//                         </div >
//                     </div >
//                 )
//             }
//             <DeleteModal
//                 onClose={handleClose}
//                 onConfirm={handleDelete}
//                 type={"tutorial"}
//             />
//             <AddTutorialModal initialData={selectedTutorial} onSubmit={handleSubmitNew} onReset={handleClose} />
//         </>
//     )
// }

// export default TutorialsAndMedia

// _________________________________________________________________________________________________________________
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MyPicker from '../components/commanComponents/MyPicker';
import Pagination from '../components/commanComponents/Pagination';
import AddTutorialModal from '../components/Modals/AddTutorialModal';
import DeleteModal from '../components/Modals/DeleteModal';
import SearchBox from '../components/table/SearchBox';
import TutorialCategory from '../components/TutorialCategory';
import useTableSort from '../hooks/useTableSort';
import { deleteDate } from '../redux/admin/slices/libraryCategorySlice';
import { addNewTutorails, fetchAllCategory, fetchAllTutorails, updateTutorails } from '../redux/admin/slices/TutorialAndMediaSlices';
import { formatDateUSA } from '../utils/healper/dateHelper';

const TutorialsAndMedia = () => {
    const tableRef = useTableSort({ excludeColumns: [7] });
    const hasFetched = useRef(false);
    const dispatch = useDispatch();
    const { allTutorails } = useSelector((state) => state.TutorialAndMedia);

    const [isCateManagerOpen, setIsCateManagerOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
    const [search, setSearch] = useState('');
    const [selectedTutorial, setSelectedTutorial] = useState(null);
    const [tutorails, setTutorails] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isView, setIsView] = useState(false); // New state for viewing
    const itemsPerPage = 10;

    // Fetch tutorials and categories
    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        setLoading(true);
        dispatch(fetchAllCategory());
        dispatch(fetchAllTutorails());
    }, []);

    useEffect(() => {
        if (allTutorails) {
            setTutorails(allTutorails);
            setLoading(false);
        }
    }, [allTutorails]);

    // Filtering based on search and date range
    useEffect(() => {
        const tutorail = Array.isArray(tutorails) ? tutorails : [];
        let filtered = [...tutorail];

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
        setCurrentPage(1);
    }, [tutorails, search, dateRange]);

    const handleSubmitNew = async (values, isEdit) => {
        const appendIfExists = (formData, key, value) => {
            if (value !== undefined && value !== null) formData.append(key, value);
        };

        try {
            const formData = new FormData();
            ["title", "category_id", "duration", "description"].forEach(field =>
                formData.append(field, values[field] ?? "")
            );
            appendIfExists(formData, "id", values.id);
            appendIfExists(formData, "tutorial", values.tutorial);

            await dispatch(isEdit ? updateTutorails(formData) : addNewTutorails(formData));
            await dispatch(fetchAllTutorails());
            handleClose();
        } catch (error) {
            console.log("error from Tutorial page", error);
        }
    };

    const handleClose = () => {
        setSelectedTutorial(null);
        setIsView(false);
    };

    const handleBack = () => {
        setIsCateManagerOpen(!isCateManagerOpen);
    };

    const handleDelete = async () => {
        try {
            await dispatch(deleteDate({ id: selectedTutorial.id, type: 'tutorials_media' }));
            await dispatch(fetchAllTutorails());
            handleClose();
        } catch (error) {
            console.log("error from Tutorial page", error);
        }
    };

    const handleRange = (startDate, endDate) => {
        setDateRange({ startDate, endDate });
    };

    const totalItems = filteredData?.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const handleView = (tutorial) => {
        setSelectedTutorial(tutorial);
        setIsView(true);
    };

    return (
        <>
            {isCateManagerOpen ? (
                <TutorialCategory handleBack={handleBack} />
            ) : (
                <div className="content">
                    <div className="main-content">
                        <h2 className="heading-content">Tutorials & Media</h2>
                        <p className="text-content">Manage your DreamDraper platform</p>
                        <div className="table-content">
                            <div className="content-header">
                                <SearchBox search={search} setSearch={setSearch} placeholder="Search Tutorial" />
                                <div className="content-right">
                                    <MyPicker handleDateFilter={handleRange} />
                                    <button
                                        type="button"
                                        className="template-upload"
                                        style={{ width: 'auto', justifyContent: 'center', gap: '6px' }}
                                        onClick={handleBack}
                                    >
                                        <img src="./images/white-plus.svg" className="template" alt='add icon' /> Category Manager
                                    </button>
                                    <button
                                        type="button"
                                        className="template-upload"
                                        style={{ width: 'auto', justifyContent: 'center', gap: '6px' }}
                                        data-bs-toggle="modal"
                                        data-bs-target="#uploadTutorialModal"
                                    >
                                        <img src="./images/white-plus.svg" className="template" alt='add icon' /> Add Tutorial
                                    </button>
                                </div>
                            </div>
                            <div className="table-container">
                                <div className="scroll-table">
                                    <table ref={tableRef} className="custom-table">
                                        <thead>
                                            <tr>
                                                <th>S.No.</th>
                                                <th>Title</th>
                                                <th>Type</th>
                                                <th>Views</th>
                                                <th>Duration</th>
                                                <th>Date Added</th>
                                                <th>View Tutorials</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loading ? (
                                                <tr>
                                                    <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>
                                                        <div className="spinner-border text-primary"></div>
                                                        <p>Loading tutorials...</p>
                                                    </td>
                                                </tr>
                                            ) : currentItems.length === 0 ? (
                                                <tr>
                                                    <td colSpan="8" style={{ textAlign: "center", padding: "20px", color: "#777" }}>
                                                        No tutorials found to display.
                                                    </td>
                                                </tr>
                                            ) : (
                                                currentItems.map((tutorial, index) => (
                                                    <tr key={tutorial.id}>
                                                        <td>{startIndex + index + 1}</td>
                                                        <td className="tutorials-data">{tutorial.title}</td>
                                                        <td className="desc-tutorial">
                                                            <button className="vedio-type">{tutorial.type?.category_name || "N/A"}</button>
                                                        </td>
                                                        <td className="main-cat">{tutorial.views}</td>
                                                        <td className="main-cat">{tutorial.duration}</td>
                                                        <td className="nested-cat">{formatDateUSA(tutorial.createdAt) || "-"}</td>
                                                        <td className="eye-td">
                                                            <button
                                                                className="view-link bg-transparent border-0"
                                                                onClick={() => handleView(tutorial)}
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#uploadTutorialModal"
                                                            >
                                                                View <img src="./images/solid-eye.svg" className="eye-img" alt="View" />
                                                            </button>
                                                        </td>
                                                        <td>
                                                            <img
                                                                src="./images/editsolid.svg"
                                                                className="icon-table"
                                                                style={{ cursor: "pointer" }}
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#uploadTutorialModal"
                                                                onClick={() => setSelectedTutorial(tutorial)}
                                                                alt='edit icon'
                                                            />
                                                            <img
                                                                src="./images/del-solid.svg"
                                                                className="icon-table"
                                                                style={{ cursor: "pointer" }}
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#deleteDesign"
                                                                onClick={() => setSelectedTutorial(tutorial)}
                                                                alt='delete icon'
                                                            />
                                                        </td>
                                                    </tr>
                                                ))
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
            )}

            {/* Delete Modal */}
            <DeleteModal
                onClose={handleClose}
                onConfirm={handleDelete}
                type={"tutorial"}
            />

            {/* Add/Edit/View Tutorial Modal */}
            <AddTutorialModal
                initialData={selectedTutorial}
                onSubmit={handleSubmitNew}
                onReset={handleClose}
                isView={isView} // Pass view mode
            />
        </>
    );
};

export default TutorialsAndMedia;