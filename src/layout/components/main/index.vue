<script lang="ts" setup>
</script>

<template>
  <router-view v-slot="{ Component, route }">
    <transition
      enter-active-class="animate__animated animate__fadeIn"
      leave-active-class="animate__animated animate__fadeOut"
      appear
      name="fade"
    >
      <keep-alive>
        <Suspense>
          <component
            :is="Component"
            :key="route.path"
          />
          <template #fallback>
            .......loading
          </template>
        </Suspense>
      </keep-alive>
    </transition>
  </router-view>
</template>