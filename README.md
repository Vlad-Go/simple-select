# Simple-Select
### turns pure select into custom

###### USAGE:
HTML:
```html
    <select class="header__select">
      <option class="header__select-option" value="react">React</option>
      <option class="header__select-option" value="vue">Vue</option>
      <option class="header__select-option" value="node">Lorem ipsum dolor sit amet consectet</option>
      <option class="header__select-option" value="node">Node JS</option>
      <option class="header__select-option" value="ang" selected>Angular</option>
    </select> 
```
JS:
```javascript
  const el = document.querySelector('.header__select');
  new SimpleSelect(el),
  {
    ...properties                      
  }).render();
```


##### Properties:

| Properties      | Type            |Default          |Variants           |
| ----------------|:---------------:|:---------------:|:-----------------:|
| `className:`    | string          | 'simple-select' |                   |
| `optionToShow:` |  number or 'all'| 'all'           |                   |
| `icon:`         |  string/svg     | svg icon        |                   |
| `animTime:`     |  string         |'slideDown'      |                   |
| `animation:`    | number          | 300             | 'slideDown','fade'|



##### Methods:

| Methods                  | Description                                         |
| -------------------------|:---------------------------------------------------:|
| `.open()`                | opens option list                                   | 
| `.close()`               | closes option list                                  | 
| `.toggleList()`          | toggles option list                                 | 
| `.choose(indexOfElement)`| chooses optoins from list. Requires `indexOfElement`|

##### Getters:
| Methods                   | Description                                             |
| --------------------------|:-------------------------------------------------------:|
| `.currentOptionInfo`      | returns  `{index: -optionIndex- , value: -optionValue-}`| 

 <br/>
 
 [**Codepen**](https://codepen.io/vlad-go/pen/XWMXEXX)
 <br/>
      
###### PLUGIN HTML TEMPLATE:
```html
     <div class="header__select simple-select">
        <span class="simple-select-selected">Angular</span>
        <span class="simple-select-icon">
          [icon]
        </span>
        <ul class="simple-select-list" >
          <li class="header__select-option simple-select-option" data-value="react">React</li>
          <li class="header__select-option simple-select-option" data-value="vue">Vue</li>
          <li class="header__select-option simple-select-option" data-value="node">Lorem ipsum dolor sit amet consectetur</li>
          <li class="header__select-option simple-select-option" data-value="node">Node JS</li>
          <li class="header__select-option simple-select-option selected" data-value="ang">Angular</li>
        </ul>
     </div>
```   
 <br/> <br/>