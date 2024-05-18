// Define a function to handle the header button click
function toggleBio() {
    const bio = document.querySelector('.bio');
    bio.style.display = bio.style.display === 'none' ? 'block' : 'none';
}

// Add event listener to the header button
document.querySelector('.header_btn').addEventListener('click', toggleBio);

// Anime.js animations
anime({
    targets: '.header_left h1',
    translateX: [0, 250],
    duration: 2000,
    easing: 'easeInOutExpo'
});

anime({
    targets: '.skills .section_item img',
    scale: [0.5, 1],
    duration: 2000,
    delay: anime.stagger(200, {start: 500}),
    easing: 'easeInOutElastic(1, .5)'
});

anime({
    targets: '.projects .section_item img',
    rotate: '1turn',
    duration: 2000,
    easing: 'easeInOutSine'
});

anime({
    targets: '.contacts .section_item img',
    opacity: [0, 1],
    duration: 3000,
    easing: 'easeInOutQuad',
    delay: anime.stagger(500, {start: 1000})
});
