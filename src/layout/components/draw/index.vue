<script  setup  lang="ts" name="draws">
import Bus from "@/views/provides/bus";
import SvgIcon from "@/components/icons/svg-icon.vue";
import { theme } from "@/store/theme";
import { userstore } from "@/store/expmle";
import { setTheme } from "@/hooks/useTheme";

const colorList = reactive<Array<string>>([
    '#ff4500',
    '#ff8c00',
    '#ffd700',
    '#90ee90',
    '#00ced1',
    '#1e90ff',
    '#c71585',
    'rgba(255, 69, 0, 0.68)',
    'rgb(255, 120, 0)',
    'hsv(51, 100, 98)',
    'hsva(120, 40, 94, 0.5)',
    'hsl(181, 100%, 37%)',
    'hsla(209, 100%, 56%, 0.73)',
    '#c7158577',
])

const drawerVisble = ref(false);
Bus.on('visable', function () {
    drawerVisble.value = true;
});
const store = theme();
const config = userstore();
setTheme(store.themeColor);

const changeColor = () => {
    setTheme(store.themeColor);
}

const handleCurrentLayout = (val: 'vertical' | 'classic' | 'transverse' | 'columns',): void => {
    store.setLayoutName(val);
}
</script>

<template>
    <el-drawer size="25%" v-model="drawerVisble" title="布局主题设置" direction="rtl">
        <template #default>
            <div>
                <div class="list">
                    <div class="layout margin-bottom-20">
                        <el-divider>
                            <svg-icon :names="'snowflake'" style="vertical-align:middle"></svg-icon>
                            <span>布局切换</span>
                        </el-divider>
                        <div class="layout-list">
                            <div :class="['layout-list-item', 'vertical', store.layoutName == 'vertical' ? 'layout-border' : '']"
                                @click="handleCurrentLayout('vertical')">
                                <div class="layout-aside">
                                </div>
                                <div class="layout-content">
                                    <div class="layout-header"></div>
                                    <div class="layout-wrapper">
                                        <el-icon v-if="store.layoutName == 'vertical'">
                                            <SuccessFilled class="checked" />
                                        </el-icon>
                                    </div>
                                </div>
                            </div>

                            <div :class="['layout-list-item', 'classic', store.layoutName == 'classic' ? 'layout-border' : '']"
                                @click="handleCurrentLayout('classic')">
                                <div class="layout-aside">
                                </div>
                                <div class="layout-content">
                                    <div class="layout-header"></div>
                                    <div class="layout-wrapper">
                                        <el-icon v-if="store.layoutName == 'classic'">
                                            <SuccessFilled class="checked" />
                                        </el-icon>
                                    </div>
                                </div>
                            </div>

                            <div :class="['layout-list-item', 'transverse', store.layoutName == 'transverse' ? 'layout-border' : '']"
                                @click="handleCurrentLayout('transverse')">
                                <div class="layout-aside">
                                </div>
                                <div class="layout-content">
                                    <el-icon v-if="store.layoutName == 'transverse'">
                                        <SuccessFilled class="checked" />
                                    </el-icon>
                                </div>
                            </div>

                            <div :class="['layout-list-item', 'columns', store.layoutName == 'columns' ? 'layout-border' : '']"
                                @click="handleCurrentLayout('columns')">
                                <div class="layout-aside">
                                </div>
                                <div class="layout-submenu"></div>
                                <div class="layout-content">
                                    <el-icon v-if="store.layoutName == 'columns'">
                                        <SuccessFilled class="checked" />
                                    </el-icon>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="all-theme  margin-bottom-20">
                        <el-divider>
                            <svg-icon :names="'snowflake'" style="vertical-align:middle"></svg-icon>
                            <span>全局主题</span>
                        </el-divider>
                        <div class="list">
                            <div class="list-item">
                                <span>主题颜色</span>
                                <el-color-picker @change="changeColor" v-model="store.themeColor" show-alpha
                                    :predefine="colorList" />
                            </div>
                            <div class="list-item">
                                <span>灰色模式</span>
                                <el-switch></el-switch>
                            </div>
                            <div class="list-item">
                                <span>色弱模式</span>
                                <el-switch></el-switch>
                            </div>
                        </div>
                    </div>

                    <div class="ui-set  margin-bottom-20">
                        <el-divider>
                            <svg-icon :names="'snowflake'" style="vertical-align:middle"></svg-icon>
                            <span> 界面设置</span>
                        </el-divider>
                        <div class="list">
                            <div class="list-item">
                                <span>折叠菜单</span>
                                <el-switch v-model="config.isCollapse"></el-switch>
                            </div>

                            <div class="list-item">
                                <span>面包屑导航</span>
                                <el-switch v-model="store.isBrearum"></el-switch>
                            </div>
                            <div class="list-item">
                                <span>标签栏</span>
                                <el-switch v-model="store.tabbar"></el-switch>
                            </div>
                            <div class="list-item">
                                <span>页脚</span>
                                <el-switch v-model="store.isFooter"></el-switch>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </el-drawer>
</template>


<style scoped lang="scss">
.layout-list-item {
    margin-bottom: 10px;
}

.layout-list {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
}

.layout-border {
    outline: 2px solid var(--el-color-primary);
}

div {
    border-radius: 5px;
}

.list {
    display: flex;
    flex-direction: column;
    font-size: 14px;
}

.list-item {
    display: flex;
    justify-content: space-between;
}


.vertical {
    display: flex;
    width: 150px;
    padding: 10px;
    box-sizing: border-box;
    box-shadow: 0px 0px 10px 3px #ccc;

    .layout-aside {
        width: 20px;
        height: 100px;
        background-color: green;
        margin-right: 10px;
    }

    .layout-content {
        flex: 1;
        display: flex;
        flex-direction: column;

        .layout-header {
            width: 100%;
            height: 20px;
            background: rgb(101, 156, 101);
            margin-bottom: 10px;
        }

        .layout-wrapper {
            flex: 1;
            background-color: rgb(101, 156, 101);
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
}

.classic {
    display: flex;
    flex-direction: column;
    width: 150px;
    height: 120px;
    padding: 10px;
    box-sizing: border-box;
    box-shadow: 0px 0px 10px 3px #ccc;

    .layout-aside {
        height: 20px;
        background-color: green;
        margin-bottom: 10px;
    }

    .layout-content {
        flex: 1;
        display: flex;

        .layout-header {
            width: 20px;
            background-color: green;
            margin-right: 10px;
        }

        .layout-wrapper {
            flex: 1;
            background-color: rgb(101, 156, 101);
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
}

.transverse {
    display: flex;
    flex-direction: column;
    width: 150px;
    padding: 10px;
    height: 120px;
    box-sizing: border-box;
    box-shadow: 0px 0px 10px 3px #ccc;

    .layout-aside {
        height: 20px;
        background-color: green;
        margin-bottom: 10px;
    }

    .layout-content {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgb(101, 156, 101);
    }

}

.columns {
    display: flex;
    width: 150px;
    padding: 10px;
    height: 120px;
    box-sizing: border-box;
    box-shadow: 0px 0px 10px 3px #ccc;

    .layout-aside {
        width: 20px;
        background-color: green;
        margin-right: 10px;
    }

    .layout-submenu {
        width: 20px;
        background-color: green;
        margin-right: 10px;
    }

    .layout-content {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgb(101, 156, 101);

    }
}

.checked {
    color: var(--el-color-primary)
}
</style>