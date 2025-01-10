import { ref, computed, onMounted } from "vue";
import Swal from "sweetalert2";
import axios from "axios";

const users = ref([]);
const searchTerm = ref("");
const selectedGroup = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(20);
const loading = ref(true);

// Groups for filtering
const groups = [
  { label: "Admin", value: "Admin" },
  { label: "Admin 2", value: "Admin 2" },
  { label: "Editor", value: "Editor" },
];

// Fetch users on mount
onMounted(async () => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get("https://localhost:7017/api/UserManagement/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    users.value = response.data.data.$values.map((user) => ({
      id: user.id,
      name: user.fullName,
      email: user.email,
      group: user.role,
      status: user.state ? "Active" : "Inactive",
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
  } finally {
    loading.value = false;
  }
});

// Computed Properties
const filteredUsers = computed(() => {
  let result = [...users.value];

  // Filter by group
  if (selectedGroup.value) {
    result = result.filter((user) => user.group === selectedGroup.value);
  }

  // Search functionality
  if (searchTerm.value) {
    const keyword = searchTerm.value.toLowerCase();
    result = result.filter(
      (user) =>
        user.name.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword) ||
        user.group.toLowerCase().includes(keyword)
    );
  }

  return result;
});

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage.value));
const paginatedAccounts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredUsers.value.slice(start, start + itemsPerPage.value);
});
const currentPageIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);

// Methods
const changePage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const onSearch = () => (currentPage.value = 1);
const onFilterGroup = () => (currentPage.value = 1);

const deleteUser = (userId) => {
  users.value = users.value.filter((user) => user.id !== userId);
  Swal.fire("Deleted!", "The user has been deleted.", "success");
};

const swalConfirm = (id) => {
  Swal.fire({
    title: "Bạn có chắc chắn?",
    text: "Hành động này không thể hoàn tác.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
    customClass: {
      confirmButton: "btn btn-danger m-1",
      cancelButton: "btn btn-secondary m-1",
    },
    buttonsStyling: false,
  }).then((result) => {
    if (result.isConfirmed) {
      deleteUser(id);
    }
  });
};