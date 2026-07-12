import './ButtonScroll.css'

function scrollFunction() {
  let mybutton = document.getElementById('scrollButton')!

  if (document.body.scrollTop > 30 || document.documentElement.scrollTop > 30) {
    if (mybutton) mybutton.style.display = "block";
  } else {
    if (mybutton) mybutton.style.display = "none";
  }
}
export default function ButtonScroll() {
  window.onscroll = () => {scrollFunction()};
  
  return(
    <button 
      id="scrollButton" 
      onClick={() => {window.scrollTo({ top: 0, behavior: "smooth" });}} 
    >
      ^
    </button>
  );
}