import {css, createNode, fadeIn, fadeOut, slideDown, slideUp} from './utils'
import {DEFAULT_CLASS_NAME ,DEFAULT_ICON , DEFAULT_ANIM_TIME,
  DEFAULT_SHOWN_OPTION, SLIDE_DOWN_ANIM, FADE_ANIM 
} from './vars'

export default class SimpleSelect {
  constructor($el, {className, icon, animation, animTime, optionToShow}) {
    this.className = className || DEFAULT_CLASS_NAME;
    this.icon = icon || DEFAULT_ICON;
    this.animation = animation || SLIDE_DOWN_ANIM;
    this.animTime = animTime || DEFAULT_ANIM_TIME;
    this.optionToShow = optionToShow || DEFAULT_SHOWN_OPTION;

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
      if (i >= this.optionToShow && this.optionToShow !== DEFAULT_SHOWN_OPTION) return acc;
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
    if (this.optionToShow !== DEFAULT_SHOWN_OPTION) {
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

    if (this.animation === SLIDE_DOWN_ANIM) {
      slideDown($optionsList, this._calcListHeight.bind(this))
    } else if (this.animation === FADE_ANIM) {
      fadeIn($optionsList, this._calcListHeight.bind(this))
    }
    css($iconWrapper, {transform: 'rotate(-180deg)'});
  }
  close() {
    this.isOpened = false;
    const $optionsList = this._get('list');
    const $iconWrapper = this._get('icon');

    $optionsList.classList.remove('opened');
    if (this.animation === SLIDE_DOWN_ANIM) {
      slideUp($optionsList, this.animTime)
    } else if (this.animation === FADE_ANIM) {
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