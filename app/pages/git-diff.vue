<script setup lang="ts">
import { buildGitDiff, diffExample } from '~/utils/gitDiff'

useSeoMeta({
  title: 'Git Diff | Orange Tools',
  description: '输入两段文本，查看类似 VS Code 的 Git Diff 可视化差异结果。'
})

const leftInput = ref('')
const rightInput = ref('')
const comparedLeft = ref('')
const comparedRight = ref('')

const diffResult = computed(() => buildGitDiff(comparedLeft.value, comparedRight.value))
const hasCompared = computed(() => comparedLeft.value.length > 0 || comparedRight.value.length > 0)
const hasChanges = computed(() => {
  const { added, removed, modified } = diffResult.value.summary
  return added + removed + modified > 0
})

function compareNow(): void {
  comparedLeft.value = leftInput.value
  comparedRight.value = rightInput.value
}

function swapInputs(): void {
  const currentLeft = leftInput.value

  leftInput.value = rightInput.value
  rightInput.value = currentLeft
  compareNow()
}

function clearAll(): void {
  leftInput.value = ''
  rightInput.value = ''
  compareNow()
}

function loadExample(): void {
  leftInput.value = diffExample.before
  rightInput.value = diffExample.after
  compareNow()
}
</script>

<template>
  <div class="space-y-8">
    <section class="ot-surface-strong rounded-[36px] px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
      <div class="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_22rem]">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--ot-orange-deep)]">
            Git Diff Visualizer
          </p>
          <h1 class="mt-4 text-4xl font-semibold leading-tight text-[var(--ot-ink)] sm:text-5xl">
            把两段文本放进来，像看代码审查一样看差异。
          </h1>
          <p class="mt-5 max-w-3xl text-base leading-8 text-[var(--ot-muted)] sm:text-lg">
            首版使用浏览器本地 diff 计算，先做行级对齐，再对修改行做词级高亮。你可以直接粘贴配置、代码、日志或 Markdown 内容来比对变化。
          </p>
        </div>

        <div class="ot-surface rounded-[28px] p-5">
          <p class="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ot-orange-deep)]">
            Current Mode
          </p>
          <div class="mt-4 space-y-3 text-sm leading-7 text-[var(--ot-muted)]">
            <p>布局：左右分栏，移动端自动改为上下堆叠。</p>
            <p>粒度：整行差异 + 修改行词级高亮。</p>
            <p>范围：纯文本输入，不做文件上传和编辑器集成。</p>
          </div>
        </div>
      </div>
    </section>

    <section class="grid gap-6 lg:grid-cols-2">
      <div class="ot-surface rounded-[30px] p-5 sm:p-6">
        <div class="mb-4 flex items-center justify-between gap-3">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--ot-orange-deep)]">
              Original
            </p>
            <h2 class="mt-1 text-xl font-semibold text-[var(--ot-ink)]">
              旧文本
            </h2>
          </div>
          <span class="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-stone-700">
            Left
          </span>
        </div>

        <UTextarea
          v-model="leftInput"
          :rows="16"
          autoresize
          class="ot-code"
          placeholder="把旧版本内容粘贴到这里"
        />
      </div>

      <div class="ot-surface rounded-[30px] p-5 sm:p-6">
        <div class="mb-4 flex items-center justify-between gap-3">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--ot-orange-deep)]">
              Revised
            </p>
            <h2 class="mt-1 text-xl font-semibold text-[var(--ot-ink)]">
              新文本
            </h2>
          </div>
          <span class="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-stone-700">
            Right
          </span>
        </div>

        <UTextarea
          v-model="rightInput"
          :rows="16"
          autoresize
          class="ot-code"
          placeholder="把新版本内容粘贴到这里"
        />
      </div>
    </section>

    <section class="ot-surface rounded-[30px] p-5 sm:p-6">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--ot-orange-deep)]">
            Actions
          </p>
          <p class="mt-2 text-sm leading-7 text-[var(--ot-muted)]">
            先把两边文本填好，再执行对比。`Swap` 适合快速切换视角，`Load Example` 用来查看默认效果。
          </p>
        </div>

        <div class="flex flex-wrap gap-3">
          <UButton color="warning" size="lg" trailing-icon="i-lucide-git-compare" @click="compareNow">
            Compare
          </UButton>
          <UButton color="neutral" variant="outline" size="lg" trailing-icon="i-lucide-repeat-2" @click="swapInputs">
            Swap
          </UButton>
          <UButton color="neutral" variant="outline" size="lg" trailing-icon="i-lucide-eraser" @click="clearAll">
            Clear
          </UButton>
          <UButton color="neutral" variant="soft" size="lg" trailing-icon="i-lucide-flask-conical" @click="loadExample">
            Load Example
          </UButton>
        </div>
      </div>
    </section>

    <section v-if="hasCompared" class="space-y-4">
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ot-orange-deep)]">
            Diff Result
          </p>
          <h2 class="mt-1 text-2xl font-semibold text-[var(--ot-ink)]">
            {{ hasChanges ? '差异已生成' : '两段文本当前一致' }}
          </h2>
        </div>
        <p class="text-sm leading-7 text-[var(--ot-muted)]">
          {{ hasChanges ? '修改行会在行内继续高亮，方便直接定位具体词块变化。' : '当前没有增删改。你仍然可以继续替换内容后再次比较。' }}
        </p>
      </div>

      <GitDiffViewer :result="diffResult" />
    </section>

    <section v-else class="ot-surface rounded-[30px] border-dashed p-8 text-center">
      <p class="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ot-orange-deep)]">
        Waiting For Input
      </p>
      <h2 class="mt-3 text-2xl font-semibold text-[var(--ot-ink)]">
        先输入两段文本，再生成可视化 diff
      </h2>
      <p class="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[var(--ot-muted)]">
        这个页面的目标不是做完整编辑器，而是尽快把文本差异看清楚。所以首版只保留最核心的输入、比对和阅读体验。
      </p>
    </section>
  </div>
</template>
