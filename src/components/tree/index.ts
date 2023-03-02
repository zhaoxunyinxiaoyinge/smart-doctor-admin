import { number } from "echarts/core";

interface Tree {
    children?: Tree[],
    disabled?: boolean,
    title: string,
    id: number
}

interface DefualtProps {
    label: string,
    child: string
}

type fun=()=>({});

export type {
    Tree,
    DefualtProps,
    fun
}