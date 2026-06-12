
interface Tree {
    children?: Tree[],
    disabled?: boolean,
    title: string,
    id: number
}

interface DefualtProps {
    label: string,
    child: string,
    disabled: string,
    class: string,
    isLeaf: string
}

type fun=()=>({});

export type {
    Tree,
    DefualtProps,
    fun
}