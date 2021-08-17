import './scss/style.scss';

const css = ($el, styles = {}) => {
  Object.keys(styles).forEach((key)=>{
    $el.style[key] = styles[key];
  });
}
const createNode = (tag, className, styles) => {
  const $node = document.createElement(tag);
  if(typeof className == "string") $node.className = className;
  if(typeof styles == "object")    css($node, styles);
  return $node;
}

class SimpleSelect {
  constructor($el, {className, icon}) {
    this.className = className || 'simple-select';
    this.icon = icon || '<svg viewBox="0 0 492 492" width="13px" xmlns="http://www.w3.org/2000/svg"><path d="M484.13 124.99l-16.116-16.228c-5.072-5.068-11.82-7.86-19.032-7.86-7.208 0-13.964 2.792-19.036 7.86l-183.84 183.85-184.05-184.05c-5.064-5.068-11.82-7.856-19.028-7.856s-13.968 2.788-19.036 7.856L7.872 124.69c-10.496 10.488-10.496 27.572 0 38.06l219.14 219.92c5.064 5.064 11.812 8.632 19.084 8.632h.084c7.212 0 13.96-3.572 19.024-8.632l218.93-219.33c5.072-5.064 7.856-12.016 7.864-19.224 0-7.212-2.792-14.068-7.864-19.128z"/></svg>';

    this.$select = $el;
    this.$options = Array.from($el.querySelectorAll('option'));

    this.selectedIndex = this._asignSelected();
    this.isOpened = false;
    this.subsribed = [];
    this.classNames = {
      selectClass: `${$el.className} ${this.className}`,
      selectedClass: `${this.className}-selected`,
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
    if (elName == 'current') {
      return this.$select.childNodes[0];
    } else if(elName == 'icon') {
      return this.$select.childNodes[1].childNodes[0];
    } else if(elName == 'list') {
      return this.$select.childNodes[2];
    } else if(elName == 'option') {
      return this.$options[index];
    } else {
      console.error('There is not such an element')
    }
  }

  _updateCurrentOption(i) {
    if (Number.isInteger(i)) {
      this.selectedIndex = i;
    }
    console.log(this.currentOptionInfo);

    const $currentOption  = this._get('current');
    const $selectedOption = this._get('option', this.selectedIndex);
    $currentOption.textContent = $selectedOption.textContent;
    $selectedOption.classList.add('selected');
    css($selectedOption, {pointerEvents: 'none'});
  }
  _createSelect() {
    const {
      selectClass,currentClass, iconClass, listClass, optionClass
    } = this.classNames;

    const $customSelect = createNode('div',selectClass,
      {
      position: 'relative',
      display: 'inline-block'
      });

    const $currentOption = createNode('span',currentClass);

    const $iconWrapper = createNode('span', iconClass);
    $iconWrapper.insertAdjacentHTML('afterbegin', this.icon);
    this._addListener($iconWrapper, 'click', this.toggleList.bind(this));

    const $optionsList = createNode('ul', listClass, {
      position: 'absolute',
      listStyle: 'none',
      overflowY: 'hidden',
      height: '0px'
    });

    this.$options = this.$options.map((option, i) => {
      const $option = createNode('li', `${option.className} ${optionClass}`);
      $option.setAttribute('data-value', option.value);
      $option.insertAdjacentHTML('afterbegin', option.textContent);
      this._addListener($option, 'click', this.choose.bind(this, i));
      $optionsList.append($option);
      return $option;
    });

    // get all elements together and reasign |$select|
    $customSelect.append($currentOption, $iconWrapper, $optionsList);
    this.$select = $customSelect;
    return $customSelect;
  }
  _setupSelect() {
    this._updateCurrentOption();
    this._addListener(document, 'click', (e)=>{
      if (!e.target.closest(`.${this.className}`) && this.isOpened) {
        this.toggleList();
      }
    });
  }

  // temp methods
  render() {
    this.$select.remove();
    document.body.append(this._createSelect());
    this._setupSelect();
  }
  destroy() {
    this._removeListeners();
    this.$select.remove();
  }
  choose(i) {
    const $prevSelected = this._get('option', this.selectedIndex);
    $prevSelected.classList.remove('selected');
    css($prevSelected, {pointerEvents: 'auto'});

    this._updateCurrentOption(i);
    this.toggleList();
  }
  toggleList() {
    this.isOpened = !this.isOpened;

    const $optionsList = this._get('list');
    const $iconWrapper = this._get('icon');

    $optionsList.classList.toggle('opened');
    if ($optionsList.classList.contains('opened')) {
      css($optionsList, {
        height: `${this.$options.reduce((acc, o)=> acc + o.offsetHeight, 0)}px`
      });
      css($iconWrapper, {transform: 'rotate(-180deg)'});
    } else {
      css($optionsList, {height: '0px'});
      css($iconWrapper, {transform: 'rotate(0deg)'});
    }
  }
  get currentOptionInfo() {
    return {
      index: this.selectedIndex,
      value:this.$options[this.selectedIndex].dataset.value
    };
  }
}
// ===================================

new SimpleSelect(document.querySelector('.el'),
{
  // className: undefined,
  // icon: ''
}).render();
