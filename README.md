# Numi Prototype

This prototype was built to test ideas and user journeys.

Do use:

* the ideas;
* the implementations details;
* the hints contained in the popovers.

Do not use:

* the code;
* the look and feel.

Thanks! :)

[Notes from all the testing sessions](https://praekelt.hackpad.com/Numi-prototype-testing-results-rk9l1STUVu9).

## Some of the big ideas

* A block-like interface, drawing inspiration from [Scratch](https://scratch.mit.edu/), [Blockly](https://developers.google.com/blockly/), [Hopscotch](https://www.gethopscotch.com/), and many other visual programming tools.
* A simple, one thing at a time, approach that prefers linking of many small things to building few huge things. Having more linear flows that chain rather than a big spaghetti-mess diagram.
* Mobile-friendly interface: big, chunky, buttons, and sensible / sensible UI choices. (Avoid `selects`! See [Dropdowns Should be the UI of Last Resort](http://www.lukew.com/ff/entry.asp?1950) and [Why and how we ditched the good old select element](https://medium.com/@mibosc/responsive-design-why-and-how-we-ditched-the-good-old-select-element-bc190d62eff5) for some smart thinking about this).
* Try and prevent the user making errors rather than highlighting them when they happen. Have just-in-time, in-line, help rather than a big, upfront, tutorial, or pages of help docs.


## Additional features

(Not built into prototype)

* Shortcut for recently used block / step or for most frequently used (Ask / Send / Choice).
* Autocomplete for `[placeholders]`.
* Add "Back to `{{collection}}`" to all libraries.
* Scroll to position of added block (use anchors, scrollTo).
* Allow item renaming in breadcrumbs.
* Show character count.
* Drag and drop off main area to remove.
* Specify time on Schedule (UTC).
* **Don't** allow adding of a Filter inside a Filter: display "this collection already has a filter" message (like we had for events: close the Filter accordion, disabled the buttons inside, and display a message.)
* Showing preview of linked collections is tricky. Some ideas, to be placed in a header / footer of each collection, on the dashboard: a list of links; a button-y list of links; use an accordion to make it visually cleaner. [quick mock-up](https://trello-attachments.s3.amazonaws.com/55a8eee78fd1ef63c610d001/2560x1240/607b529d4966bf7cb6ad4befe3c2b472/linked-collections.png). Microcopy needs work!
* When the Numi user adds their first Ask block, have a dismissable alert after the block, saying "Add a **Save Answer** step here if you need to use this answer later."
* Move "Add a Label step to a collection and it will appear here." help text to Label accordion on Condition Library.
* Filter previews on dashboard, like we have for collections.

### development

```
$ npm install
$ npm install webpack node-static -g
$ static ../ &
$ webpack -w
```
