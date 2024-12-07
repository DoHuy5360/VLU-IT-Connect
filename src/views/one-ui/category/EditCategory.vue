<template>
  <BasePageHeading title="Category" subtitle="Welcome Admin!">
    <template #extra>
      <button type="button" class="btn btn-alt-primary" @click="$router.push('/administrator/category')">
        <i class="fa fa-arrow-left opacity-50 me-1"></i>
        Back
      </button>
    </template>
  </BasePageHeading>

  <BaseBlock title="Edit Category">
    <div class="col-lg-8 space-y-5">
      <!-- Form Labels on top - Default Style -->
      <form @sumbit.prevent>
        <div class="mb-4">
          <label class="form-label" for="example-ltf-email">Category</label>
          <input type="email" class="form-control" id="example-ltf-email" name="example-ltf-email" placeholder="Edit The Category Name..." />
        </div>

        <div class="mb-4">
          <button type="submit" class="btn btn-alt-primary bg-success">Done</button>
        </div>
      </form>
    </div>
  </BaseBlock>
</template>

<script>
export default {
  methods: {
    handleSubmit() {
      // handle form submission
      console.log("Form submitted");
    },
  },
};
</script>
