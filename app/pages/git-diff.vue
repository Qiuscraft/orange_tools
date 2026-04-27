<script setup lang="ts">
import { buildGitDiff, diffExample } from '~/utils/gitDiff'

useSeoMeta({
  title: 'Git Diff | Orange Tools',
  description: '使用 VS Code 风格的 Git diff 视图对比两段文本'
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
            Git Diff 可视化工具
          </p>
          <h1 class="mt-4 text-4xl font-semibold leading-tight text-[var(--ot-ink)] sm:text-5xl">
            像专注的代码审查一样对比两段文本
          </h1>
          <p class="mt-5 max-w-3xl text-base leading-8 text-[var(--ot-muted)] sm:text-lg">
            这个工具在浏览器中运行 diff，按行对齐变化，并以内联方式高亮修改的 token。粘贴代码、配置、日志或 Markdown，立即查看变更集。
          </p>
        </div>

        <div class="ot-surface rounded-[28px] p-5">
          <p class="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ot-orange-deep)]">
            当前模式
          </p>
          <div class="mt-4 space-y-3 text-sm leading-7 text-[var(--ot-muted)]">
            <p>布局：桌面端双栏，小屏幕堆叠块。</p>
            <p>粒度：完整行变化加内联 token 高亮。</p>
            <p>范围：仅纯文本，无文件上传或编辑器集成。</p>
          </div>
        </div>
      </div>
    </section>

    <section class="grid gap-6 lg:grid-cols-2">
      <div class="ot-surface rounded-[30px] p-5 sm:p-6">
        <div class="mb-4 flex items-center justify-between gap-3">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--ot-orange-deep)]">
              原始文本
            </p>
            <h2 class="mt-1 text-xl font-semibold text-[var(--ot-ink)]">
              之前的版本
            </h2>
          </div>
          <span class="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-stone-700">
            左侧
          </span>
        </div>

        <UTextarea
          v-model="leftInput"
          :rows="16"
          autoresize
          class="ot-code"
          placeholder="在此粘贴之前的版本"
        />
      </div>

      <div class="ot-surface rounded-[30px] p-5 sm:p-6">
        <div class="mb-4 flex items-center justify-between gap-3">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--ot-orange-deep)]">
              修订文本
            </p>
            <h2 class="mt-1 text-xl font-semibold text-[var(--ot-ink)]">
              更新后的版本
            </h2>
          </div>
          <span class="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-stone-700">
            右侧
          </span>
        </div>

        <UTextarea
          v-model="rightInput"
          :rows="16"
          autoresize
          class="ot-code"
          placeholder="在此粘贴更新后的版本"
        />
      </div>
    </section>

    <section class="ot-surface rounded-[30px] p-5 sm:p-6">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--ot-orange-deep)]">
            操作
          </p>
          <p class="mt-2 text-sm leading-7 text-[var(--ot-muted)]">
            对比前请填写两侧输入。使用"交换"反转视角，或"加载示例"预览默认效果。
          </p>
        </div>

        <div class="flex flex-wrap gap-3">
          <UButton color="warning" size="lg" trailing-icon="i-lucide-git-compare" @click="compareNow">
            对比
          </UButton>
          <UButton color="neutral" variant="outline" size="lg" trailing-icon="i-lucide-repeat-2" @click="swapInputs">
            交换
          </UButton>
          <UButton color="neutral" variant="outline" size="lg" trailing-icon="i-lucide-eraser" @click="clearAll">
            清空
          </UButton>
          <UButton color="neutral" variant="soft" size="lg" trailing-icon="i-lucide-flask-conical" @click="loadExample">
            加载示例
          </UButton>
        </div>
      </div>
    </section>

    <section v-if="hasCompared" class="space-y-4">
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ot-orange-deep)]">
            对比结果
          </p>
          <h2 class="mt-1 text-2xl font-semibold text-[var(--ot-ink)]">
            {{ hasChanges ? '对比完成' : '两段文本当前完全相同' }}
          </h2>
        </div>
        <p class="text-sm leading-7 text-[var(--ot-muted)]">
          {{ hasChanges ? '已变化的行包含内联高亮，方便定位具体的 token 编辑。' : '目前没有新增、删除或修改。你可以替换任意一侧并重新对比。' }}
        </p>
      </div>

      <GitDiffViewer :result="diffResult" />
    </section>

    <section v-else class="ot-surface rounded-[30px] border-dashed p-8 text-center">
      <p class="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ot-orange-deep)]">
        等待输入
      </p>
      <h2 class="mt-3 text-2xl font-semibold text-[var(--ot-ink)]">
        输入两段文本以生成可视化 diff
      </h2>
      <p class="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[var(--ot-muted)]">
        这里的目标不是替代编辑器，而是让文本变化快速可读，因此首版只保留核心的输入、对比、审查流程。
      </p>
    </section>
  </div>
</template>
