<script setup lang="ts">
import type { ToolItem } from '~/utils/toolCatalog'

defineProps<{
  item: ToolItem
}>()
</script>

<template>
  <article class="group relative overflow-hidden rounded-[28px] border border-[var(--ot-line)] bg-white/70 p-6 shadow-[0_18px_48px_rgba(117,52,0,0.08)] backdrop-blur-xl transition duration-200 hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(117,52,0,0.14)]">
    <div class="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-orange-400/0 via-orange-400/70 to-orange-400/0" />

    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--ot-orange-deep)]">
          {{ item.eyebrow }}
        </p>
        <h3 class="mt-3 text-2xl font-semibold text-[var(--ot-ink)]">
          {{ item.title }}
        </h3>
      </div>

      <span
        class="rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]"
        :class="item.status === 'live'
          ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
          : 'border-amber-300 bg-amber-50 text-amber-700'"
      >
        {{ item.status }}
      </span>
    </div>

    <p class="mt-5 min-h-24 text-sm leading-7 text-[var(--ot-muted)]">
      {{ item.description }}
    </p>

    <div class="mt-6 flex items-center justify-between gap-4 border-t border-[var(--ot-line)] pt-5">
      <span class="text-sm font-medium text-[var(--ot-muted)]">
        {{ item.status === 'live' ? 'Ready to use now' : 'Queued for the next batch' }}
      </span>

      <UButton
        v-if="item.href"
        :to="item.href"
        color="warning"
        variant="soft"
        trailing-icon="i-lucide-arrow-up-right"
      >
        打开工具
      </UButton>

      <UButton
        v-else
        color="neutral"
        variant="outline"
        disabled
      >
        即将上线
      </UButton>
    </div>
  </article>
</template>
