<template>
  <div class="ot-shell">
    <header class="sticky top-0 z-40 border-b border-[var(--ot-line)] bg-white/75 backdrop-blur-xl">
      <div class="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <NuxtLink to="/" class="flex min-w-0 items-center gap-3">
          <div class="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/80 bg-gradient-to-br from-emerald-100 via-emerald-200 to-green-400 text-sm font-black tracking-[0.2em] text-emerald-950 shadow-[0_10px_30px_rgba(0,220,130,0.18)]">
            OT
          </div>
          <div class="min-w-0">
            <p class="truncate text-sm font-semibold uppercase tracking-[0.28em] text-[var(--ot-orange-deep)]">
              Orange Tools
            </p>
            <p class="truncate text-sm text-[var(--ot-muted)]">
              基于 Nuxt 构建的极简本地工具集
            </p>
          </div>
        </NuxtLink>

        <nav class="flex items-center gap-2">
          <UButton to="/" variant="ghost" color="neutral" size="sm">
            首页
          </UButton>
          <UButton to="/git-diff" variant="soft" color="primary" size="sm">
            Git Diff
          </UButton>
        </nav>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <slot />
    </main>
  </div>
</template>
