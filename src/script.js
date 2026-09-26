// --- 1. STATE INITIALIZATION (Part 4: localStorage) ---
// Retrieve existing customers or initialize empty array
let customers = JSON.parse(localStorage.getItem("customers")) || [];

// --- 2. DOM REFERENCES ---
const statTotal = document.getElementById("stat-total");
const statNew = document.getElementById("stat-new");
const statContacted = document.getElementById("stat-contacted");
const statInterested = document.getElementById("stat-interested");
const statClosed = document.getElementById("stat-closed");

const customerForm = document.getElementById("customer-form");
const editIndexInput = document.getElementById("edit-index");
const formHeading = document.getElementById("form-heading");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const companyInput = document.getElementById("company");
const statusInput = document.getElementById("status");
const notesInput = document.getElementById("notes");

const tableBody = document.getElementById("customer-table-body");
const searchInput = document.getElementById("search-input");
const filterStatus = document.getElementById("filter-status");

// --- 3. STORAGE SYNC HELPER ---
function saveToStorage() {
  localStorage.setItem("customers", JSON.stringify(customers));
}

// --- 4. READ (Render table with Search & Filter) ---
function renderTable() {
  const query = searchInput.value.toLowerCase().trim();
  const selectedStatus = filterStatus.value;

  // Filter criteria: match name substring AND status category
  const filteredCustomers = customers.filter(customer => {
    const matchesName = customer.name.toLowerCase().includes(query);
    const matchesStatus = (selectedStatus === "All") || (customer.status === selectedStatus);
    return matchesName && matchesStatus;
  });

  tableBody.innerHTML = "";

  if (filteredCustomers.length === 0) {
    tableBody.innerHTML = <tr><td colspan="6" style="text-align: center; color: #64748b;">No matching records found</td></tr>;
    return;
  }

  filteredCustomers.forEach(customer => {
    // Find absolute index in master array
    const originalIndex = customers.indexOf(customer);

    const row = document.createElement("tr");
    row.innerHTML = `
      <td><strong>${customer.name}</strong></td>
      <td>${customer.email}</td>
      <td>${customer.phone}</td>
      <td>${customer.company || "-"}</td>
      <td>${customer.status}</td>
      <td>
        <button onclick="editCustomer(${originalIndex})" style="padding: 4px 8px; font-size: 12px; margin-right: 4px;">Edit</button>
        <button onclick="deleteCustomer(${originalIndex})" style="padding: 4px 8px; font-size: 12px; background-color: #ef4444;">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// --- 5. CREATE & UPDATE (Form Submit Event) ---
customerForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const customerData = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    phone: phoneInput.value.trim(),
    company: companyInput.value.trim(),
    status: statusInput.value,
    notes: notesInput.value.trim()
  };

  const currentIndex = parseInt(editIndexInput.value, 10);

  if (currentIndex === -1) {
    // CREATE
    customers.push(customerData);
  } else {
    // UPDATE
    customers[currentIndex] = customerData;
    resetForm();
  }

  saveToStorage();
  renderTable();
  customerForm.reset();
});

// --- 6. UPDATE PREPARATION (Edit Mode) ---
window.editCustomer = function (index) {
  const customer = customers[index];

  editIndexInput.value = index;
  nameInput.value = customer.name;
  emailInput.value = customer.email;
  phoneInput.value = customer.phone;
  companyInput.value = customer.company;
  statusInput.value = customer.status;
  notesInput.value = customer.notes;

  formHeading.textContent = "Edit Customer Details";
  submitBtn.textContent = "Update Customer";
  cancelBtn.style.display = "inline-block";
};

cancelBtn.addEventListener("click", resetForm);

function resetForm() {
  customerForm.reset();
  editIndexInput.value = "-1";
  formHeading.textContent = "Add Customer Details";
  submitBtn.textContent = "Add Customer";
  cancelBtn.style.display = "none";
}

// --- 7. DELETE ---
window.deleteCustomer = function (index) {
  if (confirm(Delete record for ${customers[index].name}?)) {
    customers.splice(index, 1);
    saveToStorage();
    renderTable();

    if (parseInt(editIndexInput.value, 10) === index) {
      resetForm();
    }
  }
};

// --- 8. SEARCH & FILTER EVENTS ---
searchInput.addEventListener("input", renderTable);
filterStatus.addEventListener("change", renderTable);

// Initial Load
renderTable();
