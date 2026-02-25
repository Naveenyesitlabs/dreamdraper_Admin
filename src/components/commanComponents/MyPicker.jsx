// import { DateRangePicker } from 'react-date-range';
// import { useState } from 'react';
// import 'react-date-range/dist/styles.css';
// import 'react-date-range/dist/theme/default.css';

// export default function MyPicker() {
//     const initialRange = {
//         startDate: new Date(),
//         endDate: new Date(),
//         key: 'selection',
//     };

//     const [selectionRange, setSelectionRange] = useState(initialRange);

//     const handleSelect = (ranges) => {
//         const { startDate, endDate } = ranges.selection;
//         if (!startDate || !endDate) return;

//         setSelectionRange({
//             ...selectionRange,
//             startDate,
//             endDate,
//         });
//     };

//     const handleReset = () => {
//         setSelectionRange(initialRange); // reset to initial range
//     };

//     return (
//         <>
//             <div>
//                 <DateRangePicker
//                     ranges={[selectionRange]}
//                     onChange={handleSelect}
//                     staticRanges={[]} // hide Today/Yesterday/etc
//                     inputRanges={[]}  // hide "Last 7 days"
//                     showSelectionPreview={true}
//                     moveRangeOnFirstSelection={false}
//                     months={1}        // show one month
//                     direction="horizontal"
//                 />
//             </div>
//             <button
//                 onClick={handleReset}
//                 style={{
//                     marginTop: '10px',
//                     marginLeft: '5px',
//                     padding: '5px 10px',
//                     //   backgroundColor: '#1976d2',
//                     color: '#1976d2',
//                     border: 'none',
//                     borderRadius: '4px',
//                     cursor: 'pointer',
//                 }}
//             >
//                 clear
//             </button>
//         </>

//     );
// }

// import { DateRangePicker } from 'react-date-range';
// import { useState, useRef, useEffect } from 'react';
// import 'react-date-range/dist/styles.css';
// import 'react-date-range/dist/theme/default.css';

// export default function MyPicker() {
//     const [selectionRange, setSelectionRange] = useState({
//         startDate: new Date(),
//         endDate: new Date(),
//         key: 'selection',
//     });

//     const [showPicker, setShowPicker] = useState(false);
//     const wrapperRef = useRef(null);
//     const handleSelect = (ranges) => {
//         setSelectionRange(ranges.selection);
//         console.log("selectionRange1", ranges?.selection.startDate)
//         console.log("selectionRange2", ranges?.selection.endDate)
//     };
//     const handleReset = () => {
//         setSelectionRange({
//             startDate: new Date(),
//             endDate: new Date(),
//             key: 'selection',
//         });
//         setShowPicker(false)
//     };

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
//                 setShowPicker(false);
//             }
//         };
//         document.addEventListener('mousedown', handleClickOutside);
//         return () => document.removeEventListener('mousedown', handleClickOutside);
//     }, []);

//     return (
//         <div ref={wrapperRef} style={{ position: 'relative', display: 'inline-block' }}>
//             <style>
//                 {`
//                     .rdrDateRangePickerWrapper {
//                         padding: 0 !important;
//                         margin: 0 !important;
//                     }
//                     .rdrDefinedRangesWrapper {
//                         display: none !important;
//                         width: 0 !important;
//                         min-width: 0 !important;
//                     }
//                 `}
//             </style>

//             {/* <input
//                 type="text"
//                 readOnly
//                 value={`${selectionRange.startDate.toLocaleDateString()} - ${selectionRange.endDate.toLocaleDateString()}`}
//                 onClick={() => setShowPicker(!showPicker)}
//                 style={{
//                     padding: '5px 10px',
//                     width: '200px',
//                     borderRadius: '4px',
//                     border: '1px solid #ccc',
//                     cursor: 'pointer',
//                 }}
//             /> */}

//             <img className="datepicker" src="./images/datepicker.svg"
//                 onClick={() => setShowPicker(!showPicker)}
//             />
//             {showPicker && (
//                 <div
//                     style={{
//                         position: 'absolute',
//                         zIndex: 1000,
//                         top: '78%',
//                         left: '-260px',
//                         boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
//                         backgroundColor: 'white',
//                     }}
//                 >
//                     <DateRangePicker
//                         ranges={[selectionRange]}
//                         onChange={handleSelect}
//                         staticRanges={[]}
//                         inputRanges={[]}
//                         showSelectionPreview={true}
//                         moveRangeOnFirstSelection={false}
//                         months={1}
//                         direction="horizontal"
//                         styles={{
//                             calendarWrapper: { padding: 0 },
//                         }}
//                     />
//                     <div style={{ textAlign: 'right', margin: '8px' }}>
//                         <button
//                             onClick={handleReset}
//                             style={{
//                                 padding: "5px 10px",
//                                 color: '#1976d2',
//                                 border: '1px solid #1976d2',
//                                 borderRadius: '4px',
//                                 cursor: 'pointer',
//                                 backgroundColor: 'white',
//                             }}
//                         >
//                             Clear
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }



import { DateRangePicker } from 'react-date-range';
import { useState, useRef, useEffect } from 'react';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

export default function MyPicker({ handleDateFilter }) {
    const [selectionRange, setSelectionRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    });

    const [showPicker, setShowPicker] = useState(false);
    const wrapperRef = useRef(null);

    const handleSelect = (ranges) => {
        setSelectionRange(ranges.selection);
    };

    const handleReset = () => {
        setSelectionRange({
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
        });
        handleDateFilter('', '')
        setShowPicker(false);
    };

    const handleSubmit = () => {
        handleDateFilter(selectionRange.startDate, selectionRange.endDate)
        setShowPicker(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowPicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={wrapperRef} style={{ position: 'relative', display: 'inline-block' }}>
            <style>
                {`  
                    .rdrDateRangePickerWrapper {
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                    .rdrDefinedRangesWrapper {
                        display: none !important;
                        width: 0 !important;
                        min-width: 0 !important;
                    }
                `}
            </style>

            <img
                className="datepicker"
                src="./images/datepicker.svg"
                onClick={() => setShowPicker(!showPicker)}
                style={{ cursor: 'pointer' }}
            />

            {showPicker && ( 
                <div
                    style={{
                        position: 'absolute',
                        zIndex: 1000,
                        top: '78%',
                        // left: '-260px',
                        left: '-286px',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                        backgroundColor: 'white',
                        padding: '8px',
                    }}
                >
                    <DateRangePicker
                        ranges={[selectionRange]}
                        onChange={handleSelect}
                        staticRanges={[]}
                        inputRanges={[]}
                        showSelectionPreview={true}
                        moveRangeOnFirstSelection={false}
                        months={1}
                        direction="horizontal"
                        styles={{
                            calendarWrapper: { padding: 0 },
                        }}
                    />

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                        <button
                            onClick={handleReset}
                            style={{
                                padding: "5px 10px",
                                color: '#1976d2',
                                border: '1px solid #1976d2',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                backgroundColor: 'white',
                            }}
                        >
                            Clear
                        </button>

                        <button
                            onClick={handleSubmit}
                            style={{
                                padding: "5px 10px",
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                backgroundColor: '#1976d2',
                            }}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
