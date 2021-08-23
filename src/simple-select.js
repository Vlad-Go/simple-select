import './scss/style.scss';

const css = ($el, styles = {}) => {
  Object.keys(styles).forEach((key)=>{
    $el.style[key] = styles[key];
  });
}
const createNode = (tag, className, styles, {place, content} = {}) => {
  const $node = document.createElement(tag);
  if(typeof className == "string") $node.className = className;
  if(typeof styles == "object" && styles !==null) css($node, styles);
  content && $node.insertAdjacentHTML(place,content);
  return $node;
}

const fadeIn= ($el, itemHeightFunc) =>{
  css($el, {display: 'block', opacity: '0'});
  setTimeout(()=>{
    css($el, {height: itemHeightFunc()});
  },0);
  setTimeout(()=>{
    css($el, {opacity: '1'});
  },0);
}
const fadeOut= ($el, animTime) =>{
  css($el, {opacity: '0'});
  setTimeout(()=>{
    css($el, {display: 'none'});
  },animTime);
}
const slideDown= ($el, itemHeightFunc) =>{
  css($el, {display: 'block', height: '0'});
  let itemHeight = itemHeightFunc();
  setTimeout(()=> css($el, {height: '0'}),0);
  setTimeout(()=> css($el, {height: `${itemHeight}`}),0);
}
const slideUp= ($el, animTime) =>{
  css($el, {height: '0'});
  setTimeout(()=>{
    css($el, {display: 'none'});
  },animTime);
}

class SimpleSelect {
  constructor($el, {className, icon, animation, animTime, optionToShow}) {
    this.className = className || 'simple-select';
    this.icon = icon || '<svg viewBox="0 0 492 492" width="13px" xmlns="http://www.w3.org/2000/svg"><path d="M484.13 124.99l-16.116-16.228c-5.072-5.068-11.82-7.86-19.032-7.86-7.208 0-13.964 2.792-19.036 7.86l-183.84 183.85-184.05-184.05c-5.064-5.068-11.82-7.856-19.028-7.856s-13.968 2.788-19.036 7.856L7.872 124.69c-10.496 10.488-10.496 27.572 0 38.06l219.14 219.92c5.064 5.064 11.812 8.632 19.084 8.632h.084c7.212 0 13.96-3.572 19.024-8.632l218.93-219.33c5.072-5.064 7.856-12.016 7.864-19.224 0-7.212-2.792-14.068-7.864-19.128z"/></svg>';
    this.animation = animation || 'slideDown';
    this.animTime = animTime || .3;
    this.optionToShow = optionToShow || 'all';

    this.$select = $el;
    this.$options = Array.from($el.querySelectorAll('option'));

    this.selectedIndex = this._asignSelected();
    this.isOpened = false;
    this.subsribed = [];
    this.classNames = {
      selectClass: `${$el.className} ${this.className}`,
      currentClass: `${this.className}-selected`,
      iconClass: `${this.className}-icon`,
      listClass: `${this.className}-list`,
      optionClass: `${this.className}-option`
    };
    ;
  }
  _asignSelected() {
    let index;
    this.$options.forEach((o, i)=> {if(o.selected) index = i});
    return index || 0;
  }
  _calcListHeight() {
    return this.$options.reduce((acc, $o, i) => {
      if (i >= this.optionToShow && this.optionToShow !== 'all') return acc;
      return acc += $o.getBoundingClientRect().height;
    },0).toFixed(2) + 'px';
  }
  _setListHeight(){
    css(this._get('list'),{
      height: this._calcListHeight(),
    });
  }

  _addListener($el, type, func) {
    this.subsribed.push({$el, type, func});
    $el.addEventListener(type, func);
  }
  _removeListeners() {
    this.subsribed.forEach(({$el, type, func})=>{
      $el.removeEventListener(type, func);
    });
  }
  _get(elName, index){
    switch (elName) {
      case 'current':
        return this.$select.childNodes[0];
      case 'icon':
        return this.$select.childNodes[1].childNodes[0];
      case 'list':
        return this.$select.childNodes[2];
      case 'option':
        return this.$options[index];
      default:
        console.error('There is not such an element')
        break;
    }
  }


  _updateCurrentOption(newSelected) {
    const $currentOption  = this._get('current');
    const $selectedOption = this._get('option', newSelected);
    $currentOption.textContent = $selectedOption.textContent;
  }
  _updateOptionList(oldSelected, newSelected) {
    const $oldSelected = this._get('option', oldSelected);
    $oldSelected.classList.remove('selected');
    css($oldSelected, {pointerEvents: 'auto'});

    const $newSelected = this._get('option', newSelected);
    $newSelected.classList.add('selected');
    css($newSelected, {pointerEvents: 'none'}); 
  }


