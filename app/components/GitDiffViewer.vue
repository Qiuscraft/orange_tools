<script setup lang="ts">
import type { DiffResult, DiffRow, DiffTokenType } from '~/utils/gitDiff'

const props = defineProps<{
  result: DiffResult
}>()

function tokenClass(type: DiffTokenType): string {
  if (type === 'added') {
    return 'ot-token ot-token-added'
  }

  if (type === 'removed') {
    return 'ot-token ot-token-removed'
  }

  return ''
}

function rowClass(row: DiffRow): string {
  if (row.type === 'added') {
    return 'bg-emerald-50/70'
  }

  if (row.type === 'removed') {
    return 'bg-orange-50/70'
  }

  if (row.type === 'modified') {
    return 'bg-amber-50/70'
  }

  return 'bg-white/70'
}

function sideLabel(row: DiffRow, side: 'left' | 'right'): string {
  const isMissing = side === 'left' ? row.leftLineNumber === null : row.rightLineNumber === null
  return isMissing ? '∅' : side === 'left' ? 'OLD' : 'NEW'
}

const summaryItems = computed(() => [
  { label: 'Modified', value: props.result.summary.modified, tone: 'bg-amber-100 text-amber-800' },
  { label: 'Added', value: props.result.summary.added, tone: 'bg-emerald-100 text-emerald-800' },
  { label: 'Removed', value: props.result.summary.removed, tone: 'bg-orange-100 text-orange-800' },
  { label: 'Unchanged', value: props.result.summary.unchanged, tone: 'bg-stone-100 text-stone-700' }
])
</script>

<template>
  <section class="space-y-5">
    <div class="flex flex-wrap items-center gap-3">
      <div
        v-for="item in summaryItems"
        :key="item.label"
        class="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]"
        :class="item.tone"
      >
        {{ item.label }} · {{ item.value }}
      </div>
    </div>

    <div class="overflow-hidden rounded-[28px] border border-[var(--ot-line)] bg-white/80 shadow-[0_18px_48px_rgba(117,52,0,0.08)]">
      <div class="grid gap-px bg-[var(--ot-line)] lg:grid-cols-2">
        <div class="bg-stone-950 px-4 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white/75">
          Original
        </div>
        <div class="bg-stone-950 px-4 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white/75 lg:border-l lg:border-white/10">
          Revised
        </div>
      </div>

      <div class="max-h-[72vh] overflow-auto bg-[var(--ot-line)] p-px">
        <div
          v-for="row in result.rows"
          :key="row.id"
          class="grid gap-px border-b border-[var(--ot-line)] last:border-b-0 lg:grid-cols-2"
        >
          <div class="flex min-h-12" :class="rowClass(row)">
            <div class="flex w-16 shrink-0 items-start justify-center border-r border-[var(--ot-line)] px-2 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--ot-muted)]">
              <span>{{ row.leftLineNumber ?? '·' }}</span>
            </div>
            <div class="flex-1 px-4 py-3">
              <div class="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--ot-muted)] lg:hidden">
                {{ sideLabel(row, 'left') }}
              </div>
              <pre class="ot-code whitespace-pre-wrap break-words text-sm leading-6 text-[var(--ot-ink)]"><template v-if="row.leftTokens.length"><span v-for="(token, tokenIndex) in row.leftTokens" :key="`${row.id}-left-${tokenIndex}`" :class="tokenClass(token.type)">{{ token.value }}</span></template><span v-else class="text-stone-300">&nbsp;</span></pre>
            </div>
          </div>

          <div class="flex min-h-12" :class="rowClass(row)">
            <div class="flex w-16 shrink-0 items-start justify-center border-r border-[var(--ot-line)] px-2 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--ot-muted)]">
              <span>{{ row.rightLineNumber ?? '·' }}</span>
            </div>
            <div class="flex-1 px-4 py-3">
              <div class="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--ot-muted)] lg:hidden">
                {{ sideLabel(row, 'right') }}
              </div>
              <pre class="ot-code whitespace-pre-wrap break-words text-sm leading-6 text-[var(--ot-ink)]"><template v-if="row.rightTokens.length"><span v-for="(token, tokenIndex) in row.rightTokens" :key="`${row.id}-right-${tokenIndex}`" :class="tokenClass(token.type)">{{ token.value }}</span></template><span v-else class="text-stone-300">&nbsp;</span></pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
