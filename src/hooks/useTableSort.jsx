import { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";

/**
 * Reusable table sorting hook with icons
 * - Default icon: ⇅
 * - ASC: ↑
 * - DESC: ↓
 * - No table JSX changes required
 */
export default function useTableSort({ excludeColumns = [] } = {}) {
  const tableRef = useRef(null);
  const sortState = useRef({}); // { columnIndex: "asc" | "desc" }

  useEffect(() => {
    const table = tableRef.current;
    if (!table) return;

    const thead = table.querySelector("thead");
    const tbody = table.querySelector("tbody");
    if (!thead || !tbody) return;

    const ths = Array.from(thead.querySelectorAll("th"));

    /* ------------------------------------------------
       1. Inject default ⇅ icon into sortable headers
    ------------------------------------------------ */
    ths.forEach((th, index) => {
      if (excludeColumns.includes(index)) return;
      if (th.querySelector(".sort-icon")) return;

      const iconWrapper = document.createElement("span");
      iconWrapper.className = "sort-icon";
      iconWrapper.style.marginLeft = "6px";
      iconWrapper.style.display = "inline-flex";
      iconWrapper.style.verticalAlign = "middle";

      th.appendChild(iconWrapper);

      createRoot(iconWrapper).render(<FaSort size={12} />);
    });

    /* ------------------------------------------------
       2. Click handler (sorting + icon update)
    ------------------------------------------------ */
    const handler = (e) => {
      const th = e.target.closest("th");
      if (!th) return;

      const columnIndex = ths.indexOf(th);
      if (excludeColumns.includes(columnIndex)) return;

      const rows = Array.from(tbody.querySelectorAll("tr"));
      if (!rows.length) return;

      // Toggle direction for this column only
      const current = sortState.current[columnIndex];
      const direction = current === "asc" ? "desc" : "asc";
      sortState.current = { [columnIndex]: direction };

      /* ---------------- Sorting logic ---------------- */
      rows.sort((a, b) => {
        const aText = a.children[columnIndex]?.innerText.trim() || "";
        const bText = b.children[columnIndex]?.innerText.trim() || "";

        const aNum = parseFloat(aText.replace(/,/g, ""));
        const bNum = parseFloat(bText.replace(/,/g, ""));

        if (!isNaN(aNum) && !isNaN(bNum)) {
          return direction === "asc" ? aNum - bNum : bNum - aNum;
        }

        return direction === "asc"
          ? aText.localeCompare(bText)
          : bText.localeCompare(aText);
      });

      rows.forEach((row) => tbody.appendChild(row));

      /* ---------------- Icon updates ---------------- */
      ths.forEach((header, i) => {
        const iconBox = header.querySelector(".sort-icon");
        if (!iconBox) return;

        const root = createRoot(iconBox);

        if (i === columnIndex) {
          root.render(
            direction === "asc" ? (
              <FaSortUp size={12} />
            ) : (
              <FaSortDown size={12} />
            )
          );
        } else {
          root.render(<FaSort size={12} />);
        }
      });
    };

    thead.addEventListener("click", handler);
    return () => thead.removeEventListener("click", handler);
  }, [excludeColumns]);

  return tableRef;
}
