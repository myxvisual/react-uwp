## Styling Components

All React-UWP components construct by **inline-style**.

### Overriding with Inline Styles

Every component provides different `style` properties.
Those properties always have a higher priority over the style used internally.
In detail:
 - A `style` property is always provided and applied to the *root* element.
 - Additional `xxxStyle` properties are provided to customize nested elements.
E.g. (`iconStyle` `hoverStyle` `activeStyle`...)

If you need to override the inline styles of an element in a component and there is not a style property available to do so, please check the [React-UWP Trello](https://trello.com/b/lrDKBog2/react-uwp-requests) and vote up the request, or see the [ROADMAP.md](https://github.com/myxvisual/react-uwp/blob/master/ROADMAP.md).

If you don’t see an existing card, please file an [issue](https://github.com/myxvisual/react-uwp/issues) in the repository.

### Example
