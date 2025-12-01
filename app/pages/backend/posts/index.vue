<script setup lang="ts">
import { formatDateForInput, formatDateTimeForInput, parseDate, parseDateTime } from "../../../utils/dates";

definePageMeta({
  layout: "admin",
});

const { data: posts, refresh } = await useFetch("/api/posts");
const showNewPost = ref(false);
const selectedPost = ref<any>(null);
const loadingPost = ref(false);

const newPost = ref({
  slug: "",
  title: "",
  description: "",
  content: "",
  created_at: Math.floor(Date.now() / 1000),
  overrideCreatedAt: false,
});

const editState = ref({
  overrideUpdatedAt: false,
});

async function handleCreatePost() {
  try {
    const response = await $fetch("/backend/api/posts", {
      method: "POST",
      body: {
        slug: newPost.value.slug,
        title: newPost.value.title,
        description: newPost.value.description,
        content: newPost.value.content,
        ...(newPost.value.overrideCreatedAt && { created_at: newPost.value.created_at }),
      },
    });

    if (response.success) {
      showNewPost.value = false;
      newPost.value = {
        slug: "",
        title: "",
        description: "",
        content: "",
        created_at: Math.floor(Date.now() / 1000),
        overrideCreatedAt: false,
      };
      await refresh();
    }
  } catch (error) {
    console.error("Error creating post:", error);
  }
}

async function selectPost(post: any) {
  loadingPost.value = true;
  editState.value.overrideUpdatedAt = false;
  try {
    // Fetch full post content from the API
    const fullPost = await $fetch(`/api/post/${post.slug}`);
    selectedPost.value = {
      slug: post.slug,
      title: fullPost.title,
      description: fullPost.description,
      content: fullPost.content,
      created_at: fullPost.created_at,
      updated_at: fullPost.updated_at,
    };
  } catch (error) {
    console.error("Error loading post:", error);
  } finally {
    loadingPost.value = false;
  }
}

function closeEditor() {
  selectedPost.value = null;
}

async function savePost() {
  if (!selectedPost.value) return;

  try {
    const body: any = {
      title: selectedPost.value.title,
      description: selectedPost.value.description,
      content: selectedPost.value.content,
      created_at: selectedPost.value.created_at,
    };

    // Only include updated_at if user explicitly chose to override it
    if (editState.value.overrideUpdatedAt) {
      body.updated_at = selectedPost.value.updated_at;
    }

    const response = await $fetch(`/backend/api/posts/${selectedPost.value.slug}`, {
      method: "PUT",
      body,
    });

    if (response.success) {
      closeEditor();
      await refresh();
    }
  } catch (error) {
    console.error("Error saving post:", error);
  }
}

