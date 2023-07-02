<template>
  <el-scrollbar :height="content.routeContentHeight">
    <div class="card">
      <div class="card-item">
        <div class="card-title">
          <span>总销售额</span>
          <span class="iconfont">&#xe679;</span>
        </div>
        <div class="chengj">
          <span class="icon iconfont">&#xe634;</span>
          <span class="mount">126,560</span>
        </div>
        <div class="desc">日均销售额 ￥12,423</div>
        <div class="text">
          <span>周同比 12%</span>
          <span>日环比 12%</span>
        </div>
      </div>
      <div class="card-item">
        <div class="card-title">
          <span>访问量</span>
          <span class="iconfont">&#xe679;</span>
        </div>
        <div class="chengj"><span class="iconfont icon">&#xe674;</span><span class="mount">8,846</span></div>
        <div class="desc">日访问量 1,423</div>
        <div id="catgory"></div>
      </div>
      <div class="card-item">
        <div class="card-title">
          <span>支付笔数</span>
          <span class="iconfont">&#xe679;</span>
        </div>
        <div class="chengj"><span class="iconfont icon">&#xe610;</span><span class="mount">6,560</span></div>
        <div class="desc">转化率 60%</div>
        <div class="k" id="ke"></div>
      </div>
      <div class="card-item">
        <div class="card-title">
          <span>线上购物转化率</span>
          <span class="iconfont">&#xe679;</span>
        </div>
        <div class="chengj"><span class="iconfont icon">&#xe600;</span><span class="mount">60%</span></div>
        <div class="desc"><span>周同比 12%</span><span>日环比 24%</span></div>
        <div class="process">
          <div class="process-item"></div>
        </div>
      </div>
    </div>
    <div id="title">
      <div class="left">
        <span class="active">销售额</span>
        <span>访问量</span>
      </div>
      <div class="right">
        <span class="active">今日</span><span>本周</span><span>本月</span><span>全年</span>
        <el-input type="date"></el-input>
      </div>
    </div>
    <div id="zhu">
      <div id="tong">

      </div>
      <div class="list">
        <div class="list-title">
          <span>门店销售排行榜</span>
          <span class="more">查看更多</span>
        </div>
        <div class="list-item">
          <span>
            1
          </span>
          <div class="list-item-text">
            <span>公转路一号店</span>
            <span>323</span>
          </div>
        </div>
        <div class="list-item">
          <span>
            2
          </span>
          <div class="list-item-text">
            <span>公转路一号店</span>
            <span>323</span>
          </div>
        </div>
        <div class="list-item">
          <span>
            3
          </span>
          <div class="list-item-text">
            <span>公转路一号店</span>
            <span>323</span>
          </div>
        </div>
        <div class="list-item">
          <span>
            4
          </span>
          <div class="list-item-text">
            <span>公转路一号店</span>
            <span>323</span>
          </div>
        </div>
      </div>
    </div>
    <div class="hot">
      <div class="hot-item">
        <div class="hot-search">
          线上热门搜索
        </div>
        <div class="left-search-persion">
          <div class="search-user">
            <span class="search-title">搜索用户数</span>
            <div class="search-text">
              <span class="mount">22,560</span>
              <span class="week">本周<i class="percate">40%</i></span>
            </div>
          </div>
          <div class="search-mount">
            <span class="search-title">人均搜索次数</span>
            <div class="search-text">
              <span class="mount">2.7</span>
              <span class="week">本周<i class="percate red">40%</i></span>
            </div>
          </div>
        </div>
        <div class="bar">
          <div class="line-title">
            <span>新款连衣裙</span>
            <span>8,910</span>
          </div>
          <div class="process">
            <div class="kedu"></div>
          </div>
        </div>
        <div class="bar">
          <div class="line-title">
            <span>新款连衣裙</span>
            <span>8,910</span>
          </div>
          <div class="process">
            <div class="kedu"></div>
          </div>
        </div>
        <div class="bar">
          <div class="line-title">
            <span>新款连衣裙</span>
            <span>8,910</span>
          </div>
          <div class="process">
            <div class="kedu"></div>
          </div>
        </div>
        <div class="bar">
          <div class="line-title">
            <span>新款连衣裙</span>
            <span>8,910</span>
          </div>
          <div class="process">
            <div class="kedu"></div>
          </div>
        </div>
      </div>
      <div class="hot-item">
        <div class="sale">
          <span class="sale-title">销售额类别占比</span>
          <div class="pie-title">
            <span>全部渠道</span>
            <span class="active">线上</span>
            <span>门店</span>
          </div>
        </div>
        <div class="pie-content">
          <div class="pie-icon" id="pies">

          </div>
          <div class="product-list">
            <div class="product-list-item">
              <span><mark style="background:rgba(251, 73, 124, 1) ;"></mark>母婴产品</span>
              <span>38.57%</span>
            </div>
            <div class="product-list-item">
              <span><mark style="background: rgba(255, 199, 96, 1);"></mark>家用电器</span>
              <span>31.30%</span>
            </div>
            <div class="product-list-item">
              <span><mark style="background:rgba(111, 230, 33, 1) ;"></mark>食用酒水</span>
              <span>21.21%</span>
            </div>
            <div class="product-list-item">
              <span><mark style="background:rgba(79, 204, 255, 1) ;"></mark>个人健康</span>
              <span>10.91%</span>
            </div>
            <div class="product-list-item">
              <span><mark style="background: rgba(77, 123, 243, 1);"></mark>服饰箱包</span>
              <span>0.91%</span>
            </div>
            <div class="product-list-item">
              <span><mark style="background:rgba(29, 73, 153, 1) ;"></mark>其他</span>
              <span>0.21%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bin">
      <div class="pie-list">
        <div class="pie-list-item">
          <span>门店一</span>
          <div id="pieOne"></div>
        </div>
        <div class="pie-list-item">
          <span>门店二</span>
          <div id="pieTwo"></div>
        </div>
        <div class="pie-list-item">
          <span>门店三</span>
          <div id="pieThree"></div>
        </div>
        <div class="pie-list-item">
          <span>门店四</span>
          <div id="pieFour"></div>
        </div>
        <div class="pie-list-item">
          <span>门店五</span>
          <div id="pieFive"></div>
        </div>
        <div class="pie-list-item">
          <span>门店六</span>
          <div id="pieSix"></div>
        </div>
      </div>
      <div id="shop">
      </div>
    </div>
  </el-scrollbar>
