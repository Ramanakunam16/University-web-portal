const letsgobtnScroll = document.querySelector('.letsGo');
const librarySection = document.querySelector('.libraryFeatures');

letsgobtnScroll.addEventListener('click', () => {
  const scrollTo = librarySection.getBoundingClientRect();

  librarySection.scrollIntoView({
    behavior: 'smooth',
    inline: 'center',
  });
});
