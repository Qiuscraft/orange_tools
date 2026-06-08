<script setup lang="ts">
import type { JsonDiffSuccess } from '~/utils/jsonDiff'
import { buildJsonDiff, jsonDiffExample, parseJsonNodePaths } from '~/utils/jsonDiff'

useSeoMeta({
  title: 'JSON Diff | Orange Tools',
  description: '比较两个 JSON 的结构差异，自动格式化并按键名排序'
})

const leftInput = ref('')
const rightInput = ref('')
const unorderedNodeInput = ref('')
const hasCompared = ref(false)
const leftError = ref<string | null>(null)
const rightError = ref<string | null>(null)
const comparison = ref<JsonDiffSuccess | null>(null)
const unorderedNodePaths = computed(() => parseJsonNodePaths(unorderedNodeInput.value))

const hasChanges = computed(() => {
  if (!comparison.value) {
    return false
  }

  const { added, removed, modified } = comparison.value.diff.summary
  return added + removed + modified > 0
})

function compareNow(): void {
  hasCompared.value = true

  const result = buildJsonDiff(leftInput.value, rightInput.value, {
    unorderedNodePaths: unorderedNodePaths.value
  })

  if (!result.ok) {
    leftError.value = result.leftError
    rightError.value = result.rightError
    comparison.value = null
    return
  }

  leftError.value = null
  rightError.value = null
  comparison.value = result
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
  unorderedNodeInput.value = ''
  leftError.value = null
  rightError.value = null
  comparison.value = null
  hasCompared.value = false
}

function loadExample(): void {
  leftInput.value = jsonDiffExample.before
  rightInput.value = jsonDiffExample.after
  unorderedNodeInput.value = jsonDiffExample.unorderedPaths
  compareNow()
}
</script>