</template>
<script lang="ts" setup>
import { onMounted, nextTick } from "vue";
import content from "@/assets/scss/layout.module.scss";
import * as echarts from 'echarts';
type EChartsOption = echarts.EChartsOption;
let chartDom;
let myChart;
let catgroyDom;
let myCatgory;
let myShop;
let shopChart;
let pieOne;
let pieTwo;
let pieThree;
let pieFive;
let pieSix;
let pieFour;

let oneChart;
let twoChart;
let threeChart;
let fourChart;
let fiveChart;
let sixChart;

let piesDom;
let piesChart;

let kDom;
let kChart;
onMounted(() => {
  chartDom = document.getElementById('tong')!;
  myChart = echarts.init(chartDom);
  catgroyDom = document.getElementById("catgory");
  myCatgory = echarts.init(catgroyDom);
  myShop = document.getElementById("shop");
  shopChart = echarts.init(myShop);

  pieOne = document.getElementById("pieOne");
  oneChart = echarts.init(pieOne);

  pieTwo = document.getElementById("pieTwo");
  twoChart = echarts.init(pieTwo);

  pieThree = document.getElementById("pieThree");
  threeChart = echarts.init(pieThree);

  pieFour = document.getElementById("pieFour");
  fourChart = echarts.init(pieFour);

  pieFive = document.getElementById("pieFive");
  fiveChart = echarts.init(pieFive);

  pieSix = document.getElementById("pieSix");
  sixChart = echarts.init(pieSix);

  piesDom = document.getElementById("pies");
  piesChart = echarts.init(piesDom);

  kDom = document.getElementById("ke");
  kChart = echarts.init(kDom);
})

let option: EChartsOption;
option = {
  title: {
    text: "销售额趋势"
  },
  grid:{
    left:"3%",
    right:0
  },
  xAxis: {
    type: 'category',
    data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      data: [10, 50, 100, 150, 10, 50, 100, 150, 20, 50, 100, 150],
      type: 'bar',
      showBackground: true,
      barWidth: 8,
      backgroundStyle: {
        color: "rgba(255, 255, 255, 1)"
      },
      itemStyle:{
        color:'rgba(182, 32, 224, 1)'
      }
    }
  ]
};

