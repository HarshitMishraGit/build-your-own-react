## Add pragma to get babel implement custom react method for create element

What is pragma 
Custom Function:

A pragma allows you to specify a custom function that will be used instead of React.createElement to create virtual DOM elements.
Comment Directive:
Pragmas are typically defined as a comment at the top of a file, such as /** @jsx myCreateElement */.

```
/** @jsx CustomReact.createElement */
const element = (
  <div id="foo">
    <a>bar</a>
    <b />
  </div>
);
```

## Start the server

- It will start the server on the localhost:3000 on the local browser


```
npm run start
```