(function(){
  const btnToggle = document.querySelector('#btnToggle');
  const rightNav = document.querySelector('.right-nav');

  // button to top
  const btnToTop = document.querySelector('#toTop');

  btnToggle.addEventListener('click', ()=>{
    btnToggle.classList.toggle('active');
    rightNav.classList.toggle('active');
  })

  window.addEventListener('scroll', () => {
    if(window.innerHeight + window.scrollY > document.body.clientHeight - 100){
      btnToTop.style.display = "inline-block";
    }else{
      btnToTop.style.display = "none";
    }
  })

  btnToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
    })
  })
})();