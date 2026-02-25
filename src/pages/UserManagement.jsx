import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ActivateModal } from '../components/Modals/ActivateUserModal';
import AddAndEditUser from '../components/Modals/AddAndEditUser';
import DeleteModal from '../components/Modals/DeleteModal';
import MyPicker from '../components/commanComponents/MyPicker';
import Pagination from '../components/commanComponents/Pagination';
import SearchBox from '../components/table/SearchBox';
import useTableSort from '../hooks/useTableSort';
import { deleteUser, getAllUsers, statusUpdate, updateUser } from '../redux/admin/slices/adminSlices';
import { formatDateUSA } from '../utils/healper/dateHelper';


const UserManagement = () => {
    // table ref to apply sorting functionality, excluding profile picture and action columns
    const tableRef = useTableSort({ excludeColumns: [1, 8] });
    const hasFetched = useRef(false);
    const dispatch = useDispatch();
    const { userdata } = useSelector((state) => state.user)
    const [search, setSearch] = useState('');
    const [searchTearm, setSearchTearm] = useState('')
    const [showDelete, setShowDelete] = useState('')
    const [showActiveModal, setShowActiveModal] = useState(false);
    const [allUser, setAllUser] = useState([]);
    const [userStatus, setUserStatus] = useState('');
    const [editData, setEditData] = useState({});
    const [filteredData, setFilteredData] = useState([])
    const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);


    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        dispatch(getAllUsers());
    }, [dispatch]);

    useEffect(() => {
        if (userdata) {
            setAllUser(userdata)
        }
    }, [userdata])

    useEffect(() => {
        const users = Array.isArray(allUser) ? allUser : [];
        let filtered = [...users];
        if (search) {
            const term = search.toLowerCase();
            filtered = filtered.filter(item =>
                item?.name?.toLowerCase().includes(term)
            );
        }
        if (searchTearm == 'Active') {
            filtered = filtered.filter(item => item.is_active == 1);

        } else if (searchTearm == 'In Active') {
            filtered = filtered.filter(item => item.is_active == 0);
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
    }, [allUser, search, searchTearm, dateRange]);

// ----New----
    useEffect(() => {
        const handleClickOutside = (event) => {
            const dropdown = document.querySelector(".dropdown");
    
            if (dropdown && !dropdown.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
    
        document.addEventListener("mousedown", handleClickOutside);
    
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // function toggleDropdown() {
    //     const menu = document.getElementById("dropdownMenu");
    //     const btn = document.querySelector(".status-btn");
    //     if (menu.style.display === "block") {
    //         menu.style.display = "none";
    //         btn.classList.remove("open");
    //     } else {
    //         menu.style.display = "block";
    //         btn.classList.add("open");
    //     }
    // }

    const toggleDropdown = () => {
        // e.stopPropagation(); 
        // setIsDropdownOpen(!isDropdownOpen);
        setIsDropdownOpen(prev => !prev);
        console.log(isDropdownOpen, "@@@@11");
    };

    // const closeDropdown = () => {
    //     const menu = document.getElementById("dropdownMenu");
    //     const btn = document.querySelector(".status-btn");
    //     if (menu) {
    //         menu.style.display = "none";
    //         btn?.classList.remove("open");
    //     }
    //     console.log("2222222@@@@")
    // }

    const handleActiveConfirm = async (id) => {
        try {
            await dispatch(statusUpdate({ user_id: id }));
            await dispatch(getAllUsers());
            setShowActiveModal(false);
        } catch (error) {
            console.log("error from User page", error)
        }

    };

    const handleDelete = async () => {
        try {
            await dispatch(deleteUser({ user_id: showDelete.id }))
            await dispatch(getAllUsers());
            setShowDelete('');
        } catch (error) {
            console.log("error from User page", error)
        }
    };

    const handleSubmit = async (updatedData) => {
        try {
            await dispatch(updateUser(updatedData))
            await dispatch(getAllUsers());
            setEditData({})
        } catch (error) {
            console.log("error from User page", error)
        }
    }

    const totalItems = filteredData?.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const handleRange = (startDate, endDate) => {
        setDateRange({ startDate, endDate });
        // closeDropdown();
        setIsDropdownOpen(false);
    };

    return (
        <>
            <div className="content">
                <div className="main-content">
                    <h2 className="heading-content">User Management</h2>
                    <p className="text-content">Manage your DreamDraper platform</p>

                    <div className="table-content">
                        <div className="content-header">
                            <SearchBox search={search} setSearch={setSearch} placeholder="Search User" />
                            <div className="content-right">
                                <div className="dropdown">
                                    {/* <div className="status-btn"
                                        onClick={() =>toggleDropdown()}
                                    > */}
                                    <div className={`status-btn ${isDropdownOpen ? "open" : ""}`} onClick={toggleDropdown}>
                                        <span id="label">{searchTearm !== '' ? searchTearm : "Status"}</span>
                                        <img src="./images/dropdown.svg" className="dropdown-arrow" alt='dropdown image' />
                                    </div>
                                    {isDropdownOpen && (
                                        // <div className="menu" id="dropdownMenu" style={{ zIndex: 7 }}>
                                        <div className="menu" style={{display: "block", zIndex: 7 }}>
                                            {
                                                searchTearm !== '' && (<div onClick={() => { setSearchTearm(''); setIsDropdownOpen(false); }} style={{
                                                    color: '#98999c'
                                                }}>Status</div>)
                                            }

                                            <div onClick={() => { setSearchTearm('Active'); setIsDropdownOpen(false); }}>Active</div>
                                            <div onClick={() => { setSearchTearm('In Active'); setIsDropdownOpen(false); }}>In Active</div>

                                        </div>
                                    )}
                                </div>
                                {/* <img className="datepicker" src="./images/datepicker.svg" /> */}
                                <MyPicker handleDateFilter={handleRange} />
                            </div>
                        </div>
                        <div className="table-container">
                            <div className="scroll-table">
                                <table ref={tableRef} className="custom-table">
                                    <thead>
                                        <tr>
                                            <th>S.No.</th>
                                            <th className="profile-pic">Profile Picture</th>
                                            <th className="table-expand">Name</th>
                                            <th className="table-expand">Username</th>
                                            <th className="table-expand">Email ID</th>
                                            <th className="table-expand">Phone Number</th>
                                            <th className="table-expand">Joined Date</th>
                                            <th className="table-expand">Status</th>
                                            <th className="table-expand">Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {currentItems.length > 0 ? (
                                            currentItems.map((user, index) => (
                                                <tr key={user.id || index} className="rounded-tr">
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        {user.profileImage && (
                                                            <img src={user.profileImage || "./images/table-img.svg"} className="table-img" alt="User" />
                                                        )}
                                                    </td>
                                                    <td>{user.name || "N/A"}</td>
                                                    <td>{user.username || "N/A"}</td>
                                                    <td>{user.email || "N/A"}</td>
                                                    <td>{user.phone || "N/A"}</td>
                                                    <td>{formatDateUSA(user.createdAt) || "06-10-2025"}</td>
                                                    <td>
                                                        <button
                                                            style={
                                                                user.is_active == 1
                                                                    ? {}
                                                                    : { background: '#4B5563', width: '69px' }
                                                            }
                                                            className="status-btn-library"
                                                            // data-bs-toggle="modal"
                                                            // data-bs-target="#activateTemplateModal"
                                                            onClick={() => { setUserStatus(user), setShowActiveModal(true) }}
                                                        >
                                                            {user.is_active == 1 ? "Active" : "Inactive"}
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <img
                                                            src="./images/editsolid.svg"
                                                            alt="Edit"
                                                            style={{
                                                                display: 'inline-block',
                                                                width: '20px',
                                                                height: '20px',
                                                                marginRight: '8px',
                                                                cursor: 'pointer',
                                                            }}
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#editUserModal"
                                                            onClick={() => setEditData(user)}
                                                        />
                                                        <img
                                                            src={`${user.is_active == 1 ? "./images/true-solid.svg" : './images/warningSign.svg'}`}
                                                            className="icon-table"
                                                            alt="Activate"
                                                            style={{
                                                                display: 'inline-block',
                                                                width: '20px',
                                                                height: '20px',
                                                                marginRight: '8px',
                                                                cursor: 'pointer',
                                                            }}
                                                            onClick={() => { setUserStatus(user), setShowActiveModal(true) }}
                                                        />
                                                        <img
                                                            src="./images/del-solid.svg"
                                                            alt="Delete"
                                                            style={{
                                                                display: 'inline-block',
                                                                width: '20px',
                                                                height: '20px',
                                                                cursor: 'pointer',
                                                            }}
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#deleteDesign"
                                                            onClick={() => setShowDelete(user)}
                                                        />
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="10" className="text-center">No users found</td>
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
                onClose={() => setShowDelete('')}
                onConfirm={handleDelete}
                type={'user'}
            />
            {
                showActiveModal && (
                    <ActivateModal onClose={() => setShowActiveModal(false)}
                        onConfirm={handleActiveConfirm}
                        User={userStatus}
                    />
                )
            }
            <AddAndEditUser editedData={editData} onSubmit={handleSubmit} />
        </>

    )
}

export default UserManagement
