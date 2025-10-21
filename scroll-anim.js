// js/scroll-anim.js
document.addEventListener('DOMContentLoaded', ()=>{
  gsap.registerPlugin(ScrollTrigger);
  // simple parallax: move layers at different speeds
  document.querySelectorAll('.layer').forEach(layer=>{
    const speed = parseFloat(layer.dataset.speed) || 0.5;
    gsap.to(layer, {
      y: ()=> (window.innerHeight * -0.35 * speed),
      ease: 'none',
      scrollTrigger: {
        trigger: document.querySelector('.hero'),
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  });

  // subtle card reveal
  gsap.utils.toArray('.card, .master-card').forEach((el,i)=>{
    gsap.fromTo(el, {y:40, opacity:0}, {y:0, opacity:1, delay: i*0.08, duration:0.8, ease:'power3.out', scrollTrigger:{trigger:el, start:'top 90%'}});
  });

  // hero title parallax 3D tilt on mouse for depth illusion
  const hero = document.querySelector('.hero-inner');
  hero?.addEventListener('mousemove', (e)=>{
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to('.hero-inner', { rotationY: x*6, rotationX: -y*6, transformPerspective:800, transformOrigin:'center', ease:'power3.out', duration:0.6 });
  });
  hero?.addEventListener('mouseleave', ()=> gsap.to('.hero-inner', {rotationY:0, rotationX:0, duration:0.8}));
});
