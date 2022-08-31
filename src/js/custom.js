'use strict';

class TabFilter {
  constructor(elem) {
    this._ALL = 'all';
    this._elTabs = document.querySelector(elem);
    if (this._elTabs) {
      this._elButtons = this._elTabs.querySelectorAll('[data-btn-filter]');
      this._elPanes = this._elTabs.querySelectorAll('[data-filter]');
      this._init();
    }
  }

  tabFilterPanel(elem) {
    const currentTab = elem.target.dataset.btnFilter;
    this._elPanes.forEach((e) => e.setAttribute('hidden', ''));
    if (currentTab === this._ALL) {
      this._elPanes.forEach((e) => e.removeAttribute("hidden"))
    } else {
      this._elTabs.querySelectorAll(`[data-filter=${currentTab}]`).forEach(e => e.removeAttribute('hidden'));
    }
  };

  tabBtnElemActive(currentElem) {
    this._elButtons.forEach((e) => e.classList.remove('active'));
    currentElem.target.classList.add('active');
  };

  _events() {
    this._elButtons.forEach((e) => {
      e.addEventListener('click', (currentElem) => {
        this.tabBtnElemActive(currentElem);
        this.tabFilterPanel(currentElem);
      })
    });
  };

  _init() {
    this._events();
  };
}

class Accordion {
  constructor({accordion, accordionIntro, accordionContent}) {
    this._elAccordions = document.querySelectorAll(accordion);
    if (this._elAccordions.length > 0) {
      this._events({accordionIntro, accordionContent});
    }
  }

  openAccordion({accordion, accordionContent}) {
    let content = accordion.querySelector(accordionContent);
    accordion.classList.add("active");
    content.style.maxHeight = content.scrollHeight + "px";
  }

  closeAccordion({accordion, accordionContent}) {
    accordion.classList.remove("active");
    accordion.querySelector(accordionContent).style.maxHeight = null;
  }

  _events({accordionIntro, accordionContent}) {
    this._elAccordions.forEach((accordion) => {
      const intro = accordion.querySelector(accordionIntro);
      const content = accordion.querySelector(accordionContent);
      intro.addEventListener('click',  (elem) =>  {
        elem.preventDefault();
        if (content.style.maxHeight) {
          this.closeAccordion({accordion, accordionContent});
        } else {
          this.openAccordion({accordion, accordionContent});
        }
      })
    });
  };
}

class Validate {
  constructor(elem) {
    this._elForm = elem;
    this.f = true;
    this.reg = {
      Email: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
    }
  }

  addInvalid(elem) {
    const parentElem = elem.closest('.field-text');
    parentElem.classList.add('error');
    this.f = false;
  }

  addValid(elem) {
    var parentElem = elem.closest('.field-text');
    parentElem.classList.remove('error');
  }

  isValid() {
    this.f = true;
    const reqElem = this._elForm.querySelectorAll('[data-required]');
    reqElem.forEach((elem) => {
      if(elem.value == '') {
        this.addInvalid(elem)
      } else {
        this.addValid(elem)
      }

      if(elem.dataset.type == "email") {
        var value = elem.value;

        if(this.reg.Email.test(value) == false) {
          this.addInvalid(elem)
        }
      }
    });

    return this.f;
  }
}

/**
 Фенсибркс, отключение свойства граб
 */
Fancybox.bind("[data-fancybox]", {
  dragToClose: false,
});

new Swiper('.js-main-news', {
  loop: true,
  effect: "fade",
  fadeEffect: {
    crossFade: true
  },
  autoplay: {
    delay: 10000,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
});

new Swiper('.js-news-slider', {
  spaceBetween: 15,
  pagination: {
    el: '.swiper-pagination',
  },
  breakpoints: {
    1264: {
      enabled: false
    }
  }
});

new TabFilter('.js-tab-filter');

new Accordion({
  accordion: '.js-submenu',
  accordionIntro: '.mb-nav__link',
  accordionContent: '.mb-nav__item-list'
});

new Accordion({
  accordion: '.js-accordion',
  accordionIntro: '.form-send__warning-text',
  accordionContent: '.form-send__warning-content'
});

const form = document.querySelectorAll('.js-form');
form.forEach((e) => {
  e.addEventListener("submit", function (e) {
    const validForm = new Validate(this);
    if(validForm.isValid()) {

      e.preventDefault(); // Удалить

      Fancybox.close([{
        src: '#modal-subscribe',
      }]);
      Fancybox.show([{
        src: '#modal-thanks',
        dragToClose: false,
      }], {
        on: {
          destroy: () => {
            Fancybox.show([{
              src: '#modal-alert',
              dragToClose: false,
            }])
          },
        },
      });
    }
    e.preventDefault();
  });
});
