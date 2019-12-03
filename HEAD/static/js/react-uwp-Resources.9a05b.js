webpackJsonp([58],{124:function(t,e,o){"use strict";function r(t){var e=t.context.theme,o=t.props.style;return{root:(0,e.prefixStyle)(i(i(i({padding:20,height:"100%",display:"flex"},p.default(4,c(e.baseHigh).setAlpha(.025).toRgbString(),"transparent")),{flexDirection:"column",alignItems:"center",justifyContent:"center"}),o)),category:{margin:"80px 0"}}}var n=this&&this.__extends||function(){var t=function(e,o){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o])})(e,o)};return function(e,o){function r(){this.constructor=e}t(e,o),e.prototype=null===o?Object.create(o):(r.prototype=o.prototype,new r)}}(),i=this&&this.__assign||function(){return i=Object.assign||function(t){for(var e,o=1,r=arguments.length;o<r;o++){e=arguments[o];for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])}return t},i.apply(this,arguments)},l=this&&this.__rest||function(t,e){var o={};for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&e.indexOf(r)<0&&(o[r]=t[r]);if(null!=t&&"function"==typeof Object.getOwnPropertySymbols)for(var n=0,r=Object.getOwnPropertySymbols(t);n<r.length;n++)e.indexOf(r[n])<0&&Object.prototype.propertyIsEnumerable.call(t,r[n])&&(o[r[n]]=t[r[n]]);return o};Object.defineProperty(e,"__esModule",{value:!0});var s=o(0),a=o(3),c=o(6),p=o(39),u=o(352),h=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return n(e,t),e.prototype.render=function(){var t=this.props,e=(t.renderContentHeight,l(t,["renderContentHeight"]),this.context.theme,r(this));return s.createElement("div",{style:e.root},s.createElement(u.default,{style:e.category,title:"DSIGN TOOLKITS",description:"These toolkits provide controls and layout templates for designing UWP apps.",links:[{title:"Adobe XD toolkit",link:"https://aka.ms/adobexdtoolkit"},{title:"Adobe Illustrator toolkit",link:"https://aka.ms/adobeillustratortoolkit"},{title:"Adobe Photoshop toolkit",link:"https://aka.ms/adobephotoshoptoolkit"},{title:"Framer toolkit (on GitHub)",link:"https://aka.ms/framertoolkit"},{title:"Sketch toolkit",link:"https://aka.ms/sketchtoolkit"}]}),s.createElement(u.default,{style:e.category,leftTopStart:!0,title:"FONTS",links:[{title:"Segoe UI and MDL2 icon fonts",link:"https://aka.ms/SegoeFonts"},{title:"Hololens icon font",link:"https://aka.ms/hololensiconfont"}]}),s.createElement(u.default,{style:e.category,title:"TOOLS",description:"Tile and icon generator for Adobe Photoshop",links:[{title:"Download the tile and icon generator",link:"http://go.microsoft.com/fwlink/p/?LinkId=760394"}]}))},e.defaultProps={},e.contextTypes={theme:a.object},e}(s.Component);e.default=h},352:function(t,e,o){"use strict";function r(t){var e=t.context.theme,o=t.props.style;return{root:(0,e.prefixStyle)(i({display:"flex",flexDirection:"column",alignItems:"center",fontWeight:"lighter",color:e.accent,textAlign:"center"},o)),title:{fontSize:64,lineHeight:1,fontWeight:"lighter"},description:{fontSize:14,margin:10}}}var n=this&&this.__extends||function(){var t=function(e,o){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o])})(e,o)};return function(e,o){function r(){this.constructor=e}t(e,o),e.prototype=null===o?Object.create(o):(r.prototype=o.prototype,new r)}}(),i=this&&this.__assign||function(){return i=Object.assign||function(t){for(var e,o=1,r=arguments.length;o<r;o++){e=arguments[o];for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])}return t},i.apply(this,arguments)},l=this&&this.__rest||function(t,e){var o={};for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&e.indexOf(r)<0&&(o[r]=t[r]);if(null!=t&&"function"==typeof Object.getOwnPropertySymbols)for(var n=0,r=Object.getOwnPropertySymbols(t);n<r.length;n++)e.indexOf(r[n])<0&&Object.prototype.propertyIsEnumerable.call(t,r[n])&&(o[r[n]]=t[r[n]]);return o};Object.defineProperty(e,"__esModule",{value:!0});var s=o(0),a=o(3),c=o(353),p=o(354),u=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return n(e,t),e.prototype.render=function(){var t=this.props,e=t.title,o=t.description,n=t.links,a=t.leftTopStart,u=t.dotSize,h=t.borderWidth,f=t.hoveredBorderWidth,d=l(t,["title","description","links","leftTopStart","dotSize","borderWidth","hoveredBorderWidth"]),y=(this.context.theme,r(this));return s.createElement("div",i({},d,{style:y.root}),e&&s.createElement(c.default,i({},{leftTopStart:a,dotSize:u,borderWidth:h,hoveredBorderWidth:f}),s.createElement("h5",{style:y.title},e)),o?s.createElement("p",{style:y.description},o):null,s.createElement("div",{style:{margin:10}},n&&n.map(function(t,e){return s.createElement(p.default,i({style:{margin:4}},t,{key:""+e}))})))},e.defaultProps={},e.contextTypes={theme:a.object},e}(s.Component);e.default=u},353:function(t,e,o){"use strict";function r(t){var e=t.context.theme,o=t.props.style;return{root:(0,e.prefixStyle)(i({position:"relative",padding:"20px 40px"},o))}}var n=this&&this.__extends||function(){var t=function(e,o){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o])})(e,o)};return function(e,o){function r(){this.constructor=e}t(e,o),e.prototype=null===o?Object.create(o):(r.prototype=o.prototype,new r)}}(),i=this&&this.__assign||function(){return i=Object.assign||function(t){for(var e,o=1,r=arguments.length;o<r;o++){e=arguments[o];for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])}return t},i.apply(this,arguments)},l=this&&this.__rest||function(t,e){var o={};for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&e.indexOf(r)<0&&(o[r]=t[r]);if(null!=t&&"function"==typeof Object.getOwnPropertySymbols)for(var n=0,r=Object.getOwnPropertySymbols(t);n<r.length;n++)e.indexOf(r[n])<0&&Object.prototype.propertyIsEnumerable.call(t,r[n])&&(o[r[n]]=t[r[n]]);return o};Object.defineProperty(e,"__esModule",{value:!0});var s=o(0),a=o(3),c=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.state={},e.handleMouseEnter=function(t){e.setState({hovered:!0})},e.handleMouseLeave=function(t){e.setState({hovered:!1})},e}return n(e,t),e.prototype.render=function(){var t=this.props,e=t.children,o=t.leftTopStart,n=t.dotSize,a=t.borderWidth,c=t.hoveredBorderWidth,p=l(t,["children","leftTopStart","dotSize","borderWidth","hoveredBorderWidth"]),u=this.state.hovered,h=this.context.theme,f=r(this),d=u?0:n,y=u?"100%":"50%",b=u?"100%":"25%",v="all .125s ease-in-out",O=o?{left:0}:{right:0},g=o?{right:0}:{left:0},m=u?c:a;return s.createElement("div",i({},p,{style:f.root,onMouseEnter:this.handleMouseEnter,onMouseLeave:this.handleMouseLeave}),s.createElement("div",{style:h.prefixStyle(i(i({position:"absolute",top:0},O),{height:y,width:b,borderLeft:o?m+" solid "+h.accent:void 0,borderRight:o?void 0:m+" solid "+h.accent,borderTop:m+" solid "+h.accent,transition:v}))},s.createElement("div",{style:i(i({position:"absolute",top:0},O),{height:d,width:d,background:h.accent,transition:v})})),e,s.createElement("div",{style:i(i({position:"absolute",bottom:0},g),{height:y,width:b,borderLeft:o?void 0:m+" solid "+h.accent,borderRight:o?m+" solid "+h.accent:void 0,borderBottom:m+" solid "+h.accent,transition:v})},s.createElement("div",{style:i(i({position:"absolute",bottom:0},g),{height:d,width:d,background:h.accent,transition:v})})))},e.defaultProps={dotSize:16,borderWidth:"2px",hoveredBorderWidth:"4px"},e.contextTypes={theme:a.object},e}(s.Component);e.default=c},354:function(t,e,o){"use strict";function r(t){var e=t.context.theme,o=t.props.style;return{root:(0,e.prefixStyle)(i({display:"inline-block",fontSize:12,color:e.accent,fontWeight:"lighter",padding:"4px 20px",border:"1px solid "+e.accent,textDecoration:"none",cursor:"pointer"},o)),button:{color:e.accent,fontWeight:"lighter",fontSize:"inherit",border:"none",outline:"none",background:"none",cursor:"pointer"}}}var n=this&&this.__extends||function(){var t=function(e,o){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o])})(e,o)};return function(e,o){function r(){this.constructor=e}t(e,o),e.prototype=null===o?Object.create(o):(r.prototype=o.prototype,new r)}}(),i=this&&this.__assign||function(){return i=Object.assign||function(t){for(var e,o=1,r=arguments.length;o<r;o++){e=arguments[o];for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])}return t},i.apply(this,arguments)},l=this&&this.__rest||function(t,e){var o={};for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&e.indexOf(r)<0&&(o[r]=t[r]);if(null!=t&&"function"==typeof Object.getOwnPropertySymbols)for(var n=0,r=Object.getOwnPropertySymbols(t);n<r.length;n++)e.indexOf(r[n])<0&&Object.prototype.propertyIsEnumerable.call(t,r[n])&&(o[r[n]]=t[r[n]]);return o};Object.defineProperty(e,"__esModule",{value:!0});var s=o(0),a=o(3),c=o(8),p=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return n(e,t),e.prototype.render=function(){var t=this.props,e=t.link,o=t.title,n=l(t,["link","title"]),a=(this.context.theme,r(this));return s.createElement("a",i({},n,{href:e,style:a.root}),s.createElement("button",{style:a.button},o),s.createElement(c.default,{style:{marginLeft:4}},"Download"))},e.defaultProps={},e.contextTypes={theme:a.object},e}(s.Component);e.default=p}});