// src/lib/ericchase/WebPlatform_Node_Reference_Class.ts
class Class_WebPlatform_Node_Reference_Class {
  node;
  constructor(node) {
    this.node = node;
  }
  as(constructor_ref) {
    if (this.node instanceof constructor_ref) {
      return this.node;
    }
    throw new TypeError(`Reference node ${this.node} is not ${constructor_ref}`);
  }
  is(constructor_ref) {
    return this.node instanceof constructor_ref;
  }
  passAs(constructor_ref, fn) {
    if (this.node instanceof constructor_ref) {
      fn(this.node);
    }
  }
  tryAs(constructor_ref) {
    if (this.node instanceof constructor_ref) {
      return this.node;
    }
  }
  get classList() {
    return this.as(HTMLElement).classList;
  }
  get className() {
    return this.as(HTMLElement).className;
  }
  get style() {
    return this.as(HTMLElement).style;
  }
  getAttribute(qualifiedName) {
    return this.as(HTMLElement).getAttribute(qualifiedName);
  }
  setAttribute(qualifiedName, value) {
    this.as(HTMLElement).setAttribute(qualifiedName, value);
  }
  getStyleProperty(property) {
    return this.as(HTMLElement).style.getPropertyValue(property);
  }
  setStyleProperty(property, value, priority) {
    this.as(HTMLElement).style.setProperty(property, value, priority);
  }
}
function WebPlatform_Node_Reference_Class(node) {
  return new Class_WebPlatform_Node_Reference_Class(node);
}

// src/lib/ericchase/WebPlatform_NodeList_Reference_Class.ts
class Class_WebPlatform_NodeList_Reference_Class extends Array {
  constructor(nodes) {
    super();
    for (const node of Array.from(nodes ?? [])) {
      try {
        this.push(WebPlatform_Node_Reference_Class(node));
      } catch (_) {}
    }
  }
  as(constructor_ref) {
    return this.filter((ref) => ref.is(constructor_ref)).map((ref) => ref.as(constructor_ref));
  }
  passEachAs(constructor_ref, fn) {
    for (const ref of this) {
      ref.passAs(constructor_ref, fn);
    }
  }
}
function WebPlatform_NodeList_Reference_Class(nodes) {
  return new Class_WebPlatform_NodeList_Reference_Class(nodes);
}

// src/index.module.ts
class Comments {
  static Clean(dom) {
    for (const el of WebPlatform_NodeList_Reference_Class(dom.querySelectorAll('.user-avatar,.toolbar>*:not(.usrlike),.parent-link,.show_replies,.spacer,.sub-items,.edited,.klvl,.post-date')).as(HTMLElement)) {
      el.remove();
    }
    for (const el of WebPlatform_NodeList_Reference_Class(dom.querySelectorAll('ul')).as(HTMLElement)) {
      el.before(document.createElement('hr'));
    }
    for (const el of WebPlatform_NodeList_Reference_Class(dom.querySelectorAll('li')).as(HTMLElement)) {
      el.append(document.createElement('hr'));
      const comment_text = el.querySelector('&>div>div.comment-body>div.comment-text[data-spoiler="1"]');
      if (comment_text) {
        comment_text.textContent = '[spoiler]';
      }
    }
    for (const el of WebPlatform_NodeList_Reference_Class(dom.querySelectorAll('a')).as(HTMLElement)) {
      el.removeAttribute('href');
    }
    for (const toolbar of WebPlatform_NodeList_Reference_Class(dom.querySelectorAll('.toolbar')).as(HTMLElement)) {
      const likes = toolbar.querySelector('.like-button > span');
      const dislikes = toolbar.querySelector('.dislike-button > span');
      toolbar.replaceWith(`(likes: ${likes?.textContent ?? 0}, dislikes: ${dislikes?.textContent ?? 0})`);
    }
  }
}
