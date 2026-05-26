/**
* Template Name: UpConstruction - v1.3.0
* Template URL: https://bootstrapmade.com/upconstruction-bootstrap-construction-website-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
document.addEventListener('DOMContentLoaded', () => {
  "use strict";

  const body = document.body;
  const header = document.querySelector('.header');
  const navbar = document.querySelector('#navbar');
  const hasHero = Boolean(document.querySelector('#hero'));

  body.classList.toggle('has-hero', hasHero);

  document.querySelectorAll('a[target="_blank"]').forEach((link) => {
    const rel = new Set((link.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
    rel.add('noopener');
    rel.add('noreferrer');
    link.setAttribute('rel', Array.from(rel).join(' '));
  });

  document.querySelectorAll('img:not([loading])').forEach((image) => {
    if (!image.closest('#hero') && !image.closest('.header')) {
      image.setAttribute('loading', 'lazy');
    }
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Mobile nav toggle
   */

  const mobileNavShow = document.querySelector('.mobile-nav-show');
  const mobileNavHide = document.querySelector('.mobile-nav-hide');

  const syncMobileNavState = () => {
    const isMobileNavOpen = body.classList.contains('mobile-nav-active');

    if (mobileNavShow) {
      mobileNavShow.classList.toggle('d-none', isMobileNavOpen);
    }

    if (mobileNavHide) {
      mobileNavHide.classList.toggle('d-none', !isMobileNavOpen);
    }
  };

  document.querySelectorAll('.mobile-nav-toggle').forEach(el => {
    el.addEventListener('click', function(event) {
      event.preventDefault();
      mobileNavToggle();
    });
  });

  function mobileNavToggle(forceOpen) {
    const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : !body.classList.contains('mobile-nav-active');
    body.classList.toggle('mobile-nav-active', shouldOpen);
    syncMobileNavState();
  }

  function closeMobileNav() {
    if (!body.classList.contains('mobile-nav-active')) {
      syncMobileNavState();
      return;
    }

    mobileNavToggle(false);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navbar a').forEach(navbarlink => {

    if (!navbarlink.hash) return;

    let section = document.querySelector(navbarlink.hash);
    if (!section) return;

    navbarlink.addEventListener('click', () => {
      if (body.classList.contains('mobile-nav-active')) {
        closeMobileNav();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  const navDropdowns = document.querySelectorAll('.navbar .dropdown > a');

  navDropdowns.forEach(el => {
    el.addEventListener('click', function(event) {
      if (body.classList.contains('mobile-nav-active')) {
        event.preventDefault();
        this.classList.toggle('active');
        this.nextElementSibling?.classList.toggle('dropdown-active');

        let dropDownIndicator = this.querySelector('.dropdown-indicator');
        if (dropDownIndicator) {
          dropDownIndicator.classList.toggle('bi-chevron-up');
          dropDownIndicator.classList.toggle('bi-chevron-down');
        }
      }
    });
  });

  if (navbar) {
    navbar.addEventListener('click', (event) => {
      if (event.target === navbar) {
        closeMobileNav();
      }
    });
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth > 991) {
      closeMobileNav();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMobileNav();
    }
  });

  /**
   * Header scroll effect - transparent when at top, dark background when scrolled
   */
  if (header) {
    const toggleHeaderScroll = function() {
      const shouldShowSolidHeader = !hasHero || window.scrollY > 50 || body.classList.contains('mobile-nav-active');
      header.classList.toggle('header-scrolled', shouldShowSolidHeader);
    };

    toggleHeaderScroll();
    window.addEventListener('load', toggleHeaderScroll);
    window.addEventListener('scroll', toggleHeaderScroll, {
      passive: true
    });
    window.addEventListener('resize', toggleHeaderScroll);
  }

  /**
   * Scroll top button
   */
  const scrollTop = document.querySelector('.scroll-top');
  if (scrollTop) {
    const togglescrollTop = function() {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    };
    window.addEventListener('load', togglescrollTop);
    document.addEventListener('scroll', togglescrollTop, {
      passive: true
    });
    scrollTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /**
   * Initiate glightbox
   */
  if (window.GLightbox && document.querySelector('.glightbox')) {
    GLightbox({
      selector: '.glightbox'
    });
  }

  /**
   * Porfolio isotope and filter
   */
  let portfolionIsotope = document.querySelector('.portfolio-isotope');

  if (portfolionIsotope && window.Isotope) {

    let portfolioFilter = portfolionIsotope.getAttribute('data-portfolio-filter') ? portfolionIsotope.getAttribute('data-portfolio-filter') : '*';
    let portfolioLayout = portfolionIsotope.getAttribute('data-portfolio-layout') ? portfolionIsotope.getAttribute('data-portfolio-layout') : 'masonry';
    let portfolioSort = portfolionIsotope.getAttribute('data-portfolio-sort') ? portfolionIsotope.getAttribute('data-portfolio-sort') : 'original-order';

    window.addEventListener('load', () => {
      const portfolioContainer = document.querySelector('.portfolio-container');
      if (!portfolioContainer) {
        return;
      }

      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item',
        layoutMode: portfolioLayout,
        filter: portfolioFilter,
        sortBy: portfolioSort
      });

      let menuFilters = document.querySelectorAll('.portfolio-isotope .portfolio-flters li');
      menuFilters.forEach(function(el) {
        el.addEventListener('click', function() {
          const currentActiveFilter = document.querySelector('.portfolio-isotope .portfolio-flters .filter-active');
          currentActiveFilter?.classList.remove('filter-active');
          this.classList.add('filter-active');
          portfolioIsotope.arrange({
            filter: this.getAttribute('data-filter')
          });
          if (window.AOS) {
            aos_init();
          }
        }, false);
      });

    });

  }

  /**
   * Init swiper slider with 1 slide at once in desktop view
   */
  if (window.Swiper && document.querySelector('.slides-1')) {
    new Swiper('.slides-1', {
      speed: 600,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      slidesPerView: 'auto',
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      }
    });
  }

  /**
   * Init swiper slider with 2 slides at once in desktop view
   */
  if (window.Swiper && document.querySelector('.slides-2')) {
    new Swiper('.slides-2', {
      speed: 600,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      slidesPerView: 'auto',
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 20
        },

        1200: {
          slidesPerView: 2,
          spaceBetween: 20
        }
      }
    });
  }

  /**
   * Initiate pURE cOUNTER
   */
  if (window.PureCounter) {
    new PureCounter();
  }

  /**
   * Animation on scroll function and init
   */
  function aos_init() {
    if (!window.AOS) {
      return;
    }

    AOS.init({
      duration: 800,
      easing: 'slide',
      once: true,
      mirror: false
    });
  }
  if (window.AOS) {
    window.addEventListener('load', () => {
      aos_init();
    });
  }

  syncMobileNavState();

});
