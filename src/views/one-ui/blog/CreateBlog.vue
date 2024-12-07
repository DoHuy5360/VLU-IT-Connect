<template>
  <BasePageHeading title="Blog" subtitle="Welcome Admin!">
    <template #extra>
      <button type="button" class="btn btn-alt-primary" v-click-ripple @click="$router.push('/administrator/blog')">
        <i class="fa fa-arrow-left opacity-50 me-1"></i>
        Back
      </button>
    </template>
  </BasePageHeading>

  <BaseBlock title="Create New Blog">
    <div class="col-lg-8 space-y-5">
      <!-- Form Labels on top - Default Style -->
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label class="form-label" for="example-ltf-email">Author</label>
          <input type="author" class="form-control" id="example-ltf-author" name="example-ltf-email" placeholder="Your Name.." required />
        </div>
        <div class="mb-4">
          <label class="form-label" for="example-ltf-email">Title</label>
          <input type="author" class="form-control" id="example-ltf-author" name="example-ltf-email" placeholder="Your article title.." required />
        </div>
        <div class="mb-4">
          <label class="form-label" for="example-select">Select Category</label>
          <select class="form-select" id="example-select" name="example-select">
            <option selected>Open this select category</option>
            <option value="1">Option #1</option>
            <option value="2">Option #2</option>
            <option value="3">Option #3</option>
            <option value="4">Option #4</option>
            <option value="5">Option #5</option>
            <option value="6">Option #6</option>
            <option value="7">Option #7</option>
            <option value="8">Option #8</option>
            <option value="9">Option #9</option>
            <option value="10">Option #10</option>
          </select>
        </div>

        <!-- CKEditor 5 -->
        <BaseBlock title="Detail" content-full>
          <ckeditor :editor="ClassicEditor" :config="editorConfig" v-model="editorData" />
        </BaseBlock>

        <div class="mb-4">
          <button type="submit" class="btn btn-alt-primary bg-success">Done</button>
        </div>
      </form>
    </div>
  </BaseBlock>
</template>

<script setup>
import { ref } from "vue";

// CKEditor 5, for more info and examples you can check out https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/vuejs-v3.html
import CKEditor from "@ckeditor/ckeditor5-vue";

// You can import one of the following CKEditor variation (only one at a time)
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
//import InlineEditor from '@ckeditor/ckeditor5-build-inline'
//import BalloonEditor from '@ckeditor/ckeditor5-build-balloon'
//import BalloonBlockEditor from '@ckeditor/ckeditor5-build-balloon-block'

// Tiptap editor, for more info and examples you can check out https://github.com/ueberdosis/tiptap
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";

// CKEditor 5 variables
let ckeditor = CKEditor.component;

const editorData = ref("<p>Detail</p>");
const editorConfig = ref({});

// Init Tiptap editor
const tiptap = useEditor({
  extensions: [StarterKit],
  content: `
<h2>
  Hi there,
</h2>
<p>
  this is a <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
</p>
<ul>
  <li>
    That’s a bullet list with one …
  </li>
  <li>
    … or two list items.
  </li>
</ul>
<p>
  Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
</p>
<pre><code class="language-css">body {
  display: none;
}</code></pre>
<p>
  I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
</p>
<blockquote>
  Wow, that’s amazing. Good work, boy! 👏
  <br />
  — Mom
</blockquote>
`,
});
</script>

<style lang="scss">
// Tiptap overrides
.ProseMirror-focused {
  outline: none;
}
</style>
