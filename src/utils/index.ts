import { VueElement } from "vue";

const showImage = {
   mounted(el: Element, binding: { instance: VueElement }, vnode: Node, prevVnode: Node) {
      console.log(el,binding,vnode,prevVnode);
   }
}


export {
   showImage
}