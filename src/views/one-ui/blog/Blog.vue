<template>
  <BasePageHeading title="Blog" subtitle="Welcome Admin!">
    <template #extra>
      <button type="button" class="btn btn-alt-primary bg-success" v-click-ripple @click="$router.push('/administrator/blog/create')">
        <i class="fa fa-plus opacity-50 me-1"></i>
        Add
      </button>
    </template>
  </BasePageHeading>
  <!-- Contextual Table with Striped and Bordered Styling -->
  <BaseBlock title="Blog Overview">
    <table class="table table-bordered table-striped table-hover table-vcenter">
      <thead class="bg-primary text-light">
        <tr>
          <th class="text-center" style="width: 50px">#</th>
          <th>Author</th>
          <th>Category</th>
          <th class="text-center">Title</th>
          <th class="text-center">Date</th>
          <th class="text-center" style="width: 100px">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <th class="text-center" scope="row">{{ user.id }}</th>
          <td class="fw-semibold fs-sm">{{ user.author }}</td>
          <td class="fw-normal fs-sm">{{ user.category }}</td>
          <td class="text-center">{{ truncateText(user.title, 40) }}</td>
          <td class="text-center fw-light">{{ user.date }}</td>
          <td class="text-center">
            <div class="btn-group">
              <button type="button" class="btn btn-sm btn-warning" title="Edit" v-click-ripple @click="$router.push('/administrator/blog/edit')">
                <i class="fa fa-fw fa-pencil-alt"></i>
              </button>
              <button type="button" class="btn btn-sm btn-danger" title="Delete" @click="swalConfirm(user.id)">
                <i class="fa fa-fw fa-times"></i>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </BaseBlock>
  <!-- END Contextual Table -->
</template>

<script>
import Swal from "sweetalert2";

export default {
  setup() {
    const users = [
      {
        id: 1,
        author: "Alice Johnson",
        category: "Technology",
        title: "Mastering Vue 3 for Frontend Development",
        date: "2024-12-05",
      },
      {
        id: 2,
        author: "Bob Smith",
        category: "Design",
        title: "Advanced UI Design Patterns",
        date: "2024-12-04",
      },
      {
        id: 3,
        author: "Charlie Brown",
        category: "Development",
        title: "How to Build Scalable Applications",
        date: "2024-12-03",
      },
    ];

    const truncateText = (text, maxLength) => (text.length > maxLength ? `${text.substring(0, maxLength)}...` : text);

    const swalConfirm = (id) => {
      Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
        customClass: {
          confirmButton: "btn btn-danger m-1",
          cancelButton: "btn btn-secondary m-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire("Deleted!", `Blog with ID: ${id} has been deleted.`, "success");
          // Add deletion logic here
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire("Cancelled", "The blog remains safe.", "info");
        }
      });
    };

    return { users, truncateText, swalConfirm };
  },
};
</script>

<style lang="css" scoped>
@import "sweetalert2/dist/sweetalert2.min.css";
/* Table borders */
.table-bordered {
  border: 1px solid #dee2e6;
}

/* General table styling */
.table {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

thead {
  font-weight: bold;
  font-size: 0.9rem;
}

th,
td {
  vertical-align: middle;
}
.table {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

thead {
  font-weight: bold;
  font-size: 0.9rem;
}

th,
td {
  vertical-align: middle;
  padding: 12px;
}

.table-hover tbody tr:hover {
  background-color: #f1f3f5;
}

/* Custom button styles */
.btn {
  font-size: 0.85rem;
  padding: 0.4rem 0.6rem;
}
</style>
