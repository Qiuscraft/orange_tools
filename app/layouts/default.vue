<template>
  <div class="ot-shell">
    <header class="sticky top-0 z-40 border-b border-[var(--ot-line)] bg-white/70 backdrop-blur-xl">
      <div class="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <NuxtLink to="/" class="flex min-w-0 items-center gap-3">
          <div class="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/70 bg-gradient-to-br from-amber-200 via-orange-300 to-orange-500 text-sm font-black tracking-[0.2em] text-orange-950 shadow-lg shadow-orange-900/10">
            OT
          </div>
          <div class="min-w-0">
            <p class="truncate text-sm font-semibold uppercase tracking-[0.28em] text-[var(--ot-orange-deep)]">
              Orange Tools
            </p>
            <p class="truncate text-sm text-[var(--ot-muted)]">
              A sharp, local-first toolbox for text workflows.
            </p>
          </div>
        </NuxtLink>

        <nav class="flex items-center gap-2">
          <UButton to="/" variant="ghost" color="neutral" size="sm">
            导航页
          </UButton>
          <UButton to="/git-diff" variant="soft" color="warning" size="sm">
            Git Diff
          </UButton>
        </nav>
      </div>
    </header>

    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <slot />
    </main>
  </div>
</template>
