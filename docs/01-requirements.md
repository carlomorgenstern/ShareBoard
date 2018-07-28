# Requirements

## Functional requirements

### Users

- can register and login with a username and password
- can logout and delete their account when logged in
- have a display name and can change it
- can set their preferences globally (with a static default)
- can own and participate in whiteboard rooms
- can invite other users to rooms they own
- have specific permissions in each whiteboard room
- can join audio and video calls in a whiteboard room

### Whiteboard Rooms

- can be created and deleted by users
- have a name, which can be changed
- have an optional public invite token or link
- have a list of participants
- have one or multiple whiteboard pages
- a room owner can change the permissions of each participant in a room
- have an optional active audio and/or video call

### Whiteboard Page

- can be created or deleted by participants with the required permission
- only one whiteboard page can be shown at a time in a room
- can be drawn on
  - with multiple colors
  - with multiple stroke widths
  - with predefined shapes
  - with shape recognition of predefined shapes
- can have images imported onto them for displaying

-------------------------------------------------------------

## Non-Functional requirements

### Documentation & Readability

Because the application will be worked on by multiple groups of students independently with possible gaps of a year between projects, it is of the highest importance that it is well documented and the source code is readable and consistent in terms of style.

This is achieved with good documentation practices and the code linters "tslint" and "sass-lint".

### Extensibility

Single projects may want to extend and focus on a single part of the application during the limited time in their project, so it is important that the application is highly extensible.

This is achieved with a minimal development setup, minimization of coupling in the modules of backend and frontend and usage of standardized concepts and protocols for communication between the parts.

### Interoperability & Compatibility

To make the application easy to deploy and develop on for everyone, it needs to run on all major OS and work with multiple DBMS.

This is achieved by using a programming language and more importantly runtime - Node.js - that handles interoperability on most current OS. A database abstraction layer is implemented to enable compatibility with multiple DBMS, but currently only the MongoDB database layer is actually implemented.

### Performance / Response time

The application is only usable, if users can actually draw, see each others drawings and interact on the whiteboard in real-time or near-real-time. Therefore the delays between a user drawing and the same drawing being seen on the other users screens should be less than a second, given normal network delays.

This is achieved by using the WebSocket protocol for all near-real-time interactions.

### Open Source

To ensure that as many people as possible can use and improve this application, there need to be no license issues with Open Source dependencies or closed source or commercial dependencies that users would need to pay for.

### Security

To ensure the security of the users and their data, any personally identifiable information needs to be kept to a minimum and needs to be stored safely.

This is done by not collecting identifiable information other than the users password and by storing that in a secured manner.
