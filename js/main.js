// PDF.js setup for menu preview and fullscreen modal
const pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

const menuPreview1 = document.getElementById('menu-preview-1');
const menuPreview2 = document.getElementById('menu-preview-2');
const pdfModal = document.getElementById('pdf-modal');
const pdfCanvas = document.getElementById('pdf-canvas');
const pdfClose = document.getElementById('pdf-close');
const pdfPrev = document.getElementById('pdf-prev');
const pdfNext = document.getElementById('pdf-next');
const pdfPageInfo = document.getElementById('pdf-page-info');
let pdfDoc = null;
let currentPage = 1;
const menuPdfUrl = 'docs/Menu.pdf';

// Render preview thumbnail (first page)
pdfjsLib.getDocument(menuPdfUrl).promise.then(doc => {
  // Render page 1
  // Responsive scaling for mobile and desktop
  function getResponsiveScale(unscaledViewport) {
    const isMobile = window.innerWidth < 768;
    const maxWidth = isMobile ? window.innerWidth - 32 : 1800;
    const maxHeight = isMobile ? 600 : 1200;
    return Math.min(maxWidth / unscaledViewport.width, maxHeight / unscaledViewport.height);
  }

  doc.getPage(1).then(page => {
    const unscaledViewport = page.getViewport({ scale: 1 });
    let scale = getResponsiveScale(unscaledViewport);
    const viewport = page.getViewport({ scale });
    menuPreview1.width = viewport.width;
    menuPreview1.height = viewport.height;
    page.render({ canvasContext: menuPreview1.getContext('2d'), viewport });
  });
  // Render page 2
  doc.getPage(2).then(page => {
    const unscaledViewport = page.getViewport({ scale: 1 });
    let scale = getResponsiveScale(unscaledViewport);
    const viewport = page.getViewport({ scale });
    menuPreview2.width = viewport.width;
    menuPreview2.height = viewport.height;
    page.render({ canvasContext: menuPreview2.getContext('2d'), viewport });
  });
  pdfDoc = doc;
});


menuPreview1.addEventListener('click', () => {
  window.open(menuPdfUrl, '_blank');
});
menuPreview2.addEventListener('click', () => {
  window.open(menuPdfUrl, '_blank');
});

pdfClose.addEventListener('click', () => {
  pdfModal.classList.add('hidden');
});

pdfPrev.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderPdfPage(currentPage);
  }
});

pdfNext.addEventListener('click', () => {
  if (pdfDoc && currentPage < pdfDoc.numPages) {
    currentPage++;
    renderPdfPage(currentPage);
  }
});

function renderPdfPage(pageNum) {
  pdfDoc.getPage(pageNum).then(page => {
    const viewport = page.getViewport({ scale: 2 });
    pdfCanvas.width = viewport.width;
    pdfCanvas.height = viewport.height;
    page.render({ canvasContext: pdfCanvas.getContext('2d'), viewport });
    pdfPageInfo.textContent = `Page ${pageNum} of ${pdfDoc.numPages}`;
  });
}
// Dynamically load gallery images (example placeholders)

// Use all images from Images/gallery for the gallery
const galleryImages = [
  'images/gallery/468431181_122115176972582636_6022494119773668004_n.jpg',
  'images/gallery/468555074_122115177008582636_6040879629226918345_n.jpg',
  'images/gallery/472072344_122122489874582636_3069985333112594384_n.jpg',
  'images/gallery/472447392_122122489334582636_7483567552833960415_n.jpg',
  'images/gallery/473717601_122124940580582636_9050506916174139588_n.jpg',
  'images/gallery/474445893_122125732082582636_329317650771847926_n.jpg',
  'images/gallery/474710922_122126165396582636_5512434088229919907_n.jpg',
  'images/gallery/475277879_122126741960582636_302254991805114114_n.jpg',
  'images/gallery/475300795_122126744906582636_2240562376019511685_n.jpg',
  'images/gallery/475308912_122126750054582636_5141840660237998515_n.jpg',
  'images/gallery/475418103_122126749796582636_1122217833328804956_n.jpg',
  'images/gallery/475835530_122127302822582636_4936140313440493146_n.jpg',
  'images/gallery/475933092_122127147578582636_4410654528700950964_n.jpg',
  'images/gallery/476368236_122127696116582636_5367887364485389804_n.jpg',
  'images/gallery/476557164_122128038116582636_8903568698243344858_n.jpg',
  'images/gallery/479496043_122129418212582636_7275886266694123281_n.jpg',
  'images/gallery/479524501_122129431976582636_283633904783327514_n.jpg',
  'images/gallery/480152188_122129418152582636_353991650216587103_n.jpg',
  'images/gallery/480684596_122129877188582636_7540349815614666702_n.jpg',
  'images/gallery/480733762_122131354292582636_835266244646448003_n.jpg',
  'images/gallery/481803914_122132925242582636_3479388300680135749_n.jpg',
  'images/gallery/483487098_122132928986582636_7873288503521213964_n.jpg',
  'images/gallery/483613298_122133760958582636_9059851731512813465_n.jpg',
  'images/gallery/486469981_122136219632582636_6762827340208816702_n.jpg',
  'images/gallery/486708227_122136090704582636_7818880242374761610_n.jpg',
  'images/gallery/487019267_122136049286582636_8824379956654276231_n.jpg',
  'images/gallery/487080300_122136380240582636_1990634022401154327_n.jpg',
  'images/gallery/490663360_122138988962582636_2444437905990474332_n.jpg',
  'images/gallery/491930386_122140217270582636_1228261376329330037_n.jpg',
  'images/gallery/492881151_122141526866582636_7881276749745422777_n.jpg',
  'images/gallery/493214790_122141553056582636_8064668219283063691_n.jpg'
];

const gallery = document.getElementById('gallery');
galleryImages.forEach((src, idx) => {
  const img = document.createElement('img');
  img.src = src;
  img.alt = 'Gallery photo';
  img.className = 'rounded shadow-md w-full cursor-pointer';
  img.dataset.idx = idx;
  img.addEventListener('click', () => openLightbox(idx));
  gallery.appendChild(img);
});

// Lightbox functionality
const lightboxModal = document.getElementById('lightbox-modal');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');
let currentIdx = 0;

function openLightbox(idx) {
  currentIdx = idx;
  lightboxImg.src = galleryImages[currentIdx];
  lightboxModal.classList.remove('hidden');
}

function closeLightbox() {
  lightboxModal.classList.add('hidden');
}

function showPrev() {
  currentIdx = (currentIdx - 1 + galleryImages.length) % galleryImages.length;
  lightboxImg.src = galleryImages[currentIdx];
}

function showNext() {
  currentIdx = (currentIdx + 1) % galleryImages.length;
  lightboxImg.src = galleryImages[currentIdx];
}

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', showPrev);
lightboxNext.addEventListener('click', showNext);

// Optional: close modal on background click
lightboxModal.addEventListener('click', (e) => {
  if (e.target === lightboxModal) closeLightbox();
});
