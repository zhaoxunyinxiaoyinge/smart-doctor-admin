<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';

const dragDiv = ref(null);
const moveDiv = ref(null);

const draggerMsg = reactive({
  confirmWords: "请拖动图标",//滑动的提示文字
  confirmSuccess: false,//滑动是否完整
  beginClientX: 0,
  maxwidth: 0,
  mouseMoveStata: false
})

onMounted(() => {
  draggerMsg.maxwidth = (dragDiv.value as unknown as HTMLDivElement).clientWidth - (moveDiv.value as unknown as HTMLDivElement).clientWidth;
  (moveDiv.value as unknown as HTMLDivElement).addEventListener("mousemove", mousemove);
  (moveDiv.value as unknown as HTMLDivElement).addEventListener("mouseup", mouseup);
  (moveDiv.value as unknown as HTMLDivElement).addEventListener("mouseleave", mouseleave);
})


const mousedownFn = (e) => {
  if (!draggerMsg.confirmSuccess) {
    (moveDiv.value as unknown as HTMLDivElement).addEventListener("mousemove", mousemove);
    e.preventDefault && e.preventDefault()   //阻止文字选中等 浏览器默认事件
    draggerMsg.mouseMoveStata = true;
    draggerMsg.beginClientX = e.clientX;
    (document.querySelector('.drag_bg') as HTMLDivElement).style.backgroundColor = "#7ac23c";
  }
}

const mouseup = (e) => {
  draggerMsg.mouseMoveStata = false
  var width = e.clientX - draggerMsg.beginClientX
  if (width < draggerMsg.maxwidth) {
    (document.getElementsByClassName('handler')[0] as HTMLDivElement).style.left = width + 'px';
    (document.getElementsByClassName('drag_bg')[0] as HTMLDivElement).style.width = width + 'px';
    draggerMsg.confirmWords='验证失败';
    (document.querySelector('.drag_text') as HTMLDivElement).style.color = "#fff";
    (document.querySelector('.drag_bg') as HTMLDivElement).style.backgroundColor = "red";
  }
};



const mousemove = (e) => {
  if (draggerMsg.mouseMoveStata) {
    let width = e.clientX - draggerMsg.beginClientX
    if (width > 0 && width <= draggerMsg.maxwidth) {
      (document.getElementsByClassName('handler')[0] as HTMLDivElement).style.left = width + 'px';
      (document.getElementsByClassName('drag_bg')[0] as HTMLDivElement).style.width = width + 'px';
    } else if (width >= draggerMsg.maxwidth) successFunction()
  }
};


const mouseleave=(e)=>{
  (moveDiv.value as unknown as HTMLDivElement).removeEventListener("mousemove", mousemove);
  if(!draggerMsg.confirmSuccess ){
    (document.querySelector('.drag_bg') as HTMLDivElement).style.backgroundColor = "red";
  }

}

const successFunction = () => {
  draggerMsg.confirmSuccess = true
  draggerMsg.confirmWords = '验证通过';
  (moveDiv.value as unknown as HTMLDivElement).removeEventListener("mousemove", mousemove);
  (moveDiv.value as unknown as HTMLDivElement).removeEventListener("mouseup", mouseup);
  (moveDiv.value as unknown as HTMLDivElement).removeEventListener("mousedown", mousedownFn);
  (document.querySelector('.drag_text') as HTMLDivElement).style.color = "#fff";
  (document.querySelector('.drag_bg') as HTMLDivElement).style.backgroundColor = "#7ac23c";
  (document.querySelector('.handler') as HTMLDivElement).style.left = draggerMsg.maxwidth + 'px';
  (document.querySelector('.drag_bg') as HTMLDivElement).style.width = draggerMsg.maxwidth + 'px'
}


</script>

<template>
  <div
    ref="dragDiv"
    class="drag"
  >
    <div class="drag_bg" />
    <div class="drag_text f14">
      {{ draggerMsg.confirmWords }}
    </div>
    <!-- 移动的模块 -->
    <div
      ref="moveDiv"
      :class="{ 'handler_ok_bg': draggerMsg.confirmSuccess }"
      class="handler handler_bg"
      @mousedown.self="mousedownFn($event)"
    />
  </div>
</template>

<style lang="scss">
.drag {
  position: relative;
  background-color: #e8e8e8;
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: center;
}

.handler {
  width: 40px;
  height: 40px;
  border: 1px solid #ccc;
  cursor: move;
  position: absolute;
  top: 0px;
  left: 0px;
}

.handler_bg {
  background: #fff url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0ZDhlNWY5My05NmI0LTRlNWQtOGFjYi03ZTY4OGYyMTU2ZTYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NTEyNTVEMURGMkVFMTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NTEyNTVEMUNGMkVFMTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2MTc5NzNmZS02OTQxLTQyOTYtYTIwNi02NDI2YTNkOWU5YmUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NGQ4ZTVmOTMtOTZiNC00ZTVkLThhY2ItN2U2ODhmMjE1NmU2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+YiRG4AAAALFJREFUeNpi/P//PwMlgImBQkA9A+bOnfsIiBOxKcInh+yCaCDuByoswaIOpxwjciACFegBqZ1AvBSIS5OTk/8TkmNEjwWgQiUgtQuIjwAxUF3yX3xyGIEIFLwHpKyAWB+I1xGSwxULIGf9A7mQkBwTlhBXAFLHgPgqEAcTkmNCU6AL9d8WII4HOvk3ITkWJAXWUMlOoGQHmsE45ViQ2KuBuASoYC4Wf+OUYxz6mQkgwAAN9mIrUReCXgAAAABJRU5ErkJggg==") no-repeat center;
}

.handler_ok_bg {
  background: #fff url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0ZDhlNWY5My05NmI0LTRlNWQtOGFjYi03ZTY4OGYyMTU2ZTYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDlBRDI3NjVGMkQ2MTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDlBRDI3NjRGMkQ2MTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDphNWEzMWNhMC1hYmViLTQxNWEtYTEwZS04Y2U5NzRlN2Q4YTEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NGQ4ZTVmOTMtOTZiNC00ZTVkLThhY2ItN2U2ODhmMjE1NmU2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+k+sHwwAAASZJREFUeNpi/P//PwMyKD8uZw+kUoDYEYgloMIvgHg/EM/ptHx0EFk9I8wAoEZ+IDUPiIMY8IN1QJwENOgj3ACo5gNAbMBAHLgAxA4gQ5igAnNJ0MwAVTsX7IKyY7L2UNuJAf+AmAmJ78AEDTBiwGYg5gbifCSxFCZoaBMCy4A4GOjnH0D6DpK4IxNSVIHAfSDOAeLraJrjgJp/AwPbHMhejiQnwYRmUzNQ4VQgDQqXK0ia/0I17wJiPmQNTNBEAgMlQIWiQA2vgWw7QppBekGxsAjIiEUSBNnsBDWEAY9mEFgMMgBk00E0iZtA7AHEctDQ58MRuA6wlLgGFMoMpIG1QFeGwAIxGZo8GUhIysmwQGSAZgwHaEZhICIzOaBkJkqyM0CAAQDGx279Jf50AAAAAABJRU5ErkJggg==") no-repeat center;
}

.drag_bg {
  background-color: #7ac23c;
  height: 40px;
  width: 0px;
}

.drag_text {
  position: absolute;
  top: 0px;
  width: 100%;
  text-align: center;
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
  -o-user-select: none;
  -ms-user-select: none;
}
</style>