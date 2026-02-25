import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProjectDaitles from '../components/ProjectDaitles';
import MyPicker from '../components/commanComponents/MyPicker';
import Pagination from '../components/commanComponents/Pagination';
import SearchBox from '../components/table/SearchBox';
import useTableSort from '../hooks/useTableSort';
import { fetchAllUserByProject } from '../redux/admin/slices/projectManagemetSlice';
import { formatDateUSA } from '../utils/healper/dateHelper';

const getTimeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    return `${days} day${days > 1 ? "s" : ""} ago`;
};
const ProjectManagement = () => {
    // table ref to apply sorting functionality
    const tableRef = useTableSort({ excludeColumns: [6] });
    const hasFetched = useRef(false);
    const dispatch = useDispatch();
    const { allUserByProject } = useSelector((state) => state.project)
    const [isProjectDaitlesOpen, setIsProjectDaitlesOpen] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [filteredData, setFilteredData] = useState([])
    const [searchTerm, setSearchTerm] = useState("");
    const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        dispatch(fetchAllUserByProject())
    }, []);
    useEffect(() => {
        if (allUserByProject) {
            setAllUsers(allUserByProject)
            setLoading(false)
        }
    }, [allUserByProject]);
    useEffect(() => {
        const list = Array.isArray(allUsers) ? allUsers : [];
        let filtered = [...list];
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(item =>
                item?.name?.toLowerCase().includes(term)
            );
        }
        if (dateRange.startDate && dateRange.endDate) {
            const start = new Date(dateRange.startDate).setHours(0, 0, 0, 0);
            const end = new Date(dateRange.endDate).setHours(23, 59, 59, 999);
            filtered = filtered.filter(item => {
                const itemDate = new Date(item.last_modified).getTime();
                return itemDate >= start && itemDate <= end;
            });
        }
        setFilteredData(filtered);
        setCurrentPage(1)
    }, [allUsers, searchTerm, dateRange]);

    const totalItems = filteredData?.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const handleBack = () => {
        setSelectedUser(null)
        setIsProjectDaitlesOpen(false);
    }
    const handleRange = (startDate, endDate) => {
        setDateRange({ startDate, endDate });
    };
    return (
        <> {
            isProjectDaitlesOpen ? (
                <ProjectDaitles user={selectedUser} onBack={handleBack} />
            ) : (
                <div className="content">
                    <div className="main-content">
                        <h2 className="heading-content">Project Management</h2>
                        <p className="text-content">Manage your DreamDraper platform</p>

                        <div className="table-content">
                            <div className="content-header">
                                {/* <div className="search-align">
                                    <img src="./images/search.svg" className="magnify" />
                                    <input type="text" placeholder="Search User Name" className="search-content" onChange={(e) => setSearchTerm(e.target.value)} />
                                </div> */}
                                <SearchBox search={searchTerm} setSearch={setSearchTerm} placeholder="Search Project" />
                                <div className="content-right">
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
                                                <th className="profile-pic">Owner</th>
                                                <th className="table-expand">No. of Projects</th>
                                                <th className="table-expand">Last Modified</th>
                                                <th className="table-expand">Alteration Count</th>
                                                <th className="table-expand">Last Active</th>
                                                <th className="table-expand">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                loading ? (
                                                    <tr>
                                                        <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                                                            Loading data...
                                                        </td>
                                                    </tr>
                                                ) : currentItems?.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="7" style={{ textAlign: "center", padding: "20px", color: "#888" }}>
                                                            No users found.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    currentItems.map((user, index) => (
                                                        <tr key={index}>
                                                            <td>{startIndex + index + 1}</td>
                                                            <td>{user.name}</td>
                                                            <td>{user.no_of_projects}</td>
                                                            <td>
                                                                {/* <p className="timendate">
                                                                    {user.last_modified
                                                                        ? new Date(user.last_modified).toLocaleDateString()
                                                                        : ""}
                                                                </p>
                                                                <p className="timendate">
                                                                    {user.last_modified
                                                                        ? new Date(user.last_modified).toLocaleTimeString([], {
                                                                            hour: "2-digit",
                                                                            minute: "2-digit"
                                                                        })
                                                                        : ""}
                                                                </p> */}
                                                                <p className='timedate'>
                                                                    {formatDateUSA(user.last_modified, true) || ""}
                                                                </p>
                                                            </td>
                                                            <td>{user.updated_count}</td>
                                                            <td>
                                                                {user.is_login == 1 ? (
                                                                    <p className="timendate">Active Now</p>
                                                                ) : (
                                                                    // <>
                                                                    //     <p className="timendate">
                                                                    //         {user.last_active
                                                                    //             ? new Date(user.last_active).toLocaleDateString()
                                                                    //             : ""}
                                                                    //     </p>

                                                                    //     <p className="timendate">
                                                                    //         {user.last_active
                                                                    //             ? new Date(user.last_active).toLocaleTimeString([], {
                                                                    //                 hour: "2-digit",
                                                                    //                 minute: "2-digit"
                                                                    //             })
                                                                    //             : ""}
                                                                    //     </p>
                                                                    // </>
                                                                    <p>{user.last_active ? getTimeAgo(user.last_active) : ""}</p>
                                                                )}
                                                            </td>
                                                            {/* View Button */}
                                                            <td className="eye-td">
                                                                <a
                                                                    href="#"
                                                                    className="view-link"
                                                                    onClick={() => {
                                                                        setSelectedUser(user);
                                                                        setIsProjectDaitlesOpen(true);
                                                                    }}
                                                                >
                                                                    View
                                                                    <img
                                                                        src="./images/solid-eye.svg"
                                                                        className="eye-img"
                                                                        alt="view"
                                                                    />
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )
                                            }
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
            )
        }
        </>
    )
}

export default ProjectManagement