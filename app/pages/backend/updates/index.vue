<script setup lang="ts">
definePageMeta({
  layout: "admin",
});

const { data: updates, refresh } = await useFetch<Array<{ id: number; headline: string; subtext: string | null; slack_ts: string; is_staging: number; created_at: number }>>("/api/updates?all=true");
const showNewUpdate = ref(false);
const isSubmitting = ref(false);
const promoteInProgress = ref<number | null>(null);

const newUpdate = ref({
  headline: "",
  subtext: "",
  isStaging: false,
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
        isStaging: newUpdate.value.isStaging,
      },
    });

    if (response.success) {
      showNewUpdate.value = false;
      newUpdate.value = { headline: "", subtext: "", isStaging: false };
      await refresh();
    }
  } catch (error) {
    alert(error);
  } finally {
    isSubmitting.value = false;
  }
}

async function promoteUpdate(id: number) {
  if (!confirm("make it live?")) return;

  promoteInProgress.value = id;
  try {
    const response = await $fetch(`/backend/api/updates/${id}/promote`, {
      method: "POST",
    });

    if (response.success) {
      await refresh();
    }
  } catch (error) {
    alert(error);
  } finally {
    promoteInProgress.value = null;
  }
}

async function deleteUpdate(id: number) {
  if (!confirm("//undo?")) return;

  try {
    const response = await $fetch(`/backend/api/updates/${id}`, {
      method: "DELETE",
    });

    if (response.success) {
      await refresh();
    }
  } catch (error) {
    alert(error);
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
        <h1 class="text-3xl font-bold text-dark-50 mb-1">rapid update</h1>
        <p class="text-dark-400">we doin this telegram style</p>
      </div>
      <button @click="showNewUpdate = true" class="px-4 py-2 bg-accent-500 hover:bg-accent-600 text-dark-900 font-semibold rounded-lg transition-colors">new</button>
    </div>

    <div v-if="showNewUpdate" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
      <div class="bg-dark-800 rounded-xl border border-dark-700 max-w-xl w-full p-6 space-y-4">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-bold text-dark-50">push</h2>
          <button @click="showNewUpdate = false" class="text-dark-400 hover:text-dark-200 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-dark-200 text-sm font-semibold mb-2">headline</label>
            <input v-model="newUpdate.headline" type="text" placeholder="Big news headline..." maxlength="150" class="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 placeholder-dark-500 focus:outline-none focus:border-accent-500 transition-colors" />
            <p class="text-dark-500 text-xs mt-1">{{ newUpdate.headline.length }}/150</p>
          </div>

          <div>
            <label class="block text-dark-200 text-sm font-semibold mb-2">subtext <span class="text-dark-500 font-normal">(optional)</span></label>
            <textarea v-model="newUpdate.subtext" placeholder="More details..." rows="3" maxlength="500" class="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 placeholder-dark-500 focus:outline-none focus:border-accent-500 transition-colors resize-none" />
            <p class="text-dark-500 text-xs mt-1">{{ newUpdate.subtext.length }}/500</p>
          </div>

          <div class="flex items-center gap-3 p-3 bg-dark-700 rounded-lg border border-dark-600">
            <input v-model="newUpdate.isStaging" type="checkbox" id="stagingCheckbox" class="w-4 h-4 accent-accent-500 rounded cursor-pointer" />
            <label for="stagingCheckbox" class="text-dark-200 text-sm font-medium cursor-pointer">stage first</label>
          </div>
        </div>

        <div class="flex gap-3 justify-end pt-4 border-t border-dark-700">
          <button @click="showNewUpdate = false" class="px-4 py-2 text-dark-300 hover:text-dark-100 transition-colors">cancel</button>
          <button @click="handleCreateUpdate" :disabled="!newUpdate.headline.trim() || isSubmitting" class="px-4 py-2 bg-accent-500 hover:bg-accent-600 disabled:opacity-50 disabled:cursor-not-allowed text-dark-900 font-semibold rounded-lg transition-colors">
            {{ isSubmitting ? "Pushing..." : newUpdate.isStaging ? "Push to Staging" : "Push to Slack" }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="updates && updates.length" class="space-y-3">
      <div v-for="update in updates" :key="update.id" class="p-4 bg-dark-800 rounded-lg border border-dark-700 hover:border-dark-600 transition-colors">
        <div class="flex items-start justify-between">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <h3 class="text-lg font-semibold text-dark-50">{{ update.headline }}</h3>
              <span v-if="update.is_staging" class="px-2 py-1 text-xs font-semibold bg-yellow-500/20 text-yellow-300 rounded">STAGING</span>
              <span v-else class="px-2 py-1 text-xs font-semibold bg-green-500/20 text-green-300 rounded">MAIN</span>
            </div>
            <p v-if="update.subtext" class="text-dark-400 text-sm mt-1">{{ update.subtext }}</p>
            <p class="text-dark-500 text-xs mt-2">{{ formatTime(update.created_at) }}</p>
          </div>
          <div class="flex gap-2 ml-4 shrink-0">
            <button v-if="update.is_staging" @click="promoteUpdate(update.id)" :disabled="promoteInProgress === update.id" class="px-3 py-1.5 text-sm bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors">
              {{ promoteInProgress === update.id ? "Promoting..." : "Promote" }}
            </button>
            <button @click="deleteUpdate(update.id)" class="px-3 py-1.5 text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded transition-colors">delete</button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="p-8 text-center bg-dark-800 rounded-lg border border-dark-700">
      <p class="text-dark-400">nuthing here yet</p>
    </div>
  </div>
</template>
