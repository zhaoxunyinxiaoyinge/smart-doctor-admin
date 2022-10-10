
import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer';
import {config} from "../mock";
console.log(config,"config")


export function setupProdMockServer() {
    createProdMockServer(config)
  }