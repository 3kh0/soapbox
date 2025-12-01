<script setup lang="ts">
definePageMeta({
  layout: "admin",
});

const { data: updates, refresh } = await useFetch<Array<{ id: number; headline: string; subtext: string | null; slack_ts: string; created_at: number }>>("/api/updates?all=true");
const showNewUpdate = ref(false);
const isSubmitting = ref(false);

const newUpdate = ref({
  headline: "",
  subtext: "",
});

async function handleCreateUpdate() {
  if (!newUpdate.value.headline.trim()) return;

  isSubmitting.value = true;
  try {
    const response = await $fetch("/backend/api/updates", {
      method: "POST",
      body: {
        headline: newUpdate.value.headline,
        subtext: newUpdate.value.subtext || undefined,
      },
    });

    if (response.success) {
      showNewUpdate.value = false;
      newUpdate.value = { headline: "", subtext: "" };
      await refresh();
    }
  } catch (error) {
    console.error("Error creating update:", error);
  } finally {
    isSubmitting.value = false;
  }
}

async function deleteUpdate(id: number) {
  if (!confirm("Delete this update? It will also be removed from Slack.")) return;

  try {
    const response = await $fetch(`/backend/api/updates/${id}`, {
      method: "DELETE",
    });

    if (response.success) {
      await refresh();
    }
  } catch (error) {
    console.error("Error deleting update:", error);
  }
}

function formatTime(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleString();
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-dark-50 mb-1">Rapid Updates</h1>
        <p class="text-dark-400">Push quick updates to Slack and the news feed.</p>
      </div>
      <button @click="showNewUpdate = true" class="px-4 py-2 bg-accent-500 hover:bg-accent-600 text-dark-900 font-semibold rounded-lg transition-colors">+ New Update</button>
    </div>

    <!-- New Update Modal -->
    <div v-if="showNewUpdate" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
      <div class="bg-dark-800 rounded-xl border border-dark-700 max-w-xl w-full p-6 space-y-4">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-bold text-dark-50">Push Update</h2>
          <button @click="showNewUpdate = false" class="text-dark-400 hover:text-dark-200 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-dark-200 text-sm font-semibold mb-2">Headline</label>
            <input v-model="newUpdate.headline" type="text" placeholder="Big news headline..." maxlength="150" class="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 placeholder-dark-500 focus:outline-none focus:border-accent-500 transition-colors" />
            <p class="text-dark-500 text-xs mt-1">{{ newUpdate.headline.length }}/150</p>
          </div>

          <div>
            <label class="block text-dark-200 text-sm font-semibold mb-2">Subtext <span class="text-dark-500 font-normal">(optional)</span></label>
            <textarea v-model="newUpdate.subtext" placeholder="More details..." rows="3" maxlength="500" class="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 placeholder-dark-500 focus:outline-none focus:border-accent-500 transition-colors resize-none" />
            <p class="text-dark-500 text-xs mt-1">{{ newUpdate.subtext.length }}/500</p>
          </div>
        </div>

        <div class="flex gap-3 justify-end pt-4 border-t border-dark-700">
          <button @click="showNewUpdate = false" class="px-4 py-2 text-dark-300 hover:text-dark-100 transition-colors">Cancel</button>
          <button @click="handleCreateUpdate" :disabled="!newUpdate.headline.trim() || isSubmitting" class="px-4 py-2 bg-accent-500 hover:bg-accent-600 disabled:opacity-50 disabled:cursor-not-allowed text-dark-900 font-semibold rounded-lg transition-colors">
            {{ isSubmitting ? "Pushing..." : "Push to Slack" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Updates List -->
    <div v-if="updates && updates.length" class="space-y-3">
      <div v-for="update in updates" :key="update.id" class="p-4 bg-dark-800 rounded-lg border border-dark-700 hover:border-dark-600 transition-colors">
        <div class="flex items-start justify-between">
          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-semibold text-dark-50">{{ update.headline }}</h3>
            <p v-if="update.subtext" class="text-dark-400 text-sm mt-1">{{ update.subtext }}</p>
            <p class="text-dark-500 text-xs mt-2">{{ formatTime(update.created_at) }}</p>
          </div>
          <button @click="deleteUpdate(update.id)" class="px-3 py-1.5 text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded transition-colors ml-4 shrink-0">Delete</button>
        </div>
      </div>
    </div>

    <div v-else class="p-8 text-center bg-dark-800 rounded-lg border border-dark-700">
      <p class="text-dark-400">No updates yet. Push your first update to get started.</p>
    </div>
  </div>
</template>
