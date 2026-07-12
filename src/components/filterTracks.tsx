function filterTracks(setFilter_val: any) {
    return(
        <div style={{display: 'flex', alignItems: 'center'}}>                    
            <input 
                id="filter" 
                type='text' 
                placeholder='Looking for something?' 
                style={{borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px',width: '250px', height: '40px', backgroundColor: 'rgb(90, 210, 216)', color: 'black', fontWeight: 'bolder'}}  
                onChange={(e) => {
                    let temp = e.target.value;

                    setFilter_val(temp);
                }} 
            />

            <button 
                style={{
                  backgroundColor: '#7a19e9', color: 'rgb(90, 210, 216)', width: '60px', height: '44px', padding: '0px 5px', 
                  borderTopRightRadius: '10px', borderBottomRightRadius: '10px', borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px'
                }} 
                onClick={() => {
                    setFilter_val('');

                    (document.getElementById('filter') as HTMLInputElement)!.value = '';
                }} 
            >
                Clear
            </button>                                    
        </div>
    );
};

export { filterTracks };