let options: EChartsOption = {
  grid:{
    left:0
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [

    {
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'line',
      areaStyle: {}
    }
  ]
};


let optionShop: EChartsOption = {
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [

    {
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'line',
      areaStyle: {}
    }
  ]
};



let optionPie: EChartsOption = {
  tooltip: {
    trigger: 'item'
  },

  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: ['50%', '70%'],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 40,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        {
          value: 1048, name: 'Search Engine', itemStyle: {
            color: "rgba(74, 232, 221, 1)"
          }
        },
        {
          value: 234, name: 'Direct', itemStyle: {
            color: "rgba(240, 240, 242, 1)"
          }
        },

      ]
    }
  ]
};

let optionPies: EChartsOption = {
  toolbox: {
    show: true,
    feature: {
      mark: { show: true },
      dataView: { show: true, readOnly: false },
      restore: { show: true },
      saveAsImage: { show: true }
    }
  },
  series: [
    {
      name: 'Nightingale Chart',
      type: 'pie',
      radius: [25, 160],
      center: ['50%', '50%'],
      roseType: 'area',
      label: {
        show: false
      },
      itemStyle: {
        borderRadius: 8
      },
      data: [
        { value: 40, },
        { value: 38, },
        { value: 32, },
        { value: 30, },
        { value: 28, },
        { value: 26, },
        { value: 22, },
        { value: 18, }
      ]
    }
  ]
};

let optionk: EChartsOption = {
  grid:{
    show:false,
    left:0,
    right:"20%",
    top:"0%",
    bottom:"0"
  },
  
  xAxis: {
    data: ['2017-10-24', '2017-10-25', '2017-10-26', '2017-10-27'],
  },
  yAxis: {
    show:false
  },
  series: [
    {
      type: 'candlestick',
      barWidth: "3",
      data: [
        [20, 34, 10, 38],
        [40, 35, 30, 50],
        [31, 38, 33, 44],
        [38, 15, 5, 42]
      ]
    }
  ]
};




nextTick(() => {
  myChart && option && myChart.setOption(option);
  myCatgory && options && myCatgory.setOption(options);
  myShop && options && shopChart.setOption(optionShop);

  pieOne && optionPie && oneChart.setOption(optionPie);

  pieTwo && optionPie && twoChart.setOption(optionPie);

  pieThree && optionPie && threeChart.setOption(optionPie);

  pieFour && optionPie && fourChart.setOption(optionPie);

  pieFive && optionPie && fiveChart.setOption(optionPie);

  pieSix && optionPie && sixChart.setOption(optionPie);

  piesDom && optionPies && piesChart.setOption(optionPies);

  kDom && optionk && kChart.setOption(optionk);
})

</script>

<style scoped  lang="scss">
// @use './../../assets/scss/layout'; 使用新的scss语法导入scss
#container {
  height: var(--height)+'px';
}

.card {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 30px;

  .card-item {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex: 1;
    height: 200px;
    background-color: #fff;
    margin-right: 30px;
    padding: 25px 25px 25px 30px;
  }
}

.process {
  margin-top: 34px;
  height: 7px;
  background-color: rgba(246, 246, 248, 1);
  width: 100%;
}

.process-item {
  height: 100%;
  width: 70%;
  background-color: rgba(74, 232, 221, 1);
}

.card-title {
  width: 100%;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: rgba(116, 121, 140, 1);
  margin-bottom: 18px;
}

#catgory {
  flex: 1;
  width: 100%;
}

#title {
  display: flex;
  padding: 0 30px;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  background-color: #fff;
  margin-bottom: 10px;
  font-size: 14px;
  color: rgba(155, 162, 171, 1);


  .left {
    color: rgba(155, 162, 171, 1);
    font-size: 14px;

    span {
      margin-right: 40px;
    }

    .active {
      color: rgba(0, 84, 254, 1);
      padding-bottom: 3px;
      border-bottom: 2px solid rgba(0, 84, 254, 1);
    }
  }

  .right {
    display: flex;

    span {
      display: inline-block;
      background-color: rgba(242, 242, 242, 1);
      padding: 5px;
      color: rgba(116, 121, 140, 1);
      margin-left: 8px;
      white-space: nowrap;
    }

    .active {
      background-color: rgba(0, 84, 254, 1);
      color: #fff;
    }

    .el-input {
      margin-left: 8px;
    }
  }

}

