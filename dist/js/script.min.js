// Sticky navigation

const nav = document.querySelector('.navigation');
const navTop = nav.offsetTop;

function stickyNavigation() {
    if  (window.scrollY >= navTop) {
        document.body.style.paddingTop = nav.OffsetHeight + 'px';
        document.body.classList.add('fixed-nav');
    } else {
        document.body.style.paddingTop = navOffsetHeight + 'px';
        document.body.classList.remove('fixed-nav');
    }
}

window.addEventListener('scroll', stickyNavigation);

// Slider





