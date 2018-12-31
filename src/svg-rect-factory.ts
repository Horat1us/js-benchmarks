import * as puppeteer from "puppeteer";
import Runnable = Mocha.Runnable;
import { benchmark } from "./benchmark";

benchmark('SVG Rect Element',
    function createElementNS() {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        document.body.appendChild(svg);
        for (let i = 0; i < 100000; i++) {
            const element = document.createElementNS(svg.namespaceURI, 'rect');
            element.setAttribute('height', '1');
            element.setAttribute('width', '1');
            element.setAttribute('y', '0');
            element.setAttribute('x', '' + i * 2);
            element.setAttribute('class', "some" + Math.random());
            svg.appendChild(element);
        }
    },
    function createElementNSArray() {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        document.body.appendChild(svg);
        svg.append(...Array(100000).fill(undefined).map((_, i) => {
            const element = document.createElementNS(svg.namespaceURI, 'rect');
            element.setAttribute('height', '1');
            element.setAttribute('width', '1');
            element.setAttribute('y', '0');
            element.setAttribute('x', '' + i * 2);
            element.setAttribute('class', "some" + Math.random());
            return element;
        }));
    },
    function innerHTML() {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        document.body.appendChild(svg);
        svg.innerHTML = Array(100000)
            .fill(undefined)
            .map((_, i) => `<rect height="1" width="1" y="0" x="${i * 2}" class="some${Math.random()}"></rect>`)
            .join('');
    },
    function FactoryClass() {
        class SVGRectElementFactory {
            private readonly element = document.createElementNS(this.svg.namespaceURI, 'rect') as SVGRectElement;

            constructor(public svg: SVGElement) {
                this.element.setAttribute('height', "1");
                this.element.setAttribute('width', "1");
                this.element.setAttribute('y', "0");
            }

            create = (className: string, i: number) => {
                const element = this.element.cloneNode(false) as SVGRectElement;
                element.setAttribute('x', '' + i * 2);
                element.setAttribute('class', className);
                return this.svg.appendChild(element);
            }
        }

        const factory = new SVGRectElementFactory(document.body.appendChild(
            document.createElementNS("http://www.w3.org/2000/svg", "svg")
        ));
        Array(100000).fill("className").forEach(factory.create);
    },
    function FactoryArrayFunction() {
        const create = (svg: SVGElement) => {
            const element = document.createElementNS(svg.namespaceURI, 'rect') as SVGRectElement;
            element.setAttribute('height', '1');
            element.setAttribute('width', '1');
            element.setAttribute('y', '0');
            return (className: string, i: number) => {
                const clone = element.cloneNode(false) as SVGRectElement;
                clone.setAttribute('x', '' + i * 2);
                clone.setAttribute('class', className);
                return svg.appendChild(element);
            };
        };
        Array(100000).fill("className").forEach(create(document.body.appendChild(
            document.createElementNS("http://www.w3.org/2000/svg", "svg")
        )));
    },
);

