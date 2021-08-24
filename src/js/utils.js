export const css = ($el, styles = {}) => {
  Object.keys(styles).forEach((key)=>{
    $el.style[key] = styles[key];
  });
}
export const createNode = (tag, className, styles, {place, content} = {}) => {
  const $node = document.createElement(tag);
  if(typeof className == "string") $node.className = className;
  if(typeof styles == "object" && styles !==null) css($node, styles);
  content && $node.insertAdjacentHTML(place,content);
  return $node;
}

export const fadeIn= ($el, itemHeightFunc) =>{
  css($el, {display: 'block', opacity: '0'});
  setTimeout(()=>{
    css($el, {height: itemHeightFunc()});
  },0);
  setTimeout(()=>{
    css($el, {opacity: '1'});
  },0);
}
export const fadeOut= ($el, animTime) =>{
  css($el, {opacity: '0'});
  setTimeout(()=>{
    css($el, {display: 'none'});
  },animTime);
}
export const slideDown= ($el, itemHeightFunc) =>{
  css($el, {display: 'block', height: '0'});
  let itemHeight = itemHeightFunc();
  setTimeout(()=> css($el, {height: '0'}),0);
  setTimeout(()=> css($el, {height: `${itemHeight}`}),0);
}
export const slideUp= ($el, animTime) =>{
  css($el, {height: '0'});
  setTimeout(()=>{
    css($el, {display: 'none'});
  },animTime);
}