  _createSelect() {
    const {selectClass, currentClass, iconClass, listClass, optionClass
    } = this.classNames;

    const $customSelect = createNode(
      'div',
      selectClass,
      {
      position: 'relative',
      display: 'inline-block',
      });

    const $currentOption = createNode(
      'span',
      currentClass,
      null,
      {place: 'afterbegin', 
       content: this.$options[this.selectedIndex].textContent
      });


    const $iconWrapper = createNode(
      'span',
       iconClass,
       null,
       {place: 'afterbegin', 
       content: this.icon
       });
    this._addListener($iconWrapper, 'click', this.toggleList.bind(this));  

    let allStyle = this.optionToShow === 'all' ? { overflowY: 'hidden'} : { overflowY: 'auto'};
    const $optionsList = createNode('ul', listClass, {
      position: 'absolute',
      listStyle: 'none',
      display: 'none',
      transition: `all ${this.animTime}ms`,
      ...allStyle, /// fix
    });

    this.$options = this.$options.map(($oldOption, i) => {
      const $option = createNode(
        'li',
         `${$oldOption.className} ${optionClass}`,
         null,
         {place: 'afterbegin', 
          content: $oldOption.textContent
         });
      i === this.selectedIndex && $option.classList.add('selected');
      $option.setAttribute('data-value', $oldOption.value);

      this._addListener($option, 'click', this.choose.bind(this, i)); 
      $optionsList.append($option);
      return $option;
    });

    $customSelect.append($currentOption, $iconWrapper, $optionsList);
    return this.$select = $customSelect;
  }
  _afterRender() {
    this._addListener(document, 'click', (e)=>{
      if (!e.target.closest(`.${this.className}`) && this.isOpened) {
        this.close();
      }
    });
    if (this.optionToShow !== 'all') {
      this.$options.forEach(o=> css(o, {paddingRight : '20px'}))
      // for scrollbar
    }
  }

  render() {
    this.$select.remove();
    document.body.append(this._createSelect());
    this._afterRender();
  }
  destroy() {
    this._removeListeners();
    this.$select.remove();
  }

  choose(i) {
    if (!Number.isInteger(i)) return; 
    this._updateOptionList(this.selectedIndex, i);
    this._updateCurrentOption(i);
    this.selectedIndex = i;
    this.close();
  }
  toggleList() { this.isOpened ? this.close() : this.open(); }
  open() {
    this.isOpened = true;
    const $optionsList = this._get('list');
    const $iconWrapper = this._get('icon');

    $optionsList.classList.add('opened');

    if (this.animation === 'slideDown') {
      slideDown($optionsList, this._calcListHeight.bind(this))
    } else if (this.animation === 'fade') {
      fadeIn($optionsList, this._calcListHeight.bind(this))
    }
    css($iconWrapper, {transform: 'rotate(-180deg)'});
  }
  close() {
    this.isOpened = false;
    const $optionsList = this._get('list');
    const $iconWrapper = this._get('icon');

    $optionsList.classList.remove('opened');
    if (this.animation === 'slideDown') {
      slideUp($optionsList, this.animTime)
    } else if (this.animation === 'fade') {
      fadeOut($optionsList, this.animTime)
    }
   
    css($iconWrapper, {transform: 'rotate(0deg)'});
  }
  get currentOptionInfo() {
    return {
      index: this.selectedIndex,
      value: this.$options[this.selectedIndex].dataset.value
    };
  }
}
// ===================================


new SimpleSelect(document.querySelector('.header__select'),
{
  // className: '',        // 'simple-select'
  // icon: '',             // '<svg viewBox="0 0 492 492" width="13px" xmlns="http://www.w3.org/2000/svg"><path d="M484.13 124.99l-16.116-16.228c-5.072-5.068-11.82-7.86-19.032-7.86-7.208 0-13.964 2.792-19.036 7.86l-183.84 183.85-184.05-184.05c-5.064-5.068-11.82-7.856-19.028-7.856s-13.968 2.788-19.036 7.856L7.872 124.69c-10.496 10.488-10.496 27.572 0 38.06l219.14 219.92c5.064 5.064 11.812 8.632 19.084 8.632h.084c7.212 0 13.96-3.572 19.024-8.632l218.93-219.33c5.072-5.064 7.856-12.016 7.864-19.224 0-7.212-2.792-14.068-7.864-19.128z"/></svg>'
   optionToShow: 4,    //'all' 3 5
   animation:'slideDown',       //  'slideDown' 'fade'
   animTime: 400            // '.3'               
}).render();
