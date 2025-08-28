
type Step = {
    element: string,
    popover: {
        className:string,
        title: string,
        description: string,
        position: string
    }
}

const step: Step[] = [
    {
        element: "#hamburger-container",
        popover: {
            className:"hamburger-container",
            title: "面包屑导航菜单",
            description: "点击面包导航，指向导航标签",
            position: 'bottom'
        }
    },
        {
        element: "#hamburger-collapse",
        popover: {
            className:"hamburger-collapse",
            title: "展开和收缩按钮",
            description: "点击左侧菜单栏会展开和收缩",
            position: 'bottom'
        }
    }
]

export default step;