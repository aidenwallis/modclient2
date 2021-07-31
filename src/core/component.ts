export class Component<T extends HTMLElement = HTMLElement> {
  private children: Component<HTMLElement>[] = [];
  private className_ = "";
  private element: T;
  private mountCallback?: () => void;
  private unmountCallback?: () => void;

  public constructor(t: keyof HTMLElementTagNameMap) {
    this.element = document.createElement(t) as T;
  }

  public static create<T extends HTMLElement = HTMLElement>(
    t: keyof HTMLElementTagNameMap
  ) {
    return new Component<T>(t);
  }

  public mount() {
    this.mountCallback?.();
  }

  public ref() {
    return this.element;
  }

  public get className() {
    return this.className_;
  }

  public setClassName(cn: string) {
    this.className_ = cn;
    this.element.className = cn;
    return this;
  }

  public onClick(handler: (event: MouseEvent) => void) {
    this.element.onclick = handler;
    return this;
  }

  // this is the only css property that should be modifiable per component
  // if you need to modify another, use scss
  public setColor(color: string) {
    this.element.style.color = color;
    return this;
  }

  public setText(text: string) {
    this.element.textContent = text;
    return this;
  }

  public getChildren() {
    return this.children;
  }

  public addChild(component: Component) {
    this.children.push(component);
    this.element.append(component.element);
    component.mount();
    return this;
  }

  public src(src: string) {
    this.element.setAttribute("src", src);
    return this;
  }

  public data(key: string, value: string) {
    this.element.dataset[key] = value;
    return this;
  }

  public removeAllChildren() {
    while (this.children.length) {
      this.removeChild(0);
    }
  }

  public removeChild(index: number) {
    const el = this.children[index];
    if (!el) {
      return this;
    }
    el.unmount();
    this.children.splice(index, 1);
    this.element.removeChild(el.element);
    return this;
  }

  public unmount() {
    for (let i = 0; i < this.children.length; ++i) {
      this.children[i].unmount();
    }
    this.unmountCallback?.();
    return this;
  }

  public onMount(cb: () => void) {
    this.mountCallback = cb;
    return this;
  }

  public onUnmount(cb: () => void) {
    this.unmountCallback = cb;
    return this;
  }

  public onKeydown(cb: (event: KeyboardEvent) => void) {
    this.element.onkeydown = cb;
    return this;
  }

  public placeholder(text: string) {
    this.element.setAttribute("placeholder", text);
    return this;
  }
}
