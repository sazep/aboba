window.addEventListener('load', () => {
  scrollTo(0, 0)
  document.querySelector(".body-load-after").style.overflowY = "hidden"
  
  setTimeout(() => {
    document.querySelector(".body-load-after").style.overflowY = "hidden"
  }, 300)
  
  setTimeout(() => {
    document.querySelector(".body-load-after").style.overflowY = "hidden"
  }, 600)
  
  setTimeout(() => {
    document.querySelector(".body-load-after").style.overflowY = "hidden"
    document.querySelector('.navbar-dark').scrollIntoView({ behavior: 'smooth' })
    
    setTimeout(() => {
      document.querySelector(".load-main").style.display = "none"
      
      setTimeout(() => {
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
        
        setTimeout(() => {
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
        }, 500)
      }, 500)
    }, 600)
  }, 1400)
})

// Обработка курсора для эффекта наложения
let cardsContainer = document.querySelector(".cards")
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
    .then(response => response.json())
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
      if (el.hasAttribute('placeholder')) {
        el.setAttribute('placeholder', translations[currentLanguage][translationKey] || el.getAttribute('placeholder'))
      }
    })
  }
}

// Загружаем переводы для начального языка
loadTranslations(currentLanguage)

// icon reload
document.querySelector(".icon").addEventListener("click", () => {
  scrollTo(0, 0)
  location.reload()
})

document.addEventListener('DOMContentLoaded', () => {
  const buyButtons = document.querySelectorAll('.buy-btn')
  const cardsInner = document.querySelector('.cards__inner')
  const mainText = document.getElementById('AboutMe')
  const purchaseConfirmation = document.getElementById('purchase-confirmation')
  const totalPrice = document.getElementById('total-price')
  const cancelBtn = document.querySelector('.cancel--btn')
  const confirmBtn = document.querySelector('.purchase--btn')
  const expiryDateInput = document.querySelector('input[placeholder="01/23"]')
  const cardNumberInput = document.querySelector('input[placeholder="0000 0000 0000 0000"]')
  
  buyButtons.forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('.card')
      const price = card.dataset.price
      
      // Скрыть карточки и показать окно подтверждения
      cardsInner.classList.add('hidden')
      mainText.classList.add('hidden')
      purchaseConfirmation.classList.remove('hidden')
      totalPrice.textContent = `$${price}`
    })
  })

  // Убираем окно при нажатии на Cancel и перезагружаем страницу
  cancelBtn.addEventListener('click', () => {
    window.location.reload()
  })

  // Автоматическое добавление `/` в поле даты истечения срока действия карты
  expiryDateInput.addEventListener('input', () => {
    let value = expiryDateInput.value
    if (value.length === 2 && !value.includes('/')) {
      expiryDateInput.value = `${value}/`
    }
  })

  // Устанавливаем максимальную длину ввода для полей
  cardNumberInput.addEventListener('input', () => {
    if (cardNumberInput.value.length > 16) {
      cardNumberInput.value = cardNumberInput.value.slice(0, 16)
    }
  })

  expiryDateInput.addEventListener('input', () => {
    if (expiryDateInput.value.length > 5) {
      expiryDateInput.value = expiryDateInput.value.slice(0, 5)
    }
  })

  // Обработчик для подтверждения покупки
  confirmBtn.addEventListener('click', (e) => {
    e.preventDefault() // Предотвратить отправку формы

    // Сброс предыдущих ошибок
    document.querySelectorAll('.error-message').forEach(el => el.remove())
    document.querySelectorAll('.input_field').forEach(el => el.classList.remove('error'))

    // Получаем значения полей
    let cardHolderName = document.querySelector('input[placeholder="Enter your full name"]')
    let cardNumber = document.querySelector('input[placeholder="0000 0000 0000 0000"]')
    let expiryDate = expiryDateInput
    let cvv = document.querySelector('input[placeholder="CVV"]')
    
    let hasError = false // Флаг для проверки наличия ошибок

    // Проверка на заполненность имени владельца карты
    if (!cardHolderName.value.trim()) {
      showError(cardHolderName, 'Card holder name is required.')
      hasError = true
    }

    // Проверка номера карты (16 цифр)
    let cardNumberValue = cardNumber.value.replace(/\s+/g, '')
    if (cardNumberValue.length !== 16 || !/^\d{16}$/.test(cardNumberValue)) {
      showError(cardNumber, 'Card number must be 16 digits.')
      hasError = true
    }

    // Проверка CVV
    if (cvv.value.length !== 3 || !/^\d{3}$/.test(cvv.value)) {
      showError(cvv, 'CVV must be 3 digits.')
      hasError = true
    }

    // Проверка даты истечения срока карты типа
    if (!/^\d{2}\/\d{2}$/.test(expiryDate.value)) {
      showError(expiryDate, 'Expiry Date must be in the format MM/YY.')
      hasError = true
    }

    if (hasError) {
      return
    }

    // Временная проверка
    alert('Purchase confirmed!')

    // Скрываем окно после успешного подтверждения
    purchaseConfirmation.classList.add('hidden')
    overlay.style.display = 'none'
    cardsInner.classList.remove('hidden')
    mainText.classList.remove('hidden')
  })

  function showError(input, message) {
    input.classList.add('error')
    const errorMessage = document.createElement('div')
    errorMessage.className = 'error-message'
    errorMessage.textContent = message
    input.parentElement.appendChild(errorMessage)
  }
})