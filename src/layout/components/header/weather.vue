<script setup lang="ts">
  import {getWeather} from "@/api/index";
import { ElMessage } from 'element-plus';
  const weather=ref({weather1:"",weather2:"",temperature:"",place:""});
  const weatherIconList=new Map();
  weatherIconList.set("晴", "https://img.icons8.com/?size=50&id=1MUqfGWx3fZS&format=png&color=000000");
  weatherIconList.set("多云", "https://img.icons8.com/?size=30&id=8cDNraQqdlD2&format=png&color=000000");
  weatherIconList.set("阴", "https://img.icons8.com/?size=30&id=8cDNraQqdlD2&format=png&color=000000"); 
  weatherIconList.set("小雨", "https://img.icons8.com/?size=30&id=8cDNraQqdlD2&format=png&color=000000");
  weatherIconList.set("中雨", "https://img.icons8.com/?size=30&id=8cDNraQqdlD2&format=png&color=000000");
  const getWeatherData=async()=>{
    const res=await getWeather({
      id:88888888,
      key:88888888,
      sheng:"广东",
      place:"深圳"
      });
    if(res.data.code===200){
      weather.value={
        temperature:res.data.temperature,
        weather2:res.data.weather2,
        weather1:res.data.weather1,
        place:res.data.place
      };
    }else{
      ElMessage.error("获取天气数据失败，请稍后重试！");
    }
  }

  onMounted(()=>{
    getWeatherData();
  })
</script>
<template>
  <div class="weather"> 
    <div class="weather__icon">
      <img
        :src="weatherIconList.get(weather.weather2)"
        alt="weather icon"
        width="40"
        height="40"
      >
    </div>
    <div class="weather__info">
      <div class="weather__info--temp">
        {{ weather.temperature }}°C
      </div>
      <div class="weather__info--desc">
        {{ weather.weather2 }} / {{ weather.weather1 }}
      </div>
    </div>
    <div class="weather__place">
      <span>{{ weather.place.split(",").join("/") }}</span>
    </div>
  </div>
</template>
<style scoped lang="scss">
.weather {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 14px;
  color: #333;
  margin-right: 20px;
  &__icon {
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;

  }

  &__info {
    display: flex;
    flex-direction: column;
    align-items: center;

    &--temp {
      font-size: 12px;
      font-weight: bold;
    }

    &--desc {
      font-size: 12px;
      color: #666;
    }
  }

  &__place {
    font-size: 12px;
    font-weight: bolder;
    color: #0f0e0e;
    margin-left: 10px;
  }
}
</style>