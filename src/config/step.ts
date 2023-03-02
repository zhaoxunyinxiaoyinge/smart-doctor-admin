
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
            description: "open and close sidbar",
            position: 'bottom'
        }
    }
]

export default step;