<template>
  <div class="space-y-8">
    <section class="ot-surface-strong rounded-[36px] px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
      <div class="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_22rem]">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--ot-orange-deep)]">
            JSON Diff 结构对比
          </p>
          <h1 class="mt-4 text-4xl font-semibold leading-tight text-[var(--ot-ink)] sm:text-5xl">
            对比两个 JSON，快速看清字段级变化
          </h1>
          <p class="mt-5 max-w-3xl text-base leading-8 text-[var(--ot-muted)] sm:text-lg">
            粘贴两段 JSON 后，页面会先自动校验、格式化，并按对象键名排序，再生成可视化 diff。你还可以指定某些节点为“顺序无关 list”，这样数组元素即使顺序不同，也不会被视为差异。
          </p>
        </div>

        <div class="ot-surface rounded-[28px] p-5">
          <p class="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ot-orange-deep)]">
            当前模式
          </p>
          <div class="mt-4 space-y-3 text-sm leading-7 text-[var(--ot-muted)]">
            <p>自动校验：输入无效 JSON 时直接提示错误。</p>
            <p>自动整理：统一使用两空格缩进输出。</p>
            <p>减少噪音：对象键名会按字母顺序排序。</p>
            <p>可选忽略：指定节点若为 list，则忽略元素顺序。</p>
          </div>
        </div>
      </div>
    </section>

    <section class="grid gap-6 lg:grid-cols-2">
      <div class="ot-surface rounded-[30px] p-5 sm:p-6">
        <div class="mb-4 flex items-center justify-between gap-3">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--ot-orange-deep)]">
              原始 JSON
            </p>
            <h2 class="mt-1 text-xl font-semibold text-[var(--ot-ink)]">
              之前的 JSON
            </h2>
          </div>
          <span class="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-stone-700">
            左侧
          </span>
        </div>

        <UTextarea
          v-model="leftInput"
          :rows="18"
          autoresize
          class="ot-code"
          placeholder="在此粘贴之前的 JSON"
        />

        <p v-if="leftError" class="mt-3 text-sm leading-6 text-red-600">
          {{ leftError }}
        </p>
      </div>

      <div class="ot-surface rounded-[30px] p-5 sm:p-6">
        <div class="mb-4 flex items-center justify-between gap-3">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--ot-orange-deep)]">
              修订 JSON
            </p>
            <h2 class="mt-1 text-xl font-semibold text-[var(--ot-ink)]">
              更新后的 JSON
            </h2>
          </div>
          <span class="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-stone-700">
            右侧
          </span>
        </div>

        <UTextarea
          v-model="rightInput"
          :rows="18"
          autoresize
          class="ot-code"
          placeholder="在此粘贴更新后的 JSON"
        />

        <p v-if="rightError" class="mt-3 text-sm leading-6 text-red-600">
          {{ rightError }}
        </p>
      </div>
    </section>

    <section class="ot-surface rounded-[30px] p-5 sm:p-6">
      <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--ot-orange-deep)]">
            选项
          </p>
          <h2 class="mt-2 text-xl font-semibold text-[var(--ot-ink)]">
            顺序无关节点
          </h2>
          <p class="mt-2 text-sm leading-7 text-[var(--ot-muted)]">
            输入一个或多个 JSON 节点路径。程序会检查这些路径对应的值是否为 list；如果是，则会在比较前对 list 元素做稳定排序，从而忽略顺序差异。
          </p>

          <UTextarea
            v-model="unorderedNodeInput"
            :rows="3"
            autoresize
            class="ot-code mt-4"
            placeholder="例如：modules 或 payload.items，可用逗号或换行分隔多个节点"
          />

          <p class="mt-3 text-xs leading-6 text-[var(--ot-muted)]">
            当前生效节点：{{ unorderedNodePaths.length ? unorderedNodePaths.join('、') : '未设置' }}
          </p>
        </div>

        <div class="rounded-[24px] border border-[var(--ot-line)] bg-[var(--ot-code-bg)]/70 p-4 text-sm leading-7 text-[var(--ot-muted)]">
          <p class="font-semibold text-[var(--ot-ink)]">
            路径示例
          </p>
          <p class="mt-2 ot-code text-xs text-[var(--ot-ink)]">
            modules
          </p>
          <p class="ot-code text-xs text-[var(--ot-ink)]">
            payload.items
          </p>
          <p class="mt-3 text-xs leading-6">
            如果节点存在但不是 list，比较时会直接报错。
          </p>
        </div>
      </div>
    </section>

    <section class="ot-surface rounded-[30px] p-5 sm:p-6">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--ot-orange-deep)]">
            操作
          </p>
          <p class="mt-2 text-sm leading-7 text-[var(--ot-muted)]">
            点击"对比"后会先校验 JSON，再按当前选项进行规范化比较。"交换"可直接反转左右视角。
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

    <section v-if="comparison" class="space-y-4">
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ot-orange-deep)]">
            对比结果
          </p>
          <h2 class="mt-1 text-2xl font-semibold text-[var(--ot-ink)]">
            {{ hasChanges ? 'JSON 对比完成' : '两个 JSON 在规范化后完全相同' }}
          </h2>
        </div>
        <p class="text-sm leading-7 text-[var(--ot-muted)]">
          {{ hasChanges ? '结果基于格式化、键名排序以及可选的 list 顺序忽略规则，能更稳定地定位真实字段改动。' : '当前差异只可能来自空白、缩进、对象键顺序或已配置 list 的元素顺序，它们已被自动消除。' }}
        </p>
      </div>

      <GitDiffViewer :result="comparison.diff" />
    </section>

    <section v-else-if="hasCompared && (leftError || rightError)" class="ot-surface rounded-[30px] border-dashed p-8 text-center">
      <p class="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ot-orange-deep)]">
        输入有误
      </p>
      <h2 class="mt-3 text-2xl font-semibold text-[var(--ot-ink)]">
        请先修复 JSON 格式，再重新对比
      </h2>
      <p class="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[var(--ot-muted)]">
        常见问题包括缺少双引号、逗号、括号不闭合，或者尾随多余字符。
      </p>
    </section>

    <section v-else class="ot-surface rounded-[30px] border-dashed p-8 text-center">
      <p class="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ot-orange-deep)]">
        等待输入
      </p>
      <h2 class="mt-3 text-2xl font-semibold text-[var(--ot-ink)]">
        输入两个 JSON 以生成结构化 diff
      </h2>
      <p class="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[var(--ot-muted)]">
        适合比较接口响应、配置文件、Mock 数据或对象快照，重点看字段的新增、删除和修改。
      </p>
    </section>
  </div>
</template>
