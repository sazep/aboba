window.addEventListener('load', () => {
  scrollTo(0, 0)  

  setTimeout(() => {
    document.querySelector('.navbar-dark').scrollIntoView({ behavior: 'smooth' })

    setTimeout(() => {
      document.querySelector(".load-main").style.display = "none"

      setTimeout(() => {
        anime({
          targets: document.querySelectorAll(".text-loading-overlay"),
          width: "0px",
          left: "650px",
          easing: "linear",
          duration: 2000
        }).finished.then(() => {
          document.querySelectorAll(".text-loading-overlay").forEach(el => {
            el.style.display = "none"
          })
        })

        setTimeout(() => {
          const lets = document.querySelector('.text-loading-overlay-random-symbl').innerHTML.split("")
          const specialSymbols = "<#$%^&*█(░)-+!@=~>₴░█s".split("")

          const container = document.getElementById('random-symbl')
          container.innerHTML = ''

          lets.forEach((letter, index) => {
            const span = document.createElement('span')
            span.classList.add('letter')
            span.innerHTML = specialSymbols[Math.floor(Math.random() * specialSymbols.length)]
            container.appendChild(span)

            const interval = setInterval(() => {
              span.innerHTML = specialSymbols[Math.floor(Math.random() * specialSymbols.length)]
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
const cardsContainer = document.querySelector(".cards")
const cards = Array.from(document.querySelectorAll(".card"))
const overlay = document.querySelector(".overlay")

const applyOverlayMask = (e) => {
  const overlayEl = e.currentTarget
  const x = e.pageX - cardsContainer.offsetLeft
  const y = e.pageY - cardsContainer.offsetTop

  overlayEl.style = `--opacity: 1; --x: ${x}px; --y:${y}px;`
}

const createOverlayCta = (overlayCard, ctaEl) => {
  const overlayCta = document.createElement("div")
  overlayCta.classList.add("cta")
  overlayCta.textContent = ctaEl.textContent
  overlayCta.setAttribute("aria-hidden", true)
  overlayCard.append(overlayCta)
}

const observer = new ResizeObserver((entries) => {
  entries.forEach((entry) => {
    const cardIndex = cards.indexOf(entry.target)
    const { inlineSize: width, blockSize: height } = entry.borderBoxSize[0]

    if (cardIndex >= 0) {
      overlay.children[cardIndex].style.width = `${width}px`
      overlay.children[cardIndex].style.height = `${height}px`
    }
  })
})

const initOverlayCard = (cardEl) => {
  const overlayCard = document.createElement("div")
  overlayCard.classList.add("card")
  createOverlayCta(overlayCard, cardEl.lastElementChild)
  overlay.append(overlayCard)
  observer.observe(cardEl)
}

cards.forEach(initOverlayCard)
document.body.addEventListener("pointermove", applyOverlayMask)

// language
let currentLanguage = localStorage.getItem('language') || 'en' // Чтение языка из localStorage, по умолчанию 'en'
let translations = {} // Объект для хранения переводов

const loadTranslations = (lang) => {
  fetch(`translations/${lang}.json`)
    .then(response => response.json())
    .then(data => {
      translations[lang] = data // Сохраняем переводы в объект
      if (currentLanguage === lang) {
        updateText() // Обновляем текст после загрузки
      }
    })
}

const toggleLanguage = () => {
  currentLanguage = currentLanguage === 'en' ? 'ua' : 'en'
  localStorage.setItem('language', currentLanguage) // Сохраняем выбранный язык в localStorage
  if (!translations[currentLanguage]) {
    loadTranslations(currentLanguage)
  } else {
    updateText()
    // Перезагрузим ошибки, если форма открыта
    document.querySelectorAll('.input_field').forEach(el => el.classList.remove('error'))
    document.querySelectorAll('.error-message').forEach(el => el.remove())
  }
}

const updateText = () => {
  if (translations[currentLanguage]) {
    document.querySelectorAll('[data-lang]').forEach(el => {
      const translationKey = el.getAttribute('data-lang')
      if (translations[currentLanguage][translationKey]) {
        el.innerHTML = translations[currentLanguage][translationKey]
      }
    })

    document.querySelectorAll('input[placeholder]').forEach(el => {
      const placeholderText = el.getAttribute('placeholder')
      const translationKey = Object.keys(translations[currentLanguage]).find(key => translations[currentLanguage][key] === placeholderText)
      if (translationKey) {
        el.setAttribute('placeholder', translations[currentLanguage][translationKey])
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
  // Определение переменных
  const buyButtons = document.querySelectorAll('.buy-btn')
  const cardsInner = document.querySelector('.cards__inner')
  const mainText = document.getElementById('AboutMe')
  const purchaseConfirmation = document.getElementById('purchase-confirmation')
  const totalPrice = document.getElementById('total-price')
  const cancelBtn = document.querySelector('.cancel--btn')
  const confirmBtn = document.querySelector('.purchase--btn')

  const expiryDateInput = document.querySelector('input[placeholder="01/23"]')
  const cardNumberInput = document.querySelector('input[placeholder="1234 5678 9012 3456"]')
  const cardHolderName = document.querySelector('input[placeholder="Enter your full name"]')
  const cvv = document.querySelector('input[placeholder="CVV"]')

  // Обработка нажатия кнопок "Купить"
  buyButtons.forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('.card')
      const price = card.dataset.price

      cardsInner.classList.add('hidden')
      mainText.classList.add('hidden')
      purchaseConfirmation.classList.remove('hidden')
      totalPrice.textContent = `$${price}`
    })
  })

  // Обработка кнопки "Отмена"
  cancelBtn.addEventListener('click', () => {
    cardsInner.classList.remove('hidden')
    mainText.classList.remove('hidden')
    purchaseConfirmation.classList.add('hidden')
  })

  // Автоматическое добавление `/` в поле даты истечения срока действия карты
  expiryDateInput.addEventListener('input', () => {
    const value = expiryDateInput.value
    if (value.length === 2 && !value.includes('/')) {
      expiryDateInput.value = `${value}/`
    }
  })

  // Установка максимальной длины ввода для полей
  cardNumberInput.addEventListener('input', () => {
    if (cardNumberInput.value.length > 19) { // Учитывая пробелы в номере карты
      cardNumberInput.value = cardNumberInput.value.slice(0, 19)
    }
  })

  expiryDateInput.addEventListener('input', () => {
    if (expiryDateInput.value.length > 5) {
      expiryDateInput.value = expiryDateInput.value.slice(0, 5)
    }
  })

  // Функция отображения ошибок
  const showError = (element, key) => {
    const existingError = element.nextElementSibling
    if (existingError && existingError.classList.contains('error-message')) {
      existingError.remove()
    }

    element.classList.add('error')
    const errorElement = document.createElement('div')
    errorElement.className = 'error-message'
    errorElement.innerText = translations[currentLanguage][key] || key
    element.parentNode.insertBefore(errorElement, element.nextSibling)
  }

  // Проверка полей формы
  const validateForm = () => {
    let hasError = false

    // Проверка имени владельца карты
    if (!cardHolderName.value.trim()) {
      showError(cardHolderName, 'cardHolderNameError')
      hasError = true
    }

    // Проверка номера карты
    const cardNumberValue = cardNumberInput.value.replace(/\s+/g, '')
    if (cardNumberValue.length !== 16 || !/^\d{16}$/.test(cardNumberValue)) {
      showError(cardNumberInput, 'cardNumberError')
      hasError = true
    }

    // Проверка CVV
    if (cvv.value.length !== 3 || !/^\d{3}$/.test(cvv.value)) {
      showError(cvv, 'cvvError')
      hasError = true
    }

    // Проверка даты истечения срока
    if (!/^\d{2}\/\d{2}$/.test(expiryDateInput.value)) {
      showError(expiryDateInput, 'expiryDateError')
      hasError = true
    }

    return !hasError
  }

  // Обработчик для подтверждения покупки
  confirmBtn.addEventListener('click', (e) => {
    e.preventDefault() // Предотвратить отправку формы

    // Сброс предыдущих ошибок
    document.querySelectorAll('.error-message').forEach(el => el.remove())
    document.querySelectorAll('.input_field').forEach(el => el.classList.remove('error'))

    // Валидация формы
    if (validateForm()) {
      // Временная проверка
      alert('Purchase confirmed!')

      // Скрываем окно после успешного подтверждения
      purchaseConfirmation.classList.add('hidden')
      cardsInner.classList.remove('hidden')
      mainText.classList.remove('hidden')
    }
  })
})

document.addEventListener('DOMContentLoaded', () => {
  const themeToggler = document.getElementById('theme-toggler');
  const lightThemeIcon = document.getElementById('light-theme-icon');
  const darkThemeIcon = document.getElementById('dark-theme-icon');

  const applyTheme = (theme) => {
    document.body.className = theme;

    if (theme === 'dark-theme') {
      // Темные цвета для темной темы
      document.documentElement.style.setProperty('--background-main', '#1c1c24');
      document.documentElement.style.setProperty('--color-main', '#ffffff');
      document.documentElement.style.setProperty('--background-pay', '#ffffff');
      document.documentElement.style.setProperty('--background-main-teen-footer', '#121212'); // Немного темнее основной фон
      document.documentElement.style.setProperty('--background-main-teen', '#2b2b35'); // Немного темнее основной фон
      document.documentElement.style.setProperty('--main-light-green-text', '#a0a0a0'); 
    } else {
      // Светлые цвета для светлой темы
      document.documentElement.style.setProperty('--background-main', '#4BC0EB');
      document.documentElement.style.setProperty('--background-pay', '#ffffff');
      document.documentElement.style.setProperty('--color-main', '#000000');
      document.documentElement.style.setProperty('--background-main-teen-footer', '#2F7892'); // Немного темнее основной фон
      document.documentElement.style.setProperty('--background-main-teen', '#3f3f3f'); // Немного светлее основной фон
      document.documentElement.style.setProperty('--main-light-green-text', '#666666');
    }

    // Обновление видимости иконок
    lightThemeIcon.style.display = theme === 'dark-theme' ? 'none' : 'block';
    darkThemeIcon.style.display = theme === 'dark-theme' ? 'block' : 'none';

    // Сохранение выбранной темы
    localStorage.setItem('theme', theme);
  };

  // Загрузка сохранённой темы или установка темы по умолчанию
  const savedTheme = localStorage.getItem('theme') || 'light-theme';
  applyTheme(savedTheme);

  // Переключение темы по клику
  themeToggler.addEventListener('click', () => {
    const newTheme = document.body.classList.contains('dark-theme') ? 'light-theme' : 'dark-theme';
    applyTheme(newTheme);
  });
});
