import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('dreamDrapperAminToken');
        if (!token) {
            navigate('/')
        }
    }, [])

    return (
        <>
            <div className="content">
                <div className="main-content">
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100vh",
                            backgroundColor: "#f9f9f9",
                            color: "#333",
                            fontFamily: "Arial, sans-serif",
                        }}
                    >
                        <h1 style={{ fontSize: "10rem", margin: 0 }}>404</h1>
                        <h2 style={{ fontSize: "2rem", margin: "10px 0" }}>Oops! Page Not Found</h2>
                        <p style={{ fontSize: "1.2rem", marginBottom: "30px", textAlign: "center", maxWidth: "400px" }}>
                            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                        </p>
                        <button
                            onClick={() => navigate(-1)}
                            style={{
                                padding: "12px 25px",
                                fontSize: "1rem",
                                backgroundColor: "#007bff",
                                color: "#fff",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                transition: "background-color 0.3s",
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
                            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
                        >
                            Go to Previous
                        </button>
                    </div>
                </div >

            </div>
        </>
    );
};

export default NotFound;
