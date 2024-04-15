'use strict'
window.addEventListener('load', ()=> {
    let sideIndent = (window.outerWidth - getComputedStyle(document.body).getPropertyValue('--containerWidth').split('px')[0]) / 2
    document.body.style.setProperty('--sideIndent', sideIndent + 'px')
    // === HEADER === \\\
    let header = document.querySelector('header'),
        headerContainer = header.querySelector('.header__container'),
        headerBurger = header.querySelector('.burger'),
        headerClose = header.querySelector('.header__close'),
        headerTopMenu = header.querySelector('.header__top .header__menu'),
        headerTopMenuList = headerTopMenu.querySelector('.menu__list'),
        headerBottom = header.querySelector('.header__bottom'),
        headerBottomNav = header.querySelector('.header__bottom .header__nav'),
        headerBottomMenuLeft = header.querySelectorAll('.header__bottom .header__menu')[0],
        headerBottomMenuRight = header.querySelectorAll('.header__bottom .header__menu')[1],
        headerItemFeedback = header.querySelector('.menu__item._feedback'),
        headerItemSearch = header.querySelector('.menu__item._search')


    if (window.matchMedia('(max-width: 744px)').matches){

        headerBottomMenuRight.querySelectorAll('.menu__item').forEach(item => {
            headerTopMenu.querySelector('.menu__list').insertAdjacentElement('afterbegin', item)
        })
        headerBottomNav.insertAdjacentElement('afterbegin', headerTopMenu)
        headerContainer.insertAdjacentElement('beforeend', headerItemSearch)
        headerBottomMenuRight.parentNode.removeChild(headerBottomMenuRight);
        headerBottomMenuLeft.querySelector('.menu__list').insertAdjacentElement('beforeend', headerItemFeedback)
    }
    
    headerBurger.addEventListener('click', toggleMenu)
    headerClose.addEventListener('click', closeMenu)
    function toggleMenu() {
        headerBottom.classList.toggle('_active')
        headerBurger.classList.toggle('_active')
        document.body.classList.toggle('lock')
    }
    function closeMenu() {
        headerBottom.classList.remove('_active')
        headerBurger.classList.remove('_active')
        document.body.classList.remove('lock')
    }
    document.body.style.setProperty('--headerHeight', header.offsetHeight + 'px');
    document.addEventListener('click', (e) => {
        let withinBoundaries = e.composedPath().includes(headerBottom);
            
        if ( !withinBoundaries && !e.composedPath().includes(headerBurger)) {
            closeMenu()
        }
    })
    // === MENU / SUBMENU === \\
    let menu = document.querySelector('.menu'),
        menuItems = menu.querySelectorAll('.menu__item')

    if (window.matchMedia('(min-width: 744.1px)').matches){
        menuItems.forEach(item => {
            let submenu = item.querySelector('.submenu')
            item.addEventListener('mouseover', ()=>{
                document.querySelectorAll('.menu__item > .submenu').forEach(sub => {sub.classList.remove('_active')})
                submenu ? submenu.classList.add('_active') : ''
            })
        })
        header.addEventListener('mouseleave', ()=>{
            document.querySelectorAll('.submenu').forEach(sub => {sub.classList.remove('_active')})
        })
        let submenus = document.querySelectorAll('.menu__item > .submenu')
        submenus.forEach(submenu => {
            let submenuItems = submenu.querySelectorAll(' .submenu__item')
    
            submenuItems.forEach(item => {
                let nextSub = item.querySelector('.submenu')
                item.addEventListener('click', ()=>{
                    submenuItems.forEach(i => {
                        let nb = i.querySelector('.submenu')
                        if (nb){
                            nb.classList.remove('_active')
                        }
                    })
                    nextSub ? nextSub.classList.add('_active') : ''
                })
            })
    
            document.querySelectorAll('.submenu').forEach(sub => {
                sub.addEventListener('mouseleave', ()=>[
                    sub.classList.contains('_active') ? sub.classList.remove('_active') : ''
                ])
            })
        })
    }

    // === MODALS === \\\
    let modal = document.querySelector('.modal'),
        modalBtns = document.querySelectorAll('.modal__btn'),
        modalWindows = modal.querySelectorAll('.modal__window')

    modalBtns.forEach(btn => {
        let btnName = btn.classList[(btn.classList).length - 1]

        btn.addEventListener('click', ()=>{
            modalWindows.forEach(window => {
                let windowName = window.classList[(window.classList).length - 1]
                if (windowName == btnName){
                    modal.classList.add('_active')
                    window.classList.add('_active')
                    document.body.style.overflow = 'hidden'
                }
            })
        })
    })
    modalWindows.forEach(window => {
        let close = window.querySelector('.modal__close')
        close.addEventListener('click', ()=>{
            modal.classList.remove('_active')
            window.classList.remove('_active')
            document.body.style.overflow = ''
        })
        modal.addEventListener('click', (e) => {
            let withinBoundaries = e.composedPath().includes(window);
                
            if (!withinBoundaries) {
                modal.classList.remove('_active')
                window.classList.remove('_active')
                document.body.style.overflow = ''
            }
        })
    })

    // === FORMS === \\\
    let forms = document.querySelectorAll('form.form')
    forms.forEach(form => {
        let inputs = form.querySelectorAll('.form__input'),
            name = form.querySelector('._name'),
            nameInput = name.querySelector('.form__input'),
            namePlaceholder = name.querySelector('.form__placeholder'),
            phone = form.querySelector('._phone'),
            phoneInput = phone.querySelector('.form__input'),
            phonePlaceholder = phone.querySelector('.form__placeholder'),
            email = form.querySelector('._email'),
            checkbox = form.querySelector('.form__checkbox'),
            checkboxInput = checkbox.querySelector('input'),
            send = form.querySelector('.form__send'),
            status = true

        nameInput.addEventListener('input', ()=>{
            nameInput.value != '' ? namePlaceholder.style.display = 'none' : namePlaceholder.style.display = ''
        })
        phone.addEventListener('click', ()=>{
            phonePlaceholder.style.display = 'none'
        })

        nameInput.addEventListener('input', checkForm)
        checkboxInput.addEventListener('change', checkForm)
        email ? email.querySelector('.form__input').addEventListener('input', checkForm) : ''
        $(phoneInput).mask("+7 (999) 999 99 99", {
            completed: function() {
                checkForm();
                phoneInput.classList.remove('_error')
            }
        })
        form.addEventListener('click', (e) => {
            let withinBoundaries = e.composedPath().includes(phone);
                
            if (!withinBoundaries) {
                if (phoneInput.value == '' & (checkboxInput.checked || nameInput.value != '')) {
                    phonePlaceholder.style.display = 'block'
                    checkForm();
                }
            }
        })
        
        function checkForm() {
            status = true
            if (nameInput.value == ''){
                status = false
                nameInput.classList.add('_error')
            }
            else{
                nameInput.classList.remove('_error')
            }

            if (phoneInput.value == ''){
                status = false
                phoneInput.classList.add('_error')
            }

            if (email){
                if (checkEmail(email.querySelector('.form__input'))){
                    email.classList.remove('_error')
                }
                else{
                    status = false
                    email.classList.add('_error')
                }
            }


            if (!checkboxInput.checked){
                status = false
                checkbox.classList.add('_error')
            }
            else{
                checkbox.classList.remove('_error')
            }

            if (status == false){
                send.disabled = true
                console.log('false');
            }
            else{
                send.disabled = false
                console.log('success');
            }

        }
        send.addEventListener('click', checkForm)
    })

    // === FILE === \\\
    let files = document.querySelectorAll('.file')
    files.forEach(file =>{
        let input = file.querySelector('input'),
            label = file.querySelector('label'),
            defText = label.textContent

        input.addEventListener('change', ()=>{
            label.innerHTML = input.files[0].name
            if (input.files.length > 1){
                label.innerHTML = input.files[0].name  + ' . . . '
            }
            else{
                label.innerHTML = input.files[0].name
            }

            if (!file.querySelector('.file__close')){
                file.insertAdjacentHTML('beforeend', `
                <i class="icon-close file__close"></i>
                `)
            }

            let close = file.querySelector('.file__close')
            close.addEventListener('click', ()=>{
                label.innerHTML = defText
                file.removeChild(file.querySelector('.file__close'));
                input.type = "text";
                input.type = "file";
                input.value = '';
            })
        })
    })

    // === SEARCH === \\
    let search = document.querySelectorAll('.search')
    if (search.length > 0){
        search.forEach(search => {
            let searchBtn = search.querySelector('.search__btn'),
                searchWrapper = search.querySelector('.search__wrapper'),
                searchField = search.querySelector('.search__field'),
                searchInput = search.querySelector('.search__input'),
                searchClose = search.querySelector('.search__close'),
                searchClear = search.querySelector('.search__clear')

            searchInput.addEventListener('input', ()=>{
                searchInput.value.length > 0 ? search.classList.add('_results') : search.classList.remove('_results')
            })
            if (searchBtn){
                searchBtn.addEventListener('click', ()=>{
                    search.classList.add('_active')
                    console.log('s');
                    // document.body.style.overflow = 'hidden'
                })
            }
            if (searchClear){
                searchClear.addEventListener('click', ()=>{
                    searchInput.value = ''
                    search.classList.remove('_results')
                })
            }
            if (searchClose){
                searchClose.addEventListener('click', ()=>{
                    searchInput.value = ''
                    search.classList.remove('_results')
                    search.classList.remove('_active')
                })
            }

            document.body.addEventListener('click', (e) => {
                let withinBoundaries = e.composedPath().includes(searchWrapper) || e.composedPath().includes(searchBtn);
                    
                if ( !withinBoundaries) {
                    search.classList.remove('_active')
                    // document.body.style.overflow = ''
                }
            })
        })
    }

    
    // === SLIDERS === \\\
    let certificationMainSlider = document.querySelector('.certification__slider'),
        certificationMainSliderItems = certificationMainSlider.querySelectorAll('.certification__item ')

    if (window.matchMedia('(max-width: 360px)').matches){
        addBigSlider(certificationMainSlider, certificationMainSliderItems, 3)
    }
    function addBigSlider(mainSlider, mainSliderItems, mainShow = 1) {
        let container = mainSlider.parentNode
        container.insertAdjacentHTML('beforeend', `<div class="big-list"><div class="big-slider"></div></div>`)

        let bigList = container.querySelector('.big-list'),
            bigSlider = container.querySelector('.big-slider')
        
        bigList.insertAdjacentHTML('afterbegin', `<button class="big-close"><i class="icon-close"></i></button>`)
        
        let bigClose = bigList.querySelector('.big-close')
        bigClose.addEventListener('click', ()=>{
            bigList.classList.remove('_active')
        })

        mainSliderItems.forEach(item => {
            let elem = item.cloneNode(true)
            elem.classList.add('big-item')
            bigSlider.insertAdjacentElement('beforeend', elem)

            item.addEventListener('click', ()=>{
                bigList.classList.add('_active')
                bigSlider.slick.refresh()
            })
        })

        $(mainSlider).slick({
          slidesToShow: mainShow,
          asNavFor: bigSlider,
          slidesToShow: 3,
          arrows : false,
          dots: true,
          infinite: true,
          responsive: [
            {
              breakpoint: 744.1,
              settings: {
                  slidesToShow: 2
              }
            },
            {
              breakpoint: 360.1,
              settings: {
                  slidesToShow: 1
              }
            }
          ]
        });
        $(bigSlider).slick({
            arrows : true,
            dots: false,
            slidesToShow: 1,
            infinite: true,
            asNavFor: mainSlider,
            prevArrow: '<button class="big-toggle _prev"><i class="icon-arrow-left"></i></button>',
            nextArrow: '<button class="big-toggle _next"><i class="icon-arrow-right"></i></button>',
        });
    }

    $('.startpage__list').slick({
        arrows : false,
        dots: true,
        appendDots: '.startpage__dots',
        slidesToShow: 1,
        infinite: true,
    })
    $('.production__slider').slick({
        arrows : true,
        dots: true,
        slidesToShow: 1,
        infinite: true,
        prevArrow: '<button class="production__toggle _prev"><i class="icon-arrow-left"></i></button>',
        nextArrow: '<button class="production__toggle _next"><i class="icon-arrow-right"></i></button>',
    })
    $('.benefits__list').slick({
        arrows : false,
        dots: true,
        slidesToShow: 1,
        infinite: true,
        mobileFirst: true,
        responsive: [
            {
                breakpoint: 360,
                slidesToShow: 2,
            },
            {
                breakpoint: 744,
                settings: "unslick",
            }
        ]
    })
    $('.about__slider').slick({
        arrows : false,
        dots: true,
        slidesToShow: 1,
        infinite: true,
    })
    $('.steps__slider').slick({
        arrows : false,
        dots: true,
        slidesToShow: 1,
        infinite: true,
    })
    $('.clients__list').slick({
        arrows : false,
        dots: false,
        slidesToShow: 1,
        infinite: true,
        mobileFirst: true,
        responsive: [
            {
              breakpoint: 360,
              settings: {
                  slidesToShow: 2
              }
            },
            {
                settings: "unslick",
                breakpoint: 744
            }
        ]
    })
    $('.decisions__slider').slick({
        arrows : false,
        dots: true,
        slidesToShow: 1,
        infinite: true,
    })
    $('.news__list').slick({
        mobileFirst: true,
        arrows : false,
        dots: true,
        slidesToShow: 1,
        infinite: true,
        responsive: [
            {
              breakpoint: 360,
              settings: {
                  slidesToShow: 2
              }
            },
            {
                breakpoint: 744,
                settings: "unslick",
            }
        ]
    })

    // === NEWS ITEMS HEIGHT === \\\
    let newsItems = document.querySelectorAll('.news__item'),
        newsArrHeights = []
    

    Array.prototype.max = function() {
        return Math.max.apply(null, this);
    };
    newsItems.forEach(item => {
        newsArrHeights.push(item.offsetHeight)
    })
      
    newsItems.forEach(item => {
        item.style.height = newsArrHeights.max() + 'px'
    })

    // === DROPDOWN === \\
    let dropdowns = document.querySelectorAll('.dropdown') 
    dropdowns.forEach(item => dropdown(item))
    function dropdown(dropdown) {
        let title = dropdown.querySelector('.dropdown__title_text'),
            items = dropdown.querySelectorAll('.dropdown__item')

        title.addEventListener('click', ()=>{ 
            dropdown.classList.toggle('_open') 
            if (dropdown.classList.contains('_open') ){
                let slider = dropdown.querySelector('.slick-slider')
                slider ? slider.slick.refresh() : ''
            }
        })

        if (items) {
            items.forEach(item => {
                item.addEventListener('click', ()=>{
                    title.textContent = item.textContent
                    items.forEach(i => {  i.classList.remove('_active')  })
                    item.classList.add('_active')
                    dropdown.classList.remove('_open')
                })
            })
        }

        document.addEventListener('click', (e) => {
            let withinBoundaries = e.composedPath().includes(dropdown);
                
            if (!withinBoundaries) {
                dropdown.classList.remove('_open')
            }
        })
    }
    
    // === TABS === \\
    let tabs = document.querySelectorAll('.tabs')
    tabs.forEach(tab => tabsCreate(tab) )

    function tabsCreate(tab) {
        let tabsTitles = tab.querySelectorAll('.tabs__head > .tabs__title'),
            tabsItems = tab.querySelectorAll('.tabs__body > .tabs__item')

        let tabsHead = tab.parentNode.querySelector('.tabs > .tabs__head'),
            tabsParentTitle = tab.parentNode.querySelector('h1.title')

        
        tabsTitles.forEach(title => {
            title.addEventListener('click', ()=>{
                for (let n = 0; n < tabsTitles.length; n++){
                    if (tabsTitles[n] == title){
                        let subTitle = tabsItems[n].querySelector('.tabs__title'),
                            subItem = tabsItems[n].querySelector('.tabs__item')

                        subTitle ? subTitle.classList.add('_active') : ''
                        subItem ? subItem.classList.add('_active') : ''
                        tabsTitles[n].classList.add('_active')
                        tabsItems[n].classList.add('_active')
                        
                        let sliders = tab.querySelectorAll('.slick-slider')

                        if (sliders){
                            sliders.forEach(slider => {
                                slider.slick.refresh()
                            });
                        }
                    }
                    else {
                        tabsTitles[n].classList.remove('_active')
                        tabsItems[n].classList.remove('_active')
                    }
                }
            })
        })

        if (tabsHead.offsetWidth < tabsHead.scrollWidth){

            tabsParentTitle.insertAdjacentHTML('beforeend', `
            <div class="tabs__toggler">
                <button class="tabs__toggle _prev _disabled"><i class="icon-arrow-left"></i></button>
                <button class="tabs__toggle _next"><i class="icon-arrow-right"></i></button>
            </div>
            `)

            let tabsScrollLeft = tabsParentTitle.querySelector('.tabs__toggle._prev'),
                tabsScrollRight = tabsParentTitle.querySelector('.tabs__toggle._next')

                tabsScrollLeft.addEventListener('click', ()=>{
                    tabsHead.scrollLeft -= 200
                    tabsScrollRight.classList.remove('_disabled')
                    setTimeout(() => {
                        if (tabsHead.scrollLeft == 0){
                            tabsScrollLeft.classList.add('_disabled')
                        }
                        else{
                            tabsScrollLeft.classList.remove('_disabled')
                        }
                        console.log(tabsHead.scrollLeft);
                    }, 201);
                })
                tabsScrollRight.addEventListener('click', ()=>{
                    tabsHead.scrollLeft += 200
                    tabsScrollLeft.classList.remove('_disabled')
                    setTimeout(() => {
                        if (tabsHead.scrollLeft == tabsHead.scrollWidth - tabsHead.offsetWidth){
                            tabsScrollRight.classList.add('_disabled')
                        }
                        else{
                            tabsScrollRight.classList.remove('_disabled')
                        }
                    }, 201);
                })
            tabsHead.addEventListener('scroll', ()=>{
                if (tabsHead.scrollLeft == tabsHead.scrollWidth - tabsHead.offsetWidth){
                    tabsScrollRight.classList.add('_disabled')
                }
                else if (tabsHead.scrollLeft == 0){
                    tabsScrollLeft.classList.add('_disabled')
                }
                else{
                    tabsScrollRight.classList.remove('_disabled')
                    tabsScrollLeft.classList.remove('_disabled')
                }
            })
        }
    }

    // === RESPONSIVE TABS === \\
    let decisionsTabs = document.querySelector('.decisions__tabs'),
        decisionsTabsItems = decisionsTabs.querySelectorAll('.decisions__tabs .tabs__item')
     
    decisionsTabsItems.forEach(tabs => {        
        let items = [tabs.querySelector('.decisions__info'), tabs.querySelector('.decisions__list')],
            titles = ['Фото', 'Описание']

        responsiveTabs(tabs, items, titles)
    });
    function responsiveTabs(tabs, items, titles) {
        tabs.innerHTML = `
            <div class="tabs">
                <div class="tabs__head"></div>
                <div class="tabs__body"></div>
            </div>
        `
        let head = tabs.querySelector('.tabs__head'),
            body = tabs.querySelector('.tabs__body')

        titles.forEach(title => {
            head.insertAdjacentHTML('beforeend', `<h3 class="tabs__title">${title}</h3>`)
        })
        items.forEach(item => {
            item.classList.add('tabs__item')
            body.insertAdjacentElement('beforeend', item)
            
        })
        tabs.querySelectorAll('.tabs__title')[0].classList.add('_active')
        tabs.querySelectorAll('.tabs__item')[0].classList.add('_active')
        
    }
    decisionsTabsItems.forEach(tabs => tabsCreate(tabs.querySelector('.tabs')) );

    // === RADIO BUTTONS === \\
    // let radios = document.querySelectorAll('.radio')

    // radios.forEach(item => {radio(item)})
    // function radio(radio) {
    //     let radioItems = radio.querySelectorAll('.radio__item')
    //     radioItems.forEach(item =>{
    //         item.addEventListener('click', ()=>{
    //             radioItems.forEach(i => {i.classList.remove('_active')})
    //             item.classList.add('_active')
    //         })
    //     })
    // }

    // === INPUT MASK === \\\
    // $('._mask-phone').mask("+7 (999) 999 99 99")
    
    // === CHECK EMAIL === \\\
    function checkEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(email.value)){
            email.classList.add('_error')
            email.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            return false
        }
        else{
            email.classList.remove('_error')
            return true
        }
    }

    // === MEDIA QUERIES === \\\
    function mediaQueries() {
        if (window.matchMedia('(max-width: 1440px)').matches){
            
        }
        if (window.matchMedia('(max-width: 1024px)').matches){
            
        }
        if (window.matchMedia('(max-width: 768px)').matches){
            
        }
        if (window.matchMedia('(max-width: 576px)').matches){
            
        }
        if (window.matchMedia('(max-width: 360px)').matches){
            
        }
    };
    
    mediaQueries()
    window.addEventListener('resize', mediaQueries)
})