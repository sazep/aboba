window.addEventListener('load', () => {
  document.querySelector(body-load-after).style.overflowY = "hidden"
  alert("vse ok")
  setTimeout(2000,()=>{
    document.body.style.overflowY = 'visible'
    document.querySelector(load-main).style.display = "none"
    alert("xz")
  })
})
// следить за курсоро чтоб красиво менюшки переливались
// console.clear()

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

const initOverlayCard = (cardEl) => {
  const overlayCard = document.createElement("div")
  overlayCard.classList.add("card")
  createOverlayCta(overlayCard, cardEl.lastElementChild)
  overlay.append(overlayCard)
  observer.observe(cardEl)
}

cards.forEach(initOverlayCard)
document.body.addEventListener("pointermove", applyOverlayMask)