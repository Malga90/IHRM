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

const Slider = function(elemSelector, opts) {
    const defaultOpts = {
        pauseTime : 0,
        prevText : "Poprzedni slide",
        nextText : "Następny slide",
        generateDots : true,
        generatePrevNext : true
    };
    this.options = Object.assign({}, defaultOpts, opts);
    this.sliderSelector = elemSelector;
    this.currentSlide = 0; 
    this.time = null; 
    this.slider = null;
    this.elem = null;
    this.slides = null;

    this.prev = null;  
    this.next = null; 
    this.dots = [];

    this.generateSlider();
    this.changeSlide(this.currentSlide);
}

Slider.prototype.generateSlider = function() {
    
    this.slider = document.querySelector(this.sliderSelector);
    this.slider.classList.add('slider');

    const slidesCnt = document.createElement('div');
    slidesCnt.classList.add('slider-slides-cnt');

    this.slides = this.slider.children;

    while (this.slides.length) {
        this.slides[0].classList.add('slider-slide');
        slidesCnt.appendChild(this.slides[0]);
    }
    this.slides = slidesCnt.querySelectorAll('.slider-slide');
    this.slider.appendChild(slidesCnt);

    if (this.options.generatePrevNext) this.createPrevNext();
    if (this.options.generateDots) this.createDots();
}

Slider.prototype.slidePrev = function() {
    this.currentSlide--;
    if (this.currentSlide < 0) {
        this.currentSlide = this.slides.length - 1;
    }
    this.changeSlide(this.currentSlide);
}

Slider.prototype.slideNext = function() {
    this.currentSlide++;
    if (this.currentSlide > this.slides.length - 1) {
        this.currentSlide = 0;
    }
    this.changeSlide(this.currentSlide);
}

Slider.prototype.changeSlide = function(index) {
    [].forEach.call(this.slides, function(slide) {
        slide.classList.remove('slider-slide-active');
        slide.setAttribute('aria-hidden', true);
    });

    
    this.slides[index].classList.add('slider-slide-active');
    this.slides[index].setAttribute('aria-hidden', false);

    if (this.options.generateDots) {
        this.dots.forEach(function(dot) {
            dot.classList.remove('slider-dots-element-active');
        });
        this.dots[index].classList.add('slider-dots-element-active');
    }

    
    this.currentSlide = index;

    if (this.options.pauseTime !== 0) {
        clearInterval(this.time);
        this.time = setTimeout(function() {
            this.slideNext();
        }.bind(this), this.options.pauseTime)
    }
}

Slider.prototype.createPrevNext = function() {
    this.prev = document.createElement('button');
    this.prev.type = "button";
    this.prev.innerText = this.options.prevText;
    this.prev.classList.add('slider-button');
    this.prev.classList.add('slider-button-prev');
    this.prev.classList.add('icon');
    this.prev.classList.add('ion-md-arrow-round-back');
    this.prev.addEventListener('click', this.slidePrev.bind(this));

    this.next = document.createElement('button');
    this.next.type = "button";
    this.next.innerText = this.options.nextText;
    this.next.classList.add('slider-button');
    this.next.classList.add('slider-button-next');
    this.next.classList.add('icon');
    this.next.classList.add('ion-md-arrow-round-forward');
    this.next.addEventListener('click', this.slideNext.bind(this));

    const nav = document.createElement('div');
    nav.classList.add('slider-nav');
    nav.setAttribute('aria-label', 'Slider prev next');
    nav.appendChild(this.prev);
    nav.appendChild(this.next);
    this.slider.appendChild(nav);
}

Slider.prototype.createDots = function() {
    const ulDots = document.createElement('ul');
    ulDots.classList.add('slider-dots');
    ulDots.setAttribute('aria-label', 'Slider pagination');

    for (let i=0; i<this.slides.length; i++) {
        
        const li = document.createElement('li');
        li.classList.add('slider-dots-element');

        const btn = document.createElement('button');
        btn.classList.add('slider-dots-button');
        btn.type = "button";
        btn.innerText = i+1;
        btn.setAttribute('aria-label', 'Set slide '+(i+1));

        btn.addEventListener('click', function() {
            this.changeSlide(i);
        }.bind(this));

        li.appendChild(btn);

        ulDots.appendChild(li);
        this.dots.push(li);
    }

    this.slider.appendChild(ulDots);
}

