import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

// Todos los plugins de GSAP son gratuitos desde la 3.13. Registra aquí los que uses.
gsap.registerPlugin(ScrollTrigger, SplitText);

gsap.defaults({ ease: 'power3.out', duration: 0.8 });

export { gsap, ScrollTrigger, SplitText };
