# Numi Prototype

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
* Help text for all blocks. All blocks should have a short help bit, like Validate Clinic Code and Weeks Until Due, using a double button: `( block_name | ? )`. The `?` shows a help block that can be hidden using an `×` in the top right, or by clicking the `?` part of the button again.
* Showing preview of linked collections is tricky. Some ideas, to be placed in a header / footer of each collection, on the dashboard: a list of links; a button-y list of links; use an accordion to make it visually cleaner. [quick mock-up](https://trello-attachments.s3.amazonaws.com/55a8eee78fd1ef63c610d001/2560x1240/607b529d4966bf7cb6ad4befe3c2b472/linked-collections.png). Microcopy needs work!


