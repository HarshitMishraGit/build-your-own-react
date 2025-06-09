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
  // console.log(r);
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

let nextUnitOfWork = null;

function render(element, container) {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element],
    },
  };
}

function workLoop(deadline) {
  let shouldYield = false;
  console.log(
    "working on next unit of work",
    nextUnitOfWork,
    "deadline",
    deadline
  );

  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (nextUnitOfWork) {
    /*
      requestIdleCallback() runs the function during the browser idle periods to 
      avoid impacting animations and input responses etc
    */
    requestIdleCallback(workLoop);
  } else {
    console.log("no more work to do");
  }
}

requestIdleCallback(workLoop);

function performUnitOfWork(fiber) {
  console.log("fiber", fiber);

  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom);
  }

  const elements = fiber.props.children;
  let index = 0;
  let prevSibling = null;

  while (index < elements.length) {
    const element = elements[index];

    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    };

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevSibling.nextSibling = newFiber;
    }
    prevSibling = newFiber;
    index++;
  }

  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.nextSibling) {
      return nextFiber.nextSibling;
    }
    nextFiber = nextFiber.parent;
  }
  return null;
}

function createDom(fiber) {
  const domElement =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  Object.keys(fiber.props).forEach((prop) => {
    if (prop !== "children") {
      domElement[prop] = fiber.props[prop];
    }
  });

  return domElement;
}

const CustomReact = {
  createElement,
  createTextElement,
  render,
};

/** @jsx CustomReact.createElement */
const element = (
  <div id="foo">
    <div id="child1">
      <div id="child1-1">child1-1</div>
      <a href="https://www.google.com">child1-2</a>
    </div>
    <div id="child2">child2</div>
    <div id="child3">child3</div>
  </div>
);

const container = document.getElementById("root");
CustomReact.render(element, container);
