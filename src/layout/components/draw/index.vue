<script  setup  lang="ts" name="draws">
import Bus from "@/views/provides/bus";
import SvgIcon from "@/components/icons/svg-icon.vue";
import { theme } from "@/store/theme";
import { userstore } from "@/store/expmle";
import { setTheme } from "@/hooks/useTheme";

const colorList = reactive<Array<string>>([
    '#2563eb',
    '#1d4ed8',
    '#0ea5e9',
    '#3b82f6',
    '#6366f1',
    '#8b5cf6',
    '#10b981',
    '#f59e0b',
    '#f87171',
    '#64748b',
    '#334155',
    '#0f172a',
])

const drawerVisble = ref(false);
Bus.on('visable', function () {
    drawerVisble.value = true;
});
const store = theme();
const config = userstore();
// 布局切换只保留 vertical 一种，历史遗留的其他布局值统一重置
if (store.layoutName !== 'vertical') {
    store.setLayoutName('vertical');
}
setTheme(store.themeColor);

const changeColor = () => {
    setTheme(store.themeColor);
}

const handleCurrentLayout = (val: 'vertical',): void => {
    store.setLayoutName(val);
}

const handleColor=(flag,type)=>{
    if(flag){
        if(type==='grayscale'){ document.body.style.filter='grayscale(100%)' } else { document.body.style.filter='saturate(25%)' }
    }else{
        document.body.style.filter='none'
    }
}
</script>

<template>
  <el-drawer
    v-model="drawerVisble"
    size="25%"
    title="布局主题设置"
    direction="rtl"
  >
    <template #default>
      <div>
        <div class="list">
          <div class="layout margin-bottom-20">
            <el-divider>
              <svg-icon
                :names="'snowflake'"
                style="vertical-align:middle"
              />
              <span>布局切换</span>
            </el-divider>
            <div class="layout-list">
              <div
                :class="['layout-list-item', 'vertical', store.layoutName == 'vertical' ? 'layout-border' : '']"
                @click="handleCurrentLayout('vertical')"
              >
                <div class="layout-aside" />
                <div class="layout-content">
                  <div class="layout-header" />
                  <div class="layout-wrapper">
                    <el-icon v-if="store.layoutName == 'vertical'">
                      <SuccessFilled class="checked" />
                    </el-icon>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="all-theme  margin-bottom-20">
            <el-divider>
              <svg-icon
                :names="'snowflake'"
                style="vertical-align:middle"
              />
              <span>全局主题</span>
            </el-divider>
            <div class="list">
              <div class="list-item">
                <span>主题颜色</span>
                <el-color-picker
                  v-model="store.themeColor"
                  show-alpha
                  :predefine="colorList"
                  @change="changeColor"
                />
              </div>
              <div class="list-item">
                <span>灰色模式</span>
                <el-switch
                  v-model="store.grayscale"
                  @change="(flag)=>handleColor(flag,'grayscale')"
                />
              </div>
              <div class="list-item">
                <span>色弱模式</span>
                <el-switch
                  v-model="store.saturate"
                  @change="(flag)=>handleColor(flag,'saturate')"
                />
              </div>
            </div>
          </div>

          <div class="ui-set  margin-bottom-20">
            <el-divider>
              <svg-icon
                :names="'snowflake'"
                style="vertical-align:middle"
              />
              <span> 界面设置</span>
            </el-divider>
            <div class="list">
              <div class="list-item">
                <span>折叠菜单</span>
                <el-switch v-model="config.isCollapse" />
              </div>

              <div class="list-item">
                <span>面包屑导航</span>
                <el-switch v-model="store.isBrearum" />
              </div>
              <div class="list-item">
                <span>标签栏</span>
                <el-switch v-model="store.tabbar" />
              </div>
              <div class="list-item">
                <span>页脚</span>
                <el-switch v-model="store.isFooter" />
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
    margin-right: 20px;
}

.layout-list {
    display: flex;
    justify-content:flex-start;
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
        background-color: var(--app-primary-strong);
        margin-right: 10px;
    }

    .layout-content {
        flex: 1;
        display: flex;
        flex-direction: column;

        .layout-header {
            width: 100%;
            height: 20px;
            background: var(--app-primary-soft);
            margin-bottom: 10px;
        }

        .layout-wrapper {
            flex: 1;
            background-color: var(--app-primary-soft);
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
}

.checked {
    color: var(--app-primary-strong)
}
</style>