<script setup lang="ts">
useSeoMeta({
  title: 'Orange Tools',
  description: '基于 Nuxt 构建的本地优先 Git Diff 工具站'
})
</script>

<template>
  <div class="space-y-8 lg:space-y-12">
    <section class="ot-surface-strong ot-grid-accent overflow-hidden rounded-[36px] px-6 py-8 sm:px-8 lg:px-10 lg:py-14">
      <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.34em] text-[var(--ot-orange-deep)]">
            Orange Tools
          </p>
          <h1 class="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-[var(--ot-ink)] sm:text-5xl lg:text-6xl">
            为专注的本地工具打造的极简家园
          </h1>
          <p class="ot-prose mt-6 max-w-2xl text-base leading-8 sm:text-lg">
            这个工具站提供轻量的本地 diff 工具：既可以对比普通文本，也可以比较 JSON 的真实结构变化，直接在浏览器中完成。
          </p>

          <div class="mt-8 flex flex-wrap items-center gap-3">
            <UButton to="/git-diff" color="primary" size="xl" trailing-icon="i-lucide-arrow-right">
              打开 Git Diff
            </UButton>
            <UButton to="/json-diff" color="neutral" variant="outline" size="xl" trailing-icon="i-lucide-braces">
              打开 JSON Diff
            </UButton>
          </div>

          <div class="ot-surface mt-8 max-w-3xl rounded-[28px] p-4 sm:p-5">
            <p class="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--ot-orange-deep)]">
              路由
            </p>
            <div class="mt-3 space-y-3">
              <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <code class="ot-code rounded-2xl bg-[var(--ot-code-bg)] px-4 py-3 text-sm text-[var(--ot-ink)]">
                  /git-diff
                </code>
                <p class="text-sm leading-7 text-[var(--ot-muted)]">
                  本地对比任意文本，支持行内 token 高亮。
                </p>
              </div>
              <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <code class="ot-code rounded-2xl bg-[var(--ot-code-bg)] px-4 py-3 text-sm text-[var(--ot-ink)]">
                  /json-diff
                </code>
                <p class="text-sm leading-7 text-[var(--ot-muted)]">
                  自动格式化并排序键名，对比两个 JSON 的结构变化。
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="ot-surface rounded-[30px] p-5 lg:p-6">
          <p class="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ot-orange-deep)]">
            当前可用
          </p>
          <div class="mt-4 space-y-5">
            <div>
              <h2 class="text-2xl font-semibold text-[var(--ot-ink)]">
                Git Diff
              </h2>
              <div class="mt-3 space-y-2 text-sm leading-7 text-[var(--ot-muted)]">
                <p>两个输入区，一个专注的结果展示。</p>
                <p>行对齐加上行内 token 变化高亮。</p>
              </div>
              <div class="mt-4">
                <UButton to="/git-diff" color="neutral" variant="outline" trailing-icon="i-lucide-arrow-up-right">
                  查看工具
                </UButton>
              </div>
            </div>

            <div class="border-t border-[var(--ot-line)] pt-5">
              <h2 class="text-2xl font-semibold text-[var(--ot-ink)]">
                JSON Diff
              </h2>
              <div class="mt-3 space-y-2 text-sm leading-7 text-[var(--ot-muted)]">
                <p>自动校验 JSON，再比较真实结构变化。</p>
                <p>忽略缩进与对象键顺序造成的噪音。</p>
              </div>
              <div class="mt-4">
                <UButton to="/json-diff" color="neutral" variant="outline" trailing-icon="i-lucide-arrow-up-right">
                  查看工具
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="grid gap-4 md:grid-cols-3">
      <article class="ot-surface rounded-[28px] p-5">
        <p class="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--ot-orange-deep)]">
          本地优先
        </p>
        <p class="mt-3 text-sm leading-7 text-[var(--ot-muted)]">
          文本与 JSON 都保留在浏览器中，diff 在客户端生成。
        </p>
      </article>

      <article class="ot-surface rounded-[28px] p-5">
        <p class="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--ot-orange-deep)]">
          结构清晰
        </p>
        <p class="mt-3 text-sm leading-7 text-[var(--ot-muted)]">
          文本 diff 与 JSON diff 拆成独立页面，各自聚焦单一任务。
        </p>
      </article>

      <article class="ot-surface rounded-[28px] p-5">
        <p class="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--ot-orange-deep)]">
          Nuxt 风格
        </p>
        <p class="mt-3 text-sm leading-7 text-[var(--ot-muted)]">
          柔和的表面、克制的文案、清爽的绿色主题系统。
        </p>
      </article>
    </section>
  </div>
</template>
