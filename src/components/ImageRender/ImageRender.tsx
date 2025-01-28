import './ImageRender.css'


function imageRender(ptracks: any, height:any,width:any,margin:any){
    if (ptracks.images.length === 0 && ptracks.tracks.length > 3){
        return(
            <div className="mainRender" style={{height: `${height}px`,width: `${width}px`, marginRight: `${margin}px`}}>
                <div className="subRender" >
                    <img className="subsubRender" style={{height: `${height/2}px`, width: `${width/2}px`, borderRadius: '15px 0px 0px 0px'}} src={ptracks.tracks[0].images.length === 1 ? ptracks.tracks[0].images.map((s:any) => s.url) : ptracks.tracks[0].images.filter((t: any)=>t.height == 300).map((s: any) => s.url)}/>
                    <img className="subsubRender" style={{height: `${height/2}px`, width: `${width/2}px`, borderRadius: '0px 15px 0px 0px'}} src={ptracks.tracks[1].images.length === 1 ? ptracks.tracks[0].images.map((s:any) => s.url) : ptracks.tracks[1].images.filter((t: any)=>t.height == 300).map((s: any) => s.url)}/>
                </div>
                <div className="subRender" >
                    <img className="subsubRender" style={{height: `${height/2}px`, width: `${width/2}px`, borderRadius: '0px 0px 0px 15px'}} src={ptracks.tracks[0].images.length === 1 ? ptracks.tracks[2].images.map((s:any) => s.url) : ptracks.tracks[2].images.filter((t: any)=>t.height == 300).map((s: any) => s.url)}/>
                    <img className="subsubRender" style={{height: `${height/2}px`, width: `${width/2}px`, borderRadius: '0px 0px 15px 0px'}} src={ptracks.tracks[0].images.length === 1 ? ptracks.tracks[3].images.map((s:any) => s.url) : ptracks.tracks[3].images.filter((t: any)=>t.height == 300).map((s: any) => s.url)}/>
                </div>
            </div>
        )        
    }
    else if (ptracks.images.length === 0 && ptracks.tracks.length <= 3) return <img className="renderImage" style={{height: `${height}px`,width: `${width}px`, marginRight: `${margin}px`}} alt={ptracks.name} src="https://images.inc.com/uploaded_files/image/1920x1080/getty_626660256_2000108620009280158_388846.jpg" />
    else if (ptracks.images.length === 1) return <img className="renderImage" style={{height: `${height}px`,width: `${width}px`, marginRight: `${margin}px`}} alt={ptracks.name} src={ptracks.images.map((s: any) => s.url)} />
    else return <img className="renderImage" style={{height: `${height}px`,width: `${width}px`, marginRight: `${margin}px`}} alt={ptracks.name} src={ptracks.images.filter((s: any) => s.height == 300).map((s: any) => s.url)} />



}

export { imageRender }