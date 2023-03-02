import { mount} from '@vue/test-utils'
import { expect, test } from 'vitest';
import Hello from "@/components/Hello.vue";
test('mount component',() => {
   let app= mount(Hello);
  console.log(app.text())
})