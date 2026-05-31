const modal = document.getElementById('imgModal');
const expandedImg = document.getElementById('expandedImg');
const closeBtn = document.querySelector('.close-btn');

function openModal(element) {
    expandedImg.src = element.src;
    expandedImg.alt = element.alt || 'Gallery image';
    modal.classList.add('open');
}

function closeModal(event) {
    if (event && event.target !== modal && event.target !== closeBtn) {
        return;
    }
    modal.classList.remove('open');
}

modal.addEventListener('click', closeModal);
closeBtn.addEventListener('click', closeModal);
