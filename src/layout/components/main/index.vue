<script lang="ts" setup>
import { _cachelist } from "@/router/cancle"
</script>

<template>
    <router-view v-slot="{ Component, route }">
        <transition  appear name="fade">
            <keep-alive :include="_cachelist">
                <component :is="Component" :key="route.path">
                </component>
            </keep-alive>
        </transition>
    </router-view>
</template>