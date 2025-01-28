import './ButtonScroll.css'

function scrollFunction(){
    let mybutton = document.getElementById('scrollButton')!
  
    if (document.body.scrollTop > 30 || document.documentElement.scrollTop > 30) {
      mybutton.style.display = "block";
    } else {
      mybutton.style.display = "none";
    }
  }
export default function ButtonScroll(){

    window.onscroll = function(){scrollFunction()}

    return(
        <button id="scrollButton" onClick={function handleClick(){
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
          }} >Top</button>
    )

}