const slide = new Slider('#slider', {
    pauseTime : 10000,
    generateDots : true,
    generatePrevNext : true,
    prevText : "Poprzedni",
    nextText : "Następny"
});





// Form validation 

{
    const form = document.querySelector('#contactForm');
    const inputs = form.querySelectorAll('input[required], textarea[required]');

    //wyłączamy domyślną walidację
    form.setAttribute('novalidate', true);

    const displayFieldError = function(elem) {
        const fieldRow = elem.closest('.form-row');
        const fieldError = fieldRow.querySelector('.field-error');
        if (fieldError === null) {
            const errorText = elem.dataset.error;
            const divError = document.createElement('div');
            divError.classList.add('field-error');
            divError.innerText = errorText;
            fieldRow.appendChild(divError);
        }
    };

    const hideFieldError = function(elem) {
        const fieldRow = elem.closest('.form-row');
        const fieldError = fieldRow.querySelector('.field-error');
        if (fieldError !== null) {
            fieldError.remove();
        }
    };

    [...inputs].forEach(elem => {
        elem.addEventListener('input', function() {
            if (!this.checkValidity()) {
                this.classList.add('error');
            } else {
                this.classList.remove('error');
                hideFieldError(this);
            }
        });


    });

    const checkFieldsErrors = function(elements) {
        //ustawiamy zmienną na true. Następnie robimy pętlę po wszystkich polach
        //jeżeli któreś z pól jest błędne, przełączamy zmienną na false.
        let fieldsAreValid = true;

        [...elements].forEach(elem => {
            if (elem.checkValidity()) {
                hideFieldError(elem);
                elem.classList.remove('error');
            } else {
                displayFieldError(elem);
                elem.classList.add('error');
                fieldsAreValid = false;
            }
        });

        return fieldsAreValid;
    };

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        //jeżeli wszystkie pola są poprawne...
        if (checkFieldsErrors(inputs)) {
            const elements = form.querySelectorAll('input:not(:disabled), textarea:not(:disabled)');

            const dataToSend = new FormData();
            [...elements].forEach(el => dataToSend.append(el.name, el.value));

            const url = form.getAttribute('action');
            const method = form.getAttribute('method');

            const submit = form.querySelector('[type="submit"]');
            submit.disabled = true;
            submit.classList.add('element-is-busy');

            fetch(url, {
                method: method.toUpperCase(),
                body: dataToSend
            })
            .then(ret => ret.json())
            .then(ret => {
                submit.disabled = false;
                submit.classList.remove('element-is-busy');

                if (ret.errors) {
                    ret.errors.map(function(el) {
                        return '[name="'+el+'"]'
                    });
                    const selector = ret.errors.join(',');
                    checkFieldsErrors(form.querySelectorAll(sekector));

                } else {
                    if (ret.status === 'ok') {
                        //wyświetlamy komunikat powodzenia, cieszymy sie
                        const div = document.createElement('div');
                        div.classList.add('form-send-success');

                        div.innerHTML = '<strong>Wiadomość została wysłana</strong><span>Dziękujemy za kontakt. Postaramy się odpowiedzieć jak najszybciej</span>';
                        form.parentElement.insertBefore(div, form);
                        form.remove();
                    }

                    if (ret.status === 'error') {
                        //komunikat błędu, niepowodzenia
                        const div = document.createElement('div');
                        div.classList.add('send-error');
                        div.innerText = 'Wysłanie wiadomości się nie powiodło';
                    }
                }
            }).catch(_ => {
                submit.disabled = false;
                submit.classList.remove('element-is-busy');
            });
        }
    });
}
