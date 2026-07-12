import './ImageRender.css'

function subRender(ptracks: any, index: number, height: any, width: any) {
    return (
        <img 
            className="subsubRender" 
            style={{height: `${height/2}px`, width: `${width/2}px`, borderRadius: '15px 0px 0px 0px'}} 
            src={ptracks.tracks[index].images.length === 1 ? ptracks.tracks[index].images.map((s:any) => s.url) : ptracks.tracks[index].images.filter((t: any)=>t.height == 300).map((s: any) => s.url)}
        />
    );
};

function imageRender(ptracks: any, height:any, width:any, margin:any) {
    const style = {height: `${height}px`,width: `${width}px`, marginRight: `${margin}px`};

    if (!ptracks.images.length && ptracks.tracks.length > 3){
        return(
            <div className="mainRender" style={{height: `${height}px`,width: `${width}px`, marginRight: `${margin}px`}}>
                <div className="subRender">
                    {subRender(ptracks, 0, height, width)}

                    {subRender(ptracks, 1, height, width)}
                </div>
                <div className="subRender">
                    {subRender(ptracks, 2, height, width)}

                    {subRender(ptracks, 3, height, width)}
                </div>
            </div>
        );        
    }
    else if (!ptracks.images.length && ptracks.tracks.length <= 3) 
        return <img className="renderImage" style={style} alt={ptracks.name} src="https://images.inc.com/uploaded_files/image/1920x1080/getty_626660256_2000108620009280158_388846.jpg" />
    else if (ptracks.images.length === 1) 
        return <img className="renderImage" style={style} alt={ptracks.name} src={ptracks.images.map((s: any) => s.url)} />
    else 
        return <img className="renderImage" style={style} alt={ptracks.name} src={ptracks.images.filter((s: any) => s.height == 300).map((s: any) => s.url)}/>
};

export { imageRender };