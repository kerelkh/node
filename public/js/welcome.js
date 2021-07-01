(function(){
  const btnToggle = document.querySelector('#btnToggle');
  const rightNav = document.querySelector('.right-nav');

  btnToggle.addEventListener('click', ()=>{
    btnToggle.classList.toggle('active');
    rightNav.classList.toggle('active');
  })
})();