async function deletePost(slug: string) {
  if (!confirm("Are you sure you want to delete this post?")) return;

  try {
    const response = await $fetch(`/backend/api/posts/${slug}`, {
      method: "DELETE",
    });

    if (response.success) {
      await refresh();
    }
  } catch (error) {
    console.error("Error deleting post:", error);
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-dark-50 mb-1">articles</h1>
        <p class="text-dark-400">holy yapper</p>
      </div>
      <button @click="showNewPost = true" class="px-4 py-2 bg-accent-500 hover:bg-accent-600 text-dark-900 font-semibold rounded-lg transition-colors">+ New Post</button>
    </div>

    <!-- New Post Modal -->
    <div v-if="showNewPost" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
      <div class="bg-dark-800 rounded-xl border border-dark-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-bold text-dark-50">Create New Post</h2>
          <button @click="showNewPost = false" class="text-dark-400 hover:text-dark-200 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-dark-200 text-sm font-semibold mb-2">Slug</label>
            <input v-model="newPost.slug" type="text" placeholder="post-slug" class="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 placeholder-dark-500 focus:outline-none focus:border-accent-500 transition-colors" />
          </div>

          <div>
            <label class="block text-dark-200 text-sm font-semibold mb-2">Title</label>
            <input v-model="newPost.title" type="text" placeholder="Post Title" class="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 placeholder-dark-500 focus:outline-none focus:border-accent-500 transition-colors" />
          </div>

          <div>
            <label class="block text-dark-200 text-sm font-semibold mb-2">Description</label>
            <textarea v-model="newPost.description" placeholder="Brief description..." rows="3" class="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 placeholder-dark-500 focus:outline-none focus:border-accent-500 transition-colors resize-none" />
          </div>

          <div>
            <label class="block text-dark-200 text-sm font-semibold mb-2">Content (Markdown)</label>
            <textarea v-model="newPost.content" placeholder="# Your post content here..." rows="10" class="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 placeholder-dark-500 focus:outline-none focus:border-accent-500 transition-colors resize-none font-mono text-sm" />
          </div>

          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="block text-dark-200 text-sm font-semibold">Published Date & Time</label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="newPost.overrideCreatedAt" type="checkbox" class="w-4 h-4 bg-dark-700 border border-dark-600 rounded focus:outline-none focus:border-accent-500" />
                <span class="text-dark-400 text-xs">Override default time</span>
              </label>
            </div>
            <input :value="formatDateTimeForInput(newPost.created_at)" @input="(e: any) => (newPost.created_at = parseDateTime(e.target.value))" type="datetime-local" class="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 focus:outline-none focus:border-accent-500 transition-colors" />
          </div>
        </div>

        <div class="flex gap-3 justify-end pt-4 border-t border-dark-700">
          <button @click="showNewPost = false" class="px-4 py-2 text-dark-300 hover:text-dark-100 transition-colors">Cancel</button>
          <button @click="handleCreatePost" class="px-4 py-2 bg-accent-500 hover:bg-accent-600 text-dark-900 font-semibold rounded-lg transition-colors">Create Post</button>
        </div>
      </div>
    </div>

    <!-- Posts List -->
    <div v-if="posts && posts.length" class="space-y-3">
      <div v-for="post in posts" :key="post.slug" class="p-4 bg-dark-800 rounded-lg border border-dark-700 hover:border-dark-600 transition-colors flex items-start justify-between">
        <div class="flex-1 min-w-0">
          <h3 class="text-lg font-semibold text-dark-50 truncate">{{ post.title }}</h3>
          <p class="text-dark-400 text-sm mt-1 line-clamp-2">{{ post.description }}</p>
          <p class="text-dark-500 text-xs mt-2">
            slug: <code class="text-accent-400">{{ post.slug }}</code>
          </p>
        </div>
        <div class="flex gap-2 ml-4 shrink-0">
          <button @click="selectPost(post)" class="px-3 py-1.5 text-sm bg-accent-500/20 text-accent-400 hover:bg-accent-500/30 rounded transition-colors">Edit</button>
          <button @click="deletePost(post.slug)" class="px-3 py-1.5 text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded transition-colors">Delete</button>
        </div>
      </div>
    </div>

    <div v-else class="p-8 text-center bg-dark-800 rounded-lg border border-dark-700">
      <p class="text-dark-400">No posts yet. Create your first post to get started.</p>
    </div>

    <!-- Edit Post Modal -->
    <div v-if="selectedPost" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
      <div class="bg-dark-800 rounded-xl border border-dark-700 max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-bold text-dark-50">Edit Post</h2>
          <button @click="closeEditor" class="text-dark-400 hover:text-dark-200 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-dark-200 text-sm font-semibold mb-2">Title</label>
            <input v-model="selectedPost.title" type="text" class="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 focus:outline-none focus:border-accent-500 transition-colors" />
          </div>

          <div>
            <label class="block text-dark-200 text-sm font-semibold mb-2">Description</label>
            <textarea v-model="selectedPost.description" rows="3" class="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 focus:outline-none focus:border-accent-500 transition-colors resize-none" />
          </div>

          <div>
            <label class="block text-dark-200 text-sm font-semibold mb-2">Content (Markdown)</label>
            <textarea v-model="selectedPost.content" rows="12" class="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 focus:outline-none focus:border-accent-500 transition-colors resize-none font-mono text-sm" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-dark-200 text-sm font-semibold mb-2">Published Date & Time</label>
              <input :value="formatDateTimeForInput(selectedPost.created_at)" @input="(e: any) => (selectedPost.created_at = parseDateTime(e.target.value))" type="datetime-local" class="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 focus:outline-none focus:border-accent-500 transition-colors" />
            </div>
            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="block text-dark-200 text-sm font-semibold">Last Updated</label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input v-model="editState.overrideUpdatedAt" type="checkbox" class="w-4 h-4 bg-dark-700 border border-dark-600 rounded focus:outline-none focus:border-accent-500" />
                  <span class="text-dark-400 text-xs">Override time</span>
                </label>
              </div>
              <input :value="formatDateTimeForInput(selectedPost.updated_at || Math.floor(Date.now() / 1000))" @input="(e: any) => (selectedPost.updated_at = parseDateTime(e.target.value))" type="datetime-local" :disabled="!editState.overrideUpdatedAt" class="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 focus:outline-none focus:border-accent-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" />
            </div>
          </div>
        </div>

        <div class="flex gap-3 justify-end pt-4 border-t border-dark-700">
          <button @click="closeEditor" class="px-4 py-2 text-dark-300 hover:text-dark-100 transition-colors">Cancel</button>
          <button @click="savePost" class="px-4 py-2 bg-accent-500 hover:bg-accent-600 text-dark-900 font-semibold rounded-lg transition-colors">Save Changes</button>
        </div>
      </div>
    </div>
  </div>
</template>
