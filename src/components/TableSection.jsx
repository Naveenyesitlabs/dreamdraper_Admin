
export default function TableSection() {
  return (
    <div className="table-content">
      <div className="content-header">
        <div className="search-align">
          <img src="/images/search.svg" className="magnify" />
          <input
            type="text"
            placeholder="Search User Name"
            className="search-content"
          />
          <span className="clear-btn">&times;</span>
        </div>
        <div className="content-right">
          <img className="datepicker" src="/images/datepicker.svg" />
          <button
            type="button"
            className="template-upload"
            style={{ width: "auto", justifyContent: "center", gap: "6px" }}
            data-bs-toggle="modal"
            data-bs-target="#addCategoryModal"
          >
            <img src="/images/white-plus.svg" className="template" /> Add
            Category
          </button>
        </div>
      </div>

      {/* table */}
      <div className="table-container">
        <div className="scroll-table">
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: "40px" }}>S.No.</th>
                <th className="profile-pic">Name</th>
                <th className="table-expand">Description</th>
                <th className="table-expand">Created</th>
                <th className="table-expand">Status</th>
                <th className="table-expand">Action</th>
              </tr>
            </thead>
            <tbody>
              {/* Your static rows (same as original HTML) */}
              <tr>
                <td>01</td>
                <td className="tempName">Video</td>
                <td>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </td>
                <td>12/02/2025</td>
                <td>
                  <button
                    className="status-btn-library"
                    data-bs-toggle="modal"
                    data-bs-target="#activateTemplateModal"
                  >
                    Active
                  </button>
                </td>
                <td>
                  <img
                    src="/images/editsolid.svg"
                    className="icon-table"
                    data-bs-toggle="modal"
                    data-bs-target="#editCategoryModal"
                  />
                  <img
                    src="/images/del-solid.svg"
                    className="icon-table"
                    data-bs-toggle="modal"
                    data-bs-target="#deleteDesign"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button>&laquo;</button>
          <button>&lt;</button>
          <button className="active">1</button>
          <button>2</button>
          <button>3</button>
          <button>...</button>
          <button>10</button>
          <button>&gt;</button>
          <button>&raquo;</button>
        </div>
      </div>
    </div>
  );
}
