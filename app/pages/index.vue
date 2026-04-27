<script setup lang="ts">
import { toolCatalog } from '~/utils/toolCatalog'

useSeoMeta({
  title: 'Orange Tools',
  description: 'Orange Tools 是一个品牌化的本地工具库，首发提供 Git Diff 文本差异可视化工具。'
})

const liveCount = toolCatalog.filter(tool => tool.status === 'live').length
</script>

<template>
  <div class="space-y-8 lg:space-y-10">
    <section class="ot-surface-strong ot-grid-accent overflow-hidden rounded-[36px] px-6 py-8 sm:px-8 lg:px-10 lg:py-12">
      <div class="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_20rem] lg:items-end">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.34em] text-[var(--ot-orange-deep)]">
            Curated Utility Suite
          </p>
          <h1 class="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-[var(--ot-ink)] sm:text-5xl lg:text-6xl">
            Orange Tools 把零散的开发小工具，收进一个有识别度的前端工具库里。
          </h1>
          <p class="ot-prose mt-6 max-w-2xl text-base leading-8 sm:text-lg">
            这里优先做轻量、直达、局部极强的文本与前端辅助工具。首发页先把导航和 Git Diff 打牢，后续工具会沿用同一套视觉语言继续扩展。
          </p>

          <div class="mt-8 flex flex-wrap items-center gap-3">
            <UButton to="/git-diff" color="warning" size="xl" trailing-icon="i-lucide-arrow-right">
              打开 Git Diff
            </UButton>
            <UButton to="#tool-grid" variant="outline" color="neutral" size="xl">
              浏览工具导航
            </UButton>
          </div>
        </div>

        <div class="ot-surface rounded-[30px] p-5 lg:p-6">
          <p class="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ot-orange-deep)]">
            Snapshot
          </p>
          <div class="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div class="rounded-2xl border border-white/80 bg-white/80 p-4">
              <p class="text-3xl font-semibold text-[var(--ot-ink)]">
                {{ toolCatalog.length }}
              </p>
              <p class="mt-2 text-sm text-[var(--ot-muted)]">
                tools mapped into the Orange Tools nav.
              </p>
            </div>
            <div class="rounded-2xl border border-white/80 bg-white/80 p-4">
              <p class="text-3xl font-semibold text-[var(--ot-ink)]">
                {{ liveCount }}
              </p>
              <p class="mt-2 text-sm text-[var(--ot-muted)]">
                live utility shipping in this first pass.
              </p>
            </div>
            <div class="rounded-2xl border border-white/80 bg-white/80 p-4">
              <p class="text-3xl font-semibold text-[var(--ot-ink)]">
                Local
              </p>
              <p class="mt-2 text-sm text-[var(--ot-muted)]">
                text processing in the browser, without sending content to a server.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="tool-grid" class="space-y-4">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ot-orange-deep)]">
            Tool Navigation
          </p>
          <h2 class="mt-2 text-3xl font-semibold text-[var(--ot-ink)]">
            当前工具与后续占位
          </h2>
        </div>
        <p class="max-w-xl text-sm leading-7 text-[var(--ot-muted)]">
          首页只做入口，不和具体工具逻辑耦合。这样后续继续增加页面时，结构和导航关系都能稳定复用。
        </p>
      </div>

      <div class="grid gap-5 lg:grid-cols-2">
        <ToolCard
          v-for="tool in toolCatalog"
          :key="tool.slug"
          :item="tool"
        />
      </div>
    </section>
  </div>
</template>
