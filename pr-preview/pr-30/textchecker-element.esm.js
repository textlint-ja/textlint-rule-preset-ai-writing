var re = [
  "direction",
  // RTL support
  "boxSizing",
  "width",
  // on Chrome and IE, exclude the scrollbar, so the mirror div wraps exactly as the textarea does
  "height",
  "overflowX",
  "overflowY",
  // copy the scrollbar for IE
  "borderTopWidth",
  "borderRightWidth",
  "borderBottomWidth",
  "borderLeftWidth",
  "borderTopStyle",
  "borderRightStyle",
  "borderBottomStyle",
  "borderLeftStyle",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  // https://developer.mozilla.org/en-US/docs/Web/CSS/font
  "fontStyle",
  "fontVariant",
  "fontWeight",
  "fontStretch",
  "fontSize",
  "fontSizeAdjust",
  "lineHeight",
  "fontFamily",
  "textAlign",
  "textTransform",
  "textIndent",
  "textDecoration",
  // might not make a difference, but better be safe
  "letterSpacing",
  "wordSpacing",
  "tabSize",
  "MozTabSize"
], Re = [
  { n: "direction", v: "inherit" },
  // RTL support
  { n: "boxSizing", v: "inherit" },
  { n: "width", v: "auto" },
  { n: "height", v: "auto" },
  { n: "height", v: "auto" },
  { n: "borderTopWidth", v: "0px" },
  { n: "borderRightWidth", v: "0px" },
  { n: "borderBottomWidth", v: "0px" },
  { n: "borderLeftWidth", v: "0px" },
  { n: "borderStyle", v: "none" },
  { n: "paddingTop", v: "0px" },
  { n: "paddingRight", v: "0px" },
  { n: "paddingBottom", v: "0px" },
  { n: "paddingLeft", v: "0px" },
  { n: "marginTop", v: "0px" },
  { n: "maringRight", v: "0px" },
  { n: "maringBottom", v: "0px" },
  { n: "maringLeft", v: "0px" },
  { n: "fontStyle", v: "inherit" },
  { n: "fontVariant", v: "inherit" },
  { n: "fontWeight", v: "inherit" },
  { n: "fontStretch", v: "inherit" },
  { n: "fontSize", v: "inherit" },
  { n: "fontSizeAdjust", v: "inherit" },
  { n: "lineHeight", v: "inherit" },
  { n: "fontFamily", v: "inherit" },
  { n: "textAlign", v: "inherit" },
  { n: "textTransform", v: "inherit" },
  { n: "textIndent", v: "inherit" },
  { n: "textDecoration", v: "inherit" },
  // might not make a difference, but better be safe
  { n: "letterSpacing", v: "inherit" },
  { n: "wordSpacing", v: "inherit" },
  { n: "tabSize", v: "inherit" }
], Te = typeof window < "u", We = Te && globalThis.mozInnerScreenX != null, D = globalThis.getComputedStyle ? globalThis.getComputedStyle : function(i) {
  return i.currentStyle;
}, $;
function Oe(i) {
  var e = i && i.id || "input-textarea-caret-position-mirror-div", n = i && i.debug || !1, t = n || i && i.reuse || !1, o;
  return t && (o = document.getElementById(e)), o || (o = document.createElement("div"), o.id = e, document.body.appendChild(o), $ = void 0), o;
}
function ze() {
  var i = document.createElement("span"), e = i.style;
  e.position = "absolute", e.visibility = "hidden", e.fontSize = "100px", document.body.appendChild(i);
  var n = parseFloat(D(i).getPropertyValue("font-size"));
  return i.parentNode !== null && i.parentNode.removeChild(i), isFinite(n) ? n / 100 : 1;
}
function De(i, e, n, t) {
  var o = t && t.debug || !1, s = o || t && t.reuse || !1;
  if (s) {
    var d = t && t.forceUpdateStyle || !1;
    !d && t && !t.reuse && (d = !0);
    var c;
    if (d ? c = !1 : c = t && t.guessIfUpdateStyle || !1, c && (typeof c == "function" && !c(n) || $ === i.tagName))
      return;
    $ = i.tagName;
  } else
    $ = void 0;
  var a = n.style, u = D(i), p = i.nodeName === "INPUT";
  a.whiteSpace = "pre-wrap", p ? (!t || !t.allowInputWrap) && (a.wordWrap = "normal") : a.wordWrap = "break-word", a.position = "absolute", o || (a.visibility = "hidden"), t && t.fontZoom === !0 && (t.fontZoom = 1 / ze());
  var r = t && t.additionalStyles ? re.concat(t.additionalStyles) : re;
  r.forEach(function(l) {
    if (p && l === "lineHeight") {
      var f = u;
      if (u.lineHeight === "normal" && (a.lineHeight = "1em", a.height = u.height, f = D(n)), u.boxSizing === "border-box") {
        var h = parseInt(u.height), g = parseInt(u.paddingTop) + parseInt(u.paddingBottom) + parseInt(u.borderTopWidth) + parseInt(u.borderBottomWidth), v = g + parseInt(f.lineHeight);
        h > v ? a.lineHeight = h - g + "px" : h === v ? a.lineHeight = f.lineHeight : a.lineHeight = 0;
      } else {
        var x, m, C = 0;
        isFinite(parseFloat(f.lineHeight)) && isFinite(x = parseFloat(u.height)) ? (["borderTop", "borderBottom", "paddingTop", "paddingBottom", "marginTop", "marginBottom"].forEach(
          function(b) {
            m = parseFloat(u[b]), isFinite(m) && (C += m);
          }
        ), C === 0 ? a.lineHeight = u.height : (m = Math.max(x - C, 0), a.lineHeight = (m > 0 ? m : x) + "px")) : a[l] = f[l];
      }
    } else if (t && typeof t.fontZoom == "number" && (l === "fontSize" || l === "lineHeight")) {
      var w;
      isFinite(w = parseFloat(u[l])) ? a[l] = w * t.fontZoom + "px" : a[l] = u[l];
    } else
      a[l] = u[l];
  }), We && i.scrollHeight > parseInt(u.height) && (a.overflowY = "scroll");
}
function je() {
  $ = void 0;
}
function oe(i, e) {
  return e && e.text ? typeof e.text == "function" ? e.text(i, e) : e.text : i.value;
}
const qe = () => {
  let i = "", e = null;
  return (n) => {
    const t = n.value;
    return i === t || (i = t, e = D(n)), e;
  };
}, Ze = qe();
function Ue(i, e, n, t) {
  i.scrollLeft && (n.scrollLeft = i.scrollLeft), i.scrollTop && (n.scrollTop = i.scrollTop), i.dir && (n.dir = i.dir), t && t.additionalAttributes && t.additionalAttributes.forEach(function(u) {
    n[u] = i[u];
  });
  var o = Ze(i), s = i.nodeName === "INPUT";
  n.textContent = oe(i, t).substring(0, e), s && (!t || !t.allowInputWrap) && (n.textContent = n.textContent.replace(/\s/g, " "));
  var d = document.createElement("span");
  if (d.textContent = oe(i, t).substring(e) || ".", t.fauxId && (d.id = t.fauxId), t.forceClearFauxStyle) {
    var c = d.style;
    Re.forEach(function(u) {
      c[u.n] = u.v;
    });
  }
  n.appendChild(d);
  var a = {
    top: d.offsetTop + parseInt(o.borderTopWidth),
    left: d.offsetLeft + parseInt(o.borderLeftWidth),
    height: parseInt(o.lineHeight)
  };
  return t && t.returnHeight && (a.height = d.offsetHeight), a;
}
function se(i, e, n) {
  if (!Te)
    throw new Error("textarea-caret-position#getCaretCoordinates should only be called in a browser");
  var t = n && n.debug || !1, o = t || n && n.reuse || !1, s = Oe(n);
  De(i, e, s, n);
  var d = Ue(i, e, s, n);
  t && (s.style.backgroundColor = "#aaa", d._div = s);
  var c = n && n.returnDiv;
  return !o && !c ? (je(), document.body.removeChild(s)) : c && (d._div = s), d;
}
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const Xe = /* @__PURE__ */ new WeakMap(), R = (i) => typeof i == "function" && Xe.has(i);
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const ae = typeof window < "u" && window.customElements != null && window.customElements.polyfillWrapFlushCallback !== void 0, Ie = (i, e, n = null) => {
  for (; e !== n; ) {
    const t = e.nextSibling;
    i.removeChild(e), e = t;
  }
};
/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const S = {}, le = {};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const k = `{{lit-${String(Math.random()).slice(2)}}}`, Ee = `<!--${k}-->`, de = new RegExp(`${k}|${Ee}`), B = "$lit$";
class Je {
  constructor(e, n) {
    this.parts = [], this.element = n;
    const t = [], o = [], s = document.createTreeWalker(n.content, 133, null, !1);
    let d = 0, c = -1, a = 0;
    const { strings: u, values: { length: p } } = e;
    for (; a < p; ) {
      const r = s.nextNode();
      if (r === null) {
        s.currentNode = o.pop();
        continue;
      }
      if (c++, r.nodeType === 1) {
        if (r.hasAttributes()) {
          const l = r.attributes, { length: f } = l;
          let h = 0;
          for (let g = 0; g < f; g++)
            ce(l[g].name, B) && h++;
          for (; h-- > 0; ) {
            const g = u[a], v = Y.exec(g)[2], x = v.toLowerCase() + B, m = r.getAttribute(x);
            r.removeAttribute(x);
            const C = m.split(de);
            this.parts.push({ type: "attribute", index: c, name: v, strings: C }), a += C.length - 1;
          }
        }
        r.tagName === "TEMPLATE" && (o.push(r), s.currentNode = r.content);
      } else if (r.nodeType === 3) {
        const l = r.data;
        if (l.indexOf(k) >= 0) {
          const f = r.parentNode, h = l.split(de), g = h.length - 1;
          for (let v = 0; v < g; v++) {
            let x, m = h[v];
            if (m === "")
              x = P();
            else {
              const C = Y.exec(m);
              C !== null && ce(C[2], B) && (m = m.slice(0, C.index) + C[1] + C[2].slice(0, -B.length) + C[3]), x = document.createTextNode(m);
            }
            f.insertBefore(x, r), this.parts.push({ type: "node", index: ++c });
          }
          h[g] === "" ? (f.insertBefore(P(), r), t.push(r)) : r.data = h[g], a += g;
        }
      } else if (r.nodeType === 8)
        if (r.data === k) {
          const l = r.parentNode;
          (r.previousSibling === null || c === d) && (c++, l.insertBefore(P(), r)), d = c, this.parts.push({ type: "node", index: c }), r.nextSibling === null ? r.data = "" : (t.push(r), c--), a++;
        } else {
          let l = -1;
          for (; (l = r.data.indexOf(k, l + 1)) !== -1; )
            this.parts.push({ type: "node", index: -1 }), a++;
        }
    }
    for (const r of t)
      r.parentNode.removeChild(r);
  }
}
const ce = (i, e) => {
  const n = i.length - e.length;
  return n >= 0 && i.slice(n) === e;
}, Ye = (i) => i.index !== -1, P = () => document.createComment(""), Y = (
  // eslint-disable-next-line no-control-regex
  /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/
);
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
class ue {
  constructor(e, n, t) {
    this.__parts = [], this.template = e, this.processor = n, this.options = t;
  }
  update(e) {
    let n = 0;
    for (const t of this.__parts)
      t !== void 0 && t.setValue(e[n]), n++;
    for (const t of this.__parts)
      t !== void 0 && t.commit();
  }
  _clone() {
    const e = ae ? this.template.element.content.cloneNode(!0) : document.importNode(this.template.element.content, !0), n = [], t = this.template.parts, o = document.createTreeWalker(e, 133, null, !1);
    let s = 0, d = 0, c, a = o.nextNode();
    for (; s < t.length; ) {
      if (c = t[s], !Ye(c)) {
        this.__parts.push(void 0), s++;
        continue;
      }
      for (; d < c.index; )
        d++, a.nodeName === "TEMPLATE" && (n.push(a), o.currentNode = a.content), (a = o.nextNode()) === null && (o.currentNode = n.pop(), a = o.nextNode());
      if (c.type === "node") {
        const u = this.processor.handleTextExpression(this.options);
        u.insertAfterNode(a.previousSibling), this.__parts.push(u);
      } else
        this.__parts.push(...this.processor.handleAttributeExpressions(a, c.name, c.strings, this.options));
      s++;
    }
    return ae && (document.adoptNode(e), customElements.upgrade(e)), e;
  }
}
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const he = window.trustedTypes && trustedTypes.createPolicy("lit-html", { createHTML: (i) => i }), Ge = ` ${k} `;
class Se {
  constructor(e, n, t, o) {
    this.strings = e, this.values = n, this.type = t, this.processor = o;
  }
  /**
   * Returns a string of HTML used to create a `<template>` element.
   */
  getHTML() {
    const e = this.strings.length - 1;
    let n = "", t = !1;
    for (let o = 0; o < e; o++) {
      const s = this.strings[o], d = s.lastIndexOf("<!--");
      t = (d > -1 || t) && s.indexOf("-->", d + 1) === -1;
      const c = Y.exec(s);
      c === null ? n += s + (t ? Ge : Ee) : n += s.substr(0, c.index) + c[1] + c[2] + B + c[3] + k;
    }
    return n += this.strings[e], n;
  }
  getTemplateElement() {
    const e = document.createElement("template");
    let n = this.getHTML();
    return he !== void 0 && (n = he.createHTML(n)), e.innerHTML = n, e;
  }
}
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const Q = (i) => i === null || !(typeof i == "object" || typeof i == "function"), G = (i) => Array.isArray(i) || // eslint-disable-next-line @typescript-eslint/no-explicit-any
!!(i && i[Symbol.iterator]);
class Me {
  constructor(e, n, t) {
    this.dirty = !0, this.element = e, this.name = n, this.strings = t, this.parts = [];
    for (let o = 0; o < t.length - 1; o++)
      this.parts[o] = this._createPart();
  }
  /**
   * Creates a single part. Override this to create a differnt type of part.
   */
  _createPart() {
    return new He(this);
  }
  _getValue() {
    const e = this.strings, n = e.length - 1, t = this.parts;
    if (n === 1 && e[0] === "" && e[1] === "") {
      const s = t[0].value;
      if (typeof s == "symbol")
        return String(s);
      if (typeof s == "string" || !G(s))
        return s;
    }
    let o = "";
    for (let s = 0; s < n; s++) {
      o += e[s];
      const d = t[s];
      if (d !== void 0) {
        const c = d.value;
        if (Q(c) || !G(c))
          o += typeof c == "string" ? c : String(c);
        else
          for (const a of c)
            o += typeof a == "string" ? a : String(a);
      }
    }
    return o += e[n], o;
  }
  commit() {
    this.dirty && (this.dirty = !1, this.element.setAttribute(this.name, this._getValue()));
  }
}
class He {
  constructor(e) {
    this.value = void 0, this.committer = e;
  }
  setValue(e) {
    e !== S && (!Q(e) || e !== this.value) && (this.value = e, R(e) || (this.committer.dirty = !0));
  }
  commit() {
    for (; R(this.value); ) {
      const e = this.value;
      this.value = S, e(this);
    }
    this.value !== S && this.committer.commit();
  }
}
class j {
  constructor(e) {
    this.value = void 0, this.__pendingValue = void 0, this.options = e;
  }
  /**
   * Appends this part into a container.
   *
   * This part must be empty, as its contents are not automatically moved.
   */
  appendInto(e) {
    this.startNode = e.appendChild(P()), this.endNode = e.appendChild(P());
  }
  /**
   * Inserts this part after the `ref` node (between `ref` and `ref`'s next
   * sibling). Both `ref` and its next sibling must be static, unchanging nodes
   * such as those that appear in a literal section of a template.
   *
   * This part must be empty, as its contents are not automatically moved.
   */
  insertAfterNode(e) {
    this.startNode = e, this.endNode = e.nextSibling;
  }
  /**
   * Appends this part into a parent part.
   *
   * This part must be empty, as its contents are not automatically moved.
   */
  appendIntoPart(e) {
    e.__insert(this.startNode = P()), e.__insert(this.endNode = P());
  }
  /**
   * Inserts this part after the `ref` part.
   *
   * This part must be empty, as its contents are not automatically moved.
   */
  insertAfterPart(e) {
    e.__insert(this.startNode = P()), this.endNode = e.endNode, e.endNode = this.startNode;
  }
  setValue(e) {
    this.__pendingValue = e;
  }
  commit() {
    if (this.startNode.parentNode === null)
      return;
    for (; R(this.__pendingValue); ) {
      const n = this.__pendingValue;
      this.__pendingValue = S, n(this);
    }
    const e = this.__pendingValue;
    e !== S && (Q(e) ? e !== this.value && this.__commitText(e) : e instanceof Se ? this.__commitTemplateResult(e) : e instanceof Node ? this.__commitNode(e) : G(e) ? this.__commitIterable(e) : e === le ? (this.value = le, this.clear()) : this.__commitText(e));
  }
  __insert(e) {
    this.endNode.parentNode.insertBefore(e, this.endNode);
  }
  __commitNode(e) {
    this.value !== e && (this.clear(), this.__insert(e), this.value = e);
  }
  __commitText(e) {
    const n = this.startNode.nextSibling;
    e = e ?? "";
    const t = typeof e == "string" ? e : String(e);
    n === this.endNode.previousSibling && n.nodeType === 3 ? n.data = t : this.__commitNode(document.createTextNode(t)), this.value = e;
  }
  __commitTemplateResult(e) {
    const n = this.options.templateFactory(e);
    if (this.value instanceof ue && this.value.template === n)
      this.value.update(e.values);
    else {
      const t = new ue(n, e.processor, this.options), o = t._clone();
      t.update(e.values), this.__commitNode(o), this.value = t;
    }
  }
  __commitIterable(e) {
    Array.isArray(this.value) || (this.value = [], this.clear());
    const n = this.value;
    let t = 0, o;
    for (const s of e)
      o = n[t], o === void 0 && (o = new j(this.options), n.push(o), t === 0 ? o.appendIntoPart(this) : o.insertAfterPart(n[t - 1])), o.setValue(s), o.commit(), t++;
    t < n.length && (n.length = t, this.clear(o && o.endNode));
  }
  clear(e = this.startNode) {
    Ie(this.startNode.parentNode, e.nextSibling, this.endNode);
  }
}
class Ke {
  constructor(e, n, t) {
    if (this.value = void 0, this.__pendingValue = void 0, t.length !== 2 || t[0] !== "" || t[1] !== "")
      throw new Error("Boolean attributes can only contain a single expression");
    this.element = e, this.name = n, this.strings = t;
  }
  setValue(e) {
    this.__pendingValue = e;
  }
  commit() {
    for (; R(this.__pendingValue); ) {
      const n = this.__pendingValue;
      this.__pendingValue = S, n(this);
    }
    if (this.__pendingValue === S)
      return;
    const e = !!this.__pendingValue;
    this.value !== e && (e ? this.element.setAttribute(this.name, "") : this.element.removeAttribute(this.name), this.value = e), this.__pendingValue = S;
  }
}
class Qe extends Me {
  constructor(e, n, t) {
    super(e, n, t), this.single = t.length === 2 && t[0] === "" && t[1] === "";
  }
  _createPart() {
    return new et(this);
  }
  _getValue() {
    return this.single ? this.parts[0].value : super._getValue();
  }
  commit() {
    this.dirty && (this.dirty = !1, this.element[this.name] = this._getValue());
  }
}
class et extends He {
}
let Pe = !1;
(() => {
  try {
    const i = {
      get capture() {
        return Pe = !0, !1;
      }
    };
    window.addEventListener("test", i, i), window.removeEventListener("test", i, i);
  } catch {
  }
})();
class tt {
  constructor(e, n, t) {
    this.value = void 0, this.__pendingValue = void 0, this.element = e, this.eventName = n, this.eventContext = t, this.__boundHandleEvent = (o) => this.handleEvent(o);
  }
  setValue(e) {
    this.__pendingValue = e;
  }
  commit() {
    for (; R(this.__pendingValue); ) {
      const s = this.__pendingValue;
      this.__pendingValue = S, s(this);
    }
    if (this.__pendingValue === S)
      return;
    const e = this.__pendingValue, n = this.value, t = e == null || n != null && (e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive), o = e != null && (n == null || t);
    t && this.element.removeEventListener(this.eventName, this.__boundHandleEvent, this.__options), o && (this.__options = nt(e), this.element.addEventListener(this.eventName, this.__boundHandleEvent, this.__options)), this.value = e, this.__pendingValue = S;
  }
  handleEvent(e) {
    typeof this.value == "function" ? this.value.call(this.eventContext || this.element, e) : this.value.handleEvent(e);
  }
}
const nt = (i) => i && (Pe ? { capture: i.capture, passive: i.passive, once: i.once } : i.capture);
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
class it {
  /**
   * Create parts for an attribute-position binding, given the event, attribute
   * name, and string literals.
   *
   * @param element The element containing the binding
   * @param name  The attribute name
   * @param strings The string literals. There are always at least two strings,
   *   event for fully-controlled bindings with a single expression.
   */
  handleAttributeExpressions(e, n, t, o) {
    const s = n[0];
    return s === "." ? new Qe(e, n.slice(1), t).parts : s === "@" ? [new tt(e, n.slice(1), o.eventContext)] : s === "?" ? [new Ke(e, n.slice(1), t)] : new Me(e, n, t).parts;
  }
  /**
   * Create parts for a text-position binding.
   * @param templateFactory
   */
  handleTextExpression(e) {
    return new j(e);
  }
}
const rt = new it();
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
function ot(i) {
  let e = pe.get(i.type);
  e === void 0 && (e = {
    stringsArray: /* @__PURE__ */ new WeakMap(),
    keyString: /* @__PURE__ */ new Map()
  }, pe.set(i.type, e));
  let n = e.stringsArray.get(i.strings);
  if (n !== void 0)
    return n;
  const t = i.strings.join(k);
  return n = e.keyString.get(t), n === void 0 && (n = new Je(i, i.getTemplateElement()), e.keyString.set(t, n)), e.stringsArray.set(i.strings, n), n;
}
const pe = /* @__PURE__ */ new Map();
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const fe = /* @__PURE__ */ new WeakMap(), K = (i, e, n) => {
  let t = fe.get(e);
  t === void 0 && (Ie(e, e.firstChild), fe.set(e, t = new j(Object.assign({ templateFactory: ot }, n))), t.appendInto(e)), t.setValue(i), t.commit();
};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
typeof window < "u" && (window.litHtmlVersions || (window.litHtmlVersions = [])).push("1.3.0");
const T = (i, ...e) => new Se(i, e, "html", rt);
var ke = function() {
  var i = /* @__PURE__ */ new Set();
  return { on: function(e) {
    i.add(e);
  }, off: function(e) {
    i.delete(e);
  }, offAll: function() {
    i.clear();
  }, emit: function(e) {
    i.forEach(function(n) {
      return n(e);
    });
  } };
};
const st = (i) => {
  let e = {
    visibleTop: 0,
    visibleLeft: 0,
    visibleWidth: 0,
    visibleHeight: 0,
    rectItems: [],
    annotationItems: [],
    highlightRectIdSet: /* @__PURE__ */ new Set(),
    mouseHoverRectIdMap: /* @__PURE__ */ new Map(),
    ...i
  };
  const n = ke();
  return {
    get() {
      return e;
    },
    onChange(t) {
      n.on(t);
    },
    dispose() {
      n.offAll();
    },
    highlightRectIndexes(t) {
      e = {
        ...e,
        highlightRectIdSet: new Set(t)
      }, n.emit();
    },
    update(t) {
      e = {
        ...e,
        ...t
      }, n.emit();
    },
    clear() {
      e = {
        ...e,
        rectItems: [],
        annotationItems: [],
        highlightRectIdSet: /* @__PURE__ */ new Set(),
        mouseHoverRectIdMap: /* @__PURE__ */ new Map()
      }, n.emit();
    },
    clearHoverState() {
      e = {
        ...e,
        highlightRectIdSet: /* @__PURE__ */ new Set(),
        mouseHoverRectIdMap: /* @__PURE__ */ new Map()
      }, n.emit();
    }
  };
};
function Ne(i) {
  return i && i.__esModule && Object.prototype.hasOwnProperty.call(i, "default") ? i.default : i;
}
var q, ge;
function at() {
  return ge || (ge = 1, q = function(e, n) {
    n || (n = [0, ""]), e = String(e);
    var t = parseFloat(e, 10);
    return n[0] = t, n[1] = e.match(/[\d.\-\+]*\s*(.*)/)[1] || "", n;
  }), q;
}
var Z, me;
function lt() {
  if (me) return Z;
  me = 1;
  var i = at();
  Z = o;
  var e = t("in", document.body);
  function n(s, d) {
    var c = i(getComputedStyle(s).getPropertyValue(d));
    return c[0] * o(c[1], s);
  }
  function t(s, d) {
    var c = document.createElement("div");
    c.style.height = "128" + s, d.appendChild(c);
    var a = n(c, "height") / 128;
    return d.removeChild(c), a;
  }
  function o(s, d) {
    if (!s) return null;
    switch (d = d || document.body, s = (s + "" || "px").trim().toLowerCase(), (d === window || d === document) && (d = document.body), s) {
      case "%":
        return d.clientHeight / 100;
      case "ch":
      case "ex":
        return t(s, d);
      case "em":
        return n(d, "font-size");
      case "rem":
        return n(document.body, "font-size");
      case "vw":
        return window.innerWidth / 100;
      case "vh":
        return window.innerHeight / 100;
      case "vmin":
        return Math.min(window.innerWidth, window.innerHeight) / 100;
      case "vmax":
        return Math.max(window.innerWidth, window.innerHeight) / 100;
      case "in":
        return e;
      case "cm":
        return e / 2.54;
      case "mm":
        return e / 25.4;
      case "pt":
        return e / 72;
      case "pc":
        return e / 6;
      case "px":
        return 1;
    }
    var c = i(s);
    if (!isNaN(c[0]) && c[1]) {
      var a = o(c[1], d);
      return typeof a == "number" ? c[0] * a : null;
    }
    return null;
  }
  return Z;
}
var dt = lt();
const N = /* @__PURE__ */ Ne(dt), ct = (i, e = !1) => e ? T`<span
            style="pointer-events: none; border: 2px dotted red; position: absolute; left: ${i.left}px; top: ${i.top}px; width: ${i.width}px; height: ${i.height}px;"
        ></span>` : T`<span
            style="pointer-events: none; border-bottom: 2px dotted red; position: absolute; left: ${i.left}px; top: ${i.top}px; width: ${i.width}px; height: ${i.height}px;"
        ></span>`;
