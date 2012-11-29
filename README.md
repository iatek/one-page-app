one-page-app
============

A one page app boilerplate for Web or mobile using HTML5, Twitter Bootstrap, jQuery and Javascript on Node.js

I found a lot of great designs for single page apps, but none provided the backend functionality. This project is both,
a single page responsive UI/UX along with the backend functionality -- ready to deploy on node.js


Features
================
    - Vertical and/or horizontal scrolling page sections
    - Social media integration
    - Responsive layouts (Web and mobile) and multiple themes
    - Lightweight data store enables persistence
    - Modular functionality supports contact forms, email, user/login management
    - Easy-to-use single admin (dashboard) page to manage the entire app and content
    
Twitter Bootstrap, HTML5 UI
================
The responsive design of this single-page app is via Twitter Bootstrap. Bootstrap has been widely adopted for use in Web and mobile apps so
it's designed behave and look great in any desktop, smartphone or tablet browser. 


Node.JS, Express
================
On the backend is Node.JS 6.x with Express 2.x for the app framework and routing. Views are templated using EJS.


Persistence
================
Node-Dirty is used for lightweight data persistence. This file-based database is ideal for apps with < 1 million records, and there is no need to adapt and
connect remote data stores.

