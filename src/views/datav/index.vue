<script setup lang="ts" name="DataView">
import { reactive } from "vue";

const config = reactive({
  data: [
    {
      name: '南阳',
      value: 167
    },
    {
      name: '周口',
      value: 67
    },
    {
      name: '漯河',
      value: 123
    },
    {
      name: '郑州',
      value: 55
    },
    {
      name: '西峡',
      value: 98
    }
  ],
})

const mapConfig = reactive({
  centerPoint: [0.48, 0.35],
  points: [
    [0.52, 0.23],
    [0.43, 0.29],
    [0.59, 0.35],
    [0.53, 0.47],
    [0.45, 0.54],
    [0.36, 0.38],
    [0.62, 0.55],
    [0.56, 0.56],
    [0.37, 0.66],
    [0.55, 0.81],
    [0.55, 0.67],
    [0.37, 0.29],
    [0.20, 0.36],
    [0.76, 0.41],
    [0.59, 0.18],
    [0.68, 0.17],
    [0.59, 0.10]
  ],
  bgImgUrl: 'http://datav.jiaminghi.com/img/flylineChart/map.jpg'
})

const option = reactive({
  title: {
    text: '剩余油量表',
    style: {
      fill: '#fff'
    }
  },
  series: [
    {
      type: 'gauge',
      data: [{ name: 'itemA', value: 55 }],
      center: ['50%', '55%'],
      axisLabel: {
        formatter: '{value}%',
        style: {
          fill: '#fff'
        }
      },
      axisTick: {
        style: {
          stroke: '#fff'
        }
      },
      animationCurve: 'easeInOutBack'
    }
  ]
})

</script>

<template>
  <div class="box">
    <div class="box-list">
      <div class="box-item">
        <dv-border-box-9 class="center">
          <dv-capsule-chart :config="config" style="width:70%;height:70%;margin: 30px auto;" />
        </dv-border-box-9>
      </div>
      <div class="box-item">
        <dv-border-box-11 class="center" title="数据可视化">
          <dv-active-ring-chart :config="config" style="width:70%;height:70%;margin: 30px auto;" />
        </dv-border-box-11>
      </div>
      <div class="box-item">
        <dv-border-box-10>
          <dv-water-level-pond :config="{ data: [22] }" style="width:70%;height:70%;margin: 30px auto;" />
        </dv-border-box-10>
      </div>
    </div>
    <div class="box-list">
      <div class="box-item colspan">
        <dv-border-box-13 class="center">
          <dv-flyline-chart :config="mapConfig" style="width:100%;height:100%; " />
        </dv-border-box-13>
      </div>
    </div>
    <div class="box-list">
      <div class="box-item">
        <dv-border-box-5 class="center">
          <dv-percent-pond :config="{ value: 66 }" style="width:70%;height:70%;margin: 30px auto;" />
        </dv-border-box-5>
      </div>
      <div class="box-item">
        <dv-border-box-6 class="center"><dv-charts :option="option"
            style="width:70%;height:70%;margin: 30px auto;" /></dv-border-box-6>
      </div>
      <div class="box-item">
        <dv-border-box-9 class="center"><dv-scroll-ranking-board :config="config"
            style="width:70%;height:70%;margin: 30px auto;" /></dv-border-box-9>
      </div>
    </div>
  </div>
</template>

<sstyle lang="scss">
.box {
  display: flex;
  flex-direction: column;
  color: #fff;
  height: 100%;
  background-color: rgba(4, 20, 46, 0.847);

  .box-list {
    display: flex;
    flex: 1;
    justify-content: space-evenly;
    min-height: 33.33%;

    .box-item {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;

      .center {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 240px;
      }
    }
  }
}
</sstyle>