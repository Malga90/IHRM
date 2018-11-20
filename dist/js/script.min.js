// Sticky navigation

const nav = document.querySelector('.navigation');
const navTop = nav.offsetTop;

function stickyNavigation() {
    // console.log('navTop = ' + navTop);
    // console.log('scrollY = ' + window.scrollY);

    if  (window.scrollY >= navTop) {
        document.body.style.paddingTop = nav.OffsetHeight + 'px';
        document.body.classList.add('fixed-nav');
    } else {
        document.body.style.paddingTop = navOffsetHeight + 'px';
        document.body.classList.remove('fixed-nav');
    }
}

window.addEventListener('scroll', stickyNavigation);


// Scroll Spy

const handleView = item => {
    const linkEl = document.querySelector(`#link-${item}`);
      
    let offsetHeight = 0.6*(window.innerHeight)
    inView.offset({
      bottom:offsetHeight
    });
    
    inView(`#${item}`)
      .on("enter", () => linkEl.classList.add('is-active'))
      .on("exit", el  => linkEl.classList.remove('is-active'))
  };
  
  // Apply method on each DOM element 
  ["one", "two", "three", "four", "five", "six"].forEach(handleView);


