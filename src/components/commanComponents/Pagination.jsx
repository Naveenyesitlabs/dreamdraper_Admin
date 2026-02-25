// import React from "react";

// const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
//     const totalPages = Math.ceil(totalItems / itemsPerPage);
//     if (totalPages === 0) return null;

//     const getPageNumbers = () => {
//         const pages = [];
//         const maxVisible = 5; // number of visible page buttons
//         let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
//         let end = Math.min(totalPages, start + maxVisible - 1);

//         if (end - start + 1 < maxVisible) {
//             start = Math.max(1, end - maxVisible + 1);
//         }

//         for (let i = start; i <= end; i++) {
//             pages.push(i);
//         }

//         return pages;
//     };

//     const pages = getPageNumbers();

//     const buttonStyle = (isActive, isDisabled = false) => ({
//         padding: "5px 10px",
//         margin: "0 3px",
//         border: "1px solid #ddd",
//         backgroundColor: isActive ? "#007bff" : "white",
//         color: isActive ? "white" : "#333",
//         cursor: isDisabled ? "not-allowed" : "pointer",
//         opacity: isDisabled ? 0.5 : 1,
//         borderRadius: "4px",
//     });

//     const containerStyle = {
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         marginTop: "10px",
//     };

//     const dotsStyle = { margin: "0 5px" };

//     return (
//         <div style={containerStyle}>
//             <button
//                 style={buttonStyle(false, currentPage === 1)}
//                 onClick={() => onPageChange(1)}
//                 disabled={currentPage === 1}
//             >
//                 &laquo;
//             </button>

//             <button
//                 style={buttonStyle(false, currentPage === 1)}
//                 onClick={() => onPageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//             >
//                 &lt;
//             </button>

//             {pages[0] > 1 && (
//                 <>
//                     <button style={buttonStyle(false)} onClick={() => onPageChange(1)}>
//                         1
//                     </button>
//                     {pages[0] > 2 && <span style={dotsStyle}>...</span>}
//                 </>
//             )}

//             {pages.map((num) => (
//                 <button
//                     key={num}
//                     style={buttonStyle(num === currentPage)}
//                     onClick={() => onPageChange(num)}
//                 >
//                     {num}
//                 </button>
//             ))}

//             {pages[pages.length - 1] < totalPages && (
//                 <>
//                     {pages[pages.length - 1] < totalPages - 1 && (
//                         <span style={dotsStyle}>...</span>
//                     )}
//                     <button
//                         style={buttonStyle(false)}
//                         onClick={() => onPageChange(totalPages)}
//                     >
//                         {totalPages}
//                     </button>
//                 </>
//             )}

//             <button
//                 style={buttonStyle(false, currentPage === totalPages)}
//                 onClick={() => onPageChange(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//             >
//                 &gt;
//             </button>

//             <button
//                 style={buttonStyle(false, currentPage === totalPages)}
//                 onClick={() => onPageChange(totalPages)}
//                 disabled={currentPage === totalPages}
//             >
//                 &raquo;
//             </button>
//         </div>
//     );
// };

// export default Pagination;


import React from "react";

const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages === 0) return null;

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);

        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    };

    const pages = getPageNumbers();

    return (
        <div className="pagination">
            <button
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
            >
                &laquo;
            </button>

            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                &lt;
            </button>

            {pages[0] > 1 && (
                <>
                    <button onClick={() => onPageChange(1)}>1</button>
                    {pages[0] > 2 && <button disabled>...</button>}
                </>
            )}

            {pages.map((num) => (
                <button
                    key={num}
                    className={num === currentPage ? "active" : ""}
                    onClick={() => onPageChange(num)}
                >
                    {num}
                </button>
            ))}

            {pages[pages.length - 1] < totalPages && (
                <>
                    {pages[pages.length - 1] < totalPages - 1 && (
                        <button disabled>...</button>
                    )}
                    <button onClick={() => onPageChange(totalPages)}>
                        {totalPages}
                    </button>
                </>
            )}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                &gt;
            </button>

            <button
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
            >
                &raquo;
            </button>
        </div>
    );
};

export default Pagination;
