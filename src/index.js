function createElement(type, props, ...children) {
  const r = {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        return typeof child === "object" ? child : createTextElement(child);
      }),
    },
  };
  console.log(r);
  return r;
}

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function render(element, container) {
  const domElement =
    element.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type);

  Object.keys(element.props).forEach((name) => {
    if (name !== "children") {
      domElement[name] = element.props[name]; // assing all the props to the element
    }
  });

  element.props.children.forEach((child) => {
    render(child, domElement);
  });

  container.append(domElement);
}

const CustomReact = {
  createElement,
  createTextElement,
  render,
};

/** @jsx CustomReact.createElement */
const element = (
  <div id="foo">
    <a>bar</a>
    <b />
  </div>
);

const container = document.getElementById("root");
CustomReact.render(element, container);
