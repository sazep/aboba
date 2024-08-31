window.addEventListener('load', () => {
  scrollTo(0, 0)

  setTimeout(() => {
    document.querySelector('.navbar-dark').scrollIntoView({ behavior: 'smooth' })

    setTimeout(() => {
      document.querySelector(".load-main").style.display = "none"
    }, 1000)
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

        const interval = setInterval(() => {
          span.innerHTML = special_symbos[Math.floor(Math.random() * special_symbos.length)]
        }, 70)

        setTimeout(() => {
          clearInterval(interval)
          span.innerHTML = letter
        }, 2000 + index * 20)
      })
    }, 200)
  }, 2000)
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
  fetch(`public/translations/${lang}.json`)
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
  const Project = document.getElementById('Project')
  const Reviews = document.getElementById('Reviews')
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
      Project.classList.add('hidden')
      Reviews.classList.add('hidden')
      purchaseConfirmation.classList.remove('hidden')
      totalPrice.textContent = `$${price}`
    })
  })

  // Обработка кнопки "Отмена"
  cancelBtn.addEventListener('click', () => {
    cardsInner.classList.remove('hidden')
    mainText.classList.remove('hidden')
    Project.classList.remove('hidden')
    Reviews.classList.remove('hidden')
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
      Project.classList.remove('hidden')
      Reviews.classList.remove('hidden')

    }
  })
})
document.addEventListener('DOMContentLoaded', () => {
  const themeToggler = document.getElementById('theme-toggler')
  const lightThemeIcon = document.getElementById('light-theme-icon')
  const darkThemeIcon = document.getElementById('dark-theme-icon')

  const applyTheme = (theme) => {
    document.body.className = theme

    if (theme === 'dark-theme') {
      document.documentElement.style.setProperty('--background-main', '#1c1c24')
      document.documentElement.style.setProperty('--color-main', '#ffffff')
      document.documentElement.style.setProperty('--background-pay', '#ffffff')
      document.documentElement.style.setProperty('--background-main-teen-footer', '#121212')
      document.documentElement.style.setProperty('--background-main-teen', '#2b2b35')
      document.documentElement.style.setProperty('--main-light-green-text', '#a0a0a0')
      document.documentElement.style.setProperty('--btn-main', '#1c1c24')
      document.documentElement.style.setProperty('--btn-coments', '#111115')
      document.documentElement.style.setProperty('--commetns-time', '#a0a0a0')
    } else {
      document.documentElement.style.setProperty('--background-main', '#097E71')
      document.documentElement.style.setProperty('--background-pay', '#ffffff')
      document.documentElement.style.setProperty('--color-main', '#ffffff')
      document.documentElement.style.setProperty('--background-main-teen-footer', '#183531')
      document.documentElement.style.setProperty('--background-main-teen', '#2C605A')
      document.documentElement.style.setProperty('--main-light-green-text', '#666666')
      document.documentElement.style.setProperty('--btn-main', '#183531')
      document.documentElement.style.setProperty('--btn-coments', '#183531')
      document.documentElement.style.setProperty('--commetns-time', '#c2c2c2')
    }

    lightThemeIcon.style.display = theme === 'dark-theme' ? 'none' : 'block'
    darkThemeIcon.style.display = theme === 'dark-theme' ? 'block' : 'none'
    localStorage.setItem('theme', theme)
  }

  const getPreferredTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      return savedTheme
    }

    // Проверяем системные настройки
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (prefersLight) {

    }
    return prefersLight ? 'light-theme' : 'dark-theme'
  }

  const initialTheme = getPreferredTheme() // Если ничего не найдено, устанавливаем темную тему
  applyTheme(initialTheme)

  themeToggler.addEventListener('click', () => {
    const newTheme = document.body.classList.contains('dark-theme') ? 'light-theme' : 'dark-theme'
    applyTheme(newTheme)
  })
})


// меню для телефона
document.getElementById('burger-button').addEventListener('click', function () {
  const mainNav = document.getElementById('main-nav')
  mainNav.classList.add('active')
})

document.getElementById('close-button').addEventListener('click', function () {
  const mainNav = document.getElementById('main-nav')
  mainNav.classList.remove('active')
})

document.querySelectorAll('#main-nav .navbar-nav .nav-links').forEach(link => {
  link.addEventListener('click', function () {
    const mainNav = document.getElementById('main-nav')
    mainNav.classList.remove('active')
  })
})


