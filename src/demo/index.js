import '../scss/simple-select.scss';
import SimpleSelect from '../js/simple-select'

new SimpleSelect(document.querySelector('.header__select'),
   {
      optionToShow: 4,
      animation: 'slideDown',
      animTime: 400
}).render();
