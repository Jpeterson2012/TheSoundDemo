import './ButtonScroll.css'

function scrollFunction(){
    let mybutton = document.getElementById('scrollButton')!
  
    if (document.body.scrollTop > 30 || document.documentElement.scrollTop > 30) {
      mybutton ? mybutton.style.display = "block" : null
    } else {
      mybutton ? mybutton.style.display = "none" : null
    }
  }
export default function ButtonScroll(){

    window.onscroll = function(){scrollFunction()}

    return(
        <button id="scrollButton" onClick={function handleClick(){
            window.scrollTo({ top: 0, behavior: "smooth" })
            // document.body.scrollTop = 0;
            // document.documentElement.scrollTop = 0;
          }} >^</button>
    )

}