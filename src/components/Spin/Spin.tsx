import './Spin.css'

function randColor(){
    return "#" + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, "0")
}
let color1 = 'hsla(' + (Math.random() * 360) + ', 100%, 50%, 1)'
let color2 = "#" + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, "0")
let color3 = "#" + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, "0")

function isLight(color:any) {
    // Convert hex color to RGB values
    const r = parseInt(color.substr(1, 2), 16);
    const g = parseInt(color.substr(3, 2), 16);
    const b = parseInt(color.substr(5, 2), 16);
  
    // Calculate luminance using the relative luminance formula
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  
    // Return true if light, false if dark
    return luminance > 127.5;
  }


//Found is a bool val that checks if the album/playlist has a cover image
//If it does found is null and img is an image url passed in, else img = "" and found is a custom div comprised of images
function Spin(is_active:any, is_paused:any,img:any, found:any){
    

    let temp = (() => {
        if (found) return <div className='svgImage' >{found}</div>
        else return <img className='svgImage' src={img} />
    })
    
    return (
        <div className='svgContainer'>
        {temp()}
        <svg id='svg1' viewBox="0 0 400 400">
              <g id="record"  style={!is_active ? {animationPlayState: 'paused'} :  is_paused ? {animationPlayState: 'paused'} : ({animationPlayState: 'running'})}>
              <circle r="200" cx="200" cy="200" />
              <circle className="line1" r="180" cx="200" cy="200" />
              <circle className="line2" r="160" cx="200" cy="200" />
              <circle className="line3" r="140" cx="200" cy="200" />
              <circle id="label" cx="200" cy="200" r="100" style={{fill: color2}}/>
              <text className="writing" y="160" x="165" style={isLight(color2) ? {fill: 'black'} : {fill: 'white'} } >TheSound</text>  
              <text className="writing" y="230" x="115" textLength="170" lengthAdjust="spacing" style={isLight(color2) ? {fill: 'black'} : {fill: 'white'} }>{sessionStorage.getItem("name") ? (sessionStorage.getItem("name")!.length > 49 ? (sessionStorage.getItem("name")!.substring(0,25) + "...") : sessionStorage.getItem("name")) : null}</text>    
              <circle id="dot" cx="200" cy="200" r="6" />
              </g>
            </svg>
        </div>
    )
}
function Spin2(is_active:any, is_paused:any){
    //Spin for footer bar
    return (
        <>
        <svg id='svg2' viewBox="0 0 400 400">
              <g id="record2"  style={!is_active ? {animationPlayState: 'paused'} :  is_paused ? {animationPlayState: 'paused'} : ({animationPlayState: 'running'})}>
              <circle r="200" cx="200" cy="200" />
              <circle className="line7" r="180" cx="200" cy="200" style={{fill: color3}}/>
              <circle className="line8" r="160" cx="200" cy="200" />
              <circle className="line9" r="140" cx="200" cy="200" />
              <circle id="label2" cx="200" cy="200" r="100" style={{fill: color3}}/>
              <text className="writing" y="160" x="165" style={isLight(color3) ? {fill: 'black'} : {fill: 'white'} }>TheSound</text>  
              <text className="writing" y="230" x="115" textLength="170" lengthAdjust="spacing" style={isLight(color3) ? {fill: 'black'} : {fill: 'white'} }>TheSound</text>    
              <circle id="dot" cx="200" cy="200" r="6" />
              </g>
            </svg>
        </>
    )
}

function Spin3(){
    //Spin for loading screen
    return (
        <>
        <svg id='svg3' viewBox="0 0 400 400">
              <g id="record3" style={{animationPlayState: 'running'}}>
              <circle r="200" cx="200" cy="200" />
              <circle className="line4" r="180" cx="200" cy="200" />
              <circle className="line5" r="160" cx="200" cy="200" />
              <circle className="line6" r="140" cx="200" cy="200" />
              <circle id="label2" cx="200" cy="200" r="100" style={{fill: '#d093e5'}}/>
              <text className="writing" y="160" x="165">TheSound</text>  
              <text className="writing" y="230" x="115" textLength="170" lengthAdjust="spacing" >Loading...</text>    
              <circle id="dot" cx="200" cy="200" r="6" />
              </g>
            </svg>
        </>
    )
}

export{ Spin,Spin2,Spin3 }