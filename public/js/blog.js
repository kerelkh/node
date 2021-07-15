(function(){
  const btnToggle = document.querySelector('#btnToggle');
  const spanToggle = document.querySelectorAll('.btn-toggle-menu span');
  const rightNav = document.querySelector('.right-nav');
  const navBar = document.querySelector('.nav');
  const linkRight = document.querySelectorAll('.right-nav a');
  // button to top
  const btnToTop = document.querySelector('#toTop');

  btnToggle.addEventListener('click', ()=>{
    btnToggle.classList.toggle('active');
    rightNav.classList.toggle('active');
  })

  window.addEventListener('scroll', () => {
    if(window.scrollY > 500){
      navBar.classList.add('active-down');
      for(let i = 0; i < linkRight.length; i++){
      linkRight[i].classList.add('active-down');
      linkRight[i].style.color = "#030303";
      }
      for(let i = 0; i < spanToggle.length; i++){
        spanToggle[i].style.background = "#030303";
      }
      document.querySelector('.right-nav .link.active').style.borderBottom = "3px solid #030303";
      
    }else{
      navBar.classList.remove('active-down');
      for(let i = 0; i < linkRight.length; i++){
        linkRight[i].classList.remove('active-down');
        linkRight[i].style.color = "#fff";
      }
      for(let i = 0; i < spanToggle.length; i++){
        spanToggle[i].style.background = "#fff";
      }
      document.querySelector('.right-nav .link.active').style.borderBottom = "3px solid #fff";
    }
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