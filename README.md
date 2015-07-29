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


### development

```
$ npm install
$ npm install webpack node-static -g
$ static ../ &
$ webpack -w
```

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
