function filterTracks(setFilter_val: any){

    return(
        <div style={{display: 'flex',marginRight: '100%', alignItems: 'center'}}>                    
            <input id="filter" type='text' placeholder='Looking for something?' style={{borderRadius: '13px',width: '170px', height: '40px', backgroundColor: 'rgb(90, 210, 216)', color: 'black', fontWeight: 'bolder'}}  onChange={function handleChange(e){
              let temp = e.target.value
              setFilter_val(temp)
            }} />
            <button style={{backgroundColor: '#7a19e9', color: 'rgb(90, 210, 216)', width: '60px', height: '40px', padding: '0px 5px'}} onClick={function handleClick(){
                setFilter_val('');          
                (document.getElementById('filter') as HTMLInputElement)!.value = ''
            }} >Clear</button>                                    
        </div>
    )
}
export { filterTracks }