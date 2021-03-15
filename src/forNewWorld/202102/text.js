export default class Test extends Component {
    componentDidMount() {
        const $parent = ReactDOM.findDOMNode(this);
        const $child = $parent.querySelector('.child');
        $parent.addEventListener('click', this.onParentDOMClick, false)
        $child.addEventListener('click', this.onChildDOMClick, false)
    }

    onParentDOMClick = evt => {
        console.log('parent dom event')
    }

    onChildDOMClick = evt => {
        console.log('child dom event')
    }

    onParentClick = evt => {
        console.log('parent react event')
    }

    onChildClick = evt => {
        evt.stopPropagation();
        console.log('child react event')
    }

    render() {
        return (
            <div onClick={this.onParentClick}>
                <div className="child" onClick={this.onChildClick}>
                    Demo
                </div>
            </div>
        )
    }
}
