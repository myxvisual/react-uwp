## Use The Flexbox in InlineStyle
Front-end developers can simply learn to use this layout.

<br />

```jsx
import * as React from "react";
import * as PropTypes from "prop-types";

export default class Mock extends React.Component<void> {
  static contextTypes = { theme: PropTypes.object };

  render() {
    const { theme } = this.context;
    const rootStyles = theme.prefixStyle({
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    })

    return (
      <div style={rootStyles} >
        Mock
      </div>
    );
  }
}
```

In the above example, we use `theme.prefixStyle` adds all available vendor prefixes.

Based on the powerful open source [inline-style-prefixer](https://github.com/rofrischmann/inline-style-prefixer).

<br />

### Here are a `Codepen` to help you learn to understand this layout.

<br />

<iframe height='265' scrolling='no' title='Flexbox playground' src='//codepen.io/enxaneta/embed/preview/adLPwv/?height=265&theme-id=dark&default-tab=result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%; height: 800px;'>See the Pen <a href='https://codepen.io/enxaneta/pen/adLPwv/'>Flexbox playground</a> by Gabi (<a href='https://codepen.io/enxaneta'>@enxaneta</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>


<br />

### Here are some useful links to learn about `Flexbox`.

[CSS3 Flexible Box - W3Schools](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)

[Using CSS Flexible Boxes - CSS | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Using_CSS_flexible_boxes)

[Flexbox - Can I use... Support tables for HTML5, CSS3, etc](http://caniuse.com/#feat=flexbox)
