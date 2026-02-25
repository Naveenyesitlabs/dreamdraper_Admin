import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllUsersProject } from '../redux/admin/slices/projectManagemetSlice'
import MyPicker from './commanComponents/MyPicker'
import Pagination from './commanComponents/Pagination'
import SearchBox from './table/SearchBox'

const ProjectDaitles = ({ user, onBack }) => {
    const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
    const hasFetched = useRef(false);
    const dispatch = useDispatch()
    const { allProjectWithUser } = useSelector((state) => state.project);
    const [projectData, setProjectData] = useState([]);
    const [userDaitles, setUserDaitles] = useState([])
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [filteredData, setFilteredData] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    useEffect(() => {
        if (user.id) {
            if (hasFetched.current) return;
            hasFetched.current = true;
            setLoading(true)
            dispatch(getAllUsersProject({ id: user.id }))
        }
    }, [])

    useEffect(() => {
        if (allProjectWithUser) {
            setProjectData(Array.isArray(allProjectWithUser.projects) ? allProjectWithUser.projects : []);
            setUserDaitles(allProjectWithUser.user || {});
            setLoading(false);
        }
    }, [allProjectWithUser]);

    useEffect(() => {
        const list = Array.isArray(projectData) ? projectData : [];
        let filtered = [...list];
        if (searchText) {
            const term = searchText.toLowerCase();
            filtered = filtered.filter(item =>
                item?.projectName?.toLowerCase().includes(term)
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
    }, [projectData, searchText, dateRange]);

    const totalItems = filteredData?.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const handleRange = (startDate, endDate) => {
        console.log("startDate", startDate);
        console.log("endDate", endDate);
        setDateRange({ startDate, endDate });
    };

    return (
        <div className="content">
            <div className="main-content">
                <div className="header-button">
                    <div>
                        <h2 className="heading-content">Project Management</h2>
                        <p className="text-content">Manage your DreamDraper platform</p>
                    </div>
                    <button className="back-btn" onClick={() => onBack()}><img src="./images/btn-back.svg" className="arrow-back" /> Back</button>
                </div>
                <div className="nameBlock-user">
                    <img src={`${userDaitles?.profileImage ? userDaitles?.profileImage : './images/images/no-profile-picture.svg'}`} alt='image' />
                    <div className="details-user">
                        <div className="details-top">
                            <p>{userDaitles?.name}</p>
                            <button>Free</button>
                        </div>
                        {userDaitles?.phone && <p className="details-of-user">{userDaitles?.phone}</p>}
                        <p className="details-of-user">{userDaitles?.email}</p>
                    </div>
                </div>

                <div className="table-content">
                    <div className="content-header">
                        {/* <div className="search-align">
                            <img src="./images/search.svg" className="magnify" alt='search icon' />
                            <input type="text" placeholder="Search project.." className="search-content" onChange={(e) => setSearchText(e.target.value)} />
                        </div> */}
                        <SearchBox search={searchText} setSearch={setSearchText} placeholder="Search Project" />

                        <div className="content-right">
                            <div className="dropdown">
                                <p className="projectCounts">Project Count: {filteredData?.length}</p>
                            </div>
                            {/* <img className="datepicker" src="./images/datepicker.svg" /> */}
                            <MyPicker handleDateFilter={handleRange} />
                        </div>
                    </div>
                    <div className="user-data">
                        {loading ? (
                            <p>Loading...</p>
                        ) : currentItems.length > 0 ? (
                            Array.from(
                                { length: Math.ceil(currentItems.length / 3) },
                                (_, rowIndex) => {
                                    const start = rowIndex * 3;
                                    const rowProjects = currentItems.slice(start, start + 3);
                                    const placeholders = Array(3 - rowProjects.length).fill(null);
                                    return (
                                        <div
                                            className="user-container"
                                            key={rowIndex}
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            {rowProjects.map((project) => (
                                                <div className="nameBlock-body"
                                                    key={project.id}
                                                    style={{
                                                        width: "32%",
                                                        justifyContent: "space-between"
                                                    }}>
                                                    <div
                                                        className="nameBlock-items"
                                                        style={{ display: "flex", gap: "10px" }}
                                                    >
                                                        <img src="./images/projName.svg" alt="Project" />

                                                        <div className="details-user">
                                                            <p className="users-name">{project.projectName}</p>
                                                            <p className="user-detail">
                                                                ID: #{project.uuid}
                                                            </p>
                                                            <p className="user-detail">
                                                                Created: {new Date(project.createdAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <a href={project?.blueprint} download target="_blank">
                                                        <img
                                                            src="./images/dwnload-icon.svg"
                                                            className="new-download"
                                                            alt="Download"
                                                            style={{ width: "22px", cursor: "pointer" }}
                                                        />
                                                    </a>

                                                </div>
                                            ))}
                                            {placeholders.map((_, i) => (
                                                <div
                                                    key={`empty-${i}`}
                                                    style={{
                                                        width: "32%",
                                                        visibility: "hidden"
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    );
                                }
                            )
                        ) : (
                            <p
                                style={{
                                    textAlign: "center",
                                    marginTop: "20px",
                                    color: "#999",
                                    fontSize: "16px"
                                }}
                            >
                                No projects found.
                            </p>
                        )}
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

export default ProjectDaitles