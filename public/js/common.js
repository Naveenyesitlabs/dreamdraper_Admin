

const hamburger = document.getElementById("hamburger");
const sidebar = document.getElementById("sidebar");

hamburger.addEventListener("click", () => {
  sidebar.classList.toggle("hidden");
});

// status dropdown

function toggleDropdown() {
  const menu = document.getElementById("dropdownMenu");
  const btn = document.querySelector(".status-btn");
  if (menu.style.display === "block") {
    menu.style.display = "none";
    btn.classList.remove("open");
  } else {
    menu.style.display = "block";
    btn.classList.add("open");
  }
}


function selectOption(option) {
  document.getElementById("label").textContent = option;
  document.getElementById("dropdownMenu").style.display = "none";
  document.querySelector(".status-btn").classList.remove("open");
}


//------------------------------------------------------------------------------user management - delete user popup 

function opendeleteUser() {
  document.getElementById('deleteModal').style.display = 'flex'
}

function closedeleteUser() {
  document.getElementById('deleteModal').style.display = 'none'
}


// activate user popup

function openActivateUser() {
  document.getElementById('activate').style.display = 'flex'
}

function closeActivateUser() {
  document.getElementById('activate').style.display = 'none'
}

// suspend user popup 

function openSuspendUser() {
  document.getElementById('suspend').style.display = 'flex'
}

function closeSuspendUser() {
  document.getElementById('suspend').style.display = 'none';
}

// ---------------------------------------------------------------------------- library management - delete design popup

function opendeletedesign() {
  document.getElementById('deleteDesign').style.display = 'flex';
}

function closedeletedesign() {
  document.getElementById('deleteDesign').style.display = 'none';
}

//----------------------------------------------------------------------------- sidebar submenu active 


document.addEventListener("DOMContentLoaded", function () {
  // Find the category collapse
  const categoryCollapse = document.getElementById("categorySubOptions");

  // Check if any submenu inside has "active"
  if (categoryCollapse.querySelector(".sub-active")) {
    // Keep the collapse open
    categoryCollapse.classList.add("show");

    // Also highlight the parent "Category Manager"
    const parentToggle = document.querySelector('[href="#categorySubOptions"]');
    if (parentToggle) {
      parentToggle.classList.add("active-parent");
    }
  }
});

// ------------------------------------------------------------------------------ password showhide


// Manual/Automatic Toggle Functionality
const manualBtn = document.getElementById('manual-option');
const automaticBtn = document.getElementById('automatic-option');

const manualTable = document.querySelector('.manual-table');
const automaticTable = document.querySelector('.automatic-table');

manualBtn.addEventListener('click', () => {
  manualBtn.classList.add('active');
  automaticBtn.classList.remove('active');
  manualTable.style.display = 'block';
  automaticTable.style.display = 'none';
});

automaticBtn.addEventListener('click', () => {
  automaticBtn.classList.add('active');
  manualBtn.classList.remove('active');
  manualTable.style.display = 'none';
  automaticTable.style.display = 'block';
});