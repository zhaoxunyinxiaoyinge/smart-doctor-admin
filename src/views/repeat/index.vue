<script lang="ts" setup>
import { defineCustomElement } from '@vue/runtime-dom';
import { getCurrentInstance, Suspense } from "vue"
import content from "@/assets/scss/layout.module.scss";
const loading = ref<boolean>(true);
const currentDate = ref<String>(new Date().toLocaleString());

const progress = ref(null);

const child = defineCustomElement({
  props: {},
  emits: {},
  template: `<div><span>这是一个擦超测试</span></div>`
});


const Progress = defineAsyncComponent({
  loader: () => import('@/views/repeat/components/progress.vue')
})

const submit = (data: object) => {
}

setTimeout(() => {
  loading.value = false;
}, 2000)

const appThis = getCurrentInstance();

const handleResolve = () => {
  console.log('正在加载中。。。。');
}

const handleFallback = () => {
  console.log('fallback加载中')
}

</script>

<template>
  <el-scrollbar :height="content.routeContentHeight">
    <div class="padding-top-10 padding-left-10 padding-right-10 padding-bottom-10">
      <div style="display: flex;justify-content:flex-start;flex-wrap: wrap;">
        <el-skeleton :key="item" style="margin-top:20px;margin-right: 20px;width: 240px;" :loading="loading" animated
          v-for="item in 10">
          <template #template>
            <div style="width:240px">
              <el-skeleton-item variant="image" style="width: 240px; height: 240px" />
              <div style="padding: 14px;width: 240px;padding-left: 0;">
                <el-skeleton-item variant="h3" style="width:240px" />
                <div style="
              display: flex;
              align-items: center;
              justify-content: space-around;
              margin-top: 16px;
              height: 16px;
            ">
                  <el-skeleton-item variant="text" style="width: 33%" />
                </div>
              </div>

            </div>

          </template>
          <template #default>
            <el-card :body-style="{ padding: '0px', marginBottom: '1px'}">
              <el-image  style="width:240px" fit="fit"  src="https://ts1.cn.mm.bing.net/th/id/R-C.8cb4a6fb39ffdde88329b40d46497786?rik=PG0oA0YhzYKPYQ&riu=http%3a%2f%2ffiles.eduuu.com%2fimg%2f2017%2f11%2f07%2f140349_5a014cc561dad.jpg&ehk=wGN7ZOQtbyBRoSI0k931NO5XkL4h9qR1p%2bONhKdTg78%3d&risl=&pid=ImgRaw&r=0"
               ></el-image>
              <div style="padding: 14px">
                <span>Delicious hamburger</span>
                <div class="bottom card-header">
                  <div class="time">{{ currentDate }}</div>
                </div>
              </div>
            </el-card>
          </template>
        </el-skeleton>
      </div>

      <Suspense @fallback="handleResolve" @resolve="handleFallback">
        <!-- <Progress a="1111" name="arrtas" ref="progress" :width="16" :status="'success'" :percentage="100"
          @submit="submit">
        </Progress> -->
        <template #fallback>
          <span>正在加载中。。。。</span>
        </template>
      </Suspense>

    </div>
  </el-scrollbar>
</template>

<style scoped>
.el-card {
  margin: 5px;
  padding-top: 10px;
}
</style>