document.addEventListener('DOMContentLoaded', function () {
  const reviewsList = document.getElementById('reviews-list');

  function timeAgo(data) {
    const now = Date.now();
    const seconds = Math.floor((now - data) / 1000);
    const intervals = { year: 31536000, month: 2592000, day: 86400, hour: 3600, minute: 60 };
    for (let [unit, value] of Object.entries(intervals)) {
      const result = Math.floor(seconds / value);
      if (result >= 1) {
        return `${result} ${unit}${result > 1 ? 's' : ''} ago`;
      }
    }
    return 'just now';
  }

  fetch(`public/database/coments.json`)
    .then((res) => res.json())
    .then((data) => {
      data.reverse().forEach((review) => {
        const reviewElement = document.createElement('li')
        const timeString = timeAgo(review.data)

        reviewElement.innerHTML = `
                  <div style="display: flex; align-items: center; margin-top: 10px;">
                      <img src="public/src/avatar.png" alt="avatar" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 10px;">
                      <div>
                          <div>
                              <strong style="color: var(--color-main);">${review.name}</strong>
                              <span style="color: var(--commetns-time); font-size: 0.9rem; margin-left: 10px;">${timeString}</span>
                              <span class="trash_btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                </svg>
                              </span>
                          </div>
                          <div style="color: var(--color-main); margin-top: 5px;">${review.comment}</div>
                          <div>
                            <button class="like_btn">
                            <img src="public/src/svg/like.svg" alt="Like Icon" />
                             ${review.likes}
                             </button>
                            <button class="dislike_btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-thumbs-down" viewBox="0 0 16 16">
                              <path d="M8.864 15.674c-.956.24-1.843-.484-1.908-1.42-.072-1.05-.23-2.015-.428-2.59-.125-.36-.479-1.012-1.04-1.638-.557-.624-1.282-1.179-2.131-1.41C2.685 8.432 2 7.85 2 7V3c0-.845.682-1.464 1.448-1.546 1.07-.113 1.564-.415 2.068-.723l.048-.029c.272-.166.578-.349.97-.484C6.931.08 7.395 0 8 0h3.5c.937 0 1.599.478 1.934 1.064.164.287.254.607.254.913 0 .152-.023.312-.077.464.201.262.38.577.488.9.11.33.172.762.004 1.15.069.13.12.268.159.403.077.27.113.567.113.856s-.036.586-.113.856c-.035.12-.08.244-.138.363.394.571.418 1.2.234 1.733-.206.592-.682 1.1-1.2 1.272-.847.283-1.803.276-2.516.211a10 10 0 0 1-.443-.05 9.36 9.36 0 0 1-.062 4.51c-.138.508-.55.848-1.012.964zM11.5 1H8c-.51 0-.863.068-1.14.163-.281.097-.506.229-.776.393l-.04.025c-.555.338-1.198.73-2.49.868-.333.035-.554.29-.554.55V7c0 .255.226.543.62.65 1.095.3 1.977.997 2.614 1.709.635.71 1.064 1.475 1.238 1.977.243.7.407 1.768.482 2.85.025.362.36.595.667.518l.262-.065c.16-.04.258-.144.288-.255a8.34 8.34 0 0 0-.145-4.726.5.5 0 0 1 .595-.643h.003l.014.004.058.013a9 9 0 0 0 1.036.157c.663.06 1.457.054 2.11-.163.175-.059.45-.301.57-.651.107-.308.087-.67-.266-1.021L12.793 7l.353-.354c.043-.042.105-.14.154-.315.048-.167.075-.37.075-.581s-.027-.414-.075-.581c-.05-.174-.111-.273-.154-.315l-.353-.354.353-.354c.047-.047.109-.176.005-.488a2.2 2.2 0 0 0-.505-.804l-.353-.354.353-.354c.006-.005.041-.05.041-.17a.9.9 0 0 0-.121-.415C12.4 1.272 12.063 1 11.5 1"/>
                            </svg>
                            ${review.dislikes}
                            </button>
                          </div>
                      </div>
                  </div>
              `
        // Event handler for the delete icon
        const deleteButton = reviewElement.querySelector('.trash_btn')
        deleteButton.addEventListener('click', function () {
          const moderatorCode = prompt('Введите код модератора для удаления комментария:')
          if (moderatorCode) {
            const confirmDelete = confirm('Вы уверены, что хотите удалить этот комментарий?')
            if (confirmDelete) {
              console.log(`Deleting comment with data: ${review.data}, code: ${moderatorCode}`)
              fetch(`/comments/${review.data}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code: moderatorCode }) // Отправляем код в теле запроса
              })
                .then(response => {
                  if (response.ok) {
                    reviewsList.removeChild(reviewElement)
                    alert('Комментарий удален успешно')
                  } else if (response.status === 403) {
                    alert('Неправильный код модератора. Попробуйте еще раз.')
                  } else {
                    alert('Ошибка: ' + response.statusText)
                  }
                })
            }
          }
        })

        // Обработчик лайков
        const likeButton = reviewElement.querySelector('.like_btn')
        likeButton.addEventListener('click', function () {
          fetch(`/comments/${review.data}/like`, { method: 'POST' })
            .then((res) => res.json())
            .then((updatedLikes) => {
              likeButton.innerHTML = `👍 ${updatedLikes.likes}`
            })
        })

        // Обработчик дизлайков
        const dislikeButton = reviewElement.querySelector('.dislike_btn')
        dislikeButton.addEventListener('click', function () {
          fetch(`/comments/${review.data}/dislike`, { method: 'POST' })
            .then((res) => res.json())
            .then((updatedDislikes) => {
              dislikeButton.innerHTML = `👎 ${updatedDislikes.dislikes}`
            })
        })

        reviewsList.appendChild(reviewElement)
      })
    })
})

function openProject(project) {
  const modal = document.getElementById('project-modal')
  const title = document.getElementById('modal-title')
  const description = document.getElementById('modal-description')
  const author = document.getElementById('modal-author')
  const image = document.getElementById('modal-image')

  const currentLang = currentLanguage || localStorage.getItem('language')

  fetch('public/database/project.json')
    .then(response => response.json())
    .then(data => {
      const projectData = data[project]

      title.textContent = projectData.title[currentLang]
      description.textContent = projectData.description[currentLang]
      author.textContent = projectData.author[currentLang]
      image.src = projectData.image

      modal.style.display = 'block'
    })
}

function closeModal() {
  const modal = document.getElementById('project-modal')
  modal.style.display = 'none'
}

document.onkeydown = function (evt) {
  if (evt.key === 'Escape') {
    closeModal()
  }
}