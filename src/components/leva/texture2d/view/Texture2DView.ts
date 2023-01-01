import { ClassName, NumberTextView, TextView, View } from "@tweakpane/core";

interface Config {
  name: string;
}

const className = ClassName("ckrtxt");
const textClassName = ClassName("txt");

export class Texture2DView implements View {
  public readonly element: HTMLElement;
  public readonly input: HTMLInputElement;
  public readonly ctx: CanvasRenderingContext2D;

  constructor(doc: Document, config: Config) {
    this.element = doc.createElement("div");
    this.element.classList.add(className());

    const elem = doc.createElement("div");
    elem.classList.add(className("r"));
    this.element.appendChild(elem);
    const input = doc.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", ".jpg,.png");
    elem.appendChild(input);
    this.input = input;
    elem.onclick = () => {
      input.click();
    };

    const canvas = doc.createElement("canvas");
    elem.appendChild(canvas);
    canvas.width = 60;
    canvas.height = 60;
    this.ctx = canvas.getContext("2d")!;

    const textElem = doc.createElement("div");
    textElem.classList.add(className("t"));

    const divElem = doc.createElement("div");
    divElem.classList.add(textClassName(""));
    textElem.appendChild(divElem);

    const inputElem = doc.createElement("input");
    inputElem.classList.add(textClassName("i"));
    inputElem.disabled = true;
    inputElem.value = config.name;
    divElem.appendChild(inputElem);

    this.element.appendChild(textElem);
  }
}
