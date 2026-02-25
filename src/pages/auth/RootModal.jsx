import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginModal from './LoginModal'

const RootModal = () => {
    const navigate = useNavigate()
    useEffect(() => {
        const token = localStorage.getItem('dreamDrapperAminToken')
        if (token) {
            navigate("/user-management");
        }
    }, []);

    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f5f6fa",
            }}
        >
            <button
                className="btn-dream-login"
                data-bs-toggle="modal"
                data-bs-target="#dreamLoginModal"
                style={{
                    padding: "20px 40px",
                    backgroundColor: "#094271",
                    color: "#fff",
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontFamily: "Segoe UI",
                    fontSize: "18px",
                }}
            >
                Login Dream Draper
            </button>
            <LoginModal />
        </div>

    )
}

export default RootModal