mark {
  display: inline-block;
  margin-right: 10px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

#zhu {
  box-sizing: border-box;
  height: 340px;
  padding: 24px 30px 29px;
  background-color: #fff;
  display: flex;

  #tong {
    flex: 1;
  }

  .list {
    width: 230px;
    margin-left: 44px;
  }

  .list-title {
    color: rgba(32, 37, 58, 1);
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 25px;
  }

  .list-item {
    display: flex;
    margin-bottom: 10px;
    align-items: center;
  }

  .list-item-text {
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 0 15px;
    width: 207px;
    background-color: rgba(248, 249, 251, 1);
    margin-left: 15px;
    border-radius: 5px;
    height: 38px;
    line-height: 38px;
    color: rgba(116, 121, 140, 1);
    font-size: 12px;
  }

  .more {
    font-size: 12px;
    color: rgba(4, 134, 254, 1);
  }
}

#ke {
  width: 100%;
  height: 31px;
  margin-top: 25px;
}

.hot {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

.hot-item {
  box-sizing: border-box;
  padding: 24px 30px 0 30px;
  height: 380px;
  background-color: #fff;
  width: 47%;

  .hot-search {
    color: rgba(32, 37, 58, 1);
    font-size: 14px;
    margin-bottom: 20px;
    text-align: left;
  }

  .left-search-persion {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .search-user,
  .search-mount {
    display: flex;
    flex-direction: column;
    width: 230px;
    height: 75px;
    background-color: rgba(248, 249, 251, 1);
    box-sizing: border-box;
    padding: 14px 20px;
  }

  .search-title {
    color: rgba(145, 145, 175, 1);
    font-size: 14px;
    margin-bottom: 2px;
    text-align: left;
  }

  .search-text {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .mount {
    color: rgba(33, 33, 69, 1);
    font-size: 18px;
  }

  .week {
    color: rgba(145, 145, 175, 1);
    font-size: 12px;
  }

  .percate {
    color: rgba(15, 178, 105, 1);
    font-size: 14px;
    font-style: normal;
  }

  .red {
    color: rgba(224, 85, 103, 1);
  }

  .sale {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 44px;
  }

  .sale-title {
    color: rgba(32, 37, 58, 1);
    font-size: 14px;
  }

  .pie-icon {
    flex: 1
  }

  .pie-title {
    display: flex;

    span {
      margin-left: 8px;
      color: rgba(116, 121, 140, 1);
      padding: 5px 10px;
      background-color: rgba(242, 242, 242, 1);
      font-size: 12px;
    }

    .active {
      background-color: rgba(0, 84, 254, 1);
      color: #fff;
    }
  }

  .pie-content {
    display: flex;
  }

  .product-list {
    width: 207px;
  }

  .product-list-item {
    height: 35px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;
    background-color: rgba(248, 249, 251, 1);
    color: rgba(116, 121, 140, 1);
    font-size: 12px;
    margin-bottom: 8px;
  }


}

.bar {
  height: 33px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 17px;

  .line-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    color: rgba(116, 121, 140, 1);
  }

  .process {
    margin-top: 0;
    height: 7px;
    background-color: rgba(246, 246, 248, 1);
  }

  .kedu {
    width: 70%;
    background-color: rgba(182, 32, 224, 1);
    height: 100%;
  }
}

.bin {
  display: flex;
  flex-direction: column;
  margin-top: 30px;
  height: 465px;
  background-color: #fff;
}

.icon {
  width: 32px;
  height: 32px;
  margin-right: 15px;
}

.desc {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: rgba(155, 162, 171, 1);
  margin-top: 10px;
}

.text {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: rgba(116, 121, 140, 1);
  margin-top: 24px;
}

.mount {
  font-size: 32px;
  color: rgba(40, 45, 48, 1);
  font-weight: 400;
}

.chengj {
  display: flex;
  align-items: center;
  line-height: 32px;
}

#shop {
  flex: 1;
  width: 100%;
  height: 100%;
}

.pie-list {
  display: flex;
  align-items: center;
  justify-content: space-evenly;

  .pie-list-item {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 162px;
    width: 183px;
    padding-top: 26px;

    span {
      font-size: 14px;
      color: rgba(122, 126, 135, 1);
      margin-bottom: 15px;
    }

    #pieOne,
    #pieTwo,
    #pieThree,
    #pieFour,
    #pieFive,
    #pieSix {
      height: 145px;
      width: 181px;
    }
  }
}
</style>
