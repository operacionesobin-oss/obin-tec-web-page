export const THEME_STORAGE_KEY = 'obin-theme';

export type Theme = 'light' | 'dark';

/* Se ejecuta antes de pintar, dentro de <head>, para que la primera pintura ya
   tenga el tema correcto. Sin esto la página aparece en blanco durante un
   fotograma antes de oscurecerse, que es el fallo clásico del modo oscuro.
   Va como cadena literal —no como función serializada— para que el minificador
   no renombre nada y para que no dependa de que React haya hidratado.
   `try` porque localStorage lanza en modo privado de algunos navegadores. */
export const themeInitScript = `
(function(){try{
var s=localStorage.getItem('${THEME_STORAGE_KEY}');
var d=s==='dark'||(s!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);
document.documentElement.classList.toggle('dark',d);
document.documentElement.style.colorScheme=d?'dark':'light';
}catch(e){}})();
`.replace(/\n/g, '');
