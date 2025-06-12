export default function Die(props){
    return (
        <button 
            style={{backgroundColor: props.isHeld?"#59e391":"white"}}
            onClick={props.hold}
        >{props.value}</button>
    )
}