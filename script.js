window.addEventListener('load', () => {
  scrollTo(0, 0)
  document.querySelector(".body-load-after").style.overflowY = "hidden"
  setTimeout(function () {
    document.querySelector(".body-load-after").style.overflowY = "hidden"
  }, 300)
  setTimeout(function () {
    document.querySelector(".body-load-after").style.overflowY = "hidden"
  }, 600)
  setTimeout(function () {
    document.querySelector(".body-load-after").style.overflowY = "hidden"
    document.querySelector('.navbar-dark').scrollIntoView({ behavior: 'smooth' })
    setTimeout(function () {
      document.querySelector(".load-main").style.display = "none"
      // ANIM TEXT
      setTimeout(function () {
        anime({
          targets: document.querySelectorAll(".text-loading-overlay"),
          width: "0px",
          left: "650px",
          easing: "linear",
          duration: 2000,
        }).finished.then(() => {
          document.querySelectorAll(".text-loading-overlay").forEach(el => {
            el.style.display = "none"
          })
        })
        setTimeout(function () {
          // анимация тексту
          console.log()
          let lets = document.querySelector('.text-loading-overlay-random-symbl').innerHTML.split("")
          let special_symbos = "<#$%^&*█(░)-+!@=~>₴░█s".split("")

          let container = document.getElementById('random-symbl')
          container.innerHTML = ''

          lets.forEach((letter, index) => {
            let span = document.createElement('span')
            span.classList.add('letter')
            span.innerHTML = special_symbos[Math.floor(Math.random() * special_symbos.length)]
            container.appendChild(span)

            let interval = setInterval(() => {
              span.innerHTML = special_symbos[Math.floor(Math.random() * special_symbos.length)]
            }, 80)

            setTimeout(() => {
              clearInterval(interval)
              span.innerHTML = letter
            }, 2000 + index * 70)
          })
        },500)
      }, 500)
    }, 600)
  }, 1400)
})
// следить за курсоро чтоб красиво менюшки переливались

let cardsContainer = document.querySelector(".cards")
let cardsContainerInner = document.querySelector(".cards__inner")
let cards = Array.from(document.querySelectorAll(".card"))
let overlay = document.querySelector(".overlay")

let applyOverlayMask = (e) => {
  let overlayEl = e.currentTarget
  let x = e.pageX - cardsContainer.offsetLeft
  let y = e.pageY - cardsContainer.offsetTop

  overlayEl.style = `--opacity: 1; --x: ${x}px; --y:${y}px;`
}

let createOverlayCta = (overlayCard, ctaEl) => {
  let overlayCta = document.createElement("div")
  overlayCta.classList.add("cta")
  overlayCta.textContent = ctaEl.textContent
  overlayCta.setAttribute("aria-hidden", true)
  overlayCard.append(overlayCta)
}

let observer = new ResizeObserver((entries) => {
  entries.forEach((entry) => {
    let cardIndex = cards.indexOf(entry.target)
    let width = entry.borderBoxSize[0].inlineSize
    let height = entry.borderBoxSize[0].blockSize

    if (cardIndex >= 0) {
      overlay.children[cardIndex].style.width = `${width}px`
      overlay.children[cardIndex].style.height = `${height}px`
    }
  })
})

let initOverlayCard = (cardEl) => {
  let overlayCard = document.createElement("div")
  overlayCard.classList.add("card")
  createOverlayCta(overlayCard, cardEl.lastElementChild)
  overlay.append(overlayCard)
  observer.observe(cardEl)
}

cards.forEach(initOverlayCard)
document.body.addEventListener("pointermove", applyOverlayMask)

// language
let currentLanguage = 'en' // Начальный язык
let translations = {} // Объект для хранения переводов

function loadTranslations(lang) {
  fetch(`translations/${lang}.json`)
    .then(response => {
      return response.json()
    })
    .then(data => {
      translations[lang] = data // Сохраняем переводы в объект
      if (currentLanguage === lang) {
        updateText() // Обновляем текст после загрузки
      }
    })
}

function toggleLanguage() {
  currentLanguage = currentLanguage === 'en' ? 'ua' : 'en' // Переключаем язык
  if (!translations[currentLanguage]) {
    loadTranslations(currentLanguage) // Загружаем переводы, если их еще нет
  } else {
    updateText()
  }
}

function updateText() {
  if (translations[currentLanguage]) {
    document.querySelectorAll('[data-lang]').forEach(el => {
      let translationKey = el.getAttribute('data-lang')
      if (translations[currentLanguage][translationKey]) {
        el.innerHTML = translations[currentLanguage][translationKey]
      }
    })
  }
}

// Загружаем переводы для начального языка
loadTranslations(currentLanguage)

// icon reload

document.querySelector(".icon").addEventListener("click", function () {
  location.reload()
})

// test main animation 
// window.addEventListener('load', () => {
//   let content = document.getElementById('Products')
//   let contY
//   do{
//     contY = content.getBoundingClientRect().top
//   }while(contY < 50)
//   alert(contY)
// })