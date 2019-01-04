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

const FormValidate = function(form, options) {
    const defaultOptions = {
        classError : 'error'
    }

    this.form = form;
    this.options = Object.assign({}, defaultOptions, options);

    
    this.form.setAttribute('novalidate', 'novalidate');

    this.prepareElements();
    this.bindSubmit();
};

FormValidate.prototype.prepareElements = function() {
    const elements = this.form.querySelectorAll('[required]');

    [].forEach.call(elements, function(element) {
        
        if (element.nodeName.toUpperCase() === 'INPUT') {
            const type = element.type.toUpperCase();

            
            if (type === 'TEXT') {
                element.addEventListener('input', function(e) {
                    this.testInputText(e.target);
                }.bind(this));
            }
            if (type === 'EMAIL') {
                element.addEventListener('input', function(e) {
                    this.testInputEmail(e.target);
                }.bind(this));
            }

        }
        if (element.nodeName.toUpperCase() === 'TEXTAREA') {
            element.addEventListener('input', function(e) {
                this.testInputText(e.target);
            }.bind(this));
        }
        
    }, this);
};

FormValidate.prototype.showFieldValidation = function(input, inputIsValid) {
    if (!inputIsValid) {
        input.parentElement.classList.add(this.options.classError);
    } else {
        input.parentElement.classList.remove(this.options.classError);
    }
};

FormValidate.prototype.testInputText = function(input) {
    let inputIsValid = true;
    const pattern = input.getAttribute('pattern');

    if (pattern !== null) {
        const reg = new RegExp(pattern, 'gi');
        if (!reg.test(input.value)) {
            inputIsValid = false;
        }
    } else {
        if (input.value === '') {
            inputIsValid = false;
        }
    }

    if (inputIsValid) {
        this.showFieldValidation(input, true);
        return true;
    } else {
        this.showFieldValidation(input, false);
        return false;
    }
};

FormValidate.prototype.testInputEmail = function(input) {
    const mailReg = new RegExp('^[0-9a-zA-Z_.-]+@[0-9a-zA-Z.-]+\.[a-zA-Z]{2,3}$', 'gi');

    if (!mailReg.test(input.value)) {
        this.showFieldValidation(input, false);
        return false;
    } else {
        this.showFieldValidation(input, true);
        return true;
    }
};


document.addEventListener("DOMContentLoaded", function() {
    const cfg = {};
    const form = new FormValidate(document.querySelector('.form'), cfg);
});

FormValidate.prototype.bindSubmit = function() {
    this.form.addEventListener('submit', function(e) {
        e.preventDefault();

        let formIsValidated = true;
        const elements = this.form.querySelectorAll('[required]');

        [].forEach.call(elements, function(element) {
            if (element.nodeName.toUpperCase() === 'INPUT') {
                const type = element.type.toUpperCase();

                if (type === 'EMAIL') {
                    if (!this.testInputEmail(element)) {
                        formIsValidated = false;
                    }
                }
            
                if (type === 'TEXT') {
                    if (!this.testInputText(element)) {
                        formIsValidated = false;
                    }
                }
        
            }

            if (element.nodeName.toUpperCase() === 'TEXTAREA') {
                if (!this.testInputText(element)) {
                    formIsValidated = false;
                }
            }
            
        }, this);

        if (formIsValidated) {
            e.target.submit();
        } else {
            return false;
        }
    }.bind(this));
};