class Ve extends HTMLElement {
  constructor(e) {
    super(), this.hoverPadding = 8, this.isFocus = !1, this.isHovering = !1, this.attributeChangedCallback = (n, t, o) => {
      this[n] && (this[n] = o, n === "target" && (this.targetElement = document.querySelector(o)));
    }, this.onMouseEnter = () => {
      var n;
      this.isHovering = !0, (n = this.onEnter) == null || n.call(this);
    }, this.onMouseLeave = () => {
      var n;
      this.isHovering = !1, (n = this.onLeave) == null || n.call(this), this.resetHoverState();
    }, this.renderAnnotationMarkers = (n) => {
      const t = n.rectItems.map((o) => ct(o, n.highlightRectIdSet.has(o.id)));
      K(t, this.annotationBox);
    }, this.onFocus = () => {
      this.isFocus = !0;
    }, this.onBlur = () => {
      this.isFocus = !1;
    }, this.isHoverRectItem = (n) => !!this.store.get().mouseHoverRectIdMap.get(n.id), this.onMouseUpdate = (n) => {
      const t = this.store.get(), o = this.hoverPadding, s = t.rectItems.filter((d) => {
        const c = {
          x: n.clientX - d.boxAbsoluteX,
          y: n.clientY - d.boxAbsoluteY
        };
        return d.left - o <= c.x && d.left + d.width + o >= c.x && d.top - o <= c.y && d.top + d.height + o >= c.y;
      }).map((d) => d.id);
      t.rectItems.forEach((d) => {
        var u, p;
        const c = t.mouseHoverRectIdMap.get(d.id), a = s.includes(d.id);
        !c && a ? (u = t.annotationItems.find((r) => r.id === d.id)) == null || u.onMouseEnter({
          rectItem: d
        }) : c && !a && ((p = t.annotationItems.find((r) => r.id === d.id)) == null || p.onMouseLeave({
          rectItem: d
        })), t.mouseHoverRectIdMap.set(d.id, a);
      }), this.store.highlightRectIndexes(s);
    }, this.store = st(), this.targetElement = e == null ? void 0 : e.targetElement, this.onEnter = e == null ? void 0 : e.onEnter, this.onLeave = e == null ? void 0 : e.onLeave, this.hoverPadding = (e == null ? void 0 : e.hoverPadding) ?? 8;
  }
  static get observedAttributes() {
    return ["target", "hoverPadding"];
  }
  connectedCallback() {
    if (!this.targetElement)
      throw new Error("target element is not found");
    const n = this.attachShadow({ mode: "closed" }), t = document.createElement("div");
    t.className = "overlay", t.setAttribute(
      "style",
      "color: transparent; border: position: absolute; top: 0px; left: 0px; pointer-events: none;"
    );
    const o = document.createElement("div");
    o.className = "annotationBox", t.append(o), n.append(t), this.annotationBox = o, this.targetElement.dataset.attachedTextCheckerElement = "true", this.targetElement.addEventListener("mousemove", this.onMouseUpdate), this.targetElement.addEventListener("focus", this.onFocus), this.targetElement.addEventListener("blur", this.onBlur), this.targetElement.addEventListener("mouseenter", this.onMouseEnter), this.targetElement.addEventListener("mouseleave", this.onMouseLeave), this.store.onChange(() => {
      this.renderAnnotationMarkers(this.store.get());
    });
  }
  disconnectedCallback() {
    this.targetElement.removeEventListener("mousemove", this.onMouseUpdate), this.targetElement.removeEventListener("focus", this.onFocus), this.targetElement.removeEventListener("blur", this.onBlur), this.targetElement.removeEventListener("mouseenter", this.onMouseEnter), this.targetElement.removeEventListener("mouseleave", this.onMouseLeave);
  }
  resetAnnotations() {
    this.store.clear();
  }
  resetHoverState() {
    this.store.clearHoverState();
  }
  updateAnnotations(e) {
    const n = this.targetElement, t = window.getComputedStyle(n), s = ["box-sizing"].map((I) => `${I}: ${t.getPropertyValue(I)};`).join("");
    this.annotationBox.setAttribute(
      "style",
      `color: transparent; overflow:hidden; position: absolute; pointer-events: none; ${s}`
    );
    const d = n.offsetTop, c = n.offsetLeft, a = n.offsetHeight, u = n.clientWidth + parseInt(t.borderLeftWidth || "0", 10) + parseInt(t.borderRightWidth || "0", 10), p = t.zIndex !== null && t.zIndex !== "auto" ? +t.zIndex : 0;
    this.annotationBox.style.zIndex = `${p + 1}`, this.annotationBox.style.left = `${c}px`, this.annotationBox.style.top = `${d}px`, this.annotationBox.style.height = `${a}px`, this.annotationBox.style.width = `${u}px`;
    const r = N(t.getPropertyValue("font-size")) ?? 16.123, l = N(t.getPropertyValue("margin-top")) ?? 0, f = N(t.getPropertyValue("margin-bottom")) ?? 0, h = N(t.getPropertyValue("border-width")) ?? 0, g = N(t.getPropertyValue("padding-top")) ?? 0, v = N(t.getPropertyValue("padding-bottom")) ?? 0, x = n.getBoundingClientRect(), m = x.x, C = x.y, w = x.width, b = x.height, _ = {
      top: n.scrollTop,
      left: n.scrollLeft
    };
    this.annotationBox.scrollTop = n.scrollTop, this.annotationBox.scrollLeft = n.scrollLeft;
    const y = e.slice().reverse();
    let F = !1;
    const M = y.flatMap((I) => {
      var ee, te, ne, ie;
      if (F)
        return [];
      const Be = I.start, $e = I.end, L = se(this.targetElement, Be, {
        reuse: !0,
        returnHeight: !0,
        returnDiv: !1,
        debug: !1
      });
      if (L.top + r < _.top)
        return F = !0, [];
      const W = se(this.targetElement, $e, {
        reuse: !0,
        returnHeight: !0,
        returnDiv: !0,
        debug: !1
      });
      return L.top === W.top ? [
        {
          id: I.id,
          // left and top is visible position
          // annotationBox(textarea) also scroll with same position of actual textarea
          left: L.left - _.left,
          top: L.top - _.top,
          height: r,
          //startCoordinate.height,
          width: W.left - L.left,
          boxMarginTop: l,
          boxMarginBottom: f,
          boxBorderWidth: h,
          boxAbsoluteX: m,
          boxAbsoluteY: C,
          boxWidth: w,
          boxHeight: b,
          boxPaddingTop: g,
          boxPaddingBottom: v
        }
      ] : (
        // two line
        [
          {
            id: I.id,
            left: L.left - _.left,
            top: L.top - _.top,
            height: r,
            //startCoordinate.height,
            width: (((te = (ee = L == null ? void 0 : L._div) == null ? void 0 : ee.getBoundingClientRect()) == null ? void 0 : te.width) ?? 0) - L.left,
            boxMarginTop: l,
            boxMarginBottom: f,
            boxBorderWidth: h,
            boxAbsoluteX: m,
            boxAbsoluteY: C,
            boxWidth: w,
            boxHeight: b,
            boxPaddingTop: g,
            boxPaddingBottom: v
          },
          {
            id: I.id,
            left: -_.left,
            top: W.top - _.top,
            height: r,
            width: (((ie = (ne = L == null ? void 0 : L._div) == null ? void 0 : ne.getBoundingClientRect()) == null ? void 0 : ie.left) ?? 0) + W.left,
            boxMarginTop: l,
            boxMarginBottom: f,
            boxBorderWidth: h,
            boxAbsoluteX: m,
            boxAbsoluteY: C,
            boxWidth: w,
            boxHeight: b,
            boxPaddingTop: g,
            boxPaddingBottom: v
          }
        ]
      );
    });
    this.store.update({
      annotationItems: e,
      rectItems: M
    });
  }
}
window.customElements.get("text-checker-element") || window.customElements.define("text-checker-element", Ve);
const ut = (i) => {
  let e = {
    ...i
  };
  const n = ke();
  return {
    get() {
      return e;
    },
    onChange(t) {
      n.on(t);
    },
    dispose() {
      n.offAll();
    },
    update(t) {
      e = {
        ...e,
        ...t
      }, n.emit();
    },
    removeCardById(t) {
      var o;
      ((o = e == null ? void 0 : e.card) == null ? void 0 : o.id) === t && (e = {
        ...e,
        card: void 0
      }, n.emit());
    },
    removeAllCard() {
      e = {
        ...e,
        card: void 0
      }, n.emit();
    }
  };
};
class Ae extends HTMLElement {
  constructor(e) {
    super(), this.isHovering = !1, this.onMouseEnter = () => {
      var n;
      this.isHovering = !0, (n = this.onEnter) == null || n.call(this);
    }, this.onMouseLeave = () => {
      var n;
      this.isHovering = !1, (n = this.onLeave) == null || n.call(this);
    }, this.renderAnnotationMarkers = (n) => {
      var p, r, l, f;
      const t = n.targetRect;
      if (!t)
        return;
      if (!n.card) {
        K("", this.overlay);
        return;
      }
      const o = 16, s = n.card.message.split(/\n/)[0], d = T` <svg
            class="popup-listItem--icon"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M7.5 5.6L5 7L6.4 4.5L5 2L7.5 3.4L10 2L8.6 4.5L10 7L7.5 5.6ZM19.5 15.4L22 14L20.6 16.5L22 19L19.5 17.6L17 19L18.4 16.5L17 14L19.5 15.4ZM22 2L20.6 4.5L22 7L19.5 5.6L17 7L18.4 4.5L17 2L19.5 3.4L22 2ZM13.34 12.78L15.78 10.34L13.66 8.22L11.22 10.66L13.34 12.78ZM14.37 7.29L16.71 9.63C17.1 10 17.1 10.65 16.71 11.04L5.04 22.71C4.65 23.1 4 23.1 3.63 22.71L1.29 20.37C0.899998 20 0.899998 19.35 1.29 18.96L12.96 7.29C13.35 6.9 14 6.9 14.37 7.29Z"
            />
        </svg>`, c = [
        n.card.fixable ? {
          message: s,
          label: T`Fix it!`,
          onClick: (p = n.handlers) == null ? void 0 : p.onFixText,
          icon: d
        } : {
          message: n.card.message
        },
        ...n.card.fixable ? [
          {
            label: T`Fix
                              <span class="popup-listItem--ruleName">${n.card.messageRuleId}</span> problems`,
            onClick: (r = n.handlers) == null ? void 0 : r.onFixRule,
            icon: d
          }
        ] : [],
        ...n.card.fixable ? [
          {
            label: T`Fix all problems`,
            onClick: (l = n.handlers) == null ? void 0 : l.onFixAll,
            icon: d
          }
        ] : [],
        {
          label: T`Ignore`,
          onClick: () => {
            var h, g;
            (g = (h = n.handlers) == null ? void 0 : h.onIgnore) == null || g.call(h);
          },
          icon: T`
                    <svg
                        class="popup-listItem--icon"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M5.00299 20C5.00299 21.103 5.89999 22 7.00299 22H17.003C18.106 22 19.003 21.103 19.003 20V8H21.003V6H17.003V4C17.003 2.897 16.106 2 15.003 2H9.00299C7.89999 2 7.00299 2.897 7.00299 4V6H3.00299V8H5.00299V20ZM9.00299 4H15.003V6H9.00299V4ZM8.00299 8H17.003L17.004 20H7.00299V8H8.00299Z"
                            fill="#9095AA"
                        />
                        <path d="M9.00299 10H11.003V18H9.00299V10ZM13.003 10H15.003V18H13.003V10Z" />
                    </svg>
                `
        },
        {
          label: T`Rule <span class="popup-listItem--ruleName">${n.card.messageRuleId}</span>`,
          onClick: (f = n.handlers) == null ? void 0 : f.onSeeDocument,
          icon: T` <svg
                    class="popup-listItem--iconImage"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
                        fill="#F4F4F4"
                    />
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M8.33502 8.33504H5.39325V18.6067H18.6067V8.33504L18.6067 15.665H8.33502V8.33504Z"
                        fill="#878787"
                    />
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M5.39325 5.39326H18.6067V8.33504H13.4831V18.6067L18.6067 18.6067H5.39325L10.5168 18.6067V8.33504H5.39325V5.39326Z"
                        fill="black"
                    />
                </svg>`
        }
      ], a = T` <ul class="popoup-list" style="--padding: ${o}px">
            ${c.map((h) => {
        const g = {
          handleEvent: h.onClick
        };
        return h.message ? h.onClick ? T` <li
                            @click=${g}
                            class="popup-listItem"
                            style="--padding: ${o}px;"
                            tabindex="0"
                        >
                            <p class="popup-listItem-message">${h.message}</p>
                            <p class="popup-listItem-content">${h.icon}${h.label}</p>
                        </li>` : T` <li
                            class="popup-listItem"
                            style="--padding: ${o}px; padding-bottom: 0;"
                            tabindex="0"
                        >
                            <p class="popup-listItem-message">${h.message}</p>
                            <p class="popup-listItem-content">${h.icon}${h.label}</p>
                        </li>` : T` <li
                    @click=${g}
                    class="popup-listItem"
                    style="--padding: ${o}px;"
                    tabindex="0"
                >
                    <p class="popup-listItem-content">${h.icon}${h.label}</p>
                </li>`;
      })}
        </ul>`, u = `position: fixed; z-index: 2147483644; min-width: 300px; max-width: 800px; top: ${t.top}px; left: ${t.left - o}px;`;
      this.overlay.setAttribute("style", u), K(a, this.overlay);
    }, this.onEnter = e.onEnter, this.onLeave = e.onLeave, this.store = ut();
  }
  connectedCallback() {
    const e = this.attachShadow({ mode: "closed" }), n = document.createElement("div");
    n.className = "popup";
    const t = document.createElement("style"), o = "#F35373", s = "#9095AA";
    t.textContent = `
:root {
    --highlight-color: ${o};
    --highlight-textColor: ${s};
}
.popup {
  color: #000;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0,0,0,.2);
  padding: 0; 
}
.popoup-list {
    margin: 0;
    padding: 0 0 var(--padding) 0;
    list-style: none;
}
.popup-listItem {
    padding: var(--padding);
    cursor: pointer;
}

.popup-listItem--icon, .popup-listItem--iconImage {
    padding-right: 12px; 
    fill: ${s};
    width: 24px;
    height: 24px;
    min-height: 24px;
    min-width: 24px;
}

.popup-listItem:first-child {
    padding-top: var(--padding);
    padding-bottom: var(--padding);
}

.popup-listItem-message {
    font-size: 12px;
    margin: 0;
    padding: 0 0 6px 0;
}

.popup-listItem--ruleName {
    font-size: 12px;
    margin: 0 0.5em;
}

.popup-listItem-content {
    font-size: 16px;
    /* align icon + text */
    display: flex;
    align-items: center;
    margin: 0;
    padding: 0;
}
.popup-listItem:hover {
    color: #fff;
    background-color: ${o};
}
.popup-listItem:hover .popup-listItem--icon {
    fill: #ffffff !important;
    stroke: #ffffff !important;
}
`, this.overlay = n, this.overlay.addEventListener("mouseenter", this.onMouseEnter), this.overlay.addEventListener("mouseleave", this.onMouseLeave), e.append(t), e.append(n), this.store.onChange(() => {
      this.renderAnnotationMarkers(this.store.get());
    });
  }
  disconnectedCallback() {
    this.overlay.removeEventListener("mouseenter", this.onMouseEnter), this.overlay.removeEventListener("mouseleave", this.onMouseLeave);
  }
  updateCard({
    card: e,
    rect: n,
    handlers: t
  }) {
    this.store.update({
      card: e,
      targetRect: n,
      handlers: t
    });
  }
  dismissCard(e) {
    this.store.removeCardById(e.id);
  }
  dismissCards() {
    this.store.removeAllCard();
  }
}
window.customElements.get("textchecker-popoup-element") || window.customElements.define("textchecker-popoup-element", Ae);
var O = { exports: {} }, ve;
function ht() {
  if (ve) return O.exports;
  ve = 1;
  const i = (e, n, t = {}) => {
    if (!Number.isFinite(n))
      throw new TypeError("Expected `wait` to be a finite number");
    let o, s, d = [];
    return function(...c) {
      return new Promise((a) => {
        const u = t.leading && !s;
        clearTimeout(s), s = setTimeout(() => {
          s = null;
          const p = t.leading ? o : e.apply(this, c);
          for (a of d)
            a(p);
          d = [];
        }, n), u ? (o = e.apply(this, c), a(o)) : d.push(a);
      });
    };
  };
  return O.exports = i, O.exports.default = i, O.exports;
}
var pt = ht();
const ft = /* @__PURE__ */ Ne(pt), xe = localStorage.DEBUG ?? "", gt = xe === "*" ? xe.startsWith("@textlint") : !1, E = (...i) => {
  gt && console.log("[textchecker-element]", ...i);
}, mt = () => {
  let i = !1;
  return {
    onComposition: i,
    handleEvent: (e) => {
      e.type === "compositionend" ? i = !1 : e.type === "compositionstart" && (i = !0);
    }
  };
}, vt = (i) => {
  const e = new Ae(i);
  return document.body.append(e), e;
};
function xt(i) {
  const e = window.getComputedStyle(i);
  if (e.display === "none" || e.visibility === "hidden")
    return !1;
  const n = i.getBoundingClientRect();
  return n.height === 0 || n.width === 0 ? !1 : n.top >= 0 && n.left >= 0 && n.bottom <= (window.innerHeight || document.documentElement.clientHeight) && n.right <= (window.innerWidth || document.documentElement.clientWidth);
}
const Ct = ({
  textAreaElement: i,
  lintingDebounceMs: e,
  lintEngine: n
}) => {
  if (!i)
    return E("Can not attach. No textarea", i), () => {
    };
  if (i.readOnly)
    return E("Can not attach textarea that is readonly", i), () => {
    };
  if (i.dataset.attachedTextCheckerElement === "true")
    return E("Can not attach textarea that is already attached", i), () => {
    };
  const t = () => {
    E("dismissCards", {
      textCheckerPopup: o.isHovering,
      textChecker: s.isHovering,
      textCheckerF: s.isFocus
    }), !o.isHovering && !s.isHovering && !s.isFocus && (o.dismissCards(), s.resetHoverState());
  }, o = vt({
    onLeave() {
      t();
    }
  }), s = new Ve({
    targetElement: i,
    hoverPadding: 20,
    onLeave() {
      t();
    }
  });
  i.before(s);
  const d = mt(), c = ft(async () => {
    if (!xt(i) || d.onComposition)
      return;
    const f = i.value, h = await n.lintText({
      text: f
    });
    E("lint results", h);
    const g = async (x, m) => {
      const C = i.value;
      C === f && C !== x && (i.value = x, await a(), o.dismissCard(m));
    }, v = h.flatMap((x) => x.messages.map((m) => {
      var _;
      const C = m.range ?? ((_ = m.fix) == null ? void 0 : _.range) ?? [m.index, m.index + 1], w = {
        id: `${m.ruleId}::${C[0]}-${C[1]}`,
        message: m.message,
        messageRuleId: m.ruleId,
        fixable: !!m.fix
      };
      let b = null;
      return {
        id: `${m.ruleId}::${C[0]}-${C[1]}`,
        start: C[0],
        end: C[1],
        onMouseEnter: ({ rectItem: y }) => {
          E("annotation - onMouseEnter"), b && clearTimeout(b), o.updateCard({
            card: w,
            rect: {
              top: y.boxBorderWidth + y.boxMarginTop + y.boxPaddingTop + y.boxAbsoluteY + y.top + y.height,
              left: y.boxAbsoluteX + y.left,
              width: y.width
            },
            handlers: {
              async onFixText() {
                const F = await n.fixText({
                  text: f,
                  messages: [m]
                });
                await g(F.output, w);
              },
              async onFixAll() {
                const F = await n.fixText({
                  text: f,
                  messages: x.messages
                });
                await g(F.output, w);
              },
              async onFixRule() {
                const F = x.messages.filter(
                  (I) => I.ruleId === m.ruleId
                ), M = await n.fixText({
                  text: f,
                  messages: F
                });
                await g(M.output, w);
              },
              async onIgnore() {
                await n.ignoreText({
                  text: f,
                  message: m
                }), await a();
              },
              onSeeDocument() {
                const F = m.ruleId.includes("/") ? m.ruleId.split("/")[1] : m.ruleId;
                window.open(
                  `https://github.com/search?q=textlint ${encodeURIComponent(F)}`,
                  "_blank",
                  "noopener"
                );
              }
            }
          });
        },
        async onMouseLeave({ rectItem: y }) {
          try {
            E("annotation - onMouseLeave"), b = setTimeout(() => {
              const F = s.isHoverRectItem(y);
              E("dismiss", {
                textCheckerPopup: o.isHovering,
                isRectElementHover: F
              }), !(o.isHovering || F) && o.dismissCard(w);
            }, 500);
          } catch (F) {
            E("Abort dismiss popup", F);
          }
        }
      };
    }));
    E("annotations", v), s.updateAnnotations(v);
  }, e), a = async () => {
    try {
      await c();
    } catch (f) {
      E("update error", f), s.updateAnnotations([]);
    }
  }, u = new ResizeObserver(() => {
    E("ResizeObserver do update"), o.dismissCards(), s.resetAnnotations(), a();
  });
  u.observe(i);
  const p = () => {
    o.dismissCards(), s.resetAnnotations(), a();
  }, r = () => {
    o.dismissCards(), a();
  }, l = (f) => {
    f.relatedTarget === s || f.relatedTarget === o || o.dismissCards();
  };
  return i.addEventListener("compositionstart", d), i.addEventListener("compositionend", d), i.addEventListener("input", c), i.addEventListener("focus", r), i.addEventListener("blur", l), i.addEventListener("focusout", t), window.addEventListener("scroll", p), i.addEventListener("scroll", p), a(), () => {
    window.removeEventListener("scroll", p), i.removeEventListener("scroll", p), i.removeEventListener("compositionstart", d), i.removeEventListener("compositionend", d), i.removeEventListener("input", c), i.removeEventListener("focus", r), i.removeEventListener("blur", l), u.disconnect();
  };
};
var U = {}, H = {}, z = { exports: {} }, X, Ce;
function bt() {
  if (Ce) return X;
  Ce = 1;
  var i = 1e3, e = i * 60, n = e * 60, t = n * 24, o = t * 7, s = t * 365.25;
  X = function(p, r) {
    r = r || {};
    var l = typeof p;
    if (l === "string" && p.length > 0)
      return d(p);
    if (l === "number" && isFinite(p))
      return r.long ? a(p) : c(p);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(p)
    );
  };
  function d(p) {
    if (p = String(p), !(p.length > 100)) {
      var r = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        p
      );
      if (r) {
        var l = parseFloat(r[1]), f = (r[2] || "ms").toLowerCase();
        switch (f) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return l * s;
          case "weeks":
          case "week":
          case "w":
            return l * o;
          case "days":
          case "day":
          case "d":
            return l * t;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return l * n;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return l * e;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return l * i;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return l;
          default:
            return;
        }
      }
    }
  }
  function c(p) {
    var r = Math.abs(p);
    return r >= t ? Math.round(p / t) + "d" : r >= n ? Math.round(p / n) + "h" : r >= e ? Math.round(p / e) + "m" : r >= i ? Math.round(p / i) + "s" : p + "ms";
  }
  function a(p) {
    var r = Math.abs(p);
    return r >= t ? u(p, r, t, "day") : r >= n ? u(p, r, n, "hour") : r >= e ? u(p, r, e, "minute") : r >= i ? u(p, r, i, "second") : p + " ms";
  }
  function u(p, r, l, f) {
    var h = r >= l * 1.5;
    return Math.round(p / l) + " " + f + (h ? "s" : "");
  }
  return X;
}
var J, be;
function yt() {
  if (be) return J;
  be = 1;
  function i(e) {
    t.debug = t, t.default = t, t.coerce = u, t.disable = c, t.enable = s, t.enabled = a, t.humanize = bt(), t.destroy = p, Object.keys(e).forEach((r) => {
      t[r] = e[r];
    }), t.names = [], t.skips = [], t.formatters = {};
    function n(r) {
      let l = 0;
      for (let f = 0; f < r.length; f++)
        l = (l << 5) - l + r.charCodeAt(f), l |= 0;
      return t.colors[Math.abs(l) % t.colors.length];
    }
    t.selectColor = n;
    function t(r) {
      let l, f = null, h, g;
      function v(...x) {
        if (!v.enabled)
          return;
        const m = v, C = Number(/* @__PURE__ */ new Date()), w = C - (l || C);
        m.diff = w, m.prev = l, m.curr = C, l = C, x[0] = t.coerce(x[0]), typeof x[0] != "string" && x.unshift("%O");
        let b = 0;
        x[0] = x[0].replace(/%([a-zA-Z%])/g, (y, F) => {
          if (y === "%%")
            return "%";
          b++;
          const M = t.formatters[F];
          if (typeof M == "function") {
            const I = x[b];
            y = M.call(m, I), x.splice(b, 1), b--;
          }
          return y;
        }), t.formatArgs.call(m, x), (m.log || t.log).apply(m, x);
      }
      return v.namespace = r, v.useColors = t.useColors(), v.color = t.selectColor(r), v.extend = o, v.destroy = t.destroy, Object.defineProperty(v, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => f !== null ? f : (h !== t.namespaces && (h = t.namespaces, g = t.enabled(r)), g),
        set: (x) => {
          f = x;
        }
      }), typeof t.init == "function" && t.init(v), v;
    }
    function o(r, l) {
      const f = t(this.namespace + (typeof l > "u" ? ":" : l) + r);
      return f.log = this.log, f;
    }
    function s(r) {
      t.save(r), t.namespaces = r, t.names = [], t.skips = [];
      const l = (typeof r == "string" ? r : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
      for (const f of l)
        f[0] === "-" ? t.skips.push(f.slice(1)) : t.names.push(f);
    }
    function d(r, l) {
      let f = 0, h = 0, g = -1, v = 0;
      for (; f < r.length; )
        if (h < l.length && (l[h] === r[f] || l[h] === "*"))
          l[h] === "*" ? (g = h, v = f, h++) : (f++, h++);
        else if (g !== -1)
          h = g + 1, v++, f = v;
        else
          return !1;
      for (; h < l.length && l[h] === "*"; )
        h++;
      return h === l.length;
    }
    function c() {
      const r = [
        ...t.names,
        ...t.skips.map((l) => "-" + l)
      ].join(",");
      return t.enable(""), r;
    }
    function a(r) {
      for (const l of t.skips)
        if (d(r, l))
          return !1;
      for (const l of t.names)
        if (d(r, l))
          return !0;
      return !1;
    }
    function u(r) {
      return r instanceof Error ? r.stack || r.message : r;
    }
    function p() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    return t.enable(t.load()), t;
  }
  return J = i, J;
}
var ye;
function wt() {
  return ye || (ye = 1, function(i, e) {
    e.formatArgs = t, e.save = o, e.load = s, e.useColors = n, e.storage = d(), e.destroy = /* @__PURE__ */ (() => {
      let a = !1;
      return () => {
        a || (a = !0, console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."));
      };
    })(), e.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function n() {
      if (typeof window < "u" && window.process && (window.process.type === "renderer" || window.process.__nwjs))
        return !0;
      if (typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))
        return !1;
      let a;
      return typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator < "u" && navigator.userAgent && (a = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(a[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function t(a) {
      if (a[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + a[0] + (this.useColors ? "%c " : " ") + "+" + i.exports.humanize(this.diff), !this.useColors)
        return;
      const u = "color: " + this.color;
      a.splice(1, 0, u, "color: inherit");
      let p = 0, r = 0;
      a[0].replace(/%[a-zA-Z%]/g, (l) => {
        l !== "%%" && (p++, l === "%c" && (r = p));
      }), a.splice(r, 0, u);
    }
    e.log = console.debug || console.log || (() => {
    });
    function o(a) {
      try {
        a ? e.storage.setItem("debug", a) : e.storage.removeItem("debug");
      } catch {
      }
    }
    function s() {
      let a;
      try {
        a = e.storage.getItem("debug") || e.storage.getItem("DEBUG");
      } catch {
      }
      return !a && typeof process < "u" && "env" in process && (a = process.env.DEBUG), a;
    }
    function d() {
      try {
        return localStorage;
      } catch {
      }
    }
    i.exports = yt()(e);
    const { formatters: c } = i.exports;
    c.j = function(a) {
      try {
        return JSON.stringify(a);
      } catch (u) {
        return "[UnexpectedJSONParseError]: " + u.message;
      }
    };
  }(z, z.exports)), z.exports;
}
var we;
function Ft() {
  if (we) return H;
  we = 1;
  var i = H && H.__importDefault || function(u) {
    return u && u.__esModule ? u : { default: u };
  };
  Object.defineProperty(H, "__esModule", { value: !0 }), H.applyFixesToText = d, H.applyFixesToSourceCode = c, H.revertSourceCode = a;
  const n = (0, i(wt()).default)("textlint:source-code-fixer"), t = "\uFEFF";
  function o(u, p) {
    const r = u.line - p.line;
    return r === 0 ? u.column - p.column : r;
  }
  function s(u) {
    return JSON.parse(JSON.stringify(u));
  }
  function d(u, p) {
    const r = u.charCodeAt(0) === 65279;
    return c({
      text: u,
      hasBOM: r
    }, p).output;
  }
  function c(u, p) {
    n("Applying fixes");
    const r = u.text, l = [], f = [], h = p.slice(), g = [];
    let v = r.length, x = u.hasBOM ? t : "";
    if (h.forEach((m) => {
      m && m.fix !== void 0 ? g.push(m) : l.push(m);
    }), g.length) {
      n("Found fixes to apply"), g.sort((C, w) => w.fix.range[1] - C.fix.range[1] || w.fix.range[0] - C.fix.range[0]);
      const m = r.split("");
      return g.forEach((C) => {
        const w = C.fix;
        let b = w.range[0];
        const _ = w.range[1];
        let y = w.text;
        if (_ <= v) {
          b < 0 && (x = "", b = 0), b === 0 && y[0] === t && (x = t, y = y.slice(1));
          const F = m.splice(b, _ - b, y);
          v = b;
          const M = s(C);
          M.fix = {
            range: [b, b + y.length],
            text: F.join("")
          }, f.push(M);
        } else
          l.push(C);
      }), {
        fixed: !0,
        messages: h,
        // have order
        applyingMessages: f.reverse(),
        // have order
        remainingMessages: l.sort(o),
        // have not order
        output: x + m.join("")
      };
    } else
      return n("No fixes to apply"), {
        fixed: !1,
        messages: h,
        applyingMessages: f,
        remainingMessages: l,
        output: x + r
      };
  }
  function a(u, p) {
    n("Restore applied fixes");
    let r = u.text;
    return p.forEach((l) => {
      const f = {
        text: r,
        hasBOM: u.hasBOM
      };
      r = c(f, [l]).output;
    }), r;
  }
  return H;
}
var Fe;
function _t() {
  return Fe || (Fe = 1, function(i) {
    Object.defineProperty(i, "__esModule", { value: !0 }), i.revertSourceCode = i.applyFixesToSourceCode = i.applyFixesToText = void 0;
    var e = /* @__PURE__ */ Ft();
    Object.defineProperty(i, "applyFixesToText", { enumerable: !0, get: function() {
      return e.applyFixesToText;
    } }), Object.defineProperty(i, "applyFixesToSourceCode", { enumerable: !0, get: function() {
      return e.applyFixesToSourceCode;
    } }), Object.defineProperty(i, "revertSourceCode", { enumerable: !0, get: function() {
      return e.revertSourceCode;
    } });
  }(U)), U;
}
var Lt = /* @__PURE__ */ _t();
const _e = document.querySelector("#js-status"), V = (i) => {
  _e && (_e.textContent = i);
}, Tt = (i) => {
  let e = null;
  const n = new Promise((t) => {
    e = t;
  });
  return i.addEventListener(
    "message",
    function(t) {
      const o = t.data;
      o.command === "init" && e && e(o.metadata);
    },
    {
      once: !0
    }
  ), {
    ready() {
      return n;
    }
  };
}, Le = () => crypto.randomUUID(), It = ({ worker: i, ext: e }) => ({
  lintText: async ({ text: o }) => {
    V("linting...");
    const s = new AbortController(), d = new Promise((c, a) => {
      const u = Le();
      return i.addEventListener(
        "message",
        (p) => {
          const r = p.data;
          r.command === "error" && (!("id" in r) || r.id === u) ? a(r.error) : r.command === "lint:result" && r.id === u && c([r.result]);
        },
        { signal: s.signal }
      ), i.postMessage({
        id: u,
        command: "lint",
        text: o,
        ext: e
      });
    });
    return d.then(() => {
      V("linted");
    }).catch(() => {
      V("failed to lint");
    }).finally(() => {
      s.abort();
    }), d;
  },
  fixText: async ({
    text: o,
    message: s
  }) => {
    V("fixing...");
    const d = new AbortController(), c = new Promise((a, u) => {
      const p = Le();
      return i.addEventListener(
        "message",
        (r) => {
          const l = r.data;
          l.command === "error" && (!("id" in l) || l.id === p) ? u(l.error) : l.command === "fix:result" && l.id === p && a(l.result);
        },
        { signal: d.signal }
      ), i.postMessage({
        id: p,
        command: "fix",
        text: o,
        ruleId: s == null ? void 0 : s.ruleId,
        ext: e
      });
    });
    return c.then(() => {
      V("fixed");
    }).catch(() => {
      V("failed to fix");
    }).finally(() => {
      d.abort();
    }), c;
  }
});
function A(i) {
  return i.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
async function St(i) {
  var l, f;
  const e = new Worker(i), n = Tt(e), t = new URL(location.href).searchParams.get("text"), o = document.querySelectorAll("textarea"), s = It({ worker: e, ext: ".md" }), d = await n.ready(), c = /* @__PURE__ */ new Map(), a = (h, g) => {
    var x;
    const v = g.range ?? ((x = g == null ? void 0 : g.fix) == null ? void 0 : x.range) ?? [g.index, g.index + 1];
    return h.slice(v[0], v[1]);
  }, u = ({ text: h, message: g }) => {
    const v = c.get(g.ruleId);
    return v ? v.has(a(h, g)) : !1;
  }, p = {
    async lintText({ text: h }) {
      return (await s.lintText({ text: h })).map((v) => ({
        filePath: v.filePath,
        messages: v.messages.filter((x) => !u({ text: h, message: x }))
      }));
    },
    async fixText({ text: h, messages: g }) {
      const v = g.filter((x) => !u({ text: h, message: x }));
      return {
        output: Lt.applyFixesToText(h, v)
      };
    },
    async ignoreText({ text: h, message: g }) {
      const v = c.get(g.ruleId) ?? /* @__PURE__ */ new Set();
      return v.add(a(h, g)), c.set(g.ruleId, v), !0;
    }
  };
  o.forEach((h) => {
    t && (h.value = t), Ct({
      textAreaElement: h,
      lintingDebounceMs: 200,
      lintEngine: p
    });
  });
  const r = document.createElement("div");
  r.innerHTML = `
<h3>Script metadata</h3>
<ul>
    ${Object.entries(d).map(([h, g]) => {
    const v = (x, m) => x === "homepage" ? `<a href="${A(m)}">${A(m)}</a>` : typeof m == "object" ? `<pre>${A(JSON.stringify(m, null, 4))}</pre>` : A(m);
    return `<dt>${A(h)}</dt><dd>${v(h, g)}</dd>`;
  }).join(`
`)}
</ul>`, (l = document.querySelector("#metadata")) == null || l.append(r), (f = document.querySelector("#install")) == null || f.addEventListener("click", () => {
    window.open("textlint-worker.js", "_blank");
  });
}
export {
  St as run
};
