<script lang="ts" setup>

</script>

<template>
  <div class="invoicMain" id="invoicMain">
    <div class="invoiceHeader">
      <div class="invoiceHeader-left">
        <ul class="headerLeft">
          <li>
            <img src="./qrcode.png" alt="">
          </li>
          <li>
            <label>机器编号：</label><span></span>
          </li>
        </ul>
        <div class="headerMiddle">
          <h1>XX增值税专用发票</h1>
          <div class="line"></div>
        </div>
      </div>

      <ul class="headerRight">
        <li>
          <label> 发票代码： </label><span></span>
        </li>
        <li>
          <label> 发票号码： </label><span></span>
        </li>
        <li>
          <label> 开票日期： </label><span>2021年02月23日</span>
        </li>
        <li>
          <label> 校&nbsp;&nbsp;验&nbsp;&nbsp;码： </label><span></span>
        </li>
      </ul>
    </div>
    <!-- head end -->
    <!-- invoice body start -->
    <div class="invoiceBody">
      <div class="userInfo">
        <div class="buy">购买方</div>
        <ul>
          <li>
            <label>名&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;称：</label><span></span>
          </li>
          <li>
            <label>纳税人识别号：</label><span></span>
          </li>
          <li>
            <label>地址、&nbsp;&nbsp;&nbsp;电话：</label><span></span>
          </li>
          <li>
            <label>开户行及账号：</label><span></span>
          </li>
        </ul>
        <div class="password">密码区</div>
        <div class="pwdInfo">aaa</div>
      </div>
      <div>
        <table class="GoodsTable" cellpadding="0" cellspacing="0">
          <tr>
            <td style="width: 24%">货物或应税劳务、服务名称</td>
            <td style="width: 10%">规格型号</td>
            <td style="width: 7%">单位</td>
            <td style="width: 10%">数量</td>
            <td style="width: 10%">单价</td>
            <td style="width: 16%">金额</td>
            <td style="width: 7%">税率</td>
            <td style="width: 16%; border-right: none;">税额</td>
          </tr>
          <tr class="invoice-list">
            <td>1</td>
            <td>2</td>
            <td>3</td>
            <td>4</td>
            <td>5</td>
            <td>6</td>
            <td>7</td>
            <td>8</td>
          </tr>
          <tr class="total">
            <td>合计</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr class="GoodsTotal">
            <td>价税合计(大写)</td>
            <td colspan="7">
              <div style="width: 100%;display:flex">
                <div type="text" style="width: 60%"></div>

                <div type="text" style="width: 30%"> (小写)</div>
              </div>
            </td>
          </tr>
        </table>
        <div class="userInfo">
          <div class="buy">购买方</div>
          <ul>
            <li>
              <label>名&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;称：</label><span></span>
            </li>
            <li>
              <label>纳税人识别号：</label><span></span>
            </li>
            <li>
              <label>地址、&nbsp;&nbsp;&nbsp;电话：</label><span></span>
            </li>
            <li>
              <label>开户行及账号：</label><span></span>
            </li>
          </ul>
          <div class="password">备注</div>
          <div class="pwdInfo">aaa</div>
        </div>
      </div>
    </div>
    <!-- invoice body start -->
    <ul class="invoicetFooter">
      <li>
        <label>收款人：</label>
      </li>
      <li>
        <label>复核：</label>
      </li>
      <li>
        <label>开票人：</label>
      </li>
      <li>
        <label>销售方：（章）</label>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
ul,
ul li {
  list-style: none;
  margin: 0;
  padding: 0;
}

label {
  color: #9c5223;
}

.invoicMain {
  width: 920px;
  margin: 0 auto;
  font-size: 14px;
  color: #000;
  padding: 20px;
  border: 3px solid #000;
}

.invoiceHeader {
  height: 126px;
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
}

.headerLeft li:nth-child(1) {
  text-indent: 1em;
}

.headerLeft li img {
  width: 105px;
  height: 105px;

}

.headerMiddle h1 {
  font-size: 32px;
  color: #9c5223;
  font-family: 'kaiti';
  margin: 5px 12px;
}

.line {
  height: 2px;
  border-top: #9c5223 1px solid;
  border-bottom: #9c5223 1px solid;
}

.headerRight li {
  line-height: 24px;
}

.invoiceBody {
  border: 1px solid #9c5223;
}

.userInfo {
  width: 100%;
  display: flex;
  align-items: center;
  height: 96px;
  border-bottom: 1px solid #9c5223;
}

.userInfo ul {
  width: 50%;
  margin: 0 5px;
  padding: 0;

}

.userInfo ul li {
  line-height: 24px;
}

.buy {
  width: 20px;
  border-right: 1px solid #9c5223;
  padding: 0 10px;
  text-align: center;
  height: 100%;
  display: flex;
  align-items: center;
  color: #9c5223;
}

.password {
  width: 20px;
  padding: 0 10px;
  border-right: 1px solid #9c5223;
  border-left: 1px solid #9c5223;
  text-align: center;
  height: 100%;
  display: flex;
  align-items: center;
  color: #9c5223;
}

.pwdInfo {
  flex: 1;
  padding-left: 5px;
}

.goodsInfo {
  height: 210px;
  margin: 0;
  padding: 0;

}

.goodsInfo li {
  display: flex;
  color: #9c5223;
  text-align: center;
}

.name {
  width: 260px;
  border-right: 1px solid #9c5223;
}

.spec {
  width: 140px;
  border-right: 1px solid #9c5223;
}

.qty {
  width: 108px;
  border-right: 1px solid #9c5223;
}

.unit,
.taxRate {
  width: 65px;
  border-right: 1px solid #9c5223;
}

.qty,
.price {
  width: 160px;
  border-right: 1px solid #9c5223;
}

.money {
  flex: 1;
  border-right: 1px solid #9c5223;
}

.taxAmount {
  flex: 1;
}

.GoodsTable {
  height: 210px;
  width: 100%;
  border-collapse: collapse;
}

.GoodsTable .invoice-list {
  /* height: 24px; */
}

.GoodsTable td {
  border-right: 1px solid #9c5223;
  color: #9c5223;
}

.GoodsTable tr:nth-child(1),
.GoodsTable tr:nth-last-child(2) {
  height: 24px;
}

.GoodsTable tr:nth-last-child(1) {
  height: 34px;
}

.GoodsTable tr:nth-child(1) td {
  text-align: center;
}

.GoodsTotal {
  border-top: 1px solid #9c5223;
  border-bottom: 1px solid #9c5223;
}

.total td:nth-child(1) {
  text-align: center;
}

.invoicetFooter {
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: space-between;
}

.invoicetFooter li {
  width: 25%;
}

.invoiceHeader-left {
  width: 67%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.headerRight {
  margin-left: 28px;
}

.headerMiddle {
  margin-right: 15px;
}</style>