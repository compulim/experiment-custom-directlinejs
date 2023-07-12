export default class FakeNetworkInformation extends EventTarget {
  constructor() {
    super();
  }

  #type: string = 'wifi';

  get type() {
    return this.#type;
  }

  #setType(type: string) {
    if (this.#type !== type) {
      this.#type = type;
      this.dispatchEvent(new Event('change'));
    }
  }

  goOffline() {
    this.#setType('none');
  }

  goOnline() {
    if (this.#type === 'none') {
      this.#setType('wifi');
    }
  }

  toggleType() {
    this.#setType(this.#type === 'wifi' ? 'cellular' : 'wifi');
  }
}
